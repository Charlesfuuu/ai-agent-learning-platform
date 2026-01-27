package com.ailearn.service;

import com.ailearn.entity.Message;
import com.ailearn.entity.Message.MessageRole;
import com.ailearn.entity.Session;
import com.ailearn.repository.MessageRepository;
import com.ailearn.repository.SessionRepository;
import dev.langchain4j.model.chat.ChatLanguageModel;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

  private final ChatLanguageModel chatModel;
  private final MessageSource messageSource;
  private final SessionRepository sessionRepository;
  private final MessageRepository messageRepository;

  // 上下文窗口大小：最多使用最近 50 条消息
  private static final int MAX_CONTEXT_MESSAGES = 50;

  @Transactional
  public String chat(String sessionId, String userMessage, Locale locale) {
    log.info("Session: {}, User message: {}, Locale: {}", sessionId, userMessage, locale);

    // 获取或创建会话
    Session session = getOrCreateSession(sessionId);

    // 构建完整提示词 (系统提示 + 历史 + 当前消息)
    String fullPrompt = buildPrompt(session, userMessage, locale);

    // 调用 LLM API
    String response = chatModel.generate(fullPrompt);

    // 保存历史
    saveHistory(session, userMessage, response);

    log.info("Response generated successfully");
    return response;
  }

  private Session getOrCreateSession(String sessionId) {
    return sessionRepository
        .findBySessionId(sessionId)
        .orElseGet(
            () -> {
              log.info("Creating new session: {}", sessionId);
              Session newSession = Session.builder().sessionId(sessionId).title("新对话").build();
              return sessionRepository.save(newSession);
            });
  }

  private String buildPrompt(Session session, String userMessage, Locale locale) {
    StringBuilder prompt = new StringBuilder();

    // 获取国际化的系统提示词
    String systemPrompt = messageSource.getMessage("service.chat.system.prompt", null, locale);
    prompt.append(systemPrompt).append("\n\n");

    // 添加历史对话 (最多最近 50 条消息)
    Slice<Message> recentMessages =
        messageRepository.findBySessionOrderBySequenceNumberDesc(
            session, PageRequest.of(0, MAX_CONTEXT_MESSAGES));

    List<Message> messages = recentMessages.getContent();
    // 反转顺序，使最早的消息在前
    for (int i = messages.size() - 1; i >= 0; i--) {
      Message msg = messages.get(i);
      String rolePrefix = msg.getRole() == MessageRole.USER ? "User" : "Assistant";
      prompt.append(rolePrefix).append(": ").append(msg.getContent()).append("\n");
    }

    // 添加当前消息
    prompt.append("User: ").append(userMessage).append("\n");
    prompt.append("Assistant: ");

    return prompt.toString();
  }

  private void saveHistory(Session session, String userMessage, String response) {
    // 获取下一个序号
    Integer maxSeq = messageRepository.findMaxSequenceNumberBySession(session);
    int nextSeq = maxSeq + 1;

    // 保存用户消息
    Message userMsg =
        Message.builder()
            .session(session)
            .role(MessageRole.USER)
            .content(userMessage)
            .sequenceNumber(nextSeq)
            .build();

    // 保存 AI 响应
    Message assistantMsg =
        Message.builder()
            .session(session)
            .role(MessageRole.ASSISTANT)
            .content(response)
            .sequenceNumber(nextSeq + 1)
            .build();

    messageRepository.saveAll(List.of(userMsg, assistantMsg));

    // 如果是首条消息，更新会话标题
    if (nextSeq == 1) {
      updateSessionTitle(session, userMessage);
    }

    log.debug("Saved messages with sequence numbers: {}, {}", nextSeq, nextSeq + 1);
  }

  private void updateSessionTitle(Session session, String firstMessage) {
    // 使用首条消息的前 30 个字符作为标题
    String title =
        firstMessage.length() > 30 ? firstMessage.substring(0, 30) + "..." : firstMessage;
    session.setTitle(title);
    sessionRepository.save(session);
    log.info("Updated session title: {}", title);
  }
}

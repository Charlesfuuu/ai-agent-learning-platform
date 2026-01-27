package com.ailearn.controller;

import com.ailearn.dto.MessageDTO;
import com.ailearn.dto.SessionDTO;
import com.ailearn.entity.Message;
import com.ailearn.entity.Session;
import com.ailearn.repository.MessageRepository;
import com.ailearn.repository.SessionRepository;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

/** 会话管理控制器 */
@Slf4j
@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SessionController {

  private final SessionRepository sessionRepository;
  private final MessageRepository messageRepository;

  /** 获取所有会话列表（按更新时间倒序） */
  @GetMapping
  public ResponseEntity<List<SessionDTO>> getAllSessions() {
    log.info("Fetching all sessions");

    List<Session> sessions = sessionRepository.findAllByOrderByUpdatedAtDesc();
    List<SessionDTO> dtos = sessions.stream().map(this::toSessionDTO).collect(Collectors.toList());

    log.info("Found {} sessions", dtos.size());
    return ResponseEntity.ok(dtos);
  }

  /** 创建新会话 */
  @PostMapping
  @Transactional
  public ResponseEntity<SessionDTO> createSession() {
    log.info("Creating new session");

    String sessionId = UUID.randomUUID().toString();
    Session session =
        Session.builder()
            .sessionId(sessionId)
            .title("新对话") // 默认标题，首条消息时会更新
            .build();

    Session saved = sessionRepository.save(session);
    log.info("Created session: {}", sessionId);

    return ResponseEntity.ok(toSessionDTO(saved));
  }

  /** 删除指定会话 */
  @DeleteMapping("/{sessionId}")
  @Transactional
  public ResponseEntity<Void> deleteSession(@PathVariable String sessionId) {
    log.info("Deleting session: {}", sessionId);

    if (!sessionRepository.existsBySessionId(sessionId)) {
      log.warn("Session not found: {}", sessionId);
      return ResponseEntity.notFound().build();
    }

    sessionRepository.deleteBySessionId(sessionId);
    log.info("Deleted session: {}", sessionId);

    return ResponseEntity.noContent().build();
  }

  /** 获取指定会话的所有消息 */
  @GetMapping("/{sessionId}/messages")
  public ResponseEntity<List<MessageDTO>> getSessionMessages(@PathVariable String sessionId) {
    log.info("Fetching messages for session: {}", sessionId);

    Session session = sessionRepository.findBySessionId(sessionId).orElse(null);
    if (session == null) {
      log.warn("Session not found: {}", sessionId);
      return ResponseEntity.notFound().build();
    }

    List<Message> messages = messageRepository.findBySessionOrderBySequenceNumberAsc(session);
    List<MessageDTO> dtos = messages.stream().map(this::toMessageDTO).collect(Collectors.toList());

    log.info("Found {} messages for session: {}", dtos.size(), sessionId);
    return ResponseEntity.ok(dtos);
  }

  /** 删除指定的消息 */
  @DeleteMapping("/messages/{messageId}")
  @Transactional
  public ResponseEntity<Void> deleteMessage(@PathVariable Long messageId) {
    log.info("Deleting message: {}", messageId);

    try {
      if (!messageRepository.existsById(messageId)) {
        log.warn("Message not found: {}", messageId);
        return ResponseEntity.notFound().build();
      }

      messageRepository.deleteById(messageId);
      log.info("Deleted message: {}", messageId);

      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      log.error("Failed to delete message: {} - {}", messageId, e.getMessage(), e);
      return ResponseEntity.internalServerError().build();
    }
  }

  /** 转换 Session 为 SessionDTO */
  private SessionDTO toSessionDTO(Session session) {
    long messageCount = messageRepository.countBySession(session);
    return SessionDTO.builder()
        .id(session.getId())
        .sessionId(session.getSessionId())
        .title(session.getTitle())
        .createdAt(session.getCreatedAt())
        .updatedAt(session.getUpdatedAt())
        .messageCount(messageCount)
        .build();
  }

  /** 转换 Message 为 MessageDTO */
  private MessageDTO toMessageDTO(Message message) {
    return MessageDTO.builder()
        .id(message.getId())
        .role(message.getRole())
        .content(message.getContent())
        .sequenceNumber(message.getSequenceNumber())
        .createdAt(message.getCreatedAt())
        .build();
  }
}

package com.ailearn.service;

import dev.langchain4j.model.chat.ChatLanguageModel;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CodeReviewService {

  private final ChatLanguageModel chatModel;
  private final MessageSource messageSource;

  public String reviewCode(String code, String language, Locale locale) {
    log.info("Reviewing {} code, length: {}, Locale: {}", language, code.length(), locale);

    // 构建国际化的代码审查提示词
    StringBuilder prompt = new StringBuilder();
    prompt
        .append(messageSource.getMessage("service.codereview.prompt.intro", null, locale))
        .append("\n\n");
    prompt
        .append(messageSource.getMessage("service.codereview.prompt.code.label", null, locale))
        .append("\n");
    prompt.append("```java\n").append(code).append("\n```\n\n");
    prompt
        .append(messageSource.getMessage("service.codereview.prompt.feedback.title", null, locale))
        .append("\n");
    prompt
        .append(
            messageSource.getMessage("service.codereview.prompt.feedback.structure", null, locale))
        .append("\n");
    prompt
        .append(messageSource.getMessage("service.codereview.prompt.feedback.naming", null, locale))
        .append("\n");
    prompt
        .append(
            messageSource.getMessage("service.codereview.prompt.feedback.practices", null, locale))
        .append("\n");
    prompt
        .append(messageSource.getMessage("service.codereview.prompt.feedback.issues", null, locale))
        .append("\n");
    prompt
        .append(
            messageSource.getMessage(
                "service.codereview.prompt.feedback.suggestions", null, locale))
        .append("\n\n");
    prompt.append(messageSource.getMessage("service.codereview.prompt.conclusion", null, locale));

    String feedback = chatModel.generate(prompt.toString());

    log.info("Code review completed");
    return feedback;
  }
}

package com.ailearn.controller;

import com.ailearn.dto.*;
import com.ailearn.service.ChatService;
import com.ailearn.service.CodeReviewService;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AiController {

  private final ChatService chatService;
  private final CodeReviewService codeReviewService;

  @PostMapping("/chat")
  public ChatResponse chat(
      @RequestBody ChatRequest request,
      @RequestHeader(value = "Accept-Language", required = false, defaultValue = "zh-CN")
          String languageHeader) {
    Locale locale = parseLocale(languageHeader);
    String response = chatService.chat(request.getSessionId(), request.getMessage(), locale);
    return new ChatResponse(response);
  }

  @PostMapping("/code/review")
  public CodeReviewResponse reviewCode(
      @RequestBody CodeReviewRequest request,
      @RequestHeader(value = "Accept-Language", required = false, defaultValue = "zh-CN")
          String languageHeader) {
    Locale locale = parseLocale(languageHeader);
    String feedback =
        codeReviewService.reviewCode(request.getCode(), request.getLanguage(), locale);
    return new CodeReviewResponse(feedback);
  }

  /** 解析语言 header 到 Locale 对象 支持的格式: zh-CN, zh, en-US, en */
  private Locale parseLocale(String languageHeader) {
    if (languageHeader == null || languageHeader.isEmpty()) {
      return Locale.SIMPLIFIED_CHINESE;
    }

    String lang = languageHeader.toLowerCase().trim();

    if (lang.startsWith("en")) {
      return Locale.US;
    } else if (lang.startsWith("zh")) {
      return Locale.SIMPLIFIED_CHINESE;
    }

    // 默认返回中文
    return Locale.SIMPLIFIED_CHINESE;
  }
}

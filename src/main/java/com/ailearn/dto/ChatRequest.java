package com.ailearn.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChatRequest {

  /** 会话 ID */
  @NotBlank(message = "会话 ID 不能为空")
  private String sessionId = "default";

  /** 用户消息内容 */
  @NotBlank(message = "消息内容不能为空")
  private String message;

  /** 是否为重新生成模式（不保存用户消息） */
  @NotNull(message = "isRegenerate 标志不能为空")
  private Boolean isRegenerate = false;
}

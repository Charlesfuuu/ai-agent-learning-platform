package com.ailearn.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 统一错误响应格式 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

  /** HTTP 状态码 */
  private int status;

  /** 错误类型 */
  private String error;

  /** 错误消息 */
  private String message;

  /** 错误发生时间 */
  private LocalDateTime timestamp;

  /** 请求路径 */
  private String path;

  /** 详细错误信息（仅开发环境） */
  private String details;
}

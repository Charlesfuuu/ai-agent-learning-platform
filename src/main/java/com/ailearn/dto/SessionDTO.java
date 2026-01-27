package com.ailearn.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 会话数据传输对象 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionDTO {

  /** 数据库 ID */
  private Long id;

  /** 会话唯一标识符 */
  private String sessionId;

  /** 会话标题 */
  private String title;

  /** 创建时间 */
  private LocalDateTime createdAt;

  /** 最后更新时间 */
  private LocalDateTime updatedAt;

  /** 消息数量 */
  private Long messageCount;
}

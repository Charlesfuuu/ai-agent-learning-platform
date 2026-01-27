package com.ailearn.dto;

import com.ailearn.entity.Message.MessageRole;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 消息数据传输对象 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {

  /** 消息角色 */
  private MessageRole role;

  /** 消息内容 */
  private String content;

  /** 序号 */
  private Integer sequenceNumber;

  /** 创建时间 */
  private LocalDateTime createdAt;
}

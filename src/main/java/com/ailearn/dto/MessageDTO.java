package com.ailearn.dto;

import com.ailearn.entity.Message.MessageRole;
import java.time.LocalDateTime;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PastOrPresent;
import javax.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/** 消息数据传输对象（不可变） 用于 API 响应，保护数据完整性 */
@Getter
@Builder
@AllArgsConstructor
public class MessageDTO {

  /** 消息 ID (可选，新创建的消息可能没有 ID) */
  @Positive(message = "消息 ID 必须是正数")
  private final Long id;

  /** 消息角色 */
  @NotNull(message = "消息角色不能为空")
  private final MessageRole role;

  /** 消息内容 */
  @NotBlank(message = "消息内容不能为空")
  private final String content;

  /** 序号 */
  @NotNull(message = "序号不能为空")
  @Positive(message = "序号必须是正数")
  private final Integer sequenceNumber;

  /** 创建时间 */
  @NotNull(message = "创建时间不能为空")
  @PastOrPresent(message = "创建时间不能是未来时间")
  private final LocalDateTime createdAt;
}

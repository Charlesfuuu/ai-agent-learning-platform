package com.ailearn.entity;

import java.time.LocalDateTime;
import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 消息实体 存储对话中的每条消息（用户消息和AI响应） */
@Entity
@Table(
    name = "messages",
    indexes = {@Index(name = "idx_session_sequence", columnList = "session_id,sequenceNumber")})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /** 所属会话 */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "session_id", nullable = false)
  private Session session;

  /** 消息角色（USER 或 ASSISTANT） */
  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private MessageRole role;

  /** 消息内容 */
  @Column(nullable = false, columnDefinition = "TEXT")
  private String content;

  /** 消息序号（用于排序） */
  @Column(nullable = false)
  private Integer sequenceNumber;

  /** 创建时间 */
  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;

  /** 创建前自动设置时间戳 */
  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
  }

  /** 消息角色枚举 */
  public enum MessageRole {
    USER, // 用户消息
    ASSISTANT // AI 助手响应
  }
}

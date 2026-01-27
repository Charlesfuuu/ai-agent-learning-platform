package com.ailearn.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 会话实体 存储用户的对话会话信息 */
@Entity
@Table(
    name = "sessions",
    indexes = {
      @Index(name = "idx_session_id", columnList = "sessionId", unique = true),
      @Index(name = "idx_created_at", columnList = "createdAt"),
      @Index(name = "idx_updated_at", columnList = "updatedAt")
    })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Session {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /** 会话唯一标识符（UUID） */
  @Column(nullable = false, unique = true, length = 36)
  private String sessionId;

  /** 会话标题（根据首条消息自动生成） */
  @Column(nullable = false, length = 100)
  private String title;

  /** 创建时间 */
  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;

  /** 最后更新时间 */
  @Column(nullable = false)
  private LocalDateTime updatedAt;

  /** 会话包含的消息列表 */
  @OneToMany(
      mappedBy = "session",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  @OrderBy("sequenceNumber ASC")
  @Builder.Default
  private List<Message> messages = new ArrayList<>();

  /** 创建前自动设置时间戳 */
  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
  }

  /** 更新前自动更新时间戳 */
  @PreUpdate
  protected void onUpdate() {
    updatedAt = LocalDateTime.now();
  }
}

package com.ailearn.repository;

import com.ailearn.entity.Session;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/** 会话数据访问层 */
@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

  /** 根据 sessionId 查找会话 */
  Optional<Session> findBySessionId(String sessionId);

  /** 检查 sessionId 是否存在 */
  boolean existsBySessionId(String sessionId);

  /** 按更新时间倒序查询所有会话（最新的在前） */
  List<Session> findAllByOrderByUpdatedAtDesc();

  /** 删除指定 sessionId 的会话 */
  void deleteBySessionId(String sessionId);
}

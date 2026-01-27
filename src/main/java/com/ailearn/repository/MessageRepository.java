package com.ailearn.repository;

import com.ailearn.entity.Message;
import com.ailearn.entity.Session;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** 消息数据访问层 */
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

  /** 查询会话的所有消息（按序号倒序） */
  Slice<Message> findBySessionOrderBySequenceNumberDesc(Session session, Pageable pageable);

  /** 查询会话的所有消息（按序号升序） */
  List<Message> findBySessionOrderBySequenceNumberAsc(Session session);

  /** 获取会话中最大的序号 */
  @Query("SELECT COALESCE(MAX(m.sequenceNumber), 0) FROM Message m WHERE m.session = :session")
  Integer findMaxSequenceNumberBySession(@Param("session") Session session);

  /** 统计会话的消息数量 */
  long countBySession(Session session);
}

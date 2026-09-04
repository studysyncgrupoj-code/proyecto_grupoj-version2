package com.studysync.repository;

import com.studysync.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findBySenderIdAndRecipientIdOrSenderIdAndRecipientIdOrderBySentAtAsc(
            Long senderId1,
            Long recipientId1,
            Long senderId2,
            Long recipientId2
    );

    List<Message> findBySenderIdOrRecipientIdOrderBySentAtDesc(
            Long senderId,
            Long recipientId
    );

    List<Message> findByRecipientIdAndReadFalse(Long recipientId);
}

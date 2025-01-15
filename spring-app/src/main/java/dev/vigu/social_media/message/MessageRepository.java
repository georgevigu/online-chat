package dev.vigu.social_media.message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {

    @Query("SELECT m FROM Message m WHERE " +
            "(m.sender.id = :senderId AND m.recipient.id = :recipientId) " +
            "OR (m.sender.id = :recipientId AND m.recipient.id = :senderId)" +
            "ORDER BY m.timestamp ASC")
    List<Message> findConversationBetweenUsers(@Param("senderId") Integer senderId,
                                               @Param("recipientId") Integer recipientId);

}

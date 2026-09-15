package com.studysync.service;

import com.studysync.model.Message;
import com.studysync.repository.MessageRepository;
import com.studysync.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageService(
            MessageRepository messageRepository,
            UserRepository userRepository) {

        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    public List<Message> getConversation(
            Long userId,
            Long otherUserId) {

        validateUser(userId);
        validateUser(otherUserId);

        return messageRepository
                .findBySenderIdAndRecipientIdOrSenderIdAndRecipientIdOrderBySentAtAsc(
                        userId,
                        otherUserId,
                        otherUserId,
                        userId
                );
    }

    public List<Message> getUserMessages(Long userId) {

        validateUser(userId);

        return messageRepository
                .findBySenderIdOrRecipientIdOrderBySentAtDesc(
                        userId,
                        userId
                );
    }

    public Message sendMessage(Message message) {

        if (message.getSenderId() == null) {
            throw new IllegalArgumentException(
                    "El remitente es obligatorio."
            );
        }

        if (message.getRecipientId() == null) {
            throw new IllegalArgumentException(
                    "El destinatario es obligatorio."
            );
        }

        if (message.getContent() == null ||
                message.getContent().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "El mensaje no puede estar vacío."
            );
        }

        if (message.getSenderId().equals(message.getRecipientId())) {
            throw new IllegalArgumentException(
                    "No puedes enviarte un mensaje a ti mismo."
            );
        }

        validateUser(message.getSenderId());
        validateUser(message.getRecipientId());

        message.setContent(
                message.getContent().trim()
        );

        message.setRead(false);
        message.setSentAt(LocalDateTime.now());

        return messageRepository.save(message);
    }

    public Message markAsRead(Long messageId) {

        Message message =
                messageRepository
                        .findById(messageId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Mensaje no encontrado: " + messageId
                                )
                        );

        message.setRead(true);

        return messageRepository.save(message);
    }

    public void markConversationAsRead(
            Long currentUserId,
            Long otherUserId) {

        validateUser(currentUserId);
        validateUser(otherUserId);

        List<Message> messages =
                getConversation(
                        currentUserId,
                        otherUserId
                );

        boolean changed = false;

        for (Message message : messages) {

            if (message.getRecipientId()
                    .equals(currentUserId)
                    && !Boolean.TRUE.equals(
                            message.getRead()
                    )) {

                message.setRead(true);
                changed = true;
            }
        }

        if (changed) {
            messageRepository.saveAll(messages);
        }
    }

    public long getUnreadCount(Long userId) {

        validateUser(userId);

        return messageRepository
                .findByRecipientIdAndReadFalse(userId)
                .size();
    }

    private void validateUser(Long userId) {

        if (!userRepository.existsById(userId)) {

            throw new IllegalArgumentException(
                    "Usuario no encontrado: " + userId
            );
        }
    }
}

package com.studysync.controller;

import com.studysync.model.Message;
import com.studysync.model.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import com.studysync.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    private final MessageService messageService;

    public MessageController(
            MessageService messageService) {

        this.messageService = messageService;
    }

    @GetMapping("/conversation/{userId}/{otherUserId}")
    public ResponseEntity<List<Message>> getConversation(
            @PathVariable Long userId,
            @PathVariable Long otherUserId,
            @AuthenticationPrincipal User currentUser) {

        validateOwner(userId, currentUser);

        return ResponseEntity.ok(
                messageService.getConversation(
                        userId,
                        otherUserId
                )
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Message>> getUserMessages(
            @PathVariable Long userId,
            @AuthenticationPrincipal User currentUser) {

        validateOwner(userId, currentUser);

        return ResponseEntity.ok(
                messageService.getUserMessages(userId)
        );
    }

    @PostMapping
    public ResponseEntity<Message> sendMessage(
            @RequestBody Message message,
            @AuthenticationPrincipal User currentUser) {

        validateOwner(message.getSenderId(), currentUser);
        message.setId(null);

        return ResponseEntity.ok(
                messageService.sendMessage(message)
        );
    }

    @PutMapping("/{messageId}/read")
    public ResponseEntity<Message> markAsRead(
            @PathVariable Long messageId,
            @AuthenticationPrincipal User currentUser) {

        return ResponseEntity.ok(
                messageService.markAsRead(messageId, currentUser.getId())
        );
    }

    @PutMapping("/conversation/{userId}/{otherUserId}/read")
    public ResponseEntity<Void> markConversationAsRead(
            @PathVariable Long userId,
            @PathVariable Long otherUserId,
            @AuthenticationPrincipal User currentUser) {

        validateOwner(userId, currentUser);

        messageService.markConversationAsRead(
                userId,
                otherUserId
        );

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/unread/{userId}")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @PathVariable Long userId,
            @AuthenticationPrincipal User currentUser) {

        validateOwner(userId, currentUser);

        return ResponseEntity.ok(
                Map.of(
                        "unread",
                        messageService.getUnreadCount(userId)
                )
        );
    }

    private void validateOwner(Long userId, User currentUser) {
        if (currentUser == null ||
                !currentUser.getId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Acceso no autorizado."
            );
        }
    }
}

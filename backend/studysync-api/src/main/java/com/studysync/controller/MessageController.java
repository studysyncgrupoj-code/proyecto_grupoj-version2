package com.studysync.controller;

import com.studysync.model.Message;
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
            @PathVariable Long otherUserId) {

        return ResponseEntity.ok(
                messageService.getConversation(
                        userId,
                        otherUserId
                )
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Message>> getUserMessages(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                messageService.getUserMessages(userId)
        );
    }

    @PostMapping
    public ResponseEntity<Message> sendMessage(
            @RequestBody Message message) {

        return ResponseEntity.ok(
                messageService.sendMessage(message)
        );
    }

    @PutMapping("/{messageId}/read")
    public ResponseEntity<Message> markAsRead(
            @PathVariable Long messageId) {

        return ResponseEntity.ok(
                messageService.markAsRead(messageId)
        );
    }

    @PutMapping("/conversation/{userId}/{otherUserId}/read")
    public ResponseEntity<Void> markConversationAsRead(
            @PathVariable Long userId,
            @PathVariable Long otherUserId) {

        messageService.markConversationAsRead(
                userId,
                otherUserId
        );

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/unread/{userId}")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                Map.of(
                        "unread",
                        messageService.getUnreadCount(userId)
                )
        );
    }
}

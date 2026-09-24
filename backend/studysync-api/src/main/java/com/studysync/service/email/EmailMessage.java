package com.studysync.service.email;

public record EmailMessage(
        String to,
        String replyTo,
        String subject,
        String text,
        String html
) {
}

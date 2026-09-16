package com.studysync.dto.auth;

import java.util.UUID;

public record RegisterResponse(
        int status,
        String message,
        UUID uuid
) {
}

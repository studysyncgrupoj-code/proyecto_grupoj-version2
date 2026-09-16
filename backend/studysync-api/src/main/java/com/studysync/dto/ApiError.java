package com.studysync.dto;

public record ApiError(
        int status,
        String message
) {
}

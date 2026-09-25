package com.studysync.service.auth;

import java.util.UUID;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.studysync.repository.auth.AuthAccountRepository;

@Service
public class ValidateResetTokenService {

    private static final String TOKEN_PREFIX = "password-reset:";

    private final StringRedisTemplate redisTemplate;
    private final AuthAccountRepository authAccountRepository;

    public ValidateResetTokenService(
            StringRedisTemplate redisTemplate,
            AuthAccountRepository authAccountRepository
    ) {
        this.redisTemplate = redisTemplate;
        this.authAccountRepository = authAccountRepository;
    }

    public boolean isValid(String token) {

        if (token == null || token.isBlank()) {
            return false;
        }

        UUID tokenId;

        try {
            tokenId = UUID.fromString(token.trim());
        } catch (IllegalArgumentException exception) {
            return false;
        }

        String redisKey = TOKEN_PREFIX + tokenId;

        String userId = redisTemplate
                .opsForValue()
                .get(redisKey);

        if (userId == null) {
            return false;
        }

        try {
            UUID accountId = UUID.fromString(userId);

            return authAccountRepository.existsById(accountId);

        } catch (IllegalArgumentException exception) {
            return false;
        }
    }
}



package com.studysync.service.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.HexFormat;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class JwtRevocationService {

    private static final String KEY_PREFIX = "auth:jwt:revoked:";

    private final StringRedisTemplate redisTemplate;

    public JwtRevocationService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void revoke(String token, long remainingMillis) {

        if (token == null || token.isBlank() || remainingMillis <= 0) {
            return;
        }

        redisTemplate.opsForValue().set(
                redisKey(token),
                "revoked",
                Duration.ofMillis(remainingMillis)
        );
    }

    public boolean isRevoked(String token) {

        if (token == null || token.isBlank()) {
            return false;
        }

        return Boolean.TRUE.equals(
                redisTemplate.hasKey(redisKey(token))
        );
    }

    private String redisKey(String token) {
        return KEY_PREFIX + sha256(token);
    }

    private String sha256(String value) {
        try {
            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    value.getBytes(StandardCharsets.UTF_8)
            );

            return HexFormat.of().formatHex(hash);

        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException(
                    "SHA-256 no está disponible.",
                    ex
            );
        }
    }
}

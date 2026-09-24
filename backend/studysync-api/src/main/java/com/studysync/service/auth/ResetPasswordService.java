package com.studysync.service.auth;

import java.util.UUID;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.studysync.model.auth.AuthAccount;
import com.studysync.repository.auth.AuthAccountRepository;

@Service
public class ResetPasswordService {

    private static final String TOKEN_PREFIX = "password-reset:";

    private final AuthAccountRepository authAccountRepository;
    private final StringRedisTemplate redisTemplate;
    private final PasswordEncoder passwordEncoder;

    public ResetPasswordService(
            AuthAccountRepository authAccountRepository,
            StringRedisTemplate redisTemplate,
            PasswordEncoder passwordEncoder
    ) {
        this.authAccountRepository = authAccountRepository;
        this.redisTemplate = redisTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean resetPassword(String token, String newPassword) {

        if (token == null || token.isBlank()
                || newPassword == null || newPassword.isBlank()) {
            return false;
        }

        String redisKey = TOKEN_PREFIX + token.trim();

        /*
         * Redis contiene:
         *
         * password-reset:<token> -> userId
         *
         * Si el token expiró, Redis ya habrá eliminado la clave
         * automáticamente y obtendremos null.
         */
        String userId = redisTemplate
                .opsForValue()
                .get(redisKey);

        if (userId == null) {
            return false;
        }

        UUID accountId;

        try {
            accountId = UUID.fromString(userId);
        } catch (IllegalArgumentException e) {
            redisTemplate.delete(redisKey);
            return false;
        }

        AuthAccount account = authAccountRepository
                .findById(accountId)
                .orElse(null);

        if (account == null) {
            redisTemplate.delete(redisKey);
            return false;
        }

        account.setPasswordHash(
                passwordEncoder.encode(newPassword)
        );

        authAccountRepository.save(account);

        /*
         * Token de un solo uso.
         * Después de cambiar correctamente la contraseña,
         * se elimina inmediatamente de Redis.
         */
        redisTemplate.delete(redisKey);

        return true;
    }
}

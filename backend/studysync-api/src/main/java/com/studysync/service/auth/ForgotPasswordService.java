package com.studysync.service.auth;

import java.time.Duration;
import java.util.UUID;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.studysync.model.auth.AuthAccount;
import com.studysync.repository.auth.AuthAccountRepository;
import com.studysync.service.email.EmailMessage;
import com.studysync.service.email.EmailService;

@Service
public class ForgotPasswordService {

    private static final Duration TOKEN_TTL = Duration.ofMinutes(30);
    private static final String TOKEN_PREFIX = "password-reset:";

    private final AuthAccountRepository authAccountRepository;
    private final StringRedisTemplate redisTemplate;
    private final EmailService emailService;

    public ForgotPasswordService(
            AuthAccountRepository authAccountRepository,
            StringRedisTemplate redisTemplate,
            EmailService emailService
    ) {
        this.authAccountRepository = authAccountRepository;
        this.redisTemplate = redisTemplate;
        this.emailService = emailService;
    }

    public void requestPasswordReset(String email) {

        if (email == null || email.isBlank()) {
            return;
        }

        AuthAccount account = authAccountRepository
                .findByEmailIgnoreCase(email.trim())
                .orElse(null);

        // No revelar si el correo está registrado o no.
        if (account == null) {
            return;
        }

        String token = UUID.randomUUID().toString();
        String redisKey = TOKEN_PREFIX + token;

        /*
         * Guardamos solamente el ID del usuario.
         * Redis eliminará automáticamente este dato después de 30 minutos.
         */
        redisTemplate.opsForValue().set(
                redisKey,
                account.getId().toString(),
                TOKEN_TTL
        );

        String text =
                "Recibimos una solicitud para restablecer tu contraseña de StudySync.\n\n" +
                "Token de recuperación:\n" +
                token + "\n\n" +
                "Este token expirará en 30 minutos.\n\n" +
                "Si no solicitaste este cambio, puedes ignorar este correo.";

        String html =
                "<h2>Restablecer contraseña</h2>" +
                "<p>Recibimos una solicitud para restablecer tu contraseña de StudySync.</p>" +
                "<p>Token de recuperación:</p>" +
                "<p><strong>" + token + "</strong></p>" +
                "<p>Este token expirará en 30 minutos.</p>" +
                "<p>Si no solicitaste este cambio, puedes ignorar este correo.</p>";

        boolean sent = emailService.send(
                new EmailMessage(
                        account.getEmail(),
                        null,
                        "Restablecer contraseña - StudySync",
                        text,
                        html
                )
        );

        /*
         * Si el correo falla, eliminamos el token para no dejar
         * información temporal inútil en Redis.
         */
        if (!sent) {
            redisTemplate.delete(redisKey);
        }
    }
}

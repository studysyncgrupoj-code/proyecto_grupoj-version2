package com.studysync.service.auth;

import java.time.Duration;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
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
    private final String frontendUrl;

    public ForgotPasswordService(
            AuthAccountRepository authAccountRepository,
            StringRedisTemplate redisTemplate,
            EmailService emailService,
            @Value("${app.frontend.url:http://localhost:3000}")
            String frontendUrl
    ) {
        this.authAccountRepository = authAccountRepository;
        this.redisTemplate = redisTemplate;
        this.emailService = emailService;
        this.frontendUrl = frontendUrl;
    }

    public void requestPasswordReset(String email) {

        if (email == null || email.isBlank()) {
            return;
        }

        AuthAccount account = authAccountRepository
                .findByEmailIgnoreCase(email.trim())
                .orElse(null);

        // No revelar si el correo está registrado.
        if (account == null) {
            return;
        }

        String token = UUID.randomUUID().toString();
        String redisKey = TOKEN_PREFIX + token;

        // El token permanece disponible durante 30 minutos.
        redisTemplate.opsForValue().set(
                redisKey,
                account.getId().toString(),
                TOKEN_TTL
        );

        // Construimos el enlace utilizando la URL del frontend.
        String resetLink =
                frontendUrl.replaceAll("/+$", "")
                + "/reset-password/"
                + token;

        String text =
                "Recibimos una solicitud para restablecer tu contraseña "
                + "de StudySync.\n\n"
                + "Accede al siguiente enlace:\n"
                + resetLink
                + "\n\n"
                + "Este enlace expirará en 30 minutos.\n\n"
                + "Si no solicitaste este cambio, ignora este correo.";

        String html =
                "<div style='font-family:Arial,sans-serif;"
                + "max-width:520px;margin:auto;padding:24px;'>"

                + "<h2 style='color:#2563eb;'>StudySync</h2>"

                + "<h3>Restablecer contraseña</h3>"

                + "<p>Recibimos una solicitud para restablecer "
                + "tu contraseña.</p>"

                + "<p>Haz clic en el siguiente botón:</p>"

                + "<div style='margin:30px 0;'>"

                + "<a href='" + resetLink + "' "
                + "style='background:#2563eb;color:white;"
                + "padding:14px 24px;text-decoration:none;"
                + "border-radius:8px;display:inline-block;'>"

                + "Restablecer contraseña"

                + "</a></div>"

                + "<p>Este enlace expirará en 30 minutos.</p>"

                + "<p>Si no solicitaste este cambio, "
                + "puedes ignorar este correo.</p>"

                + "</div>";

        boolean sent = emailService.send(
                new EmailMessage(
                        account.getEmail(),
                        null,
                        "Restablecer contraseña - StudySync",
                        text,
                        html
                )
        );

        // Eliminar el token si falla el envío.
        if (!sent) {
            redisTemplate.delete(redisKey);
        }
    }
}
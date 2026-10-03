package com.studysync.service.auth;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.studysync.dto.auth.RegisterRequest;
import com.studysync.exception.EmailAlreadyRegisteredException;
import com.studysync.model.auth.AuthAccount;
import com.studysync.model.auth.Role;
import com.studysync.model.user.UserProfile;
import com.studysync.repository.auth.AuthAccountRepository;
import com.studysync.service.email.EmailMessage;
import com.studysync.service.email.EmailService;
import com.studysync.service.subscription.StudentSubscriptionService;

@Service
public class EmailVerificationService {

    // ============================================
    // CONSTANTES
    // ============================================

    private static final Duration TOKEN_TTL =
            Duration.ofHours(6);

    private static final Duration LOCK_TTL =
            Duration.ofMinutes(10);

    private static final String TOKEN_PREFIX =
            "email-verification:";

    // ============================================
    // DEPENDENCIAS
    // ============================================

    private final AuthAccountRepository authAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final StudentSubscriptionService studentSubscriptionService;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;
    private final EmailService emailService;
    private final String frontendUrl;

    // ============================================
    // CONSTRUCTOR
    // ============================================

    public EmailVerificationService(
            AuthAccountRepository authAccountRepository,
            PasswordEncoder passwordEncoder,
            StudentSubscriptionService studentSubscriptionService,
            StringRedisTemplate redisTemplate,
            ObjectMapper objectMapper,
            EmailService emailService,
            @Value("${app.frontend.url:http://localhost:3000}")
            String frontendUrl
    ) {
        this.authAccountRepository = authAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.studentSubscriptionService = studentSubscriptionService;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
        this.emailService = emailService;
        this.frontendUrl = frontendUrl;
    }

    // ============================================
    // REGISTRO TEMPORAL
    // ============================================

    /*
     * Representa los datos de un usuario
     * que todavía no ha verificado su correo.
     *
     * La contraseña se almacena cifrada.
     */
    private record PendingRegistration(
            String nombre,
            String apellidos,
            String email,
            String passwordHash
    ) {
    }

    // ============================================
    // SOLICITAR VERIFICACIÓN
    // ============================================

    public boolean requestVerification(RegisterRequest request) {

        String email = request.email()
                .trim()
                .toLowerCase();

        // Comprobar que el correo no esté registrado.

        if (authAccountRepository.existsByEmailIgnoreCase(email)) {
            throw new EmailAlreadyRegisteredException();
        }

        // Preparar los datos temporales.

        PendingRegistration pending =
                new PendingRegistration(
                        request.nombre().trim(),
                        request.apellidos().trim(),
                        email,
                        passwordEncoder.encode(
                                request.contrasena()
                        )
                );

        // Generar un token único.

        String token = UUID.randomUUID().toString();

        String redisKey = TOKEN_PREFIX + token;

        // Almacenar el registro en Redis.

        try {

            String json = objectMapper
                    .writeValueAsString(pending);

            redisTemplate.opsForValue().set(
                    redisKey,
                    json,
                    TOKEN_TTL
            );

        } catch (JsonProcessingException ex) {

            throw new IllegalStateException(
                    "No fue posible preparar el registro.",
                    ex
            );
        }

        // ========================================
        // ENLACE DE VERIFICACIÓN
        // ========================================

        String verificationLink =
        frontendUrl.replaceAll("/+$", "")
        + "/verify-email/"
        + token;

        // ========================================
        // CORREO EN TEXTO
        // ========================================

        String text =
                "Bienvenido a StudySync.\n\n"
                + "Para verificar tu correo electrónico, "
                + "accede al siguiente enlace:\n\n"
                + verificationLink
                + "\n\n"
                + "El enlace expirará en 6 horas.\n\n"
                + "Si no solicitaste este registro, "
                + "ignora este mensaje.";

        // ========================================
        // CORREO HTML
        // ========================================

        String html =
                "<div style='font-family:Arial,sans-serif;"
                + "max-width:520px;margin:auto;padding:24px;'>"

                + "<h2 style='color:#2563eb;'>StudySync</h2>"

                + "<h3>Verifica tu correo electrónico</h3>"

                + "<p>Gracias por registrarte en StudySync.</p>"

                + "<p>Para completar tu registro, "
                + "verifica tu correo electrónico.</p>"

                + "<div style='margin:30px 0;'>"

                + "<a href='" + verificationLink + "' "
                + "style='background:#2563eb;color:white;"
                + "padding:14px 24px;text-decoration:none;"
                + "border-radius:8px;display:inline-block;'>"

                + "Verificar correo"

                + "</a></div>"

                + "<p>Este enlace expirará en 6 horas.</p>"

                + "<p>Si no solicitaste este registro, "
                + "puedes ignorar este correo.</p>"

                + "</div>";

        // ========================================
        // ENVIAR CORREO
        // ========================================

        boolean sent = emailService.send(
                new EmailMessage(
                        email,
                        null,
                        "Verifica tu cuenta - StudySync",
                        text,
                        html
                )
        );

        /*
         * Si el proveedor rechaza el envío,
         * eliminamos el registro temporal.
         */

        if (!sent) {
            redisTemplate.delete(redisKey);
        }

        return sent;
    }

    // ============================================
    // VERIFICAR CORREO
    // ============================================


    // ============================================
    // VALIDAR TOKEN SIN CONSUMIRLO
    // ============================================

    public boolean validateVerificationToken(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }

        String redisKey = TOKEN_PREFIX + token.trim();

        String pendingRegistration =
                redisTemplate.opsForValue().get(redisKey);

        if (pendingRegistration == null
                || pendingRegistration.isBlank()) {
            return false;
        }

        Boolean locked =
                redisTemplate.hasKey(redisKey + ":lock");

        return !Boolean.TRUE.equals(locked);
    }

    @Transactional
    public UserProfile verifyEmail(String token) {

        if (token == null || token.isBlank()) {
            return null;
        }

        String redisKey =
                TOKEN_PREFIX + token.trim();

        String lockKey = redisKey + ":lock";

        String lockId = UUID.randomUUID().toString();

                // ============================================
        // VALIDAR TOKEN SIN CONSUMIRLO
        // ============================================

            // ========================================
        // BLOQUEO TEMPORAL EN REDIS
        // ========================================

        /*
         * Solo una solicitud puede obtener
         * el bloqueo para este token.
         */

        Boolean locked =
                redisTemplate.opsForValue().setIfAbsent(
                        lockKey,
                        lockId,
                        LOCK_TTL
                );

        if (!Boolean.TRUE.equals(locked)) {
            return null;
        }

        boolean synchronizationRegistered = false;

        try {

            // ====================================
            // RECUPERAR REGISTRO
            // ====================================

            String json =
                    redisTemplate.opsForValue().get(redisKey);

            if (json == null) {
                return null;
            }

            PendingRegistration pending;

            try {

                pending = objectMapper.readValue(
                        json,
                        PendingRegistration.class
                );

            } catch (JsonProcessingException ex) {

                throw new IllegalStateException(
                        "No fue posible recuperar el registro.",
                        ex
                );
            }

            // ====================================
            // COMPROBAR CORREO
            // ====================================

            if (authAccountRepository.existsByEmailIgnoreCase(
                    pending.email()
            )) {
                throw new EmailAlreadyRegisteredException();
            }

            // ====================================
            // CREAR CUENTA
            // ====================================

            AuthAccount account = new AuthAccount();

            account.setEmail(pending.email());
            account.setPasswordHash(pending.passwordHash());
            account.setRole(Role.STUDENT);
            account.setActive(true);

            // ====================================
            // CREAR PERFIL
            // ====================================

            UserProfile profile = new UserProfile();

            profile.setNombre(pending.nombre());
            profile.setApellidos(pending.apellidos());

            account.setUserProfile(profile);

            // ====================================
            // GUARDAR EN POSTGRESQL
            // ====================================

            AuthAccount saved;

            try {

                saved = authAccountRepository.saveAndFlush(
                        account
                );

                studentSubscriptionService
                        .createFreeSubscription(saved);

            } catch (DataIntegrityViolationException ex) {

                throw new EmailAlreadyRegisteredException();
            }

            // ====================================
            // CONFIRMACIÓN DE TRANSACCIÓN
            // ====================================

            /*
             * El token solo se elimina después
             * de confirmar la transacción.
             */

            if (!TransactionSynchronizationManager
                    .isSynchronizationActive()) {

                throw new IllegalStateException(
                        "No existe una transacción activa."
                );
            }

            TransactionSynchronizationManager
                    .registerSynchronization(
                            new TransactionSynchronization() {

                                @Override
                                public void afterCompletion(
                                        int status
                                ) {

                                    if (status == STATUS_COMMITTED) {

                                        try {

                                            redisTemplate.delete(
                                                    redisKey
                                            );

                                        } catch (RuntimeException ex) {

                                            /*
                                             * PostgreSQL ya confirmó.
                                             * No intentamos revertir
                                             * la transacción.
                                             */
                                        }
                                    }

                                    // Liberar el bloqueo.

                                    releaseVerificationLock(
                                            lockKey,
                                            lockId
                                    );
                                }
                            }
                    );

            synchronizationRegistered = true;

            return saved.getUserProfile();

        } finally {

            /*
             * Si ocurrió un error antes de
             * registrar la sincronización,
             * liberamos el bloqueo.
             */

            if (!synchronizationRegistered) {

                releaseVerificationLock(
                        lockKey,
                        lockId
                );
            }
        }
    }

    // ============================================
    // LIBERAR BLOQUEO
    // ============================================

    private void releaseVerificationLock(
            String lockKey,
            String lockId
    ) {

        /*
         * Utilizamos un script Lua para eliminar
         * el bloqueo de manera atómica.
         *
         * Solo eliminamos el bloqueo si
         * todavía pertenece a esta solicitud.
         */

        String script = """
                if redis.call('GET', KEYS[1]) == ARGV[1] then
                    return redis.call('DEL', KEYS[1])
                else
                    return 0
                end
                """;

        DefaultRedisScript<Long> redisScript =
                new DefaultRedisScript<>();

        redisScript.setScriptText(script);
        redisScript.setResultType(Long.class);

        try {

            redisTemplate.execute(
                    redisScript,
                    List.of(lockKey),
                    lockId
            );

        } catch (RuntimeException ex) {

            /*
             * Si Redis no responde, el bloqueo
             * expirará automáticamente.
             */
        }
    }
}
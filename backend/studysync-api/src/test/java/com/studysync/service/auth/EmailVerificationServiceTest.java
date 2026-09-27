package com.studysync.service.auth;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.Duration;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studysync.dto.auth.RegisterRequest;
import com.studysync.repository.auth.AuthAccountRepository;
import com.studysync.service.email.EmailService;
import com.studysync.service.subscription.StudentSubscriptionService;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import com.studysync.model.auth.AuthAccount;
import com.studysync.model.user.UserProfile;

class EmailVerificationServiceTest {

    private AuthAccountRepository accountRepository;
    private PasswordEncoder passwordEncoder;
    private StringRedisTemplate redisTemplate;
    private ValueOperations<String, String> valueOperations;
    private EmailService emailService;
    private StudentSubscriptionService subscriptionService;
    private EmailVerificationService service;

    @BeforeEach
    @SuppressWarnings("unchecked")
    void setUp() {

        accountRepository = mock(AuthAccountRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        redisTemplate = mock(StringRedisTemplate.class);
        valueOperations = mock(ValueOperations.class);
        emailService = mock(EmailService.class);
        subscriptionService = mock(StudentSubscriptionService.class);

        when(redisTemplate.opsForValue())
                .thenReturn(valueOperations);

        when(passwordEncoder.encode(anyString()))
                .thenReturn("hash-de-prueba");

        when(emailService.send(any()))
                .thenReturn(true);

        service = new EmailVerificationService(
                accountRepository,
                passwordEncoder,
                subscriptionService,
                redisTemplate,
                new ObjectMapper(),
                emailService,
                "http://localhost:3000"
        );
    }

    @Test
    void debeGuardarRegistroTemporalDuranteSeisHoras() {

        RegisterRequest request = new RegisterRequest(
                "Richard",
                "Prueba",
                "prueba@example.com",
                "Prueba123!"
        );

        boolean resultado = service.requestVerification(request);

        assertTrue(resultado);

        ArgumentCaptor<String> keyCaptor =
                ArgumentCaptor.forClass(String.class);

        ArgumentCaptor<String> jsonCaptor =
                ArgumentCaptor.forClass(String.class);

        verify(valueOperations).set(
                keyCaptor.capture(),
                jsonCaptor.capture(),
                eq(Duration.ofHours(6))
        );

        assertTrue(
                keyCaptor.getValue()
                        .startsWith("email-verification:")
        );

        assertTrue(
                jsonCaptor.getValue()
                        .contains("prueba@example.com")
        );

        assertTrue(
                jsonCaptor.getValue()
                        .contains("hash-de-prueba")
        );

        assertFalse(
                jsonCaptor.getValue()
                        .contains("Prueba123!")
        );

        verify(emailService).send(any());
    }

    @Test
    void debeEliminarRegistroTemporalSiFallaElCorreo() {

        // Simular un fallo en el envío del correo.
        when(emailService.send(any()))
                .thenReturn(false);

        RegisterRequest request = new RegisterRequest(
                "Richard",
                "Prueba",
                "prueba@example.com",
                "Prueba123!"
        );

        // Ejecutar el servicio.
        boolean resultado =
                service.requestVerification(request);

        // El servicio debe informar que el envío falló.
        assertFalse(resultado);

        // Capturar la clave utilizada para guardar el registro.
        ArgumentCaptor<String> keyCaptor =
                ArgumentCaptor.forClass(String.class);

        verify(valueOperations).set(
                keyCaptor.capture(),
                anyString(),
                eq(Duration.ofHours(6))
        );

        String redisKey = keyCaptor.getValue();

        // Verificar que se elimina exactamente el registro creado.
        verify(redisTemplate).delete(redisKey);

        // Confirmar que la clave corresponde a la verificación.
        assertTrue(
                redisKey.startsWith("email-verification:")
        );

        // Confirmar que solamente se intentó enviar un correo.
        verify(emailService, times(1)).send(any());
    }

    @Test
    void debeRechazarTokenInexistenteOExpirado() {

        String token = "token-inexistente";

        String redisKey = "email-verification:" + token;
        String lockKey = redisKey + ":lock";

        // Simular que obtenemos el bloqueo.
        when(valueOperations.setIfAbsent(
                eq(lockKey),
                anyString(),
                eq(Duration.ofMinutes(10))
        )).thenReturn(true);

        // Simular que el token no existe o ya expiró.
        when(valueOperations.get(redisKey))
                .thenReturn(null);

        // Intentar verificar el correo.
        var resultado = service.verifyEmail(token);

        // No debe crearse ninguna cuenta.
        assertNull(resultado);

        verify(accountRepository, never())
                .saveAndFlush(any());

        // No debe crearse ninguna suscripción.
        verifyNoInteractions(subscriptionService);
    }

    @Test
        void debeEliminarTokenDespuesDeConfirmarTransaccion()
                throws Exception {

            String token = "token-de-prueba";
            String redisKey = "email-verification:" + token;
            String lockKey = redisKey + ":lock";

            String pendingJson = """
                    {
                        "nombre": "Richard",
                        "apellidos": "Prueba",
                        "email": "prueba@example.com",
                        "passwordHash": "hash-de-prueba"
                    }
                    """;

            when(valueOperations.setIfAbsent(
                    eq(lockKey),
                    anyString(),
                    eq(Duration.ofMinutes(10))
            )).thenReturn(true);

            when(valueOperations.get(redisKey))
                    .thenReturn(pendingJson);

            AuthAccount savedAccount = new AuthAccount();

            UserProfile profile = new UserProfile();
            profile.setNombre("Richard");
            profile.setApellidos("Prueba");

            savedAccount.setUserProfile(profile);

            when(accountRepository.saveAndFlush(any(AuthAccount.class)))
                    .thenReturn(savedAccount);

            TransactionSynchronizationManager.initSynchronization();

            try {

                UserProfile resultado = service.verifyEmail(token);

                assertNotNull(resultado);

                // El token todavía debe existir antes del commit.
                verify(redisTemplate, never()).delete(redisKey);

                var synchronizations =
                        TransactionSynchronizationManager
                                .getSynchronizations();

                assertEquals(1, synchronizations.size());

                // Simular la confirmación de PostgreSQL.
                synchronizations.get(0).afterCompletion(
                        TransactionSynchronization.STATUS_COMMITTED
                );

                // Ahora sí debe eliminarse el token.
                verify(redisTemplate, times(1))
                        .delete(redisKey);

                verify(subscriptionService, times(1))
                        .createFreeSubscription(savedAccount);

            } finally {

                TransactionSynchronizationManager
                        .clearSynchronization();
            }
        }
    @Test
        void debeConservarTokenSiTransaccionSeRevierte() {

            String token = "token-rollback";
            String redisKey = "email-verification:" + token;
            String lockKey = redisKey + ":lock";

            String pendingJson = """
                    {
                        "nombre": "Richard",
                        "apellidos": "Prueba",
                        "email": "prueba@example.com",
                        "passwordHash": "hash-de-prueba"
                    }
                    """;

            when(valueOperations.setIfAbsent(
                    eq(lockKey),
                    anyString(),
                    eq(Duration.ofMinutes(10))
            )).thenReturn(true);

            when(valueOperations.get(redisKey))
                    .thenReturn(pendingJson);

            AuthAccount savedAccount = new AuthAccount();
            savedAccount.setUserProfile(new UserProfile());

            when(accountRepository.saveAndFlush(any(AuthAccount.class)))
                    .thenReturn(savedAccount);

            TransactionSynchronizationManager.initSynchronization();

            try {
                assertNotNull(service.verifyEmail(token));

                var synchronizations =
                        TransactionSynchronizationManager.getSynchronizations();

                assertFalse(synchronizations.isEmpty());

                // Simular una reversión de la transacción.
                synchronizations.forEach(sync ->
                        sync.afterCompletion(
                                TransactionSynchronization.STATUS_ROLLED_BACK
                        )
                );

                // El token debe conservarse.
                verify(redisTemplate, never()).delete(redisKey);

            } finally {
                TransactionSynchronizationManager.clearSynchronization();
            }
        }
}
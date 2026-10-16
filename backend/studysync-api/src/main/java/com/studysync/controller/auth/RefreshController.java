package com.studysync.controller.auth;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.studysync.model.auth.AuthAccount;
import com.studysync.model.subscription.StudentSubscription;
import com.studysync.model.subscription.SubscriptionType;
import com.studysync.model.user.UserProfile;
import com.studysync.repository.UserProfileRepository;
import com.studysync.repository.auth.AuthAccountRepository;
import com.studysync.security.jwt.JwtService;
import com.studysync.service.auth.JwtRevocationService;
import com.studysync.service.subscription.StudentSubscriptionService;

@RestController
@RequestMapping("/auth")
public class RefreshController {

    private final JwtService jwtService;
    private final AuthAccountRepository authAccountRepository;
    private final UserProfileRepository userProfileRepository;
    private final StudentSubscriptionService studentSubscriptionService;
    private final JwtRevocationService jwtRevocationService;

    public RefreshController(
            JwtService jwtService,
            AuthAccountRepository authAccountRepository,
            UserProfileRepository userProfileRepository,
            StudentSubscriptionService studentSubscriptionService,
            JwtRevocationService jwtRevocationService
    ) {
        this.jwtService = jwtService;
        this.authAccountRepository = authAccountRepository;
        this.userProfileRepository = userProfileRepository;
        this.studentSubscriptionService = studentSubscriptionService;
        this.jwtRevocationService = jwtRevocationService;
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            @RequestBody Map<String, String> request
    ) {

        if (request == null) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "status", 400,
                            "message",
                            "Cuerpo de petición inválido."
                    ));
        }

        String refreshToken =
                request.get("refreshToken");

        if (refreshToken == null
                || refreshToken.isBlank()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "status", 401,
                            "message",
                            "Refresh token requerido."
                    ));
        }

        refreshToken = refreshToken.trim();

        /*
         * Un refresh token previamente revocado
         * no puede volver a utilizarse.
         */
        if (jwtRevocationService.isRevoked(refreshToken)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "status", 401,
                            "message",
                            "Refresh token revocado."
                    ));
        }

        UUID accountId =
                jwtService.validateRefreshToken(
                        refreshToken
                );

        if (accountId == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "status", 401,
                            "message",
                            "Refresh token inválido o expirado."
                    ));
        }

        AuthAccount account =
                authAccountRepository
                        .findById(accountId)
                        .orElse(null);

        if (account == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "status", 401,
                            "message",
                            "La cuenta asociada al refresh token no existe."
                    ));
        }

        if (!Boolean.TRUE.equals(account.getActive())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "status", 403,
                            "message",
                            "La cuenta se encuentra inactiva."
                    ));
        }

        UserProfile profile =
                userProfileRepository
                        .findById(account.getId())
                        .orElse(null);

        if (profile == null) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", 500,
                            "message",
                            "No se pudo recuperar el perfil del usuario."
                    ));
        }

        /*
         * ROTACIÓN DEL REFRESH TOKEN
         *
         * El token utilizado deja de ser válido
         * inmediatamente después de esta operación.
         */
        long remainingMillis =
                jwtService
                        .getRemainingRefreshValidityMillis(
                                refreshToken
                        );

        jwtRevocationService.revoke(
                refreshToken,
                remainingMillis
        );

        String token =
                jwtService.generateToken(account);

        String newRefreshToken =
                jwtService.generateRefreshToken(account);

        Map<String, Object> data =
                new LinkedHashMap<>();

        data.put(
                "firstName",
                profile.getNombre()
        );

        data.put(
                "lastName",
                profile.getApellidos()
        );

        data.put(
                "id",
                account.getId().toString()
        );

        data.put(
                "role",
                account.getRole()
                        .name()
                        .toLowerCase()
        );

        data.put(
                "image",
                profile.getImage()
        );

        data.put(
                "token",
                token
        );

        data.put(
                "refreshToken",
                newRefreshToken
        );

        data.put(
                "expiresIn",
                jwtService.getExpirationSeconds()
        );

        data.put(
                "refreshExpiresIn",
                jwtService.getRefreshExpirationSeconds()
        );

        /*
         * subscription solamente para estudiantes.
         */
        if (account.getRole()
                == com.studysync.model.auth.Role.STUDENT) {

            StudentSubscription studentSubscription =
                    studentSubscriptionService
                            .getValidatedSubscription(account);

            if (studentSubscription != null) {

                SubscriptionType subscription =
                        studentSubscription.getType();

                if (subscription != null) {
                    data.put(
                            "subscription",
                            subscription
                                    .name()
                                    .toLowerCase()
                    );
                }
            }
        }

        return ResponseEntity.ok(
                Map.of(
                        "status", 200,
                        "message",
                        "Token renovado correctamente.",
                        "data", data
                )
        );
    }
}

package com.studysync.controller.auth;

import com.studysync.model.user.UserProfile;
import com.studysync.service.auth.EmailVerificationService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class EmailVerificationController {

    private final EmailVerificationService verificationService;

    public EmailVerificationController(
            EmailVerificationService verificationService
    ) {
        this.verificationService = verificationService;
    }

    public record VerificationRequest(String token) {
    }

    // ============================================
    // VALIDAR TOKEN SIN CONSUMIRLO
    // ============================================

    @PostMapping("/validate-verification-token")
    public ResponseEntity<Map<String, Object>> validateToken(
            @RequestBody VerificationRequest request
    ) {

        if (request == null
                || request.token() == null
                || request.token().isBlank()) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "valid", false,
                            "message", "El token es obligatorio."
                    )
            );
        }

        boolean valid =
                verificationService.validateVerificationToken(
                        request.token()
                );

        if (!valid) {
            return ResponseEntity.ok(
                    Map.of(
                            "valid", false,
                            "message",
                            "El token es inválido o ha expirado."
                    )
            );
        }

        return ResponseEntity.ok(
                Map.of(
                        "valid", true,
                        "message", "El token es válido."
                )
        );
    }

    // ============================================
    // VERIFICACIÓN DEFINITIVA DEL CORREO
    // ============================================

    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, Object>> verifyEmail(
            @RequestBody VerificationRequest request
    ) {

        if (request == null
                || request.token() == null
                || request.token().isBlank()) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "status", 400,
                            "message", "El token es obligatorio."
                    )
            );
        }

        UserProfile profile =
                verificationService.verifyEmail(request.token());

        if (profile == null) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "status", 400,
                            "message",
                            "El enlace de verificación es inválido o ha expirado."
                    )
            );
        }

        return ResponseEntity.status(HttpStatus.OK).body(
                Map.of(
                        "status", 200,
                        "message",
                        "Correo verificado correctamente. Tu cuenta está activa."
                )
        );
    }
}
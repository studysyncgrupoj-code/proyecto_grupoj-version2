package com.studysync.controller.auth;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studysync.service.auth.ForgotPasswordService;

@RestController
@RequestMapping("/auth")
public class ForgotPasswordController {

    private final ForgotPasswordService forgotPasswordService;

    public ForgotPasswordController(
            ForgotPasswordService forgotPasswordService
    ) {
        this.forgotPasswordService = forgotPasswordService;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(
            @RequestBody Map<String, String> body
    ) {

        forgotPasswordService.requestPasswordReset(
                body.get("email")
        );

        /*
         * Siempre devolvemos la misma respuesta.
         * Así no revelamos si el correo existe en StudySync.
         */
        return ResponseEntity.ok(
                Map.of(
                        "status", 200,
                        "message",
                        "Si el correo está registrado, recibirás las instrucciones para restablecer tu contraseña."
                )
        );
    }
}

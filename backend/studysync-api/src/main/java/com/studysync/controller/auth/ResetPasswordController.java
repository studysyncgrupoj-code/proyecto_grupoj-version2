package com.studysync.controller.auth;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studysync.service.auth.ResetPasswordService;

@RestController
@RequestMapping("/auth")
public class ResetPasswordController {

    private final ResetPasswordService resetPasswordService;

    public ResetPasswordController(
            ResetPasswordService resetPasswordService
    ) {
        this.resetPasswordService = resetPasswordService;
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(
            @RequestBody Map<String, String> body
    ) {

        String token = body.get("token");
        String newPassword = body.get("newPassword");

        boolean resetSuccessful =
                resetPasswordService.resetPassword(
                        token,
                        newPassword
                );

        if (!resetSuccessful) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "status", 400,
                                    "message",
                                    "El token es inválido o ha expirado."
                            )
                    );
        }

        return ResponseEntity.ok(
                Map.of(
                        "status", 200,
                        "message",
                        "La contraseña fue actualizada correctamente."
                )
        );
    }
}

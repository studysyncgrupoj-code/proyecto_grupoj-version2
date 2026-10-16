package com.studysync.controller.auth;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studysync.dto.auth.ResetPasswordRequest;
import com.studysync.service.auth.ResetPasswordService;

import jakarta.validation.Valid;

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
            @Valid @RequestBody ResetPasswordRequest request
    ) {

        boolean resetSuccessful =
                resetPasswordService.resetPassword(
                        request.token(),
                        request.newPassword()
                );

        if (!resetSuccessful) {

            Map<String, Object> error = new LinkedHashMap<>();
            error.put("code", "INVALID_RESET_TOKEN");
            error.put(
                    "message",
                    "El token de recuperación no es válido o ha expirado."
            );
            error.put("details", null);

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", error));
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

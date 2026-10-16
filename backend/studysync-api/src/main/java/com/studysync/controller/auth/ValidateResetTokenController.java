package com.studysync.controller.auth;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studysync.service.auth.ValidateResetTokenService;

@RestController
@RequestMapping("/auth")
public class ValidateResetTokenController {

    private final ValidateResetTokenService validateResetTokenService;

    public ValidateResetTokenController(
            ValidateResetTokenService validateResetTokenService
    ) {
        this.validateResetTokenService = validateResetTokenService;
    }

    @PostMapping("/validate-reset-token")
    public ResponseEntity<Map<String, Object>> validateToken(
            @RequestBody Map<String, String> body
    ) {

        String token =
                body != null
                        ? body.get("token")
                        : null;

        boolean valid =
                validateResetTokenService.isValid(token);

        if (!valid) {

            Map<String, Object> error =
                    new LinkedHashMap<>();

            error.put(
                    "code",
                    "INVALID_RESET_TOKEN"
            );

            error.put(
                    "message",
                    "El token de recuperación no es válido o ha expirado."
            );

            error.put(
                    "details",
                    null
            );

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "error",
                                    error
                            )
                    );
        }

        return ResponseEntity.ok(
                Map.of(
                        "valid",
                        true
                )
        );
    }
}

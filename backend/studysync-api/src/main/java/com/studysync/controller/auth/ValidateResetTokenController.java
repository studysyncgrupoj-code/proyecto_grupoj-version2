package com.studysync.controller.auth;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

        String token = body.get("token");

        boolean valid = validateResetTokenService.isValid(token);

        if (!valid) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "valid", false,
                            "message", "El token es inválido o ha expirado."
                    ));
        }

        return ResponseEntity.ok(Map.of(
                "valid", true,
                "message", "El token es válido."
        ));
    }
}
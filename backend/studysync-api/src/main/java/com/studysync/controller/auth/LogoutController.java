package com.studysync.controller.auth;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.studysync.security.jwt.JwtService;
import com.studysync.service.auth.JwtRevocationService;

@RestController
@RequestMapping("/auth")
public class LogoutController {

    private final JwtService jwtService;
    private final JwtRevocationService jwtRevocationService;

    public LogoutController(
            JwtService jwtService,
            JwtRevocationService jwtRevocationService
    ) {
        this.jwtService = jwtService;
        this.jwtRevocationService = jwtRevocationService;
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(
            @RequestBody Map<String, String> request
    ) {

        String refreshToken = request.get("refreshToken");

        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "status", 401,
                            "message", "Refresh token requerido."
                    ));
        }

        refreshToken = refreshToken.trim();

        if (jwtRevocationService.isRevoked(refreshToken)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "status", 401,
                            "message", "Refresh token ya revocado."
                    ));
        }

        if (jwtService.validateRefreshToken(refreshToken) == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "status", 401,
                            "message",
                            "Refresh token inválido o expirado."
                    ));
        }

        long remainingMillis =
                jwtService.getRemainingRefreshValidityMillis(
                        refreshToken
                );

        if (remainingMillis > 0) {
            jwtRevocationService.revoke(
                    refreshToken,
                    remainingMillis
            );
        }

        return ResponseEntity.ok(
                Map.of(
                        "status", 200,
                        "message",
                        "Sesión cerrada correctamente."
                )
        );
    }
}

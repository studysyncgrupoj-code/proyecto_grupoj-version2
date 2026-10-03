package com.studysync.controller.auth;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
            @RequestHeader(
                    value = "Authorization",
                    required = false
            ) String authorizationHeader
    ) {

        if (authorizationHeader == null
                || !authorizationHeader.startsWith("Bearer ")) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "status", 401,
                            "message", "Token de autenticación requerido."
                    ));
        }

        String token = authorizationHeader.substring(7).trim();

        if (token.isBlank() || jwtService.validateToken(token) == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "status", 401,
                            "message", "Token inválido o expirado."
                    ));
        }

        long remainingMillis =
                jwtService.getRemainingValidityMillis(token);

        if (remainingMillis > 0) {
            jwtRevocationService.revoke(
                    token,
                    remainingMillis
            );
        }

        return ResponseEntity.ok(
                Map.of(
                        "status", 200,
                        "message", "Sesión cerrada correctamente."
                )
        );
    }
}

package com.studysync.controller.auth;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.studysync.dto.auth.LoginRequest;
import com.studysync.security.jwt.JwtService;
import com.studysync.service.auth.LoginService;

@RestController
@RequestMapping("/auth")
public class LoginController {

    private final LoginService loginService;
    private final JwtService jwtService;

    public LoginController(
            LoginService loginService,
            JwtService jwtService
    ) {
        this.loginService = loginService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request
    ) {
        try {
            LoginService.LoginResult result =
                    loginService.login(
                            request.email(),
                            request.password()
                    );

            if (result == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of(
                                "status", 401,
                                "message", "Credenciales inválidas."
                        ));
            }

            String token =
                    jwtService.generateToken(
                            result.authAccount()
                    );

            String refreshToken =
                    jwtService.generateRefreshToken(
                            result.authAccount()
                    );

            Map<String, Object> data =
                    new LinkedHashMap<>();

            data.put(
                    "firstName",
                    result.profile().getNombre()
            );

            data.put(
                    "lastName",
                    result.profile().getApellidos()
            );

            data.put(
                    "id",
                    result.authAccount().getId().toString()
            );

            data.put(
                    "role",
                    result.authAccount()
                            .getRole()
                            .name()
                            .toLowerCase()
            );

            data.put(
                    "image",
                    result.profile().getImage()
            );

            data.put(
                    "token",
                    token
            );

            data.put(
                    "refreshToken",
                    refreshToken
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
             * subscription solamente existe para estudiantes.
             */
            if (result.subscription() != null) {
                data.put(
                        "subscription",
                        result.subscription()
                                .name()
                                .toLowerCase()
                );
            }

            return ResponseEntity.ok(
                    Map.of(
                            "status", 200,
                            "message",
                            "Credenciales válidas.",
                            "data", data
                    )
            );

        } catch (
                LoginService.AccountInactiveException e
        ) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "status", 403,
                            "message",
                            "La cuenta se encuentra inactiva."
                    ));
        }
    }
}

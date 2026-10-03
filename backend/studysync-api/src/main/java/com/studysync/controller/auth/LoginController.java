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
                    "nombre",
                    result.profile().getNombre()
            );

            data.put(
                    "apellidos",
                    result.profile().getApellidos()
            );

            // UUID siempre como String
            data.put(
                    "uuid",
                    result.authAccount().getId().toString()
            );

            data.put(
                    "rol",
                    result.authAccount().getRole().name()
            );

            data.put("token", token);
            data.put("tokenType", "Bearer");
            data.put(
                    "expiresIn",
                    jwtService.getExpirationSeconds()
            );

            data.put("refreshToken", refreshToken);
            data.put(
                    "refreshExpiresIn",
                    jwtService.getRefreshExpirationSeconds()
            );

            // Siempre enviar image
            String image = result.profile().getImage();

            data.put(
                    "image",
                    image != null ? image : ""
            );

            // Siempre enviar subscription
            String subscription = "";

            if (result.subscription() != null) {
                subscription =
                        result.subscription()
                                .name()
                                .toLowerCase();
            }

            data.put(
                    "subscription",
                    subscription
            );

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
                  

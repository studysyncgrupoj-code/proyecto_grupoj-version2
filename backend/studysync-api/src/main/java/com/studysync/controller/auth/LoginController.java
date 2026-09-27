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

            Map<String, Object> data =
                    new LinkedHashMap<>();

            data.put("nombre", result.profile().getNombre());
            data.put("apellidos", result.profile().getApellidos());
            data.put("uuid", result.authAccount().getId());

            data.put(
                    "rol",
                    result.authAccount().getRole().name()
            );

            data.put("token", token);
            data.put("tokenType", "Bearer");
            data.put("expiresIn", 3600);

            String image = result.profile().getImage();

            if (image != null && !image.isBlank()) {
                data.put("image", image);
            }

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
                            "message", "Credenciales válidas.",
                            "data", data
                    )
            );

        } catch (LoginService.AccountInactiveException e) {

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
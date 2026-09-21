package com.studysync.controller.auth;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studysync.service.auth.LoginService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class LoginController {

    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    // TODO: Reemplazar Map<String, Object> por un objeto DTO fuertemente tipado
    // para mejorar la validación automática con @Valid.
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, Object> body
    ) {
        String email = body.get("email") != null
                ? body.get("email").toString()
                : null;

        String contrasena = null;

        if (body.get("contrasena") != null) {
            contrasena = body.get("contrasena").toString();
        } else if (body.get("password") != null) {
            contrasena = body.get("password").toString();
        }

        try {
            LoginService.LoginResult result = loginService.login(
                    email,
                    contrasena
            );

            if (result == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(
                                Map.of(
                                        "status", 401,
                                        "message", "Credenciales inválidas."
                                )
                        );
            }

            Map<String, Object> data = new LinkedHashMap<>();

            data.put("nombre", result.profile().getNombre());
            data.put("apellidos", result.profile().getApellidos());
            data.put("uuid", result.authAccount().getId());

            // El rol se obtiene de AuthAccount
            data.put("rol", result.authAccount().getRole().name());

            // La imagen solo se incluye si existe y contiene una URL
            String image = result.profile().getImage();

            if (image != null && !image.isBlank()) {
                data.put("image", image);
            }

            // La suscripción solo se incluye para usuarios STUDENT
            if (result.subscription() != null) {
                data.put(
                        "subscription",
                        result.subscription().name().toLowerCase()
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
            // TODO: Extraer el manejo de excepciones local (try-catch)
            // y centralizarlo en un @RestControllerAdvice global.
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            Map.of(
                                    "status", 403,
                                    "message", "La cuenta se encuentra inactiva."
                            )
                    );
        }
    }
}
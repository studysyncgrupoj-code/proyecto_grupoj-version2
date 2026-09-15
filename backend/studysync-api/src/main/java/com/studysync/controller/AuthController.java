package com.studysync.controller;

import com.studysync.model.UserProfile;
import com.studysync.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody Map<String, Object> body
    ) {
        try {

            String nombre =
                    body.get("nombre") != null
                            ? body.get("nombre").toString()
                            : null;

            String apellidos = null;

            if (body.get("apellidos") != null) {
                apellidos = body.get("apellidos").toString();
            } else if (body.get("apellido") != null) {
                apellidos = body.get("apellido").toString();
            }

            String email =
                    body.get("email") != null
                            ? body.get("email").toString()
                            : null;

            String contrasena = null;

            if (body.get("contrasena") != null) {
                contrasena = body.get("contrasena").toString();
            } else if (body.get("password") != null) {
                contrasena = body.get("password").toString();
            }

            UserProfile profile =
                    authService.register(
                            nombre,
                            apellidos,
                            email,
                            contrasena
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            Map.of(
                                    "status", 201,
                                    "message",
                                    "Usuario registrado exitosamente.",
                                    "uuid",
                                    profile.getUserId()
                            )
                    );

        } catch (IllegalStateException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                            Map.of(
                                    "status", 409,
                                    "message", e.getMessage()
                            )
                    );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "status", 400,
                                    "message", e.getMessage()
                            )
                    );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, Object> body
    ) {

        String email =
                body.get("email") != null
                        ? body.get("email").toString()
                        : null;

        String contrasena = null;

        if (body.get("contrasena") != null) {
            contrasena = body.get("contrasena").toString();
        } else if (body.get("password") != null) {
            contrasena = body.get("password").toString();
        }

        try {

            AuthService.LoginResult result =
                    authService.login(
                            email,
                            contrasena
                    );

            if (result == null) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(
                                Map.of(
                                        "status", 401,
                                        "message",
                                        "Credenciales inválidas."
                                )
                        );
            }

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

            data.put(
                    "uuid",
                    result.authAccount().getId()
            );

            data.put(
                    "rol",
                    result.profile().getRol().name()
            );

            return ResponseEntity.ok(
                    Map.of(
                            "status", 200,
                            "message",
                            "Credenciales válidas.",
                            "data", data
                    )
            );

        } catch (AuthService.AccountInactiveException e) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            Map.of(
                                    "status", 403,
                                    "message",
                                    "La cuenta se encuentra inactiva."
                            )
                    );
        }
    }
}
package com.studysync.controller;

import com.studysync.model.User;
import com.studysync.security.JwtService;
import com.studysync.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(
            UserService userService,
            JwtService jwtService
    ) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        try {

            if (user.getActivo() == null) {
                user.setActivo(true);
            }

            if (user.getRol() == null || user.getRol().isBlank()) {
                user.setRol("ESTUDIANTE");
            }

            User savedUser = userService.saveUser(user);
            savedUser.setPassword(null);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedUser);

        } catch (IllegalStateException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage()));

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> credentials
    ) {

        User user = userService.login(
                credentials.get("email"),
                credentials.get("password")
        );

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Credenciales incorrectas"
                    ));
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRol()
        );

        user.setPassword(null);

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put("token", token);
        response.put("user", user);

        return ResponseEntity.ok(response);
    }
}
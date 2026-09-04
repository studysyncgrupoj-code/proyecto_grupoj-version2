package com.studysync.controller;

import com.studysync.model.User;
import com.studysync.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (user.getActivo() == null) {
            user.setActivo(true);
        }

        User savedUser = userService.saveUser(user);

        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {

        String email = credentials.get("email");
        String password = credentials.get("password");

        User user = userService.login(email, password);

        if (user == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Credenciales incorrectas"));
        }

        return ResponseEntity.ok(user);
    }
}                                                                                                                                                           
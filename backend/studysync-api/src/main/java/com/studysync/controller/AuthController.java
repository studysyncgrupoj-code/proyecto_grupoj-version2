package com.studysync.controller;

import com.studysync.model.User;
import com.studysync.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        if (user.getActivo() == null) {
            user.setActivo(true);
        }

        return ResponseEntity.ok(userService.saveUser(user));
    }
}

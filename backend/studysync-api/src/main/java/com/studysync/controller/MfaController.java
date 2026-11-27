package com.studysync.controller;

import com.studysync.model.User;
import com.studysync.service.MfaService;
import com.studysync.service.UserService;
import com.studysync.service.UserSettingsService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/mfa")
public class MfaController {

    private final MfaService mfa;
    private final UserService users;
    private final UserSettingsService settings;

    public MfaController(
            MfaService mfa,
            UserService users,
            UserSettingsService settings) {
        this.mfa = mfa;
        this.users = users;
        this.settings = settings;
    }

    private boolean validPassword(User user, String password) {
        return user != null
            && password != null
            && users.login(user.getEmail(), password) != null;
    }

    @PostMapping("/setup")
    public ResponseEntity<?> setup(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {

        if (!validPassword(user, body.get("password"))) {
            return ResponseEntity.status(401).build();
        }

        settings.getByUserId(user.getId());

        if (mfa.isEnabled(user.getId())) {
            return ResponseEntity.status(409).build();
        }

        return ResponseEntity.ok()
            .header("Cache-Control", "no-store")
            .body(Map.of("secret", mfa.setup(user.getId())));
    }

    @PostMapping("/enable")
    public ResponseEntity<?> enable(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {

        if (!validPassword(user, body.get("password"))) {
            return ResponseEntity.status(401).build();
        }

        if (!mfa.enable(user.getId(), body.get("code"))) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Código inválido"));
        }

        return ResponseEntity.ok(Map.of("enabled", true));
    }

    @PostMapping("/disable")
    public ResponseEntity<?> disable(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {

        if (!validPassword(user, body.get("password"))) {
            return ResponseEntity.status(401).build();
        }

        if (!mfa.disable(user.getId(), body.get("code"))) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Código inválido"));
        }

        return ResponseEntity.ok(Map.of("enabled", false));
    }
}

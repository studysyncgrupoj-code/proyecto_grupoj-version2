package com.studysync.controller;

import com.studysync.model.UserSettings;
import com.studysync.model.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import com.studysync.service.UserSettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "http://localhost:5173")
public class UserSettingsController {

    private final UserSettingsService userSettingsService;

    public UserSettingsController(
            UserSettingsService userSettingsService) {

        this.userSettingsService = userSettingsService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<UserSettings> getSettings(
            @PathVariable Long userId,
            @AuthenticationPrincipal User currentUser) {

        validateOwner(userId, currentUser);

        return ResponseEntity.ok(
                userSettingsService.getByUserId(userId)
        );
    }

    @PutMapping("/user/{userId}")
    public ResponseEntity<UserSettings> updateSettings(
            @PathVariable Long userId,
            @RequestBody UserSettings settings,
            @AuthenticationPrincipal User currentUser) {

        validateOwner(userId, currentUser);

        return ResponseEntity.ok(
                userSettingsService.update(userId, settings)
        );
    }

    private void validateOwner(Long userId, User currentUser) {
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        if (!userId.equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }
}

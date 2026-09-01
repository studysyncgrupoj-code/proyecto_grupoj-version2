package com.studysync.controller;

import com.studysync.model.UserSettings;
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
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                userSettingsService.getByUserId(userId)
        );
    }

    @PutMapping("/user/{userId}")
    public ResponseEntity<UserSettings> updateSettings(
            @PathVariable Long userId,
            @RequestBody UserSettings settings) {

        return ResponseEntity.ok(
                userSettingsService.update(userId, settings)
        );
    }
}

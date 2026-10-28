package com.studysync.controller.profile;

import com.fasterxml.jackson.databind.JsonNode;
import com.studysync.controller.CurrentUserController;
import com.studysync.model.user.UserProfile;
import com.studysync.service.profile.ProfileService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@RequestMapping("/users/me/profile")
public class ProfileController {

    private final ProfileService profileService;
    private final CurrentUserController currentUserController;

    public ProfileController(
            ProfileService profileService,
            CurrentUserController currentUserController
    ) {
        this.profileService = profileService;
        this.currentUserController = currentUserController;
    }

    public record ProfileResponse(
            UUID id,
            String firstName,
            String lastName,
            String image
    ) {}

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(
            Authentication authentication
    ) {
        UUID userId = authenticatedUserId(authentication);

        UserProfile profile = profileService.getProfile(userId);

        return ResponseEntity.ok(
                new ProfileResponse(
                        profile.getUserId(),
                        profile.getNombre(),
                        profile.getApellidos(),
                        profile.getImage()
                )
        );
    }

    @PatchMapping
    public ResponseEntity<CurrentUserController.CurrentUserResponse> updateProfile(
            Authentication authentication,
            @RequestBody JsonNode request
    ) {
        UUID userId = authenticatedUserId(authentication);

        profileService.updateProfileContent(userId, request);

        return currentUserController.getCurrentUser(authentication);
    }

    private UUID authenticatedUserId(Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getName())) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Autenticación requerida."
            );
        }

        try {
            return UUID.fromString(authentication.getName());

        } catch (IllegalArgumentException ex) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Identidad de usuario inválida."
            );
        }
    }
}


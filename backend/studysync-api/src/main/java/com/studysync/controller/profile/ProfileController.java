package com.studysync.controller.profile;

import com.studysync.model.user.UserProfile;
import com.studysync.service.profile.ProfileService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users/me/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    public record UpdateProfileRequest(
            @Size(min = 1, max = 100) String nombre,
            @Size(min = 1, max = 100) String apellidos
    ) {}

    public record ProfileResponse(
            UUID uuid,
            String nombre,
            String apellidos,
            String avatarUrl
    ) {}

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(
            Authentication authentication
    ) {
        UUID userId = authenticatedUserId(authentication);

        return ResponseEntity.ok(
                toResponse(profileService.getProfile(userId))
        );
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        UUID userId = authenticatedUserId(authentication);

        UserProfile profile = profileService.updateProfile(
                userId,
                request.nombre(),
                request.apellidos()
        );

        return ResponseEntity.ok(toResponse(profile));
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

    private ProfileResponse toResponse(UserProfile profile) {
        return new ProfileResponse(
                profile.getUserId(),
                profile.getNombre(),
                profile.getApellidos(),
                profile.getImage()
        );
    }
}

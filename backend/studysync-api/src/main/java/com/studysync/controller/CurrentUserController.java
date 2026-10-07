package com.studysync.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.studysync.model.auth.AuthAccount;
import com.studysync.model.user.UserProfile;
import com.studysync.repository.auth.AuthAccountRepository;
import com.studysync.service.profile.ProfileService;

@RestController
@RequestMapping("/users")
public class CurrentUserController {

    private final AuthAccountRepository authAccountRepository;
    private final ProfileService profileService;

    public CurrentUserController(
            AuthAccountRepository authAccountRepository,
            ProfileService profileService
    ) {
        this.authAccountRepository = authAccountRepository;
        this.profileService = profileService;
    }

    public record ProfileResponse(
            String bio,
            String[] interests
    ) {}

    public record CurrentUserResponse(
            String id,
            String name,
            String email,
            String image,
            String role,
            ProfileResponse profile
    ) {}

    @GetMapping("/me")
    public ResponseEntity<CurrentUserResponse> getCurrentUser(
            Authentication authentication
    ) {
        UUID userId = authenticatedUserId(authentication);

        AuthAccount account = authAccountRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuario no encontrado."
                ));

        UserProfile profile = profileService.getProfile(userId);

        String name = (
                profile.getNombre() + " " + profile.getApellidos()
        ).trim();

        String role = account.getRole()
                .name()
                .toLowerCase();

        CurrentUserResponse response =
                new CurrentUserResponse(
                        account.getId().toString(),
                        name,
                        account.getEmail(),
                        profile.getImage(),
                        role,
                        new ProfileResponse(
                                null,
                                new String[0]
                        )
                );

        return ResponseEntity.ok(response);
    }

    private UUID authenticatedUserId(
            Authentication authentication
    ) {
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

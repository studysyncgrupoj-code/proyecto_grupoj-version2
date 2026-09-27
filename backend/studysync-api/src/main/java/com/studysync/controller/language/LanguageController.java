package com.studysync.controller.language;

import com.studysync.service.language.LanguageService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class LanguageController {

    private final LanguageService languageService;

    public LanguageController(LanguageService languageService) {
        this.languageService = languageService;
    }

    @GetMapping("/languages")
    public ResponseEntity<Map<String, List<String>>> getLanguages() {
        return ResponseEntity.ok(
                Map.of("languages", languageService.getAvailableLanguages())
        );
    }

    @GetMapping("/users/me/language")
    public ResponseEntity<Map<String, String>> getUserLanguage(
            Authentication authentication) {

        UUID userId = authenticatedUserId(authentication);

        return ResponseEntity.ok(
                Map.of("language", languageService.getUserLanguage(userId))
        );
    }

    @PutMapping("/users/me/language")
    public ResponseEntity<Map<String, String>> updateLanguage(
            Authentication authentication,
            @RequestBody Map<String, String> request) {

        UUID userId = authenticatedUserId(authentication);

        String language = request.get("language");

        if (language == null ||
                !languageService.getAvailableLanguages().contains(language)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Idioma no admitido. Utiliza es o en."
            );
        }

        String updatedLanguage =
                languageService.updateUserLanguage(userId, language);

        return ResponseEntity.ok(
                Map.of("language", updatedLanguage)
        );
    }

    private UUID authenticatedUserId(Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                "anonymousUser".equals(authentication.getPrincipal())) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Autenticación requerida."
            );
        }

        try {
            return UUID.fromString(authentication.getName());
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Identidad de usuario inválida."
            );
        }
    }
}

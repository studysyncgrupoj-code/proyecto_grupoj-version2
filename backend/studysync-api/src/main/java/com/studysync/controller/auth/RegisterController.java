package com.studysync.controller.auth;

import com.studysync.dto.auth.RegisterRequest;
import com.studysync.service.auth.EmailVerificationService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class RegisterController {

    private final EmailVerificationService verificationService;

    public RegisterController(
            EmailVerificationService verificationService
    ) {
        this.verificationService = verificationService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        boolean sent =
                verificationService.requestVerification(request);

        if (!sent) {
            return ResponseEntity
                    .status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of(
                            "status", 503,
                            "message",
                            "No fue posible enviar el correo de verificación."
                    ));
        }

        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(Map.of(
                        "status", 202,
                        "message",
                        "Revisa tu correo electrónico para completar el registro."
                ));
    }
}
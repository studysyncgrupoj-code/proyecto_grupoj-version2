package com.studysync.controller.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studysync.dto.auth.RegisterRequest;
import com.studysync.dto.auth.RegisterResponse;
import com.studysync.model.user.UserProfile;
import com.studysync.service.auth.RegisterService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class RegisterController {

    private final RegisterService registerService;

    public RegisterController(RegisterService registerService) {
        this.registerService = registerService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        UserProfile profile = registerService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new RegisterResponse(
                        HttpStatus.CREATED.value(),
                        "Usuario registrado exitosamente.",
                        profile.getUserId()
                ));
    }
}

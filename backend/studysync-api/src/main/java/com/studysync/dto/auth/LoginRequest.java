package com.studysync.dto.auth;

import com.fasterxml.jackson.annotation.JsonAlias;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(

    @NotBlank(message = "El correo es obligatorio.")
    @Email(message = "El correo no es válido.")
    String email,

    @JsonAlias("contrasena")
    @NotBlank(message = "La contraseña es obligatoria.")
    String password

) {
}
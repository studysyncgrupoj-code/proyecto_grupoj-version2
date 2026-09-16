package com.studysync.dto.auth;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@JsonIgnoreProperties(ignoreUnknown = true)
public record RegisterRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
        @Pattern(
                regexp = "[\\p{L}\\s'\\-.]+",
                message = "El nombre solo puede contener letras, espacios, apóstrofes, guiones y puntos"
        )
        String nombre,

        @NotBlank(message = "Los apellidos son obligatorios")
        @Size(min = 2, max = 100, message = "Los apellidos deben tener entre 2 y 100 caracteres")
        @Pattern(
                regexp = "[\\p{L}\\s'\\-.]+",
                message = "Los apellidos solo pueden contener letras, espacios, apóstrofes, guiones y puntos"
        )
        @JsonAlias("apellido")
        String apellidos,

        @NotBlank(message = "El correo electrónico es obligatorio")
        @Email(message = "El correo electrónico no es válido")
        @Size(max = 254, message = "El correo no puede exceder los 254 caracteres")
        String email,

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 6, max = 15, message = "La contraseña debe tener entre 6 y 15 caracteres")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:'\",.<>/?\\\\|`~]).*$",
                message = "La contraseña debe contener al menos una letra minúscula, una mayúscula y un caracter especial"
        )
        @JsonAlias("password")
        String contrasena
) {
    public RegisterRequest {
        nombre = nombre != null ? nombre.trim() : null;
        apellidos = apellidos != null ? apellidos.trim() : null;
        email = email != null ? email.trim().toLowerCase() : null;
    }
}

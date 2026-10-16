package com.studysync.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(

        @NotBlank(message = "El token es obligatorio.")
        String token,

        @NotBlank(message = "La nueva contraseña es obligatoria.")
        @Size(
                min = 6,
                max = 15,
                message = "La contraseña debe tener entre 6 y 15 caracteres."
        )
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:'\",.<>/?\\\\|`~]).*$",
                message = "La contraseña debe contener al menos una letra minúscula, una mayúscula y un carácter especial."
        )
        String newPassword
) {
}

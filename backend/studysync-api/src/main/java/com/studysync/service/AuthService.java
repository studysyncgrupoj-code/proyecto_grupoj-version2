package com.studysync.service;

import com.studysync.model.AuthAccount;
import com.studysync.model.Role;
import com.studysync.model.UserProfile;
import com.studysync.repository.AuthAccountRepository;
import com.studysync.repository.UserProfileRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthAccountRepository authAccountRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AuthAccountRepository authAccountRepository,
            UserProfileRepository userProfileRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.authAccountRepository = authAccountRepository;
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserProfile register(
            String nombre,
            String apellidos,
            String email,
            String contrasena
    ) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }

        if (apellidos == null || apellidos.isBlank()) {
            throw new IllegalArgumentException("Los apellidos son obligatorios");
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("El correo electrónico es obligatorio");
        }

        if (contrasena == null || contrasena.isBlank()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }

        String emailNormalizado = email.trim().toLowerCase();

        if (authAccountRepository.existsByEmailIgnoreCase(emailNormalizado)) {
            throw new IllegalStateException(
                    "El correo electrónico ya se encuentra registrado. Por favor, inicia sesión."
            );
        }

        AuthAccount authAccount = new AuthAccount();
        authAccount.setEmail(emailNormalizado);
        authAccount.setPasswordHash(
                passwordEncoder.encode(contrasena)
        );

        // Temporal:
        // cuando se implemente validación por correo,
        // este valor deberá iniciar en false.
        authAccount.setActive(true);

        AuthAccount savedAuth =
                authAccountRepository.save(authAccount);

        UserProfile profile = new UserProfile();
        profile.setUserId(savedAuth.getId());
        profile.setNombre(nombre.trim());
        profile.setApellidos(apellidos.trim());
        profile.setRol(Role.STUDENT);

        return userProfileRepository.save(profile);
    }

    public LoginResult login(
            String email,
            String contrasena
    ) {
        if (email == null ||
                email.isBlank() ||
                contrasena == null ||
                contrasena.isBlank()) {
            return null;
        }

        String emailNormalizado =
                email.trim().toLowerCase();

        AuthAccount authAccount =
                authAccountRepository
                        .findByEmailIgnoreCase(emailNormalizado)
                        .orElse(null);

        if (authAccount == null) {
            return null;
        }

        if (!Boolean.TRUE.equals(authAccount.getActive())) {
            throw new AccountInactiveException();
        }

        boolean passwordValida =
                passwordEncoder.matches(
                        contrasena,
                        authAccount.getPasswordHash()
                );

        if (!passwordValida) {
            return null;
        }

        UserProfile profile =
                userProfileRepository
                        .findById(authAccount.getId())
                        .orElse(null);

        if (profile == null) {
            return null;
        }

        return new LoginResult(
                authAccount,
                profile
        );
    }

    public record LoginResult(
            AuthAccount authAccount,
            UserProfile profile
    ) {
    }

    public static class AccountInactiveException
            extends RuntimeException {
    }
}
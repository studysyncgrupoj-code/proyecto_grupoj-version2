package com.studysync.service;

import com.studysync.model.User;
import com.studysync.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User saveUser(User user) {

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalArgumentException(
                    "El correo electrónico es obligatorio"
            );
        }

        String emailNormalizado =
                user.getEmail().trim().toLowerCase();

        user.setEmail(emailNormalizado);

        if (user.getId() == null) {

            if (userRepository.findByEmail(emailNormalizado).isPresent()) {
                throw new IllegalStateException(
                        "El correo ya está registrado"
                );
            }

            if (user.getPassword() == null ||
                    user.getPassword().isBlank()) {

                throw new IllegalArgumentException(
                        "La contraseña es obligatoria"
                );
            }

            // Los usuarios nuevos quedan protegidos con BCrypt.
            user.setPassword(
                    passwordEncoder.encode(user.getPassword())
            );
        }

        return userRepository.save(user);
    }

    public User login(String email, String password) {

        if (email == null || password == null) {
            return null;
        }

        String emailNormalizado =
                email.trim().toLowerCase();

        User user = userRepository
                .findByEmail(emailNormalizado)
                .orElse(null);

        if (user == null ||
                !Boolean.TRUE.equals(user.getActivo()) ||
                user.getPassword() == null) {

            return null;
        }

        String storedPassword = user.getPassword();

        boolean passwordCorrecta;

        /*
         * Usuarios nuevos:
         * contraseña almacenada mediante BCrypt.
         */
        if (storedPassword.startsWith("$2a$") ||
                storedPassword.startsWith("$2b$") ||
                storedPassword.startsWith("$2y$")) {

            passwordCorrecta =
                    passwordEncoder.matches(
                            password,
                            storedPassword
                    );

        } else {

            /*
             * Compatibilidad con los usuarios creados antes
             * de implementar BCrypt.
             */
            passwordCorrecta =
                    storedPassword.equals(password);

            /*
             * Si el usuario antiguo inicia sesión correctamente,
             * migramos automáticamente su contraseña a BCrypt.
             */
            if (passwordCorrecta) {

                user.setPassword(
                        passwordEncoder.encode(password)
                );

                userRepository.save(user);
            }
        }

        return passwordCorrecta ? user : null;
    }
}
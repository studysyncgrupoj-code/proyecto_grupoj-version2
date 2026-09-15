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

        String email = user.getEmail().trim().toLowerCase();
        user.setEmail(email);

        if (user.getId() == null) {

            if (userRepository.findByEmail(email).isPresent()) {
                throw new IllegalStateException(
                        "El correo ya está registrado"
                );
            }

            if (user.getPassword() == null || user.getPassword().isBlank()) {
                throw new IllegalArgumentException(
                        "La contraseña es obligatoria"
                );
            }

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

        User user = userRepository
                .findByEmail(email.trim().toLowerCase())
                .orElse(null);

        if (user == null
                || !Boolean.TRUE.equals(user.getActivo())
                || user.getPassword() == null) {
            return null;
        }

        String almacenada = user.getPassword();

        boolean correcta;

        if (almacenada.startsWith("$2a$")
                || almacenada.startsWith("$2b$")
                || almacenada.startsWith("$2y$")) {

            correcta = passwordEncoder.matches(
                    password,
                    almacenada
            );

        } else {

            correcta = almacenada.equals(password);

            if (correcta) {
                user.setPassword(
                        passwordEncoder.encode(password)
                );
                userRepository.save(user);
            }
        }

        return correcta ? user : null;
    }
}
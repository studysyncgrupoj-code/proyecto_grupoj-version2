
package com.studysync.service;

import com.studysync.model.User;
import com.studysync.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User saveUser(User user) {
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new IllegalArgumentException(
                    "La contraseña es obligatoria"
            );
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }

    public Optional<User> updateUser(Long id, User userDetails) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setNombre(userDetails.getNombre());
                    user.setApellido(userDetails.getApellido());
                    user.setEmail(userDetails.getEmail());

                    if (userDetails.getPassword() != null &&
                            !userDetails.getPassword().isBlank()) {
                        user.setPassword(
                                passwordEncoder.encode(
                                        userDetails.getPassword()
                                )
                        );
                    }

                    user.setRol(userDetails.getRol());
                    user.setActivo(userDetails.getActivo());

                    return userRepository.save(user);
                });
    }

    public boolean deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            return false;
        }

        userRepository.deleteById(id);
        return true;
    }

    public User login(String email, String password) {
        if (email == null || password == null) {
            return null;
        }

        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword() != null)
                .filter(user -> Boolean.TRUE.equals(user.getActivo()))
                .filter(user -> passwordEncoder.matches(
                        password,
                        user.getPassword()
                ))
                .orElse(null);
    }
}

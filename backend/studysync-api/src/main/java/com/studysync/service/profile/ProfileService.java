package com.studysync.service.profile;

import com.studysync.model.user.UserProfile;
import com.studysync.repository.UserProfileRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class ProfileService {

    private final UserProfileRepository profileRepository;

    public ProfileService(UserProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public UserProfile getProfile(UUID userId) {
        return findProfile(userId);
    }

    @Transactional
    public UserProfile updateProfile(
            UUID userId,
            String nombre,
            String apellidos
    ) {
        UserProfile profile = findProfile(userId);

        if (nombre != null) {
            String value = nombre.trim();

            if (value.isEmpty() || value.length() > 100) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "El nombre debe tener entre 1 y 100 caracteres."
                );
            }

            profile.setNombre(value);
        }

        if (apellidos != null) {
            String value = apellidos.trim();

            if (value.isEmpty() || value.length() > 100) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Los apellidos deben tener entre 1 y 100 caracteres."
                );
            }

            profile.setApellidos(value);
        }

        return profileRepository.save(profile);
    }

    private UserProfile findProfile(UUID userId) {
        return profileRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Perfil no encontrado."
                ));
    }
}

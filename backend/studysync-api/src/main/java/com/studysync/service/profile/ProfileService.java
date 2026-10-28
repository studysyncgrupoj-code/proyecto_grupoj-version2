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


    @Transactional
    public UserProfile updateProfileContent(
            UUID userId,
            com.fasterxml.jackson.databind.JsonNode body
    ) {
        if (body == null || !body.isObject()) {
            throw validationError("El cuerpo debe ser un objeto JSON.");
        }

        java.util.Iterator<String> fields = body.fieldNames();
        while (fields.hasNext()) {
            String field = fields.next();
            if (!java.util.Set.of("bio", "interests", "image").contains(field)) {
                throw validationError("Campo no permitido: " + field);
            }
        }

        UserProfile profile = findProfile(userId);

        if (body.has("bio")) {
            var bioNode = body.get("bio");

            if (bioNode.isNull()) {
                profile.setBio(null);
            } else {
                if (!bioNode.isObject()) {
                    throw validationError("bio debe ser un objeto o null.");
                }

                java.util.Iterator<String> bioFields = bioNode.fieldNames();
                while (bioFields.hasNext()) {
                    String field = bioFields.next();
                    if (!java.util.Set.of("title", "description").contains(field)) {
                        throw validationError("Campo bio no permitido: " + field);
                    }
                }

                var bio = profile.getBio() == null
                        ? new com.studysync.model.user.UserBio()
                        : profile.getBio();

                if (bioNode.has("title")) {
                    bio.setTitle(validateNullableText(
                            bioNode.get("title"), "bio.title", 100));
                }

                if (bioNode.has("description")) {
                    bio.setDescription(validateNullableText(
                            bioNode.get("description"), "bio.description", 500));
                }

                profile.setBio(bio);
            }
        }

        if (body.has("interests")) {
            var interestsNode = body.get("interests");

            if (interestsNode.isNull()) {
                profile.setInterests(java.util.List.of());
            } else {
                if (!interestsNode.isArray() || interestsNode.size() > 20) {
                    throw validationError("interests debe tener máximo 20 elementos.");
                }

                java.util.List<String> interests = new java.util.ArrayList<>();

                for (var item : interestsNode) {
                    interests.add(validateNullableText(item, "interest", 40));
                }

                profile.setInterests(interests);
            }
        }

        if (body.has("image")) {
            var imageNode = body.get("image");

            if (imageNode.isNull()) {
                profile.setImage(null);
            } else {
                if (!imageNode.isTextual()) {
                    throw validationError("image debe ser texto o null.");
                }

                String image = imageNode.asText();

                boolean validUrl = image.matches("^https?://[^\\s]+$");
                boolean validDataUri = image.matches(
                        "^data:image/[A-Za-z0-9.+-]+;base64,[A-Za-z0-9+/=]+$");

                if (!validUrl && !validDataUri) {
                    throw validationError("Formato de imagen inválido.");
                }

                profile.setImage(image);
            }
        }

        return profileRepository.save(profile);
    }

    private String validateNullableText(
            com.fasterxml.jackson.databind.JsonNode node,
            String field,
            int maxLength
    ) {
        if (node.isNull()) {
            if ("interest".equals(field)) {
                throw validationError("Los intereses no pueden ser null.");
            }
            return null;
        }

        if (!node.isTextual()) {
            throw validationError(field + " debe ser texto.");
        }

        String value = node.asText().trim();

        if (value.isEmpty() || value.length() > maxLength) {
            throw validationError(
                    field + " debe tener entre 1 y " + maxLength + " caracteres.");
        }

        return value;
    }

    private ResponseStatusException validationError(String message) {
        return new ResponseStatusException(
                HttpStatus.UNPROCESSABLE_ENTITY, message);
    }

    private UserProfile findProfile(UUID userId) {
        return profileRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Perfil no encontrado."
                ));
    }
}

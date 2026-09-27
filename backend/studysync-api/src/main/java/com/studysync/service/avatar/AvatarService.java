package com.studysync.service.avatar;

import com.studysync.model.user.UserProfile;
import com.studysync.repository.UserProfileRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class AvatarService {

    private static final long MAX_FILE_SIZE = 4L * 1024 * 1024;

    private final UserProfileRepository profileRepository;
    private final Path uploadDirectory;
    private final String publicBaseUrl;

    public AvatarService(
            UserProfileRepository profileRepository,
            @Value("${app.avatar.upload-dir:uploads/avatars}")
            String uploadDir,
            @Value("${app.avatar.public-base-url:http://localhost:8080}")
            String publicBaseUrl
    ) {
        this.profileRepository = profileRepository;
        this.uploadDirectory = Path.of(uploadDir)
                .toAbsolutePath()
                .normalize();

        this.publicBaseUrl =
                publicBaseUrl.replaceAll("/+$", "");
    }

    @Transactional
    public String uploadAvatar(
            UUID userId,
            MultipartFile avatar
    ) {

        UserProfile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "El usuario no existe."
                ));

        if (avatar == null || avatar.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Debes seleccionar una imagen."
            );
        }

        if (avatar.getSize() > MAX_FILE_SIZE) {
            throw new ResponseStatusException(
                    HttpStatus.PAYLOAD_TOO_LARGE,
                    "La imagen no puede superar los 4 MB."
            );
        }

        String extension;

        try (InputStream input = avatar.getInputStream()) {

            byte[] header = input.readNBytes(32);

            extension = detectImageType(header);

        } catch (IOException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No fue posible leer la imagen."
            );
        }

        if (extension == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Solo se permiten imágenes JPG, PNG o WEBP."
            );
        }

        String filename = UUID.randomUUID() + "." + extension;

        Path destination = uploadDirectory
                .resolve(filename)
                .normalize();

        if (!destination.startsWith(uploadDirectory)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Nombre de archivo inválido."
            );
        }

        String previousImage = profile.getImage();

        try {

            Files.createDirectories(uploadDirectory);

            try (InputStream input = avatar.getInputStream()) {

                Files.copy(
                        input,
                        destination,
                        StandardCopyOption.REPLACE_EXISTING
                );
            }

        } catch (IOException ex) {

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "No fue posible guardar la imagen."
            );
        }

        String avatarUrl =
                publicBaseUrl + "/uploads/avatars/" + filename;

        try {

            profile.setImage(avatarUrl);

            profileRepository.saveAndFlush(profile);

        } catch (RuntimeException ex) {

            try {
                Files.deleteIfExists(destination);
            } catch (IOException ignored) {
                // El archivo pendiente podrá limpiarse posteriormente.
            }

            throw ex;
        }

        deletePreviousImage(previousImage);

        return avatarUrl;
    }

    @Transactional
    public void deleteAvatar(UUID userId) {

        UserProfile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "El usuario no existe."
                ));

        String previousImage = profile.getImage();

        profile.setImage(null);

        profileRepository.saveAndFlush(profile);

        deletePreviousImage(previousImage);
    }

    private void deletePreviousImage(String imageUrl) {

        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }

        String prefix =
                publicBaseUrl + "/uploads/avatars/";

        if (!imageUrl.startsWith(prefix)) {
            return;
        }

        String filename = imageUrl.substring(prefix.length());

        if (!filename.matches(
                "[0-9a-fA-F-]{36}\\.(jpg|png|webp)"
        )) {
            return;
        }

        Path previousFile = uploadDirectory
                .resolve(filename)
                .normalize();

        if (!previousFile.startsWith(uploadDirectory)) {
            return;
        }

        try {
            Files.deleteIfExists(previousFile);
        } catch (IOException ignored) {
            // La limpieza de archivos fallidos puede hacerse posteriormente.
        }
    }

    private String detectImageType(byte[] header) {

        if (header.length >= 3
                && (header[0] & 0xFF) == 0xFF
                && (header[1] & 0xFF) == 0xD8
                && (header[2] & 0xFF) == 0xFF) {

            return "jpg";
        }

        if (header.length >= 8
                && (header[0] & 0xFF) == 0x89
                && header[1] == 0x50
                && header[2] == 0x4E
                && header[3] == 0x47
                && header[4] == 0x0D
                && header[5] == 0x0A
                && header[6] == 0x1A
                && header[7] == 0x0A) {

            return "png";
        }

        if (header.length >= 12
                && header[0] == 'R'
                && header[1] == 'I'
                && header[2] == 'F'
                && header[3] == 'F'
                && header[8] == 'W'
                && header[9] == 'E'
                && header[10] == 'B'
                && header[11] == 'P') {

            return "webp";
        }

        return null;
    }
}
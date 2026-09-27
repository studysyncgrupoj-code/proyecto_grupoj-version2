package com.studysync.controller.avatar;

import com.studysync.service.avatar.AvatarService;

import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/users")
public class AvatarController {

    private final AvatarService avatarService;

    public AvatarController(AvatarService avatarService) {
        this.avatarService = avatarService;
    }

    // Verifica que el usuario autenticado sea
    // el propietario del perfil solicitado.
    private void validateOwnership(
            UUID userId,
            Authentication authentication
    ) {

        if (authentication == null
                || !authentication.isAuthenticated()
                || !userId.toString().equals(
                        authentication.getName()
                )) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "No tienes permiso para modificar este perfil."
            );
        }
    }

    // SUBIR AVATAR

    @PostMapping(
            value = "/{uuid}/avatar",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Map<String, Object>> uploadAvatar(
            @PathVariable UUID uuid,
            @RequestParam("avatar") MultipartFile avatar,
            Authentication authentication
    ) {

        validateOwnership(uuid, authentication);

        String avatarUrl = avatarService.uploadAvatar(
                uuid,
                avatar
        );

        return ResponseEntity.ok(
                Map.of(
                        "data",
                        Map.of(
                                "avatarUrl",
                                avatarUrl
                        )
                )
        );
    }

    // ELIMINAR AVATAR

    @DeleteMapping("/{uuid}/avatar")
    public ResponseEntity<Void> deleteAvatar(
            @PathVariable UUID uuid,
            Authentication authentication
    ) {

        validateOwnership(uuid, authentication);

        avatarService.deleteAvatar(uuid);

        return ResponseEntity.noContent().build();
    }
}
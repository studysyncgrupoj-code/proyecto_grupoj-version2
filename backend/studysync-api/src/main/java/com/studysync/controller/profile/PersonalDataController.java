package com.studysync.controller.profile;

import com.fasterxml.jackson.databind.JsonNode;
import com.studysync.model.user.DocumentType;
import com.studysync.model.user.UserProfile;
import com.studysync.service.profile.PersonalDataService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Iterator;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/users/me/personal-data")
public class PersonalDataController {

    private static final Set<String> ALLOWED_FIELDS = Set.of(
            "firstName",
            "lastName",
            "documentType",
            "documentId",
            "phone",
            "country",
            "address"
    );

    private final PersonalDataService personalDataService;

    public PersonalDataController(
            PersonalDataService personalDataService
    ) {
        this.personalDataService = personalDataService;
    }

    public record PersonalDataResponse(
            UUID userId,
            String firstName,
            String lastName,
            DocumentType documentType,
            String documentId,
            String phone,
            String country,
            String address,
            boolean identityLocked
    ) {}

    // =====================================================
    // GET /users/me/personal-data
    // =====================================================

    @GetMapping
    public ResponseEntity<PersonalDataResponse> getPersonalData(
            Authentication authentication
    ) {
        UUID userId = authenticatedUserId(authentication);

        UserProfile profile = personalDataService.getPersonalData(userId);

        return ResponseEntity.ok(toResponse(profile));
    }

    // =====================================================
    // PATCH /users/me/personal-data
    // =====================================================

    @PatchMapping
    public ResponseEntity<PersonalDataResponse> updatePersonalData(
            Authentication authentication,
            @RequestBody JsonNode body
    ) {
        UUID userId = authenticatedUserId(authentication);

        // Validar que el cuerpo sea un objeto JSON
        if (body == null || !body.isObject()) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "El cuerpo de la petición debe ser un objeto JSON."
            );
        }

        // =====================================================
        // VALIDAR CAMPOS PERMITIDOS
        // =====================================================

        Iterator<String> fields = body.fieldNames();

        while (fields.hasNext()) {

            String field = fields.next();

            if (!ALLOWED_FIELDS.contains(field)) {
                throw new ResponseStatusException(
                        HttpStatus.UNPROCESSABLE_ENTITY,
                        "Campo no permitido: " + field
                );
            }
        }

        // =====================================================
        // DETECTAR CAMPOS ENVIADOS
        // =====================================================

        boolean firstNameProvided = body.has("firstName");
        boolean lastNameProvided = body.has("lastName");
        boolean documentTypeProvided = body.has("documentType");
        boolean documentIdProvided = body.has("documentId");
        boolean phoneProvided = body.has("phone");
        boolean countryProvided = body.has("country");
        boolean addressProvided = body.has("address");

        // =====================================================
        // EXTRAER VALORES
        // =====================================================

        String firstName = textValue(body, "firstName");
        String lastName = textValue(body, "lastName");
        String documentId = textValue(body, "documentId");
        String phone = textValue(body, "phone");
        String country = textValue(body, "country");
        String address = textValue(body, "address");

        DocumentType documentType = enumValue(
                body,
                "documentType",
                DocumentType.class
        );

        // =====================================================
        // ACTUALIZAR DATOS PERSONALES
        // =====================================================

        UserProfile updated = personalDataService.updatePersonalData(
                userId,
                firstName,
                lastName,
                documentType,
                documentId,
                phone,
                country,
                address,
                firstNameProvided,
                lastNameProvided,
                documentTypeProvided,
                documentIdProvided,
                phoneProvided,
                countryProvided,
                addressProvided
        );

        return ResponseEntity.ok(toResponse(updated));
    }

    // =====================================================
    // VALIDAR CAMPOS DE TEXTO
    // =====================================================

    private String textValue(JsonNode body, String field) {

        JsonNode node = body.get(field);

        if (node == null || node.isNull()) {
            return null;
        }

        if (!node.isTextual()) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "El campo '" + field + "' debe ser texto o null."
            );
        }

        return node.asText();
    }

    // =====================================================
    // VALIDAR CAMPOS ENUM
    // =====================================================

    private <T extends Enum<T>> T enumValue(
            JsonNode body,
            String field,
            Class<T> enumType
    ) {

        JsonNode node = body.get(field);

        if (node == null || node.isNull()) {
            return null;
        }

        if (!node.isTextual()) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "El campo '" + field + "' debe ser un valor válido."
            );
        }

        try {
            return Enum.valueOf(
                    enumType,
                    node.asText().trim().toUpperCase()
            );

        } catch (IllegalArgumentException ex) {

            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "El valor de '" + field + "' no es válido."
            );
        }
    }

    // =====================================================
    // OBTENER USUARIO AUTENTICADO
    // =====================================================

    private UUID authenticatedUserId(Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getName())) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Autenticación requerida."
            );
        }

        try {
            return UUID.fromString(authentication.getName());

        } catch (IllegalArgumentException ex) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Identidad de usuario inválida."
            );
        }
    }

    // =====================================================
    // CONVERTIR PERFIL A RESPUESTA
    // =====================================================

    private PersonalDataResponse toResponse(UserProfile profile) {

        return new PersonalDataResponse(
                profile.getUserId(),
                profile.getNombre(),
                profile.getApellidos(),
                profile.getDocumentType(),
                profile.getDocumentId(),
                profile.getPhone(),
                profile.getCountry(),
                profile.getAddress(),
                Boolean.TRUE.equals(profile.getIdentityLocked())
        );
    }
}
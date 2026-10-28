package com.studysync.service.profile;

import com.studysync.model.user.DocumentType;
import com.studysync.model.user.UserProfile;
import com.studysync.repository.UserProfileRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class PersonalDataService {

    private static final Pattern NAME_PATTERN =
            Pattern.compile("^[\\p{L}\\s'.-]+$");

    private static final Pattern DOCUMENT_ID_PATTERN =
            Pattern.compile("^[A-Za-z0-9-]+$");

    private static final Pattern PHONE_PATTERN =
            Pattern.compile("^\\+[1-9]\\d{1,14}$");

    private static final Pattern COUNTRY_PATTERN =
            Pattern.compile("^[A-Z]{2}$");

    private static final Pattern ADDRESS_PATTERN =
            Pattern.compile("^[\\p{L}\\p{N}\\s.,\\-/#°]+$");

    private final UserProfileRepository profileRepository;

    public PersonalDataService(UserProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public UserProfile getPersonalData(UUID userId) {
        return findProfile(userId);
    }

    @Transactional
    public UserProfile updatePersonalData(
            UUID userId,
            String firstName,
            String lastName,
            DocumentType documentType,
            String documentId,
            String phone,
            String country,
            String address,
            boolean firstNameProvided,
            boolean lastNameProvided,
            boolean documentTypeProvided,
            boolean documentIdProvided,
            boolean phoneProvided,
            boolean countryProvided,
            boolean addressProvided
    ) {
        UserProfile profile = findProfile(userId);

        boolean identityFieldRequested =
                firstNameProvided
                        || lastNameProvided
                        || documentTypeProvided
                        || documentIdProvided;

        if (Boolean.TRUE.equals(profile.getIdentityLocked())
                && identityFieldRequested) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Los datos de identidad están bloqueados."
            );
        }

        if (firstNameProvided) {
            profile.setNombre(validateName(firstName));
        }

        if (lastNameProvided) {
            profile.setApellidos(validateName(lastName));
        }

        if (documentTypeProvided) {
            profile.setDocumentType(documentType);
        }

        if (documentIdProvided) {
            profile.setDocumentId(
                    validateNullableDocumentId(documentId)
            );
        }

        if (phoneProvided) {
            profile.setPhone(
                    validateNullablePhone(phone)
            );
        }

        if (countryProvided) {
            profile.setCountry(
                    validateNullableCountry(country)
            );
        }

        if (addressProvided) {
            profile.setAddress(
                    validateNullableAddress(address)
            );
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

    private String validateName(String value) {
        if (value == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "El nombre y los apellidos no pueden ser null."
            );
        }

        String normalized = value.trim();

        if (normalized.length() < 2
                || normalized.length() > 100
                || !NAME_PATTERN.matcher(normalized).matches()) {

            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "El nombre y los apellidos deben tener entre 2 y 100 caracteres válidos."
            );
        }

        return normalized;
    }

    private String validateNullableDocumentId(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();

        if (normalized.length() < 1
                || normalized.length() > 30
                || !DOCUMENT_ID_PATTERN.matcher(normalized).matches()) {

            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "El número de documento no es válido."
            );
        }

        return normalized;
    }

    private String validateNullablePhone(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();

        if (normalized.length() < 8
                || normalized.length() > 16
                || !PHONE_PATTERN.matcher(normalized).matches()) {

            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "El teléfono debe utilizar formato E.164."
            );
        }

        return normalized;
    }

    private String validateNullableCountry(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();

        if (!COUNTRY_PATTERN.matcher(normalized).matches()) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "El país debe utilizar código ISO de dos letras mayúsculas."
            );
        }

        return normalized;
    }

    private String validateNullableAddress(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();

        if (normalized.length() < 1
                || normalized.length() > 200
                || !ADDRESS_PATTERN.matcher(normalized).matches()) {

            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "La dirección no es válida."
            );
        }

        return normalized;
    }
}

package com.studysync.service.language;

import com.studysync.model.language.UserLanguagePreference;
import com.studysync.repository.language.UserLanguagePreferenceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class LanguageService {

    private final UserLanguagePreferenceRepository repository;

    public LanguageService(UserLanguagePreferenceRepository repository) {
        this.repository = repository;
    }

    public List<String> getAvailableLanguages() {
        return List.of("es", "en");
    }

    @Transactional(readOnly = true)
    public String getUserLanguage(UUID userId) {
        return repository.findById(userId)
                .map(UserLanguagePreference::getLanguage)
                .orElse("es");
    }

    @Transactional
    public String updateUserLanguage(UUID userId, String language) {

        if (language == null ||
                !getAvailableLanguages().contains(language)) {
            throw new IllegalArgumentException(
                    "Idioma no admitido. Utiliza 'es' o 'en'."
            );
        }

        UserLanguagePreference preference = repository.findById(userId)
                .orElseGet(() ->
                        new UserLanguagePreference(userId, language)
                );

        preference.setLanguage(language);
        repository.save(preference);

        return preference.getLanguage();
    }
}

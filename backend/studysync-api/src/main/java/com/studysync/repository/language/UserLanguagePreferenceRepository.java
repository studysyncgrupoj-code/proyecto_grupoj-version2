package com.studysync.repository.language;

import com.studysync.model.language.UserLanguagePreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserLanguagePreferenceRepository
        extends JpaRepository<UserLanguagePreference, UUID> {
}

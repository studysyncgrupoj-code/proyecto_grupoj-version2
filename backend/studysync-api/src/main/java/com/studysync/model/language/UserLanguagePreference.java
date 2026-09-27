package com.studysync.model.language;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "user_language_preferences")
public class UserLanguagePreference {

    @Id
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "language", nullable = false, length = 5)
    private String language = "es";

    public UserLanguagePreference() {
    }

    public UserLanguagePreference(UUID userId, String language) {
        this.userId = userId;
        this.language = language;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}

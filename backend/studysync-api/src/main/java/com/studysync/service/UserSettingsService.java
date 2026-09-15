package com.studysync.service;

import com.studysync.model.UserSettings;
import com.studysync.repository.UserRepository;
import com.studysync.repository.UserSettingsRepository;
import org.springframework.stereotype.Service;

@Service
public class UserSettingsService {

    private final UserSettingsRepository userSettingsRepository;
    private final UserRepository userRepository;

    public UserSettingsService(
            UserSettingsRepository userSettingsRepository,
            UserRepository userRepository) {

        this.userSettingsRepository = userSettingsRepository;
        this.userRepository = userRepository;
    }

    public UserSettings getByUserId(Long userId) {

        validateUser(userId);

        return userSettingsRepository
                .findByUserId(userId)
                .orElseGet(() ->
                        userSettingsRepository.save(
                                new UserSettings(userId)
                        )
                );
    }

    public UserSettings update(
            Long userId,
            UserSettings incomingSettings) {

        validateUser(userId);

        UserSettings currentSettings =
                userSettingsRepository
                        .findByUserId(userId)
                        .orElseGet(() ->
                                new UserSettings(userId)
                        );

        if (incomingSettings.getLanguage() != null) {
            currentSettings.setLanguage(
                    incomingSettings.getLanguage()
            );
        }

        if (incomingSettings.getTheme() != null) {
            currentSettings.setTheme(
                    incomingSettings.getTheme()
            );
        }

        if (incomingSettings.getEmailNotifications() != null) {
            currentSettings.setEmailNotifications(
                    incomingSettings.getEmailNotifications()
            );
        }

        if (incomingSettings.getCourseNotifications() != null) {
            currentSettings.setCourseNotifications(
                    incomingSettings.getCourseNotifications()
            );
        }

        if (incomingSettings.getMessageNotifications() != null) {
            currentSettings.setMessageNotifications(
                    incomingSettings.getMessageNotifications()
            );
        }

        if (incomingSettings.getRoomNotifications() != null) {
            currentSettings.setRoomNotifications(
                    incomingSettings.getRoomNotifications()
            );
        }

        if (incomingSettings.getTwoFactorAuthentication() != null) {
            currentSettings.setTwoFactorAuthentication(
                    incomingSettings.getTwoFactorAuthentication()
            );
        }

        if (incomingSettings.getProfileVisibility() != null) {
            currentSettings.setProfileVisibility(
                    incomingSettings.getProfileVisibility()
            );
        }

        currentSettings.setUserId(userId);

        return userSettingsRepository.save(currentSettings);
    }

    private void validateUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException(
                    "Usuario no encontrado: " + userId
            );
        }
    }
}

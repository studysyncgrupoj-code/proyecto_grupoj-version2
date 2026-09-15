package com.studysync.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_settings")
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(nullable = false)
    private String language = "es";

    @Column(nullable = false)
    private String theme = "dark";

    @Column(name = "email_notifications", nullable = false)
    private Boolean emailNotifications = true;

    @Column(name = "course_notifications", nullable = false)
    private Boolean courseNotifications = true;

    @Column(name = "message_notifications", nullable = false)
    private Boolean messageNotifications = true;

    @Column(name = "room_notifications", nullable = false)
    private Boolean roomNotifications = false;

    @Column(name = "two_factor_authentication", nullable = false)
    private Boolean twoFactorAuthentication = false;

    @Column(name = "profile_visibility", nullable = false)
    private String profileVisibility = "public";

    public UserSettings() {
    }

    public UserSettings(Long userId) {
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public Boolean getEmailNotifications() {
        return emailNotifications;
    }

    public void setEmailNotifications(Boolean emailNotifications) {
        this.emailNotifications = emailNotifications;
    }

    public Boolean getCourseNotifications() {
        return courseNotifications;
    }

    public void setCourseNotifications(Boolean courseNotifications) {
        this.courseNotifications = courseNotifications;
    }

    public Boolean getMessageNotifications() {
        return messageNotifications;
    }

    public void setMessageNotifications(Boolean messageNotifications) {
        this.messageNotifications = messageNotifications;
    }

    public Boolean getRoomNotifications() {
        return roomNotifications;
    }

    public void setRoomNotifications(Boolean roomNotifications) {
        this.roomNotifications = roomNotifications;
    }

    public Boolean getTwoFactorAuthentication() {
        return twoFactorAuthentication;
    }

    public void setTwoFactorAuthentication(Boolean twoFactorAuthentication) {
        this.twoFactorAuthentication = twoFactorAuthentication;
    }

    public String getProfileVisibility() {
        return profileVisibility;
    }

    public void setProfileVisibility(String profileVisibility) {
        this.profileVisibility = profileVisibility;
    }
}

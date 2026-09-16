package com.studysync.model.auth;

import java.util.UUID;

import com.studysync.model.user.UserProfile;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
        name = "auth_accounts",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_auth_accounts_email",
                columnNames = "email"
        )
)
public class AuthAccount {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id = UUID.randomUUID();

    @Column(nullable = false, unique = true, length = 254)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.STUDENT;

    // TODO: Deuda técnica - Actualmente active inicia en true para facilitar las pruebas.
    // Cambiar a false por defecto una vez que se implemente el flujo completo de
    // registro y verificación de cuenta por correo electrónico.
    @Column(name = "is_active", nullable = false)
    private Boolean active = true;

    @OneToOne(
            mappedBy = "authAccount",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            orphanRemoval = true
    )
    private UserProfile userProfile;

    public AuthAccount() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public UserProfile getUserProfile() {
        return userProfile;
    }

    public void setUserProfile(UserProfile userProfile) {
        this.userProfile = userProfile;
        if (userProfile != null && userProfile.getAuthAccount() != this) {
            userProfile.setAuthAccount(this);
        }
    }
}

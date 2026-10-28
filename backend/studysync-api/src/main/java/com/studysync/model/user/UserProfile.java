package com.studysync.model.user;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.studysync.model.auth.AuthAccount;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @Column(name = "user_id", nullable = false, updatable = false)
    private UUID userId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private AuthAccount authAccount;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(name = "image", columnDefinition = "TEXT")
    private String image;

    @Embedded
    private UserBio bio;

    @ElementCollection
    @CollectionTable(
            name = "user_profile_interests",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @OrderColumn(name = "interest_order")
    @Column(name = "interest", length = 40, nullable = false)
    private List<String> interests = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", length = 20)
    private DocumentType documentType;

    @Column(name = "document_id", length = 30)
    private String documentId;

    @Column(name = "phone", length = 16)
    private String phone;

    @Column(name = "country", length = 2)
    private String country;

    @Column(name = "address", length = 200)
    private String address;

    @Column(name = "identity_locked", nullable = false)
    private Boolean identityLocked = false;

    public UserProfile() {
    }

    public UserProfile(
            AuthAccount authAccount,
            String nombre,
            String apellidos
    ) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        setAuthAccount(authAccount);
    }

    public UUID getUserId() {
        return userId;
    }

    public AuthAccount getAuthAccount() {
        return authAccount;
    }

    public void setAuthAccount(AuthAccount authAccount) {
        this.authAccount = authAccount;

        if (authAccount != null
                && authAccount.getUserProfile() != this) {
            authAccount.setUserProfile(this);
        }
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public UserBio getBio() {
        return bio;
    }

    public void setBio(UserBio bio) {
        this.bio = bio;
    }

    public List<String> getInterests() {
        return interests;
    }

    public void setInterests(List<String> interests) {
        this.interests = interests == null
                ? new ArrayList<>()
                : new ArrayList<>(interests);
    }

    public DocumentType getDocumentType() {
        return documentType;
    }

    public void setDocumentType(DocumentType documentType) {
        this.documentType = documentType;
    }

    public String getDocumentId() {
        return documentId;
    }

    public void setDocumentId(String documentId) {
        this.documentId = documentId;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Boolean getIdentityLocked() {
        return identityLocked;
    }

    public void setIdentityLocked(Boolean identityLocked) {
        this.identityLocked = identityLocked;
    }
}

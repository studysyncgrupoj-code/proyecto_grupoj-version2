package com.studysync.model.user;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class UserBio {

    @Column(name = "bio_title", length = 100)
    private String title;

    @Column(name = "bio_description", length = 1000)
    private String description;

    public UserBio() {
    }

    public UserBio(String title, String description) {
        this.title = title;
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

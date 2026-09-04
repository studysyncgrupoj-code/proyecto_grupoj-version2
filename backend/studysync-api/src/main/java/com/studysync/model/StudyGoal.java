package com.studysync.model;

import jakarta.persistence.*;

@Entity
@Table(name = "study_goals")
public class StudyGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String title;

    private Integer targetHours;

    private Integer currentHours = 0;

    private Boolean completed = false;

    public StudyGoal() {
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getTitle() {
        return title;
    }

    public Integer getTargetHours() {
        return targetHours;
    }

    public Integer getCurrentHours() {
        return currentHours;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setTargetHours(Integer targetHours) {
        this.targetHours = targetHours;
    }

    public void setCurrentHours(Integer currentHours) {
        this.currentHours = currentHours;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }
}
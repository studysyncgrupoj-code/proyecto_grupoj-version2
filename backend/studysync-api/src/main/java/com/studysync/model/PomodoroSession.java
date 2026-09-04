package com.studysync.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pomodoro_sessions")
public class PomodoroSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long roomId;

    private Integer durationMinutes = 25;
    private Integer breakMinutes = 5;

    private LocalDateTime startTime = LocalDateTime.now();
    private LocalDateTime endTime;

    private String status = "IN_PROGRESS";

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getRoomId() { return roomId; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public Integer getBreakMinutes() { return breakMinutes; }
    public LocalDateTime getStartTime() { return startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public String getStatus() { return status; }

    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public void setBreakMinutes(Integer breakMinutes) { this.breakMinutes = breakMinutes; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public void setStatus(String status) { this.status = status; }
}
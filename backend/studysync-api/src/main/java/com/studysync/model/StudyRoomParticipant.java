
package com.studysync.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "study_room_participants",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"room_id", "user_id"}
    )
)
public class StudyRoomParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "fecha_invitacion", nullable = false)
    private LocalDateTime fechaIngreso = LocalDateTime.now();

    public StudyRoomParticipant() {
    }

    public StudyRoomParticipant(Long roomId, Long userId) {
        this.roomId = roomId;
        this.userId = userId;
        this.fechaIngreso = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDateTime getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(LocalDateTime fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }
}

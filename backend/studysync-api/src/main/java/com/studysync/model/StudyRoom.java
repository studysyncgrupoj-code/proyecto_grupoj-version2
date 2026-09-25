package com.studysync.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "study_rooms")
public class StudyRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String descripcion;
    private Boolean privada = false;
    private Long creadorId;
    @Enumerated(EnumType.STRING)
    private MeetingProvider meetingProvider;

    @Column(length = 2048)
    private String meetingUrl;

    public enum MeetingProvider {
        GOOGLE_MEET,
        ZOOM,
        TEAMS
    }
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public Boolean getPrivada() {
        return privada;
    }

    public Long getCreadorId() {
        return creadorId;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setPrivada(Boolean privada) {
        this.privada = privada;
    }

    public void setCreadorId(Long creadorId) {
        this.creadorId = creadorId;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
    public MeetingProvider getMeetingProvider() {
    return meetingProvider;
}

public void setMeetingProvider(MeetingProvider meetingProvider) {
    this.meetingProvider = meetingProvider;
}

public String getMeetingUrl() {
    return meetingUrl;
}

public void setMeetingUrl(String meetingUrl) {
    this.meetingUrl = meetingUrl;
}
}
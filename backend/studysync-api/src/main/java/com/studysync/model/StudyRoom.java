
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
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    // Tipo de sala: TEMATICA o CURSO
    @Column(name = "tipo")
    private String tipo = "TEMATICA";

    // Curso asociado, obligatorio para clases de cursos
    @Column(name = "course_id")
    private Long courseId;

    // Fecha y hora programadas
    @Column(name = "fecha_programada")
    private LocalDateTime fechaProgramada;

    // PROGRAMADA, ACTIVA o FINALIZADA
    @Column(name = "estado")
    private String estado = "PROGRAMADA";

    @Column(name = "fecha_finalizacion")
    private LocalDateTime fechaFinalizacion;

    // Proveedor de videoconferencia
    @Column(name = "meeting_provider")
    private String meetingProvider;

    @Column(name = "meeting_url", length = 2048)
    private String meetingUrl;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Boolean getPrivada() {
        return privada;
    }

    public void setPrivada(Boolean privada) {
        this.privada = privada;
    }

    public Long getCreadorId() {
        return creadorId;
    }

    public void setCreadorId(Long creadorId) {
        this.creadorId = creadorId;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public LocalDateTime getFechaProgramada() {
        return fechaProgramada;
    }

    public void setFechaProgramada(LocalDateTime fechaProgramada) {
        this.fechaProgramada = fechaProgramada;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getFechaFinalizacion() {
        return fechaFinalizacion;
    }

    public void setFechaFinalizacion(LocalDateTime fechaFinalizacion) {
        this.fechaFinalizacion = fechaFinalizacion;
    }

    public String getMeetingProvider() {
        return meetingProvider;
    }

    public void setMeetingProvider(String meetingProvider) {
        this.meetingProvider = meetingProvider;
    }

    public String getMeetingUrl() {
        return meetingUrl;
    }

    public void setMeetingUrl(String meetingUrl) {
        this.meetingUrl = meetingUrl;
    }
}

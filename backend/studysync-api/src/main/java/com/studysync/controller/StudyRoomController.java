
package com.studysync.controller;

import com.studysync.model.StudyRoom;
import com.studysync.model.StudyRoomAccessRequest;
import com.studysync.model.StudyRoomParticipant;
import com.studysync.service.StudyRoomService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class StudyRoomController {

    private final StudyRoomService studyRoomService;

    public StudyRoomController(StudyRoomService studyRoomService) {
        this.studyRoomService = studyRoomService;
    }

    // Consultar todas las salas
    @GetMapping
    public List<StudyRoom> getAllRooms() {
        return studyRoomService.getAllRooms();
    }

    // Consultar solicitudes del usuario autenticado
    // IMPORTANTE: esta ruta debe estar antes de /{id}
    @GetMapping("/mis-solicitudes")
    public List<StudyRoomAccessRequest> obtenerMisSolicitudes() {
        return studyRoomService.obtenerMisSolicitudes();
    }

    // Consultar una sala por ID
    @GetMapping("/{id}")
    public ResponseEntity<StudyRoom> getRoomById(
            @PathVariable Long id) {

        return studyRoomService.getRoomById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Crear sala temática o clase de curso
    @PostMapping
    public StudyRoom createRoom(@RequestBody StudyRoom room) {
        return studyRoomService.saveRoom(room);
    }

    // Actualizar sala programada
    @PutMapping("/{id}")
    public StudyRoom updateRoom(
            @PathVariable Long id,
            @RequestBody StudyRoom room) {

        return studyRoomService.updateRoom(id, room);
    }

    // Activar manualmente una sala
    @PutMapping("/{id}/activar")
    public StudyRoom activarSala(@PathVariable Long id) {
        return studyRoomService.activarSala(id);
    }

    // Finalizar una sala activa
    @PutMapping("/{id}/finalizar")
    public StudyRoom finalizarSala(@PathVariable Long id) {
        return studyRoomService.finalizarSala(id);
    }

    // Solicitar acceso a una sala privada
    @PostMapping("/{id}/solicitudes")
    public StudyRoomAccessRequest solicitarAcceso(
            @PathVariable Long id) {

        return studyRoomService.solicitarAcceso(id);
    }

    // Consultar solicitudes pendientes
    // Solo el propietario de la sala puede hacerlo
    @GetMapping("/{id}/solicitudes")
    public List<StudyRoomAccessRequest> obtenerSolicitudesPendientes(
            @PathVariable Long id) {

        return studyRoomService.obtenerSolicitudesPendientes(id);
    }

    // Aprobar una solicitud de acceso
    @PutMapping("/{id}/solicitudes/{solicitudId}/aprobar")
    public StudyRoomAccessRequest aprobarSolicitud(
            @PathVariable Long id,
            @PathVariable Long solicitudId) {

        return studyRoomService.responderSolicitud(
                id,
                solicitudId,
                true
        );
    }

    // Rechazar una solicitud de acceso
    @PutMapping("/{id}/solicitudes/{solicitudId}/rechazar")
    public StudyRoomAccessRequest rechazarSolicitud(
            @PathVariable Long id,
            @PathVariable Long solicitudId) {

        return studyRoomService.responderSolicitud(
                id,
                solicitudId,
                false
        );
    }

    // Consultar participantes autorizados
    @GetMapping("/{id}/participantes")
    public List<StudyRoomParticipant> obtenerParticipantes(
            @PathVariable Long id) {

        return studyRoomService.obtenerParticipantes(id);
    }

    // Retirar la autorización de un participante
    @DeleteMapping("/{id}/participantes/{userId}")
    public ResponseEntity<Void> eliminarParticipante(
            @PathVariable Long id,
            @PathVariable Long userId) {

        studyRoomService.eliminarParticipante(id, userId);

        return ResponseEntity.noContent().build();
    }

    // Eliminar sala y sus registros asociados
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRoom(
            @PathVariable Long id) {

        boolean deleted = studyRoomService.deleteRoom(id);

        if (deleted) {
            return ResponseEntity.ok(
                    "Sala eliminada correctamente"
            );
        }

        return ResponseEntity.notFound().build();
    }
}

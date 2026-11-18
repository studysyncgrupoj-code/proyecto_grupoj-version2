
package com.studysync.controller;

import com.studysync.model.StudyRoom;
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

    // Eliminar sala
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRoom(@PathVariable Long id) {

        boolean deleted = studyRoomService.deleteRoom(id);

        if (deleted) {
            return ResponseEntity.ok("Sala eliminada correctamente");
        }

        return ResponseEntity.notFound().build();
    }
}

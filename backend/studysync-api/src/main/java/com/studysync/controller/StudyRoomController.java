package com.studysync.controller;

import com.studysync.model.StudyRoom;
import com.studysync.service.StudyRoomService;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;

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

    // Crear una nueva sala
    @PostMapping
    public StudyRoom createRoom(@RequestBody StudyRoom room) {
        return studyRoomService.saveRoom(room);
    }

    // Gestionar errores de validación
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidationError(
            IllegalArgumentException exception) {

        return Map.of(
            "error",
            exception.getMessage()
        );
    }
}
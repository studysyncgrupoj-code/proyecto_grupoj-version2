package com.studysync.controller;

import com.studysync.model.StudyRoom;
import com.studysync.service.StudyRoomService;
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

    @GetMapping
    public List<StudyRoom> getAllRooms() {
        return studyRoomService.getAllRooms();
    }

    @GetMapping("/{id}")
    public StudyRoom getRoomById(@PathVariable Long id) {
        return studyRoomService.getRoomById(id).orElse(null);
    }

    @PostMapping
    public StudyRoom createRoom(@RequestBody StudyRoom room) {
        return studyRoomService.saveRoom(room);
    }

    @PutMapping("/{id}")
    public StudyRoom updateRoom(@PathVariable Long id, @RequestBody StudyRoom room) {
        return studyRoomService.updateRoom(id, room);
    }

    @DeleteMapping("/{id}")
    public String deleteRoom(@PathVariable Long id) {
        boolean deleted = studyRoomService.deleteRoom(id);

        if (deleted) {
            return "Sala eliminada correctamente";
        }

        return "Sala no encontrada";
    }
}
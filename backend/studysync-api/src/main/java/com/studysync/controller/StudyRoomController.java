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

    @PostMapping
    public StudyRoom createRoom(@RequestBody StudyRoom room) {
        return studyRoomService.saveRoom(room);
    }
}
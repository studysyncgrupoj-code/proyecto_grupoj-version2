package com.studysync.controller;

import com.studysync.model.StudySession;
import com.studysync.service.StudySessionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*")
public class StudySessionController {

    private final StudySessionService studySessionService;

    public StudySessionController(StudySessionService studySessionService) {
        this.studySessionService = studySessionService;
    }

    @GetMapping
    public List<StudySession> getAllSessions() {
        return studySessionService.getAllSessions();
    }

    @PostMapping("/start")
    public StudySession startSession(@RequestBody StudySession session) {
        return studySessionService.startSession(session);
    }

    @PutMapping("/{id}/finish")
    public StudySession finishSession(@PathVariable Long id) {
        return studySessionService.finishSession(id);
    }
}
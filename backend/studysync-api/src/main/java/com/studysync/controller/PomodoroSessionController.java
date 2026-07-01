package com.studysync.controller;

import com.studysync.model.PomodoroSession;
import com.studysync.service.PomodoroSessionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pomodoro")
@CrossOrigin(origins = "*")
public class PomodoroSessionController {

    private final PomodoroSessionService pomodoroSessionService;

    public PomodoroSessionController(PomodoroSessionService pomodoroSessionService) {
        this.pomodoroSessionService = pomodoroSessionService;
    }

    @GetMapping
    public List<PomodoroSession> getAll() {
        return pomodoroSessionService.getAllSessions();
    }

    @PostMapping("/start")
    public PomodoroSession start(@RequestBody PomodoroSession session) {
        return pomodoroSessionService.startPomodoro(session);
    }

    @PutMapping("/{id}/pause")
    public PomodoroSession pause(@PathVariable Long id) {
        return pomodoroSessionService.pausePomodoro(id);
    }

    @PutMapping("/{id}/resume")
    public PomodoroSession resume(@PathVariable Long id) {
        return pomodoroSessionService.resumePomodoro(id);
    }

    @PutMapping("/{id}/finish")
    public PomodoroSession finish(@PathVariable Long id) {
        return pomodoroSessionService.finishPomodoro(id);
    }
}
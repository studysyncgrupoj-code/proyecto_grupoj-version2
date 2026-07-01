package com.studysync.service;

import com.studysync.model.PomodoroSession;
import com.studysync.repository.PomodoroSessionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PomodoroSessionService {

    private final PomodoroSessionRepository pomodoroSessionRepository;

    public PomodoroSessionService(PomodoroSessionRepository pomodoroSessionRepository) {
        this.pomodoroSessionRepository = pomodoroSessionRepository;
    }

    public List<PomodoroSession> getAllSessions() {
        return pomodoroSessionRepository.findAll();
    }

    public PomodoroSession startPomodoro(PomodoroSession session) {
        session.setStartTime(LocalDateTime.now());
        session.setStatus("IN_PROGRESS");
        return pomodoroSessionRepository.save(session);
    }

    public PomodoroSession finishPomodoro(Long id) {
        return pomodoroSessionRepository.findById(id)
                .map(session -> {
                    session.setEndTime(LocalDateTime.now());
                    session.setStatus("COMPLETED");
                    return pomodoroSessionRepository.save(session);
                })
                .orElse(null);
    }

    public PomodoroSession pausePomodoro(Long id) {
        return pomodoroSessionRepository.findById(id)
                .map(session -> {
                    session.setStatus("PAUSED");
                    return pomodoroSessionRepository.save(session);
                })
                .orElse(null);
    }

    public PomodoroSession resumePomodoro(Long id) {
        return pomodoroSessionRepository.findById(id)
                .map(session -> {
                    session.setStatus("IN_PROGRESS");
                    return pomodoroSessionRepository.save(session);
                })
                .orElse(null);
    }
} 
package com.studysync.service;

import com.studysync.model.StudySession;
import com.studysync.repository.StudySessionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StudySessionService {

    private final StudySessionRepository studySessionRepository;

    public StudySessionService(StudySessionRepository studySessionRepository) {
        this.studySessionRepository = studySessionRepository;
    }

    public List<StudySession> getAllSessions() {
        return studySessionRepository.findAll();
    }

    public StudySession startSession(StudySession session) {
        session.setStartTime(LocalDateTime.now());
        session.setCompleted(false);
        session.setMinutesStudied(0);
        return studySessionRepository.save(session);
    }

    public StudySession finishSession(Long id) {
        return studySessionRepository.findById(id)
                .map(session -> {
                    LocalDateTime endTime = LocalDateTime.now();
                    session.setEndTime(endTime);
                    session.setCompleted(true);

                    long minutes = java.time.Duration.between(
                            session.getStartTime(),
                            endTime
                    ).toMinutes();

                    session.setMinutesStudied((int) minutes);

                    return studySessionRepository.save(session);
                })
                .orElse(null);
    }
}
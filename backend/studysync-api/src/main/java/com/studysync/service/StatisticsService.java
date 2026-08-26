package com.studysync.service;

import com.studysync.model.PomodoroSession;
import com.studysync.model.StudyGoal;
import com.studysync.model.StudySession;
import com.studysync.repository.PomodoroSessionRepository;
import com.studysync.repository.StudyGoalRepository;
import com.studysync.repository.StudySessionRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StatisticsService {

    private final StudySessionRepository studySessionRepository;
    private final StudyGoalRepository studyGoalRepository;
    private final PomodoroSessionRepository pomodoroSessionRepository;

    public StatisticsService(
        StudySessionRepository studySessionRepository,
        StudyGoalRepository studyGoalRepository,
        PomodoroSessionRepository pomodoroSessionRepository
    ) {
        this.studySessionRepository = studySessionRepository;
        this.studyGoalRepository = studyGoalRepository;
        this.pomodoroSessionRepository = pomodoroSessionRepository;
    }

    public Map<String, Object> getUserStatistics(Long userId) {

        List<StudySession> completedSessions =
            studySessionRepository.findByUserIdAndCompletedTrue(userId);

        int studySessionMinutes = completedSessions.stream()
            .mapToInt(session ->
                session.getMinutesStudied() == null
                    ? 0
                    : session.getMinutesStudied()
            )
            .sum();

        List<PomodoroSession> completedPomodoros =
            pomodoroSessionRepository.findByUserIdAndStatus(
                userId,
                "COMPLETED"
            );

        int pomodoroMinutes = completedPomodoros.stream()
            .mapToInt(session ->
                session.getDurationMinutes() == null
                    ? 0
                    : session.getDurationMinutes()
            )
            .sum();

        int totalMinutes =
            studySessionMinutes + pomodoroMinutes;

        List<StudyGoal> goals =
            studyGoalRepository.findByUserId(userId);

        long completedGoals = goals.stream()
            .filter(goal ->
                Boolean.TRUE.equals(goal.getCompleted())
            )
            .count();

        long pendingGoals =
            goals.size() - completedGoals;

        long totalPomodoros =
            pomodoroSessionRepository.countByUserIdAndStatus(
                userId,
                "COMPLETED"
            );

        Map<String, Object> statistics =
            new HashMap<>();

        statistics.put("userId", userId);

        statistics.put(
            "completedSessions",
            completedSessions.size()
        );

        statistics.put(
            "totalMinutesStudied",
            totalMinutes
        );

        statistics.put(
            "totalHoursStudied",
            totalMinutes / 60.0
        );

        statistics.put(
            "completedGoals",
            completedGoals
        );

        statistics.put(
            "pendingGoals",
            pendingGoals
        );

        statistics.put(
            "totalPomodoros",
            totalPomodoros
        );

        return statistics;
    }
}
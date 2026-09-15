package com.studysync.service;

import com.studysync.model.StudyGoal;
import com.studysync.repository.StudyGoalRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudyGoalService {

    private final StudyGoalRepository studyGoalRepository;

    public StudyGoalService(StudyGoalRepository studyGoalRepository) {
        this.studyGoalRepository = studyGoalRepository;
    }

    public List<StudyGoal> getGoalsByUser(Long userId) {
        return studyGoalRepository.findByUserId(userId);
    }

    public StudyGoal createGoal(StudyGoal goal) {
        goal.setCompleted(false);
        return studyGoalRepository.save(goal);
    }

    public StudyGoal completeGoal(Long id) {

        return studyGoalRepository.findById(id)
                .map(goal -> {
                    goal.setCompleted(true);
                    return studyGoalRepository.save(goal);
                })
                .orElse(null);
    }
}
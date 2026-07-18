package com.studysync.controller;

import com.studysync.model.StudyGoal;
import com.studysync.service.StudyGoalService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "*")
public class StudyGoalController {

    private final StudyGoalService studyGoalService;

    public StudyGoalController(StudyGoalService studyGoalService) {
        this.studyGoalService = studyGoalService;
    }

    @GetMapping("/user/{userId}")
    public List<StudyGoal> getGoals(@PathVariable Long userId) {
        return studyGoalService.getGoalsByUser(userId);
    }

    @PostMapping
    public StudyGoal create(@RequestBody StudyGoal goal) {
        return studyGoalService.createGoal(goal);
    }

    @PutMapping("/{id}/complete")
    public StudyGoal complete(@PathVariable Long id) {
        return studyGoalService.completeGoal(id);
    }
}
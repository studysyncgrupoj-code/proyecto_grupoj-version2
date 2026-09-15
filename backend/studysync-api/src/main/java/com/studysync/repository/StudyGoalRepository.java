package com.studysync.repository;

import com.studysync.model.StudyGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyGoalRepository extends JpaRepository<StudyGoal, Long> {

    List<StudyGoal> findByUserId(Long userId);
}
package com.studysync.repository;

import com.studysync.model.PomodoroSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PomodoroSessionRepository extends JpaRepository<PomodoroSession, Long> {
}
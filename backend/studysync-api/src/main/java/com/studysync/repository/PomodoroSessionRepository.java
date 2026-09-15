package com.studysync.repository;

import com.studysync.model.PomodoroSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PomodoroSessionRepository
        extends JpaRepository<PomodoroSession, Long> {

    List<PomodoroSession> findByUserIdAndStatus(
        Long userId,
        String status
    );

    long countByUserIdAndStatus(
        Long userId,
        String status
    );
}
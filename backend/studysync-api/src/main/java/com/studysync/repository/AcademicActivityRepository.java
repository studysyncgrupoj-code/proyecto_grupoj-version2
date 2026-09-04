package com.studysync.repository;

import com.studysync.model.AcademicActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AcademicActivityRepository
        extends JpaRepository<AcademicActivity, Long> {

    List<AcademicActivity>
    findByTeacherIdOrderByDueDateAsc(Long teacherId);
}

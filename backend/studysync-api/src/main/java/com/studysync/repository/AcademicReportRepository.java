package com.studysync.repository;

import com.studysync.model.AcademicReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AcademicReportRepository
        extends JpaRepository<AcademicReport, Long> {

    List<AcademicReport>
    findByTeacherIdOrderByCreatedAtDesc(
            Long teacherId
    );

    List<AcademicReport>
    findByStudentIdOrderByCreatedAtDesc(
            Long studentId
    );
}

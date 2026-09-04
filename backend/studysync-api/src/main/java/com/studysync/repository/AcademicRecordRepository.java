package com.studysync.repository;

import com.studysync.model.AcademicRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AcademicRecordRepository
        extends JpaRepository<AcademicRecord, Long> {

    List<AcademicRecord> findByTeacherId(Long teacherId);

    Optional<AcademicRecord>
    findByTeacherIdAndStudentIdAndCourseId(
            Long teacherId,
            Long studentId,
            Long courseId
    );
}

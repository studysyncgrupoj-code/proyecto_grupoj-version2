package com.studysync.service;

import com.studysync.model.AcademicReport;
import com.studysync.repository.AcademicReportRepository;
import com.studysync.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AcademicReportService {

    private final AcademicReportRepository repository;
    private final UserRepository userRepository;

    public AcademicReportService(
            AcademicReportRepository repository,
            UserRepository userRepository) {

        this.repository = repository;
        this.userRepository = userRepository;
    }

    public List<AcademicReport> getByTeacher(
            Long teacherId) {

        validateUser(teacherId);

        return repository
                .findByTeacherIdOrderByCreatedAtDesc(
                        teacherId
                );
    }

    public List<AcademicReport> getByStudent(
            Long studentId) {

        validateUser(studentId);

        return repository
                .findByStudentIdOrderByCreatedAtDesc(
                        studentId
                );
    }

    public AcademicReport save(
            AcademicReport report) {

        validateUser(report.getTeacherId());
        validateUser(report.getStudentId());

        if (report.getObservation() == null ||
                report.getObservation().isBlank()) {

            throw new IllegalArgumentException(
                    "La observación es obligatoria."
            );
        }

        report.setCreatedAt(
                LocalDateTime.now()
        );

        if (report.getSendEmail() == null) {
            report.setSendEmail(false);
        }

        return repository.save(report);
    }

    private void validateUser(Long userId) {

        if (userId == null ||
                !userRepository.existsById(userId)) {

            throw new IllegalArgumentException(
                    "Usuario no encontrado."
            );
        }
    }
}

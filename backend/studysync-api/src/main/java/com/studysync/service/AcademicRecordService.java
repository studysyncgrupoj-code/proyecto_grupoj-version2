package com.studysync.service;

import com.studysync.model.AcademicRecord;
import com.studysync.repository.AcademicRecordRepository;
import com.studysync.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AcademicRecordService {

    private final AcademicRecordRepository repository;
    private final UserRepository userRepository;

    public AcademicRecordService(
            AcademicRecordRepository repository,
            UserRepository userRepository) {

        this.repository = repository;
        this.userRepository = userRepository;
    }

    public List<AcademicRecord> getByTeacher(Long teacherId) {
        validateUser(teacherId);
        return repository.findByTeacherId(teacherId);
    }

    public AcademicRecord save(AcademicRecord record) {

        validateUser(record.getTeacherId());
        validateUser(record.getStudentId());

        if (record.getGrade() == null) {
            record.setGrade(0.0);
        }

        if (record.getAttendance() == null) {
            record.setAttendance(0.0);
        }

        if (record.getStatus() == null ||
                record.getStatus().isBlank()) {
            record.setStatus("Activo");
        }

        return repository.save(record);
    }

    public AcademicRecord update(
            Long id,
            AcademicRecord incoming) {

        AcademicRecord current =
                repository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Registro académico no encontrado."
                                )
                        );

        if (incoming.getGrade() != null) {
            current.setGrade(incoming.getGrade());
        }

        if (incoming.getAttendance() != null) {
            current.setAttendance(incoming.getAttendance());
        }

        if (incoming.getStatus() != null) {
            current.setStatus(incoming.getStatus());
        }

        if (incoming.getCourseId() != null) {
            current.setCourseId(incoming.getCourseId());
        }

        return repository.save(current);
    }

    private void validateUser(Long userId) {

        if (userId == null ||
                !userRepository.existsById(userId)) {

            throw new IllegalArgumentException(
                    "Usuario no encontrado: " + userId
            );
        }
    }
}

package com.studysync.service;

import com.studysync.model.AcademicActivity;
import com.studysync.repository.AcademicActivityRepository;
import com.studysync.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AcademicActivityService {

    private final AcademicActivityRepository repository;
    private final UserRepository userRepository;

    public AcademicActivityService(
            AcademicActivityRepository repository,
            UserRepository userRepository) {

        this.repository = repository;
        this.userRepository = userRepository;
    }

    public List<AcademicActivity> getByTeacher(
            Long teacherId) {

        validateTeacher(teacherId);

        return repository
                .findByTeacherIdOrderByDueDateAsc(
                        teacherId
                );
    }

    public AcademicActivity save(
            AcademicActivity activity) {

        validateTeacher(
                activity.getTeacherId()
        );

        if (activity.getTitle() == null ||
                activity.getTitle().isBlank()) {

            throw new IllegalArgumentException(
                    "El título es obligatorio."
            );
        }

        if (activity.getPending() == null) {
            activity.setPending(0);
        }

        if (activity.getTotal() == null) {
            activity.setTotal(0);
        }

        return repository.save(activity);
    }

    private void validateTeacher(
            Long teacherId) {

        if (teacherId == null ||
                !userRepository.existsById(
                        teacherId
                )) {

            throw new IllegalArgumentException(
                    "Profesor no encontrado."
            );
        }
    }
}

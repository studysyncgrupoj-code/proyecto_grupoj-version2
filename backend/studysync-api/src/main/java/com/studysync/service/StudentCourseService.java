package com.studysync.service;

import com.studysync.model.StudentCourse;
import com.studysync.repository.CourseRepository;
import com.studysync.repository.StudentCourseRepository;
import com.studysync.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StudentCourseService {

    private final StudentCourseRepository studentCourseRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public StudentCourseService(
            StudentCourseRepository studentCourseRepository,
            UserRepository userRepository,
            CourseRepository courseRepository
    ) {
        this.studentCourseRepository = studentCourseRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    public StudentCourse enroll(Long studentId, Long courseId) {

        validateStudent(studentId);
        validateCourse(courseId);

        if (studentCourseRepository
                .existsByStudentIdAndCourseId(studentId, courseId)) {

            throw new IllegalArgumentException(
                    "El estudiante ya está inscrito en este curso."
            );
        }

        StudentCourse studentCourse = new StudentCourse();

        studentCourse.setStudentId(studentId);
        studentCourse.setCourseId(courseId);
        studentCourse.setProgress(0);
        studentCourse.setStatus("IN_PROGRESS");
        studentCourse.setStartedAt(LocalDateTime.now());
        studentCourse.setCompletedAt(null);

        return studentCourseRepository.save(studentCourse);
    }

    public StudentCourse getEnrollment(
            Long studentId,
            Long courseId
    ) {

        return studentCourseRepository
                .findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "El estudiante no está inscrito en este curso."
                        )
                );
    }

    public List<StudentCourse> getStudentCourses(Long studentId) {

        validateStudent(studentId);

        return studentCourseRepository
                .findByStudentId(studentId);
    }

    public List<StudentCourse> getCourseStudents(Long courseId) {

        validateCourse(courseId);

        return studentCourseRepository
                .findByCourseId(courseId);
    }

    public StudentCourse updateProgress(
            Long studentId,
            Long courseId,
            Integer progress
    ) {

        if (progress == null || progress < 0 || progress > 100) {
            throw new IllegalArgumentException(
                    "El progreso debe estar entre 0 y 100."
            );
        }

        StudentCourse studentCourse =
                getEnrollment(studentId, courseId);

        if ("COMPLETED".equals(studentCourse.getStatus())) {
            throw new IllegalArgumentException(
                    "El curso ya está completado."
            );
        }

        studentCourse.setProgress(progress);

        if (progress == 100) {
            studentCourse.setStatus("COMPLETED");
            studentCourse.setCompletedAt(LocalDateTime.now());
        } else {
            studentCourse.setStatus("IN_PROGRESS");
            studentCourse.setCompletedAt(null);
        }

        return studentCourseRepository.save(studentCourse);
    }

    public List<StudentCourse> getCompletedCourses(Long studentId) {

        validateStudent(studentId);

        return studentCourseRepository
                .findByStudentIdAndStatus(
                        studentId,
                        "COMPLETED"
                );
    }

    private void validateStudent(Long studentId) {

        if (studentId == null ||
                !userRepository.existsById(studentId)) {

            throw new IllegalArgumentException(
                    "El estudiante no existe."
            );
        }
    }

    private void validateCourse(Long courseId) {

        if (courseId == null ||
                !courseRepository.existsById(courseId)) {

            throw new IllegalArgumentException(
                    "El curso no existe."
            );
        }
    }
}

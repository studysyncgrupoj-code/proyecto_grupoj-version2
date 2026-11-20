package com.studysync.service;

import com.studysync.model.Course;
import com.studysync.model.CourseLesson;
import com.studysync.model.User;
import com.studysync.repository.CourseLessonRepository;
import com.studysync.repository.CourseRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CourseLessonService {

    private final CourseLessonRepository lessonRepository;
    private final CourseRepository courseRepository;

    public CourseLessonService(
            CourseLessonRepository lessonRepository,
            CourseRepository courseRepository) {
        this.lessonRepository = lessonRepository;
        this.courseRepository = courseRepository;
    }

    private User usuarioActual() {
        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()
                || !(auth.getPrincipal() instanceof User)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Usuario no autenticado");
        }

        return (User) auth.getPrincipal();
    }

    private Course obtenerCurso(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Curso no encontrado"));
    }

    private void validarAdministradorDelCurso(Course course) {
        User user = usuarioActual();

        boolean esAdmin = "ADMIN".equalsIgnoreCase(user.getRol());
        boolean esProfesor = "PROFESOR".equalsIgnoreCase(user.getRol())
                && course.getTeacherId() != null
                && course.getTeacherId().equals(user.getId());

        if (!esAdmin && !esProfesor) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "No tienes permisos para administrar este curso");
        }
    }

    @Transactional(readOnly = true)
    public List<CourseLesson> listar(Long courseId) {
        obtenerCurso(courseId);
        usuarioActual();

        return lessonRepository.findByCourseIdOrderByLessonOrderAsc(courseId);
    }

    @Transactional
    public CourseLesson crear(Long courseId, CourseLesson datos) {
        Course course = obtenerCurso(courseId);
        validarAdministradorDelCurso(course);

        if (datos.getTitle() == null || datos.getTitle().isBlank()
                || datos.getLessonOrder() == null
                || datos.getLessonOrder() < 1) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El titulo y el orden de la clase son obligatorios");
        }

        if (lessonRepository.existsByCourseIdAndLessonOrder(
                courseId, datos.getLessonOrder())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe una clase con ese orden");
        }

        CourseLesson lesson = new CourseLesson();
        lesson.setCourseId(courseId);
        lesson.setTitle(datos.getTitle());
        lesson.setDescription(datos.getDescription());
        lesson.setLessonOrder(datos.getLessonOrder());
        lesson.setScheduledAt(datos.getScheduledAt());
        lesson.setDurationMinutes(datos.getDurationMinutes());

        return lessonRepository.save(lesson);
    }

    @Transactional
    public CourseLesson actualizar(
            Long courseId, Long lessonId, CourseLesson datos) {

        Course course = obtenerCurso(courseId);
        validarAdministradorDelCurso(course);

        CourseLesson lesson = obtenerClase(courseId, lessonId);

        if (datos.getTitle() == null || datos.getTitle().isBlank()
                || datos.getLessonOrder() == null
                || datos.getLessonOrder() < 1) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El titulo y el orden de la clase son obligatorios");
        }

        if (!datos.getLessonOrder().equals(lesson.getLessonOrder())
                && lessonRepository.existsByCourseIdAndLessonOrder(
                        courseId, datos.getLessonOrder())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe una clase con ese orden");
        }

        lesson.setTitle(datos.getTitle());
        lesson.setDescription(datos.getDescription());
        lesson.setLessonOrder(datos.getLessonOrder());
        lesson.setScheduledAt(datos.getScheduledAt());
        lesson.setDurationMinutes(datos.getDurationMinutes());

        return lessonRepository.save(lesson);
    }

    @Transactional
    public void eliminar(Long courseId, Long lessonId) {
        Course course = obtenerCurso(courseId);
        validarAdministradorDelCurso(course);

        CourseLesson lesson = obtenerClase(courseId, lessonId);
        lessonRepository.delete(lesson);
    }

    private CourseLesson obtenerClase(Long courseId, Long lessonId) {
        CourseLesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Clase no encontrada"));

        if (!courseId.equals(lesson.getCourseId())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Clase no encontrada en este curso");
        }

        return lesson;
    }
}

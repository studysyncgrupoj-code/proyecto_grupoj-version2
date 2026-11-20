package com.studysync.controller;

import com.studysync.model.CourseLesson;
import com.studysync.service.CourseLessonService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses/{courseId}/lessons")
public class CourseLessonController {

    private final CourseLessonService lessonService;

    public CourseLessonController(CourseLessonService lessonService) {
        this.lessonService = lessonService;
    }

    @GetMapping
    public List<CourseLesson> listar(@PathVariable Long courseId) {
        return lessonService.listar(courseId);
    }

    @PostMapping
    public ResponseEntity<CourseLesson> crear(
            @PathVariable Long courseId,
            @RequestBody CourseLesson datos) {

        CourseLesson creada = lessonService.crear(courseId, datos);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    @PutMapping("/{lessonId}")
    public CourseLesson actualizar(
            @PathVariable Long courseId,
            @PathVariable Long lessonId,
            @RequestBody CourseLesson datos) {

        return lessonService.actualizar(courseId, lessonId, datos);
    }

    @DeleteMapping("/{lessonId}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long courseId,
            @PathVariable Long lessonId) {

        lessonService.eliminar(courseId, lessonId);
        return ResponseEntity.noContent().build();
    }
}

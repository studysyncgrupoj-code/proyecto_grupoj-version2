package com.studysync.controller;

import com.studysync.model.StudentCourse;
import com.studysync.service.StudentCourseService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student-courses")
public class StudentCourseController {

    private final StudentCourseService studentCourseService;

    public StudentCourseController(
            StudentCourseService studentCourseService
    ) {
        this.studentCourseService = studentCourseService;
    }

    @PostMapping("/{studentId}/{courseId}")
    public ResponseEntity<StudentCourse> enroll(
            @PathVariable Long studentId,
            @PathVariable Long courseId
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        studentCourseService.enroll(
                                studentId,
                                courseId
                        )
                );
    }

    @GetMapping("/{studentId}/{courseId}")
    public ResponseEntity<StudentCourse> getEnrollment(
            @PathVariable Long studentId,
            @PathVariable Long courseId
    ) {

        return ResponseEntity.ok(
                studentCourseService.getEnrollment(
                        studentId,
                        courseId
                )
        );
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<StudentCourse>> getStudentCourses(
            @PathVariable Long studentId
    ) {

        return ResponseEntity.ok(
                studentCourseService.getStudentCourses(
                        studentId
                )
        );
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<StudentCourse>> getCourseStudents(
            @PathVariable Long courseId
    ) {

        return ResponseEntity.ok(
                studentCourseService.getCourseStudents(
                        courseId
                )
        );
    }

    @PutMapping("/{studentId}/{courseId}/progress")
    public ResponseEntity<StudentCourse> updateProgress(
            @PathVariable Long studentId,
            @PathVariable Long courseId,
            @RequestParam Integer progress
    ) {

        return ResponseEntity.ok(
                studentCourseService.updateProgress(
                        studentId,
                        courseId,
                        progress
                )
        );
    }

    @GetMapping("/student/{studentId}/completed")
    public ResponseEntity<List<StudentCourse>> getCompletedCourses(
            @PathVariable Long studentId
    ) {

        return ResponseEntity.ok(
                studentCourseService.getCompletedCourses(
                        studentId
                )
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleValidationError(
            IllegalArgumentException exception
    ) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "error",
                                exception.getMessage()
                        )
                );
    }
}

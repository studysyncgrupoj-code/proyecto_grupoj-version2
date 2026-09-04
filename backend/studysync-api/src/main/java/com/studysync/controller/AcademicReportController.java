package com.studysync.controller;

import com.studysync.model.AcademicReport;
import com.studysync.service.AcademicReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academic-reports")
@CrossOrigin(origins = "http://localhost:5173")
public class AcademicReportController {

    private final AcademicReportService service;

    public AcademicReportController(
            AcademicReportService service) {
        this.service = service;
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<AcademicReport>> getByTeacher(
            @PathVariable Long teacherId) {

        return ResponseEntity.ok(
                service.getByTeacher(teacherId)
        );
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AcademicReport>> getByStudent(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                service.getByStudent(studentId)
        );
    }

    @PostMapping
    public ResponseEntity<AcademicReport> create(
            @RequestBody AcademicReport report) {

        return ResponseEntity.ok(
                service.save(report)
        );
    }
}

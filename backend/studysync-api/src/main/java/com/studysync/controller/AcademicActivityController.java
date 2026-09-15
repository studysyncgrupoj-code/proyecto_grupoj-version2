package com.studysync.controller;

import com.studysync.model.AcademicActivity;
import com.studysync.service.AcademicActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academic-activities")
@CrossOrigin(origins = "http://localhost:5173")
public class AcademicActivityController {

    private final AcademicActivityService service;

    public AcademicActivityController(
            AcademicActivityService service) {
        this.service = service;
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<AcademicActivity>> getByTeacher(
            @PathVariable Long teacherId) {

        return ResponseEntity.ok(
                service.getByTeacher(teacherId)
        );
    }

    @PostMapping
    public ResponseEntity<AcademicActivity> create(
            @RequestBody AcademicActivity activity) {

        return ResponseEntity.ok(
                service.save(activity)
        );
    }
}

package com.studysync.controller;

import com.studysync.model.AcademicRecord;
import com.studysync.service.AcademicRecordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academic-records")
@CrossOrigin(origins = "http://localhost:5173")
public class AcademicRecordController {

    private final AcademicRecordService service;

    public AcademicRecordController(
            AcademicRecordService service) {
        this.service = service;
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<AcademicRecord>> getByTeacher(
            @PathVariable Long teacherId) {

        return ResponseEntity.ok(
                service.getByTeacher(teacherId)
        );
    }

    @PostMapping
    public ResponseEntity<AcademicRecord> create(
            @RequestBody AcademicRecord record) {

        return ResponseEntity.ok(
                service.save(record)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<AcademicRecord> update(
            @PathVariable Long id,
            @RequestBody AcademicRecord record) {

        return ResponseEntity.ok(
                service.update(id, record)
        );
    }
}

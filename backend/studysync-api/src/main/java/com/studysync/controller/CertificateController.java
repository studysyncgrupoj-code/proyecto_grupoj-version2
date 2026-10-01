package com.studysync.controller;

import com.studysync.model.Certificate;
import com.studysync.service.CertificateService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(
            CertificateService certificateService
    ) {
        this.certificateService = certificateService;
    }

    @PostMapping("/{studentId}/{courseId}")
    public ResponseEntity<Certificate> issueCertificate(
            @PathVariable Long studentId,
            @PathVariable Long courseId
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        certificateService.issueCertificate(
                                studentId,
                                courseId
                        )
                );
    }

    @GetMapping("/{studentId}/{courseId}")
    public ResponseEntity<Certificate> getCertificate(
            @PathVariable Long studentId,
            @PathVariable Long courseId
    ) {

        return ResponseEntity.ok(
                certificateService.getCertificate(
                        studentId,
                        courseId
                )
        );
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Certificate>> getStudentCertificates(
            @PathVariable Long studentId
    ) {

        return ResponseEntity.ok(
                certificateService.getStudentCertificates(
                        studentId
                )
        );
    }

    @GetMapping("/verify/{verificationCode}")
    public ResponseEntity<Certificate> verifyCertificate(
            @PathVariable String verificationCode
    ) {

        return ResponseEntity.ok(
                certificateService.verifyCertificate(
                        verificationCode
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

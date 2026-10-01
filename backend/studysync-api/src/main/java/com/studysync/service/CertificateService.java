package com.studysync.service;

import com.studysync.model.Certificate;
import com.studysync.model.StudentCourse;
import com.studysync.repository.CertificateRepository;
import com.studysync.repository.StudentCourseRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.UUID;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final StudentCourseRepository studentCourseRepository;

    public CertificateService(
            CertificateRepository certificateRepository,
            StudentCourseRepository studentCourseRepository
    ) {
        this.certificateRepository = certificateRepository;
        this.studentCourseRepository = studentCourseRepository;
    }

    public Certificate issueCertificate(
            Long studentId,
            Long courseId
    ) {

        StudentCourse studentCourse =
                studentCourseRepository
                        .findByStudentIdAndCourseId(
                                studentId,
                                courseId
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "El estudiante no está inscrito en este curso."
                                )
                        );

        if (!"COMPLETED".equals(
                studentCourse.getStatus()
        )) {
            throw new IllegalArgumentException(
                    "El certificado solo puede emitirse cuando el curso está completado."
            );
        }

        if (certificateRepository
                .existsByStudentIdAndCourseId(
                        studentId,
                        courseId
                )) {

            throw new IllegalArgumentException(
                    "Ya existe un certificado para este estudiante y curso."
            );
        }

        LocalDateTime now = LocalDateTime.now();

        Certificate certificate = new Certificate();

        certificate.setStudentId(studentId);
        certificate.setCourseId(courseId);

        certificate.setIssuedAt(now);

        certificate.setCompletionDate(
                studentCourse.getCompletedAt()
        );

        certificate.setVerificationCode(
                UUID.randomUUID().toString()
        );

        certificate.setCertificateNumber(
                "SS-" +
                Year.now().getValue() +
                "-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase()
        );

        return certificateRepository.save(
                certificate
        );
    }

    public Certificate getCertificate(
            Long studentId,
            Long courseId
    ) {

        return certificateRepository
                .findByStudentIdAndCourseId(
                        studentId,
                        courseId
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Certificado no encontrado."
                        )
                );
    }

    public List<Certificate> getStudentCertificates(
            Long studentId
    ) {

        return certificateRepository
                .findByStudentId(studentId);
    }

    public Certificate verifyCertificate(
            String verificationCode
    ) {

        if (verificationCode == null ||
                verificationCode.isBlank()) {

            throw new IllegalArgumentException(
                    "El código de verificación es obligatorio."
            );
        }

        return certificateRepository
                .findByVerificationCode(
                        verificationCode.trim()
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Certificado no encontrado."
                        )
                );
    }
}

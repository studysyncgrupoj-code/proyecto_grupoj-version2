package com.studysync.repository;

import com.studysync.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository
        extends JpaRepository<Certificate, Long> {

    Optional<Certificate> findByStudentIdAndCourseId(
            Long studentId,
            Long courseId
    );

    Optional<Certificate> findByVerificationCode(
            String verificationCode
    );

    List<Certificate> findByStudentId(
            Long studentId
    );

    boolean existsByStudentIdAndCourseId(
            Long studentId,
            Long courseId
    );
}

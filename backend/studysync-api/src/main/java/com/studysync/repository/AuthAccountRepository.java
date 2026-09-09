package com.studysync.repository;

import com.studysync.model.AuthAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AuthAccountRepository extends JpaRepository<AuthAccount, UUID> {

    Optional<AuthAccount> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);
}
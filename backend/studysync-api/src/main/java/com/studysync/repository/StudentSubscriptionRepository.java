package com.studysync.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.studysync.model.subscription.StudentSubscription;

public interface StudentSubscriptionRepository
        extends JpaRepository<StudentSubscription, UUID> {
}

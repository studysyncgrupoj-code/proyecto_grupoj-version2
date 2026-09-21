package com.studysync.service.subscription;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.studysync.model.auth.AuthAccount;
import com.studysync.model.subscription.StudentSubscription;
import com.studysync.model.subscription.SubscriptionType;
import com.studysync.repository.StudentSubscriptionRepository;

@Service
public class StudentSubscriptionService {

    private final StudentSubscriptionRepository repository;

    public StudentSubscriptionService(
            StudentSubscriptionRepository repository
    ) {
        this.repository = repository;
    }

    @Transactional
    public StudentSubscription createFreeSubscription(AuthAccount authAccount) {
        StudentSubscription subscription =
                new StudentSubscription(authAccount);

        subscription.setType(SubscriptionType.FREE);
        subscription.setStartsAt(null);
        subscription.setExpiresAt(null);

        return repository.save(subscription);
    }

    @Transactional
    public StudentSubscription getOrCreateFreeSubscription(
            AuthAccount authAccount
    ) {
        return repository.findById(authAccount.getId())
                .orElseGet(() -> createFreeSubscription(authAccount));
    }

    @Transactional
    public StudentSubscription getValidatedSubscription(
            AuthAccount authAccount
    ) {
        StudentSubscription subscription =
                getOrCreateFreeSubscription(authAccount);

        if (subscription.getType() == SubscriptionType.FREE) {
            return subscription;
        }

        LocalDateTime expiresAt = subscription.getExpiresAt();

        if (expiresAt == null || !expiresAt.isAfter(LocalDateTime.now())) {
            subscription.setType(SubscriptionType.FREE);
            subscription.setStartsAt(null);
            subscription.setExpiresAt(null);

            return repository.save(subscription);
        }

        return subscription;
    }
}

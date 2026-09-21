package com.studysync.service.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.studysync.model.auth.AuthAccount;
import com.studysync.model.auth.Role;
import com.studysync.model.subscription.StudentSubscription;
import com.studysync.model.subscription.SubscriptionType;
import com.studysync.model.user.UserProfile;
import com.studysync.repository.UserProfileRepository;
import com.studysync.repository.auth.AuthAccountRepository;
import com.studysync.service.subscription.StudentSubscriptionService;

@Service
public class LoginService {

    private final AuthAccountRepository authAccountRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final StudentSubscriptionService studentSubscriptionService;

    public LoginService(
            AuthAccountRepository authAccountRepository,
            UserProfileRepository userProfileRepository,
            PasswordEncoder passwordEncoder,
            StudentSubscriptionService studentSubscriptionService
    ) {
        this.authAccountRepository = authAccountRepository;
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.studentSubscriptionService = studentSubscriptionService;
    }

    @SuppressWarnings("null")
    @Transactional
    public LoginResult login(
            String email,
            String contrasena
    ) {
        if (email == null
                || email.isBlank()
                || contrasena == null
                || contrasena.isBlank()) {
            return null;
        }

        String emailNormalizado =
                email.trim().toLowerCase();

        AuthAccount authAccount =
                authAccountRepository
                        .findByEmailIgnoreCase(emailNormalizado)
                        .orElse(null);

        if (authAccount == null) {
            return null;
        }

        if (!Boolean.TRUE.equals(authAccount.getActive())) {
            throw new AccountInactiveException();
        }

        boolean passwordValida =
                passwordEncoder.matches(
                        contrasena,
                        authAccount.getPasswordHash()
                );

        if (!passwordValida) {
            return null;
        }

        UserProfile profile =
                userProfileRepository
                        .findById(authAccount.getId())
                        .orElse(null);

        if (profile == null) {
            return null;
        }

        SubscriptionType subscription = null;

        if (authAccount.getRole() == Role.STUDENT) {
            StudentSubscription studentSubscription =
                    studentSubscriptionService
                            .getValidatedSubscription(authAccount);

            subscription = studentSubscription.getType();
        }

        return new LoginResult(
                authAccount,
                profile,
                subscription
        );
    }

    public record LoginResult(
            AuthAccount authAccount,
            UserProfile profile,
            SubscriptionType subscription
    ) {
    }

    public static class AccountInactiveException
            extends RuntimeException {
    }
}
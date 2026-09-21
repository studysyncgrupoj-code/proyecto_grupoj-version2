package com.studysync.service.auth;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.studysync.dto.auth.RegisterRequest;
import com.studysync.exception.EmailAlreadyRegisteredException;
import com.studysync.model.auth.AuthAccount;
import com.studysync.model.auth.Role;
import com.studysync.model.user.UserProfile;
import com.studysync.repository.auth.AuthAccountRepository;
import com.studysync.service.subscription.StudentSubscriptionService;

@Service
public class RegisterService {

    private final AuthAccountRepository authAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final StudentSubscriptionService studentSubscriptionService;

    public RegisterService(
            AuthAccountRepository authAccountRepository,
            PasswordEncoder passwordEncoder,
            StudentSubscriptionService studentSubscriptionService
    ) {
        this.authAccountRepository = authAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.studentSubscriptionService = studentSubscriptionService;
    }

    @Transactional
    public UserProfile register(RegisterRequest request) {
        String emailNormalizado = request.email().trim().toLowerCase();

        if (authAccountRepository.existsByEmailIgnoreCase(emailNormalizado)) {
            throw new EmailAlreadyRegisteredException();
        }

        AuthAccount authAccount = new AuthAccount();
        authAccount.setEmail(emailNormalizado);
        authAccount.setPasswordHash(
                passwordEncoder.encode(request.contrasena())
        );
        authAccount.setRole(Role.STUDENT);
        authAccount.setActive(true);

        UserProfile profile = new UserProfile();
        profile.setNombre(request.nombre().trim());
        profile.setApellidos(request.apellidos().trim());

        authAccount.setUserProfile(profile);

        try {
            AuthAccount saved =
                    authAccountRepository.saveAndFlush(authAccount);

            studentSubscriptionService.createFreeSubscription(saved);

            return saved.getUserProfile();

        } catch (DataIntegrityViolationException ex) {
            throw new EmailAlreadyRegisteredException();
        }
    }
}
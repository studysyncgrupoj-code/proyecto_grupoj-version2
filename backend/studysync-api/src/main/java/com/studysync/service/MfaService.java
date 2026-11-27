package com.studysync.service;

import com.warrenstrange.googleauth.GoogleAuthenticator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MfaService {

    private final JdbcTemplate jdbc;

    private record Attempts(long window, int count) {}

    private final Map<Long, Attempts> attempts =
        new ConcurrentHashMap<>();

    private boolean allowAttempt(Long userId) {
        long now = System.currentTimeMillis();

        Attempts result = attempts.compute(userId, (id, previous) -> {
            if (previous == null || now - previous.window() >= 60000L) {
                return new Attempts(now, 1);
            }

            return new Attempts(
                previous.window(),
                Math.min(previous.count() + 1, 6)
            );
        });

        return result.count() <= 5;
    }
    private final MfaCryptoService crypto;
    private final GoogleAuthenticator authenticator =
        new GoogleAuthenticator();

    public MfaService(JdbcTemplate jdbc, MfaCryptoService crypto) {
        this.jdbc = jdbc;
        this.crypto = crypto;
    }

    public boolean isEnabled(Long userId) {
        return Boolean.TRUE.equals(jdbc.queryForObject("""
            SELECT EXISTS (
                SELECT 1 FROM user_settings
                WHERE user_id = ?
                AND two_factor_authentication = true
                AND two_factor_secret IS NOT NULL
            )
            """, Boolean.class, userId));
    }

    @Transactional
    public String setup(Long userId) {

        String secret = authenticator.createCredentials().getKey();

        int updated = jdbc.update("""
            UPDATE user_settings
            SET two_factor_secret = ?,
                two_factor_last_step = NULL
            WHERE user_id = ?
            AND two_factor_authentication = false
            """, crypto.encrypt(secret), userId);

        if (updated != 1) {
            throw new IllegalStateException(
                "No se puede iniciar la configuración 2FA");
        }

        return secret;
    }

    @Transactional
    public boolean verify(Long userId, String code, boolean enabled) {

        if (!allowAttempt(userId)) {
            return false;
        }

        if (code == null || !code.matches("[0-9]{6}")) {
            return false;
        }

        var rows = jdbc.queryForList("""
            SELECT two_factor_secret, two_factor_last_step
            FROM user_settings
            WHERE user_id = ?
            AND two_factor_authentication = ?
            FOR UPDATE
            """, userId, enabled);

        if (rows.isEmpty()) {
            return false;
        }

        Map<String, Object> row = rows.get(0);
        String encrypted = (String) row.get("two_factor_secret");

        if (encrypted == null) {
            return false;
        }

        String secret = crypto.decrypt(encrypted);
        long step = System.currentTimeMillis() / 30000L;
        Number last = (Number) row.get("two_factor_last_step");

        if (last != null && last.longValue() >= step) {
            return false;
        }

        int expected = authenticator.getTotpPassword(
            secret, step * 30000L
        );

        if (expected != Integer.parseInt(code)) {
            return false;
        }

        jdbc.update("""
            UPDATE user_settings
            SET two_factor_last_step = ?
            WHERE user_id = ?
            """, step, userId);

        return true;
    }

    @Transactional
    public boolean enable(Long userId, String code) {

        if (!verify(userId, code, false)) {
            return false;
        }

        jdbc.update("""
            UPDATE user_settings
            SET two_factor_authentication = true
            WHERE user_id = ?
            """, userId);

        return true;
    }

    @Transactional
    public boolean disable(Long userId, String code) {

        if (!verify(userId, code, true)) {
            return false;
        }

        jdbc.update("""
            UPDATE user_settings
            SET two_factor_authentication = false,
                two_factor_secret = NULL,
                two_factor_last_step = NULL
            WHERE user_id = ?
            """, userId);

        return true;
    }
}

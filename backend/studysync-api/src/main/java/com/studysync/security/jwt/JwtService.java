package com.studysync.security.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.studysync.model.auth.AuthAccount;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private static final String TOKEN_TYPE_ACCESS = "access";
    private static final String TOKEN_TYPE_REFRESH = "refresh";

    private final SecretKey signingKey;
    private final long expirationMs;
    private final long refreshExpirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms}") long expirationMs,
            @Value("${app.jwt.refresh-expiration-ms}") long refreshExpirationMs
    ) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException(
                    "La clave JWT no está configurada."
            );
        }

        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);

        if (keyBytes.length < 32) {
            throw new IllegalStateException(
                    "La clave JWT debe tener al menos 32 bytes."
            );
        }

        if (expirationMs <= 0) {
            throw new IllegalArgumentException(
                    "La duración del JWT debe ser positiva."
            );
        }

        if (refreshExpirationMs <= 0) {
            throw new IllegalArgumentException(
                    "La duración del Refresh Token debe ser positiva."
            );
        }

        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
        this.refreshExpirationMs = refreshExpirationMs;
    }

    /**
     * Genera el Access Token.
     */
    public String generateToken(AuthAccount account) {

        Date now = new Date();

        Date expiration = new Date(
                now.getTime() + expirationMs
        );

        return Jwts.builder()
                .setSubject(account.getId().toString())
                .claim("role", account.getRole().name())
                .claim("token_type", TOKEN_TYPE_ACCESS)
                .setIssuedAt(now)
                .setExpiration(expiration)
                .signWith(signingKey)
                .compact();
    }

    /**
     * Genera el Refresh Token.
     */
    public String generateRefreshToken(AuthAccount account) {

        Date now = new Date();

        Date expiration = new Date(
                now.getTime() + refreshExpirationMs
        );

        return Jwts.builder()
                .setSubject(account.getId().toString())
                .claim("token_type", TOKEN_TYPE_REFRESH)
                .setIssuedAt(now)
                .setExpiration(expiration)
                .signWith(signingKey)
                .compact();
    }

    /**
     * Valida un Access Token y devuelve el UUID de la cuenta.
     */
    public UUID validateToken(String token) {

        try {
            Claims claims = parseClaims(token);

            String tokenType = claims.get("token_type", String.class);

            if (!TOKEN_TYPE_ACCESS.equals(tokenType)) {
                return null;
            }

            return UUID.fromString(
                    claims.getSubject()
            );

        } catch (RuntimeException ex) {
            return null;
        }
    }

    /**
     * Valida un Refresh Token y devuelve el UUID de la cuenta.
     */
    public UUID validateRefreshToken(String token) {

        try {
            Claims claims = parseClaims(token);

            String tokenType = claims.get("token_type", String.class);

            if (!TOKEN_TYPE_REFRESH.equals(tokenType)) {
                return null;
            }

            return UUID.fromString(
                    claims.getSubject()
            );

        } catch (RuntimeException ex) {
            return null;
        }
    }

    /**
     * Devuelve los claims de un JWT válido.
     */
    private Claims parseClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Tiempo restante de un Access Token en milisegundos.
     */
    public long getRemainingValidityMillis(String token) {

        try {
            Claims claims = parseClaims(token);

            Date expiration = claims.getExpiration();

            if (expiration == null) {
                return 0;
            }

            return Math.max(
                    0,
                    expiration.getTime() - System.currentTimeMillis()
            );

        } catch (RuntimeException ex) {
            return 0;
        }
    }

    /**
     * Tiempo restante de un Refresh Token en milisegundos.
     */
    public long getRemainingRefreshValidityMillis(String token) {

        try {
            Claims claims = parseClaims(token);

            String tokenType = claims.get("token_type", String.class);

            if (!TOKEN_TYPE_REFRESH.equals(tokenType)) {
                return 0;
            }

            Date expiration = claims.getExpiration();

            if (expiration == null) {
                return 0;
            }

            return Math.max(
                    0,
                    expiration.getTime() - System.currentTimeMillis()
            );

        } catch (RuntimeException ex) {
            return 0;
        }
    }

    /**
     * Duración configurada del Access Token en segundos.
     */
    public long getExpirationSeconds() {
        return expirationMs / 1000;
    }

    /**
     * Duración configurada del Refresh Token en segundos.
     */
    public long getRefreshExpirationSeconds() {
        return refreshExpirationMs / 1000;
    }
}

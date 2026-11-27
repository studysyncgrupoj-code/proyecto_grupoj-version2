package com.studysync.service;

import org.springframework.stereotype.Service;
import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Arrays;

@Service
public class MfaCryptoService {

    private final SecretKeySpec key;
    private final SecureRandom random = new SecureRandom();

    public MfaCryptoService() throws Exception {
        Path path = Path.of(
            System.getProperty("user.home"),
            ".config", "studysync", "mfa.key"
        );

        byte[] bytes = Base64.getDecoder()
            .decode(Files.readString(path).trim());

        if (bytes.length != 32) {
            throw new IllegalStateException("Invalid MFA key");
        }

        this.key = new SecretKeySpec(bytes, "AES");
    }

    public String encrypt(String secret) {
        try {
            byte[] iv = new byte[12];
            random.nextBytes(iv);

            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE, key,
                new GCMParameterSpec(128, iv));

            byte[] encrypted = cipher.doFinal(
                secret.getBytes(StandardCharsets.UTF_8)
            );

            byte[] result = new byte[iv.length + encrypted.length];

            System.arraycopy(iv, 0, result, 0, iv.length);
            System.arraycopy(encrypted, 0, result,
                iv.length, encrypted.length);

            return Base64.getEncoder().encodeToString(result);

        } catch (Exception e) {
            throw new IllegalStateException("MFA encryption failed", e);
        }
    }

    public String decrypt(String value) {
        try {
            byte[] data = Base64.getDecoder().decode(value);
            byte[] iv = Arrays.copyOfRange(data, 0, 12);
            byte[] encrypted = Arrays.copyOfRange(data, 12, data.length);

            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.DECRYPT_MODE, key,
                new GCMParameterSpec(128, iv));

            return new String(
                cipher.doFinal(encrypted),
                StandardCharsets.UTF_8
            );

        } catch (Exception e) {
            throw new IllegalStateException("MFA decryption failed", e);
        }
    }
}

package com.studysync.service.email;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class ResendEmailService implements EmailService {

    private static final Logger logger =
            LoggerFactory.getLogger(ResendEmailService.class);

    private static final String RESEND_URL =
            "https://api.resend.com/emails";

    @Value("${resend.api.key}")
    private String resendApiKey;

    @Value("${resend.from}")
    private String fromAddress;

    private final RestTemplate restTemplate;

    public ResendEmailService(RestTemplateBuilder builder) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(10))
                .build();
    }

    @Override
    public boolean send(EmailMessage message) {

        Map<String, Object> payload = new HashMap<>();

        payload.put("from", fromAddress);
        payload.put("to", List.of(message.to()));
        payload.put("subject", message.subject());

        if (message.replyTo() != null && !message.replyTo().isBlank()) {
            payload.put("reply_to", message.replyTo());
        }

        if (message.text() != null && !message.text().isBlank()) {
            payload.put("text", message.text());
        }

        if (message.html() != null && !message.html().isBlank()) {
            payload.put("html", message.html());
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        if (resendApiKey != null && !resendApiKey.isBlank()) {
            headers.setBearerAuth(resendApiKey);
        }

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(payload, headers);

        try {
            restTemplate.postForEntity(
                    RESEND_URL,
                    entity,
                    String.class
            );

            logger.info(
                    "Correo enviado correctamente a {}",
                    message.to()
            );

            return true;

        } catch (HttpStatusCodeException e) {
            logger.error(
                    "Resend respondió con error {}: {}",
                    e.getStatusCode(),
                    e.getResponseBodyAsString()
            );

            return false;

        } catch (RestClientException e) {
            logger.error(
                    "Error de conexión con el servicio de correo",
                    e
            );

            return false;
        }
    }
}

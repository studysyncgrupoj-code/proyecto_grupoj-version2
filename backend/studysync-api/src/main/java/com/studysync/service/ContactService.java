package com.studysync.service;

import java.time.Duration;
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

import com.studysync.dto.ContactRequest;

@Service
public class ContactService {

    private static final Logger logger = LoggerFactory.getLogger(ContactService.class);

    // CORRECCIÓN: URL se queda como constante porque NO cambia por entorno.
    // Si algún día necesitas apuntar a un mock en tests, usa MockRestServiceServer
    // en vez de cambiar esta constante.
    private static final String RESEND_URL = "https://api.resend.com/emails";

    @Value("${resend.api.key}")
    private String resendApiKey;

    // CORRECCIÓN: from y to ahora se inyectan desde application.properties.
    // ¿Por qué? Cambian entre dev (sandbox) y prod (dominio verificado)
    // sin necesidad de recompilar.
    @Value("${resend.from}")
    private String fromAddress;

    @Value("${resend.to}")
    private String toAddress;

    private final RestTemplate restTemplate;

    public ContactService(RestTemplateBuilder builder) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(10))
                .build();
    }

    public boolean sendEmail(ContactRequest request) {

        String textBody = String.format(
            "Nuevo mensaje recibido desde StudySync%n%n" +
            "Nombre: %s%n" +
            "Correo: %s%n" +
            "Teléfono: %s%n%n" +
            "Asunto:%n%s%n%n" +
            "Mensaje:%n%s",
            request.getName(),
            request.getEmail(),
            request.getContactNumber() != null && !request.getContactNumber().isBlank()
                ? request.getContactNumber()
                : "No proporcionado",
            request.getSubject(),
            request.getMessage()
        );

        Map<String, Object> resendPayload = Map.of(
            "from", fromAddress,          // ← ahora viene de application.properties
            "to", List.of(toAddress),     // ← ahora viene de application.properties
            "reply_to", request.getEmail(),
            "subject", "[StudySync Contact] " + request.getSubject(),
            "text", textBody
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        final String resendApiKey2 = resendApiKey;
        if (resendApiKey2 != null) {
            headers.setBearerAuth(resendApiKey2);
        } else {
        }

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(resendPayload, headers);

        try {
            restTemplate.postForEntity(RESEND_URL, entity, String.class);
            logger.info("Correo de contacto enviado. Reply-to: {}", request.getEmail());
            return true;

        } catch (HttpStatusCodeException e) {
            logger.error("Resend respondió con error {}: {}",
                    e.getStatusCode(), e.getResponseBodyAsString());
            return false;

        } catch (RestClientException e) {
            logger.error("Error de conexión con Resend", e);
            return false;
        }
    }
}
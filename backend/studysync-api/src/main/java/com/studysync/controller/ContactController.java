package com.studysync.controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studysync.dto.ContactRequest;
import com.studysync.service.ContactService;

import jakarta.validation.Valid;

// CORRECCIÓN: se agrega @RestController (faltaba) para registrar los endpoints
// y serializar automáticamente las respuestas a JSON.
@RestController
@RequestMapping("/api")
public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping("/contact")
    public ResponseEntity<Map<String, Object>> handleContact(
            @Valid @RequestBody ContactRequest request) {

        try {
            boolean sent = contactService.sendEmail(request);

            if (sent) {
                return ResponseEntity.ok(Map.of(
                    "status", 200,
                    "message", "Mensaje enviado correctamente."
                ));
            }

            return ResponseEntity.status(502).body(Map.of(
                "status", 502,
                "message", "No fue posible enviar el mensaje."
            ));

        } catch (Exception e) {
            logger.error("Error interno inesperado procesando el contacto", e);
            return ResponseEntity.status(500).body(Map.of(
                "status", 500,
                "message", "Error interno al procesar el mensaje."
            ));
        }
    }
}
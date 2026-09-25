package com.studysync.service;

import com.studysync.model.StudyRoom;
import com.studysync.repository.StudyRoomRepository;

import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Locale;

@Service
public class StudyRoomService {

    private final StudyRoomRepository studyRoomRepository;

    public StudyRoomService(
            StudyRoomRepository studyRoomRepository
    ) {
        this.studyRoomRepository = studyRoomRepository;
    }

    // Consultar todas las salas
    public List<StudyRoom> getAllRooms() {
        return studyRoomRepository.findAll();
    }

    // Crear una sala con validación de videoconferencia
    public StudyRoom saveRoom(StudyRoom room) {

        // Validar plataforma
        if (room.getMeetingProvider() == null) {
            throw new IllegalArgumentException(
                "Debes seleccionar una plataforma de videoconferencia."
            );
        }

        // Validar que exista un enlace
        String url = room.getMeetingUrl();

        if (url == null || url.isBlank()) {
            throw new IllegalArgumentException(
                "Debes proporcionar un enlace de videoconferencia."
            );
        }

        String normalizedUrl = url.trim();

        // Analizar el enlace
        URI uri;

        try {
            uri = new URI(normalizedUrl);
        } catch (URISyntaxException e) {
            throw new IllegalArgumentException(
                "El enlace de videoconferencia no es válido."
            );
        }

        // Exigir HTTPS
        if (!"https".equalsIgnoreCase(uri.getScheme())) {
            throw new IllegalArgumentException(
                "El enlace debe utilizar HTTPS."
            );
        }

        // Obtener dominio
        String host = uri.getHost();

        if (host == null) {
            throw new IllegalArgumentException(
                "El enlace no contiene un dominio válido."
            );
        }

        host = host.toLowerCase(Locale.ROOT);

        // Validar el dominio según la plataforma
        boolean valid = switch (room.getMeetingProvider()) {

            case GOOGLE_MEET ->
                host.equals("meet.google.com");

            case ZOOM ->
                host.equals("zoom.us")
                || host.endsWith(".zoom.us");

            case TEAMS ->
                host.equals("teams.microsoft.com");
        };

        if (!valid) {
            throw new IllegalArgumentException(
                "El enlace no corresponde a la plataforma seleccionada."
            );
        }

        // Guardar enlace normalizado
        room.setMeetingUrl(normalizedUrl);

        // Guardar sala en PostgreSQL
        return studyRoomRepository.save(room);
    }
}
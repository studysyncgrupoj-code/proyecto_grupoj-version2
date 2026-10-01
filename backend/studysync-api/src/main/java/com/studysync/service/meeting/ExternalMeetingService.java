package com.studysync.service.meeting;

import com.studysync.model.StudyRoom;
import com.studysync.model.meeting.ExternalMeeting;
import com.studysync.repository.StudyRoomRepository;
import com.studysync.repository.meeting.ExternalMeetingRepository;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

@Service
public class ExternalMeetingService {

    private final ExternalMeetingRepository externalMeetingRepository;
    private final StudyRoomRepository studyRoomRepository;
    private final GoogleMeetService googleMeetService;
    private final ObjectMapper objectMapper;

    public ExternalMeetingService(
            ExternalMeetingRepository externalMeetingRepository,
            StudyRoomRepository studyRoomRepository,
            GoogleMeetService googleMeetService,
            ObjectMapper objectMapper
    ) {
        this.externalMeetingRepository = externalMeetingRepository;
        this.studyRoomRepository = studyRoomRepository;
        this.googleMeetService = googleMeetService;
        this.objectMapper = objectMapper;
    }

    public ExternalMeeting createMeeting(
            ExternalMeeting meeting
    ) {

        if (meeting.getProvider() == null) {
            throw new IllegalArgumentException(
                    "El proveedor de videoconferencia es obligatorio."
            );
        }

        if (meeting.getMeetingUrl() == null ||
                meeting.getMeetingUrl().isBlank()) {

            throw new IllegalArgumentException(
                    "El enlace de la reunión es obligatorio."
            );
        }

        if (meeting.getStudyRoomId() != null &&
                !studyRoomRepository.existsById(
                        meeting.getStudyRoomId()
                )) {

            throw new IllegalArgumentException(
                    "La sala de estudio no existe."
            );
        }

        if (meeting.getExternalMeetingId() != null &&
                !meeting.getExternalMeetingId().isBlank()) {

            externalMeetingRepository
                    .findByProviderAndExternalMeetingId(
                            meeting.getProvider(),
                            meeting.getExternalMeetingId()
                    )
                    .ifPresent(existing -> {
                        throw new IllegalArgumentException(
                                "Ya existe una reunión con este ID para el proveedor seleccionado."
                        );
                    });
        }

        meeting.setMeetingUrl(
                meeting.getMeetingUrl().trim()
        );

        if (meeting.getHostUrl() != null) {
            meeting.setHostUrl(
                    meeting.getHostUrl().trim()
            );
        }

        if (meeting.getStatus() == null ||
                meeting.getStatus().isBlank()) {

            meeting.setStatus("ACTIVE");
        }

        return externalMeetingRepository.save(meeting);
    }

    public ExternalMeeting createGoogleMeeting(Long studyRoomId)
            throws Exception {

        if (studyRoomId == null) {
            throw new IllegalArgumentException(
                    "La sala de estudio es obligatoria."
            );
        }

        if (!studyRoomRepository.existsById(studyRoomId)) {
            throw new IllegalArgumentException(
                    "La sala de estudio no existe."
            );
        }

        String googleResponse =
                googleMeetService.createMeeting();

        JsonNode json =
                objectMapper.readTree(googleResponse);

        ExternalMeeting meeting =
                new ExternalMeeting();

        meeting.setStudyRoomId(studyRoomId);
        meeting.setProvider(
                ExternalMeeting.Provider.GOOGLE_MEET
        );

        meeting.setExternalMeetingId(
                json.path("name").asText()
        );

        meeting.setMeetingUrl(
                json.path("meetingUri").asText()
        );

        meeting.setStatus("ACTIVE");

        return externalMeetingRepository.save(meeting);
    }

    public List<ExternalMeeting> getAllMeetings() {

        return externalMeetingRepository.findAll();
    }

    public ExternalMeeting getMeeting(Long id) {

        return externalMeetingRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Reunión externa no encontrada: " + id
                        )
                );
    }

    public List<ExternalMeeting> getMeetingsByRoom(
            Long studyRoomId
    ) {

        if (!studyRoomRepository.existsById(studyRoomId)) {
            throw new IllegalArgumentException(
                    "La sala de estudio no existe."
            );
        }

        return externalMeetingRepository
                .findByStudyRoomId(studyRoomId);
    }

    public ExternalMeeting finishMeeting(Long id) {

        ExternalMeeting meeting = getMeeting(id);

        meeting.setStatus("COMPLETED");

        return externalMeetingRepository.save(meeting);
    }

    public ExternalMeeting cancelMeeting(Long id) {

        ExternalMeeting meeting = getMeeting(id);

        meeting.setStatus("CANCELLED");

        return externalMeetingRepository.save(meeting);
    }
}

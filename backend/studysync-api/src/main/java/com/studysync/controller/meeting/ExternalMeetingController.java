package com.studysync.controller.meeting;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.auth.oauth2.Credential;

import com.studysync.model.meeting.ExternalMeeting;
import com.studysync.service.meeting.ExternalMeetingService;
import com.studysync.service.meeting.GoogleMeetOAuthService;
import com.studysync.service.meeting.GoogleMeetService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/external-meetings")
public class ExternalMeetingController {

    private final ExternalMeetingService externalMeetingService;
    private final GoogleMeetOAuthService googleMeetOAuthService;
    private final GoogleMeetService googleMeetService;

    public ExternalMeetingController(
            ExternalMeetingService externalMeetingService,
            GoogleMeetOAuthService googleMeetOAuthService,
            GoogleMeetService googleMeetService
    ) {
        this.externalMeetingService = externalMeetingService;
        this.googleMeetOAuthService = googleMeetOAuthService;
        this.googleMeetService = googleMeetService;
    }

    @PostMapping
    public ResponseEntity<ExternalMeeting> createMeeting(
            @RequestBody ExternalMeeting meeting
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        externalMeetingService.createMeeting(meeting)
                );
    }

    @GetMapping
    public ResponseEntity<List<ExternalMeeting>> getAllMeetings() {
        return ResponseEntity.ok(
                externalMeetingService.getAllMeetings()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExternalMeeting> getMeeting(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                externalMeetingService.getMeeting(id)
        );
    }

    @GetMapping("/room/{studyRoomId}")
    public ResponseEntity<List<ExternalMeeting>> getMeetingsByRoom(
            @PathVariable Long studyRoomId
    ) {
        return ResponseEntity.ok(
                externalMeetingService.getMeetingsByRoom(
                        studyRoomId
                )
        );
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ExternalMeeting> finishMeeting(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                externalMeetingService.finishMeeting(id)
        );
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ExternalMeeting> cancelMeeting(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                externalMeetingService.cancelMeeting(id)
        );
    }

    // ==========================================
    // GOOGLE MEET - CREAR REUNIÓN DE PRUEBA
    // ==========================================

    @PostMapping("/google/create")
    public ResponseEntity<String> createGoogleMeeting()
            throws Exception {

        return ResponseEntity.ok(
                googleMeetService.createMeeting()
        );
    }

    @PostMapping("/google/create/{studyRoomId}")
    public ResponseEntity<ExternalMeeting> createGoogleMeeting(
            @PathVariable Long studyRoomId
    ) throws Exception {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        externalMeetingService.createGoogleMeeting(
                                studyRoomId
                        )
                );
    }

    // ==========================================
    // GOOGLE MEET - INICIAR AUTORIZACIÓN
    // ==========================================

    @GetMapping("/oauth2/google/start")
    public ResponseEntity<Void> startGoogleOAuth() throws Exception {

        GoogleAuthorizationCodeFlow flow =
                googleMeetOAuthService.createFlow();

        String authorizationUrl = flow
                .newAuthorizationUrl()
                .setRedirectUri(
                        "http://localhost:8080/api/external-meetings/oauth2/callback/google"
                )
                .build();

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .header(
                        "Location",
                        authorizationUrl
                )
                .build();
    }

    // ==========================================
    // GOOGLE MEET - CALLBACK
    // ==========================================

    @GetMapping("/oauth2/callback/google")
    public ResponseEntity<String> googleOAuthCallback(
            @RequestParam("code") String code
    ) throws Exception {

        GoogleAuthorizationCodeFlow flow =
                googleMeetOAuthService.createFlow();

        Credential credential = flow
                .createAndStoreCredential(
                        flow.newTokenRequest(code)
                                .setRedirectUri(
                                        "http://localhost:8080/api/external-meetings/oauth2/callback/google"
                                )
                                .execute(),
                        "studysync-user"
                );

        return ResponseEntity.ok(
                "Google Meet autorizado correctamente. "
                        + "StudySync ya tiene acceso autorizado."
        );
    }

    // ==========================================
    // GOOGLE MEET - COMPROBAR CREDENCIAL
    // ==========================================

    @GetMapping("/oauth2/google/status")
    public ResponseEntity<String> googleOAuthStatus()
            throws Exception {

        Credential credential =
                googleMeetOAuthService.getStoredCredential();

        if (credential == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Google Meet todavía no está autorizado.");
        }

        return ResponseEntity.ok(
                "Google Meet está autorizado correctamente."
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleValidationError(
            IllegalArgumentException exception
    ) {
        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "error",
                                exception.getMessage()
                        )
                );
    }
}

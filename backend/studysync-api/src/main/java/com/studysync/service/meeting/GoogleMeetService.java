package com.studysync.service.meeting;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.http.HttpRequest;
import com.google.api.client.http.HttpRequestFactory;
import com.google.api.client.http.HttpResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpHeaders;
import com.google.api.client.http.ByteArrayContent;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class GoogleMeetService {

    private final GoogleMeetOAuthService googleMeetOAuthService;

    public GoogleMeetService(
            GoogleMeetOAuthService googleMeetOAuthService
    ) {
        this.googleMeetOAuthService = googleMeetOAuthService;
    }

    public String createMeeting() throws Exception {

        Credential credential =
                googleMeetOAuthService.getStoredCredential();

        if (credential == null) {
            throw new IllegalStateException(
                    "Google Meet todavía no está autorizado."
            );
        }

        HttpTransport transport =
                GoogleNetHttpTransport.newTrustedTransport();

        HttpRequestFactory requestFactory =
                transport.createRequestFactory(credential);

        GenericUrl url =
                new GenericUrl(
                        "https://meet.googleapis.com/v2/spaces"
                );

        String json = "{}";

        ByteArrayContent content =
                new ByteArrayContent(
                        "application/json",
                        json.getBytes(StandardCharsets.UTF_8)
                );

        HttpRequest request =
                requestFactory.buildPostRequest(url, content);

        request.getHeaders().setContentType("application/json");

        HttpResponse response =
                request.execute();

        return response.parseAsString();
    }
}

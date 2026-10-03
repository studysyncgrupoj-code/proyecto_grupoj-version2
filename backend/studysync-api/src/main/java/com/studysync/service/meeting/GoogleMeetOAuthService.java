package com.studysync.service.meeting;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.client.auth.oauth2.Credential;

import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileReader;
import java.util.Collections;

@Service
public class GoogleMeetOAuthService {

    private static final String CREDENTIALS_FILE =
            "secrets/google-oauth.json";

    private static final String TOKENS_DIRECTORY =
            "secrets/google-tokens";

    private static final String MEET_SCOPE =
            "https://www.googleapis.com/auth/meetings.space.created";

    private static final GsonFactory JSON_FACTORY =
            GsonFactory.getDefaultInstance();

    public GoogleAuthorizationCodeFlow createFlow() throws Exception {

        HttpTransport httpTransport =
                GoogleNetHttpTransport.newTrustedTransport();

        GoogleClientSecrets clientSecrets =
                GoogleClientSecrets.load(
                        JSON_FACTORY,
                        new FileReader(CREDENTIALS_FILE)
                );

        return new GoogleAuthorizationCodeFlow.Builder(
                httpTransport,
                JSON_FACTORY,
                clientSecrets,
                Collections.singletonList(MEET_SCOPE)
        )
        .setDataStoreFactory(
                new FileDataStoreFactory(
                        new File(TOKENS_DIRECTORY)
                )
        )
        .setAccessType("offline")
        .build();
    }

    public Credential getStoredCredential() throws Exception {

        GoogleAuthorizationCodeFlow flow = createFlow();

        return flow.loadCredential("studysync-user");
    }
}

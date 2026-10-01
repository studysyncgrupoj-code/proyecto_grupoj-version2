package com.studysync.model.meeting;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "external_meetings",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_external_meeting_provider_id",
            columnNames = {"provider", "external_meeting_id"}
        )
    }
)
public class ExternalMeeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "study_room_id")
    private Long studyRoomId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Provider provider;

    @Column(name = "external_meeting_id")
    private String externalMeetingId;

    @Column(name = "meeting_url", length = 2048)
    private String meetingUrl;

    @Column(name = "host_url", length = 2048)
    private String hostUrl;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Column(nullable = false)
    private String status = "ACTIVE";

    public enum Provider {
        ZOOM,
        GOOGLE_MEET,
        TEAMS
    }

    public Long getId() {
        return id;
    }

    public Long getStudyRoomId() {
        return studyRoomId;
    }

    public Provider getProvider() {
        return provider;
    }

    public String getExternalMeetingId() {
        return externalMeetingId;
    }

    public String getMeetingUrl() {
        return meetingUrl;
    }

    public String getHostUrl() {
        return hostUrl;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public String getStatus() {
        return status;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setStudyRoomId(Long studyRoomId) {
        this.studyRoomId = studyRoomId;
    }

    public void setProvider(Provider provider) {
        this.provider = provider;
    }

    public void setExternalMeetingId(String externalMeetingId) {
        this.externalMeetingId = externalMeetingId;
    }

    public void setMeetingUrl(String meetingUrl) {
        this.meetingUrl = meetingUrl;
    }

    public void setHostUrl(String hostUrl) {
        this.hostUrl = hostUrl;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

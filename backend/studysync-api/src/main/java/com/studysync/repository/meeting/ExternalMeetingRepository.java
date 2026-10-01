package com.studysync.repository.meeting;

import com.studysync.model.meeting.ExternalMeeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExternalMeetingRepository
        extends JpaRepository<ExternalMeeting, Long> {

    Optional<ExternalMeeting> findByProviderAndExternalMeetingId(
            ExternalMeeting.Provider provider,
            String externalMeetingId
    );

    List<ExternalMeeting> findByStudyRoomId(Long studyRoomId);
}

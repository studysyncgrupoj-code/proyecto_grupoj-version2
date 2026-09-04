package com.studysync.repository;

import com.studysync.model.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface CalendarEventRepository
        extends JpaRepository<CalendarEvent, Long> {

    List<CalendarEvent> findByUserIdOrderByStartDateTimeAsc(Long userId);

    List<CalendarEvent>
    findByUserIdAndStartDateTimeBetweenOrderByStartDateTimeAsc(
            Long userId,
            LocalDateTime start,
            LocalDateTime end
    );
}

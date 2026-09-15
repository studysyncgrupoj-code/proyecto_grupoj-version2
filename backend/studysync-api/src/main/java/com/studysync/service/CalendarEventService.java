package com.studysync.service;

import com.studysync.model.CalendarEvent;
import com.studysync.repository.CalendarEventRepository;
import com.studysync.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CalendarEventService {

    private final CalendarEventRepository calendarEventRepository;
    private final UserRepository userRepository;

    public CalendarEventService(
            CalendarEventRepository calendarEventRepository,
            UserRepository userRepository) {

        this.calendarEventRepository = calendarEventRepository;
        this.userRepository = userRepository;
    }

    public List<CalendarEvent> getByUser(Long userId) {
        validateUser(userId);

        return calendarEventRepository
                .findByUserIdOrderByStartDateTimeAsc(userId);
    }

    public List<CalendarEvent> getByUserAndRange(
            Long userId,
            LocalDateTime start,
            LocalDateTime end) {

        validateUser(userId);

        return calendarEventRepository
                .findByUserIdAndStartDateTimeBetweenOrderByStartDateTimeAsc(
                        userId,
                        start,
                        end
                );
    }

    public CalendarEvent create(CalendarEvent event) {

        validateEvent(event);

        return calendarEventRepository.save(event);
    }

    public CalendarEvent update(
            Long id,
            CalendarEvent incomingEvent) {

        CalendarEvent currentEvent =
                calendarEventRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Evento no encontrado: " + id
                                )
                        );

        if (incomingEvent.getTitle() != null) {
            currentEvent.setTitle(
                    incomingEvent.getTitle()
            );
        }

        if (incomingEvent.getType() != null) {
            currentEvent.setType(
                    incomingEvent.getType()
            );
        }

        if (incomingEvent.getStartDateTime() != null) {
            currentEvent.setStartDateTime(
                    incomingEvent.getStartDateTime()
            );
        }

        if (incomingEvent.getEndDateTime() != null) {
            currentEvent.setEndDateTime(
                    incomingEvent.getEndDateTime()
            );
        }

        if (incomingEvent.getParticipants() != null) {
            currentEvent.setParticipants(
                    incomingEvent.getParticipants()
            );
        }

        if (incomingEvent.getDescription() != null) {
            currentEvent.setDescription(
                    incomingEvent.getDescription()
            );
        }

        return calendarEventRepository.save(currentEvent);
    }

    public void delete(Long id) {

        if (!calendarEventRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Evento no encontrado: " + id
            );
        }

        calendarEventRepository.deleteById(id);
    }

    private void validateEvent(CalendarEvent event) {

        if (event.getUserId() == null) {
            throw new IllegalArgumentException(
                    "El usuario es obligatorio."
            );
        }

        validateUser(event.getUserId());

        if (event.getTitle() == null ||
                event.getTitle().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "El título es obligatorio."
            );
        }

        if (event.getType() == null ||
                event.getType().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "El tipo de evento es obligatorio."
            );
        }

        if (event.getStartDateTime() == null) {
            throw new IllegalArgumentException(
                    "La fecha de inicio es obligatoria."
            );
        }

        if (event.getParticipants() == null) {
            event.setParticipants(1);
        }
    }

    private void validateUser(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException(
                    "Usuario no encontrado: " + userId
            );
        }
    }
}

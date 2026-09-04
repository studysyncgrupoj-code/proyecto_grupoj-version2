package com.studysync.controller;

import com.studysync.model.CalendarEvent;
import com.studysync.service.CalendarEventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@CrossOrigin(origins = "http://localhost:5173")
public class CalendarEventController {

    private final CalendarEventService calendarEventService;

    public CalendarEventController(
            CalendarEventService calendarEventService) {

        this.calendarEventService = calendarEventService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CalendarEvent>> getByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                calendarEventService.getByUser(userId)
        );
    }

    @GetMapping("/user/{userId}/range")
    public ResponseEntity<List<CalendarEvent>> getByRange(
            @PathVariable Long userId,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {

        return ResponseEntity.ok(
                calendarEventService.getByUserAndRange(
                        userId,
                        start,
                        end
                )
        );
    }

    @PostMapping
    public ResponseEntity<CalendarEvent> create(
            @RequestBody CalendarEvent event) {

        return ResponseEntity.ok(
                calendarEventService.create(event)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<CalendarEvent> update(
            @PathVariable Long id,
            @RequestBody CalendarEvent event) {

        return ResponseEntity.ok(
                calendarEventService.update(id, event)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        calendarEventService.delete(id);

        return ResponseEntity.noContent().build();
    }
}

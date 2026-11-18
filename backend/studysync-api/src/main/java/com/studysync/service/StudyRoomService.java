
package com.studysync.service;

import com.studysync.model.Course;
import com.studysync.model.StudyRoom;
import com.studysync.repository.CourseRepository;
import com.studysync.repository.StudyRoomRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class StudyRoomService {

    private static final String JITSI_BASE_URL = "https://meet.jit.si/";

    private final StudyRoomRepository studyRoomRepository;
    private final CourseRepository courseRepository;

    public StudyRoomService(
            StudyRoomRepository studyRoomRepository,
            CourseRepository courseRepository) {
        this.studyRoomRepository = studyRoomRepository;
        this.courseRepository = courseRepository;
    }

    public List<StudyRoom> getAllRooms() {
        return studyRoomRepository.findAll();
    }

    public Optional<StudyRoom> getRoomById(Long id) {
        return studyRoomRepository.findById(id);
    }

    public StudyRoom saveRoom(StudyRoom room) {
        if (room.getTipo() == null || room.getTipo().isBlank()) {
            room.setTipo("TEMATICA");
        }

        validarTipoYCurso(room);

        room.setEstado("PROGRAMADA");
        room.setFechaFinalizacion(null);

        // Generar una reunión única para la sala.
        room.setMeetingProvider("JITSI");
        room.setMeetingUrl(generarUrlJitsi());

        return studyRoomRepository.save(room);
    }

    public StudyRoom updateRoom(Long id, StudyRoom roomData) {
        StudyRoom room = buscarSala(id);

        if (!"PROGRAMADA".equals(room.getEstado())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Solo se pueden editar salas programadas");
        }

        room.setNombre(roomData.getNombre());
        room.setDescripcion(roomData.getDescripcion());
        room.setPrivada(roomData.getPrivada());

        if (roomData.getTipo() != null) {
            room.setTipo(roomData.getTipo());
        }

        room.setCourseId(roomData.getCourseId());
        room.setFechaProgramada(roomData.getFechaProgramada());

        validarTipoYCurso(room);

        return studyRoomRepository.save(room);
    }

    public StudyRoom activarSala(Long id) {
        StudyRoom room = buscarSala(id);

        if (!"PROGRAMADA".equals(room.getEstado())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La sala no está en estado PROGRAMADA");
        }

        // Compatibilidad con salas creadas anteriormente.
        if (room.getMeetingUrl() == null ||
                room.getMeetingUrl().isBlank()) {
            room.setMeetingProvider("JITSI");
            room.setMeetingUrl(generarUrlJitsi());
        }

        room.setEstado("ACTIVA");

        return studyRoomRepository.save(room);
    }

    public StudyRoom finalizarSala(Long id) {
        StudyRoom room = buscarSala(id);

        if (!"ACTIVA".equals(room.getEstado())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Solo se pueden finalizar salas activas");
        }

        room.setEstado("FINALIZADA");
        room.setFechaFinalizacion(LocalDateTime.now());

        return studyRoomRepository.save(room);
    }

    public boolean deleteRoom(Long id) {
        if (!studyRoomRepository.existsById(id)) {
            return false;
        }

        studyRoomRepository.deleteById(id);
        return true;
    }

    private StudyRoom buscarSala(Long id) {
        return studyRoomRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Sala no encontrada"));
    }

    private String generarUrlJitsi() {
        String identificador = UUID.randomUUID()
                .toString()
                .replace("-", "");

        return JITSI_BASE_URL + "studysync-" + identificador;
    }

    private void validarTipoYCurso(StudyRoom room) {
        String tipo = room.getTipo();

        if (!"TEMATICA".equals(tipo) && !"CURSO".equals(tipo)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El tipo debe ser TEMATICA o CURSO");
        }

        if ("CURSO".equals(tipo)) {
            if (room.getCourseId() == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Una clase debe estar asociada a un curso");
            }

            Course course = courseRepository
                    .findById(room.getCourseId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "El curso asociado no existe"));

            if (!"Activo".equalsIgnoreCase(course.getStatus())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "El curso asociado no está activo");
            }
        } else {
            room.setCourseId(null);
        }
    }
}

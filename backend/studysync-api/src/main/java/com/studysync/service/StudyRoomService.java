
package com.studysync.service;

import com.studysync.model.Course;
import com.studysync.model.StudyRoom;
import com.studysync.model.StudyRoomAccessRequest;
import com.studysync.model.StudyRoomParticipant;
import com.studysync.model.User;

import com.studysync.repository.CourseRepository;
import com.studysync.repository.StudyRoomRepository;
import com.studysync.repository.StudyRoomAccessRequestRepository;
import com.studysync.repository.StudyRoomParticipantRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
    private final StudyRoomAccessRequestRepository accessRequestRepository;
    private final StudyRoomParticipantRepository participantRepository;

    public StudyRoomService(
            StudyRoomRepository studyRoomRepository,
            CourseRepository courseRepository,
            StudyRoomAccessRequestRepository accessRequestRepository,
            StudyRoomParticipantRepository participantRepository) {

        this.studyRoomRepository = studyRoomRepository;
        this.courseRepository = courseRepository;
        this.accessRequestRepository = accessRequestRepository;
        this.participantRepository = participantRepository;
    }

    private Long obtenerUsuarioAutenticado() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                !(authentication.getPrincipal() instanceof User)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Usuario no autenticado");
        }

        User user = (User) authentication.getPrincipal();
        return user.getId();
    }

    private void validarPropietario(StudyRoom room) {
        Long usuarioId = obtenerUsuarioAutenticado();

        if (room.getCreadorId() == null ||
                !room.getCreadorId().equals(usuarioId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Solo el creador puede administrar esta sala");
        }
    }

    private StudyRoom buscarSala(Long id) {
        return studyRoomRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Sala no encontrada"));
    }

    private boolean tieneAcceso(StudyRoom room, Long usuarioId) {
        if (!Boolean.TRUE.equals(room.getPrivada())) {
            return true;
        }

        if (usuarioId.equals(room.getCreadorId())) {
            return true;
        }

        return participantRepository.existsByRoomIdAndUserId(
                room.getId(),
                usuarioId
        );
    }

    private StudyRoom prepararSalaParaRespuesta(StudyRoom original) {
        StudyRoom respuesta = new StudyRoom();

        respuesta.setId(original.getId());
        respuesta.setNombre(original.getNombre());
        respuesta.setDescripcion(original.getDescripcion());
        respuesta.setPrivada(original.getPrivada());
        respuesta.setCreadorId(original.getCreadorId());
        respuesta.setFechaCreacion(original.getFechaCreacion());
        respuesta.setTipo(original.getTipo());
        respuesta.setCourseId(original.getCourseId());
        respuesta.setFechaProgramada(original.getFechaProgramada());
        respuesta.setEstado(original.getEstado());
        respuesta.setFechaFinalizacion(original.getFechaFinalizacion());
        respuesta.setMeetingProvider(original.getMeetingProvider());

        Long usuarioId = obtenerUsuarioAutenticado();

        if (tieneAcceso(original, usuarioId)) {
            respuesta.setMeetingUrl(original.getMeetingUrl());
        }

        return respuesta;
    }

    public List<StudyRoom> getAllRooms() {
        return studyRoomRepository.findAll().stream()
                .map(this::prepararSalaParaRespuesta)
                .toList();
    }

    public Optional<StudyRoom> getRoomById(Long id) {
        return studyRoomRepository.findById(id)
                .map(this::prepararSalaParaRespuesta);
    }

    public StudyRoom saveRoom(StudyRoom room) {
        Long usuarioId = obtenerUsuarioAutenticado();

        room.setId(null);
        room.setCreadorId(usuarioId);
        room.setFechaCreacion(LocalDateTime.now());

        if (room.getTipo() == null || room.getTipo().isBlank()) {
            room.setTipo("TEMATICA");
        }

        validarTipoYCurso(room);

        room.setEstado("PROGRAMADA");
        room.setFechaFinalizacion(null);
        room.setMeetingProvider("JITSI");
        room.setMeetingUrl(generarUrlJitsi());

        return prepararSalaParaRespuesta(studyRoomRepository.save(room));
    }

    public StudyRoom updateRoom(Long id, StudyRoom roomData) {
        StudyRoom room = buscarSala(id);
        validarPropietario(room);

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

        return prepararSalaParaRespuesta(studyRoomRepository.save(room));
    }

    public StudyRoom activarSala(Long id) {
        StudyRoom room = buscarSala(id);
        validarPropietario(room);

        if (!"PROGRAMADA".equals(room.getEstado())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La sala no está en estado PROGRAMADA");
        }

        if (room.getMeetingUrl() == null ||
                room.getMeetingUrl().isBlank()) {
            room.setMeetingProvider("JITSI");
            room.setMeetingUrl(generarUrlJitsi());
        }

        room.setEstado("ACTIVA");

        return prepararSalaParaRespuesta(studyRoomRepository.save(room));
    }

    public StudyRoom finalizarSala(Long id) {
        StudyRoom room = buscarSala(id);
        validarPropietario(room);

        if (!"ACTIVA".equals(room.getEstado())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Solo se pueden finalizar salas activas");
        }

        room.setEstado("FINALIZADA");
        room.setFechaFinalizacion(LocalDateTime.now());

        return prepararSalaParaRespuesta(studyRoomRepository.save(room));
    }

    @Transactional
    public StudyRoomAccessRequest solicitarAcceso(Long roomId) {
        StudyRoom room = buscarSala(roomId);
        Long usuarioId = obtenerUsuarioAutenticado();

        if (!Boolean.TRUE.equals(room.getPrivada())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Esta sala es pública y no requiere aprobación");
        }

        if (!"ACTIVA".equals(room.getEstado())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La sala debe estar activa para solicitar acceso");
        }

        if (tieneAcceso(room, usuarioId)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya tienes acceso a esta sala");
        }

        Optional<StudyRoomAccessRequest> existente =
                accessRequestRepository.findByRoomIdAndUserId(
                        roomId,
                        usuarioId
                );

        if (existente.isPresent()) {
            StudyRoomAccessRequest solicitud = existente.get();

            if ("PENDIENTE".equals(solicitud.getEstado())) {
                return solicitud;
            }

            solicitud.setEstado("PENDIENTE");
            solicitud.setFechaSolicitud(LocalDateTime.now());
            solicitud.setFechaRespuesta(null);

            return accessRequestRepository.save(solicitud);
        }

        return accessRequestRepository.save(
                new StudyRoomAccessRequest(roomId, usuarioId)
        );
    }

    public List<StudyRoomAccessRequest> obtenerSolicitudesPendientes(
            Long roomId) {

        StudyRoom room = buscarSala(roomId);
        validarPropietario(room);

        return accessRequestRepository.findByRoomIdAndEstado(
                roomId,
                "PENDIENTE"
        );
    }

    public List<StudyRoomAccessRequest> obtenerMisSolicitudes() {
        return accessRequestRepository.findByUserId(
                obtenerUsuarioAutenticado()
        );
    }

    @Transactional
    public StudyRoomAccessRequest responderSolicitud(
            Long roomId,
            Long solicitudId,
            boolean aprobar) {

        StudyRoom room = buscarSala(roomId);
        validarPropietario(room);

        if (!Boolean.TRUE.equals(room.getPrivada())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La sala no es privada");
        }

        if (!"ACTIVA".equals(room.getEstado())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La sala no está activa");
        }

        StudyRoomAccessRequest solicitud =
                accessRequestRepository.findById(solicitudId)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Solicitud no encontrada"));

        if (!roomId.equals(solicitud.getRoomId())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "La solicitud no pertenece a esta sala");
        }

        if (!"PENDIENTE".equals(solicitud.getEstado())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La solicitud ya fue respondida");
        }

        if (aprobar) {
            if (!participantRepository.existsByRoomIdAndUserId(
                    roomId,
                    solicitud.getUserId())) {

                participantRepository.save(
                        new StudyRoomParticipant(
                                roomId,
                                solicitud.getUserId()
                        )
                );
            }

            solicitud.setEstado("APROBADA");
        } else {
            solicitud.setEstado("RECHAZADA");
        }

        solicitud.setFechaRespuesta(LocalDateTime.now());

        return accessRequestRepository.save(solicitud);
    }

    public List<StudyRoomParticipant> obtenerParticipantes(Long roomId) {
        StudyRoom room = buscarSala(roomId);
        validarPropietario(room);

        return participantRepository.findByRoomId(roomId);
    }

    @Transactional
    public void eliminarParticipante(Long roomId, Long userId) {
        StudyRoom room = buscarSala(roomId);
        validarPropietario(room);

        participantRepository.deleteByRoomIdAndUserId(roomId, userId);
    }

    @Transactional
    public boolean deleteRoom(Long id) {
        Optional<StudyRoom> optional = studyRoomRepository.findById(id);

        if (optional.isEmpty()) {
            return false;
        }

        validarPropietario(optional.get());

        accessRequestRepository.deleteByRoomId(id);
        participantRepository.deleteByRoomId(id);
        studyRoomRepository.deleteById(id);

        return true;
    }

    private String generarUrlJitsi() {
        return JITSI_BASE_URL + "studysync-" +
                UUID.randomUUID().toString().replace("-", "");
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

            Authentication auth =
                    SecurityContextHolder.getContext().getAuthentication();

            if (auth == null || !auth.isAuthenticated()
                    || !(auth.getPrincipal() instanceof User)) {
                throw new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Usuario no autenticado");
            }

            User user = (User) auth.getPrincipal();
            boolean esAdmin = "ADMINISTRADOR".equalsIgnoreCase(user.getRol())
        || "ADMIN".equalsIgnoreCase(user.getRol());
            boolean esProfesorDelCurso =
                    "PROFESOR".equalsIgnoreCase(user.getRol())
                    && course.getTeacherId() != null
                    && course.getTeacherId().equals(user.getId());

            if (!esAdmin && !esProfesorDelCurso) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Solo el profesor responsable o un administrador puede gestionar salas de este curso");
            }
        } else {
            room.setCourseId(null);
        }
    }
}

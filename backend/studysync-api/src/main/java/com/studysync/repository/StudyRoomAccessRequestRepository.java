
package com.studysync.repository;

import com.studysync.model.StudyRoomAccessRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudyRoomAccessRequestRepository
        extends JpaRepository<StudyRoomAccessRequest, Long> {

    // Buscar una solicitud de un usuario para una sala
    Optional<StudyRoomAccessRequest> findByRoomIdAndUserId(
            Long roomId,
            Long userId
    );

    // Consultar solicitudes pendientes de una sala
    List<StudyRoomAccessRequest> findByRoomIdAndEstado(
            Long roomId,
            String estado
    );

    // Consultar todas las solicitudes de un estudiante
    List<StudyRoomAccessRequest> findByUserId(Long userId);

    // Consultar todas las solicitudes de una sala
    List<StudyRoomAccessRequest> findByRoomId(Long roomId);

    // Eliminar solicitudes asociadas a una sala
    void deleteByRoomId(Long roomId);
}

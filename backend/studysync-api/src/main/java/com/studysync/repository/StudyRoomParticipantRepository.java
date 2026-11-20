
package com.studysync.repository;

import com.studysync.model.StudyRoomParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudyRoomParticipantRepository
        extends JpaRepository<StudyRoomParticipant, Long> {

    // Verificar si un usuario está autorizado en una sala
    boolean existsByRoomIdAndUserId(
            Long roomId,
            Long userId
    );

    // Buscar un participante específico
    Optional<StudyRoomParticipant> findByRoomIdAndUserId(
            Long roomId,
            Long userId
    );

    // Consultar los participantes de una sala
    List<StudyRoomParticipant> findByRoomId(Long roomId);

    // Consultar las salas en las que participa un usuario
    List<StudyRoomParticipant> findByUserId(Long userId);

    // Eliminar un participante de una sala
    void deleteByRoomIdAndUserId(
            Long roomId,
            Long userId
    );

    // Eliminar los participantes de una sala
    void deleteByRoomId(Long roomId);
}

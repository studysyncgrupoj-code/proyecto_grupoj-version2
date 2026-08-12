package com.studysync.service;

import com.studysync.model.StudyRoom;
import com.studysync.repository.StudyRoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudyRoomService {

    private final StudyRoomRepository studyRoomRepository;

    public StudyRoomService(StudyRoomRepository studyRoomRepository) {
        this.studyRoomRepository = studyRoomRepository;
    }

    public List<StudyRoom> getAllRooms() {
        return studyRoomRepository.findAll();
    }

    public Optional<StudyRoom> getRoomById(Long id) {
        return studyRoomRepository.findById(id);
    }

    public StudyRoom saveRoom(StudyRoom room) {
        return studyRoomRepository.save(room);
    }

    public StudyRoom updateRoom(Long id, StudyRoom roomData) {
        return studyRoomRepository.findById(id)
                .map(room -> {
                    room.setNombre(roomData.getNombre());
                    room.setDescripcion(roomData.getDescripcion());
                    room.setPrivada(roomData.getPrivada());
                    room.setCreadorId(roomData.getCreadorId());
                    return studyRoomRepository.save(room);
                })
                .orElse(null);
    }

    public boolean deleteRoom(Long id) {
        if (studyRoomRepository.existsById(id)) {
            studyRoomRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
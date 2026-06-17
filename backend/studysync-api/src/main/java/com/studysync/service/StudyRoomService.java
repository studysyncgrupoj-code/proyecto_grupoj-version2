package com.studysync.service;

import com.studysync.model.StudyRoom;
import com.studysync.repository.StudyRoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudyRoomService {

    private final StudyRoomRepository studyRoomRepository;

    public StudyRoomService(StudyRoomRepository studyRoomRepository) {
        this.studyRoomRepository = studyRoomRepository;
    }

    public List<StudyRoom> getAllRooms() {
        return studyRoomRepository.findAll();
    }

    public StudyRoom saveRoom(StudyRoom room) {
        return studyRoomRepository.save(room);
    }
}
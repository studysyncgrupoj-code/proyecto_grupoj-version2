package com.studysync.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.studysync.model.user.UserProfile;

import java.util.UUID;

public interface UserProfileRepository extends JpaRepository<UserProfile, UUID> {
}
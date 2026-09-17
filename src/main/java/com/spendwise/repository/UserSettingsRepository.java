package com.spendwise.repository;

import com.spendwise.entity.User;
import com.spendwise.entity.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {
    Optional<UserSettings> findByUser(User user);
    Optional<UserSettings> findByUserId(Long userId);
}

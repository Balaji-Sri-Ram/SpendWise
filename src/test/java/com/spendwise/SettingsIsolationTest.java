package com.spendwise;

import com.spendwise.entity.CurrencyPreference;
import com.spendwise.entity.DateFormatPreference;
import com.spendwise.entity.ThemePreference;
import com.spendwise.entity.User;
import com.spendwise.entity.UserSettings;
import com.spendwise.repository.UserRepository;
import com.spendwise.repository.UserSettingsRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Testcontainers
public class SettingsIsolationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
        registry.add("JWT_SECRET", () -> "1234567890123456789012345678901234567890123456789012345678901234");
        registry.add("JWT_ACCESS_EXPIRATION", () -> "3600000");
        registry.add("JWT_REFRESH_EXPIRATION", () -> "86400000");
    }

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSettingsRepository userSettingsRepository;

    private User user1;
    private User user2;

    @BeforeEach
    void setUp() {
        user1 = userRepository.save(User.builder()
                .name("User One")
                .email("one@example.com")
                .password("pass")
                .build());

        user2 = userRepository.save(User.builder()
                .name("User Two")
                .email("two@example.com")
                .password("pass")
                .build());
    }

    @AfterEach
    void tearDown() {
        userSettingsRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void settingsAreIsolatedPerUser() {
        // Create settings for User 1
        UserSettings settings1 = UserSettings.builder()
                .user(user1)
                .currency(CurrencyPreference.USD)
                .dateFormat(DateFormatPreference.MM_DD_YYYY)
                .theme(ThemePreference.LIGHT)
                .build();
        userSettingsRepository.save(settings1);

        // Create settings for User 2
        UserSettings settings2 = UserSettings.builder()
                .user(user2)
                .currency(CurrencyPreference.EUR)
                .dateFormat(DateFormatPreference.DD_MM_YYYY)
                .theme(ThemePreference.SYSTEM)
                .build();
        userSettingsRepository.save(settings2);

        // Fetch and verify isolation
        Optional<UserSettings> fetched1 = userSettingsRepository.findByUser(user1);
        assertTrue(fetched1.isPresent());
        assertEquals(CurrencyPreference.USD, fetched1.get().getCurrency());

        Optional<UserSettings> fetched2 = userSettingsRepository.findByUser(user2);
        assertTrue(fetched2.isPresent());
        assertEquals(CurrencyPreference.EUR, fetched2.get().getCurrency());
    }
}

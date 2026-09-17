package com.spendwise;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import java.util.List;
import java.util.Map;

@SpringBootTest
@Testcontainers
public class DbVerifyTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("JWT_SECRET", () -> "my-very-secret-test-key-which-is-long-enough-for-hmac-sha256");
        registry.add("JWT_ACCESS_EXPIRATION", () -> "3600000");
        registry.add("JWT_REFRESH_EXPIRATION", () -> "86400000");
    }
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    public void verifyDb() {
        System.out.println("=== DB VERIFICATION START ===");
        
        List<Map<String, Object>> users = jdbcTemplate.queryForList("SELECT id, email, password FROM users ORDER BY id DESC LIMIT 1");
        for (Map<String, Object> user : users) {
            System.out.println("User ID: " + user.get("id"));
            System.out.println("Email: " + user.get("email"));
            String hash = (String) user.get("password");
            System.out.println("Password Hash: " + hash.substring(0, 10) + "...");
            if (hash.startsWith("$2a$")) {
                System.out.println("BCrypt Password Verification: PASS");
            } else {
                System.out.println("BCrypt Password Verification: FAIL");
            }
        }
        
        List<Map<String, Object>> tokens = jdbcTemplate.queryForList("SELECT id, revoked FROM refresh_tokens ORDER BY id DESC LIMIT 1");
        for (Map<String, Object> token : tokens) {
            System.out.println("Token ID: " + token.get("id"));
            System.out.println("Revoked: " + token.get("revoked"));
        }
        
        System.out.println("=== DB VERIFICATION END ===");
    }
}

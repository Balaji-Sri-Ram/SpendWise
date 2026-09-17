package com.spendwise.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DatabaseMigrationConfig {

    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void migrateSchema() {
        log.info("Running custom schema migrations for SpendWise...");
        dropStaleEnumCheckConstraints();
    }

    private void dropStaleEnumCheckConstraints() {
        try {
            // Find all CHECK constraints on the user_settings table
            String query = "SELECT conname " +
                           "FROM pg_constraint " +
                           "JOIN pg_class ON conrelid = pg_class.oid " +
                           "JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace " +
                           "WHERE pg_class.relname = 'user_settings' AND contype = 'c'";
            
            List<String> constraintNames = jdbcTemplate.queryForList(query, String.class);
            
            for (String constraintName : constraintNames) {
                // Drop the constraint if it is related to our enums
                if (constraintName.contains("theme") || 
                    constraintName.contains("currency") || 
                    constraintName.contains("date_format")) {
                    log.info("Dropping stale check constraint: {}", constraintName);
                    jdbcTemplate.execute("ALTER TABLE user_settings DROP CONSTRAINT " + constraintName);
                }
            }
            log.info("Schema migrations completed successfully.");
        } catch (Exception e) {
            log.warn("Failed to execute schema migration (this is normal if not using PostgreSQL or table doesn't exist yet): {}", e.getMessage());
        }
    }
}

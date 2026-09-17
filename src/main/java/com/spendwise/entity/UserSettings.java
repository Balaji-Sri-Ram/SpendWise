package com.spendwise.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private CurrencyPreference currency = CurrencyPreference.INR;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DateFormatPreference dateFormat = DateFormatPreference.DD_MMM_YYYY;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ThemePreference theme = ThemePreference.LIGHT;

    @Column(nullable = false)
    @Builder.Default
    private boolean emailNotifications = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean budgetAlerts = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean subscriptionReminders = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean weeklySummary = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean monthlySummary = true;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

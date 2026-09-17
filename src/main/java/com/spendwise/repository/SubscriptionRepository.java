package com.spendwise.repository;

import com.spendwise.entity.Subscription;
import com.spendwise.entity.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    List<Subscription> findByUserIdOrderByNextBillingDateAsc(Long userId);

    Optional<Subscription> findByIdAndUserId(Long id, Long userId);

    List<Subscription> findByUserIdAndStatus(Long userId, SubscriptionStatus status);
}

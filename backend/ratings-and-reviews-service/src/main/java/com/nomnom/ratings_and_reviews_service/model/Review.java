package com.nomnom.ratings_and_reviews_service.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long customerId;

    @Column(nullable = false)
    private Long targetId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TargetType targetType;

    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String review;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum TargetType {
        MENU_ITEM, ORDER, RESTAURANT, DELIVERY_PERSON
    }
}

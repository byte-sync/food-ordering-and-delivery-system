package com.nomnom.ratings_and_reviews_service.repository;

import com.nomnom.ratings_and_reviews_service.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTargetIdAndTargetType(Long targetId, Review.TargetType targetType);
    Optional<Review> findByTargetId(Long id);
}
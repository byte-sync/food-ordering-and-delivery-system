package com.nomnom.ratings_and_reviews_service.service;

import com.nomnom.ratings_and_reviews_service.dto.ReviewDTO;
import com.nomnom.ratings_and_reviews_service.model.Review;

import java.util.List;
import java.util.Optional;

public interface IReviewService {
    Review addReview(ReviewDTO reviewDTO); // Create
    List<Review> getReviewsByTarget(Long targetId, Review.TargetType targetType); // Read (by target)
    Optional<Review> getReviewById(Long id); // Read (by ID)
    Review updateReview(Long id, ReviewDTO reviewDTO); // Update
    void deleteReview(Long id); // Delete
}
package com.nomnom.ratings_and_reviews_service.controller;

import com.nomnom.ratings_and_reviews_service.dto.ReviewDTO;
import com.nomnom.ratings_and_reviews_service.model.Review;
import com.nomnom.ratings_and_reviews_service.service.IReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private IReviewService reviewService;

    // Create a new review
    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody ReviewDTO reviewDTO) {
        return ResponseEntity.ok(reviewService.addReview(reviewDTO));
    }

    // Get reviews by target (menu item, order, restaurant, delivery person)
    @GetMapping("/target/{targetId}/{targetType}")
    public ResponseEntity<List<Review>> getReviewsByTarget(
            @PathVariable Long targetId,
            @PathVariable Review.TargetType targetType) {
        return ResponseEntity.ok(reviewService.getReviewsByTarget(targetId, targetType));
    }

    // Get a single review by ID
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable Long id) {
        return reviewService.getReviewById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update a review
    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable Long id, @RequestBody ReviewDTO reviewDTO) {
        return ResponseEntity.ok(reviewService.updateReview(id, reviewDTO));
    }

    // Delete a review
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
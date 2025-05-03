package com.nomnom.ratings_and_reviews_service.service;

import com.nomnom.ratings_and_reviews_service.dto.ReviewDTO;
import com.nomnom.ratings_and_reviews_service.model.Review;
import com.nomnom.ratings_and_reviews_service.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService implements IReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public Review addReview(ReviewDTO reviewDTO) {
        Review review = new Review();
        review.setCustomerId(reviewDTO.getCustomerId());
        review.setTargetId(reviewDTO.getTargetId());
        review.setRating(reviewDTO.getRating());
        review.setReview(reviewDTO.getReview());
        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getReviewsByCustomerId(String customerId) {
        return reviewRepository.findAllByCustomerId(customerId);
    }


    @Override
    public Optional<Review> getReviewById(String id) {
        return reviewRepository.findById(id);
    }

    @Override
    public Review updateReview(String id, ReviewDTO reviewDTO) {
        Optional<Review> optionalReview = reviewRepository.findById(id);
        if (optionalReview.isPresent()) {
            Review review = optionalReview.get();
            review.setCustomerId(reviewDTO.getCustomerId());
            review.setTargetId(reviewDTO.getTargetId());
            review.setRating(reviewDTO.getRating());
            review.setReview(reviewDTO.getReview());
            return reviewRepository.save(review);
        } else {
            throw new RuntimeException("Review not found with ID: " + id);
        }
    }

    @Override
    public void deleteReview(String id) {
        reviewRepository.deleteById(id);
    }
}
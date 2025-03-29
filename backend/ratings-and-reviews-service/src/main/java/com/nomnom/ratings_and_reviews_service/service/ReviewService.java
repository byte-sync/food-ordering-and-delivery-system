package com.nomnom.ratings_and_reviews_service.service;

import com.nomnom.ratings_and_reviews_service.dto.ReviewDTO;
import com.nomnom.ratings_and_reviews_service.model.Review;
import com.nomnom.ratings_and_reviews_service.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService implements IReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public Review addReview(ReviewDTO reviewDTO) {
        Review review = new Review();
        review.setCustomerId(reviewDTO.getCustomerId());
        review.setTargetId(reviewDTO.getTargetId());
        review.setTargetType(reviewDTO.getTargetType());
        review.setRating(reviewDTO.getRating());
        review.setReview(reviewDTO.getReview());
        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getReviewsByTarget(Long targetId, Review.TargetType targetType) {
        return reviewRepository.findByTargetIdAndTargetType(targetId, targetType);
    }
}
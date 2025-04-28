package com.nomnom.ratings_and_reviews_service.dto;

import com.nomnom.ratings_and_reviews_service.model.Review;
import lombok.Data;

@Data
public class ReviewDTO {
    private Long customerId;
    private Long targetId;
    private Review.TargetType targetType;
    private Integer rating;
    private String review;
}
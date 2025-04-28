package com.nomnom.user_service.repository;

import com.nomnom.user_service.model.RestaurantType;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RestaurantTypeRepository extends MongoRepository<RestaurantType, String> {
}

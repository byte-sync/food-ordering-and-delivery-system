package com.nomnom.user_service.repository;

import com.nomnom.user_service.model.CuisineType;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CuisineTypeRepository extends MongoRepository<CuisineType, String> {
}

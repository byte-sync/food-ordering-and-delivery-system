package com.nomnom.user_service.repository;

import com.nomnom.user_service.model.VehicleType;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface VehicleTypeRepository extends MongoRepository<VehicleType, String> {
}

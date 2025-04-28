package com.nomnom.user_service.repository;


import com.nomnom.user_service.model.User;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);


    List<User> findByUserType(String userType);
}

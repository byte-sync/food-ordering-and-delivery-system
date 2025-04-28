package com.nomnom.user_service.service;

import com.nomnom.user_service.model.RestaurantType;
import com.nomnom.user_service.repository.RestaurantTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class RestaurantTypeService {
    private final RestaurantTypeRepository restaurantTypeRepository;

    public RestaurantType createRestaurantType(RestaurantType type) {
        return restaurantTypeRepository.save(type);
    }

    public List<RestaurantType> getAllRestaurantTypes() {
        return restaurantTypeRepository.findAll();
    }

    public Optional<RestaurantType> getRestaurantTypeById(String id) {
        return restaurantTypeRepository.findById(id);
    }

    public RestaurantType updateRestaurantType(String id, RestaurantType updatedType) {
        if (restaurantTypeRepository.existsById(id)) {
            updatedType.setId(id);
            return restaurantTypeRepository.save(updatedType);
        }
        throw new IllegalArgumentException("RestaurantType not found");
    }

    public boolean deleteRestaurantType(String id) {
        if (restaurantTypeRepository.existsById(id)) {
            restaurantTypeRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

package com.nomnom.user_service.service;

import com.nomnom.user_service.model.CuisineType;
import com.nomnom.user_service.repository.CuisineTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CuisineTypeService {
    private final CuisineTypeRepository cuisineTypeRepository;

    public CuisineType createCuisineType(CuisineType type) {
        return cuisineTypeRepository.save(type);
    }

    public List<CuisineType> getAllCuisineTypes() {
        return cuisineTypeRepository.findAll();
    }

    public Optional<CuisineType> getCuisineTypeById(String id) {
        return cuisineTypeRepository.findById(id);
    }

    public CuisineType updateCuisineType(CuisineType updatedType) {
        if (!cuisineTypeRepository.existsById(updatedType.getId())) {
            throw new IllegalArgumentException("Cuisine Type not found");
        }
        return cuisineTypeRepository.save(updatedType);
    }

    public boolean deleteCuisineType(String id) {
        if (cuisineTypeRepository.existsById(id)) {
            cuisineTypeRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

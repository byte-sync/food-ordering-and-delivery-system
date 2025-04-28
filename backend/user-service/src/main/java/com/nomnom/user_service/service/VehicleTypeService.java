package com.nomnom.user_service.service;

import com.nomnom.user_service.model.VehicleType;
import com.nomnom.user_service.repository.VehicleTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VehicleTypeService {
    private final VehicleTypeRepository vehicleTypeRepository;

    public VehicleType createVehicleType(VehicleType type) {
        return vehicleTypeRepository.save(type);
    }

    public List<VehicleType> getAllVehicleTypes() {
        return vehicleTypeRepository.findAll();
    }

    public Optional<VehicleType> getVehicleTypeById(String id) {
        return vehicleTypeRepository.findById(id);
    }

    public VehicleType updateVehicleType(String id, VehicleType updatedType) {
        if (vehicleTypeRepository.existsById(id)) {
            updatedType.setId(id);
            return vehicleTypeRepository.save(updatedType);
        }
        throw new IllegalArgumentException("VehicleType not found");
    }

    public boolean deleteVehicleType(String id) {
        if (vehicleTypeRepository.existsById(id)) {
            vehicleTypeRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
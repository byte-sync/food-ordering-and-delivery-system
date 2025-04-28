package com.nomnom.user_service.controller;

import com.nomnom.user_service.model.CuisineType;
import com.nomnom.user_service.service.CuisineTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cuisine-types")
@RequiredArgsConstructor
public class CuisineTypeController {

    private final CuisineTypeService cuisineTypeService;

    @PostMapping
    public ResponseEntity<CuisineType> createCuisineType(@RequestBody CuisineType type) {
        return ResponseEntity.status(201).body(cuisineTypeService.createCuisineType(type));
    }

    @GetMapping
    public ResponseEntity<List<CuisineType>> getAllCuisineTypes() {
        return ResponseEntity.ok(cuisineTypeService.getAllCuisineTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CuisineType> getCuisineTypeById(@PathVariable String id) {
        return cuisineTypeService.getCuisineTypeById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CuisineType> updateCuisineType(
            @PathVariable String id,
            @RequestBody CuisineType updatedType) {
        updatedType.setId(id);
        return ResponseEntity.ok(cuisineTypeService.updateCuisineType(updatedType));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCuisineType(@PathVariable String id) {
        boolean deleted = cuisineTypeService.deleteCuisineType(id);
        if (deleted) {
            return ResponseEntity.ok("Deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Cuisine Type not found");
        }
    }
}

package com.nomnom.user_service.controller;

import com.nomnom.user_service.enums.UserType;
import com.nomnom.user_service.model.Driver;
import com.nomnom.user_service.model.Restaurant;
import com.nomnom.user_service.model.User;
import com.nomnom.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.status(201).body(userService.saveUser(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/type/{userType}")
    public ResponseEntity<List<User>> getUsersByType(@PathVariable UserType userType) {
        return ResponseEntity.ok(userService.getUsersByType(userType.name()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {
        return userService.deleteUser(id) ?
                ResponseEntity.ok("User deleted successfully") :
                ResponseEntity.status(404).body("User not found");
    }

    @PutMapping("/driver/{id}/status")
    public ResponseEntity<User> updateDriverStatus(@PathVariable String id, @RequestParam String status) {
        return ResponseEntity.ok(userService.updateDriverStatus(id, status));
    }

    @PutMapping("/restaurant/{id}/status")
    public ResponseEntity<User> updateRestaurantStatus(@PathVariable String id, @RequestParam String status) {
        return ResponseEntity.ok(userService.updateRestaurantStatus(id, status));
    }
    @PutMapping("/{id}/restaurant-type")
    public ResponseEntity<Restaurant> updateRestaurantType(
            @PathVariable String id,
            @RequestParam String restaurantTypeId) {
        Restaurant updated = userService.updateRestaurantType(id, restaurantTypeId);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/vehicle-type")
    public ResponseEntity<Driver> updateVehicleType(
            @PathVariable String id,
            @RequestParam String vehicleTypeId) {

        Driver updated = userService.updateVehicleType(id, vehicleTypeId);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/driver/{id}/active")
    public ResponseEntity<User> updateDriverActiveStatus(@PathVariable String id, @RequestParam boolean isActive) {
        return ResponseEntity.ok(userService.updateDriverActiveStatus(id, isActive));
    }

    @PutMapping("/restaurant/{id}/active")
    public ResponseEntity<User> updateRestaurantActiveStatus(@PathVariable String id, @RequestParam boolean isActive) {
        return ResponseEntity.ok(userService.updateRestaurantActiveStatus(id, isActive));
    }

    @PutMapping("/{id}/profile-picture")
    public ResponseEntity<User> updateProfilePicture(@PathVariable String id, @RequestParam String profilePictureUrl) {
        return ResponseEntity.ok(userService.updateProfilePicture(id, profilePictureUrl));
    }

    @GetMapping("/restaurants")
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        List<Restaurant> restaurants = userService.getAllRestaurants();
        return ResponseEntity.ok(restaurants);
    }  // Added this closing brace
    
    /**
     * Check if a user with the given email exists
     * @param email The email to check
     * @return ResponseEntity with exists:true if email exists, exists:false otherwise
     */
    @GetMapping("/email/{email}/exists")
    public ResponseEntity<Object> checkEmailExists(@PathVariable String email) {
        boolean exists = userService.getUserByEmail(email).isPresent();
        return ResponseEntity.ok(java.util.Map.of("exists", exists));
    }

}

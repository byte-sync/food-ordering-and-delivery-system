package com.nomnom.user_service.service;

import com.nomnom.user_service.enums.DriverStatus;
import com.nomnom.user_service.enums.RestaurantStatus;
import com.nomnom.user_service.enums.UserType;
import com.nomnom.user_service.model.*;
import com.nomnom.user_service.repository.CuisineTypeRepository;
import com.nomnom.user_service.repository.RestaurantTypeRepository;
import com.nomnom.user_service.repository.UserRepository;
import com.nomnom.user_service.repository.VehicleTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final RestaurantTypeRepository restaurantTypeRepository;
    private final VehicleTypeRepository vehicleTypeRepository;
    private final CuisineTypeRepository cuisineTypeRepository;

    public User saveUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        if (user instanceof Admin) {
            user.setUserType(UserType.ADMIN.name());

        } else if (user instanceof Customer) {
            user.setUserType(UserType.CUSTOMER.name());

        } else if (user instanceof Driver driver) {
            user.setUserType(UserType.DRIVER.name());
            if (!vehicleTypeRepository.existsById(driver.getVehicleTypeId())) {
                throw new IllegalArgumentException("Invalid Vehicle Type ID");
            }

        } else if (user instanceof Restaurant restaurant) {
            user.setUserType(UserType.RESTAURANT.name());
            if (!restaurantTypeRepository.existsById(restaurant.getRestaurantTypeId())) {
                throw new IllegalArgumentException("Invalid Restaurant Type ID");
            }
            for (String cuisineTypeId : restaurant.getCuisineTypeIds()) {
                if (!cuisineTypeRepository.existsById(cuisineTypeId)) {
                    throw new IllegalArgumentException("Invalid Cuisine Type ID: " + cuisineTypeId);
                }
            }

        } else {
            throw new IllegalArgumentException("Invalid user type");
        }

        return userRepository.save(user);
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByType(String type) {
        return userRepository.findAll().stream()
                .filter(user -> user.getUserType().equalsIgnoreCase(type))
                .collect(Collectors.toList());
    }

    public User updateUser(String id, User updatedUser) {
        if (userRepository.existsById(id)) {
            updatedUser.setId(id);
            return userRepository.save(updatedUser);
        }
        throw new IllegalArgumentException("User not found");
    }

    public boolean deleteUser(String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public User updateDriverStatus(String id, String status) {
        Optional<User> optional = userRepository.findById(id);
        if (optional.isPresent() && optional.get() instanceof Driver driver) {
            try {
                driver.setDriverStatus(DriverStatus.valueOf(status));
                return userRepository.save(driver);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid driver status: " + status);
            }
        }
        throw new IllegalArgumentException("Driver not found or invalid ID");
    }

    public User updateRestaurantStatus(String id, String status) {
        Optional<User> optional = userRepository.findById(id);
        if (optional.isPresent() && optional.get() instanceof Restaurant restaurant) {
            try {
                restaurant.setRestaurantStatus(RestaurantStatus.valueOf(status));
                return userRepository.save(restaurant);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid restaurant status: " + status);
            }
        }
        throw new IllegalArgumentException("Restaurant not found or invalid ID");
    }

    public Restaurant updateRestaurantType(String userId, String restaurantTypeId) {
        Optional<User> optional = userRepository.findById(userId);
        if (optional.isPresent() && optional.get() instanceof Restaurant restaurant) {
            if (!restaurantTypeRepository.existsById(restaurantTypeId)) {
                throw new IllegalArgumentException("Invalid Restaurant Type ID");
            }
            restaurant.setRestaurantTypeId(restaurantTypeId);
            return userRepository.save(restaurant);
        }
        throw new IllegalArgumentException("Restaurant not found or invalid ID");
    }

    public Driver updateVehicleType(String userId, String vehicleTypeId) {
        Optional<User> optional = userRepository.findById(userId);
        if (optional.isPresent() && optional.get() instanceof Driver driver) {
            if (!vehicleTypeRepository.existsById(vehicleTypeId)) {
                throw new IllegalArgumentException("Invalid Vehicle Type ID");
            }
            driver.setVehicleTypeId(vehicleTypeId);
            return userRepository.save(driver);
        }
        throw new IllegalArgumentException("Driver not found or invalid ID");
    }

    public User updateDriverActiveStatus(String id, boolean isActive) {
        Optional<User> optional = userRepository.findById(id);
        if (optional.isPresent() && optional.get() instanceof Driver driver) {
            driver.setActive(isActive);
            return userRepository.save(driver);
        }
        throw new IllegalArgumentException("Driver not found or invalid ID");
    }

    public User updateRestaurantActiveStatus(String id, boolean isActive) {
        Optional<User> optional = userRepository.findById(id);
        if (optional.isPresent() && optional.get() instanceof Restaurant restaurant) {
            restaurant.setActive(isActive);
            return userRepository.save(restaurant);
        }
        throw new IllegalArgumentException("Restaurant not found or invalid ID");
    }

    public User updateProfilePicture(String id, String profilePictureUrl) {
        Optional<User> optional = userRepository.findById(id);
        if (optional.isPresent()) {
            User user = optional.get();
            user.setProfilePictureUrl(profilePictureUrl);
            return userRepository.save(user);
        }
        throw new IllegalArgumentException("User not found or invalid ID");
    }

    public List<Restaurant> getAllRestaurants() {
        List<User> users = getUsersByType(UserType.RESTAURANT.name());
        return users.stream()
                .filter(user -> user instanceof Restaurant)
                .map(user -> (Restaurant) user)
                .toList();
    }
}

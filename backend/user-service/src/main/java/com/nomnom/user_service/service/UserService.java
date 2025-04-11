package com.nomnom.user_service.service;

import com.nomnom.user_service.model.*;
import com.nomnom.user_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User saveUser(User user) {
        // Validate unique email and username
        if (userRepository.findByEmail(user.getEmail()).isPresent() ||
                userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Email or username already exists");
        }

        // Hash the password before saving
        user.setPassword(hashPassword(user.getPassword()));

        // Ensure userType is set correctly based on subclass
        if (user instanceof Admin) {
            user.setUserType("admin");
        } else if (user instanceof Customer) {
            user.setUserType("customer");
        } else if (user instanceof Driver) {
            user.setUserType("driver");
        } else if (user instanceof RestaurantOwner) {
            user.setUserType("restaurantOwner");
        } else {
            throw new IllegalArgumentException("Invalid user type");
        }

        return userRepository.save(user);
    }

    private String hashPassword(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt()); // Use BCrypt for hashing
    }


    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(String id, User updatedUser) {
        if (userRepository.existsById(id)) {
            updatedUser.setId(id);
            return userRepository.save(updatedUser);
        }
        return null;
    }

    public boolean deleteUser(String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }


}
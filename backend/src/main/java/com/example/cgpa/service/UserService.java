package com.example.cgpa.service;

import com.example.cgpa.entity.User;
import com.example.cgpa.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    // Get all users
    public List<User> getAllUsers() {
        return repository.findAll();
    }

    // Get user by ID
    public User getUserById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Register
    public User registerUser(User user) {

        if (repository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        return repository.save(user);
    }

    // Login
    public User loginUser(String email, String password) {

        User user = repository.findByEmail(email).orElse(null);

        if (user == null) {
            return null;
        }

        if (!user.getPassword().equals(password)) {
            return null;
        }

        return user;
    }

    // Update profile
    public User updateUser(User user) {
        return repository.save(user);
    }

    // Delete
    public void deleteUser(Long id) {
        repository.deleteById(id);
    }
}
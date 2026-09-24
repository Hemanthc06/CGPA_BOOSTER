package com.example.cgpa.controller;

import com.example.cgpa.entity.User;
import com.example.cgpa.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService service;


    @GetMapping
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }


    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {

        User user = service.getUserById(id);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user);
    }


    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {

        try {

            User savedUser = service.registerUser(user);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedUser);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody Map<String, String> loginData) {

        String email = loginData.get("email");
        String password = loginData.get("password");

        User user = service.loginUser(email, password);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid email or password"
                    ));
        }

        return ResponseEntity.ok(user);
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody User updatedUser) {

        User existingUser = service.getUserById(id);

        if (existingUser == null) {
            return ResponseEntity.notFound().build();
        }

        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setRollNumber(updatedUser.getRollNumber());
        existingUser.setBranch(updatedUser.getBranch());

        if (updatedUser.getTargetCgpa() != null) {
            existingUser.setTargetCgpa(updatedUser.getTargetCgpa());
        }

        User savedUser = service.updateUser(existingUser);

        return ResponseEntity.ok(savedUser);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {

        service.deleteUser(id);

        return ResponseEntity.ok(
                Map.of("message", "User deleted successfully")
        );
    }
}
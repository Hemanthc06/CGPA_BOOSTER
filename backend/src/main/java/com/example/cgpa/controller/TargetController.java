package com.example.cgpa.controller;

import com.example.cgpa.entity.Target;
import com.example.cgpa.service.TargetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/targets")
@CrossOrigin
public class TargetController {

    @Autowired
    private TargetService service;


    // Get target for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<Target> getTargetByUserId(
            @PathVariable Long userId) {

        Target target = service.getTargetByUserId(userId);

        if (target == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(target);
    }


    // Get target by ID
    @GetMapping("/{id}")
    public ResponseEntity<Target> getTargetById(
            @PathVariable Long id) {

        Target target = service.getTargetById(id);

        if (target == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(target);
    }


    // Create target
    @PostMapping
    public ResponseEntity<Target> saveTarget(
            @RequestBody Target target) {

        Target savedTarget = service.saveTarget(target);

        return ResponseEntity.ok(savedTarget);
    }


    // Update target
    @PutMapping("/{id}")
    public ResponseEntity<Target> updateTarget(
            @PathVariable Long id,
            @RequestBody Target target) {

        Target existingTarget = service.getTargetById(id);

        if (existingTarget == null) {
            return ResponseEntity.notFound().build();
        }

        existingTarget.setTargetCgpa(target.getTargetCgpa());
        existingTarget.setTotalSemesters(target.getTotalSemesters());

        Target updatedTarget = service.updateTarget(existingTarget);

        return ResponseEntity.ok(updatedTarget);
    }


    // Delete target
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTarget(
            @PathVariable Long id) {

        Target existingTarget = service.getTargetById(id);

        if (existingTarget == null) {
            return ResponseEntity.notFound().build();
        }

        service.deleteTarget(id);

        return ResponseEntity.ok(
                java.util.Map.of(
                        "message",
                        "Target deleted successfully"
                )
        );
    }
}
package com.example.cgpa.service;

import com.example.cgpa.entity.Target;
import com.example.cgpa.repository.TargetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TargetService {

    @Autowired
    private TargetRepository repository;


    // Get target by user ID
    public Target getTargetByUserId(Long userId) {
        return repository.findByUserId(userId).orElse(null);
    }


    // Get target by target ID
    public Target getTargetById(Long id) {
        return repository.findById(id).orElse(null);
    }


    // Save target
    public Target saveTarget(Target target) {
        return repository.save(target);
    }


    // Update target
    public Target updateTarget(Target target) {
        return repository.save(target);
    }


    // Delete target
    public void deleteTarget(Long id) {
        repository.deleteById(id);
    }
}
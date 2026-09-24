package com.example.cgpa.service;

import com.example.cgpa.entity.StudyPlan;
import com.example.cgpa.repository.StudyPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudyPlanService {

    @Autowired
    private StudyPlanRepository repository;

    public List<StudyPlan> getAllPlans(Long userId) {
        return repository.findByUserId(userId);
    }

    public StudyPlan getPlanById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public StudyPlan savePlan(StudyPlan plan) {
        return repository.save(plan);
    }

    public StudyPlan updatePlan(StudyPlan plan) {
        return repository.save(plan);
    }

    public void deletePlan(Long id) {
        repository.deleteById(id);
    }
}
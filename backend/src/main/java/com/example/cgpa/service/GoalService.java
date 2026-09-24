package com.example.cgpa.service;

import com.example.cgpa.entity.Goal;
import com.example.cgpa.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoalService {

    @Autowired
    private GoalRepository repository;

    public List<Goal> getAllGoals(Long userId) {
        return repository.findByUserId(userId);
    }

    public Goal getGoalById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Goal saveGoal(Goal goal) {
        return repository.save(goal);
    }

    public Goal updateGoal(Goal goal) {
        return repository.save(goal);
    }

    public void deleteGoal(Long id) {
        repository.deleteById(id);
    }
}
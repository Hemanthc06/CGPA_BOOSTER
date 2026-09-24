package com.example.cgpa.controller;

import com.example.cgpa.entity.Goal;
import com.example.cgpa.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin
public class GoalController {

    @Autowired
    private GoalService service;


    @GetMapping("/user/{userId}")
    public List<Goal> getAllGoals(
            @PathVariable Long userId) {

        return service.getAllGoals(userId);
    }


    @GetMapping("/{id}")
    public Goal getGoalById(@PathVariable Long id) {
        return service.getGoalById(id);
    }


    @PostMapping
    public Goal saveGoal(@RequestBody Goal goal) {
        return service.saveGoal(goal);
    }


    @PutMapping("/{id}")
    public Goal updateGoal(
            @PathVariable Long id,
            @RequestBody Goal goal) {

        Goal existing = service.getGoalById(id);

        if (existing == null) {
            return null;
        }

        existing.setTitle(goal.getTitle());
        existing.setDescription(goal.getDescription());
        existing.setDeadline(goal.getDeadline());
        existing.setPriority(goal.getPriority());

        return service.updateGoal(existing);
    }


    @DeleteMapping("/{id}")
    public void deleteGoal(@PathVariable Long id) {
        service.deleteGoal(id);
    }
}
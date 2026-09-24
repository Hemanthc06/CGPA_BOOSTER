package com.example.cgpa.controller;

import com.example.cgpa.entity.StudyPlan;
import com.example.cgpa.service.StudyPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study-plans")
@CrossOrigin
public class StudyPlanController {

    @Autowired
    private StudyPlanService service;


    @GetMapping("/user/{userId}")
    public List<StudyPlan> getPlans(
            @PathVariable Long userId) {

        return service.getAllPlans(userId);
    }


    @GetMapping("/{id}")
    public StudyPlan getPlan(@PathVariable Long id) {
        return service.getPlanById(id);
    }


    @PostMapping
    public StudyPlan savePlan(
            @RequestBody StudyPlan plan) {

        return service.savePlan(plan);
    }


    @PutMapping("/{id}")
    public StudyPlan updatePlan(
            @PathVariable Long id,
            @RequestBody StudyPlan plan) {

        StudyPlan existing = service.getPlanById(id);

        if (existing == null) {
            return null;
        }

        existing.setDay(plan.getDay());
        existing.setSubject(plan.getSubject());
        existing.setTimeSlot(plan.getTimeSlot());
        existing.setTopic(plan.getTopic());
        existing.setPriority(plan.getPriority());

        return service.updatePlan(existing);
    }


    @DeleteMapping("/{id}")
    public void deletePlan(@PathVariable Long id) {
        service.deletePlan(id);
    }
}
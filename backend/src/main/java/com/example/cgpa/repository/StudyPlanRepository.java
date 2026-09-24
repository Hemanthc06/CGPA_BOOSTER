package com.example.cgpa.repository;

import com.example.cgpa.entity.StudyPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudyPlanRepository extends JpaRepository<StudyPlan, Long> {

    List<StudyPlan> findByUserId(Long userId);
}
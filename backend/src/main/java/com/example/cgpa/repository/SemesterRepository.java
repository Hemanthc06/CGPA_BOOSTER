package com.example.cgpa.repository;

import com.example.cgpa.entity.Semester;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SemesterRepository extends JpaRepository<Semester, Long> {

    List<Semester> findByUserId(Long userId);
}
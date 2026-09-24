package com.example.cgpa.repository;

import com.example.cgpa.entity.Target;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TargetRepository extends JpaRepository<Target, Long> {

    Optional<Target> findByUserId(Long userId);
}
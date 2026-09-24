package com.example.cgpa.repository;

import com.example.cgpa.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByUserId(Long userId);

    Optional<Attendance> findByUserIdAndSubjectAndClassDateAndTimeSlot(
            Long userId,
            String subject,
            String classDate,
            String timeSlot
    );
}
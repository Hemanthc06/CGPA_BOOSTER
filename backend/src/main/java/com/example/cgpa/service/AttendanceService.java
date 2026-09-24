package com.example.cgpa.service;

import com.example.cgpa.entity.Attendance;
import com.example.cgpa.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository repository;

    public List<Attendance> getAllAttendance(Long userId) {
        return repository.findByUserId(userId);
    }

    public Attendance getAttendanceById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Attendance findBySlot(Long userId,
                                 String subject,
                                 String classDate,
                                 String timeSlot) {

        return repository
                .findByUserIdAndSubjectAndClassDateAndTimeSlot(
                        userId, subject, classDate, timeSlot)
                .orElse(null);
    }

    public Attendance saveAttendance(Attendance attendance) {
        return repository.save(attendance);
    }

    public Attendance updateAttendance(Attendance attendance) {
        return repository.save(attendance);
    }

    public void deleteAttendance(Long id) {
        repository.deleteById(id);
    }
}
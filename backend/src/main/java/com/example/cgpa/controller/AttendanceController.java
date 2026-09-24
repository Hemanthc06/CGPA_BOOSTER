package com.example.cgpa.controller;

import com.example.cgpa.entity.Attendance;
import com.example.cgpa.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin
public class AttendanceController {

    @Autowired
    private AttendanceService service;


    @GetMapping("/user/{userId}")
    public List<Attendance> getAttendance(
            @PathVariable Long userId) {

        return service.getAllAttendance(userId);
    }


    @GetMapping("/{id}")
    public Attendance getAttendanceById(
            @PathVariable Long id) {

        return service.getAttendanceById(id);
    }


    @GetMapping("/slot")
    public ResponseEntity<Attendance> getSlot(
            @RequestParam Long userId,
            @RequestParam String subject,
            @RequestParam String classDate,
            @RequestParam String timeSlot) {

        Attendance record = service.findBySlot(
                userId, subject, classDate, timeSlot
        );

        if (record == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(record);
    }


    @PostMapping
    public Attendance saveAttendance(
            @RequestBody Attendance attendance) {

        return service.saveAttendance(attendance);
    }


    @PutMapping("/{id}")
    public Attendance updateAttendance(
            @PathVariable Long id,
            @RequestBody Attendance attendance) {

        Attendance existing = service.getAttendanceById(id);

        if (existing == null) {
            return null;
        }

        existing.setSubject(attendance.getSubject());
        existing.setClassesPresent(attendance.getClassesPresent());
        existing.setTotalClasses(attendance.getTotalClasses());
        existing.setClassDate(attendance.getClassDate());
        existing.setTimeSlot(attendance.getTimeSlot());
        existing.setStatus(attendance.getStatus());

        return service.updateAttendance(existing);
    }


    @DeleteMapping("/{id}")
    public void deleteAttendance(@PathVariable Long id) {
        service.deleteAttendance(id);
    }
}
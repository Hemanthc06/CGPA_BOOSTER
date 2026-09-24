package com.example.cgpa.controller;

import com.example.cgpa.entity.Semester;
import com.example.cgpa.service.SemesterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/semesters")
@CrossOrigin
public class SemesterController {

    @Autowired
    private SemesterService service;


    @GetMapping("/user/{userId}")
    public List<Semester> getSemesters(@PathVariable Long userId) {
        return service.getAllSemesters(userId);
    }


    @GetMapping("/{id}")
    public Semester getSemester(@PathVariable Long id) {
        return service.getSemesterById(id);
    }


    @PostMapping
    public Semester saveSemester(@RequestBody Semester semester) {
        return service.saveSemester(semester);
    }


    @PutMapping("/{id}")
    public Semester updateSemester(
            @PathVariable Long id,
            @RequestBody Semester semester) {

        Semester existing = service.getSemesterById(id);

        if (existing == null) {
            return null;
        }

        existing.setSemesterNumber(semester.getSemesterNumber());
        existing.setSgpa(semester.getSgpa());
        existing.setCredits(semester.getCredits());

        return service.updateSemester(existing);
    }


    @DeleteMapping("/{id}")
    public void deleteSemester(@PathVariable Long id) {
        service.deleteSemester(id);
    }
}
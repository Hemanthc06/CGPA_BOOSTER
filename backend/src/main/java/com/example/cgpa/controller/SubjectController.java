package com.example.cgpa.controller;

import com.example.cgpa.entity.Subject;
import com.example.cgpa.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin
public class SubjectController {

    @Autowired
    private SubjectService service;


    @GetMapping("/user/{userId}")
    public List<Subject> getSubjects(@PathVariable Long userId) {
        return service.getAllSubjects(userId);
    }


    @GetMapping("/{id}")
    public Subject getSubject(@PathVariable Long id) {
        return service.getSubjectById(id);
    }


    @PostMapping
    public Subject saveSubject(@RequestBody Subject subject) {
        return service.saveSubject(subject);
    }


    @PutMapping("/{id}")
    public Subject updateSubject(
            @PathVariable Long id,
            @RequestBody Subject subject) {

        Subject existing = service.getSubjectById(id);

        if (existing == null) {
            return null;
        }

        existing.setSemester(subject.getSemester());
        existing.setName(subject.getName());
        existing.setCode(subject.getCode());
        existing.setGrade(subject.getGrade());
        existing.setGradePoint(subject.getGradePoint());
        existing.setCredits(subject.getCredits());
        existing.setCategory(subject.getCategory());

        return service.updateSubject(existing);
    }


    @DeleteMapping("/{id}")
    public void deleteSubject(@PathVariable Long id) {
        service.deleteSubject(id);
    }
}
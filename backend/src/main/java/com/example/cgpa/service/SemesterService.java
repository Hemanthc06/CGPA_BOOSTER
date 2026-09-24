package com.example.cgpa.service;

import com.example.cgpa.entity.Semester;
import com.example.cgpa.repository.SemesterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SemesterService {

    @Autowired
    private SemesterRepository repository;

    public List<Semester> getAllSemesters(Long userId) {
        return repository.findByUserId(userId);
    }

    public Semester getSemesterById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Semester saveSemester(Semester semester) {
        return repository.save(semester);
    }

    public Semester updateSemester(Semester semester) {
        return repository.save(semester);
    }

    public void deleteSemester(Long id) {
        repository.deleteById(id);
    }
}
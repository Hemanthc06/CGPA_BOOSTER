package com.example.cgpa.service;

import com.example.cgpa.entity.Subject;
import com.example.cgpa.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository repository;

    public List<Subject> getAllSubjects(Long userId) {
        return repository.findByUserId(userId);
    }

    public Subject getSubjectById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Subject saveSubject(Subject subject) {
        return repository.save(subject);
    }

    public Subject updateSubject(Subject subject) {
        return repository.save(subject);
    }

    public void deleteSubject(Long id) {
        repository.deleteById(id);
    }
}
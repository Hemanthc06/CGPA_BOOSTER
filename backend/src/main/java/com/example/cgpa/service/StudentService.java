package com.example.cgpa.service;

import com.example.cgpa.entity.Student;
import com.example.cgpa.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    public Student getStudentById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Student saveStudent(Student student) {
        return repository.save(student);
    }

    public void deleteStudent(Long id) {
        repository.deleteById(id);
    }
}
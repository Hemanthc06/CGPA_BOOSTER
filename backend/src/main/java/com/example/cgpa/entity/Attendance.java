package com.example.cgpa.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String subject;

    private Integer classesPresent;

    private Integer totalClasses;

    private String classDate;

    private String timeSlot;      // NEW: e.g. "08:00-08:55"

    private String status;        // pending / present / absent / manual
}
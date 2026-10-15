package com.mahesh.sms.student;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @Email
    @NotBlank
    @Column(unique = true)
    private String email;

    @NotBlank
    private String course;

    private String status = "Active";

    public Student() {}

    public Student(String name, String email, String course, String status) {
        this.name = name;
        this.email = email;
        this.course = course;
        this.status = status == null || status.isBlank() ? "Active" : status;
    }

    @PrePersist
    @PreUpdate
    public void normalize() {
        if (status == null || status.isBlank()) status = "Active";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

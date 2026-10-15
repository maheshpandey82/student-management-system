package com.mahesh.sms.dashboard;

import com.mahesh.sms.student.StudentRepository;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final StudentRepository students;

    public DashboardController(StudentRepository students) {
        this.students = students;
    }

    @GetMapping("/stats")
    public Map<String, Long> stats() {
        return Map.of(
            "totalStudents", students.count(),
            "activeStudents", students.countByStatusIgnoreCase("Active"),
            "totalCourses", students.countDistinctCourses()
        );
    }
}

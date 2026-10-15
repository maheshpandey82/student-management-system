package com.mahesh.sms.course;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    @GetMapping
    public List<Map<String, String>> courses() {
        return List.of(
            Map.of("code", "BCA", "name", "Bachelor of Computer Applications", "duration", "3 years"),
            Map.of("code", "B.Tech", "name", "Bachelor of Technology", "duration", "4 years"),
            Map.of("code", "B.Sc", "name", "Bachelor of Science", "duration", "3 years"),
            Map.of("code", "MCA", "name", "Master of Computer Applications", "duration", "2 years"),
            Map.of("code", "MBA", "name", "Master of Business Administration", "duration", "2 years")
        );
    }
}

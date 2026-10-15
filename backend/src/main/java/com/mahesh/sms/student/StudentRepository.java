package com.mahesh.sms.student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByNameContainingIgnoreCaseOrCourseContainingIgnoreCase(String name, String course);
    long countByStatusIgnoreCase(String status);
    @Query("select count(distinct s.course) from Student s")
    long countDistinctCourses();
}

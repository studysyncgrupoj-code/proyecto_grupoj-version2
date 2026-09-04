package com.studysync.controller;

import com.studysync.model.Course;
import com.studysync.repository.CourseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    private final CourseRepository courseRepository;

    public CourseController(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        course.setId(null);
        return courseRepository.save(course);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(
            @PathVariable Long id,
            @RequestBody Course courseDetails) {

        return courseRepository.findById(id)
                .map(course -> {
                    course.setName(courseDetails.getName());
                    course.setCategory(courseDetails.getCategory());
                    course.setProfessor(courseDetails.getProfessor());
                    course.setDuration(courseDetails.getDuration());
                    course.setCapacity(courseDetails.getCapacity());
                    course.setProgress(courseDetails.getProgress());
                    course.setStatus(courseDetails.getStatus());
                    course.setDescription(courseDetails.getDescription());

                    return ResponseEntity.ok(courseRepository.save(course));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        if (!courseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        courseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

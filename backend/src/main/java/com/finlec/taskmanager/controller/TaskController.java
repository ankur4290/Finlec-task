package com.finlec.taskmanager.controller;

import com.finlec.taskmanager.model.Task;
import com.finlec.taskmanager.model.TaskStatus;
import com.finlec.taskmanager.model.User;
import com.finlec.taskmanager.repository.TaskRepository;
import com.finlec.taskmanager.repository.UserRepository;
import com.finlec.taskmanager.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    TaskRepository taskRepository;

    @Autowired
    UserRepository userRepository;

    // This function gets all tasks for the current user
    @GetMapping
    public List<Task> getAllTasks() {
        System.out.println("DEBUG: Request received to get all tasks");

        // Get the current user from the security context
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserDetailsImpl userDetails = (UserDetailsImpl) principal;

        Long userId = userDetails.getId();
        System.out.println("DEBUG: User ID is " + userId);

        // Return the list of tasks
        List<Task> taskList = taskRepository.findByUserId(userId);
        return taskList;
    }

    // This function creates a new task
    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task taskRequest) {
        System.out.println("DEBUG: Request received to create a task: " + taskRequest.getTitle());

        // Get the current user
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserDetailsImpl userDetails = (UserDetailsImpl) principal;

        Long userId = userDetails.getId();

        // Find the user in the database
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            System.out.println("ERROR: User not found");
            return new ResponseEntity<>("User not found", org.springframework.http.HttpStatus.BAD_REQUEST);
        }

        // Set the user to the task
        taskRequest.setUser(user);

        // Save the task
        taskRepository.save(taskRequest);
        System.out.println("DEBUG: Task saved successfully");

        return new ResponseEntity<>(taskRequest, org.springframework.http.HttpStatus.OK);
    }

    // This function updates an existing task
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        System.out.println("DEBUG: Request received to update task with ID " + id);

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserDetailsImpl userDetails = (UserDetailsImpl) principal;

        // Find the task by ID
        Task task = taskRepository.findById(id).orElse(null);

        if (task == null) {
            System.out.println("ERROR: Task not found");
            return new ResponseEntity<>(org.springframework.http.HttpStatus.NOT_FOUND);
        }

        // Check if the user owns the task
        if (!task.getUser().getId().equals(userDetails.getId())) {
            System.out.println("ERROR: User not authorized to update this task");
            return new ResponseEntity<>("Unauthorized", org.springframework.http.HttpStatus.BAD_REQUEST);
        }

        // Update the task details
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());

        taskRepository.save(task);
        System.out.println("DEBUG: Task updated successfully");

        return new ResponseEntity<>(task, org.springframework.http.HttpStatus.OK);
    }

    // This function deletes a task
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        System.out.println("DEBUG: Request received to delete task with ID " + id);

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserDetailsImpl userDetails = (UserDetailsImpl) principal;

        Task task = taskRepository.findById(id).orElse(null);

        if (task == null) {
            System.out.println("ERROR: Task not found");
            return new ResponseEntity<>(org.springframework.http.HttpStatus.NOT_FOUND);
        }

        if (!task.getUser().getId().equals(userDetails.getId())) {
            System.out.println("ERROR: User not authorized to delete this task");
            return new ResponseEntity<>("Unauthorized", org.springframework.http.HttpStatus.BAD_REQUEST);
        }

        taskRepository.delete(task);
        System.out.println("DEBUG: Task deleted successfully");

        return new ResponseEntity<>(org.springframework.http.HttpStatus.OK);
    }
}

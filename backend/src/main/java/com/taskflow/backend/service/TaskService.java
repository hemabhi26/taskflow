package com.taskflow.backend.service;

import com.taskflow.backend.dto.TaskRequest;
import com.taskflow.backend.dto.TaskResponse;
import com.taskflow.backend.entity.Task;
import com.taskflow.backend.entity.User;
import com.taskflow.backend.repository.TaskRepository;
import com.taskflow.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    // ── helper: get whoever is currently logged in ──────────────────────────
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ── helper: check if current user can modify a task ─────────────────────
    // Rules:  ADMIN → always yes
    //         Creator of the task → yes
    //         Person assigned to the task → yes
    //         Everyone else → RuntimeException (→ 400 via GlobalExceptionHandler)
    private void checkEditPermission(Task task, User currentUser) {
        boolean isAdmin    = currentUser.getRole() == User.Role.ADMIN;
        boolean isCreator  = task.getCreatedBy().getId().equals(currentUser.getId());
        boolean isAssignee = task.getAssignedTo() != null &&
                             task.getAssignedTo().getId().equals(currentUser.getId());

        if (!isAdmin && !isCreator && !isAssignee) {
            throw new RuntimeException("You do not have permission to modify this task");
        }
    }

    // ── CREATE ───────────────────────────────────────────────────────────────
    public TaskResponse createTask(TaskRequest request) {
        User currentUser = getCurrentUser();

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() != null ? request.getStatus() : Task.Status.TODO);
        task.setPriority(request.getPriority() != null ? request.getPriority() : Task.Priority.MEDIUM);
        task.setDueDate(request.getDueDate());
        task.setCreatedBy(currentUser);

        if (request.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
            task.setAssignedTo(assignedTo);
        } else {
            task.setAssignedTo(currentUser);
        }

        return TaskResponse.fromTask(taskRepository.save(task));
    }

    // ── READ ALL ─────────────────────────────────────────────────────────────
    // Admins see every task; regular users only see tasks assigned to them
    public List<TaskResponse> getAllTasks() {
        User currentUser = getCurrentUser();

        if (currentUser.getRole() == User.Role.ADMIN) {
            return taskRepository.findAll().stream()
                    .map(TaskResponse::fromTask)
                    .collect(Collectors.toList());
        }

        return taskRepository.findByAssignedTo(currentUser).stream()
                .map(TaskResponse::fromTask)
                .collect(Collectors.toList());
    }

    // ── READ ONE ─────────────────────────────────────────────────────────────
    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return TaskResponse.fromTask(task);
    }

    // ── UPDATE ───────────────────────────────────────────────────────────────
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // permission check — must be admin, creator, or assignee
        checkEditPermission(task, getCurrentUser());

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null)   task.setStatus(request.getStatus());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());

        if (request.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
            task.setAssignedTo(assignedTo);
        }

        return TaskResponse.fromTask(taskRepository.save(task));
    }

    // ── DELETE ───────────────────────────────────────────────────────────────
    // Same permission rules as update — only admin, creator, or assignee
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // permission check — must be admin, creator, or assignee
        checkEditPermission(task, getCurrentUser());

        taskRepository.deleteById(id);
    }

    // ── FILTER BY STATUS ─────────────────────────────────────────────────────
    public List<TaskResponse> getTasksByStatus(Task.Status status) {
        return taskRepository.findByStatus(status).stream()
                .map(TaskResponse::fromTask)
                .collect(Collectors.toList());
    }
}

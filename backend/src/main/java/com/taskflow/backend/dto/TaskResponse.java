package com.taskflow.backend.dto;

import com.taskflow.backend.entity.Task;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private Task.Status status;
    private Task.Priority priority;
    private LocalDate dueDate;
    private Long assignedToId;       // ← added
    private String assignedToName;
    private String assignedToEmail;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TaskResponse fromTask(Task task) {
        TaskResponse res = new TaskResponse();
        res.setId(task.getId());
        res.setTitle(task.getTitle());
        res.setDescription(task.getDescription());
        res.setStatus(task.getStatus());
        res.setPriority(task.getPriority());
        res.setDueDate(task.getDueDate());
        res.setCreatedAt(task.getCreatedAt());
        res.setUpdatedAt(task.getUpdatedAt());
        if (task.getAssignedTo() != null) {
            res.setAssignedToId(task.getAssignedTo().getId());   // ← added
            res.setAssignedToName(task.getAssignedTo().getName());
            res.setAssignedToEmail(task.getAssignedTo().getEmail());
        }
        if (task.getCreatedBy() != null) {
            res.setCreatedByName(task.getCreatedBy().getName());
        }
        return res;
    }
}

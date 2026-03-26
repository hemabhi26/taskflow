package com.taskflow.backend.repository;

import com.taskflow.backend.entity.Task;
import com.taskflow.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedTo(User user);
    List<Task> findByCreatedBy(User user);
    List<Task> findByStatus(Task.Status status);
    List<Task> findByAssignedToAndStatus(User user, Task.Status status);
}
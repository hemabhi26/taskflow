package com.taskflow.backend.config;

import com.taskflow.backend.entity.Task;
import com.taskflow.backend.entity.User;
import com.taskflow.backend.repository.TaskRepository;
import com.taskflow.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        if (userRepository.count() == 0) {

            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@taskflow.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);

            User user1 = new User();
            user1.setName("John Doe");
            user1.setEmail("john@taskflow.com");
            user1.setPassword(passwordEncoder.encode("john123"));
            user1.setRole(User.Role.USER);
            userRepository.save(user1);

            User user2 = new User();
            user2.setName("Jane Smith");
            user2.setEmail("jane@taskflow.com");
            user2.setPassword(passwordEncoder.encode("jane123"));
            user2.setRole(User.Role.USER);
            userRepository.save(user2);

            Task task1 = new Task();
            task1.setTitle("Setup project repository");
            task1.setDescription("Initialize Git repo and folder structure");
            task1.setStatus(Task.Status.DONE);
            task1.setPriority(Task.Priority.HIGH);
            task1.setCreatedBy(admin);
            task1.setAssignedTo(user1);
            taskRepository.save(task1);

            Task task2 = new Task();
            task2.setTitle("Design database schema");
            task2.setDescription("Create ERD and define all tables");
            task2.setStatus(Task.Status.IN_PROGRESS);
            task2.setPriority(Task.Priority.HIGH);
            task2.setCreatedBy(admin);
            task2.setAssignedTo(user1);
            taskRepository.save(task2);

            Task task3 = new Task();
            task3.setTitle("Build login page");
            task3.setDescription("Create React login form with validation");
            task3.setStatus(Task.Status.TODO);
            task3.setPriority(Task.Priority.MEDIUM);
            task3.setCreatedBy(admin);
            task3.setAssignedTo(user2);
            taskRepository.save(task3);

            Task task4 = new Task();
            task4.setTitle("Write API documentation");
            task4.setDescription("Document all REST endpoints");
            task4.setStatus(Task.Status.TODO);
            task4.setPriority(Task.Priority.LOW);
            task4.setCreatedBy(admin);
            task4.setAssignedTo(user2);
            taskRepository.save(task4);

            System.out.println("====================================");
            System.out.println("Seed data created successfully!");
            System.out.println("Admin:  admin@taskflow.com / admin123");
            System.out.println("User1:  john@taskflow.com  / john123");
            System.out.println("User2:  jane@taskflow.com  / jane123");
            System.out.println("====================================");
        } else {
            System.out.println("Database already has data — skipping seed.");
        }
    }
}

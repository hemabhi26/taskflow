package com.taskflow.backend.service;

import com.taskflow.backend.dto.UserResponse;
import com.taskflow.backend.entity.User;
import com.taskflow.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromUser)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserResponse.fromUser(user);
    }

    public UserResponse getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserResponse.fromUser(user);
    }

    public UserResponse updateUser(Long id, String name, String email) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // check if new email is already taken by someone else
        userRepository.findByEmail(email).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new RuntimeException("Email already in use");
            }
        });

        user.setName(name);
        user.setEmail(email);
        return UserResponse.fromUser(userRepository.save(user));
    }

    public void deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
}

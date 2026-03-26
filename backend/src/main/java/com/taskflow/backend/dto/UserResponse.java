package com.taskflow.backend.dto;

import com.taskflow.backend.entity.User;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private LocalDateTime createdAt;

    public static UserResponse fromUser(User user) {
        UserResponse res = new UserResponse();
        res.setId(user.getId());
        res.setName(user.getName());
        res.setEmail(user.getEmail());
        res.setRole(user.getRole().name());
        res.setCreatedAt(user.getCreatedAt());
        return res;
    }
}
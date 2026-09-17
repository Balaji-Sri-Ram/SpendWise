package com.spendwise.controller;

import com.spendwise.dto.response.UserResponse;
import com.spendwise.dto.request.UpdateProfileRequest;
import com.spendwise.security.CustomUserDetails;
import com.spendwise.entity.User;
import com.spendwise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UserResponse response = UserResponse.builder()
                .id(userDetails.getId())
                .name(userDetails.getUser().getName())
                .email(userDetails.getUsername())
                .createdAt(userDetails.getUser().getCreatedAt())
                .build();
                
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails, @Valid @RequestBody UpdateProfileRequest request) {
        User user = userDetails.getUser();
        
        // Check if email is being updated and already exists
        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already in use");
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        
        userRepository.save(user);

        UserResponse response = UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();
                
        return ResponseEntity.ok(response);
    }
}

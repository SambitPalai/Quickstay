package com.hotel.springbackend.controller;

import com.hotel.springbackend.model.User;
import com.hotel.springbackend.repository.UserRepository;
import com.hotel.springbackend.request.LoginRequest;
import com.hotel.springbackend.request.RegisterRequest;
import com.hotel.springbackend.response.AuthResponse;
import com.hotel.springbackend.security.JwtService;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered.");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.USER);
        userRepository.save(user);
        
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token, user.getEmail(), user.getRole().name(), user.getName()));
        
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token, user.getEmail(), user.getRole().name(), user.getName()));
    }
    
    @PostMapping("/create-admin")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> createAdmin(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered.");
        }
        User admin = new User();
        admin.setName(request.getName());
        admin.setEmail(request.getEmail());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setRole(User.Role.ADMIN);
        userRepository.save(admin);
        return ResponseEntity.ok("Admin account created for " + request.getEmail());
    }
    
    @DeleteMapping("/delete-admin/{userId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() == User.Role.OWNER) {
            return ResponseEntity.badRequest().body("Cannot delete the owner account.");
        }
        userRepository.deleteById(userId);
        return ResponseEntity.ok("Account deleted successfully.");
    }
    
    @GetMapping("/admins")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<User>> getAllAdmins() {
        List<User> admins = userRepository.findByRole(User.Role.ADMIN);
        return ResponseEntity.ok(admins);
    }
    
    @PutMapping("/promote/{userId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> promoteToAdmin(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() == User.Role.OWNER) {
            return ResponseEntity.badRequest().body("Cannot change owner role.");
        }
        user.setRole(User.Role.ADMIN);
        userRepository.save(user);
        return ResponseEntity.ok(user.getEmail() + " is now an ADMIN.");
    }
    
    @PutMapping("/demote/{userId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> demoteToUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == User.Role.OWNER) {
            return ResponseEntity.badRequest()
                    .body(response("error", "Cannot change owner role."));
        }
        user.setRole(User.Role.USER);
        userRepository.save(user);

        Map<String, Object> body = new HashMap<>();
        body.put("message",  "Admin demoted to USER successfully.");
        body.put("userId",   user.getUserId());
        body.put("email",    user.getEmail());
        body.put("name",     user.getName());
        body.put("newRole",  user.getRole().name());
        return ResponseEntity.ok(body);
    }

    private Map<String, Object> response(String key, String value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }
    
}
package com.hotel.springbackend.controller;

import com.hotel.springbackend.model.User;
import com.hotel.springbackend.repository.UserRepository;
import com.hotel.springbackend.request.LoginRequest;
import com.hotel.springbackend.request.RegisterRequest;
import com.hotel.springbackend.response.AuthResponse;
import com.hotel.springbackend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
        
        if ("quickstay-admin-secret".equals(request.getAdminSecret())) {
        	user.setRole(User.Role.ADMIN);
        } else {
        	user.setRole(User.Role.USER);
        }
        
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
    
    @GetMapping("/encode/{raw}")
    public String encode(@PathVariable String raw) {
        return passwordEncoder.encode(raw);
    }
    
}
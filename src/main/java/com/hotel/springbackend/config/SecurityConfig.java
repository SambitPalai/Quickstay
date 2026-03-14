package com.hotel.springbackend.config;

import com.hotel.springbackend.security.JwtAuthFilter;
import com.hotel.springbackend.service.CustomUserDetailsService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s ->
                s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            
            .exceptionHandling(ex -> ex
                    .authenticationEntryPoint((request, response, authException) -> {
                        // No token or invalid token → 401 Unauthorized
                        response.setContentType("application/json");
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.getWriter().write(
                            "{\"status\": 401, \"error\": \"Unauthorized\", " +
                            "\"message\": \"Authentication required. Please login.\"}"
                        );
                    })
                    .accessDeniedHandler((request, response, accessDeniedException) -> {
                        // Valid token but wrong role → 403 Forbidden
                        response.setContentType("application/json");
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.getWriter().write(
                            "{\"status\": 403, \"error\": \"Forbidden\", " +
                            "\"message\": \"You do not have permission to access this resource.\"}"
                        );
                    })
                )
            
            
            .authorizeHttpRequests(auth -> auth		
                .requestMatchers("/auth/**").permitAll()
                // ----- PUBLIC ------------ 
                .requestMatchers(HttpMethod.GET,
                    "/rooms/all-rooms",
                    "/rooms/room/types",
                    "/rooms/room/**",
                    "/bookings/confirmation/**").permitAll()
                // ---- ADMIN ONLY ----------
                .requestMatchers(HttpMethod.POST,   "/rooms/add/new-room").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/rooms/update/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/rooms/delete/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET,    "/bookings/all-bookings").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET,    "/bookings/user").hasRole("ADMIN")
                // ------- Authenticated users (USER or ADMIN) --------
                .requestMatchers(HttpMethod.GET, "/bookings/my-bookings").authenticated()
                .requestMatchers("/bookings/**").authenticated()

                .anyRequest().authenticated()
            )
            .userDetailsService(userDetailsService)          // ← THIS was missing
            .addFilterBefore(jwtAuthFilter,
                UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
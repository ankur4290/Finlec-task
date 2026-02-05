package com.finlec.taskmanager.controller;

import com.finlec.taskmanager.model.User;
import com.finlec.taskmanager.payload.request.LoginRequest;
import com.finlec.taskmanager.payload.request.SignupRequest;
import com.finlec.taskmanager.payload.response.JwtResponse;
import com.finlec.taskmanager.payload.response.MessageResponse;
import com.finlec.taskmanager.repository.UserRepository;
import com.finlec.taskmanager.security.JwtUtil;
import com.finlec.taskmanager.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtil jwtUtils;

    // This endpoint handles user login
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        System.out.println("DEBUG: Login request received for user: " + loginRequest.getUsername());

        try {
            // Check username and password
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            // If valid, set authentication in context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generate JWT token
            String jwt = jwtUtils.generateJwtToken(authentication);

            // Get user details
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            System.out.println("DEBUG: User " + userDetails.getUsername() + " logged in successfully");

            // Return response with token
            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername()));

        } catch (Exception e) {
            System.out.println("ERROR: Login failed: " + e.getMessage());
            return new ResponseEntity<>("Invalid credentials", org.springframework.http.HttpStatus.UNAUTHORIZED);
        }
    }

    // This endpoint handles user registration
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        System.out.println("DEBUG: Signup request received for user: " + signUpRequest.getUsername());

        // Check if username exists
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            System.out.println("ERROR: Username '" + signUpRequest.getUsername() + "' is already taken");
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                encoder.encode(signUpRequest.getPassword()));

        // Save user to database
        userRepository.save(user);

        System.out.println("DEBUG: User registered successfully");

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}

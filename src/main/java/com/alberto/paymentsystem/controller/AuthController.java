package com.alberto.paymentsystem.controller;

import com.alberto.paymentsystem.auth.DTO.RegisterUserRequest;
import com.alberto.paymentsystem.auth.DTO.UserResponse;
import com.alberto.paymentsystem.auth.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/public/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterUserRequest userRequest, UriComponentsBuilder uriComponentsBuilder){

        UserResponse response = userService.register(userRequest);

        URI location = uriComponentsBuilder
                .path("/api/users/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);

    }

}

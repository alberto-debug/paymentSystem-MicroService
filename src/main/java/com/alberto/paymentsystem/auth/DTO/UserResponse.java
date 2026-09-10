package com.alberto.paymentsystem.auth.DTO;

import com.alberto.paymentsystem.auth.model.UserStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String fullName,
        String email,
        String documentNumber,
        UserStatus status,
        LocalDateTime createdAt
) {
}

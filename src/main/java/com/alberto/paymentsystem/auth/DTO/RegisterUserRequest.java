package com.alberto.paymentsystem.auth.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record RegisterUserRequest(

        @NotBlank
        @Size(min = 3, max = 150)
        String fullName,

        @NotBlank
        @Email
        @Size(max = 150)
        String email,

        @NotBlank
        @Size(min = 6, max = 20)
        String documentNumber,

        @NotNull
        @Past
        LocalDate birthDate,

        @NotBlank
        @Size(min = 8, max = 100)
        String password

) {
}

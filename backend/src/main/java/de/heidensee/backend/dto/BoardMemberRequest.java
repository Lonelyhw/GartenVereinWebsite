package de.heidensee.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record BoardMemberRequest(
    @NotBlank String name,
    @NotBlank String role,
    @Email String email,
    String phone,
    String imageUrl
) {}
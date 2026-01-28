package de.heidensee.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record DocumentItemRequest(
    @NotBlank String title,
    @NotBlank String description,
    @NotBlank String fileUrl,
    @NotBlank String category
) {}
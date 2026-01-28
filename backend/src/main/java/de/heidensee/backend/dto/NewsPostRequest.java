package de.heidensee.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record NewsPostRequest(
    @NotBlank String title,
    @NotBlank String content,
    @NotNull Boolean published
) {}
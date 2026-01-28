package de.heidensee.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record NoticeRequest(
    @NotBlank String title,
    @NotBlank String content,
    @NotNull Boolean active
) {}
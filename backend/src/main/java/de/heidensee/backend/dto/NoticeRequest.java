package de.heidensee.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record NoticeRequest(
    @NotBlank String title,
    @NotBlank String content,
    @NotNull Boolean active,
    LocalDateTime expiresAt
) {}

package de.heidensee.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record ClubEventRequest(
    @NotBlank String title,
    @NotBlank String description,
    @NotNull LocalDateTime startDateTime,
    @NotNull LocalDateTime endDateTime,
    @NotBlank String location
) {}
package de.heidensee.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public record RentalItemRequest(
    @NotBlank String name,
    @NotNull @PositiveOrZero BigDecimal price,
    @NotNull @PositiveOrZero BigDecimal deposit,
    @NotBlank String description,
    @NotNull Boolean available
) {}
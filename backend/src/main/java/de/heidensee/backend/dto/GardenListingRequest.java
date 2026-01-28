package de.heidensee.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record GardenListingRequest(
    @NotBlank String title,
    @NotBlank String description,
    @NotBlank String status,
    @NotBlank String contactInfo
) {}
package de.heidensee.backend.dto;

public record UploadResponse(
    String url,
    String filename,
    String contentType,
    long size
) {}
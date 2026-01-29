package de.heidensee.backend.controller;

import de.heidensee.backend.dto.UploadResponse;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.time.Instant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {
  private static final SecureRandom RANDOM = new SecureRandom();

  private final Path uploadDir;

  public UploadController(@Value("${app.upload.dir:/data/uploads}") String uploadDir) {
    this.uploadDir = Paths.get(uploadDir);
  }

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<UploadResponse> upload(@RequestPart("file") MultipartFile file)
      throws IOException {
    if (file.isEmpty()) {
      return ResponseEntity.badRequest().build();
    }

    Files.createDirectories(uploadDir);

    String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
    String extension = "";
    int lastDot = originalName.lastIndexOf('.');
    if (lastDot > -1 && lastDot < originalName.length() - 1) {
      extension = originalName.substring(lastDot);
    }

    String filename = Instant.now().toEpochMilli() + "-" + randomToken(8) + extension;
    Path target = uploadDir.resolve(filename);
    Files.copy(file.getInputStream(), target);

    UploadResponse response = new UploadResponse(
        "/uploads/" + filename,
        filename,
        file.getContentType(),
        file.getSize()
    );

    return ResponseEntity.ok(response);
  }

  private String randomToken(int length) {
    final String alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
    StringBuilder builder = new StringBuilder(length);
    for (int i = 0; i < length; i++) {
      builder.append(alphabet.charAt(RANDOM.nextInt(alphabet.length())));
    }
    return builder.toString();
  }
}
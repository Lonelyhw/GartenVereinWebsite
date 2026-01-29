package de.heidensee.backend.config;

import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class UploadsResourceConfig implements WebMvcConfigurer {
  private final Path uploadDir;

  public UploadsResourceConfig(@Value("${app.upload.dir:/data/uploads}") String uploadDir) {
    this.uploadDir = Paths.get(uploadDir);
  }

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    String location = uploadDir.toUri().toString();
    registry
        .addResourceHandler("/uploads/**")
        .addResourceLocations(location)
        .setCacheControl(CacheControl.noCache());
  }
}
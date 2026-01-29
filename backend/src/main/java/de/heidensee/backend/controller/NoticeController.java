package de.heidensee.backend.controller;

import de.heidensee.backend.domain.Notice;
import de.heidensee.backend.dto.NoticeRequest;
import de.heidensee.backend.service.NoticeService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {
  private final NoticeService service;

  public NoticeController(NoticeService service) {
    this.service = service;
  }

  @GetMapping
  public List<Notice> list() {
    return service.findActive();
  }

  @GetMapping("/admin")
  public List<Notice> listAll() {
    return service.findAll();
  }

  @GetMapping("/{id}")
  public Notice getById(@PathVariable Long id) {
    return service.findById(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Notice create(@Valid @RequestBody NoticeRequest request) {
    return service.create(request);
  }

  @PutMapping("/{id}")
  public Notice update(@PathVariable Long id, @Valid @RequestBody NoticeRequest request) {
    return service.update(id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    service.delete(id);
  }
}

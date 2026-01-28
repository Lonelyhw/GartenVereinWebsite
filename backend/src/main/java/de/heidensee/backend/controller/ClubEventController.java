package de.heidensee.backend.controller;

import de.heidensee.backend.domain.ClubEvent;
import de.heidensee.backend.dto.ClubEventRequest;
import de.heidensee.backend.service.ClubEventService;
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
@RequestMapping("/api/events")
public class ClubEventController {
  private final ClubEventService service;

  public ClubEventController(ClubEventService service) {
    this.service = service;
  }

  @GetMapping
  public List<ClubEvent> list() {
    return service.findAll();
  }

  @GetMapping("/{id}")
  public ClubEvent getById(@PathVariable Long id) {
    return service.findById(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ClubEvent create(@Valid @RequestBody ClubEventRequest request) {
    return service.create(request);
  }

  @PutMapping("/{id}")
  public ClubEvent update(@PathVariable Long id, @Valid @RequestBody ClubEventRequest request) {
    return service.update(id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    service.delete(id);
  }
}
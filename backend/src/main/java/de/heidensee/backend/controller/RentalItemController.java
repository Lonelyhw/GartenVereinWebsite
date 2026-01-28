package de.heidensee.backend.controller;

import de.heidensee.backend.domain.RentalItem;
import de.heidensee.backend.dto.RentalItemRequest;
import de.heidensee.backend.service.RentalItemService;
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
@RequestMapping("/api/rental")
public class RentalItemController {
  private final RentalItemService service;

  public RentalItemController(RentalItemService service) {
    this.service = service;
  }

  @GetMapping
  public List<RentalItem> list() {
    return service.findAll();
  }

  @GetMapping("/{id}")
  public RentalItem getById(@PathVariable Long id) {
    return service.findById(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public RentalItem create(@Valid @RequestBody RentalItemRequest request) {
    return service.create(request);
  }

  @PutMapping("/{id}")
  public RentalItem update(@PathVariable Long id, @Valid @RequestBody RentalItemRequest request) {
    return service.update(id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    service.delete(id);
  }
}
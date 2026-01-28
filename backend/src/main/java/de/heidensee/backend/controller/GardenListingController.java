package de.heidensee.backend.controller;

import de.heidensee.backend.domain.GardenListing;
import de.heidensee.backend.dto.GardenListingRequest;
import de.heidensee.backend.service.GardenListingService;
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
@RequestMapping("/api/gardens")
public class GardenListingController {
  private final GardenListingService service;

  public GardenListingController(GardenListingService service) {
    this.service = service;
  }

  @GetMapping
  public List<GardenListing> list() {
    return service.findAll();
  }

  @GetMapping("/{id}")
  public GardenListing getById(@PathVariable Long id) {
    return service.findById(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public GardenListing create(@Valid @RequestBody GardenListingRequest request) {
    return service.create(request);
  }

  @PutMapping("/{id}")
  public GardenListing update(@PathVariable Long id, @Valid @RequestBody GardenListingRequest request) {
    return service.update(id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    service.delete(id);
  }
}
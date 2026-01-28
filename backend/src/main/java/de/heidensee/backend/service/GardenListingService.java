package de.heidensee.backend.service;

import de.heidensee.backend.domain.GardenListing;
import de.heidensee.backend.dto.GardenListingRequest;
import de.heidensee.backend.repo.GardenListingRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class GardenListingService {
  private final GardenListingRepository repository;

  public GardenListingService(GardenListingRepository repository) {
    this.repository = repository;
  }

  public List<GardenListing> findAll() {
    return repository.findAll();
  }

  public GardenListing findById(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "GardenListing not found"));
  }

  public GardenListing create(GardenListingRequest request) {
    GardenListing listing = new GardenListing();
    applyRequest(listing, request);
    return repository.save(listing);
  }

  public GardenListing update(Long id, GardenListingRequest request) {
    GardenListing listing = findById(id);
    applyRequest(listing, request);
    return repository.save(listing);
  }

  public void delete(Long id) {
    if (!repository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "GardenListing not found");
    }
    repository.deleteById(id);
  }

  private void applyRequest(GardenListing listing, GardenListingRequest request) {
    listing.setTitle(request.title());
    listing.setDescription(request.description());
    listing.setStatus(request.status());
    listing.setContactInfo(request.contactInfo());
  }
}
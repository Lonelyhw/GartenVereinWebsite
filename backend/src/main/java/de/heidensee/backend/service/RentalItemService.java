package de.heidensee.backend.service;

import de.heidensee.backend.domain.RentalItem;
import de.heidensee.backend.dto.RentalItemRequest;
import de.heidensee.backend.repo.RentalItemRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RentalItemService {
  private final RentalItemRepository repository;

  public RentalItemService(RentalItemRepository repository) {
    this.repository = repository;
  }

  public List<RentalItem> findAll() {
    return repository.findAll();
  }

  public RentalItem findById(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "RentalItem not found"));
  }

  public RentalItem create(RentalItemRequest request) {
    RentalItem item = new RentalItem();
    applyRequest(item, request);
    return repository.save(item);
  }

  public RentalItem update(Long id, RentalItemRequest request) {
    RentalItem item = findById(id);
    applyRequest(item, request);
    return repository.save(item);
  }

  public void delete(Long id) {
    if (!repository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "RentalItem not found");
    }
    repository.deleteById(id);
  }

  private void applyRequest(RentalItem item, RentalItemRequest request) {
    item.setName(request.name());
    item.setPrice(request.price());
    item.setDeposit(request.deposit());
    item.setDescription(request.description());
    item.setAvailable(Boolean.TRUE.equals(request.available()));
  }
}
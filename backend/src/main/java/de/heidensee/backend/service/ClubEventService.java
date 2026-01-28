package de.heidensee.backend.service;

import de.heidensee.backend.domain.ClubEvent;
import de.heidensee.backend.dto.ClubEventRequest;
import de.heidensee.backend.repo.ClubEventRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ClubEventService {
  private final ClubEventRepository repository;

  public ClubEventService(ClubEventRepository repository) {
    this.repository = repository;
  }

  public List<ClubEvent> findAll() {
    return repository.findAll();
  }

  public ClubEvent findById(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ClubEvent not found"));
  }

  public ClubEvent create(ClubEventRequest request) {
    ClubEvent event = new ClubEvent();
    applyRequest(event, request);
    return repository.save(event);
  }

  public ClubEvent update(Long id, ClubEventRequest request) {
    ClubEvent event = findById(id);
    applyRequest(event, request);
    return repository.save(event);
  }

  public void delete(Long id) {
    if (!repository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ClubEvent not found");
    }
    repository.deleteById(id);
  }

  private void applyRequest(ClubEvent event, ClubEventRequest request) {
    event.setTitle(request.title());
    event.setDescription(request.description());
    event.setStartDateTime(request.startDateTime());
    event.setEndDateTime(request.endDateTime());
    event.setLocation(request.location());
  }
}
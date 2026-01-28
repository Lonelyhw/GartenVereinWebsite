package de.heidensee.backend.service;

import de.heidensee.backend.domain.DocumentItem;
import de.heidensee.backend.dto.DocumentItemRequest;
import de.heidensee.backend.repo.DocumentItemRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DocumentItemService {
  private final DocumentItemRepository repository;

  public DocumentItemService(DocumentItemRepository repository) {
    this.repository = repository;
  }

  public List<DocumentItem> findAll() {
    return repository.findAll();
  }

  public DocumentItem findById(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "DocumentItem not found"));
  }

  public DocumentItem create(DocumentItemRequest request) {
    DocumentItem item = new DocumentItem();
    applyRequest(item, request);
    return repository.save(item);
  }

  public DocumentItem update(Long id, DocumentItemRequest request) {
    DocumentItem item = findById(id);
    applyRequest(item, request);
    return repository.save(item);
  }

  public void delete(Long id) {
    if (!repository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "DocumentItem not found");
    }
    repository.deleteById(id);
  }

  private void applyRequest(DocumentItem item, DocumentItemRequest request) {
    item.setTitle(request.title());
    item.setDescription(request.description());
    item.setFileUrl(request.fileUrl());
    item.setCategory(request.category());
  }
}
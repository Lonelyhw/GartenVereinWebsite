package de.heidensee.backend.service;

import de.heidensee.backend.domain.Notice;
import de.heidensee.backend.dto.NoticeRequest;
import de.heidensee.backend.repo.NoticeRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class NoticeService {
  private final NoticeRepository repository;

  public NoticeService(NoticeRepository repository) {
    this.repository = repository;
  }

  public List<Notice> findAll() {
    return repository.findAll();
  }

  public Notice findById(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notice not found"));
  }

  public Notice create(NoticeRequest request) {
    Notice notice = new Notice();
    applyRequest(notice, request);
    return repository.save(notice);
  }

  public Notice update(Long id, NoticeRequest request) {
    Notice notice = findById(id);
    applyRequest(notice, request);
    return repository.save(notice);
  }

  public void delete(Long id) {
    if (!repository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Notice not found");
    }
    repository.deleteById(id);
  }

  private void applyRequest(Notice notice, NoticeRequest request) {
    notice.setTitle(request.title());
    notice.setContent(request.content());
    notice.setActive(Boolean.TRUE.equals(request.active()));
  }
}
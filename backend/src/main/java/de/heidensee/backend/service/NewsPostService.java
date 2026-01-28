package de.heidensee.backend.service;

import de.heidensee.backend.domain.NewsPost;
import de.heidensee.backend.dto.NewsPostRequest;
import de.heidensee.backend.repo.NewsPostRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class NewsPostService {
  private final NewsPostRepository repository;

  public NewsPostService(NewsPostRepository repository) {
    this.repository = repository;
  }

  public List<NewsPost> findAll() {
    return repository.findAll();
  }

  public NewsPost findById(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "NewsPost not found"));
  }

  public NewsPost create(NewsPostRequest request) {
    NewsPost post = new NewsPost();
    applyRequest(post, request);
    return repository.save(post);
  }

  public NewsPost update(Long id, NewsPostRequest request) {
    NewsPost post = findById(id);
    applyRequest(post, request);
    return repository.save(post);
  }

  public void delete(Long id) {
    if (!repository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "NewsPost not found");
    }
    repository.deleteById(id);
  }

  private void applyRequest(NewsPost post, NewsPostRequest request) {
    post.setTitle(request.title());
    post.setContent(request.content());
    post.setPublished(Boolean.TRUE.equals(request.published()));
  }
}
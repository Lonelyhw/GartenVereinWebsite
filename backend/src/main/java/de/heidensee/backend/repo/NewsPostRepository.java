package de.heidensee.backend.repo;

import de.heidensee.backend.domain.NewsPost;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsPostRepository extends JpaRepository<NewsPost, Long> {}
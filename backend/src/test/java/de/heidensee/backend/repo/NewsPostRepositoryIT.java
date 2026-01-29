package de.heidensee.backend.repo;

import static org.assertj.core.api.Assertions.assertThat;

import de.heidensee.backend.AbstractIntegrationTest;
import de.heidensee.backend.domain.NewsPost;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class NewsPostRepositoryIT extends AbstractIntegrationTest {

  @Autowired
  private NewsPostRepository repository;

  @Test
  void findAllOrdersByCreatedAtDesc() {
    NewsPost older = buildPost("Alt", true);
    NewsPost newer = buildPost("Neu", true);
    older = repository.save(older);
    newer = repository.save(newer);

    older.setCreatedAt(LocalDateTime.now().minusDays(2));
    newer.setCreatedAt(LocalDateTime.now().minusDays(1));
    repository.saveAll(List.of(older, newer));

    List<NewsPost> result = repository.findAllByOrderByCreatedAtDesc();

    assertThat(result).isNotEmpty();
    assertThat(result.get(0).getTitle()).isEqualTo("Neu");
  }

  @Test
  void findPublishedOnly() {
    repository.save(buildPost("Published", true));
    repository.save(buildPost("Draft", false));

    List<NewsPost> result = repository.findByPublishedTrueOrderByCreatedAtDesc();

    assertThat(result).allMatch(NewsPost::isPublished);
  }

  private NewsPost buildPost(String title, boolean published) {
    NewsPost post = new NewsPost();
    post.setTitle(title);
    post.setContent("Test");
    post.setPublished(published);
    return post;
  }
}

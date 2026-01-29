package de.heidensee.backend.repo;

import static org.assertj.core.api.Assertions.assertThat;

import de.heidensee.backend.AbstractIntegrationTest;
import de.heidensee.backend.domain.Notice;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class NoticeRepositoryIT extends AbstractIntegrationTest {

  @Autowired
  private NoticeRepository repository;

  @Test
  void findActiveOnly() {
    repository.save(buildNotice("Aktiv", true));
    repository.save(buildNotice("Archiv", false));

    List<Notice> result = repository.findByActiveTrueOrderByCreatedAtDesc();

    assertThat(result).allMatch(Notice::isActive);
  }

  private Notice buildNotice(String title, boolean active) {
    Notice notice = new Notice();
    notice.setTitle(title);
    notice.setContent("Hinweis");
    notice.setActive(active);
    return notice;
  }
}

package de.heidensee.backend.repo;

import static org.assertj.core.api.Assertions.assertThat;

import de.heidensee.backend.AbstractIntegrationTest;
import de.heidensee.backend.domain.DocumentItem;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class DocumentItemRepositoryIT extends AbstractIntegrationTest {

  @Autowired
  private DocumentItemRepository repository;

  @Test
  void findByCategoryFilters() {
    repository.save(buildItem("Satzung", "Satzung"));
    repository.save(buildItem("Formular", "Formulare"));

    List<DocumentItem> result = repository.findByCategoryIgnoreCaseOrderByCreatedAtDesc("satzung");

    assertThat(result).hasSize(1);
    assertThat(result.get(0).getCategory()).isEqualTo("Satzung");
  }

  private DocumentItem buildItem(String title, String category) {
    DocumentItem item = new DocumentItem();
    item.setTitle(title);
    item.setDescription("Beschreibung");
    item.setFileUrl("/uploads/test.pdf");
    item.setCategory(category);
    return item;
  }
}

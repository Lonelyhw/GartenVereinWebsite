package de.heidensee.backend.repo;

import de.heidensee.backend.domain.Notice;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
  List<Notice> findByActiveTrueOrderByCreatedAtDesc();
}

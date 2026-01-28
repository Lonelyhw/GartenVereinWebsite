package de.heidensee.backend.repo;

import de.heidensee.backend.domain.DocumentItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentItemRepository extends JpaRepository<DocumentItem, Long> {}
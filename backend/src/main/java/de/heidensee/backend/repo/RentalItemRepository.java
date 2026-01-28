package de.heidensee.backend.repo;

import de.heidensee.backend.domain.RentalItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RentalItemRepository extends JpaRepository<RentalItem, Long> {}
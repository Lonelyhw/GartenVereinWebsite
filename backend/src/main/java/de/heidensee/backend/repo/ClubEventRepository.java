package de.heidensee.backend.repo;

import de.heidensee.backend.domain.ClubEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubEventRepository extends JpaRepository<ClubEvent, Long> {}
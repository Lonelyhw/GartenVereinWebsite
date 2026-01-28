package de.heidensee.backend.repo;

import de.heidensee.backend.domain.GardenListing;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GardenListingRepository extends JpaRepository<GardenListing, Long> {}
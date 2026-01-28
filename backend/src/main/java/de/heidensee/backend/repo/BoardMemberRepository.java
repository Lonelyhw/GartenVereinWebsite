package de.heidensee.backend.repo;

import de.heidensee.backend.domain.BoardMember;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardMemberRepository extends JpaRepository<BoardMember, Long> {}
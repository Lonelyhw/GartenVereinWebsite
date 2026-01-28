package de.heidensee.backend.service;

import de.heidensee.backend.domain.BoardMember;
import de.heidensee.backend.dto.BoardMemberRequest;
import de.heidensee.backend.repo.BoardMemberRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BoardMemberService {
  private final BoardMemberRepository repository;

  public BoardMemberService(BoardMemberRepository repository) {
    this.repository = repository;
  }

  public List<BoardMember> findAll() {
    return repository.findAll();
  }

  public BoardMember findById(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "BoardMember not found"));
  }

  public BoardMember create(BoardMemberRequest request) {
    BoardMember member = new BoardMember();
    applyRequest(member, request);
    return repository.save(member);
  }

  public BoardMember update(Long id, BoardMemberRequest request) {
    BoardMember member = findById(id);
    applyRequest(member, request);
    return repository.save(member);
  }

  public void delete(Long id) {
    if (!repository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "BoardMember not found");
    }
    repository.deleteById(id);
  }

  private void applyRequest(BoardMember member, BoardMemberRequest request) {
    member.setName(request.name());
    member.setRole(request.role());
    member.setEmail(request.email());
    member.setPhone(request.phone());
    member.setImageUrl(request.imageUrl());
  }
}
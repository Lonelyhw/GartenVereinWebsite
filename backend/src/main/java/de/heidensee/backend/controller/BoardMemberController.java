package de.heidensee.backend.controller;

import de.heidensee.backend.domain.BoardMember;
import de.heidensee.backend.dto.BoardMemberRequest;
import de.heidensee.backend.service.BoardMemberService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/board")
public class BoardMemberController {
  private final BoardMemberService service;

  public BoardMemberController(BoardMemberService service) {
    this.service = service;
  }

  @GetMapping
  public List<BoardMember> list() {
    return service.findAll();
  }

  @GetMapping("/{id}")
  public BoardMember getById(@PathVariable Long id) {
    return service.findById(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public BoardMember create(@Valid @RequestBody BoardMemberRequest request) {
    return service.create(request);
  }

  @PutMapping("/{id}")
  public BoardMember update(@PathVariable Long id, @Valid @RequestBody BoardMemberRequest request) {
    return service.update(id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    service.delete(id);
  }
}
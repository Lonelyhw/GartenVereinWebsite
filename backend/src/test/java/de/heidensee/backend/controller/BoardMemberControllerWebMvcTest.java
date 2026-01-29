package de.heidensee.backend.controller;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.isEmptyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.heidensee.backend.domain.BoardMember;
import de.heidensee.backend.service.BoardMemberService;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

@WebMvcTest(BoardMemberController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class BoardMemberControllerWebMvcTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  private BoardMemberService service;

  @Test
  void listReturns200() throws Exception {
    BoardMember member = new BoardMember();
    member.setId(1L);
    member.setName("Max");
    member.setRole("Vorsitz");
    when(service.findAll()).thenReturn(List.of(member));

    mockMvc.perform(get("/api/board"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray());
  }

  @Test
  void getByIdReturns200() throws Exception {
    BoardMember member = new BoardMember();
    member.setId(1L);
    member.setName("Max");
    member.setRole("Vorsitz");
    when(service.findById(1L)).thenReturn(member);

    mockMvc.perform(get("/api/board/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1));
  }

  @Test
  void getByIdReturns404() throws Exception {
    when(service.findById(1L))
        .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found"));

    mockMvc.perform(get("/api/board/1"))
        .andExpect(status().isNotFound());
  }

  @Test
  void postMissingNameReturns400() throws Exception {
    Map<String, Object> payload = Map.of(
        "role", "Vorsitz"
    );

    mockMvc.perform(post("/api/board")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(payload)))
        .andExpect(status().isBadRequest())
        .andExpect(content().string(not(isEmptyString())));
  }
}

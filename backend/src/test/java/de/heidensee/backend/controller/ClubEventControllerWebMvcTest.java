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
import de.heidensee.backend.domain.ClubEvent;
import de.heidensee.backend.service.ClubEventService;
import java.time.LocalDateTime;
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

@WebMvcTest(ClubEventController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class ClubEventControllerWebMvcTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  private ClubEventService service;

  @Test
  void listReturns200() throws Exception {
    ClubEvent event = new ClubEvent();
    event.setId(1L);
    event.setTitle("Termin");
    event.setDescription("Desc");
    event.setStartDateTime(LocalDateTime.now());
    event.setEndDateTime(LocalDateTime.now().plusHours(2));
    event.setLocation("Vereinshaus");
    when(service.findAll()).thenReturn(List.of(event));

    mockMvc.perform(get("/api/events"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray());
  }

  @Test
  void getByIdReturns200() throws Exception {
    ClubEvent event = new ClubEvent();
    event.setId(1L);
    event.setTitle("Termin");
    event.setDescription("Desc");
    event.setStartDateTime(LocalDateTime.now());
    event.setEndDateTime(LocalDateTime.now().plusHours(2));
    event.setLocation("Vereinshaus");
    when(service.findById(1L)).thenReturn(event);

    mockMvc.perform(get("/api/events/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1));
  }

  @Test
  void getByIdReturns404() throws Exception {
    when(service.findById(1L))
        .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found"));

    mockMvc.perform(get("/api/events/1"))
        .andExpect(status().isNotFound());
  }

  @Test
  void postMissingTitleReturns400() throws Exception {
    Map<String, Object> payload = Map.of(
        "description", "Desc",
        "startDateTime", LocalDateTime.now().toString(),
        "endDateTime", LocalDateTime.now().plusHours(2).toString(),
        "location", "Vereinshaus"
    );

    mockMvc.perform(post("/api/events")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(payload)))
        .andExpect(status().isBadRequest())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.message").exists())
        .andExpect(jsonPath("$.errors[0].field").value("title"))
        .andExpect(jsonPath("$.errors[0].message").exists());
  }
}

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
import de.heidensee.backend.domain.Notice;
import de.heidensee.backend.service.NoticeService;
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

@WebMvcTest(NoticeController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class NoticeControllerWebMvcTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  private NoticeService service;

  @Test
  void listReturns200() throws Exception {
    Notice notice = new Notice();
    notice.setId(1L);
    notice.setTitle("Hinweis");
    notice.setContent("Inhalt");
    notice.setActive(true);
    when(service.findActive()).thenReturn(List.of(notice));

    mockMvc.perform(get("/api/notices"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray());
  }

  @Test
  void getByIdReturns200() throws Exception {
    Notice notice = new Notice();
    notice.setId(1L);
    notice.setTitle("Hinweis");
    notice.setContent("Inhalt");
    notice.setActive(true);
    when(service.findById(1L)).thenReturn(notice);

    mockMvc.perform(get("/api/notices/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1));
  }

  @Test
  void getByIdReturns404() throws Exception {
    when(service.findById(1L))
        .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found"));

    mockMvc.perform(get("/api/notices/1"))
        .andExpect(status().isNotFound());
  }

  @Test
  void postMissingTitleReturns400() throws Exception {
    Map<String, Object> payload = Map.of(
        "content", "Inhalt",
        "active", true
    );

    mockMvc.perform(post("/api/notices")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(payload)))
        .andExpect(status().isBadRequest())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.message").exists())
        .andExpect(jsonPath("$.errors[0].field").value("title"))
        .andExpect(jsonPath("$.errors[0].message").exists());
  }
}

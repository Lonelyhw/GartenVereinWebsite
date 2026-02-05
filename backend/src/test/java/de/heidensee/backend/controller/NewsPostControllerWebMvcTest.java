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
import de.heidensee.backend.domain.NewsPost;
import de.heidensee.backend.service.NewsPostService;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@WebMvcTest(NewsPostController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class NewsPostControllerWebMvcTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  private NewsPostService service;

  @Test
  void listReturns200() throws Exception {
    NewsPost post = new NewsPost();
    post.setId(1L);
    post.setTitle("Test");
    post.setContent("Inhalt");
    post.setPublished(true);
    when(service.findAll()).thenReturn(List.of(post));

    mockMvc.perform(get("/api/news"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray());
  }

  @Test
  void getByIdReturns200() throws Exception {
    NewsPost post = new NewsPost();
    post.setId(1L);
    post.setTitle("Test");
    post.setContent("Inhalt");
    post.setPublished(true);
    when(service.findById(1L)).thenReturn(post);

    mockMvc.perform(get("/api/news/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1));
  }

  @Test
  void getByIdReturns404() throws Exception {
    when(service.findById(1L))
        .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found"));

    mockMvc.perform(get("/api/news/1"))
        .andExpect(status().isNotFound());
  }

  @Test
  void postMissingTitleReturns400() throws Exception {
    Map<String, Object> payload = Map.of(
        "content", "Inhalt",
        "published", true
    );

    mockMvc.perform(post("/api/news")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(payload)))
        .andExpect(status().isBadRequest())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.message").exists())
        .andExpect(jsonPath("$.errors[0].field").value("title"))
        .andExpect(jsonPath("$.errors[0].message").exists());
  }
}

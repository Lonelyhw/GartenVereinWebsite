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
import de.heidensee.backend.domain.DocumentItem;
import de.heidensee.backend.service.DocumentItemService;
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

@WebMvcTest(DocumentItemController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class DocumentItemControllerWebMvcTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  private DocumentItemService service;

  @Test
  void listReturns200() throws Exception {
    DocumentItem item = new DocumentItem();
    item.setId(1L);
    item.setTitle("Satzung");
    item.setDescription("Desc");
    item.setFileUrl("/uploads/test.pdf");
    item.setCategory("Satzung");
    when(service.findAll()).thenReturn(List.of(item));

    mockMvc.perform(get("/api/documents"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray());
  }

  @Test
  void getByIdReturns200() throws Exception {
    DocumentItem item = new DocumentItem();
    item.setId(1L);
    item.setTitle("Satzung");
    item.setDescription("Desc");
    item.setFileUrl("/uploads/test.pdf");
    item.setCategory("Satzung");
    when(service.findById(1L)).thenReturn(item);

    mockMvc.perform(get("/api/documents/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1));
  }

  @Test
  void getByIdReturns404() throws Exception {
    when(service.findById(1L))
        .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found"));

    mockMvc.perform(get("/api/documents/1"))
        .andExpect(status().isNotFound());
  }

  @Test
  void postMissingTitleReturns400() throws Exception {
    Map<String, Object> payload = Map.of(
        "description", "Desc",
        "fileUrl", "/uploads/test.pdf",
        "category", "Satzung"
    );

    mockMvc.perform(post("/api/documents")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(payload)))
        .andExpect(status().isBadRequest())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.message").exists())
        .andExpect(jsonPath("$.errors[0].field").value("title"))
        .andExpect(jsonPath("$.errors[0].message").exists());
  }
}

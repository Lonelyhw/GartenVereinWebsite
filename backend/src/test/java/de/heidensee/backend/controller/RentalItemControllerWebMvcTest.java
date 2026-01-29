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
import de.heidensee.backend.domain.RentalItem;
import de.heidensee.backend.service.RentalItemService;
import java.math.BigDecimal;
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

@WebMvcTest(RentalItemController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class RentalItemControllerWebMvcTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  private RentalItemService service;

  @Test
  void listReturns200() throws Exception {
    RentalItem item = new RentalItem();
    item.setId(1L);
    item.setName("Anhaenger");
    item.setDescription("Desc");
    item.setPrice(BigDecimal.valueOf(10));
    item.setDeposit(BigDecimal.valueOf(20));
    item.setAvailable(true);
    when(service.findAll()).thenReturn(List.of(item));

    mockMvc.perform(get("/api/rental"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray());
  }

  @Test
  void getByIdReturns200() throws Exception {
    RentalItem item = new RentalItem();
    item.setId(1L);
    item.setName("Anhaenger");
    item.setDescription("Desc");
    item.setPrice(BigDecimal.valueOf(10));
    item.setDeposit(BigDecimal.valueOf(20));
    item.setAvailable(true);
    when(service.findById(1L)).thenReturn(item);

    mockMvc.perform(get("/api/rental/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1));
  }

  @Test
  void getByIdReturns404() throws Exception {
    when(service.findById(1L))
        .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found"));

    mockMvc.perform(get("/api/rental/1"))
        .andExpect(status().isNotFound());
  }

  @Test
  void postMissingNameReturns400() throws Exception {
    Map<String, Object> payload = Map.of(
        "price", 10,
        "deposit", 20,
        "description", "Desc",
        "available", true
    );

    mockMvc.perform(post("/api/rental")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(payload)))
        .andExpect(status().isBadRequest())
        .andExpect(content().string(not(isEmptyString())));
  }
}

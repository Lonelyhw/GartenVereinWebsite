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
import de.heidensee.backend.domain.GardenListing;
import de.heidensee.backend.service.GardenListingService;
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

@WebMvcTest(GardenListingController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class GardenListingControllerWebMvcTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  private GardenListingService service;

  @Test
  void listReturns200() throws Exception {
    GardenListing listing = new GardenListing();
    listing.setId(1L);
    listing.setTitle("Parzelle");
    listing.setDescription("Desc");
    listing.setStatus("frei");
    listing.setContactInfo("kontakt");
    when(service.findAll()).thenReturn(List.of(listing));

    mockMvc.perform(get("/api/gardens"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray());
  }

  @Test
  void getByIdReturns200() throws Exception {
    GardenListing listing = new GardenListing();
    listing.setId(1L);
    listing.setTitle("Parzelle");
    listing.setDescription("Desc");
    listing.setStatus("frei");
    listing.setContactInfo("kontakt");
    when(service.findById(1L)).thenReturn(listing);

    mockMvc.perform(get("/api/gardens/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1));
  }

  @Test
  void getByIdReturns404() throws Exception {
    when(service.findById(1L))
        .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found"));

    mockMvc.perform(get("/api/gardens/1"))
        .andExpect(status().isNotFound());
  }

  @Test
  void postMissingTitleReturns400() throws Exception {
    Map<String, Object> payload = Map.of(
        "description", "Desc",
        "status", "frei",
        "contactInfo", "kontakt"
    );

    mockMvc.perform(post("/api/gardens")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(payload)))
        .andExpect(status().isBadRequest())
        .andExpect(content().string(not(isEmptyString())));
  }
}

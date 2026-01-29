package de.heidensee.backend;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.mock.web.MockMultipartFile;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
class UploadControllerIT extends AbstractIntegrationTest {

  @TempDir
  static Path uploadDir;

  @DynamicPropertySource
  static void registerUploadDir(DynamicPropertyRegistry registry) {
    registry.add("app.upload.dir", () -> uploadDir.toAbsolutePath().toString());
  }

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  void uploadAndFetchFile() throws Exception {
    MockMultipartFile file =
        new MockMultipartFile(
            "file",
            "test.txt",
            MediaType.TEXT_PLAIN_VALUE,
            "Hallo Upload".getBytes());

    MvcResult uploadResult =
        mockMvc.perform(multipart("/api/uploads")
                .file(file)
                .with(httpBasic("admin", "admin")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.url").isString())
            .andReturn();

    JsonNode json = objectMapper.readTree(uploadResult.getResponse().getContentAsString());
    String url = json.get("url").asText();
    assertThat(url).startsWith("/uploads/");

    mockMvc.perform(get(url))
        .andExpect(status().isOk())
        .andExpect(MockMvcResultMatchers.content().contentTypeCompatibleWith(MediaType.TEXT_PLAIN));
  }
}

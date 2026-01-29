package de.heidensee.backend;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpMethod;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class NewsApiIT extends AbstractIntegrationTest {

  @LocalServerPort
  private int port;

  @Autowired
  private TestRestTemplate restTemplate;

  @Test
  void getNewsReturns200() {
    ResponseEntity<String> response =
        restTemplate.getForEntity(url("/api/news"), String.class);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
  }

  @Test
  void postNewsRequiresAuth() {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    HttpEntity<Map<String, Object>> entity =
        new HttpEntity<>(
            Map.of(
                "title", "Test",
                "content", "Ohne Auth",
                "published", true),
            headers);

    ResponseEntity<String> response =
        restTemplate.postForEntity(url("/api/news"), entity, String.class);

    assertThat(response.getStatusCode()).isIn(HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN);
  }

  @Test
  void postNewsWorksWithBasicAuth() {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    HttpEntity<Map<String, Object>> entity =
        new HttpEntity<>(
            Map.of(
                "title", "Test mit Auth",
                "content", "Erfolg",
                "published", true),
            headers);

    ResponseEntity<String> response =
        restTemplate.withBasicAuth("admin", "admin")
            .postForEntity(url("/api/news"), entity, String.class);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
  }

  @Test
  void putNewsRequiresAuth() {
    Long id = createNewsWithAuth("Update Test");
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    HttpEntity<Map<String, Object>> entity =
        new HttpEntity<>(
            Map.of(
                "title", "Update ohne Auth",
                "content", "Update",
                "published", true),
            headers);

    ResponseEntity<String> response =
        restTemplate.exchange(url("/api/news/" + id), HttpMethod.PUT, entity, String.class);

    assertThat(response.getStatusCode()).isIn(HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN);
  }

  @Test
  void putNewsWorksWithBasicAuth() {
    Long id = createNewsWithAuth("Update mit Auth");
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    HttpEntity<Map<String, Object>> entity =
        new HttpEntity<>(
            Map.of(
                "title", "Update mit Auth",
                "content", "Update OK",
                "published", true),
            headers);

    ResponseEntity<String> response =
        restTemplate.withBasicAuth("admin", "admin")
            .exchange(url("/api/news/" + id), HttpMethod.PUT, entity, String.class);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
  }

  @Test
  void deleteNewsRequiresAuth() {
    Long id = createNewsWithAuth("Delete Test");

    ResponseEntity<String> response =
        restTemplate.exchange(url("/api/news/" + id), HttpMethod.DELETE, HttpEntity.EMPTY, String.class);

    assertThat(response.getStatusCode()).isIn(HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN);
  }

  @Test
  void deleteNewsWorksWithBasicAuth() {
    Long id = createNewsWithAuth("Delete mit Auth");

    ResponseEntity<String> response =
        restTemplate.withBasicAuth("admin", "admin")
            .exchange(url("/api/news/" + id), HttpMethod.DELETE, HttpEntity.EMPTY, String.class);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
  }

  private Long createNewsWithAuth(String title) {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    HttpEntity<Map<String, Object>> entity =
        new HttpEntity<>(
            Map.of(
                "title", title,
                "content", "Seed",
                "published", true),
            headers);

    ResponseEntity<Map> response =
        restTemplate.withBasicAuth("admin", "admin")
            .postForEntity(url("/api/news"), entity, Map.class);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    Object id = response.getBody() != null ? response.getBody().get("id") : null;
    if (id instanceof Number) {
      return ((Number) id).longValue();
    }
    return Long.valueOf(String.valueOf(id));
  }

  private String url(String path) {
    return "http://localhost:" + port + path;
  }
}

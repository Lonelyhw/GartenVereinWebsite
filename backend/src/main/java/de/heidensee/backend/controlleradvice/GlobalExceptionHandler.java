package de.heidensee.backend.controlleradvice;

import jakarta.validation.ConstraintViolationException;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
    List<ErrorItem> errors = ex.getBindingResult().getFieldErrors().stream()
        .map(this::toErrorItem)
        .toList();

    return json(HttpStatus.BAD_REQUEST,
        new ErrorResponse("Bitte Eingaben pruefen.", errors));
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException ex) {
    List<ErrorItem> errors = ex.getConstraintViolations().stream()
        .map(violation -> new ErrorItem(
            violation.getPropertyPath().toString(),
            messageForCode(violation.getMessageTemplate(), violation.getMessage())))
        .toList();

    return json(HttpStatus.BAD_REQUEST,
        new ErrorResponse("Bitte Eingaben pruefen.", errors));
  }

  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<ErrorResponse> handleResponseStatus(ResponseStatusException ex) {
    HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());
    if (status == HttpStatus.NOT_FOUND) {
      return json(HttpStatus.NOT_FOUND, new ErrorResponse("Nicht gefunden.", List.of()));
    }
    return json(status, new ErrorResponse(ex.getReason(), List.of()));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
    return json(HttpStatus.INTERNAL_SERVER_ERROR,
        new ErrorResponse("Auf dem Server ist etwas schiefgelaufen.", List.of()));
  }

  private ErrorItem toErrorItem(FieldError error) {
    String message = messageForCode(error.getCode(), error.getDefaultMessage());
    return new ErrorItem(error.getField(), message);
  }

  private String messageForCode(String code, String fallback) {
    if ("NotBlank".equals(code) || (fallback != null && fallback.toLowerCase().contains("blank"))) {
      return "Darf nicht leer sein.";
    }
    return fallback == null ? "Ungueltige Eingabe." : fallback;
  }

  private ResponseEntity<ErrorResponse> json(HttpStatus status, ErrorResponse body) {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    return new ResponseEntity<>(body, headers, status);
  }

  public record ErrorResponse(String message, List<ErrorItem> errors) {}

  public record ErrorItem(String field, String message) {}
}

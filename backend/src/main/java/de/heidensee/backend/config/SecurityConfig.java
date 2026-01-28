package de.heidensee.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .cors(Customizer.withDefaults())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.GET, "/api/news/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/notices/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/documents/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/board/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/rental/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/gardens/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/events/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/actuator/health").permitAll()
            .requestMatchers("/api/**").hasRole("ADMIN")
            .anyRequest().denyAll())
        .httpBasic(Customizer.withDefaults());

    return http.build();
  }
}

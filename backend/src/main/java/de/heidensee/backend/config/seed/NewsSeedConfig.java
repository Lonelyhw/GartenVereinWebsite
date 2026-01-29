package de.heidensee.backend.config.seed;

import de.heidensee.backend.domain.NewsPost;
import de.heidensee.backend.repo.NewsPostRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile({"dev", "docker"})
public class NewsSeedConfig {
  @Bean
  CommandLineRunner seedNewsPosts(NewsPostRepository repository) {
    return args -> {
      if (repository.count() > 0) {
        return;
      }

      LocalDateTime now = LocalDateTime.now();
      List<NewsPost> posts = List.of(
          buildPost("Saisoneroeffnung 2026", "Wir starten am ersten Aprilwochenende in die neue Gartensaison. Bitte pruefen Sie Ihre Parzellen und melden Sie Schaeden am Vereinsheim.", now.minusDays(3), true),
          buildPost("Wasser anstellen", "Das Wasser wird in der Anlage am kommenden Samstag wieder angestellt. Bitte alle Hauptventile in den Parzellen schliessen.", now.minusDays(7), true),
          buildPost("Gemeinschaftsarbeit Fruehjahrsputz", "Treffpunkt 9:00 Uhr am Vereinsheim. Aufgaben: Wege reinigen, Hecken rueckschneiden, Spielplatz kontrollieren.", now.minusDays(14), true),
          buildPost("Muellcontainer Termine", "Der Sperrmuell-Container steht an den Samstagen im April und Mai bereit. Bitte keine Elektrogeraete einwerfen.", now.minusDays(20), true),
          buildPost("Sommerfest am Heidensee", "Wir feiern am 15. Juni mit Musik, Grill und Kinderprogramm. Helferinnen und Helfer bitte beim Vorstand melden.", now.minusDays(30), true),
          buildPost("Vorstandswahl im Juli", "Die Wahl findet in der Mitgliederversammlung statt. Vorschlaege fuer Kandidaten bitte bis Ende Juni einreichen.", now.minusDays(40), true),
          buildPost("Hinweis zu Ruhezeiten", "Bitte beachten Sie die Ruhezeiten werktags ab 20:00 Uhr sowie sonn- und feiertags ganztags.", now.minusDays(50), true),
          buildPost("Neue Gartenordnung Entwurf", "Ein Entwurf fuer die Gartenordnung liegt im Vereinsheim zur Einsicht aus. Rueckmeldungen sind willkommen.", now.minusDays(55), false)
      );

      repository.saveAll(posts);
    };
  }

  private NewsPost buildPost(String title, String content, LocalDateTime createdAt, boolean published) {
    NewsPost post = new NewsPost();
    post.setTitle(title);
    post.setContent(content);
    post.setCreatedAt(createdAt);
    post.setUpdatedAt(createdAt);
    post.setPublished(published);
    return post;
  }
}
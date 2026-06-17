import { Component } from '@angular/core';
import { DatePipe, NgFor, NgIf, AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, combineLatest, map, of } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { ImageCardComponent } from '../../shared/image-card/image-card.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { NewsService } from '../../core/services/news.service';
import { NewsPost } from '../../core/models/news-post.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgFor, NgIf, RouterLink, ImageCardComponent, IconComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  protected readonly admin = false;
  protected readonly news$: Observable<Array<NewsPost & { teaser: string; highlight: boolean }>>;
  private readonly query$: Observable<string>;
  private readonly baseNews$: Observable<NewsPost[]>;

  protected readonly cards = [
    {
      title: 'Freie Gaerten',
      description: 'Aktuelle Verfuegbarkeiten und Bewerbungshinweise.',
      route: '/freie-gaerten',
      imageUrl: 'assets/images/freie-gaerten.jpg'
    },
    {
      title: 'Vereinsleben',
      description: 'Termine, Aktionen und Veranstaltungen im Blick.',
      route: '/vereinsleben',
      imageUrl: 'assets/images/vereinsleben.jpg'
    },
    {
      title: 'Vorstand',
      description: 'Ansprechpersonen, Aufgaben und Zustaendigkeiten.',
      route: '/vorstand',
      imageUrl: 'assets/images/vorstand.jpg'
    },
    {
      title: 'Vereinshaus',
      description: 'Informationen rund um Nutzung und Ausstattung.',
      route: '/vereinshaus',
      imageUrl: 'assets/images/vereinshaus.jpg'
    },
    {
      title: 'Aushaenge',
      description: 'Wichtige Mitteilungen und Bekanntmachungen.',
      route: '/aushange',
      imageUrl: 'assets/images/aushang.jpg'
    },
    {
      title: 'Dokumente',
      description: 'Formulare, Satzung und Vereinsunterlagen.',
      route: '/dokumente',
      imageUrl: 'assets/images/dokumente.jpg'
    },
    {
      title: 'Verleih',
      description: 'Geraete und Ausstattung fuer Mitglieder.',
      route: '/verleih',
      imageUrl: 'assets/images/verleih.jpg'
    },
    {
      title: 'Vorstand intern',
      description: 'Interner Bereich mit Schnellzugriffen.',
      route: '/intern',
      imageUrl: 'assets/images/vorstand.jpg',
      badge: 'Intern',
      adminOnly: true
    }
  ];

  constructor(
    private readonly newsService: NewsService,
    private readonly route: ActivatedRoute
  ) {
    this.query$ = this.route.queryParamMap.pipe(
      map((params) => (params.get('q') ?? '').trim().toLowerCase())
    );
    this.baseNews$ = this.newsService.getPublishedSorted().pipe(
      catchError(() => of([])),
      shareReplay({ bufferSize: 1, refCount: true })
    );
    this.news$ = combineLatest([this.baseNews$, this.query$]).pipe(
      map(([items, query]) =>
        items.map((item) => {
          const content = item.content ?? '';
          const highlight =
            !!query &&
            (item.title.toLowerCase().includes(query) || content.toLowerCase().includes(query));
          return {
            ...item,
            teaser: content.length > 160 ? `${content.slice(0, 160)}...` : content,
            highlight
          };
        })
      )
    );
  }
}

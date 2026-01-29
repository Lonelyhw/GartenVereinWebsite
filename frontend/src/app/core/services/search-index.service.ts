import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NewsService } from './news.service';
import { NoticeService } from './notice.service';
import { DocumentService } from './document.service';
import { BoardService } from './board.service';
import { RentalService } from './rental.service';
import { GardenService } from './garden.service';
import { EventService } from './event.service';
import { SearchItem, SearchItemType } from '../models/search-item.model';

const CLUBHOUSE_TEXT =
  'Informationen zur Nutzung, Ausstattung und Buchung. Preise, Bilder und Vermietkalender.';

@Injectable({
  providedIn: 'root'
})
export class SearchIndexService {
  private readonly itemsSubject = new BehaviorSubject<SearchItem[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private loaded = false;

  constructor(
    private readonly newsService: NewsService,
    private readonly noticeService: NoticeService,
    private readonly documentService: DocumentService,
    private readonly boardService: BoardService,
    private readonly rentalService: RentalService,
    private readonly gardenService: GardenService,
    private readonly eventService: EventService
  ) {}

  get items$(): Observable<SearchItem[]> {
    return this.itemsSubject.asObservable();
  }

  get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  isLoading(): boolean {
    return this.loadingSubject.getValue();
  }

  getSnapshot(): SearchItem[] {
    return this.itemsSubject.getValue();
  }

  ensureLoaded(): void {
    if (this.loaded || this.loadingSubject.getValue()) {
      return;
    }

    this.loadingSubject.next(true);

    forkJoin({
      news: this.newsService.getAll().pipe(catchError(() => of([]))),
      notices: this.noticeService.getAll().pipe(catchError(() => of([]))),
      documents: this.documentService.getAll().pipe(catchError(() => of([]))),
      board: this.boardService.getAll().pipe(catchError(() => of([]))),
      rental: this.rentalService.getAll().pipe(catchError(() => of([]))),
      gardens: this.gardenService.getAll().pipe(catchError(() => of([]))),
      events: this.eventService.getAll().pipe(catchError(() => of([])))
    }).subscribe({
      next: (data) => {
        const items: SearchItem[] = [];

        items.push(...this.buildStaticPages());
        items.push(this.buildClubhouse());

        data.news
          .filter((item) => item.published)
          .forEach((item) => {
            items.push({
              id: `news:${item.id}`,
              type: 'news',
              title: item.title,
              subtitle: 'Aktuelles',
              text: `${item.title} ${item.content}`,
              route: ['/news', item.id],
              date: item.createdAt
            });
          });

        data.notices
          .filter((item) => item.active)
          .forEach((item) => {
            items.push({
              id: `notice:${item.id}`,
              type: 'notice',
              title: item.title,
              subtitle: 'Aushang',
              text: `${item.title} ${item.content}`,
              route: ['/aushange'],
              date: item.createdAt
            });
          });

        data.documents.forEach((item) => {
          items.push({
            id: `document:${item.id}`,
            type: 'document',
            title: item.title,
            subtitle: item.category,
            text: `${item.title} ${item.description} ${item.category}`,
            route: ['/dokumente'],
            date: item.createdAt
          });
        });

        data.board.forEach((item) => {
          items.push({
            id: `board:${item.id}`,
            type: 'board',
            title: item.name,
            subtitle: item.role,
            text: `${item.name} ${item.role} ${item.email ?? ''} ${item.phone ?? ''}`,
            route: ['/vorstand']
          });
        });

        data.rental.forEach((item) => {
          items.push({
            id: `rental:${item.id}`,
            type: 'rental',
            title: item.name,
            subtitle: item.available ? 'Verfuegbar' : 'Nicht verfuegbar',
            text: `${item.name} ${item.description}`,
            route: ['/verleih']
          });
        });

        data.gardens.forEach((item) => {
          items.push({
            id: `garden:${item.id}`,
            type: 'garden',
            title: item.title,
            subtitle: item.status,
            text: `${item.title} ${item.description} ${item.status} ${item.contactInfo}`,
            route: ['/freie-gaerten'],
            date: item.createdAt
          });
        });

        data.events.forEach((item) => {
          items.push({
            id: `event:${item.id}`,
            type: 'event',
            title: item.title,
            subtitle: item.location,
            text: `${item.title} ${item.description} ${item.location}`,
            route: ['/vereinsleben'],
            date: item.startDateTime
          });
        });

        this.itemsSubject.next(items);
        this.loaded = true;
        this.loadingSubject.next(false);
      },
      error: () => {
        const items = [...this.buildStaticPages(), this.buildClubhouse()];
        this.itemsSubject.next(items);
        this.loaded = true;
        this.loadingSubject.next(false);
      }
    });
  }

  private buildStaticPages(): SearchItem[] {
    const pages: Array<{ title: string; route: any[]; id: string }> = [
      { id: 'page:aktuelles', title: 'Aktuelles', route: ['/'] },
      { id: 'page:vereinshaus', title: 'Vereinshaus', route: ['/vereinshaus'] },
      { id: 'page:freie-gaerten', title: 'Freie Gaerten', route: ['/freie-gaerten'] },
      { id: 'page:vorstand', title: 'Vorstand', route: ['/vorstand'] },
      { id: 'page:aushange', title: 'Aushaenge', route: ['/aushange'] },
      { id: 'page:dokumente', title: 'Dokumente', route: ['/dokumente'] },
      { id: 'page:verleih', title: 'Verleih', route: ['/verleih'] },
      { id: 'page:vereinsleben', title: 'Vereinsleben', route: ['/vereinsleben'] }
    ];

    return pages.map((page) => ({
      id: page.id,
      type: 'page' as SearchItemType,
      title: page.title,
      subtitle: 'Seite',
      text: page.title,
      route: page.route
    }));
  }

  private buildClubhouse(): SearchItem {
    return {
      id: 'clubhouse:vereinshaus',
      type: 'clubhouse',
      title: 'Vereinshaus',
      subtitle: 'Beschreibung',
      text: `Vereinshaus ${CLUBHOUSE_TEXT}`,
      route: ['/vereinshaus']
    };
  }
}

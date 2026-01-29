import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { SearchIndexService } from './search-index.service';
import { NewsService } from './news.service';
import { NoticeService } from './notice.service';
import { DocumentService } from './document.service';
import { BoardService } from './board.service';
import { RentalService } from './rental.service';
import { GardenService } from './garden.service';
import { EventService } from './event.service';
import { SearchItem } from '../models/search-item.model';

describe('SearchIndexService', () => {
  let service: SearchIndexService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        SearchIndexService,
        NewsService,
        NoticeService,
        DocumentService,
        BoardService,
        RentalService,
        GardenService,
        EventService
      ]
    });

    service = TestBed.inject(SearchIndexService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads all endpoints and builds the index', () => {
    service.ensureLoaded();

    const reqs = httpMock.match((req) => req.url.startsWith('/api/'));
    const urls = reqs.map((req) => req.request.url).sort();
    expect(urls).toEqual([
      '/api/board',
      '/api/documents',
      '/api/events',
      '/api/gardens',
      '/api/news',
      '/api/notices',
      '/api/rental'
    ]);

    reqs.find((req) => req.request.url === '/api/news')?.flush([
      {
        id: 1,
        title: 'News 1',
        content: 'Inhalt',
        createdAt: '2024-01-01T10:00:00Z',
        published: true
      },
      {
        id: 2,
        title: 'News Draft',
        content: 'Entwurf',
        createdAt: '2024-01-02T10:00:00Z',
        published: false
      }
    ]);
    reqs.find((req) => req.request.url === '/api/notices')?.flush([
      {
        id: 1,
        title: 'Aushang',
        content: 'A',
        createdAt: '2024-01-03T10:00:00Z',
        active: true
      },
      {
        id: 2,
        title: 'Alt',
        content: 'Alt',
        createdAt: '2024-01-04T10:00:00Z',
        active: false
      }
    ]);
    reqs.find((req) => req.request.url === '/api/documents')?.flush([
      {
        id: 1,
        title: 'Satzung',
        description: 'Desc',
        fileUrl: '/uploads/test.pdf',
        category: 'Satzung',
        createdAt: '2024-01-05T10:00:00Z'
      }
    ]);
    reqs.find((req) => req.request.url === '/api/board')?.flush([
      {
        id: 1,
        name: 'Max',
        role: 'Vorsitz',
        email: 'max@example.com',
        phone: '123'
      }
    ]);
    reqs.find((req) => req.request.url === '/api/rental')?.flush([
      {
        id: 1,
        name: 'Anhaenger',
        price: 10,
        deposit: 20,
        description: 'Desc',
        available: true
      }
    ]);
    reqs.find((req) => req.request.url === '/api/gardens')?.flush([
      {
        id: 1,
        title: 'Parzelle',
        description: 'Desc',
        status: 'frei',
        contactInfo: 'kontakt',
        createdAt: '2024-01-06T10:00:00Z'
      }
    ]);
    reqs.find((req) => req.request.url === '/api/events')?.flush([
      {
        id: 1,
        title: 'Termin',
        description: 'Desc',
        startDateTime: '2024-01-07T10:00:00Z',
        endDateTime: '2024-01-07T12:00:00Z',
        location: 'Vereinshaus'
      }
    ]);

    const items: SearchItem[] = service.getSnapshot();

    expect(items.find((item) => item.id === 'page:vereinshaus')).toBeTruthy();
    expect(items.find((item) => item.id === 'clubhouse:vereinshaus')).toBeTruthy();
    expect(items.find((item) => item.id === 'news:1')).toBeTruthy();
    expect(items.find((item) => item.id === 'news:2')).toBeFalsy();
    expect(items.find((item) => item.id === 'notice:1')).toBeTruthy();
    expect(items.find((item) => item.id === 'notice:2')).toBeFalsy();
    expect(items.find((item) => item.id === 'document:1')?.route).toEqual(['/dokumente']);
  });
});

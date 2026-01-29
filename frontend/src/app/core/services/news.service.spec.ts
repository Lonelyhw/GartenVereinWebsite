import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { NewsService } from './news.service';
import { NewsPost } from '../models/news-post.model';

describe('NewsService', () => {
  let service: NewsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), NewsService]
    });
    service = TestBed.inject(NewsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('calls GET /api/news', () => {
    service.getAll().subscribe();

    const req = httpMock.expectOne('/api/news');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('filters and sorts published items', (done) => {
    const payload: NewsPost[] = [
      {
        id: 1,
        title: 'Alt',
        content: 'Alt',
        createdAt: '2024-01-01T10:00:00Z',
        published: true
      },
      {
        id: 2,
        title: 'Draft',
        content: 'Draft',
        createdAt: '2024-02-01T10:00:00Z',
        published: false
      },
      {
        id: 3,
        title: 'Neu',
        content: 'Neu',
        createdAt: '2024-03-01T10:00:00Z',
        published: true
      }
    ];

    service.getPublishedSorted().subscribe((items) => {
      expect(items.length).toBe(2);
      expect(items[0].id).toBe(3);
      expect(items[1].id).toBe(1);
      done();
    });

    const req = httpMock.expectOne('/api/news');
    req.flush(payload);
  });
});

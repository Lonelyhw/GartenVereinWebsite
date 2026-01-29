import { of, Subject } from 'rxjs';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { HomeComponent } from './home.component';
import { NewsService } from '../../core/services/news.service';
import { renderPage } from '../../../test-utils/render';
import { NewsPost } from '../../core/models/news-post.model';

describe('HomeComponent', () => {
  it('shows loading state while news is pending', async () => {
    const newsSubject = new Subject<NewsPost[]>();
    const newsService = {
      getPublishedSorted: () => newsSubject.asObservable()
    };
    const routeStub = {
      queryParamMap: of(convertToParamMap({}))
    } as Partial<ActivatedRoute>;

    const { fixture } = await renderPage(HomeComponent, {
      providers: [
        { provide: NewsService, useValue: newsService },
        { provide: ActivatedRoute, useValue: routeStub }
      ]
    });

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.h-28')).toBeTruthy();
  });

  it('shows empty state when no news', async () => {
    const newsService = {
      getPublishedSorted: () => of([])
    };
    const routeStub = {
      queryParamMap: of(convertToParamMap({}))
    } as Partial<ActivatedRoute>;

    const { fixture } = await renderPage(HomeComponent, {
      providers: [
        { provide: NewsService, useValue: newsService },
        { provide: ActivatedRoute, useValue: routeStub }
      ]
    });

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Noch keine Beitraege.');
  });

  it('shows list state with items', async () => {
    const newsService = {
      getPublishedSorted: () =>
        of([
          {
            id: 1,
            title: 'Test Beitrag',
            content: 'Test Inhalt',
            createdAt: new Date().toISOString(),
            published: true
          }
        ])
    };
    const routeStub = {
      queryParamMap: of(convertToParamMap({}))
    } as Partial<ActivatedRoute>;

    const { fixture } = await renderPage(HomeComponent, {
      providers: [
        { provide: NewsService, useValue: newsService },
        { provide: ActivatedRoute, useValue: routeStub }
      ]
    });

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Beitrag');
    expect(compiled.textContent).toContain('Weiterlesen');
  });
});

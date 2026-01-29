import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, NgIf, AsyncPipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { NewsService } from '../../core/services/news.service';
import { NewsPost } from '../../core/models/news-post.model';
import { renderMarkdown } from '../../shared/markdown';

type NewsDetailState =
  | { status: 'loading' }
  | { status: 'loaded'; item: NewsPost }
  | { status: 'notFound' };

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgIf],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.scss'
})
export class NewsDetailComponent {
  protected readonly state$: Observable<NewsDetailState>;
  protected readonly renderMarkdown = renderMarkdown;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly newsService: NewsService
  ) {
    this.state$ = this.route.paramMap.pipe(
      map((params) => params.get('id')),
      switchMap((idParam) => {
        const id = idParam ? Number(idParam) : NaN;
        if (!id || Number.isNaN(id)) {
          return of<NewsDetailState>({ status: 'notFound' });
        }
        return this.newsService.getById(id).pipe(
          map((item) => ({ status: 'loaded', item } as NewsDetailState)),
          catchError(() => of<NewsDetailState>({ status: 'notFound' }))
        );
      }),
      startWith<NewsDetailState>({ status: 'loading' })
    );
  }
}

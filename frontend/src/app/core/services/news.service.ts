import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api/api.config';
import { NewsPost } from '../models/news-post.model';
import { map } from 'rxjs/operators';

export interface NewsPostPayload {
  title: string;
  content: string;
  published: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private readonly baseUrl = `${API_BASE_URL}/news`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<NewsPost[]> {
    return this.http.get<NewsPost[]>(this.baseUrl);
  }

  getPublished(): Observable<NewsPost[]> {
    return this.getAll().pipe(map((items) => items.filter((item) => item.published)));
  }

  getPublishedSorted(): Observable<NewsPost[]> {
    return this.getPublished().pipe(
      map((items) =>
        [...items].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      )
    );
  }

  getById(id: number): Observable<NewsPost> {
    return this.http.get<NewsPost>(`${this.baseUrl}/${id}`);
  }

  create(payload: NewsPostPayload): Observable<NewsPost> {
    return this.http.post<NewsPost>(this.baseUrl, payload);
  }

  update(id: number, payload: NewsPostPayload): Observable<NewsPost> {
    return this.http.put<NewsPost>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

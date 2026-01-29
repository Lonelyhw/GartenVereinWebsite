import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api/api.config';

export interface Notice {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  private readonly baseUrl = `${API_BASE_URL}/notices`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Notice[]> {
    return this.http.get<Notice[]>(this.baseUrl);
  }

  create(payload: { title: string; content: string; active: boolean }): Observable<Notice> {
    return this.http.post<Notice>(this.baseUrl, payload);
  }
}

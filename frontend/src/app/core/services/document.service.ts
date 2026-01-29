import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../api/api.config';
import { Observable } from 'rxjs';

export interface DocumentItem {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  category: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private readonly baseUrl = `${API_BASE_URL}/documents`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<DocumentItem[]> {
    return this.http.get<DocumentItem[]>(this.baseUrl);
  }

  create(payload: Omit<DocumentItem, 'id' | 'createdAt'>): Observable<DocumentItem> {
    return this.http.post<DocumentItem>(this.baseUrl, payload);
  }
}

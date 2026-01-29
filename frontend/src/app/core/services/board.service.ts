import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api/api.config';

export interface BoardMember {
  id: number;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private readonly baseUrl = `${API_BASE_URL}/board`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<BoardMember[]> {
    return this.http.get<BoardMember[]>(this.baseUrl);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api/api.config';

export interface ClubEvent {
  id: number;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly baseUrl = `${API_BASE_URL}/events`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<ClubEvent[]> {
    return this.http.get<ClubEvent[]>(this.baseUrl);
  }
}
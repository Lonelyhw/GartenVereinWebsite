import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api/api.config';

export interface GardenListing {
  id: number;
  title: string;
  description: string;
  status: string;
  contactInfo: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class GardenService {
  private readonly baseUrl = `${API_BASE_URL}/gardens`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<GardenListing[]> {
    return this.http.get<GardenListing[]>(this.baseUrl);
  }
}
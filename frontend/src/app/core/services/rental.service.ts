import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api/api.config';

export interface RentalItem {
  id: number;
  name: string;
  price: number;
  deposit: number;
  description: string;
  available: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private readonly baseUrl = `${API_BASE_URL}/rental`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<RentalItem[]> {
    return this.http.get<RentalItem[]>(this.baseUrl);
  }
}
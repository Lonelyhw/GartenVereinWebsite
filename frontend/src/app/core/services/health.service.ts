import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api/api.config';

export interface HealthStatus {
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private readonly baseUrl = `${API_BASE_URL}/actuator/health`;

  constructor(private readonly http: HttpClient) {}

  getHealth(): Observable<HealthStatus> {
    return this.http.get<HealthStatus>(this.baseUrl);
  }
}
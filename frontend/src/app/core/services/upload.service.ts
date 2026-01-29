import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api/api.config';

export interface UploadResponse {
  url: string;
  filename: string;
  contentType?: string;
  size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private readonly baseUrl = `${API_BASE_URL}/uploads`;

  constructor(private readonly http: HttpClient) {}

  upload(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadResponse>(this.baseUrl, formData);
  }
}
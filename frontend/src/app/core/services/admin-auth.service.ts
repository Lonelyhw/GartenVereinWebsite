import { Injectable } from '@angular/core';

const STORAGE_USER = 'adminUser';
const STORAGE_PASS = 'adminPass';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private username: string | null = null;
  private password: string | null = null;

  constructor() {
    this.username = localStorage.getItem(STORAGE_USER);
    this.password = localStorage.getItem(STORAGE_PASS);
  }

  setCredentials(username: string, password: string, remember = true): void {
    this.username = username;
    this.password = password;
    if (remember) {
      localStorage.setItem(STORAGE_USER, username);
      localStorage.setItem(STORAGE_PASS, password);
    }
  }

  clearCredentials(): void {
    this.username = null;
    this.password = null;
    localStorage.removeItem(STORAGE_USER);
    localStorage.removeItem(STORAGE_PASS);
  }

  hasCredentials(): boolean {
    return !!this.username && !!this.password;
  }

  getUsername(): string {
    return this.username ?? '';
  }

  getAuthHeader(): string {
    if (!this.username || !this.password) {
      return '';
    }
    return `Basic ${btoa(`${this.username}:${this.password}`)}`;
  }
}
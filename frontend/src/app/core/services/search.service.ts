import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchIndexService } from './search-index.service';
import { SearchItem } from '../models/search-item.model';

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/\u00e4/g, 'ae')
    .replace(/\u00f6/g, 'oe')
    .replace(/\u00fc/g, 'ue')
    .replace(/\u00df/g, 'ss');
}

function scoreItem(query: string, item: SearchItem): number {
  const title = normalize(item.title);
  const text = normalize(item.text);
  const q = normalize(query);

  if (!title.includes(q) && !text.includes(q)) {
    return 0;
  }

  let score = 0;
  if (title === q) {
    score += 100;
  } else if (title.startsWith(q)) {
    score += 70;
  } else if (title.includes(q)) {
    score += 50;
  }

  const wordRegex = new RegExp(`\\b${q}\\b`, 'i');
  if (wordRegex.test(title)) {
    score += 20;
  }

  if (text.includes(q)) {
    score += 10;
  }

  return score;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private readonly indexService: SearchIndexService) {}

  ensureLoaded(): void {
    this.indexService.ensureLoaded();
  }

  loading$(): Observable<boolean> {
    return this.indexService.loading$;
  }

  getLoading(): boolean {
    return this.indexService.isLoading();
  }

  search(query: string): SearchItem[] {
    const items = this.indexService.getSnapshot();
    const trimmed = query.trim();
    if (!trimmed) {
      return [];
    }

    const scored = items
      .map((item) => ({ item, score: scoreItem(trimmed, item) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        const aDate = a.item.date ? new Date(a.item.date).getTime() : 0;
        const bDate = b.item.date ? new Date(b.item.date).getTime() : 0;
        return bDate - aDate;
      })
      .slice(0, 10)
      .map((entry) => entry.item);

    return scored;
  }
}

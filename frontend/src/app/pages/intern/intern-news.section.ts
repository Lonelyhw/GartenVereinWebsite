import { Component, OnInit } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewsService, NewsPostPayload } from '../../core/services/news.service';
import { NewsPost } from '../../core/models/news-post.model';

@Component({
  selector: 'app-intern-news-section',
  standalone: true,
  imports: [DatePipe, FormsModule, NgFor, NgIf],
  templateUrl: './intern-news.section.html'
})
export class InternNewsSectionComponent implements OnInit {
  protected loading = true;
  protected errorMessage = '';
  protected newsItems: NewsPost[] = [];

  protected formOpen = false;
  protected editingId: number | null = null;
  protected form: NewsPostPayload = {
    title: '',
    content: '',
    published: true
  };

  constructor(private readonly newsService: NewsService) {}

  ngOnInit(): void {
    this.loadNews();
  }

  protected startCreate(): void {
    this.formOpen = true;
    this.editingId = null;
    this.form = {
      title: '',
      content: '',
      published: true
    };
  }

  protected startEdit(item: NewsPost): void {
    this.formOpen = true;
    this.editingId = item.id;
    this.form = {
      title: item.title,
      content: item.content,
      published: item.published
    };
  }

  protected cancel(): void {
    this.formOpen = false;
    this.editingId = null;
    this.errorMessage = '';
  }

  protected save(): void {
    this.errorMessage = '';
    const payload: NewsPostPayload = {
      title: this.form.title.trim(),
      content: this.form.content.trim(),
      published: this.form.published
    };

    const request$ = this.editingId === null
      ? this.newsService.create(payload)
      : this.newsService.update(this.editingId, payload);

    request$.subscribe({
      next: () => {
        this.formOpen = false;
        this.editingId = null;
        this.loadNews();
      },
      error: (err) => {
        if (err?.status === 401 || err?.status === 403) {
          this.errorMessage = 'Nicht autorisiert - bitte anmelden.';
        } else {
          this.errorMessage = 'Speichern fehlgeschlagen.';
        }
      }
    });
  }

  protected delete(item: NewsPost): void {
    this.errorMessage = '';
    if (!confirm(`Beitrag "${item.title}" loeschen?`)) {
      return;
    }

    this.newsService.delete(item.id).subscribe({
      next: () => {
        this.loadNews();
      },
      error: (err) => {
        if (err?.status === 401 || err?.status === 403) {
          this.errorMessage = 'Nicht autorisiert - bitte anmelden.';
        } else {
          this.errorMessage = 'Loeschen fehlgeschlagen.';
        }
      }
    });
  }

  private loadNews(): void {
    this.loading = true;
    this.newsService.getAll().subscribe({
      next: (items) => {
        this.newsItems = items.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.loading = false;
      },
      error: () => {
        this.newsItems = [];
        this.loading = false;
        this.errorMessage = 'Laden fehlgeschlagen.';
      }
    });
  }
}
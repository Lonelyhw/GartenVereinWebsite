import { Component, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { NoticeService, Notice } from '../../core/services/notice.service';
import { Observable, map } from 'rxjs';
import { renderMarkdown } from '../../shared/markdown';

interface NoticeView {
  id: number;
  title: string;
  imageUrl: string;
  text?: string;
}

@Component({
  selector: 'app-aushange',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf],
  templateUrl: './aushange.component.html',
  styleUrl: './aushange.component.scss'
})
export class AushangeComponent {
  private readonly noticeService = inject(NoticeService);
  protected readonly notices$: Observable<NoticeView[]> = this.noticeService.getAll().pipe(
    map((items) =>
      items
        .filter((item) => item.active)
        .map((item) => ({
          id: item.id,
          title: item.title,
          ...this.parseNoticeContent(item)
        }))
    )
  );
  protected readonly renderMarkdown = renderMarkdown;

  private parseNoticeContent(notice: Notice): { imageUrl: string; text?: string } {
    if (!notice.content) {
      return { imageUrl: '' };
    }
    try {
      const parsed = JSON.parse(notice.content) as { imageUrl?: string; text?: string };
      if (parsed && parsed.imageUrl) {
        return { imageUrl: parsed.imageUrl, text: parsed.text };
      }
    } catch {
      // fall back to treating content as a raw image URL
    }
    return { imageUrl: notice.content };
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { AdminAuthService } from '../../core/services/admin-auth.service';
import { InternNewsSectionComponent } from './intern-news.section';
import { DocumentService, DocumentItem } from '../../core/services/document.service';
import { NoticeService, Notice } from '../../core/services/notice.service';
import { UploadService } from '../../core/services/upload.service';
import { StatusService } from '../../core/services/status.service';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-intern',
  standalone: true,
  imports: [AsyncPipe, FormsModule, NgFor, NgIf, InternNewsSectionComponent],
  templateUrl: './intern.component.html',
  styleUrl: './intern.component.scss'
})
export class InternComponent {
  protected username = '';
  protected password = '';
  protected remember = true;
  protected signedIn = false;

  private readonly documentRefresh$ = new BehaviorSubject<void>(undefined);
  private readonly noticeRefresh$ = new BehaviorSubject<void>(undefined);

  protected readonly documents$: Observable<DocumentItem[]> = this.documentRefresh$.pipe(
    switchMap(() => this.documentService.getAll())
  );
  protected readonly notices$: Observable<Notice[]> = this.noticeRefresh$.pipe(
    switchMap(() => this.noticeService.getAll())
  );

  protected docTitle = '';
  protected docDescription = '';
  protected docCategory = '';
  protected docFile: File | null = null;

  protected noticeTitle = '';
  protected noticeContent = '';
  protected noticeFile: File | null = null;

  constructor(
    private readonly authService: AdminAuthService,
    private readonly documentService: DocumentService,
    private readonly noticeService: NoticeService,
    private readonly uploadService: UploadService,
    private readonly statusService: StatusService
  ) {
    this.username = this.authService.getUsername();
    this.signedIn = this.authService.hasCredentials();
  }

  protected login(): void {
    if (!this.username || !this.password) {
      return;
    }
    this.authService.setCredentials(this.username, this.password, this.remember);
    this.signedIn = true;
    this.statusService.showSuccess('Gespeichert.');
  }

  protected logout(): void {
    this.authService.clearCredentials();
    this.password = '';
    this.signedIn = false;
  }

  protected onDocFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.docFile = file;
  }

  protected onNoticeFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.noticeFile = file;
  }

  protected saveDocument(): void {
    if (!this.docFile) {
      this.statusService.showError('Bitte eine PDF-Datei auswaehlen.');
      return;
    }
    if (this.docFile.type !== 'application/pdf') {
      this.statusService.showError('Bitte nur PDF-Dateien hochladen.');
      return;
    }

    this.uploadService.upload(this.docFile).subscribe({
      next: (upload) => {
        this.documentService
          .create({
            title: this.docTitle.trim(),
            description: this.docDescription.trim(),
            category: this.docCategory.trim(),
            fileUrl: upload.url
          })
          .subscribe({
            next: () => {
              this.docTitle = '';
              this.docDescription = '';
              this.docCategory = '';
              this.docFile = null;
              this.documentRefresh$.next();
              this.statusService.showSuccess('Gespeichert.');
            }
          });
      },
      error: () => {
        this.statusService.showError('Upload fehlgeschlagen.');
      }
    });
  }

  protected saveNotice(): void {
    if (!this.noticeFile) {
      this.statusService.showError('Bitte ein Bild auswaehlen.');
      return;
    }
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(this.noticeFile.type)) {
      this.statusService.showError('Bitte nur JPG, PNG oder WEBP hochladen.');
      return;
    }

    this.uploadService.upload(this.noticeFile).subscribe({
      next: (upload) => {
        this.noticeService
          .create({
            title: this.noticeTitle.trim(),
            content: JSON.stringify({
              imageUrl: upload.url,
              text: this.noticeContent.trim() || undefined
            }),
            active: true
          })
          .subscribe({
            next: () => {
              this.noticeTitle = '';
              this.noticeContent = '';
              this.noticeFile = null;
              this.noticeRefresh$.next();
              this.statusService.showSuccess('Gespeichert.');
            }
          });
      },
      error: () => {
        this.statusService.showError('Upload fehlgeschlagen.');
      }
    });
  }
}

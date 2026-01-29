import { Component, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { DocumentService, DocumentItem } from '../../core/services/document.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dokumente',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf],
  templateUrl: './dokumente.component.html',
  styleUrl: './dokumente.component.scss'
})
export class DokumenteComponent {
  private readonly documentService = inject(DocumentService);
  protected readonly documents$: Observable<DocumentItem[]> = this.documentService.getAll();
}

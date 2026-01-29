import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StatusMessage, StatusType } from '../../shared/status-banner/status-banner.types';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  private readonly subject = new BehaviorSubject<StatusMessage | null>(null);
  readonly status$ = this.subject.asObservable();

  show(type: StatusType, message: string, actions?: StatusMessage['actions']): void {
    this.subject.next({ type, message, actions });
  }

  showError(message: string): void {
    this.show('error', message);
  }

  showSuccess(message: string): void {
    this.show('success', message);
    setTimeout(() => {
      if (this.subject.getValue()?.type === 'success') {
        this.clear();
      }
    }, 5000);
  }

  showWarning(message: string): void {
    this.show('warning', message);
  }

  showInfo(message: string): void {
    this.show('info', message);
  }

  clear(): void {
    this.subject.next(null);
  }
}

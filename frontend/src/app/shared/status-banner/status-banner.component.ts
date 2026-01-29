import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { StatusMessage, StatusType } from './status-banner.types';

@Component({
  selector: 'app-status-banner',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './status-banner.component.html'
})
export class StatusBannerComponent {
  @Input() status: StatusMessage | null = null;
  @Output() dismiss = new EventEmitter<void>();
  @Output() action = new EventEmitter<string>();

  getClasses(type: StatusType): string {
    switch (type) {
      case 'success':
        return 'border-emerald-200 bg-emerald-50 text-emerald-800';
      case 'warning':
        return 'border-amber-200 bg-amber-50 text-amber-800';
      case 'error':
        return 'border-rose-200 bg-rose-50 text-rose-800';
      default:
        return 'border-slate-200 bg-slate-50 text-slate-700';
    }
  }
}
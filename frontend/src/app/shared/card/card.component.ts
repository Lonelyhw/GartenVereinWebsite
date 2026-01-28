import { Component, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgClass, NgIf, RouterLink],
  templateUrl: './card.component.html'
})
export class CardComponent {
  @Input() title = '';
  @Input() text = '';
  @Input() link?: string;
  @Input() imageClass = 'bg-gradient-to-br from-emerald-200 via-emerald-100 to-slate-50';
}
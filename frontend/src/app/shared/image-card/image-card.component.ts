import { Component, Input } from '@angular/core';
import { NgIf, NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-image-card',
  standalone: true,
  imports: [NgIf, NgStyle, RouterLink],
  templateUrl: './image-card.component.html'
})
export class ImageCardComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() href: string | any[] = '/';
  @Input() imageUrl = '';
  @Input() badge?: string;

  protected get isArrayLink(): boolean {
    return Array.isArray(this.href);
  }

  protected get backgroundStyle(): { [key: string]: string } {
    return this.imageUrl
      ? {
          'background-image': `url(${this.imageUrl})`,
          'background-size': 'cover',
          'background-position': 'center'
        }
      : {
          'background-size': 'cover',
          'background-position': 'center'
        };
  }
}
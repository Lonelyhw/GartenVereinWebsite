import { Component, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ContainerComponent } from '../../shared/container/container.component';

interface NavLink {
  label: string;
  path: string;
}

interface NavGroup {
  label: string;
  links: NavLink[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, RouterLinkActive, RouterOutlet, ContainerComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss'
})
export class AppLayoutComponent {
  protected readonly mobileOpen = signal(false);
  protected readonly mobileGroupOpen = signal<string | null>(null);

  protected readonly groups: NavGroup[] = [
    {
      label: 'Der Verein',
      links: [
        { label: 'Vereinsleben', path: '/vereinsleben' },
        { label: 'Vorstand', path: '/vorstand' },
        { label: 'Dokumente', path: '/dokumente' }
      ]
    },
    {
      label: 'Aktuelles',
      links: [
        { label: 'Aktuelles', path: '/' },
        { label: 'Aktuelle Aushaenge', path: '/aushange' },
        { label: 'Freie Gaerten', path: '/freie-gaerten' }
      ]
    }
  ];

  protected readonly directLinks: NavLink[] = [
    { label: 'Vereinshaus', path: '/vereinshaus' },
    { label: 'Verleih', path: '/verleih' }
  ];

  protected toggleMobile(): void {
    this.mobileOpen.update((open) => !open);
  }

  protected closeMobile(): void {
    this.mobileOpen.set(false);
  }

  protected toggleGroup(label: string): void {
    this.mobileGroupOpen.update((current) => (current === label ? null : label));
  }
}

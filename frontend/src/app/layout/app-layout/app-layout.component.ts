import { Component, HostListener, OnInit, signal } from '@angular/core';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { SearchItem } from '../../core/models/search-item.model';
import { SearchService } from '../../core/services/search.service';
import { ContainerComponent } from '../../shared/container/container.component';
import { StatusService } from '../../core/services/status.service';
import { StatusBannerComponent } from '../../shared/status-banner/status-banner.component';
import { HealthService } from '../../core/services/health.service';
import { catchError, of, take } from 'rxjs';

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
  imports: [
    AsyncPipe,
    DatePipe,
    NgFor,
    NgIf,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    ContainerComponent,
    StatusBannerComponent
  ],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss'
})
export class AppLayoutComponent implements OnInit {
  protected readonly mobileOpen = signal(false);
  protected readonly mobileGroupOpen = signal<string | null>(null);
  protected readonly desktopOpen = signal<string | null>(null);
  protected readonly searchOpen = signal(false);
  protected searchQuery = '';
  protected searchResults: SearchItem[] = [];
  protected searchRows: Array<{ kind: 'header' | 'item'; label?: string; item?: SearchItem; index?: number }> = [];
  protected activeIndex = -1;
  protected searchLoading = false;
  protected status$;
  private readonly searchInput$ = new Subject<string>();

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

  constructor(
    private readonly searchService: SearchService,
    private readonly router: Router,
    private readonly statusService: StatusService,
    private readonly healthService: HealthService
  ) {
    this.status$ = this.statusService.status$;
  }

  ngOnInit(): void {
    this.healthService
      .getHealth()
      .pipe(
        take(1),
        catchError(() => of({ status: 'DOWN' }))
      )
      .subscribe((status) => {
        if (status.status !== 'UP') {
          this.statusService.showWarning(
            'Hinweis: Server ist gerade nicht erreichbar. Einige Inhalte sind evtl. nicht aktuell.'
          );
        }
      });

    this.searchInput$
      .pipe(debounceTime(250), distinctUntilChanged())
      .subscribe((query) => {
        if (!query.trim()) {
          this.searchResults = [];
          this.searchOpen.set(false);
          this.searchRows = [];
          this.activeIndex = -1;
          return;
        }
        this.searchResults = this.searchService.search(query);
        this.refreshRows();
        this.searchOpen.set(this.searchResults.length > 0 || this.searchLoading);
      });

    this.searchService.loading$().subscribe((loading) => {
      this.searchLoading = loading;
      if (!loading && this.searchQuery.trim()) {
        this.searchResults = this.searchService.search(this.searchQuery);
        this.refreshRows();
        this.searchOpen.set(this.searchResults.length > 0);
      }
    });
  }

  protected toggleMobile(): void {
    this.mobileOpen.update((open) => !open);
  }

  protected closeMobile(): void {
    this.mobileOpen.set(false);
  }

  protected toggleDesktop(label: string, event?: Event): void {
    event?.stopPropagation();
    this.desktopOpen.update((current) => (current === label ? null : label));
  }

  protected closeDesktop(): void {
    this.desktopOpen.set(null);
  }

  protected toggleGroup(label: string): void {
    this.mobileGroupOpen.update((current) => (current === label ? null : label));
  }

  protected onSearchInput(value: string): void {
    this.searchQuery = value;
    this.searchService.ensureLoaded();
    this.searchLoading = this.searchService.getLoading();
    if (!value.trim()) {
      this.searchResults = [];
      this.searchOpen.set(false);
      this.searchRows = [];
      this.activeIndex = -1;
      return;
    }
    this.searchOpen.set(true);
    this.searchInput$.next(value);
  }

  protected selectResult(result: SearchItem): void {
    this.searchOpen.set(false);
    this.searchQuery = '';
    this.searchResults = [];
    this.searchRows = [];
    this.activeIndex = -1;

    this.router.navigate(result.route);
    this.closeMobile();
    this.closeDesktop();
  }

  protected closeSearch(): void {
    this.searchOpen.set(false);
  }

  protected dismissStatus(): void {
    this.statusService.clear();
  }

  protected handleStatusAction(actionId: string): void {
    if (actionId === 'reload') {
      window.location.reload();
    }
    if (actionId === 'retry') {
      window.location.reload();
    }
  }

  protected handleSearchKey(event: KeyboardEvent): void {
    if (!this.searchOpen()) {
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.activeIndex < this.getSelectableCount() - 1) {
        this.activeIndex += 1;
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.activeIndex > 0) {
        this.activeIndex -= 1;
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const item = this.getActiveItem();
      if (item) {
        this.selectResult(item);
      }
    } else if (event.key === 'Escape') {
      this.closeSearch();
    }
  }

  protected setActive(index: number | undefined): void {
    if (index === undefined) {
      return;
    }
    this.activeIndex = index;
  }

  protected handleDropdownKey(label: string, event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleDesktop(label, event);
    } else if (event.key === 'Escape') {
      this.closeDesktop();
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeDesktop();
    this.closeSearch();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeDesktop();
    this.closeSearch();
  }

  private refreshRows(): void {
    const order: Array<{ type: SearchItem['type']; label: string }> = [
      { type: 'page', label: 'Seiten' },
      { type: 'news', label: 'Aktuelles' },
      { type: 'notice', label: 'Aushaenge' },
      { type: 'document', label: 'Dokumente' },
      { type: 'board', label: 'Vorstand' },
      { type: 'rental', label: 'Verleih' },
      { type: 'garden', label: 'Freie Gaerten' },
      { type: 'event', label: 'Vereinsleben' },
      { type: 'clubhouse', label: 'Vereinshaus' }
    ];

    const rows: Array<{ kind: 'header' | 'item'; label?: string; item?: SearchItem; index?: number }> = [];
    let idx = 0;

    order.forEach((group) => {
      const items = this.searchResults.filter((item) => item.type === group.type);
      if (items.length === 0) {
        return;
      }
      rows.push({ kind: 'header', label: group.label });
      items.forEach((item) => {
        rows.push({ kind: 'item', item, index: idx });
        idx += 1;
      });
    });

    this.searchRows = rows;
    this.activeIndex = idx > 0 ? 0 : -1;
  }

  private getSelectableCount(): number {
    return this.searchRows.filter((row) => row.kind === 'item').length;
  }

  private getActiveItem(): SearchItem | null {
    let idx = 0;
    for (const row of this.searchRows) {
      if (row.kind === 'item' && row.item) {
        if (idx === this.activeIndex) {
          return row.item;
        }
        idx += 1;
      }
    }
    return null;
  }
}

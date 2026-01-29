import { TestBed } from '@angular/core/testing';
import { StatusBannerComponent } from './status-banner.component';

describe('StatusBannerComponent', () => {
  it('renders message and emits dismiss', async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBannerComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(StatusBannerComponent);
    const component = fixture.componentInstance;
    component.status = {
      type: 'error',
      message: 'Die Verbindung klappt gerade nicht.',
      actions: []
    };

    const dismissSpy = vi.fn();
    component.dismiss.subscribe(dismissSpy);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Die Verbindung klappt gerade nicht.');

    const button = compiled.querySelector('button[aria-label="Schliessen"]') as HTMLButtonElement | null;
    expect(button).toBeTruthy();
    button?.click();

    expect(dismissSpy).toHaveBeenCalledTimes(1);
  });
});

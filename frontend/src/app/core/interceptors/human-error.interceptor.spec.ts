import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { humanErrorInterceptor } from './human-error.interceptor';
import { StatusService } from '../services/status.service';

describe('humanErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let statusService: { show: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    statusService = { show: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([humanErrorInterceptor])),
        provideHttpClientTesting(),
        { provide: StatusService, useValue: statusService }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('shows offline message on network error', () => {
    http.get('/api/test').subscribe({
      error: () => {}
    });

    const req = httpMock.expectOne('/api/test');
    req.error(new ProgressEvent('error'));

    expect(statusService.show).toHaveBeenCalledWith(
      'error',
      'Die Verbindung klappt gerade nicht. Bitte spaeter noch einmal versuchen.',
      undefined
    );
  });

  it('shows login hint on 401', () => {
    http.post('/api/test', {}).subscribe({
      error: () => {}
    });

    const req = httpMock.expectOne('/api/test');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(statusService.show).toHaveBeenCalledWith(
      'error',
      'Bitte anmelden, um Aenderungen zu speichern.',
      [{ label: 'Erneut versuchen', actionId: 'retry' }]
    );
  });
});

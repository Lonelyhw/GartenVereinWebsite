import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { StatusService } from '../services/status.service';

const WRITE_METHODS = new Set(['POST', 'PUT', 'DELETE']);

export const humanErrorInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api/')) {
    return next(req);
  }

  const statusService = inject(StatusService);

  return next(req).pipe(
    catchError((error) => {
      const status = error?.status ?? 0;
      let message = '';

      if (status === 0) {
        message = 'Die Verbindung klappt gerade nicht. Bitte spaeter noch einmal versuchen.';
      } else if (status === 401 || status === 403) {
        message = 'Bitte anmelden, um Aenderungen zu speichern.';
      } else if (status === 404) {
        message = 'Diese Information wurde nicht gefunden.';
      } else if (status >= 500) {
        message = 'Auf dem Server ist etwas schiefgelaufen. Bitte spaeter nochmal versuchen.';
      }

      if (message) {
        const actions = WRITE_METHODS.has(req.method.toUpperCase())
          ? [{ label: 'Erneut versuchen', actionId: 'retry' }]
          : undefined;
        statusService.show('error', message, actions);
      }

      return throwError(() => error);
    })
  );
};
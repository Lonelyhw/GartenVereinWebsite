import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AdminAuthService } from '../services/admin-auth.service';

const WRITE_METHODS = new Set(['POST', 'PUT', 'DELETE']);

export const basicAuthInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api/')) {
    return next(req);
  }

  if (!WRITE_METHODS.has(req.method.toUpperCase())) {
    return next(req);
  }

  const authService = inject(AdminAuthService);
  if (!authService.hasCredentials()) {
    return next(req);
  }

  const authHeader = authService.getAuthHeader();
  if (!authHeader) {
    return next(req);
  }

  return next(req.clone({
    setHeaders: {
      Authorization: authHeader
    }
  }));
};
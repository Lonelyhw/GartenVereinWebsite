import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { basicAuthInterceptor } from './core/interceptors/basic-auth.interceptor';
import { humanErrorInterceptor } from './core/interceptors/human-error.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([humanErrorInterceptor, basicAuthInterceptor]))
  ]
};

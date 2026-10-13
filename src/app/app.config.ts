import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAuth } from './auth/auth.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter([
      {
        path: 'login',
        loadComponent: () => import('./auth/login').then((m) => m.Login),
      },
      ...routes,
    ]),
    provideAuth(),
  ],
};

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAuth } from './auth/auth.provider';
import { provideState, provideStore } from '@ngrx/store';
import { isDevMode } from '@angular/core';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { cartFeatureKey, cartReducer } from '@thydda/movies-cart';

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
    provideStore(),
    ...(isDevMode() ? [provideStoreDevtools({ maxAge: 25 })] : []),
    provideState({ name: cartFeatureKey, reducer: cartReducer }),
  ],
};

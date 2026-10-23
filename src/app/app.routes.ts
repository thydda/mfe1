import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'movies',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    loadChildren: () => import('./features/movies/movies.routes').then((m) => m.routes),
  },
];

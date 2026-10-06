import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'movies',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./features/movies/list/movies-list').then((m) => m.MoviesList),
      },
      {
        path: 'edit',
        loadComponent: () => import('./features/movies/edit/movie-edit').then((m) => m.MovieEdit),
      },
    ],
  },
];

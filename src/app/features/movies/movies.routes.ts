import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./list/movies-list').then((m) => m.MoviesList),
      },
      {
        path: 'edit',
        loadComponent: () => import('./edit/movie-edit').then((m) => m.MovieEdit),
      },
    ],
  },
];

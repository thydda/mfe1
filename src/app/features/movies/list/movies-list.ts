import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  inject,
  signal,
  type OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { defineMovieSearch, type Movie } from '@thydda/web-components';
import { MoviesService } from '../movies.service';
defineMovieSearch();

@Component({
  selector: 'app-movies-list',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <header class="app-page-heading">
      <p class="app-eyebrow">The collection</p>
      <h1>{{ title() }}</h1>
      <p class="app-description">Browse the posters or search by title, director and story.</p>
    </header>
    @if (loadError()) {
      <p class="alert alert-danger" role="alert">{{ loadError() }}</p>
    }
    <movie-search
      [movies]="movies()"
      [placeholder]="searchPlaceholder()"
      [label]="searchLabel()"
    ></movie-search>
  `,
  styles: `
    :host {
      display: block;
      min-inline-size: 0;
    }
  `,
})
export class MoviesList implements OnInit {
  private readonly moviesService = inject(MoviesService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly title = signal('Movies');
  protected readonly movies = signal<Movie[]>([]);
  protected readonly searchPlaceholder = signal('Search movies by title, director or story…');
  protected readonly searchLabel = signal('Search the movie collection');
  protected readonly loadError = signal<string | null>(null);

  ngOnInit(): void {
    this.moviesService
      .getMovies()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (movies) => this.movies.set(movies),
        error: () => this.loadError.set('Unable to load movies.'),
      });
  }
}

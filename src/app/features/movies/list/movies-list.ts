import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  inject,
  signal,
  type OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  defineMovieSearch,
  MovieSearchSelectEventDetail,
  type Movie,
} from '@thydda/web-components';
import { MoviesService } from '../movies.service';
import { AUTH_SERVICE, type AuthService } from '@thydda/auth-contracts';
import { Store } from '@ngrx/store';
import { cartActions, cartSelectors } from '@thydda/movies-cart';
defineMovieSearch();

@Component({
  selector: 'app-movies-list',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <header class="app-page-heading">
      <p class="app-eyebrow">The collection</p>
      <h1>{{ title() }}</h1>
      <p class="app-description">Browse the posters or search by title, director and story.</p>
      <p class="session-status" role="status">
        @if (auth.user(); as user) {
          Movies session: signed in as {{ user.name }}.
        } @else {
          Movies session: signed out.
        }
      </p>
    </header>
    @if (loadError()) {
      <p class="alert alert-danger" role="alert">{{ loadError() }}</p>
    }
    <movie-search
      [movies]="movies()"
      [placeholder]="searchPlaceholder()"
      [label]="searchLabel()"
      [selectedMovieIds]="selectedMovieIds()"
      (movie-search-select)="onMovieSelected($event)"
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
  private readonly store = inject(Store);
  protected readonly auth: AuthService = inject<AuthService>(AUTH_SERVICE);
  private readonly moviesService = inject(MoviesService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly title = signal('Movies');
  protected readonly movies = signal<Movie[]>([]);
  protected readonly searchPlaceholder = signal('Search movies by title, director or story…');
  protected readonly searchLabel = signal('Search the movie collection');
  protected readonly loadError = signal<string | null>(null);
  protected readonly selectedMovieIds = this.store.selectSignal(cartSelectors.selectItemIds);

  ngOnInit(): void {
    this.moviesService
      .getMovies()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (movies) => this.movies.set(movies),
        error: () => this.loadError.set('Unable to load movies.'),
      });
  }

  onMovieSelected(event: Event): void {
    const detail = (event as CustomEvent<MovieSearchSelectEventDetail>).detail;
    const { movie, selected } = detail;
    console.log(movie, selected);
    if (selected) {
      this.store.dispatch(cartActions.itemAdded({ item: movie }));
    } else {
      this.store.dispatch(cartActions.itemRemoved({ itemId: movie.id }));
    }
  }
}

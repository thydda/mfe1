import { Service } from '@angular/core';
import type { Movie } from '@thydda/web-components';
import { defer, type Observable } from 'rxjs';
import type { CreateMovie } from './edit/create-movie.model';
import { MOVIES_MOCKED } from './movies-mocked';

/** Mock server: data persists in memory until the application reloads. */
@Service()
export class MoviesService {
  private movies: Movie[] = MOVIES_MOCKED.map((movie) => ({ ...movie }));
  private nextId = Math.max(0, ...this.movies.map((movie) => movie.id)) + 1;

  /** GET /movies. Returns a snapshot, never the mutable server storage. */
  getMovies(): Observable<Movie[]> {
    return this.request(() => this.movies.map((movie) => ({ ...movie })));
  }

  /** POST /movies. The server assigns a new, non-reused identity. */
  postMovie(movie: CreateMovie): Observable<Movie> {
    const payload = { ...movie };
    return this.request(() => {
      const created: Movie = { ...payload, id: this.nextId++ };
      this.movies = [...this.movies, created];
      return { ...created };
    });
  }

  /** PUT /movies/:id. Replaces all editable fields and preserves the identity. */
  putMovie(id: number, movie: Movie): Observable<Movie> {
    const payload = { ...movie };
    return this.request(() => {
      const index = this.findIndex(id);
      const updated: Movie = { ...payload, id };
      this.movies = this.movies.map((current, position) =>
        position === index ? updated : current,
      );
      return { ...updated };
    });
  }

  /** DELETE /movies/:id. Missing identities emit an error, as with PUT. */
  removeMovie(id: number): Observable<void> {
    return this.request(() => {
      this.findIndex(id);
      this.movies = this.movies.filter((movie) => movie.id !== id);
    });
  }

  private findIndex(id: number): number {
    const index = this.movies.findIndex((movie) => movie.id === id);
    if (index === -1) {
      throw new Error(`Movie with id ${id} was not found.`);
    }
    return index;
  }

  // Cold and asynchronous like HttpClient: work starts on subscription.
  private request<T>(operation: () => T): Observable<T> {
    return defer(() => Promise.resolve().then(operation));
  }
}

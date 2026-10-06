import { TestBed } from '@angular/core/testing';
import type { MovieSearch } from '@thydda/web-components';
import { Subject } from 'rxjs';
import type { Movie } from '@thydda/web-components';
import { MoviesList } from './movies-list';
import { MoviesService } from '../movies.service';
import { MOVIES_MOCKED } from '../movies-mocked';

describe('MoviesList service integration', () => {
  let response: Subject<Movie[]>;
  let getMovies: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    response = new Subject<Movie[]>();
    getMovies = vi.fn(() => response.asObservable());
    TestBed.configureTestingModule({
      imports: [MoviesList],
      providers: [{ provide: MoviesService, useValue: { getMovies } }],
    });
  });

  it('loads movies once and passes the response into the Web Component', async () => {
    const fixture = TestBed.createComponent(MoviesList);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector<MovieSearch>(
      'movie-search',
    )!;
    expect(element.movies).toEqual([]);
    expect(element.placeholder).toBe('Search movies by title, director or story…');
    expect(element.label).toBe('Search the movie collection');
    response.next([...MOVIES_MOCKED]);
    fixture.detectChanges();
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('input')?.placeholder).toBe(
      'Search movies by title, director or story…',
    );
    expect(element.shadowRoot?.querySelector('label')?.textContent).toBe(
      'Search the movie collection',
    );
    expect(getMovies).toHaveBeenCalledOnce();
    expect(element.movies).toEqual(MOVIES_MOCKED);
    expect(element.shadowRoot?.querySelectorAll('article')).toHaveLength(MOVIES_MOCKED.length);
  });

  it('shows an accessible error if loading fails', () => {
    const fixture = TestBed.createComponent(MoviesList);
    fixture.detectChanges();
    response.error(new Error('Server unavailable'));
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[role="alert"]')?.textContent,
    ).toContain('Unable to load movies.');
  });

  it('releases the request subscription when destroyed', () => {
    const fixture = TestBed.createComponent(MoviesList);
    fixture.detectChanges();
    expect(response.observed).toBe(true);
    fixture.destroy();
    expect(response.observed).toBe(false);
  });
});

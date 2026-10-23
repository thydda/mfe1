import { provideState, provideStore, Store } from '@ngrx/store';
import { cartActions, cartFeatureKey, cartReducer, cartSelectors } from '@thydda/movies-cart';
import { TestBed } from '@angular/core/testing';
import type { MovieSearch } from '@thydda/web-components';
import { Subject } from 'rxjs';
import type { Movie } from '@thydda/web-components';
import { MoviesList } from './movies-list';
import { MoviesService } from '../movies.service';
import { MOVIES_MOCKED } from '../movies-mocked';
import { AUTH_SERVICE } from '@thydda/auth-contracts';
import { provideAuth } from '../../../auth/auth.provider';

describe('MoviesList service integration', () => {
  let response: Subject<Movie[]>;
  let getMovies: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    response = new Subject<Movie[]>();
    getMovies = vi.fn(() => response.asObservable());
    TestBed.configureTestingModule({
      imports: [MoviesList],
      providers: [
        { provide: MoviesService, useValue: { getMovies } },
        provideStore(),
        provideState({ name: cartFeatureKey, reducer: cartReducer }),
        provideAuth(),
      ],
    });
  });

  it('observes login, user changes and logout from the injected session', async () => {
    const fixture = TestBed.createComponent(MoviesList);
    await fixture.whenStable();
    const auth = TestBed.inject(AUTH_SERVICE);
    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('.session-status')?.textContent).toContain('signed out');
    auth.login('Ana');
    await fixture.whenStable();
    expect(page.querySelector('.session-status')?.textContent).toContain('Ana');
    auth.login('Luis');
    await fixture.whenStable();
    expect(page.querySelector('.session-status')?.textContent).toContain('Luis');
    auth.logout();
    await fixture.whenStable();
    expect(page.querySelector('.session-status')?.textContent).toContain('signed out');
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

  it.each([true, false])('handles movie-search-select with selected=%s', async (selected) => {
    const store = TestBed.inject(Store);
    if (!selected) {
      store.dispatch(cartActions.itemAdded({ item: MOVIES_MOCKED[0] }));
    }
    const dispatch = vi.spyOn(store, 'dispatch');
    const fixture = TestBed.createComponent(MoviesList);
    fixture.detectChanges();
    response.next([MOVIES_MOCKED[0]]);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector<MovieSearch>(
      'movie-search',
    )!;
    expect(element.selectedMovieIds).toEqual(selected ? [] : [MOVIES_MOCKED[0].id]);
    await element.updateComplete;
    const button = element.shadowRoot?.querySelector('button');
    expect(button).not.toBeNull();
    button?.click();
    expect(dispatch).toHaveBeenCalledOnce();
    expect(dispatch.mock.calls[0][0]).toMatchObject(
      selected
        ? cartActions.itemAdded({ item: MOVIES_MOCKED[0] })
        : cartActions.itemRemoved({ itemId: MOVIES_MOCKED[0].id }),
    );
    await fixture.whenStable();
    await element.updateComplete;
    expect(element.selectedMovieIds).toEqual(selected ? [MOVIES_MOCKED[0].id] : []);
    expect(button?.getAttribute('aria-pressed')).toBe(String(selected));
    expect(store.selectSignal(cartSelectors.selectItems)()).toEqual(
      selected ? [MOVIES_MOCKED[0]] : [],
    );
    expect(MOVIES_MOCKED[0]).not.toHaveProperty('selected');
  });

  it('reflects external cart changes without altering the movie collection', async () => {
    const fixture = TestBed.createComponent(MoviesList);
    fixture.detectChanges();
    response.next([...MOVIES_MOCKED]);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector<MovieSearch>(
      'movie-search',
    )!;
    await element.updateComplete;
    const store = TestBed.inject(Store);
    store.dispatch(cartActions.itemAdded({ item: MOVIES_MOCKED[1] }));
    await fixture.whenStable();
    await element.updateComplete;
    expect(element.selectedMovieIds).toEqual([MOVIES_MOCKED[1].id]);
    expect(element.shadowRoot?.querySelectorAll('button')[1].getAttribute('aria-pressed')).toBe(
      'true',
    );
    store.dispatch(cartActions.itemRemoved({ itemId: MOVIES_MOCKED[1].id }));
    await fixture.whenStable();
    await element.updateComplete;
    expect(element.selectedMovieIds).toEqual([]);
    expect(element.movies).toEqual(MOVIES_MOCKED);
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

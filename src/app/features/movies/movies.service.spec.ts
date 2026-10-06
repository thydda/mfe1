import type { Movie } from '@thydda/web-components';
import type { CreateMovie } from './edit/create-movie.model';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { MoviesService } from './movies.service';
import { MOVIES_MOCKED } from './movies-mocked';

function createPayload({ id: _id, ...fields }: Movie): CreateMovie {
  return fields;
}

describe('MoviesService mock CRUD', () => {
  let service: MoviesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoviesService);
  });

  it('loads the server seed with unique identities', async () => {
    const movies = await firstValueFrom(service.getMovies());
    expect(movies).toEqual(MOVIES_MOCKED);
    expect(new Set(movies.map((movie) => movie.id)).size).toBe(movies.length);
  });

  it('creates, replaces and removes a movie', async () => {
    const initial = await firstValueFrom(service.getMovies());
    const created = await firstValueFrom(
      service.postMovie({ ...createPayload(initial[0]), title: 'New movie' }),
    );
    expect(created.id).toBeGreaterThan(Math.max(...initial.map((movie) => movie.id)));
    expect(await firstValueFrom(service.getMovies())).toContainEqual(created);

    const updated = await firstValueFrom(
      service.putMovie(created.id, { ...created, title: 'Updated movie' }),
    );
    expect(updated.id).toBe(created.id);
    expect(updated.title).toBe('Updated movie');
    expect(await firstValueFrom(service.getMovies())).toContainEqual(updated);

    await firstValueFrom(service.removeMovie(created.id));
    expect(await firstValueFrom(service.getMovies())).toEqual(initial);
    const next = await firstValueFrom(service.postMovie(createPayload(initial[0])));
    expect(next.id).toBeGreaterThan(created.id);
  });

  it('does not expose mutable server state through results or payloads', async () => {
    const movies = await firstValueFrom(service.getMovies());
    movies[0].title = 'Changed locally';
    movies.pop();
    expect(await firstValueFrom(service.getMovies())).toEqual(MOVIES_MOCKED);

    const payload = createPayload(MOVIES_MOCKED[0]);
    expect(payload).not.toHaveProperty('id');
    const created = await firstValueFrom(service.postMovie(payload));
    payload.title = 'Changed payload';
    created.title = 'Changed response';
    const stored = (await firstValueFrom(service.getMovies())).find(
      (movie) => movie.id === created.id,
    );
    expect(stored?.title).toBe(MOVIES_MOCKED[0].title);
  });

  it('starts writes only on subscription and emits asynchronously', async () => {
    const request = service.postMovie(createPayload(MOVIES_MOCKED[0]));
    expect(await firstValueFrom(service.getMovies())).toEqual(MOVIES_MOCKED);
    let emitted = false;
    const completion = firstValueFrom(request).then(() => {
      emitted = true;
    });
    expect(emitted).toBe(false);
    await completion;
    expect((await firstValueFrom(service.getMovies())).length).toBe(MOVIES_MOCKED.length + 1);
  });

  it('rejects updates and removals of missing movies without changing data', async () => {
    await expect(firstValueFrom(service.putMovie(-1, MOVIES_MOCKED[0]))).rejects.toThrow(
      'not found',
    );
    await expect(firstValueFrom(service.removeMovie(-1))).rejects.toThrow('not found');
    expect(await firstValueFrom(service.getMovies())).toEqual(MOVIES_MOCKED);
  });

  it('keeps the seed unchanged across service instances', async () => {
    await firstValueFrom(service.removeMovie(MOVIES_MOCKED[0].id));
    const fresh = new MoviesService();
    expect(await firstValueFrom(fresh.getMovies())).toEqual(MOVIES_MOCKED);
  });
});

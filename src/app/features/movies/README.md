# Movies mock API

`@thydda/web-components` is included in the `mfe1` bundles. It is listed in `skip`
in `federation.config.mjs` because it is not shared with the shell, so it does not
depend on an external `_thydda_web_components.*.js` file advertised by federation.

`MoviesService` simulates an in-memory server initialized with `MOVIES_MOCKED` from
`movies-mocked.ts`. It uses `Movie` re-exported by `@thydda/web-components` from
`@thydda/movies-contracts`, which includes the
numeric mock-assigned `id`. `CreateMovie` uses `Omit<Movie, 'id'>` for POST requests.

| Method                | Input                         | Observable response   |
| --------------------- | ----------------------------- | --------------------- |
| `getMovies()`         | —                             | `Movie[]`             |
| `postMovie(movie)`    | `CreateMovie` (without an ID) | `Movie` with a new ID |
| `putMovie(id, movie)` | ID and all `Movie` fields     | Updated `Movie`       |
| `removeMovie(id)`     | ID                            | `void`                |

Inject the service with `inject(MoviesService)` and subscribe to the Observable,
or use `firstValueFrom`, to execute the operation. Each subscription represents
a new request. Responses are asynchronous, and PUT/DELETE operations emit an error
if the ID does not exist. PUT replaces all fields rather than applying a patch.

Changes persist between requests to the same service instance, but reset when
the application reloads. There are no HTTP requests or writes to the data file.
Responses are copies to prevent accidental changes to server state. `MoviesList`
calls `getMovies()` on initialization, stores the response in the `movies` signal
and passes it to `<movie-search>` through `[movies]="movies()"`. It cancels the
subscription on destruction and shows an accessible message if loading fails.

The list listens to `(movie-search-select)` in its Angular template. The event's
`selected` field requests adding or removing the movie through the cart actions.
Both library events use hyphens (`movie-search-select`, `movie-search-results`)
so Angular does not interpret their names as global event targets.

The shared `@thydda/movies-cart` reducer owns cart membership. The list dispatches
`cartActions.itemAdded({ item: movie })` or `itemRemoved({ itemId: movie.id })`
and binds `cartSelectors.selectItemIds` to `[selectedMovieIds]` through a Store
signal. Movie objects carry no UI-only selection property. The standalone app
registers the cart at startup; hosted execution relies on the shell registration.

The signal stores the GET response; POST, PUT and DELETE do not update it automatically. Refresh the list or introduce shared reactive state when adding editing behavior.

## Screens

- `list/movies-list.ts`: list and search through the `<movie-search>` Web Component,
  available at `/movies` through the child route with an empty path.
- `edit/movie-edit.ts`: a separate screen at `/movies/edit`; currently it only
  displays the `Edit movie` heading.
- `movies.routes.ts` defines the child screens; `app.routes.ts` loads them under the guarded `/movies` route.

The service and mocks stay at the root of `movies/` to be shared between screens.
The creation model is in `edit/create-movie.model.ts`.

Run `npm run test:unit` from `mfe1/` to test the CRUD operations and screens.

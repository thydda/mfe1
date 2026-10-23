# Movies microfrontend (mfe1)

Angular 22 remote using Native Federation. Owns the movies routes, UI and in-memory MoviesService. It consumes the public @thydda/web-components API; no backend microservice is implemented.

## Setup and development

Requires a supported Node.js release compatible with Angular 22 and npm with the
committed lockfile. Packages under `@thydda` are installed from GitHub Packages;
configure `@thydda:registry=https://npm.pkg.github.com` in `.npmrc` and authenticate
with package read access before installing:

```sh
npm login --scope=@thydda --registry=https://npm.pkg.github.com --auth-type=legacy
npm ci
npm start
```

The remote runs independently at http://localhost:4201. Start shell separately on
port 4200 to verify hosted navigation. The application consumes published
`@thydda/web-components@0.2.5` and `@thydda/movies-cart@0.1.1`; editing sibling
library sources does not update installed packages. Publish and install a new
release to consume library changes.

## Architecture and contracts

- federation.config.mjs exposes the Angular routes and shares framework dependencies. @thydda/web-components is skipped from federation sharing and bundled by the remote.
- src/app/app.routes.ts guards /movies and lazy-loads features/movies/movies.routes.ts, which defines the list and edit screens.
- MoviesList registers movie-search, scopes CUSTOM_ELEMENTS_SCHEMA and binds movies, placeholder, label and selectedMovieIds as properties.
- [Movie search API](../web-components/src/components/movie-search/README.md) documents properties and typed events. Use package exports rather than library internals.
- [Movies feature](src/app/features/movies/README.md) documents mock CRUD. A separate signal is a snapshot of GET results and needs deliberate synchronization after mutations.
- [Posters](public/posters/README.md) documents image provenance. Asset URLs must work both independently and when hosted.
- src/styles.css imports Bootstrap and shared application styles once. The Web Component owns its shadow styles.

## Authentication integration

Movies injects `AUTH_SERVICE` from the published `@thydda/auth-contracts` package
and renders its read-only user signal. The hosted routes use the shell's provider;
never provide the token in exposed routes or components, which would shadow the
host session. `app.config.ts` supplies a separate development provider only when
mfe1 bootstraps independently. The mock session is not persisted or used to
authorize movie operations.

Both federation configurations share `@thydda/auth-contracts@0.1.0` as a singleton
so the token has the same identity. After updating the package, restart both
development servers to regenerate federation metadata.

Home, Movies and movie child routes are guarded. When signed out they redirect
to `/login`, preserving the requested URL for navigation after signing in.
Standalone login is registered only in `app.config.ts`, not the exposed routes;
hosted navigation uses the shell login. Signing out removes the protected screen
and redirects to login.

Verify at port 4200: visit `/movies` while signed out, sign in, then sign out from
the shell header. Movies must disappear and login must be shown. Repeat on port
4201 to verify the standalone flow. Also check `/dashboard` and `/movies/edit`.

## Shared movie cart

`MoviesList` consumes actions and selectors from `@thydda/movies-cart@0.1.1`.
`Movie` is the shared `@thydda/movies-contracts@0.1.0` contract, also re-exported by
the Web Component package. Selection is separate from movie data.

The `(movie-search-select)` event carries `{ movie, selected }`. The handler
dispatches `cartActions.itemAdded({ item: movie })` or
`cartActions.itemRemoved({ itemId: movie.id })`. The
`cartSelectors.selectItemIds` selector feeds `[selectedMovieIds]` through
`Store.selectSignal`, so changes from other views also update the selection.

For standalone execution, `app.config.ts` registers `provideStore()` and
`provideState({ name: cartFeatureKey, reducer: cartReducer })`. Movie routes do
not register the feature again. When hosted, the shell must register the same
cart at startup: the remote's `app.config.ts` does not execute. Shell and remote
must use compatible singleton Angular/NgRx packages and matching cart contracts.
The header can consume `cartSelectors.selectCount` from that same Store.

Redux DevTools instrumentation is enabled in development via
`provideStoreDevtools`. Install the Redux DevTools browser extension to inspect
actions and state. Cart data is in memory and resets on reload.

Tests use the real shared reducer to cover selection/deselection, preselected
movies and external cart updates. Run `npm run test:unit` or `npm run check`.
Manually verify the hosted flow: sign in, select/unselect movies, check the header
count and navigate away and back. This is not an automated cross-remote test.

## Validation and local merges

```sh
npm run lint
npm run format:check
npm run test:unit
npm run check
```

`check` runs lint, format checking, unit tests without watch, tests of the merge script in temporary repositories, and a production build; the library also checks TypeScript and requires a test file per component. ESLint uses type-aware TypeScript rules; Angular repositories also lint inline/external templates and template accessibility. Formatting is checked separately with Prettier. Use `npm run format` to apply formatting deliberately.

Complete the applicable review checklist in [best-practices.md](best-practices.md) before merging. Automated checks do not certify architecture, usability or accessibility. Browser integration and keyboard/zoom/screen-reader checks are manual today; there is no automated e2e command.

From a clean `main` branch, after reviewing the feature:

```sh
npm run merge:main -- feature/my-change
```

This only accepts a local branch, prepares a merge with `--no-ff --no-commit`, validates the combined result, and commits locally only if checks pass. It does not push. If checks fail or conflicts occur, the merge stays uncommitted. Resolve and stage intended changes, then run:

```sh
npm run merge:main -- --continue
```

Or abort with `git merge --abort`. Failed commit hooks can also be corrected before continuing. Checks are repeated on every continuation; unstaged/untracked changes prevent completion. There is no CI or server-side merge enforcement. Other Git commands and GitHub can bypass this local flow; a pre-merge hook alone does not cover every merge mode.

When a library contract changes, validate web-components and its mfe1 consumer. When federation or routes change, verify navigation through shell in a browser. Do not merge other repositories automatically as part of a check.

## Agent guidance

Read [AGENTS.md](AGENTS.md), [best-practices.md](best-practices.md) and [angular-frontend](.agents/skills/angular-frontend/SKILL.md). Each repository keeps its own instructions so it can be used independently.

Tooling references: [angular-eslint](https://github.com/angular-eslint/angular-eslint), [type-aware linting](https://typescript-eslint.io/getting-started/typed-linting/) and [Git hooks](https://git-scm.com/docs/githooks).

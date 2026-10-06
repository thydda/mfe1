# Movies microfrontend (mfe1)

Angular 22 remote using Native Federation. Owns the movies routes, UI and in-memory MoviesService. It consumes the public @thydda/web-components API; no backend microservice is implemented.

## Setup and development

Requires a supported Node.js release compatible with Angular 22 and npm with the committed lockfile. Build the local library before installing and starting this application:

```sh
cd ../web-components
npm ci
npm run build
cd ../mfe1
npm ci
npm start
```

The remote runs independently at http://localhost:4201. Start shell separately on port 4200 to verify hosted navigation. The local file dependency consumes the library's built dist output; rebuild it after library changes.

## Architecture and contracts

- federation.config.mjs exposes the Angular routes and shares framework dependencies. @thydda/web-components is skipped from federation sharing and bundled by the remote.
- src/app/app.routes.ts defines /movies with children "" (list/search) and "edit" (currently a heading).
- MoviesList registers movie-search, scopes CUSTOM_ELEMENTS_SCHEMA and binds movies, placeholder and label as properties.
- [Movie search API](../web-components/src/components/movie-search/README.md) documents properties and typed events. Use package exports rather than library internals.
- [Movies feature](src/app/features/movies/README.md) documents mock CRUD. A separate signal is a snapshot of GET results and needs deliberate synchronization after mutations.
- [Posters](public/posters/README.md) documents image provenance. Asset URLs must work both independently and when hosted.
- src/styles.css imports Bootstrap and shared application styles once. The Web Component owns its shadow styles.

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

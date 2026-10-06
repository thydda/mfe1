# Movie posters

20 covers for the movies in `movies-mocked.ts`, downloaded from the images on
their Wikipedia/Wikimedia pages and converted to JPEG. `sources.json` records
the movie, local filename, original image URL and source page.

Angular copies this folder from `public/` into the application's public directory.
The mocks resolve `/posters/...` against `import.meta.url` to use the origin of
`mfe1` when its components are loaded inside the shell as well.

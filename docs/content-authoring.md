# Content Authoring

All content lives in the `content/` directory. The build system automatically discovers new directories and generates pages — no code changes required.

## Adding a trip

1. Create a directory under `content/trips/`. The directory name becomes the URL slug.

   ```
   content/trips/my-trip-name/
   ```

2. Create `info.json`:

   ```json
   {
     "title": "My Trip",
     "short": "A short description shown on the home page."
   }
   ```

3. Create `readme.md` with the page body in Markdown. Use the `<GPX>` tag anywhere you want to embed an interactive map:

   ```markdown
   # My Trip

   Some intro text.

   <GPX src="res/gpx/day1.gpx" />

   Day one notes here.

   <GPX src="res/gpx/day2.gpx" />
   ```

4. Add GPX files at the path referenced in the `<GPX>` tags:

   ```
   content/trips/my-trip-name/res/gpx/day1.gpx
   content/trips/my-trip-name/res/gpx/day2.gpx
   ```

5. The next build generates `/trips/my-trip-name.html` and adds the trip to the home page.

### Before committing content

Run these scripts on the `content/` tree before committing to keep the repo small. Each script is idempotent — already-processed files are skipped.

```bash
./scripts/compress-gpx.sh      # reduce GPX track-point density (requires gpsbabel)
./scripts/compress-photos.sh   # re-encode JPG/PNG/HEIC at lower quality (requires ImageMagick)
./scripts/compress-videos.sh   # re-encode MP4/MOV with H.264 (requires ffmpeg)
./scripts/spell-check.sh       # spell-check all markdown files
```

## Adding a project

1. Create a directory under `content/projects/`:

   ```
   content/projects/my-project/
   ```

2. Create `info.json`:

   ```json
   {
     "title": "My Project",
     "short": "A short description shown on the home page."
   }
   ```

3. Create `readme.md` with the project description in Markdown.

4. Add any images or assets to `res/`:

   ```
   content/projects/my-project/res/cover.jpg
   ```

   Reference them in markdown relative to the content directory:

   ```markdown
   ![Cover](/content/projects/my-project/res/cover.jpg)
   ```

5. The next build generates `/projects/my-project.html`.

### Active vs. archived projects

The home page splits projects into "Active Projects" and "Project Archive." This distinction is currently a hardcoded list in `src/home/link-boxes/link-boxes.ts` — there is no flag in `info.json`. Update that list when a project's status changes.

## `info.json` schema

Both trips and projects use the same base schema:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | yes | Displayed as the page `<h1>` and on the home page |
| `short` | string | yes | Short description for the home page link box |

The schema is validated with Zod at build time. A malformed `info.json` will cause the build to fail with a descriptive error before any HTML is written.

## The `<GPX>` tag

The `<GPX>` tag is only supported in trip `readme.md` files. It is processed at build time and replaced with a Leaflet map div.

```markdown
<GPX src="res/gpx/filename.gpx" />
```

- `src` is relative to the trip's content directory.
- The rendered map loads the GPX file over HTTP from `/content/trips/{slug}/res/gpx/filename.gpx`.
- Maps are interactive: pan, zoom, and display a track with start/end markers.
- If a GPX file is missing at runtime, the map div renders but the track does not load (no build error).

## Static asset paths

All files under `content/` are copied to `html-output/content/` at build time and served at the corresponding path. Reference them in markdown or HTML using the absolute path from the site root:

```
content/trips/my-trip/res/photo.jpg  →  /content/trips/my-trip/res/photo.jpg
```

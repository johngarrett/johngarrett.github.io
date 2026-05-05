# Build & Deploy

## Prerequisites

- [Bun](https://bun.sh) (any recent version)
- `gpsbabel` — optional; only needed for `compress-gpx.sh`
- `convert` / `identify` (ImageMagick) — optional; only needed for `compress-photos.sh`
- `ffmpeg` / `ffprobe` — optional; only needed for `compress-videos.sh`

## Local setup

```bash
bun install
```

## Scripts

| Command | What it does |
|---------|-------------|
| `bun run dev` | Starts file watcher + local HTTP server concurrently |
| `bun run build` | Typecheck → compile → render → write `html-output/` |
| `bun run watch` | File watcher only (rebuilds on changes; no server) |
| `bun run serve` | Serves `html-output/` on port 3000 |
| `bun run typecheck` | TypeScript type check without emitting output |

### Development workflow

```bash
bun run dev
# open http://localhost:3000
```

The watcher (`bun --watch src/main.ts`) rebuilds the entire site whenever any source file changes. The `serve` process hosts `html-output/` statically. Hot module reloading is not configured — refresh the browser after each rebuild.

## Build pipeline

`bun run build` executes the following in sequence:

```
bun run typecheck
  └── tsc --noEmit
        Fails fast on type errors before any output is written.

bun src/main.ts
  ├── Bun.build(src/trips/script.ts)
  │     Bundles Leaflet + leaflet-gpx → html-output/compiled-js/trips/script.js
  │
  ├── fetchContent()
  │     Reads content/projects/** and content/trips/**
  │     Validates each info.json with Zod
  │     Parses readme.md into MarkdownString
  │
  ├── Collect Renderables
  │     homePage()
  │     projectPages()
  │     tripPages()
  │     stylesheet()
  │
  ├── build(renderables)
  │     Calls render() on each Renderable
  │     Writes HTML/CSS to html-output/ (parallel)
  │
  └── Copy content/ → html-output/content/
        Static assets (GPX, images) available at runtime
```

## Output structure

```
html-output/
├── index.html
├── styles.css
├── projects/
│   └── {slug}.html
├── trips/
│   └── {slug}.html
├── compiled-js/
│   └── trips/
│       └── script.js       # Leaflet bundle (browser)
└── content/                # Copied verbatim from content/
    ├── misc/
    ├── projects/
    └── trips/
```

`html-output/` is git-ignored and fully regenerated on every build. Do not edit files there directly.

## Deployment

The site deploys automatically to **GitHub Pages** on every push to `main`.

### CI/CD pipeline (`.github/workflows/pages.yml`)

```
push to main
  └── actions/checkout
        └── oven-sh/setup-bun (latest)
              └── bun install
                    └── bun run build
                          └── upload html-output/ as Pages artifact
                                └── deploy to GitHub Pages
```

Manual deploys can be triggered from the Actions tab in GitHub ("Run workflow").

### Deployment target

The deployed URL is configured in the repository's GitHub Pages settings. The build output is self-contained static HTML — there is no server, no database, no environment variables required at runtime.

## TypeScript configuration

`tsconfig.json` notable settings:

| Setting | Value | Why |
|---------|-------|-----|
| `strict` | `true` | All strict checks enabled |
| `module` | `"preserve"` | Delegates module format decisions to Bun |
| `moduleResolution` | `"bundler"` | Matches Bun's resolution behavior |
| `noEmit` | `true` | Bun handles compilation; tsc is type-check only |

## Maintenance scripts

These scripts live in `scripts/` and operate on the `content/` directory. All of them are idempotent: each processed file gets a hidden marker (e.g. `.photo.jpg.compressed`) so re-running the script skips already-processed files.

| Script | What it does | Requires |
|--------|-------------|----------|
| `./scripts/compress-photos.sh` | Re-encodes JPG/PNG/HEIC files at lower quality in-place | ImageMagick |
| `./scripts/compress-videos.sh` | Re-encodes MP4/MOV files with H.264 + AAC in-place | ffmpeg |
| `./scripts/compress-gpx.sh` | Reduces GPX track-point density with gpsbabel in-place | gpsbabel |
| `./scripts/spell-check.sh` | Spell-checks all `content/**/*.md` and `readme.md` | bun |

Run all three compression scripts before committing large media assets. Spell-check is fast and worth running before any content commit.

## Adding a new page type

1. Create a new module under `src/` (e.g., `src/gallery/gallery-pages.ts`)
2. Export a function that returns `Renderable[]`
3. Call that function in `src/main.ts` and include the results in the `build()` call
4. Add any browser-side JavaScript to a new script file and bundle it via `Bun.build()` in `main.ts`

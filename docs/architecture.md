# Architecture

## Overview

The site is a purpose-built static site generator. At build time, TypeScript code reads structured content from `content/`, renders it to HTML strings, and writes the result to `html-output/`. The deployed artifact is entirely static — the only browser-side JavaScript is the Leaflet map loader for trip pages.

```
┌─────────────────────────────────────────────────────────┐
│                        Build time                        │
│                                                          │
│  content/          src/              html-output/        │
│  ├── trips/   →   main.ts       →   ├── index.html      │
│  ├── projects/     ├── home/         ├── trips/*.html    │
│  └── misc/         ├── projects/     ├── projects/*.html │
│                    ├── trips/        ├── styles.css      │
│                    ├── styles/       ├── compiled-js/    │
│                    └── utils/        └── content/        │
│                                          (copied assets) │
└─────────────────────────────────────────────────────────┘

┌───────────────────────────────┐
│          Runtime (browser)    │
│                               │
│  Leaflet + leaflet-gpx only   │
│  (trips pages with GPX maps)  │
└───────────────────────────────┘
```

## Core abstractions

### `Renderable`

Every page and asset is represented as a `Renderable`:

```typescript
type Renderable = {
  path: string;           // output path relative to html-output/
  render: () => HTMLString;
}
```

`render()` is a lazy function — it is only called when the build writes the file. This keeps page construction pure (no side effects) and makes it trivial to add new page types: return a `Renderable` from wherever makes sense and pass it to `build()`.

### `HTMLString`

A branded string type (`HTMLString`) distinguishes trusted HTML from raw strings. The `html` tagged template literal produces `HTMLString` and is used throughout the component functions:

```typescript
const html = (strings: TemplateStringsArray, ...values: unknown[]): HTMLString
```

This is a lightweight safety convention — it does not do XSS escaping, but it signals intent and prevents accidentally interpolating raw data.

### `Content`

Each content directory (trip or project) is loaded into a `Content` object:

```typescript
type Content = {
  info: ContentInfo;      // validated fields from info.json
  body: MarkdownString;   // raw markdown from readme.md
  filename: string;       // directory name, becomes the URL slug
}

type ContentInfo = {
  title: string;
  short: string;          // used on the home page link boxes
  // trips only:
  mapResources?: string[];
}
```

`info.json` is validated with Zod at build time so schema errors are caught before deployment.

## Build entry point: `src/main.ts`

The build runs in three stages:

**1. Bundle client script**

```
Bun.build(src/trips/script.ts) → html-output/compiled-js/trips/script.js
```

Bun bundles Leaflet and leaflet-gpx from `node_modules` into a single ESM file for the browser. This runs with `target: "browser"`.

**2. Fetch all content**

`fetchContent()` walks `content/projects/` and `content/trips/`, reads each subdirectory's `info.json` and `readme.md`, validates with Zod, and returns arrays of `Content`.

**3. Render and write**

All `Renderable` objects are collected — home page, project pages, trip pages, stylesheet — and written in parallel with `build()`. The `content/` directory is also copied wholesale into `html-output/content/` so static assets (GPX files, images) are available at the deployed paths.

## Page rendering

### Home page (`src/home/`)

Reads all content and renders three link-box sections: Active Projects, Trips, and Project Archive. The distinction between active and archived projects comes from a hardcoded list in `link-boxes.ts` — there is no flag in `info.json` for this today.

### Project pages (`src/projects/`)

One HTML file per directory under `content/projects/`. The markdown body is converted to HTML with `marked`. No browser-side JavaScript.

### Trip pages (`src/trips/`)

Similar to project pages, with one addition: custom `<GPX>` tag support.

**Custom `<GPX>` tag flow:**

In `readme.md`:
```markdown
<GPX src="res/gpx/day1.gpx" />
```

At build time (`trip-pages.ts`), the Marked renderer intercepts the raw HTML block and transforms it:
```html
<div class="gpx-map" data-src="/content/trips/trip-name/res/gpx/day1.gpx"></div>
```

At runtime (`script.ts`), the compiled browser script finds every `.gpx-map` div, initializes a Leaflet map with OpenStreetMap tiles, and renders the GPX track via `leaflet-gpx`. A start/end icon is drawn at the track endpoints.

This keeps authoring simple (one tag, no JSON config) while keeping the heavy map library out of the build pipeline and in the browser.

## Content structure

```
content/
├── misc/                       # One-off assets referenced from the home page
├── projects/
│   └── {slug}/
│       ├── info.json           # { title, short }
│       ├── readme.md           # Page body (markdown)
│       └── res/                # Images, other assets
└── trips/
    └── {slug}/
        ├── info.json           # { title, short }
        ├── readme.md           # Page body; supports <GPX src="..." />
        └── res/
            └── gpx/            # GPX track files
```

The directory name (`{slug}`) becomes the URL path: `content/trips/death-valley-2026/` → `/trips/death-valley-2026.html`.

## Styling

One global stylesheet at `src/styles/styles.css`. It is read at build time, emitted as `html-output/styles.css`, and referenced from every page's `<head>`. No CSS framework, no preprocessor.

## Dependencies (runtime)

| Package | Used for |
|---------|----------|
| `leaflet` | Interactive map rendering (browser only) |
| `leaflet-gpx` | GPX track rendering on Leaflet maps (browser only) |

## Dependencies (build time)

| Package | Used for |
|---------|----------|
| `marked` | Markdown → HTML |
| `gray-matter` | Not used directly (content loading is manual) |
| `zod` | `info.json` schema validation |
| `concurrently` | Parallel watcher processes in dev |
| `serve` | Local HTTP server for dev |

## What this architecture is not

- It is not a framework (no Astro, Next.js, Eleventy). All rendering logic lives in `src/`.
- It is not reactive. There is no state management, no virtual DOM.
- It does not support server-side rendering at runtime. The deployed site is 100% static files.
- It does not have a plugin system. Adding new page types means adding new TypeScript modules in `src/`.

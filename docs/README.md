# Developer Documentation

This is a personal portfolio and travel documentation site — a content-driven static site generator written in TypeScript, built with Bun, and deployed to GitHub Pages.

## Documents

| Doc | What it covers |
|-----|----------------|
| [Architecture](./architecture.md) | System design, component model, data flow, key abstractions |
| [Content Authoring](./content-authoring.md) | How to add projects and trips (the day-to-day workflow) |
| [Build & Deploy](./build-deploy.md) | Build pipeline, scripts, CI/CD, local dev setup |

## Quick orientation

The site is a **build-time static site generator**: TypeScript functions read markdown files from `content/`, render them to HTML strings, and write them to `html-output/`. There is no server-side rendering at runtime.

```
content/         ← your markdown, images, GPX files (source of truth)
src/             ← TypeScript that reads content and generates HTML
html-output/     ← build artifact (git-ignored; deployed to GitHub Pages)
```

The only runtime JavaScript in the browser is the Leaflet map loader for trip pages.

import { Marked } from "marked";
import { htmlPage } from "../components";
import type { Renderable } from "../utils";
import type { Content } from "../content";

type TripPageOptions = {
  scripts?: string[];
  styleLinks?: string[];
};

// Creates one HTML page per trip. A fresh Marked instance is created per trip
// so the GPX renderer can resolve relative paths against that trip's content directory.
export const TripPages = (trips: Content[], options?: TripPageOptions): Renderable[] => {
  return trips.map((trip) => {
    // Per-trip Marked instance so the html renderer closes over `trip.filename`.
    const marked = new Marked({
      renderer: {
        // Intercepts <GPX src="..." /> tags in markdown and converts them to
        // .gpx-map divs. script.ts picks these up at runtime and renders maps.
        // Relative src paths are resolved to /content/trips/<filename>/<src>.
        html({ text }) {
          const match = text.match(/<GPX\s+src="([^"]+)"\s*\/?>/);
          if (match) {
            const src = match[1]!;
            const resolvedSrc = src.startsWith("/")
              ? src
              : `/content/trips/${trip.filename}/${src}`;
            return `<div class="gpx-map" data-src="${resolvedSrc}"></div>`;
          }
          return false;
        },
      },
    });

    const renderedContent = marked.parse(trip.markdownContent);
    return {
      path: `trips/${trip.filename}.html`,
      render: () =>
        htmlPage({
          params: {
            head: { title: trip.title },
            navbar: { title: trip.title },
          },
          scripts: options?.scripts,
          styleLinks: options?.styleLinks,
          content: `
            <div class="project-page">
              ${renderedContent}
            </div>`,
        }),
    };
  });
};

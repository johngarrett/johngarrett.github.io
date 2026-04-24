import { Marked } from "marked";
import { htmlPage } from "../components";
import type { Renderable } from "../utils";
import type { Content } from "../content";

type TripPageOptions = {
  scripts?: string[];
  styleLinks?: string[];
};

export const TripPages = (
  trips: Content[],
  options?: TripPageOptions,
): Renderable[] => {
  return trips.map((trip) => {
    const marked = new Marked({
      renderer: {
        html({ text }) {
          const match = text.match(/<GPX\s+src="([^"]+)"\s*\/?>/);
          if (match) {
            const src = match[1]!;
            // convert paths to relative
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

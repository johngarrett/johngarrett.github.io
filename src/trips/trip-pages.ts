import { Marked } from "marked";
import { htmlPage } from "../components";
import { html, type Renderable } from "../utils";
import type { Content } from "../content";
import fs from "fs";
import matter from "gray-matter";
import path from "node:path";
import z from "zod";
import { meta } from "zod/v4/core";

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
          let output = text;

          /**
           * GPX rendering
           */
          output = output.replace(/<GPX\s+src="([^"]+)"\s*\/?>/g, (_, src) => {
            const resolvedSrc = src.startsWith("/")
              ? src
              : `/content/trips/${trip.filename}/${src}`;

            return `<div class="gpx-map" data-src="${resolvedSrc}"></div>`;
          });

          /**
           * Notebook entry rendering
           */
          output = output.replace(
            /<NotebookEntry\s+src="([^"]+)"\s*\/?>/g,
            (_, src) => {
              const resolvedSrc = src.startsWith("/")
                ? src
                : `/content/trips/${trip.filename}/${src}`;

              // Convert to actual filesystem path
              const filePath = path.join(process.cwd(), resolvedSrc);

              let file;
              try {
                file = fs.readFileSync(filePath, "utf-8");
              } catch (err) {
                console.error("Failed to read notebook entry:", filePath);
                return `<div class="notebook-entry error">Failed to load ${src}</div>`;
              }
              const { data, content } = matter(file);
              const rendered = marked.parse(content);
              const NotebookEntrySchema = z.object({
                time: z.string(),
                date: z.string(),
                location: z.string(),
              });
              const metadata = NotebookEntrySchema.parse(data);

              return html` <div class="notebook-entry">
                ${metadata.date}
                <br />
                ${metadata.time}
                <br />
                ${metadata.location}
                <hr />
                ${rendered}
              </div>`;
            },
          );

          /**
           * Resolve relative src/href in raw HTML blocks (e.g. <video>, <source>,
           * <img>, <a>) so they point at the trip's content directory rather
           * than resolving against the rendered page URL (/trips/<slug>.html).
           * Skips absolute URLs, anchors, data:, and mailto:. The leading-space
           * lookbehind prevents matching attributes like data-src.
           */
          output = output.replace(
            /(?<=\s)(src|href)="(?!\/|https?:|#|data:|mailto:)([^"]+)"/g,
            (_, attr, value) =>
              `${attr}="/content/trips/${trip.filename}/${value}"`,
          );

          // If nothing changed, let marked handle it normally
          if (output === text) return false;

          return output;
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

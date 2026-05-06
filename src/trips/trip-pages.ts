import { Marked } from "marked";
import { htmlPage } from "../components";
import { type Renderable } from "../utils";
import {
  gpxTransformer,
  notebookTransformer,
  relativeLinkTransformer,
  type Content,
} from "../content";

type TripPageOptions = {
  scripts?: string[];
  styleLinks?: string[];
};

const transformers = [
  gpxTransformer,
  notebookTransformer,
  relativeLinkTransformer,
];

// TODO: rename ContentPages
export const TripPages = (
  trips: Content[],
  options?: TripPageOptions,
): Renderable[] => {
  return trips.map((trip) => {
    const marked = new Marked({
      renderer: {
        em({ text }) {
          return `<b id="ff">${text}</b>`;
        },
        html({ text }) {
          let output = text;

          for (const transformer of transformers) {
            output = transformer(output, { content: trip });
          }

          return output === text ? false : output;
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

import { Marked } from "marked";
import { htmlPage } from "../components";
import { type Renderable } from "../utils";
import {
  gpxTransformer,
  notebookTransformer,
  relativeLinkTransformer,
} from "./transformers";
import type { Content } from "./types";

type ContentPageOptions = {
  path: string;
  scripts?: string[];
  styleLinks?: string[];
};

const transformers = [
  gpxTransformer,
  notebookTransformer,
  relativeLinkTransformer,
];

/**
 * Replace custom XML elements based on transformer array
 */
const transformText = (text: string, content: Content) => {
  let output = text;

  for (const transformer of transformers) {
    output = transformer(output, { content: content });
  }

  return output === text ? false : output;
};

export const ContentPages = (
  contentArray: Content[],
  options: ContentPageOptions,
): Renderable[] => {
  return contentArray.map((content) => {
    const { bodyKind } = content.info;

    const renderedContent = (() => {
      switch (bodyKind) {
        case "html":
          return transformText(content.pageBody, content);
        case "markdown":
          return new Marked({
            renderer: {
              html({ text }) {
                return transformText(text, content);
              },
            },
          }).parse(content.pageBody);
      }
    })();

    return {
      path: `${options.path}/${content.filename}.html`,
      render: () =>
        htmlPage({
          params: {
            head: { title: content.title },
            navbar: { title: content.title },
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

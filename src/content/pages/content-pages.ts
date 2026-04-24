import { join } from "node:path";
import { Marked } from "marked";
import { htmlPage } from "../../components";
import type { Renderable } from "../../utils";
import type { Content } from "../../content";

const getParser = (directory: string, content: Content) => {
  return new Marked({
    renderer: {
      html({ text }) {
        if (!/<GPX\s+src="[^"]+"\s*\/?>/.test(text)) return false;
        return text.replace(/<GPX\s+src="([^"]+)"\s*\/?>/g, (_, src) => {
          const resolvedSrc = src.startsWith("/")
            ? src
            : join("/content", directory, content.filename, src);
          return `<div class="gpx-map" data-src="${resolvedSrc}"></div>`;
        });
      },
    },
  });
};

type ContentPageOptions = {
  scripts?: string[];
  styleLinks?: string[];
  directory: string;
};
export const ContentPages = (
  contentArray: Content[],
  options: ContentPageOptions,
): Renderable[] => {
  return contentArray.map((content) => ContentPage(content, options));
};

const ContentPage = (content: Content, options: ContentPageOptions) => {
  const renderedContent = getParser(options.directory, content).parse(
    content.markdownContent,
  );
  return {
    path: join(options.directory, `${content.filename}.html`),
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
};

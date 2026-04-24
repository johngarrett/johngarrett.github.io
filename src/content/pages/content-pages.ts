import { join } from "node:path";
import { Marked } from "marked";
import { htmlPage } from "../../components";
import type { Renderable } from "../../utils";
import type { Content } from "../../content";

type ContentPageOptions = {
  directory: string;
};
export const ContentPages = (
  contentArray: Content[],
  options: ContentPageOptions,
): Renderable[] => {
  return contentArray.map((content) => ContentPage(content, options));
};

const ContentPage = (content: Content, options: ContentPageOptions) => {
  let hasGPX = false;
  const renderedContent = new Marked({
    renderer: {
      html({ text }) {
        if (!/<GPX\s+src="[^"]+"\s*\/?>/.test(text)) return false;
        hasGPX = true;
        return text.replace(/<GPX\s+src="([^"]+)"\s*\/?>/g, (_, src) => {
          const resolvedSrc = src.startsWith("/")
            ? src
            : join("/content", options.directory, content.filename, src);
          return `<div class="gpx-map" data-src="${resolvedSrc}"></div>`;
        });
      },
    },
  }).parse(content.markdownContent);

  const customNodes = { gpx: hasGPX };

  return {
    path: join(options.directory, `${content.filename}.html`),
    render: () =>
      htmlPage({
        params: {
          head: { title: content.title },
          navbar: { title: content.title },
        },
        scripts: customNodes.gpx ? ["/compiled-js/gpx-map.js"] : undefined,
        styleLinks: customNodes.gpx ? ["/compiled-js/gpx-map.css"] : undefined,
        content: `
            <div class="project-page">
              ${renderedContent}
            </div>`,
      }),
  };
};

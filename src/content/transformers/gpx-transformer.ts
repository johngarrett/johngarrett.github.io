import type { MarkdownTransformer } from "./types";

export const gpxTransformer: MarkdownTransformer = (input, context) => {
  return input.replace(/<GPX\s+src="([^"]+)"\s*\/?>/g, (_, src) => {
    const resolvedSrc = src.startsWith("/")
      ? src
      : `/content/${context.contentRoot}/${context.content.filename}/${src}`;

    return `<div class="gpx-map" data-src="${resolvedSrc}"></div>`;
  });
};

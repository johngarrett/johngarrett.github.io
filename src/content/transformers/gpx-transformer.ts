import type { MarkdownTransformer } from "./types";

const GPX_TAG_REGEX = /<GPX\b([^>]*?)\/?>/g;
const ATTR_REGEX = /(\w+)\s*=\s*"([^"]*)"/g;

const parseAttrs = (attrString: string): Record<string, string> => {
  const attrs: Record<string, string> = {};
  for (const match of attrString.matchAll(ATTR_REGEX)) {
    attrs[match[1]] = match[2];
  }
  return attrs;
};

export const gpxTransformer: MarkdownTransformer = (input, context) => {
  return input.replace(GPX_TAG_REGEX, (_, attrString) => {
    const attrs = parseAttrs(attrString);
    const { src, width } = attrs;

    if (!src) return "";

    const resolvedSrc = src.startsWith("/")
      ? src
      : `/content/trips/${context.content.filename}/${src}`;

    // When a width is set, also pin flex-basis so the map keeps that size
    // inside a flex container (otherwise .gpx-map's `flex: 1 1 300px` wins).
    const styleAttr = width
      ? ` style="width: ${width}; flex: 0 1 ${width};"`
      : "";

    return `<div class="gpx-map" data-src="${resolvedSrc}"${styleAttr}></div>`;
  });
};

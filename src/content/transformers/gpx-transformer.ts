import type { MarkdownTransformer } from "./types";

const GPX_TAG_REGEX = /<GPX\b([^>]*?)\/?>/g;
const ATTR_REGEX = /(\w+)\s*=\s*"([^"]*)"/g;

const parseAttrs = (attrString: string): Record<string, string> => {
  const attrs: Record<string, string> = {};
  for (const match of attrString.matchAll(ATTR_REGEX)) {
    const [, name, value] = match;
    if (name === undefined || value === undefined) continue;
    attrs[name] = value;
  }
  return attrs;
};

export const gpxTransformer: MarkdownTransformer = (input, context) => {
  return input.replace(GPX_TAG_REGEX, (_, attrString) => {
    const attrs = parseAttrs(attrString);
    const { src, width, height } = attrs;

    if (!src) return "";

    const resolvedSrc = src.startsWith("/")
      ? src
      : `/content/trips/${context.content.filename}/${src}`;

    // When a width/height is set, also pin flex-basis so the map keeps that
    // size inside a flex container (otherwise .gpx-map's `flex: 1 1 300px`
    // would win).
    const styleParts: string[] = [];
    if (width) styleParts.push(`width: ${width}`, `flex: 0 1 ${width}`);
    if (height) styleParts.push(`height: ${height}`);
    const styleAttr =
      styleParts.length > 0 ? ` style="${styleParts.join("; ")};"` : "";

    return `<div class="gpx-map" data-src="${resolvedSrc}"${styleAttr}></div>`;
  });
};

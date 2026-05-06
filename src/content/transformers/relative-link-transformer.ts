import type { MarkdownTransformer } from "./types";

/**
 * TODO: this is janky and wont work with projects.
 *
 * Resolve relative src/href in raw HTML blocks (e.g. <video>, <source>,
 * <img>, <a>) so they point at the trip's content directory rather
 * than resolving against the rendered page URL (/trips/<slug>.html).
 * Skips absolute URLs, anchors, data:, and mailto:. The leading-space
 * lookbehind prevents matching attributes like data-src.
 */
export const relativeLinkTransformer: MarkdownTransformer = (
  input: string,
  context,
) => {
  return input.replace(
    /(?<=\s)(src|href)="(?!\/|https?:|#|data:|mailto:)([^"]+)"/g,
    (_, attr, value) => {
      return `${attr}="/content/trips/${context.content.filename}/${value}"`;
    },
  );
};

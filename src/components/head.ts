import { html, type HTMLString } from "../utils";

export type HeadParams = {
  title: string;
  openGraph?: { title: string; description: string; image: string };
  extraLinks?: string[];
};

export const head = ({ title, openGraph, extraLinks }: HeadParams): HTMLString => {
  return html`
    <head>
      <title>${title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charset="UTF-8" />
      <link rel="stylesheet" href="/styles.css" />
      ${extraLinks?.map((href) => `<link rel="stylesheet" href="${href}" />`).join("\n") ?? ""}

      <meta property="og:type" content="website" />
      ${openGraph
        ? html`
            <meta property="og:title" content="${openGraph.title}" />
            <meta
              property="og:description"
              content="${openGraph.description}"
            />
            <meta property="og:image" content="${openGraph.image}" />
            <meta property="og:url" content="https://www.garrepi.dev/" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="${openGraph.title}" />
            <meta
              name="twitter:description"
              content="${openGraph.description}"
            />
            <meta name="twitter:image" content="${openGraph.image}" />
          `
        : ``}
    </head>
  `;
};

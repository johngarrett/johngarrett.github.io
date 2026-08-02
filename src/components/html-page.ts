import type { HTMLString } from "../utils";
import { head, type HeadParams } from "./head";
import { navbar, type NavBarParams } from "./navbar";

type HTMLPageParams = {
  params: { head: HeadParams; navbar?: NavBarParams };
  content: HTMLString;
  scripts?: string[];
  styleLinks?: string[]; // or type Renderable, inject a CSS style sheet and render it with the html page
};

export const htmlPage = ({
  params,
  content,
  scripts,
  styleLinks,
}: HTMLPageParams): HTMLString => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    ${head({ ...params.head, extraLinks: styleLinks })}
    <body>
      ${params.navbar ? navbar(params.navbar) : ""}
      <main>
        ${content}
      </main>
      ${scripts?.map((src) => `<script type="module" src="${src}"></script>`).join("\n") ?? ""}
    </body>
  </html>
  `;
};

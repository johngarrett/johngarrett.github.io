import type { HTMLString } from "../utils";
import { head, type HeadParams } from "./head";
import { navbar, type NavBarParams } from "./navbar";

type HTMLPageParams = {
  params: { head: HeadParams; navbar?: NavBarParams };
  content: HTMLString;
  scripts?: string[];
  styleLinks?: string[];
};

export const htmlPage = ({ params, content, scripts, styleLinks }: HTMLPageParams): HTMLString => {
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

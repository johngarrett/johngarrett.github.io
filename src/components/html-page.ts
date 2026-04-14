import type { HTMLString } from "../utils";
import { head, type HeadParams } from "./head";
import { navbar, type NavBarParams } from "./navbar";

type HTMLPageParams = {
  params: { head: HeadParams; navbar?: NavBarParams };
  content: HTMLString;
};

export const htmlPage = ({ params, content }: HTMLPageParams): HTMLString => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    ${head(params.head)}
    <body>
      ${params.navbar ? navbar(params.navbar) : ""}
      <main>
        ${content}
      </main>
    </body>
  </html>
  `;
};

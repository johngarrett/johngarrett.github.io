import { htmlPage } from "../components";
import { html, type Renderable } from "../utils";

export const RootPage: Renderable = {
  path: "/index.html",
  render: () =>
    htmlPage({
      params: {
        head: { title: "root page" },
        navbar: { selected: "home" },
      },
      content: html` <div>garrepi.dev</div> `,
    }),
};

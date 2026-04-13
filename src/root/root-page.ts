import { htmlPage } from "../components";
import { html, type Renderable } from "../utils";

export const RootPage: Renderable = {
  path: "/index.html",
  render: () =>
    htmlPage({
      headParams: { title: "root page" },
      body: html`
        <div>Root Page</div>
        <ul>
          <a href="/projects">projects</a>
        </ul>
      `,
    }),
};

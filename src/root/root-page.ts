import { html, type Renderable } from "../utils";

export const RootPage: Renderable = {
  path: "/index.html",
  render: () => html`
    <div>Root Page</div>
    <ul>
      <a href="/projects">projects</a>
    </ul>
  `,
};

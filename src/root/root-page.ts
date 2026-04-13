import { head } from "../components";
import { html, type Renderable } from "../utils";

export const RootPage: Renderable = {
  path: "/index.html",
  render: () => html`
    ${head}
    <body>
      <div>Root Page</div>
      <ul>
        <a href="/projects">projects</a>
      </ul>
    </body>
  `,
};

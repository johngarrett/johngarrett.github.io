import { htmlPage } from "../components";
import { html, type Renderable } from "../utils";
import type { Project } from "./types";

export const ProjectsPage: (projects: Project[]) => Renderable = (projects) => {
  return {
    path: "/projects.html",

    render: () =>
      htmlPage({
        params: {
          head: { title: "Projects" },
          navbar: { selected: "projects" },
        },
        content: html`
          <div>Projects</div>
          <ul>
            ${projects.map(
              (project) =>
                html`<a href="projects/${project.name}">${project.name}</a>`,
            )}
          </ul>
        `,
      }),
  };
};

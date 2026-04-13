import { html, type Renderable } from "../utils";
import type { Project } from "./types";

export const ProjectsOverview: (projects: Project[]) => Renderable = (
  projects,
) => {
  return {
    path: "/projects.html",
    render: () => html`
      <div>Projects</div>
      <ul>
        ${projects.map(
          (project) =>
            html`<a href="projects/${project.name}">${project.name}</a>`,
        )}
      </ul>
    `,
  };
};

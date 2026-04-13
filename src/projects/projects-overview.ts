import { html, type Renderable } from "../utils";

export const ProjectsOverview: (projects: { path: string }[]) => Renderable = (
  projects,
) => {
  return {
    path: "/projects.html",
    render: () => html`
      <div>Hello World</div>
      <ul>
        ${projects.forEach(
          (project) => html`<a href="${project.path}">${project.path}</a>`,
        )}
      </ul>
    `,
  };
};

import { htmlPage } from "../components";
import { html, type HTMLString, type Renderable } from "../utils";
import type { Project } from "./types";

const ProjectCard = (project: Project): HTMLString => {
  return html`
    <div class="project-card flex-row">
      <img src="${project.image}" alt="${project.title}" />

      <div class="flex-col">
        <h2>${project.title}</h2>

        <p>${project.short}</p>

        <a href="/projects/${project.name}">View Project</a
      </div>
    </div>
  `;
};

export const ProjectsPage: (projects: Project[]) => Renderable = (projects) => {
  return {
    path: "/projects.html",

    render: () =>
      htmlPage({
        params: {
          head: { title: "Projects" },
          navbar: { selected: "projects" },
        },
        content: html` ${projects.map(ProjectCard)} `,
      }),
  };
};

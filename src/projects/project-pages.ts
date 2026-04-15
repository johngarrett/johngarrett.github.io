import { htmlPage } from "../components";
import type { Renderable } from "../utils";
import type { Project } from "./types";
import { marked } from "marked";

export const ProjectPages = (projects: Project[]): Renderable[] => {
  return projects.map((project) => {
    const renderedContent = marked(project.markdownContent);
    return {
      path: `projects/${project.name}.html`,
      render: () =>
        htmlPage({
          params: {
            head: { title: project.name },
            navbar: { title: project.title },
          },
          content: `
            <div class="project-page">
              ${renderedContent}
            </div>`,
        }),
    };
  });
};

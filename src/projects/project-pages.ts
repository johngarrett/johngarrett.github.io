import { htmlPage } from "../components";
import type { Content } from "../content";
import type { Renderable } from "../utils";
import { marked } from "marked";

export const ProjectPages = (projects: Content[]): Renderable[] => {
  return projects.map((project) => {
    const renderedContent = marked(project.markdownContent);
    return {
      path: `projects/${project.filename}.html`,
      render: () =>
        htmlPage({
          params: {
            head: { title: project.filename },
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

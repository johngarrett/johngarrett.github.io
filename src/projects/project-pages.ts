import type { Renderable } from "../utils";
import type { Project } from "./types";

export const ProjectPages = (projects: Project[]): Renderable[] => {
  return projects.map((project) => {
    return {
      path: `projects/${project.name}.html`,
      render: () => project.readmeContent,
    };
  });
};

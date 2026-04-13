import type { Renderable } from "../utils";
import type { Project } from "./types";
import { marked } from "marked";

export const ProjectPages = (projects: Project[]): Renderable[] => {
  return projects.map((project) => {
    return {
      path: `projects/${project.name}.html`,
      render: () => marked(project.readmeContent) as string, // TODO: casting
    };
  });
};

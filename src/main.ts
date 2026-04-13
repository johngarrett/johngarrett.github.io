import { readProjects } from "./projects";
import { ProjectPages } from "./projects/project-pages";
import { ProjectsOverview } from "./projects/projects-overview";
import { RootPage } from "./root/root-page";
import { build } from "./utils";

const projects = await readProjects("content/projects");

const renderables = [
  ProjectsOverview(projects),
  ...ProjectPages(projects),
  RootPage,
];

try {
  await build({
    outputDir: "html-output",
    renderables: renderables,
  });
} catch (e) {
  console.error(e);
}

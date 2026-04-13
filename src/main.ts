import { readProjects } from "./projects";
import { ProjectPages } from "./projects/project-pages";
import { ProjectsPage } from "./projects/projects-page";
import { RootPage } from "./root/root-page";
import { build } from "./utils";

const projects = await readProjects("content/projects");

const renderables = [
  RootPage,
  // projects
  ProjectsPage(projects),
  ...ProjectPages(projects),
];

try {
  await build({
    outputDir: "html-output",
    renderables: renderables,
  });
} catch (e) {
  console.error(e);
}

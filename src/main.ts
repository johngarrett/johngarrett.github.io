import { readProjects } from "./projects";
import { ProjectPages } from "./projects/project-pages";
import { ProjectsPage } from "./projects/projects-page";
import { HomePage } from "./root/root-page";
import { StyleSheet } from "./styles/styles";
import { build } from "./utils";

const projects = await readProjects("content/projects");

const renderables = [
  // main
  HomePage,
  // projects
  ProjectsPage(projects),
  ...ProjectPages(projects),
  // css
  StyleSheet(),
];

// TODO: copy all of content into html-output

try {
  await build({
    outputDir: "html-output",
    renderables: renderables,
  });
} catch (e) {
  console.error(e);
}

console.log("----- render complete --------");

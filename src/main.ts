import { readProjects } from "./projects";
import { ProjectPages } from "./projects/project-pages";
import { HomePage } from "./home/home-page";
import { StyleSheet } from "./styles/styles";
import { build } from "./utils";
import { linkBoxes } from "./home/link-boxes";

const projects = await readProjects("content/projects");

const renderables = [
  // main
  HomePage({ linkBoxes: linkBoxes({ projects }) }),
  // project pages
  ...ProjectPages(projects),
  // css
  StyleSheet(),
];

try {
  await build({
    outputDir: "html-output",
    renderables: renderables,
  });
} catch (e) {
  console.error(e);
}

console.log("----- render complete --------");

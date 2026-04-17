import { ProjectPages } from "./projects/project-pages";
import { HomePage } from "./home/home-page";
import { StyleSheet } from "./styles/styles";
import { build } from "./utils";
import { TripPages } from "./trips";
import { fetchContent } from "./content";

const projects = await fetchContent("content/projects");
const trips = await fetchContent("content/trips");

const renderables = [
  // main
  HomePage({ projects, trips }),
  // project pages
  ...ProjectPages(projects),

  ...TripPages(trips),
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

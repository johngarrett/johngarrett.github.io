import { readProjects } from "./projects";
import { ProjectPages } from "./projects/project-pages";
import { HomePage } from "./home/home-page";
import { StyleSheet } from "./styles/styles";
import { build } from "./utils";
import { linkBoxes } from "./home/link-boxes";
import { readTrips, TripPages } from "./trips";

const projects = await readProjects("content/projects");
const trips = await readTrips("content/trips");

const renderables = [
  // main
  HomePage({ linkBoxes: linkBoxes({ projects, trips }) }),
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

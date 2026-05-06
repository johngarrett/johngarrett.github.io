import { ProjectPages } from "./projects/project-pages";
import { HomePage } from "./home/home-page";
import { StyleSheet } from "./styles/styles";
import { build } from "./utils";
import { TripPages } from "./trips";
import { fetchContent } from "./content";

const scriptBuild = await Bun.build({
  entrypoints: ["./src/content/injected-scripts/gpx-views.ts"],
  outdir: "./html-output/trips",
  format: "esm",
  target: "browser",
  naming: "[name].[ext]",
});
if (!scriptBuild.success)
  throw new AggregateError(scriptBuild.logs, "script build failed");

const projects = await fetchContent("content/projects");
const trips = await fetchContent("content/trips");

const renderables = [
  // main
  HomePage({ projects, trips }),
  // project pages
  ...ProjectPages(projects),

  ...TripPages(trips, {
    scripts: ["/trips/script.js"],
    styleLinks: ["/trips/script.css"],
  }),
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

import { HomePage } from "./home/home-page";
import { StyleSheet } from "./styles/styles";
import { build } from "./utils";
import { ContentPages, fetchContent } from "./content";

const scriptBuild = await Bun.build({
  entrypoints: ["./src/content/injected-scripts/gpx-views.ts"],
  outdir: "./html-output/js",
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
  ...ContentPages(projects, {
    path: "projects",
    scripts: ["/js/gpx-views.js"],
    styleLinks: ["/js/gpx-views.css"],
  }),

  // trip pages
  ...ContentPages(trips, {
    path: "trips",
    scripts: ["/js/gpx-views.js"],
    styleLinks: ["/js/gpx-views.css"],
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

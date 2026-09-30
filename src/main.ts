import { ContentPages, fetchContent } from "./content";
import { rm } from "node:fs/promises";
import { HomePage } from "./home/home-page";
import { ResumePage } from "./resume";
import { StyleSheet } from "./styles/styles";
import { build } from "./utils";
import { WorkPage } from "./work";

const outputDir = process.env.BUILD_OUTPUT_DIR ?? "html-output";

// Start from an empty deployment directory so removed or renamed pages cannot
// remain in a later build.
await rm(outputDir, { recursive: true, force: true });

const scriptBuild = await Bun.build({
  entrypoints: ["./src/content/injected-scripts/gpx-views.ts"],
  outdir: `${outputDir}/js`,
  format: "esm",
  target: "browser",
  naming: "[name].[ext]",
});
if (!scriptBuild.success)
  throw new AggregateError(scriptBuild.logs, "script build failed");

const projects = await fetchContent("content/projects");
const trips = await fetchContent("content/trips");

const renderables = [
  HomePage(),
  ...ContentPages(projects, {
    path: "projects",
    scripts: ["/js/gpx-views.js"],
    styleLinks: ["/js/gpx-views.css"],
  }),
  ...ContentPages(trips, {
    path: "trips",
    scripts: ["/js/gpx-views.js"],
    styleLinks: ["/js/gpx-views.css"],
  }),

  WorkPage(),
  ResumePage(),
  // css
  StyleSheet(),
];

await build({
  outputDir,
  renderables,
});

console.log("----- render complete --------");

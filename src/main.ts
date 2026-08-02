import { ContentPages, fetchContent } from "./content";
import { HomePage } from "./home/home-page";
import { ResumePage } from "./resume";
import { StyleSheet } from "./styles/styles";
import { build } from "./utils";
import { WorkPage } from "./work";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

/** -------- build injected scripts ****/
const injectedScriptsDir = "./src/content/injected-scripts";

const entrypoints = (await readdir(injectedScriptsDir))
  .filter((file) => file.endsWith(".ts"))
  .map((file) => join(injectedScriptsDir, file));

const scriptBuild = await Bun.build({
  entrypoints,
  outdir: "./html-output/js",
  format: "esm",
  target: "browser",
  naming: "[name].[ext]",
});

if (!scriptBuild.success) {
  throw new AggregateError(scriptBuild.logs, "script build failed");
}
/***- -------- end build injected-scripts ****/

const projects = await fetchContent("content/projects");
const trips = await fetchContent("content/trips");

const renderables = [
  HomePage({ projects, trips }),
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

try {
  await build({
    outputDir: "html-output",
    renderables,
  });
} catch (e) {
  console.error(e);
}

console.log("----- render complete --------");

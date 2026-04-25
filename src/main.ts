import { ContentPages, fetchContent } from "./content";
import { HomePage } from "./home/home-page";
import { StyleSheet } from "./styles/styles";
import { build } from "./utils";

const scriptBuild = await Bun.build({
  entrypoints: ["./src/content/client-js/gpx-map.ts"],
  outdir: "./html-output/compiled-js",
  format: "esm",
  target: "browser",
  naming: "[name].[ext]",
});
if (!scriptBuild.success)
  throw new AggregateError(scriptBuild.logs, "script build failed");

const projects = await fetchContent("content/projects");
const trips = await fetchContent("content/trips");

const renderables = [
  HomePage({ projects, trips }),
  ...ContentPages(projects, { directory: "projects" }),
  ...ContentPages(trips, { directory: "trips" }),
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

import { ContentPages, fetchContent } from "./content";
import { HomePage } from "./home/home-page";
import { StyleSheet } from "./styles/styles";
import { build } from "./utils";

/**
 * TODO: we should be building all the scripts, yes.
 *
 * 1. they should move to live under (./src/content)
 * 2. they should be dependent on the content they're targeting. (script.ts -> gpx-map.ts)
 * 3. we should only compile IF the markdown file includes GPX tags
 */
const scriptBuild = await Bun.build({
  entrypoints: ["./src/trips/script.ts"],
  outdir: "./html-output/trips", // TODO: html-output/compiled-js/
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
  ...ContentPages(projects, { directory: "projects" }),
  ...ContentPages(trips, {
    directory: "trips",
    /**
     * TODO:
     * this should live within the mark down parsing and be dependent on if the content has GPX tags
     */
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

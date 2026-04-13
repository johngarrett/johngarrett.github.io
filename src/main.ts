import { loadProjects } from "./projects";
import { ProjectsOverview } from "./projects/projects-overview";
import { RootPage } from "./root/root-page";
import { build } from "./utils";

const projects = await loadProjects("content/projects");
const renderables = [ProjectsOverview(projects), RootPage];

try {
  await build({
    outputDir: "html-output",
    renderables: renderables,
  });
} catch (e) {
  console.error(e);
}

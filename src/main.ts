import { ProjectsOverview } from "./projects/projects-overview";
import { RootPage } from "./root/root-page";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const outputDir = "html-output/";

async function build() {
  // ensure output directory exists
  await mkdir(outputDir, { recursive: true });

  const renderables = [ProjectsOverview, RootPage];

  await Promise.all(
    renderables.map(async (renderable) => {
      const content = renderable.render();

      console.log(`generating ${renderable.path}`);
      const filePath = path.join(outputDir, renderable.path);

      await writeFile(filePath, content, "utf-8");
    }),
  );
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});

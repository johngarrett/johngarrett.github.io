import { mkdir, writeFile, cp, rm } from "node:fs/promises";
import path from "node:path";
import type { Renderable } from "./types";

type BuildParams = {
  renderables: Array<Renderable>;
  outputDir: string;
};

export async function build({ renderables, outputDir }: BuildParams) {
  await mkdir(outputDir, { recursive: true });

  const contentDest = path.join(outputDir, "content");
  console.log(`copying content directory`);
  await rm(contentDest, { recursive: true, force: true });
  await cp("./content", contentDest, { recursive: true });

  await Promise.all(
    renderables.map(async (renderable) => {
      const content = renderable.render();

      console.log(`generating ${renderable.path}`);
      const filePath = path.join(outputDir, renderable.path);

      await mkdir(path.dirname(filePath), { recursive: true });

      await writeFile(filePath, content, "utf-8");
    }),
  );
}

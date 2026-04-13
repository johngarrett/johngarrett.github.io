import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Renderable } from "./types";

type BuildParams = {
  renderables: Array<Renderable>;
  outputDir: string;
};

export async function build({ renderables, outputDir }: BuildParams) {
  // ensure output directory exists
  await mkdir(outputDir, { recursive: true });

  await Promise.all(
    renderables.map(async (renderable) => {
      const content = renderable.render();

      console.log(`generating ${renderable.path}`);
      const filePath = path.join(outputDir, renderable.path);

      await writeFile(filePath, content, "utf-8");
    }),
  );
}

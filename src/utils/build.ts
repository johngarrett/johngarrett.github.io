import { mkdir, writeFile, cp } from "node:fs/promises";
import path from "node:path";
import type { Renderable } from "./types";

type BuildParams = {
  renderables: Array<Renderable>;
  outputDir: string;
};

export async function build({ renderables, outputDir }: BuildParams) {
  // ensure output directory exists
  await mkdir(outputDir, { recursive: true });

  console.log(`copying content dirctory`);
  // copy static content
  await cp("./content", path.join(outputDir, "content"), { recursive: true });

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

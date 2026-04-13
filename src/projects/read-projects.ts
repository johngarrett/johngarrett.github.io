import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";
import type { Project } from "./types";

export async function readProjects(
  projectsDir: string,
): Promise<Array<Project>> {
  const entries = await readdir(projectsDir, { withFileTypes: true });

  const projects = await Promise.all(
    entries.map(async (entry) => {
      console.log(entry);
      console.log(entry.isDirectory());
      if (!entry.isDirectory()) return undefined;

      const projectDir = path.join(projectsDir, entry.name);
      const readmePath = path.join(projectDir, "readme.md");

      console.log(`reading ${projectsDir}`);

      try {
        const readmeContent = marked(await readFile(readmePath, "utf-8"));

        return {
          name: entry.name,
          readmeContent,
        };
      } catch (err) {
        throw new Error(
          `Missing readme.md in project: ${entry.name} (${readmePath})`,
        );
      }
    }),
  );

  return projects.filter((p): p is Project => p !== undefined);
}

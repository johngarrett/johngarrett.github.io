import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { Project } from "../types";
import matter from "gray-matter";
import { z } from "zod";

export const ProjectMetaSchema = z.object({
  title: z.string(),
  short: z.string(),
  image: z.string(),
});

/**
 * project metadata:
 *
 * title: string
 * short: string // short blurb
 * cover_iamge: string // path based on `content/projects/x`
 */
export async function readProjects(
  projectsDir: string,
): Promise<Array<Project>> {
  const entries = await readdir(projectsDir, { withFileTypes: true });

  const projects = await Promise.all(
    entries.map(async (entry) => {
      if (!entry.isDirectory()) return undefined;

      const projectDir = path.join(projectsDir, entry.name);
      const readmePath = path.join(projectDir, "readme.md");

      console.log(`[readProjects]: reading ${projectsDir}`);

      //try {
      const file = await readFile(readmePath, "utf-8");

      const { data, content } = matter(file);

      const result = ProjectMetaSchema.safeParse(data);

      if (!result.success) {
        console.error(z.treeifyError(result.error));
        throw new Error("Invalid frontmatter");
      }

      console.log(projectDir);

      return {
        name: entry.name,
        title: data.title,
        short: data.short,
        image: `${projectDir}/${data.image}`,
        markdownContent: content,
      } satisfies Project;
      //} catch (err) {
      //  throw new Error(
      //    `Missing readme.md in project: ${entry.name} (${readmePath})`,
      //  );
      //}
    }),
  );

  return projects.filter((p): p is Project => p !== undefined);
}

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { Trip } from "../types";
import matter from "gray-matter";
import { z } from "zod";

export const tripMetaSchema = z.object({
  title: z.string(),
});

export async function readTrips(tripsDir: string): Promise<Array<Trip>> {
  const entries = await readdir(tripsDir, { withFileTypes: true });

  const trips = await Promise.all(
    entries.map(async (entry) => {
      if (!entry.isDirectory()) return undefined;

      const tripDir = path.join(tripsDir, entry.name);
      const readmePath = path.join(tripDir, "readme.md");

      console.log(`[readtrips]: reading ${tripsDir}/${entry.name}`);

      //try {
      const file = await readFile(readmePath, "utf-8");

      const { data, content } = matter(file);

      const result = tripMetaSchema.safeParse(data);

      if (!result.success) {
        console.error(z.treeifyError(result.error));
        throw new Error("Invalid frontmatter");
      }

      return {
        path: entry.name,
        title: data.title,
        markdownContent: content,
      } satisfies Trip;
      //} catch (err) {
      //  throw new Error(
      //    `Missing readme.md in trip: ${entry.name} (${readmePath})`,
      //  );
      //}
    }),
  );

  return trips.filter((p): p is Trip => p !== undefined);
}

import z from "zod";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { Content, ContentInfo } from "./types";
import matter from "gray-matter";

/**
 * parse a content's info.json file and return it
 */
const getInfo = async (path: string): Promise<ContentInfo> => {
  const file = await readFile(path, "utf-8");

  const data = JSON.parse(file);

  const infoSchema = z.object({
    title: z.string(),
    short: z.string(),
    galleryResources: z.optional(z.string()),
    mapResources: z.optional(z.string()),
  });

  const result = infoSchema.safeParse(data);

  if (!result.success) {
    console.error(z.treeifyError(result.error));
    throw new Error("Invalid frontmatter");
  }

  return result.data satisfies ContentInfo;
};

const getReadme = async (path: string) => {
  const file = await readFile(path, "utf-8");
  const { data, content } = matter(file);

  const schema = z.object({ title: z.string() });

  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(z.treeifyError(result.error));
    throw new Error("Invalid frontmatter");
  }

  return {
    content,
  };
};

export const fetchContent = async (
  contentDirectory: string,
): Promise<Array<Content>> => {
  const entries = await readdir(contentDirectory, { withFileTypes: true });

  const content = await Promise.all(
    entries.map(async (entry) => {
      if (!entry.isDirectory()) {
        return undefined;
      }

      const itemDirectory = path.join(contentDirectory, entry.name);
      console.log(`[fetchContent]: reading ${itemDirectory}`);

      const infoPath = path.join(itemDirectory, "info.json");
      const info = await getInfo(infoPath);

      const readmePath = path.join(itemDirectory, "readme.md");
      const readme = await getReadme(readmePath);

      const result = {
        filename: entry.name,
        title: info.title,
        markdownContent: readme.content,
        info: info,
      } satisfies Content;

      return result;
    }),
  );

  return content.filter((c): c is Content => c !== undefined);
};

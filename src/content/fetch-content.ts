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
    bodyKind: z.enum(["html", "markdown"]),
    galleryResources: z.optional(z.string()),
    mapResources: z.optional(z.string()),
    /**
     * TODO: have getInfo take in an optional, additional, object for pattern matching
     */
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  });

  const result = infoSchema.safeParse(data);

  if (!result.success) {
    console.error(z.treeifyError(result.error));
    throw new Error("Invalid frontmatter");
  }

  return result.data satisfies ContentInfo;
};

const getAndParseBody = async (path: string) => {
  const fileContents = await readFile(path, "utf-8");
  const content = (() => {
    if (path.includes(".md")) {
      return matter(fileContents).content;
    } else {
      return fileContents;
    }
  })();

  return {
    content,
  };
};

export const fetchContent = async (
  contentDirectory: string,
  /**
   * TODO:
   * take in an optional, additional, object for pattern matching that adds to the return type
   */
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

      // IF body.html else
      const bodyPath = path.join(itemDirectory, "body.html");
      const readmePath = path.join(itemDirectory, "readme.md");

      let bodyContent: string | undefined = undefined;
      try {
        bodyContent = (await getAndParseBody(bodyPath)).content;
      } catch (e) {
        bodyContent = (await getAndParseBody(readmePath)).content;
      }

      const result = {
        filename: entry.name,
        title: info.title,
        pageBody: bodyContent,
        info: info,
      } satisfies Content;

      return result;
    }),
  );

  return content.filter((c): c is Content => c !== undefined);
};

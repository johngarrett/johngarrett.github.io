import { Marked } from "marked";
import type { MarkdownTransformer } from "./types";
import fs from "fs";
import matter from "gray-matter";
import path from "node:path";
import z from "zod";

export const notebookTransformer: MarkdownTransformer = (
  input: string,
  context,
) => {
  return input.replace(/<NotebookEntry\s+src="([^"]+)"\s*\/?>/g, (_, src) => {
    const resolvedSrc = src.startsWith("/")
      ? src
      : `/content/trips/${context.content.filename}/${src}`;

    const filePath = path.join(process.cwd(), resolvedSrc);

    let file;
    try {
      file = fs.readFileSync(filePath, "utf-8");
    } catch (err) {
      console.error("Failed to read notebook entry:", filePath);
      return `<div class="notebook-entry error">Failed to load ${src}</div>`;
    }

    const { data, content } = matter(file);
    const innerMarked = new Marked();
    const rendered = innerMarked.parse(content);

    const metadata = z
      .object({
        time: z.string(),
        date: z.string(),
        location: z.string(),
      })
      .parse(data);

    return `
        <div class="notebook-entry">
          ${metadata.date}<br/>
          ${metadata.time}<br/>
          ${metadata.location}
          <hr/>
          ${rendered}
        </div>
      `;
  });
};

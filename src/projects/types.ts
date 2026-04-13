import type { MarkdownString } from "../utils";

export type Project = {
  path: string;
  name: string;
  readmeContent: MarkdownString;
};

import type { MarkdownString } from "../utils";

export type Project = {
  path: string;
  name: string;
  title: string;
  short: string;
  image: string;
  markdownContent: MarkdownString;
};

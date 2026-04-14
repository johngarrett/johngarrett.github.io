import type { MarkdownString } from "../utils";

export type Project = {
  name: string;
  title: string;
  short: string;
  image: string;
  markdownContent: MarkdownString;
};

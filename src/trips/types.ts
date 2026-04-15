import type { MarkdownString } from "../utils";

export type Trip = {
  title: string;
  path: string;
  markdownContent: MarkdownString;
};

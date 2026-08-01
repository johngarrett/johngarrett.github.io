import type { Content } from "../types";

export type TransformerContext = {
  content: Content;
  contentRoot: string;
};

export type MarkdownTransformer = (
  input: string,
  context: TransformerContext,
) => string;

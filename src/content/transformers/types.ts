import type { Content } from "../types";

export type TransformerContext = {
  content: Content;
};

export type MarkdownTransformer = (
  input: string,
  context: TransformerContext,
) => string;

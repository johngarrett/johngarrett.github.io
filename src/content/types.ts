import type { HTMLString, MarkdownString } from "../utils";

export type ContentInfo = {
  galleryResources?: string;
  mapResources?: string;
  startDate?: Date;
  endDate?: Date;
  title: string;
  short: string;
  bodyKind: "html" | "markdown";
};

export type Content = {
  filename: string;
  title: string;
  // { kind: "html", text: HTMLString } | { ... } ?
  pageBody: MarkdownString | HTMLString;

  info: ContentInfo;
};

import type { MarkdownString } from "../utils";

export type ContentInfo = {
  galleryResources: string;
  mapResources?: string;
  title: string;
};

export type Content = {
  name: string;
  title: string;
  /**
   * short description of the content
   */
  short?: string;
  markdownContent: MarkdownString;

  info: ContentInfo;
};

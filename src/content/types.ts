import type { MarkdownString } from "../utils";

export type ContentInfo = {
  galleryResources?: string;
  mapResources?: string;
  startDate?: Date;
  endDate?: Date;
  title: string;
  short: string;
};

export type Content = {
  filename: string;
  title: string;
  /**
   * short description of the content
   */
  markdownContent: MarkdownString;

  info: ContentInfo;
};

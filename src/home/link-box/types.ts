import type { Content } from "../../content";
import type { HTMLString } from "../../utils";

export type ContentLink = Content & {
  href: string;
};

export type LinkBox = {
  title: string;
  links: Array<ContentLink>;
  renderer?: (links: ContentLink[]) => HTMLString;
};
export type LinkBoxesParams = {
  projects: Content[];
  trips: Content[];
};

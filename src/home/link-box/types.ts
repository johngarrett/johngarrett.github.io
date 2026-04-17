import type { Content } from "../../content";
import type { HTMLString } from "../../utils";

export type Link = Content & {
  href: string;
};

export type LinkBox = {
  title: string;
  links: Array<Link>;
  renderer?: (links: Link[]) => HTMLString;
};
export type LinkBoxesParams = {
  projects: Content[];
  trips: Content[];
};

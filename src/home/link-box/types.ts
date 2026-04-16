import type { Content } from "../../content";

export type Link = Content & {
  href: string;
};

export type LinkBox = {
  title: string;
  links: Array<Link>;
};
export type LinkBoxesParams = {
  projects: Content[];
  trips: Content[];
};

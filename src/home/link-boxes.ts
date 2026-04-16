import type { Content } from "../content";
import type { LinkBox } from "./home-page";

export type LinkBoxesParams = {
  projects: Content[];
  trips: Content[];
};

export const linkBoxes = ({
  projects,
  trips,
}: LinkBoxesParams): Array<LinkBox> => [
  {
    title: "Active Projects",
    links: [
      {
        title: "YVML Interactive Map",
        href: "https://yvml.github.io/map",
        short: "interactive map for YVML",
      },
    ],
  },
  // TODO: markdown-albe type
  {
    title: "Trips",
    links: trips.map((p) => {
      return {
        title: p.title,
        href: `/trips/${p.filename}`,
        short: p.info.short,
      };
    }),
  },
  {
    title: "Project Archive",
    links: projects.map((p) => {
      return {
        title: p.title,
        href: `/projects/${p.filename}`,
        short: p.info.short,
      };
    }),
  },
];

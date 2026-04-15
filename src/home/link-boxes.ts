import type { Project } from "../projects/types";
import type { Trip } from "../trips";

export type LinkBoxesParams = {
  projects: Project[];
  trips: Trip[];
};

export const linkBoxes = ({ projects, trips }: LinkBoxesParams) => [
  {
    title: "Active Projects",
    links: [
      {
        title: "YVML Interactive Map",
        href: "https://yvml.github.io/map",
      },
    ],
  },
  // TODO: markdown-albe type
  {
    title: "Trips",
    links: trips.map((p) => {
      return { title: p.title, href: `/trips/${p.path}` };
    }),
  },
  {
    title: "Project Archive",
    links: projects.map((p) => {
      return { title: p.title, href: `/projects/${p.name}` /* TODO href */ };
    }),
  },
];

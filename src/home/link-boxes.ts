import type { Project } from "../projects/types";

export type LinkBoxesParams = {
  projects: Project[];
};

export const linkBoxes = ({ projects }: LinkBoxesParams) => [
  {
    title: "Active Projects",
    links: [
      {
        title: "YVML Interactive Map",
        href: "https://yvml.github.io/map",
      },
    ],
  },
  {
    title: "Trips",
    links: [],
  },
  {
    title: "Project Archive",
    links: projects.map((p) => {
      return { title: p.title, href: `/projects/${p.name}` /* TODO href */ };
    }),
  },
];

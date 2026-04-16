import { html } from "../../utils";
import type { LinkBoxesParams, LinkBox, Link } from "./types";

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
        filename: "foo",
        markdownContent: "",
        info: {
          title: "YVML Interactive Map",
          short: "interactive map for YVML",
        },
      },
    ],
  },
  {
    title: "Trips",
    links: trips.map((p) => {
      return {
        title: p.title,
        href: `/trips/${p.filename}`,
        short: p.info.short,
      };
    }),
    linksRenderer: (links: Link[]) => {
      const renderLink = (link: Link) => html`
        <td>${link.info.short}</td>
        <td>
          <a href=${link.href} title="${link.info.short}">${link.title}</a>
        </td>
      `;

      return html`
        <tr>
          ${links.map(renderLink).join("")}
        </tr>
      `;
    },
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

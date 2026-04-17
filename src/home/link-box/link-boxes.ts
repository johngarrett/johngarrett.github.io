import { html, type HTMLString } from "../../utils";
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
        ...p,
        href: `/trips/${p.filename}`,
      };
    }),
    renderer: (links: Link[]): HTMLString => {
      const renderLink = (link: Link) => html`
        <tr>
          <td>${link.info.short}</td>
          <td>
            <a href=${link.href} title="${link.info.short}">${link.title}</a>
          </td>
        </tr>
      `;

      return html`
        <table>
          <tbody>
            ${links.map(renderLink).join("")}
          </tbody>
        </table>
      `;
    },
  },
  {
    title: "Project Archive",
    links: projects.map((p) => {
      return {
        ...p,
        href: `/projects/${p.filename}`,
      };
    }),
  },
];

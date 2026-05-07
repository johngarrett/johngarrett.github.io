import { html, type HTMLString } from "../../utils";
import type { LinkBoxesParams, LinkBox, ContentLink } from "./types";

export const getLinkBoxes = ({
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
        pageBody: "",
        info: {
          title: "YVML Interactive Map",
          short: "interactive map for YVML",
          bodyKind: "markdown",
        },
      },
    ],
  },
  {
    title: "Trips",
    links: trips
      .sort((a, b) => {
        return (
          (b.info.startDate?.getTime() ?? 0) -
          (a.info.startDate?.getTime() ?? 0)
        );
      })
      .map((trip) => {
        return {
          ...trip,
          href: `/trips/${trip.filename}`,
        };
      }),
    renderer: (conentLinks: ContentLink[]): HTMLString => {
      const renderLink = (contentLink: ContentLink) => html`
        <tr>
          <td>
            ${contentLink.info.startDate
              ?.toLocaleDateString("en-US", {
                month: "short",
                year: "2-digit",
              })
              .toLowerCase()}
          </td>
          <td>
            <a href=${contentLink.href} title="${contentLink.info.short}"
              >${contentLink.title}</a
            >
          </td>
        </tr>
      `;

      return html`
        <table>
          <tbody>
            ${conentLinks.map(renderLink).join("")}
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

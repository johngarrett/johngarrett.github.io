import { html, type HTMLString } from "../../utils";
import type { ContentLink, LinkBox } from "./types";

const linkToHTML = (link: ContentLink): HTMLString => html`
  <li><a href=${link.href} title="${link.info.short}">${link.title}</a></li>
`;

const defaultRenderer = (links: ContentLink[]) => {
  return html`<ul>
    ${links.map(linkToHTML).join("")}
  </ul>`;
};

export const linkBoxToHTML = (linkBox: LinkBox): HTMLString => html`
  <div class="home-link-box">
    <div class="home-link-box-title">${linkBox.title}</div>
    ${linkBox.renderer
      ? linkBox.renderer(linkBox.links)
      : defaultRenderer(linkBox.links)}
  </div>
`;

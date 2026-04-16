import { html, type HTMLString } from "../../utils";
import type { Link, LinkBox } from "./types";

const linkToHTML = (link: Link): HTMLString => html`
  <li><a href=${link.href} title="${link.short}">${link.title}</a></li>
`;

export const linkBoxToHTML = (linkBox: LinkBox): HTMLString => html`
  <div class="home-link-box">
    <div class="home-link-box-title">${linkBox.title}</div>
    <ul>
      ${linkBox.links.map(linkToHTML).join("")}
    </ul>
  </div>
`;

import { html, type HTMLString } from "../../utils";
import type { LinkBox } from "../home-page";

const linkToHTML = (link: { title: string; href: string }): HTMLString => html`
  <li><a href=${link.href}>${link.title}</a></li>
`;

export const linkBoxToHTML = (linkBox: LinkBox): HTMLString => html`
  <div class="home-link-box">
    <div class="home-link-box-title">${linkBox.title}</div>
    <ul>
      ${linkBox.links.map(linkToHTML).join("")}
    </ul>
  </div>
`;

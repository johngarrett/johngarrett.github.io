import { htmlPage } from "../components";
import { html, type HTMLString } from "../utils";

export type LinkBox = {
  title: string;
  links: Array<{
    title: string;
    href: string;
  }>;
};

export type HomePageParams = {
  linkBoxes: Array<LinkBox>;
};

const linkToHTML = (link: { title: string; href: string }): HTMLString => html`
  <li><a href=${link.href}>${link.title}</a></li>
`;

const linkBoxToHTML = (linkBox: LinkBox): HTMLString => html`
  <div class="home-link-box">
    <div class="home-link-box-title">${linkBox.title}</div>
    <ul>
      ${linkBox.links.map(linkToHTML).join("")}
    </ul>
  </div>
`;

export const HomePage = (params: HomePageParams) => {
  return {
    path: "/index.html",
    render: () =>
      htmlPage({
        params: {
          head: { title: "garrepi" },
        },
        content: html`
          <div class="home-container">
            <div class="home-title">(still working on this)</div>
            <div class="home-link-boxes">
              ${params.linkBoxes.map(linkBoxToHTML).join("")}
            </div>
          </div>
        `,
      }),
  };
};

import { htmlPage } from "../components";
import { html } from "../utils";
import { linkBoxToHTML } from "./components/link-box";

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
            <div class="home-title">(wip)</div>
            <div class="home-link-boxes">
              ${params.linkBoxes.map(linkBoxToHTML).join("")}
            </div>
          </div>
        `,
      }),
  };
};

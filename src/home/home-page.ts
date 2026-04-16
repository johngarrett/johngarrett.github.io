import { htmlPage } from "../components";
import { html } from "../utils";
import { linkBoxToHTML } from "./components/link-box";

export type LinkBoxLink = {
  title: string;
  href: string;
  short: string;
};

export type LinkBox = {
  title: string;
  links: Array<LinkBoxLink>;
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
            <div class="home-title">
              <img src=/content/misc/the_general_problem.png />
            </div>
            <div class="home-link-boxes">
              ${params.linkBoxes.map(linkBoxToHTML).join("")}
            </div>
          </div>
        `,
      }),
  };
};

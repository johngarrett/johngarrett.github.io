import { htmlPage } from "../components";
import type { Content } from "../content";
import { html } from "../utils";
import { linkBoxes as getLinkBoxes, linkBoxToHTML } from "./link-box";

export type HomePageParams = {
  projects: Content[];
  trips: Content[];
};

export const HomePage = ({ projects, trips }: HomePageParams) => {
  const linkBoxes = getLinkBoxes({ projects, trips });

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
              ${linkBoxes.map(linkBoxToHTML).join("")}
            </div>
          </div>
        `,
      }),
  };
};

import { htmlPage } from "../components";
import type { Content } from "../content";
import { html } from "../utils";

export type HomePageParams = {
  projects: Content[];
  trips: Content[];
};

export const HomePage = () => {
  return {
    path: "/index.html",
    render: () =>
      htmlPage({
        params: {
          head: { title: "garrepi home" },
        },
        bodyClass: "powerlines-body",
        content: html`
          <div class="home-container">
            <!-- TODO: component -->
            <div class="nav-links">
              <a href="/index.html">Home</a>
              <a href="/work.html">Work</a>
              <a href="/about.html">About</a>
            </div>
          </div>
        `,
      }),
  };
};

import { htmlPage } from "../components";
import { html, type Renderable } from "../utils";

export const HomePage: Renderable = {
  path: "/index.html",
  render: () =>
    htmlPage({
      params: {
        head: { title: "root page" },
        navbar: { selected: "home" },
      },
      content: html`
        <div class="home-container">
          <div class="home-title">garrepi.dev</div>
          <div class="home-link-boxes">
            <div class="home-link-box">
              <div class="home-link-box-title">foo section</div>
              <a>foo</a>
              <a>foo</a>
              <a>foo</a>
            </div>
            <div class="home-link-box"></div>
            <div class="home-link-box"></div>
          </div>
        </div>
      `,
    }),
};

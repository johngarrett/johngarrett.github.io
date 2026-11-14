import { htmlPage } from "../components";
import { html, type HTMLString, type Renderable } from "../utils";
import type { WorkContent, WorkEntry } from "./types";
import { workData } from "./work-data";

const renderContent = (content: WorkContent): string => {
  if (content.kind === "image") {
    return `<img class="work-image" src=${content.path}></img>`;
  } else {
    return `<video class="work-image" src=${content.path} autoplay loop muted playsinline></video>`;
  }
};

const renderWorkEntry = (entry: WorkEntry): HTMLString => {
  return html` <div class="work-entry-grid">
    <!-- TOOD .map -->
    <div class="work-blurb">
      <h2>${entry.title}</h2>
      <p>${entry.paragraph}</p>
    </div>
    <div class="work-image-flex">
      ${entry.content.map(renderContent).join("")}
    </div>
  </div>`;
};

const workList = (entries: WorkEntry[]): HTMLString => {
  return html`<div class="work-list">
    ${entries.map(renderWorkEntry).join("")}
  </div>`;
};

export const WorkPage = (): Renderable => {
  return {
    path: "work.html",
    render: () =>
      htmlPage({
        params: {
          head: { title: "garrepi work" },
        },
        bodyClass: "ocean-body",
        content: html`
          <div class="home-container">
            ${workList(workData())}
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

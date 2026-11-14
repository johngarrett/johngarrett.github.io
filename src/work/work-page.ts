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
  const leadingText =
    `${entry.organization.toUpperCase()} <b><em>${entry.name.toUpperCase()}</em></b>`
      .split(" ")
      .join("<br>");
  return html`
    <article class="work-entry-grid">
      <h2 class="work-title">${leadingText}</h2>
      <div class="work-details">
        <p>${entry.paragraph}</p>
        <div class="work-image-flex">
          ${entry.content.map(renderContent).join("")}
        </div>
      </div>
    </article>
  `;
};

export const WorkPage = (): Renderable => {
  return {
    path: "work.html",
    render: () =>
      htmlPage({
        params: {
          head: { title: "garrepi work" },
        },
        bodyClass: "work-body",
        content: html`
          <header>
            <h1>Work</h1>
          </header>
          <main class="work-list">
            ${workData().map(renderWorkEntry).join("")}
          </main>
        `,
      }),
  };
};

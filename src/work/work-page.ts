import { htmlPage } from "../components";
import { html, type HTMLString, type Renderable } from "../utils";
import type { WorkContent, WorkEntry } from "./types";
import { workData } from "./work-data";

const renderContent = (content: WorkContent): string => {
  if (content.kind === "image") {
    return `<img class="work-image" src="${content.path}" alt="Project interface screenshot">`;
  } else {
    return `<video class="work-image" src="${content.path}" autoplay loop muted playsinline aria-label="Project demonstration"></video>`;
  }
};

const renderWorkEntry = (entry: WorkEntry): HTMLString => {
  const leadingText =
    `${entry.organization.toUpperCase()} <b><em>${entry.name.toUpperCase()}</em></b>`
      .split(" ")
      .join("<br>");
  return html`
    <article class="work-entry-grid" id="${entry.id}" aria-labelledby="${entry.id}-title">
      <h2 class="work-title" id="${entry.id}-title">${leadingText}</h2>
      <div class="work-details">
        <p>${entry.paragraph}</p>
        ${entry.content.length ? html`<div class="work-image-flex">
          ${entry.content.map(renderContent).join("")}
        </div>` : ""}
      </div>
    </article>
  `;
};

export const WorkPage = (): Renderable => {
  const entries = workData();
  return {
    path: "work.html",
    render: () =>
      htmlPage({
        params: {
          head: { title: "garrepi work" },
        },
        bodyClass: "work-body",
        scripts: ["/js/work-navigation.js"],
        content: html`
          <header class="work-header">
            <h1>Work</h1>
          </header>
          <div class="work-list">
            ${entries.map(renderWorkEntry).join("")}
          </div>
          <nav class="work-pagination" aria-label="Work projects">
            <ol>
              ${entries.map((entry) => html`<li><a href="#${entry.id}" aria-label="${entry.organization}: ${entry.name}"></a></li>`).join("")}
            </ol>
          </nav>
        `,
      }),
  };
};

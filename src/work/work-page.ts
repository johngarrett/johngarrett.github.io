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
      <h2 class="work-title" id="${entry.id}-title" tabindex="-1">${leadingText}</h2>
      <div class="work-details" tabindex="0" role="region" aria-label="${entry.organization} project details">
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
          <nav class="work-header" aria-label="Main navigation">
            <h1><a href="/work.html" aria-current="page">Work</a></h1>
          </nav>
          <div class="work-list" style="--work-count: ${entries.length}">
            <div class="work-track">
              ${entries.map((_, index) => html`<div class="work-stop" aria-hidden="true" style="top: ${index / entries.length * 100}%"></div>`).join("")}
              <div class="work-stage">
                ${entries.map(renderWorkEntry).join("")}
              </div>
            </div>
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

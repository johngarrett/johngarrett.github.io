import { contentGrid, htmlPage, navBar } from "../components";
import { html, type HTMLString, type Renderable } from "../utils";
import { type Job, jobs } from "./jobs";

type TableParams = {
  //head?: HTMLElement;
  rows: HTMLString[]; // ["<td>foo</td>", "<td>bar</td>"]
};

const table = (params: TableParams): HTMLString => {
  return html` <div class="jobs-container">${params.rows.join("")}</div>`;
};

const renderJob = (job: Job) => {
  return html`
    <details class="job-details">
      <summary class="job-summary">
        <span>${job.company}</span>
        <span>${job.title}</span>
        <span class="job-years">${job.years}</span>
      </summary>
      <p>${job.oneline}</p>
    </details>
  `;
};

const resumeTable = (): HTMLString => {
  return table({ rows: jobs.map(renderJob) });
};

export const ResumePage = (): Renderable => {
  return {
    path: "/resume",
    render: () =>
      htmlPage({
        params: {
          head: { title: "resume" },
        },
        content: contentGrid(navBar(), resumeTable()),
      }),
  };
};

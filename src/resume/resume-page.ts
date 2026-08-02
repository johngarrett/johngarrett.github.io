import { contentGrid, htmlPage, navBox } from "../components";
import { html, type HTMLString, type Renderable } from "../utils";
import { type Job, jobs } from "./jobs";

const jobContainer = (params: { children: HTMLString[] }): HTMLString => {
  return html` <div class="jobs-container">${params.children.join("")}</div>`;
};

const renderJob = (job: Job) => {
  return html`
    <details class="job-details" data-description="${job.oneline}">
      <summary class="job-summary">
        <span>${job.company}</span>
        <span class="job-title">${job.title}</span>
        <span class="job-years">${job.years}</span>
      </summary>
      <p>${job.oneline}</p>
    </details>
  `;
};

const resumeTable = (): HTMLString => {
  return jobContainer({ children: jobs.map(renderJob) });
};

export const ResumePage = (): Renderable => {
  return {
    path: "/resume",
    render: () =>
      htmlPage({
        params: {
          head: { title: "resume" },
        },
        scripts: ["/js/sidebar-resizing.js", "/js/resume-popup.js"],
        content: contentGrid(navBox({ active: "resume" }), resumeTable()),
      }),
  };
};

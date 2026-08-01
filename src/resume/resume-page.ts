import { contentGrid, htmlPage, navBar } from "../components";
import { html, type HTMLString, type Renderable } from "../utils";

type TableParams = {
  //head?: HTMLElement;
  rows: HTMLString[]; // ["<td>foo</td>", "<td>bar</td>"]
};

const table = (params: TableParams): HTMLString => {
  return html` <div>${params.rows.join("")}</div>`;
};

type Job = { company: string; title: string; years: string; oneline: string };
const jobs: Job[] = [
  {
    company: "Yucca Valley Material Lab",
    title: "Freelance Software Engineer",
    oneline: "built and interactive map with custom map tiles",
    years: "feb 2026",
  },
  {
    company: "Apple",
    title: "Senior Software Engineer",
    oneline: "built and interactive map with custom map tiles",
    years: "2023-2026",
  },
  {
    company: "Barrel Proof Apps",
    title: "Software Engineer",
    oneline: "built and interactive map with custom map tiles",
    years: "2021-2023",
  },
  {
    company: "Apple",
    title: "Intern",
    oneline: "built and interactive map with custom map tiles",
    years: "summer 2021, summer 2022",
  },
];

const renderJob = (job: Job) => {
  return html`
    <details class="job">
      <summary class="job-summary">
        <span>${job.company}</span>
        <span>${job.title}</span>
        <span>${job.years}</span>
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

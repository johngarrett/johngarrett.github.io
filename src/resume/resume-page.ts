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
    oneline:
      "worked on Apple TV and Apple Music for Smart TVs primarily as a framework engineer. i also built some UI and integrated with the client. I built features related to networking, payments, accounts, ratings, and other features",
    years: "2023-2026",
  },
  {
    company: "Digital Light Meter",
    title: "Hardware Project",
    oneline: "this did things",
    years: "2023",
  },
  {
    company: "Barrel Proof Apps",
    title: "Contract Software Engineer",
    oneline:
      "worked with a lot of different clients. react native apps, iOS apps, backend work, etc.",
    years: "2020-2021",
  },
  {
    company: "Apple",
    title: "Intern",
    oneline:
      "worked in webassembly. migrating existing frameworks to new platforms",
    years: "summer 2021, summer 2022",
  },
  {
    company: "SameTunes",
    title: "Software Engineer",
    oneline: "built a spotify cache, music match making software",
    years: "2020",
  },
  {
    company: "Kabbage",
    title: "Mobile iOS Engineer",
    oneline: "fintech company, built out features on the iOS app",
    years: "2019",
  },
  {
    company: "HyperSwift",
    title: "DSL in swift",
    oneline: "",
    years: "2019",
  },
  {
    company: "TrafficLight",
    title: "iOS Engineer; co-founder",
    oneline: "",
    years: "2017-2019",
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

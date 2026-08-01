import { contentGrid, htmlPage, navBar } from "../components";
import { html, type HTMLString, type Renderable } from "../utils";

//<table>
//  <thead>
//    <tr>
//      <th>Organization</th>
//      <th>Role</th>
//      <th>Years</th>
//    </tr>
//  </thead>
//  <tbody>
//    <tr>
//      <td>Chick-fil-A</td>
//      <td>Team Leader</td>
//      <td>2014–2016</td>
//    </tr>
//    <tr>
//      <td>Computers 2 Kids</td>
//      <td>Volunteer</td>
//      <td>2022–2023</td>
//    </tr>
//  </tbody>
//</table>

type TableParams = {
  //head?: HTMLElement;
  rows: HTMLString[]; // ["<td>foo</td>", "<td>bar</td>"]
};

const table = (params: TableParams): HTMLString => {
  return html` <table>
    <tbody>
      ${params.rows.map((r) => `<tr>${r}</tr>`).join("")}
    </tbody>
  </table>`;
};

type Job = { company: string; title: string; years: string };
const jobs: Job[] = [
  {
    company: "Apple",
    title: "Senior Software Engineer",
    years: "2023-2026",
  },
];

const renderJob = (job: Job) => {
  return `
  <td>${job.company}</td>
  <td>${job.title}</td>
  <td>${job.years}</td>
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

import { htmlPage } from "../components";
import { html, type HTMLString, type Renderable } from "../utils";

const navBar = (): HTMLString => {
  return html`
    <nav class="flex-col">
      <ul class="nav-list">
        <li><a href="/">home</a></li>
        <li><a href="/work">work</a></li>
        <li><a href="/about">about</a></li>
      </ul>
    </nav>
  `;
};

const grid = (...content: HTMLString[]): HTMLString => {
  return html` <div class="main-grid">${content.join("")}</div> `;
};

type WorkEntry = {
  image_path: string;
  paragraph: HTMLString;
};

const renderWorkEntry = (entry: WorkEntry): HTMLString => {
  return html`<div>
    <img src=${entry.image_path} style="max-width: 300px"></img>
    <p>${entry.paragraph}</p>
  </div>`;
};

const workList = (entries: WorkEntry[]): HTMLString => {
  return html`<div style="max-width: 500px">
    ${entries.map(renderWorkEntry).join("")}
  </div>`;
};

const workData = (): WorkEntry[] => {
  return [
    {
      image_path: "content/work/yvml.jpg",
      paragraph: html`An interactive map built for virtual tours at Yucca Valley
      Material Lab. Running as a static site on Github pages. Custom map tiles
      from drone imagery. Audio assets, bounding boxes, path finding. `,
    },
    {
      image_path: "content/work/odr.jpg",
      paragraph: html`Other Desert Radio Archive is an interaction layer on top
      of an archive hosted in Mixcloud. This project included a management
      website, web design, etc.`,
    },
  ];
};

export const WorkPage = (): Renderable => {
  return {
    path: "/work",
    render: () =>
      htmlPage({
        params: {
          head: { title: "garrepi work" },
        },
        content: grid(navBar(), workList(workData())),
      }),
  };
};

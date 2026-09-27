import { contentGrid, htmlPage, navBox } from "../components";
import { html, type HTMLString, type Renderable } from "../utils";

type WorkEntry = {
  images: string[];
  title: string;
  paragraph: HTMLString;
};

const renderWorkEntry = (entry: WorkEntry): HTMLString => {
  return html`
  <div class="work-entry-grid">
    <!-- TOOD .map -->
    <img src=${entry.images} style="max-width: 300px"></img>
    <div class="work-blurb">
      <h2>${entry.title}</h2>
      <p>${entry.paragraph}</p>
    </div>
  </div>`;
};

const workList = (entries: WorkEntry[]): HTMLString => {
  return html`<div>${entries.map(renderWorkEntry).join("")}</div>`;
};

const workData = (): WorkEntry[] => {
  return [
    {
      images: ["content/work/yvml.jpg"],
      title: "Interactive Map | Yucca Valley Material Lab",
      paragraph: html`An interactive map built for virtual tours at Yucca Valley
      Material Lab. Running as a static site on Github pages. Custom map tiles
      from drone imagery. Audio assets, bounding boxes, path finding. `,
    },
    {
      images: ["content/work/odr.jpg"],
      title: "Archvie Platform | Other Desert Radio",
      paragraph: html`Other Desert Radio Archive is an interaction layer on top
      of an archive hosted in Mixcloud. This project included a management
      website, web design, etc.`,
    },
  ];
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

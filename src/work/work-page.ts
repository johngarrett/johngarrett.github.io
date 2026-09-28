import { htmlPage } from "../components";
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
    <div class="work-blurb">
      <h2>${entry.title}</h2>
      <p>${entry.paragraph}</p>
    </div>
    <img class="work-image" src=${entry.images}></img>
  </div>`;
};

const workList = (entries: WorkEntry[]): HTMLString => {
  return html`<div class="work-list">
    ${entries.map(renderWorkEntry).join("")}
  </div>`;
};

const workData = (): WorkEntry[] => {
  return [
    {
      images: ["content/work/yvml.jpg"],
      title: "Yucca Valley Material Lab",
      paragraph: html`An interactive map built for virtual tours at Yucca Valley
      Material Lab. Running as a static site on Github pages. Custom map tiles
      from drone imagery. Audio assets, bounding boxes, path finding. `,
    },
    {
      images: ["content/work/odr.jpg"],
      title: "Other Desert Radio",
      paragraph: html`Other Desert Radio Archive is an interaction layer on top
      of an archive hosted in Mixcloud. This project included a management
      website, web design, etc.`,
    },
    {
      images: [""],
      title: "Apple",
      paragraph: html`Senior Software Engineer at Apple working on the Apple TV
      and Apple Music app for Smart TVs. My work focused on networking,
      payments, and TV ratings. Key contributer on a major feature that let
      users make TV purchases with their iPhone.`,
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

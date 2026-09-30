import { htmlPage } from "../components";
import { html, type HTMLString, type Renderable } from "../utils";

type WorkEntry = {
  content: Array<Content>;
  title: string;
  paragraph: HTMLString;
};

type Content = {
  kind: "video" | "image";
  path: string;
};

const renderContent = (content: Content): string => {
  if (content.kind === "image") {
    return `<img class="work-image" src=${content.path}></img>`;
  } else {
    return `<video class="work-image" src=${content.path} autoplay loop muted playsinline></video>`;
  }
};

const renderWorkEntry = (entry: WorkEntry): HTMLString => {
  return html` <div class="work-entry-grid">
    <!-- TOOD .map -->
    <div class="work-blurb">
      <h2>${entry.title}</h2>
      <p>${entry.paragraph}</p>
    </div>
    <div class="work-image-flex">
      ${entry.content.map(renderContent).join("")}
    </div>
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
      content: [{ kind: "image", path: "content/work/odr.webp" }],
      title: "Other Desert Radio",
      paragraph: html`Other Desert Radio Archive is an interaction layer on top
      of an archive hosted in Mixcloud. This project included a management
      website, web design, etc.`,
    },
    {
      content: [{ kind: "image", path: "content/work/drc-page.webp" }],
      title: "Dream Rock Collective",
      paragraph: `A subscription based mail drop`,
    },
    {
      content: [
        { kind: "video", path: "content/work/yvml-demo.web.mp4" },
        //{ kind: "image", path: "content/work/yvml-working.webp" },
      ],
      title: "Yucca Valley Material Lab",
      paragraph: html`An interactive map built for in person tours at Yucca
      Valley Material Lab. Running as a static site on Github pages. Custom map
      tiles from drone imagery. Audio assets, bounding boxes, path finding. `,
    },
    {
      content: [],
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

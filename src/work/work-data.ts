import { html } from "../utils";
import type { WorkEntry } from "./types";

export const workData = (): WorkEntry[] => {
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

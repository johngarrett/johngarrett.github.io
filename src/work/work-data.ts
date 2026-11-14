import { html } from "../utils";
import type { WorkEntry } from "./types";

export const workData = (): WorkEntry[] => {
  return [
    {
      id: "other-desert-radio",
      content: [{ kind: "image", path: "content/work/odr.webp" }],
      organization: "Other Desert Radio",
      name: "Archive",
      paragraph: html`Other Desert Radio Archive is an interaction layer on top
      of an archive hosted in Mixcloud. This project included a management
      website, web design, etc.`,
    },
    {
      id: "yucca-valley-material-lab",
      content: [
        { kind: "video", path: "content/work/yvml-demo.web.mp4" },
        //{ kind: "image", path: "content/work/yvml-working.webp" },
      ],
      organization: "Yucca Valley Material Lab",
      name: "Interactive Guide",
      paragraph: html`An interactive map built for in person tours at Yucca
      Valley Material Lab. Running as a static site on Github pages. Custom map
      tiles from drone imagery. Audio assets, bounding boxes, path finding. `,
    },
    {
      id: "dream-rock-collective",
      content: [{ kind: "image", path: "content/work/drc-page.webp" }],
      organization: "Dream Rock Collective",
      name: "Registration Site",
      paragraph: `A subscription based mail drop`,
    },
    {
      id: "apple",
      content: [],
      organization: "Apple Media Services",
      name: "Senior Software Engineer",
      paragraph: html`Senior Software Engineer at Apple working on the Apple TV
      and Apple Music app for Smart TVs. My work focused on networking,
      payments, and TV ratings. Key contributer on a major feature that let
      users make TV purchases with their iPhone.`,
    },
  ];
};

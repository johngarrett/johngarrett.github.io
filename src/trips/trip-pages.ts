import { marked } from "marked";
import { htmlPage } from "../components";
import type { Renderable } from "../utils";
import type { Trip } from "./types";

// TODO: combine with ProjectPages and share
export const TripPages = (trips: Trip[]): Renderable[] => {
  //const renderer = new marked.Renderer();

  //// Support <GPX src="..." />
  //renderer.html = (html) => {
  //  const match = html.match(/<GPX\s+src="([^"]+)"\s*\/?>/);

  //  if (match) {
  //    const src = match[1];

  //    return `<div class="gpx-map" data-src="${src}"></div>`;
  //  }

  //  return html;
  //};
  //marked.setOptions({ renderer });

  //// TODO: make this a TS file
  //const gpxScript = `
  //  <script>
  //  document.addEventListener("DOMContentLoaded", function () {
  //    document.querySelectorAll(".gpx-map").forEach((el) => {
  //      const src = el.getAttribute("data-src");

  //      const map = L.map(el).setView([0, 0], 13);

  //      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  //        attribution: "&copy; OpenStreetMap contributors"
  //      }).addTo(map);

  //      new L.GPX(src, { async: true })
  //        .on("loaded", function (e) {
  //          map.fitBounds(e.target.getBounds());
  //        })
  //        .addTo(map);
  //    });
  //  });
  //  </script>
  //`;`

  return trips.map((trip) => {
    const renderedContent = marked(trip.markdownContent);
    return {
      path: `trips/${trip.path}.html`,
      render: () =>
        htmlPage({
          params: {
            head: { title: trip.title },
            navbar: { title: trip.title },
          },
          content: `
            <div class="project-page">
              ${renderedContent}
            </div>`,
        }),
    };
  });
};

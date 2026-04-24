/// <reference lib="dom" />
// Browser entry point — compiled by Bun.build() in main.ts into html-output/trips/script.js.
// Injected into every trip page. Initializes Leaflet maps for any .gpx-map divs on the page.
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-gpx";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll<HTMLElement>(".gpx-map").forEach((el) => {
    const src = el.dataset.src;
    if (!src) return;

    const map = L.map(el).setView([0, 0], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    new L.GPX(src, {
      async: true,
      // Disable default start/end pin icons — they use relative image paths
      // that break when served from the trips/ directory.
      marker_options: {
        startIconUrl: "",
        endIconUrl: "",
        shadowUrl: "",
      },
    })
      .on("loaded", (e: any) => map.fitBounds(e.target.getBounds()))
      .addTo(map);
  });
});

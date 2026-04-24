// Allows importing leaflet/dist/leaflet.css as a side-effect in script.ts.
// Bun.build() handles the CSS — tsc just needs to know the module exists.
declare module "leaflet/dist/leaflet.css";

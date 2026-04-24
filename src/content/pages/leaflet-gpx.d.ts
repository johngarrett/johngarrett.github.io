// TODO: move this
// leaflet-gpx ships no TypeScript types. This file extends the leaflet
// namespace with the GPX class and the options surface we use.
import "leaflet";

declare module "leaflet" {
  interface GPXOptions {
    async?: boolean;
    marker_options?: {
      startIcon?: unknown;
      endIcon?: unknown;
      startIconUrl?: string;
      endIconUrl?: string;
      shadowUrl?: string;
    };
  }

  class GPX extends Layer {
    constructor(gpx: string, options?: GPXOptions);
    on(event: "loaded", fn: (e: { target: GPX }) => void): this;
    getBounds(): LatLngBounds;
  }
}

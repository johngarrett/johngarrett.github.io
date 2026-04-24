import "leaflet";

declare module "leaflet" {
  interface GPXOptions {
    async?: boolean;
    marker_options?: {
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

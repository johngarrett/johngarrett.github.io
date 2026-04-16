import type { MarkdownString } from "../utils";

export type TripInfo = {
  galleryResources: string;
  mapResources?: string;
  title: string;
};
export type Trip = {
  title: string;
  path: string;
  markdownContent: MarkdownString;
  info: TripInfo;
};

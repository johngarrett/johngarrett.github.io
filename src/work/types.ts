import type { HTMLString } from "../utils";

export type WorkEntry = {
  content: Array<WorkContent>;
  organization: string; // Other Desert Radio
  name: string; // Archive
  paragraph: HTMLString;
};

export type WorkContent = {
  kind: "video" | "image";
  path: string;
};

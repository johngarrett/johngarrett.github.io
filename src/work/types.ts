import type { HTMLString } from "../utils";

export type WorkEntry = {
  content: Array<WorkContent>;
  title: string;
  paragraph: HTMLString;
};

export type WorkContent = {
  kind: "video" | "image";
  path: string;
};

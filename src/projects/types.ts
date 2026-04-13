import type { HTMLString } from "../utils";

export type Project = {
  path: string;
  name: string;
  readmeContent: HTMLString;
};

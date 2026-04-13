import { html, type HTMLString } from "../utils";

type HeadParams = {
  title: string;
};

export const head = (params: HeadParams): HTMLString => {
  return html` <head> </head> `;
};

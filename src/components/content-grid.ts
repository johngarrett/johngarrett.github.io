import { type HTMLString, html } from "../utils";

export const contentGrid = (...content: HTMLString[]): HTMLString => {
  return html` <div class="main-grid">${content.join("")}</div> `;
};

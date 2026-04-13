import type { HTMLString } from "../utils";
import { head, type HeadParams } from "./head";

//type HTMLPageParams = (/*{ head: HTMLString } | */ { headParams: HeadParams}) & {
type HTMLPageParams = { headParams: HeadParams; body: HTMLString };

export const htmlPage = ({ headParams, body }: HTMLPageParams): HTMLString => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    ${head(headParams)}
    ${body}
  </html>
  `;
};

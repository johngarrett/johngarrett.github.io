import type { HTMLString } from "./types";

export const html = (
  strings: TemplateStringsArray,
  ...values: unknown[]
): HTMLString => String.raw(strings, ...values);

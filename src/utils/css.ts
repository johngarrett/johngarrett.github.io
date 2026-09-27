export type CSSString = string;

export const css = (
  strings: TemplateStringsArray,
  ...values: unknown[]
): CSSString => String.raw(strings, ...values);

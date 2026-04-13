export type Renderable = {
  render: () => HTMLString;
  path: string; // path to save and access
};

export type HTMLString = string;
export type MarkdownString = string;

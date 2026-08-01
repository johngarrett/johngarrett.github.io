import { contentGrid, htmlPage, navBar } from "../components";
import type { HTMLString, Renderable } from "../utils";

const resumeTable = (): HTMLString => {
  return "foobar";
};

export const ResumePage = (): Renderable => {
  return {
    path: "/resume",
    render: () =>
      htmlPage({
        params: {
          head: { title: "resume" },
        },
        content: contentGrid(navBar(), resumeTable()),
      }),
  };
};

import type { Renderable } from "../utils";
import fs from "fs";

const stylesheet = fs.readFileSync("./src/styles/styles.css", "utf-8");

export const StyleSheet: () => Renderable = () => {
  return {
    path: "styles.css",
    render: () => stylesheet,
  };
};

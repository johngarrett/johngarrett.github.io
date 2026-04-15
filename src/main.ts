import { readProjects } from "./projects";
import { ProjectPages } from "./projects/project-pages";
import { HomePage } from "./home/home-page";
import { StyleSheet } from "./styles/styles";
import { build } from "./utils";

const projects = await readProjects("content/projects");

const linkBoxes = [
  {
    title: "Active Projects",
    links: [
      {
        title: "YVML Interactive Map",
        href: "https://yvml.github.io/map",
      },
    ],
  },
  {
    title: "Project Archive",
    links: projects.map((p) => {
      return { title: p.title, href: `/projects/${p.name}` /* TODO href */ };
    }),
  },
];

const renderables = [
  // main
  HomePage({ linkBoxes }),
  // projects
  ...ProjectPages(projects),
  // css
  StyleSheet(),
];

try {
  await build({
    outputDir: "html-output",
    renderables: renderables,
  });
} catch (e) {
  console.error(e);
}

console.log("----- render complete --------");

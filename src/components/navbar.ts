import { html, type HTMLString } from "../utils";

export type NavBarParams = {
  selected: "home" | "projects";
};

export const navbar = (params: NavBarParams): HTMLString => {
  return html`
    <div class="navbar">
      <div class="navbar-container">
        <nav class="navbar-links">
          <a href="/" ${params.selected === "home" ? 'class="bold"' : ""}>
            Home
          </a>
          <a
            href="/projects"
            ${params.selected === "projects" ? 'class="bold"' : ""}
          >
            Projects
          </a>
        </nav>
      </div>
    </div>
  `;
};

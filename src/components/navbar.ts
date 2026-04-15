import { html, type HTMLString } from "../utils";

export type NavBarParams = {
  title: string;
};

export const navbar = (params: NavBarParams): HTMLString => {
  return html`
    <div class="navbar">
      <div class="navbar-container">
        <nav class="navbar-links">
          <a href="/"> Home </a>
          <a class="bold"> ${params.title} </a>
        </nav>
      </div>
    </div>
  `;
};

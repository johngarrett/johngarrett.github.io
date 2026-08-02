import { type HTMLString, html } from "../utils";

type NavBoxParams = {
  active: "home" | "work" | "resume" | "about";
};

const boldActive = (link: string, params: NavBoxParams) => {
  return link === params?.active ? "bold" : "";
};

export const navBox = (params: NavBoxParams): HTMLString => {
  return html`
    <div class="navbox-container">
      <nav class="flex-col">
        <ul class="nav-list">
          <li class="nav-li ${boldActive("home", params)}">
            <a href="/">home</a>
          </li>
          <li class="nav-li ${boldActive("work", params)}">
            <a href="/work">work</a>
          </li>
          <li class="nav-li ${boldActive("resume", params)}">
            <a href="/resume">resume</a>
          </li>
          <li class="nav-li ${boldActive("about", params)}">
            <a href="/about">about</a>
          </li>
        </ul>
      </nav>
    </div>
  `;
};

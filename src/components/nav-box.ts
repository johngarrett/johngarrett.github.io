import { type HTMLString, html } from "../utils";

export const navBar = (): HTMLString => {
  return html`
    <nav class="flex-col">
      <ul class="nav-list">
        <li><a href="/">home</a></li>
        <li><a href="/work">work</a></li>
        <li><a href="/resume">resume</a></li>
        <li><a href="/about">about</a></li>
      </ul>
    </nav>
  `;
};

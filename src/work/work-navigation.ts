/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

const articles = [...document.querySelectorAll<HTMLElement>(".work-entry-grid")];
const links = [...document.querySelectorAll<HTMLAnchorElement>(".work-pagination a")];

const activate = (article: HTMLElement) => {
  for (const entry of articles) {
    entry.classList.toggle("is-active", entry === article);
  }
  for (const link of links) {
    if (link.hash === `#${article.id}`) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  }
};

let observer: IntersectionObserver;
const observe = () => {
  observer?.disconnect();
  // A narrow band tracks the current article even when it is taller than the viewport.
  const marker = Math.round(innerHeight * 0.25);
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) activate(entry.target as HTMLElement);
    }
    document.body.classList.add("work-motion");
  }, { rootMargin: `-${marker}px 0px -${innerHeight - marker - 1}px 0px` });
  for (const article of articles) observer.observe(article);
};

observe();
window.addEventListener("resize", observe);

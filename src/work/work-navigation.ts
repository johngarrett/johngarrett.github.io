/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

const scroller = document.querySelector<HTMLElement>(".work-list")!;
const articles = [...document.querySelectorAll<HTMLElement>(".work-entry-grid")];
const links = [...document.querySelectorAll<HTMLAnchorElement>(".work-pagination a")];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const initial = Math.max(0, links.findIndex(link => link.hash === location.hash));
let current = -1;
const scrollStep = () => scroller.clientHeight / 2;

const fitTitles = () => {
  const indicator = document.querySelector<HTMLElement>(".work-pagination")!.getBoundingClientRect();
  const mobile = matchMedia("(max-width: 800px)").matches;
  for (const article of articles) {
    const title = article.querySelector<HTMLElement>(".work-title")!;
    const text = title.querySelector<HTMLElement>(".work-title-text")!;
    title.style.height = mobile ? "auto" : "100%";
    title.style.fontSize = "100px";
    const available = title.getBoundingClientRect();
    const measured = text.getBoundingClientRect();
    const layout = getComputedStyle(article);
    const maxHeight = mobile
      ? (article.clientHeight - parseFloat(layout.paddingTop) - parseFloat(layout.paddingBottom) - parseFloat(layout.rowGap)) * 0.4
      : available.height;
    // Cap titles at 118px so short titles don't grow too large on wide screens.
    const size = Math.min(118, 100 * Math.min(available.width / measured.width, maxHeight / measured.height));
    title.style.fontSize = `${Math.floor(size * 100) / 100}px`;
    // Reserve the fitted text's height explicitly so Safari doesn't collapse the auto grid row.
    if (mobile) title.style.height = `${text.getBoundingClientRect().height}px`;
    const details = article.querySelector<HTMLElement>(".work-details")!;
    const offset = parseFloat(article.style.getPropertyValue("--work-offset")) || 0;
    const overlap = Math.max(0, indicator.bottom - (details.getBoundingClientRect().top - offset));
    article.style.setProperty("--work-indicator-overlap", `${overlap}px`);
    article.style.setProperty("--work-indicator-gutter", overlap > 0 ? "2rem" : "0px");
  }
};

const render = () => {
  const progress = scroller.scrollTop / scrollStep();
  const next = Math.max(0, Math.min(articles.length - 1, Math.round(progress)));
  const moveFocus = current !== next && articles[current]?.contains(document.activeElement);
  articles.forEach((article, index) => {
    const distance = Math.max(-1, Math.min(1, index - progress));
    const opacity = Math.max(0, 1 - 2 * Math.abs(distance));
    article.style.setProperty("--work-opacity", String(opacity));
    article.style.setProperty("--work-offset", `${distance * 32}px`);
    article.classList.toggle("is-visible", opacity > 0);
    article.classList.toggle("is-active", index === next);
    article.inert = index !== next;
  });
  if (next !== current) {
    current = next;
    links.forEach((link, index) => {
      if (index === current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    history.replaceState(null, "", links[current]!.hash);
    if (moveFocus) articles[current]!.querySelector<HTMLElement>(".work-title")!.focus({ preventScroll: true });
  }
};

const navigate = (index: number) => {
  const target = Math.max(0, Math.min(articles.length - 1, index));
  scroller.scrollTo({ top: target * scrollStep(), behavior: reducedMotion.matches ? "instant" : "smooth" });
};

document.body.classList.add("work-deck");
fitTitles();
document.fonts.ready.then(fitTitles);
scroller.scrollTop = initial * scrollStep();
window.scrollTo(0, 0);
render();
scroller.addEventListener("scroll", render, { passive: true });
new ResizeObserver(() => {
  fitTitles();
  scroller.scrollTo({ top: current * scrollStep(), behavior: "instant" });
  render();
}).observe(scroller);

window.addEventListener("hashchange", () => {
  const index = links.findIndex(link => link.hash === location.hash);
  if (index >= 0) navigate(index);
});
links.forEach((link, index) => link.addEventListener("click", event => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  navigate(index);
}));

window.addEventListener("keydown", event => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.target instanceof Element && event.target.closest(".work-details, input, textarea, select, [contenteditable], video")) return;
  let next: number;
  switch (event.key) {
    case "ArrowDown": case "ArrowRight": case "PageDown": next = current + 1; break;
    case "ArrowUp": case "ArrowLeft": case "PageUp": next = current - 1; break;
    case "Home": next = 0; break;
    case "End": next = articles.length - 1; break;
    default: return;
  }
  event.preventDefault();
  navigate(next);
});

// disabling for now

const container = document.querySelector<HTMLElement>(".navbox-container");
const nav = document.querySelector<HTMLElement>(".nav-list");

if (!container || !nav) {
  throw new Error("Couldn't find .navbox-container or .nav-list");
}

Object.assign(container.style, {
  position: "relative",
  overflow: "visible",
});

Object.assign(nav.style, {
  position: "absolute",
  top: "0",
  left: "0",
  transformOrigin: "top left",
  transition: "transform 180ms cubic-bezier(.2,.8,.2,1), box-shadow 180ms",
  zIndex: "1000",
  background: "var(--bg-color)",
});

container.addEventListener("mouseenter", () => {
  nav.style.transform = "scale(1.2)";
  nav.style.border = "1.0px solid";
  nav.style.padding = "10px";
});

container.addEventListener("mouseleave", () => {
  nav.style.transform = "scale(1)";
  nav.style.border = "none";
  nav.style.padding = "none";
});

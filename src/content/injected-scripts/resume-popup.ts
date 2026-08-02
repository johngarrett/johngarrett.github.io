const popup = document.createElement("div");
popup.className = "job-popup";
popup.style.display = "none";
document.body.appendChild(popup);

let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

document.querySelectorAll<HTMLElement>(".job-details").forEach((job) => {
  job.addEventListener("mouseenter", () => {
    popup.textContent = job.dataset.description ?? "";
    popup.style.display = "block";

    const rect = job.getBoundingClientRect();
    const popupWidth = popup.offsetWidth;
    const gap = 10;

    const spaceRight = window.innerWidth - rect.right;
    const spaceLeft = rect.left;

    if (spaceRight >= popupWidth + gap) {
      // right side of job
      popup.style.left = `${rect.right + gap}px`;
      popup.style.top = `${rect.top}px`;
    } else if (spaceLeft >= popupWidth + gap) {
      // left side of job
      popup.style.left = `${rect.left - popupWidth - gap}px`;
      popup.style.top = `${rect.top}px`;
    } else {
      // no room: follow mouse
      popup.style.left = `${mouseX + gap}px`;
      popup.style.top = `${mouseY + gap}px`;
    }
  });

  job.addEventListener("mousemove", () => {
    const rect = job.getBoundingClientRect();
    const popupWidth = popup.offsetWidth;
    const gap = 10;

    if (
      window.innerWidth - rect.right < popupWidth + gap &&
      rect.left < popupWidth + gap
    ) {
      popup.style.left = `${mouseX + gap}px`;
      popup.style.top = `${mouseY + gap}px`;
    }
  });

  job.addEventListener("mouseleave", () => {
    popup.style.display = "none";
  });
});

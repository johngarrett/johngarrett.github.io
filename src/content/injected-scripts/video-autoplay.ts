document.addEventListener("DOMContentLoaded", () => {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target;
        if (!(video instanceof HTMLVideoElement)) continue;

        if (entry.isIntersecting) {
          void video.play().catch(() => {
            // Ignore autoplay rejections; the browser may require user interaction.
          });
          continue;
        }

        video.pause();
      }
    },
    {
      threshold: 0.05,
    },
  );

  document.querySelectorAll("video").forEach((video) => {
    videoObserver.observe(video);
  });
});

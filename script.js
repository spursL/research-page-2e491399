(() => {
  const hydrateVideo = (video) => {
    if (video.dataset.loaded === 'true') return;

    video.querySelectorAll('source[data-src]').forEach((source) => {
      source.src = source.dataset.src;
      source.removeAttribute('data-src');
    });

    video.dataset.loaded = 'true';
    video.load();
  };

  const videos = document.querySelectorAll('.lazy-video');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) hydrateVideo(entry.target);
      });
    }, { rootMargin: '300px 0px' });

    videos.forEach((video) => observer.observe(video));
  } else {
    videos.forEach(hydrateVideo);
  }

  document.querySelectorAll('[data-sync-group]').forEach((group) => {
    const groupVideos = [...group.querySelectorAll('.sync-video')];
    const button = group.querySelector('.sync-button');
    if (!button || groupVideos.length < 2) return;

    let playing = false;

    button.addEventListener('click', async () => {
      groupVideos.forEach(hydrateVideo);

      if (playing) {
        groupVideos.forEach((video) => video.pause());
        button.textContent = 'Play both videos';
        playing = false;
        return;
      }

      groupVideos.forEach((video) => {
        video.currentTime = 0;
      });

      await Promise.all(groupVideos.map((video) => video.play().catch(() => null)));
      button.textContent = 'Pause both videos';
      playing = true;
    });

    groupVideos.forEach((video) => {
      video.addEventListener('pause', () => {
        if (groupVideos.every((item) => item.paused)) {
          button.textContent = 'Play both videos';
          playing = false;
        }
      });
    });
  });

  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const controls = document.querySelector(`[data-carousel-controls="${carousel.id}"]`);
    const previousButton = controls?.querySelector('[data-carousel-prev]');
    const nextButton = controls?.querySelector('[data-carousel-next]');
    if (!previousButton || !nextButton) return;

    const updateButtons = () => {
      previousButton.disabled = carousel.scrollLeft <= 2;
      nextButton.disabled = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 2;
    };

    const moveCarousel = (direction) => {
      carousel.scrollBy({
        left: direction * carousel.clientWidth,
        behavior: 'smooth',
      });
    };

    previousButton.addEventListener('click', () => moveCarousel(-1));
    nextButton.addEventListener('click', () => moveCarousel(1));
    carousel.addEventListener('scroll', updateButtons, { passive: true });
    carousel.addEventListener('keydown', (event) => {
      if (event.target !== carousel) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveCarousel(-1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveCarousel(1);
      }
    });

    if ('ResizeObserver' in window) {
      new ResizeObserver(updateButtons).observe(carousel);
    }
    updateButtons();
  });
})();

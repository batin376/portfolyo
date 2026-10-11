// The clip contains forward/reverse motion at 1/1.5 speed; loop one decoder.
(() => {
  'use strict';
  const video = document.querySelector('.black-hole-video');
  if (!video) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  function shouldPlay() {
    return visible && !document.hidden && !reduced.matches &&
      !document.body.classList.contains('motion-paused');
  }
  async function syncPlayback() {
    if (!shouldPlay()) {
      video.pause();
      return;
    }
    try {
      await video.play();
      if (!shouldPlay()) video.pause();
    } catch {
      // Preserve the poster if autoplay is unavailable.
    }
  }
  video.muted = true;
  video.loop = true;
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    syncPlayback();
  }, { root: document.querySelector('.pages'), threshold: .05 }).observe(video.parentElement);
  new MutationObserver(syncPlayback).observe(document.body, {
    attributes: true, attributeFilter: ['class']
  });
  reduced.addEventListener('change', syncPlayback);
  document.addEventListener('visibilitychange', syncPlayback);
})();

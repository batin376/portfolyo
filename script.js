(() => {
  'use strict';
  const content = window.portfolioContent;
  const pages = document.querySelector('.pages');
  const sections = [...document.querySelectorAll('.page')];
  document.querySelector('#section-total').textContent = String(sections.length).padStart(2, '0');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionToggle = document.querySelector('#motion-toggle');
  let paused = reduceMotion.matches;
  let activeSection = 0;
  let currentPhoto = 0;
  let lastWheel = 0;
  let wheelLockedUntil = 0;
  const dialog = document.querySelector('#photo-dialog');
  const galleryImage = document.querySelector('#gallery-image');
  const photoDots = document.querySelector('#gallery-dots');

  document.querySelector('#about-text').textContent = content.about;
  document.querySelector('#year').textContent = new Date().getFullYear();
  const sceneClock = document.querySelector('#scene-clock');
  const dateFormat = new Intl.DateTimeFormat('tr-TR', {
    timeZone: 'Europe/Istanbul', day: '2-digit', month: '2-digit', year: 'numeric'
  });
  const timeFormat = new Intl.DateTimeFormat('tr-TR', {
    timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  });
  function updateClock() {
    const now = new Date();
    sceneClock.textContent = `${dateFormat.format(now)} · ${timeFormat.format(now)}`;
    sceneClock.dateTime = now.toISOString();
  }
  updateClock();
  setInterval(updateClock, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) updateClock(); });

  function updateMotion() {
    document.body.classList.toggle('motion-paused', paused);
    motionToggle.setAttribute('aria-pressed', String(paused));
    motionToggle.setAttribute('aria-label', paused ? 'Animasyonları oynat' : 'Animasyonları duraklat');
    motionToggle.firstElementChild.textContent = paused ? '▷' : 'Ⅱ';
  }
  updateMotion();
  motionToggle.addEventListener('click', () => { paused = !paused; updateMotion(); });
  reduceMotion.addEventListener('change', event => { paused = event.matches; updateMotion(); });

  function setActive(index) {
    activeSection = index;
    sections.forEach((section, i) => section.classList.toggle('is-active', i === index));
    document.querySelector('#section-number').textContent = String(index + 1).padStart(2, '0');
    document.querySelectorAll('.section-nav a, .header nav a').forEach(link => {
      const active = link.hash === '#' + sections[index].id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      // A long mobile section can occupy the entire viewport without 50% of itself being visible.
      if (entry.isIntersecting) setActive(sections.indexOf(entry.target));
    }
  }, { root: pages, rootMargin: '-35% 0px -35% 0px', threshold: 0 });
  sections.forEach(section => observer.observe(section));

  function goTo(index, updateHash = true) {
    const target = sections[Math.max(0, Math.min(sections.length - 1, index))];
    pages.scrollTo({ top: target.offsetTop, behavior: paused || reduceMotion.matches ? 'instant' : 'smooth' });
    if (updateHash) history.replaceState(null, '', '#' + target.id);
  }
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    if (link.classList.contains('skip-link')) return;
    link.addEventListener('click', event => {
      const index = sections.findIndex(section => '#' + section.id === link.hash);
      if (index < 0) return;
      event.preventDefault();
      goTo(index);
    });
  });
  // One wheel gesture advances one screen on desktop; long sections retain native scrolling.
  pages.addEventListener('wheel', event => {
    if (dialog.open || event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX) || Math.abs(event.deltaY) < 4) return;
    const section = sections[activeSection];
    if (section.offsetHeight > pages.clientHeight + 8) return;
    event.preventDefault();
    const now = performance.now();
    const elapsed = now - lastWheel;
    lastWheel = now;
    if (now < wheelLockedUntil || elapsed < 160) return;
    const next = Math.max(0, Math.min(sections.length - 1, activeSection + Math.sign(event.deltaY)));
    if (next !== activeSection) {
      wheelLockedUntil = now + 850;
      goTo(next);
    }
  }, { passive: false });
  document.addEventListener('keydown', event => {
    if (dialog.open) {
      if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(currentPhoto + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(currentPhoto - 1); }
      return;
    }
    if (event.target.closest('button, a, summary, input, textarea, select, [contenteditable]')) return;
    const shortSection = sections[activeSection].offsetHeight <= pages.clientHeight + 8;
    if ((event.key === 'ArrowDown' || event.key === 'PageDown') && shortSection) { event.preventDefault(); goTo(activeSection + 1); }
    if ((event.key === 'ArrowUp' || event.key === 'PageUp') && shortSection) { event.preventDefault(); goTo(activeSection - 1); }
    if (event.key === 'Home') { event.preventDefault(); goTo(0); }
    if (event.key === 'End') { event.preventDefault(); goTo(sections.length - 1); }
  });
  function openHash() {
    const index = sections.findIndex(section => '#' + section.id === location.hash);
    if (index >= 0) goTo(index, false);
  }
  window.addEventListener('hashchange', openHash);
  window.addEventListener('load', openHash);

  content.photos.forEach((photo, index) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `${index + 1}. fotoğraf: ${photo.alt}`);
    dot.addEventListener('click', () => showPhoto(index));
    photoDots.append(dot);
    const preload = new Image();
    preload.src = photo.src;
  });
  function showPhoto(index) {
    currentPhoto = (index + content.photos.length) % content.photos.length;
    const photo = content.photos[currentPhoto];
    galleryImage.src = photo.src;
    galleryImage.alt = photo.alt;
    galleryImage.classList.toggle('portrait', currentPhoto >= 2);
    const number = String(currentPhoto + 1).padStart(2, '0');
    document.querySelector('#gallery-counter').textContent = `${number} / ${String(content.photos.length).padStart(2, '0')}`;
    document.querySelector('.image-number').textContent = number;
    [...photoDots.children].forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === currentPhoto)));
    document.querySelector('#dialog-image').src = photo.src;
    document.querySelector('#dialog-image').alt = photo.alt;
    document.querySelector('#dialog-caption').textContent = `${number} / ${String(content.photos.length).padStart(2, '0')}`;
  }
  document.querySelector('#previous-photo').addEventListener('click', () => showPhoto(currentPhoto - 1));
  document.querySelector('#next-photo').addEventListener('click', () => showPhoto(currentPhoto + 1));
  document.querySelector('#dialog-previous').addEventListener('click', () => showPhoto(currentPhoto - 1));
  document.querySelector('#dialog-next').addEventListener('click', () => showPhoto(currentPhoto + 1));
  document.querySelector('#open-photo').addEventListener('click', () => dialog.showModal());
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  let touchStartX = 0;
  document.querySelector('.gallery-image-button').addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  document.querySelector('.gallery-image-button').addEventListener('touchend', event => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) {
      showPhoto(currentPhoto + (delta < 0 ? 1 : -1));
      // Cancel only the click synthesized from a horizontal swipe.
      const preventClick = click => { click.preventDefault(); click.stopImmediatePropagation(); };
      event.currentTarget.addEventListener('click', preventClick, { once: true, capture: true });
      setTimeout(() => document.querySelector('.gallery-image-button').removeEventListener('click', preventClick, true), 400);
    }
  }, { passive: true });
  showPhoto(0);
})();

/* ============================================================
   Samantha Rodriguez — Professional Profile
   Header state, mobile navigation, scroll spy, reveal animations.
   ============================================================ */
(function () {
  'use strict';

  var header    = document.getElementById('header');
  var nav       = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navLinks  = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var reduced   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Current year in the footer ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  /* ---- Header shadow once the page scrolls ---- */
  function onScroll() {
    if (!header) { return; }
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile navigation ---- */
  function closeNav() {
    if (!nav || !navToggle) { return; }
    nav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { closeNav(); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeNav(); }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 780) { closeNav(); }
    });
  }

  /* ---- Testimonials carousel ---- */
  var track    = document.getElementById('tcarTrack');
  var prevBtn  = document.getElementById('tcarPrev');
  var nextBtn  = document.getElementById('tcarNext');

  if (track && prevBtn && nextBtn) {
    // One "page" is a card plus the gap between cards, read from the DOM so the
    // responsive card widths never need to be duplicated here.
    var stepSize = function () {
      var card = track.querySelector('.tcar__card');
      if (!card) { return track.clientWidth; }
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card.getBoundingClientRect().width + gap;
    };

    var syncArrows = function () {
      var max = track.scrollWidth - track.clientWidth;
      // Snapping can come to rest a couple of pixels off either end, so compare
      // with a tolerance that follows the track's own padding rather than 0.
      var slack = (parseFloat(getComputedStyle(track).paddingLeft) || 0) + 3;
      prevBtn.disabled = track.scrollLeft <= slack;
      nextBtn.disabled = track.scrollLeft >= max - slack;
    };

    // The browser's own smooth scrolling is silently a no-op in some embedded and
    // preview contexts, which would leave the arrows looking broken. Tweening by
    // hand always moves, and snapping is switched off for the duration so mandatory
    // snap points don't fight the animation frame by frame.
    var rafId = null;

    var slide = function (direction) {
      var max = Math.max(0, track.scrollWidth - track.clientWidth);
      var target = Math.min(max, Math.max(0, track.scrollLeft + direction * stepSize()));

      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }

      var settle = function () {
        track.style.scrollSnapType = '';
        syncArrows();
      };

      if (reduced) {
        track.scrollLeft = target;
        settle();
        return;
      }

      var start = track.scrollLeft;
      var delta = target - start;
      if (!delta) { return; }

      var startedAt = performance.now();
      var DURATION = 380;
      track.style.scrollSnapType = 'none';

      // rAF is paused while the document is hidden, so a timer guarantees the track
      // still lands on the target even if no frame ever runs. Whichever finishes
      // first wins; the other is cancelled.
      var guard = setTimeout(function () {
        if (rafId === null) { return; }
        cancelAnimationFrame(rafId);
        rafId = null;
        track.scrollLeft = target;
        settle();
      }, DURATION + 200);

      var frame = function (now) {
        var k = Math.min(1, (now - startedAt) / DURATION);
        track.scrollLeft = start + delta * (1 - Math.pow(1 - k, 3)); // ease-out cubic
        if (k < 1) {
          rafId = requestAnimationFrame(frame);
        } else {
          rafId = null;
          clearTimeout(guard);
          settle();
        }
      };
      rafId = requestAnimationFrame(frame);
    };

    prevBtn.addEventListener('click', function () { slide(-1); });
    nextBtn.addEventListener('click', function () { slide(1); });
    track.addEventListener('scroll', syncArrows, { passive: true });
    window.addEventListener('resize', syncArrows);

    // Fonts landing late can change card heights and widths, so re-check then too.
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(syncArrows); }
    syncArrows();
  }

  /* ---- Scroll spy: highlight the section currently in view ---- */
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---- Reveal on scroll ---- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealer = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) { return; }
        // Small stagger for groups that enter together.
        entry.target.style.transitionDelay = Math.min(i, 5) * 70 + 'ms';
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { revealer.observe(el); });

    // Safety net: never leave content hidden if the observer misfires.
    window.addEventListener('load', function () {
      setTimeout(function () {
        revealables.forEach(function (el) {
          var box = el.getBoundingClientRect();
          if (box.top < window.innerHeight) { el.classList.add('is-visible'); }
        });
      }, 400);
    });
  }
})();

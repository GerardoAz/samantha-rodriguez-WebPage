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

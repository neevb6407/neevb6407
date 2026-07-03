/* =============================================================
   NEEV — Automotive Photographer
   Interactions & scroll animations — pure vanilla JS.
   No libraries: IntersectionObserver + CSS transitions.
   ============================================================= */
(function () {
  'use strict';

  var docEl = document.documentElement;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var animate = docEl.classList.contains('js') && !prefersReduced;

  /* -----------------------------------------------------------
     Lightbox — full-size gallery images
     ----------------------------------------------------------- */
  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxClose = document.getElementById('lightboxClose');

    function open(src) {
      lightboxImg.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.gallery-item img').forEach(function (img) {
      img.addEventListener('click', function () {
        open(img.src);
      });
    });

    lightboxClose.addEventListener('click', close);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* -----------------------------------------------------------
     Mobile navigation (hamburger menu)
     ----------------------------------------------------------- */
  function initMobileNav() {
    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    function setOpen(open) {
      toggle.classList.toggle('open', open);
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    toggle.addEventListener('click', function () {
      setOpen(!links.classList.contains('open'));
    });

    // Close the menu when a link is tapped or Escape is pressed.
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        setOpen(false);
      });
    });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  /* -----------------------------------------------------------
     Hero chrome-text shimmer follows the pointer, giving a
     "light moving over metal" feel.
     ----------------------------------------------------------- */
  function initHeroShimmer() {
    var heroTitle = document.getElementById('heroTitle');
    if (!heroTitle) return;
    window.addEventListener('mousemove', function (e) {
      var pct = (e.clientY / window.innerHeight) * 100;
      heroTitle.style.backgroundPosition = '0% ' + pct + '%';
    });
  }

  /* -----------------------------------------------------------
     Nav condense, scroll-progress bar, subtle hero parallax
     ----------------------------------------------------------- */
  function initScrollUI() {
    var nav = document.querySelector('nav');
    var progress = document.getElementById('scrollProgress');
    var hero = document.querySelector('.hero');
    var ticking = false;

    function update() {
      var top = docEl.scrollTop || document.body.scrollTop;
      var max = docEl.scrollHeight - docEl.clientHeight;
      var ratio = max > 0 ? top / max : 0;

      if (progress) progress.style.transform = 'scaleX(' + ratio + ')';
      if (nav) nav.classList.toggle('scrolled', top > 60);

      // Parallax: nudge the hero background as you scroll away.
      if (hero && animate && top < window.innerHeight) {
        var pos = 40 + (top / window.innerHeight) * 15; // 40% -> ~55%
        hero.style.backgroundPosition = 'center ' + pos + '%';
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  /* -----------------------------------------------------------
     Scroll-triggered reveals via IntersectionObserver.
     Elements with .reveal fade/slide in when they enter view.
     Children of a [data-stagger] group get a cascading delay.
     ----------------------------------------------------------- */
  function initReveals() {
    if (!animate) return;

    // Pre-set staggered transition delays for grouped elements.
    document.querySelectorAll('[data-stagger]').forEach(function (group) {
      group.querySelectorAll('.reveal').forEach(function (el, i) {
        el.style.transitionDelay = i * 90 + 'ms';
      });
    });

    if (!('IntersectionObserver' in window)) {
      // Very old browser: just show everything.
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('in');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* -----------------------------------------------------------
     Cinematic hero entrance — fade the veil away on load.
     Hero text reveals via the IntersectionObserver above.
     ----------------------------------------------------------- */
  function initHeroEntrance() {
    if (!animate) return;
    var veil = document.getElementById('heroVeil');
    if (!veil) return;
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        veil.classList.add('out');
      });
    });
  }

  /* -----------------------------------------------------------
     Magnetic contact buttons
     ----------------------------------------------------------- */
  function initMagneticButtons() {
    if (!animate) return;
    document.querySelectorAll('.chrome-btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width / 2;
        var my = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + mx * 0.2 + 'px, ' + my * 0.3 + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* -----------------------------------------------------------
     Boot
     ----------------------------------------------------------- */
  function boot() {
    initLightbox();
    initMobileNav();
    initHeroShimmer();
    initScrollUI();
    initReveals();
    initHeroEntrance();
    initMagneticButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

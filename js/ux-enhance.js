/* UX smoothness layer — additive, does not modify main.js
   1. Fixes the two-tap problem on hover-driven nav dropdowns (touch devices)
   2. Safety net so scroll-reveal content can never stay invisible
   3. Smooth in-page anchor scrolling that respects reduced-motion          */
(function () {
  'use strict';

  /* ---------- 1. TWO-TAP DROPDOWN FIX ---------------------------------
     The desktop dropdowns open on CSS :hover. On a touch screen the first
     tap only produces a synthetic hover, so the link needs a second tap.
     On coarse pointers we take over: tap 1 opens, tap 2 follows the link. */
  function initTouchDropdowns() {
    var coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (!coarse) return;

    var parents = document.querySelectorAll('.top-nav-menu > li, .nav-item');
    var open = null;

    function closeAll() {
      parents.forEach(function (p) { p.classList.remove('tap-open'); });
      open = null;
    }

    parents.forEach(function (li) {
      var dd = li.querySelector('.nav-dropdown');
      var a = li.querySelector(':scope > a') || li.querySelector('a');
      if (!dd || !a) return;
      li.classList.add('has-tap-dropdown');

      a.addEventListener('click', function (e) {
        if (li.classList.contains('tap-open')) return;   // 2nd tap → navigate
        var href = a.getAttribute('href') || '';
        // a placeholder parent (#) should never navigate, only toggle
        if (href === '#' || href === '') e.preventDefault();
        else e.preventDefault();                          // 1st tap → just open
        if (open && open !== li) open.classList.remove('tap-open');
        li.classList.add('tap-open');
        open = li;
      });
    });

    document.addEventListener('click', function (e) {
      if (open && !open.contains(e.target)) closeAll();
    }, true);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });
    window.addEventListener('orientationchange', closeAll);
  }

  /* ---------- 2. REVEAL SAFETY NET -------------------------------------
     .fade-up starts at opacity:0 and relies on IntersectionObserver.
     If that never fires the content is invisible to users. Force-reveal
     anything still hidden shortly after load.                            */
  function initRevealFallback() {
    setTimeout(function () {
      document.querySelectorAll('.fade-up:not(.visible), .stagger-parent:not(.visible)')
        .forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight * 1.5) el.classList.add('visible');
        });
    }, 1200);
    window.addEventListener('load', function () {
      setTimeout(function () {
        document.querySelectorAll('.fade-up:not(.visible), .stagger-parent:not(.visible)')
          .forEach(function (el) { el.classList.add('visible'); });
      }, 2500);
    });
  }

  /* ---------- 3. SMOOTH ANCHOR SCROLL ---------------------------------- */
  function initAnchors() {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      var top = t.getBoundingClientRect().top + window.pageYOffset - 110;
      window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    });
  }


  /* ---------- 4. KEYBOARD ACTIVATION -----------------------------------
     div/span elements carrying onclick are unreachable by keyboard. They
     now have role=button + tabindex; make Enter and Space activate them. */
  function initKeyboardActivation() {
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
      var el = e.target;
      if (!el || el.getAttribute('role') !== 'button') return;
      if (el.tagName === 'A' || el.tagName === 'BUTTON') return;
      e.preventDefault();
      el.click();
    });
  }

  function boot() { initTouchDropdowns(); initRevealFallback(); initAnchors(); initKeyboardActivation(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

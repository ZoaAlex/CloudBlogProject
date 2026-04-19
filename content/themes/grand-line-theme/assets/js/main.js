/**
 * GRAND LINE — One Piece Ghost Theme
 * Main JavaScript
 */

(function () {
  'use strict';

  /* --------------------------------------------------------
     READING PROGRESS BAR
  -------------------------------------------------------- */
  const progressBar = document.querySelector('.reading-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / docHeight) * 100;
      progressBar.style.width = `${Math.min(scrolled, 100)}%`;
    }, { passive: true });
  }

  /* --------------------------------------------------------
     STICKY NAV ON SCROLL
  -------------------------------------------------------- */
  const nav = document.querySelector('.site-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* --------------------------------------------------------
     MOBILE NAV TOGGLE
  -------------------------------------------------------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.site-nav__list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    // Close on link click
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* --------------------------------------------------------
     SEARCH OVERLAY
  -------------------------------------------------------- */
  const searchOverlay = document.querySelector('.search-overlay');
  const searchTriggers = document.querySelectorAll('[data-search-trigger]');
  const searchClose = document.querySelector('.search-overlay__close');
  const searchInput = document.querySelector('.search-overlay__input');

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput && searchInput.focus(), 100);
  }

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  searchTriggers.forEach(t => t.addEventListener('click', openSearch));
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  if (searchOverlay) {
    searchOverlay.addEventListener('click', e => {
      if (e.target === searchOverlay) closeSearch();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
  });

  /* --------------------------------------------------------
     SCROLL REVEAL (Intersection Observer)
  -------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => observer.observe(el));
  }

  /* --------------------------------------------------------
     DYNAMIC HERO PARALLAX
  -------------------------------------------------------- */
  const heroBg = document.querySelector('.site-hero__bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.3;
      heroBg.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
  }

  /* --------------------------------------------------------
     LAZY LOADING IMAGES
  -------------------------------------------------------- */
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback for older browsers
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length && 'IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            imageObserver.unobserve(img);
          }
        });
      });
      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }

  /* --------------------------------------------------------
     ANIMATED WAVE (Canvas fallback SVG)
  -------------------------------------------------------- */
  // Waves are handled via CSS animations in SVG partials

  /* --------------------------------------------------------
     COPY CODE BUTTON
  -------------------------------------------------------- */
  document.querySelectorAll('pre code').forEach(codeBlock => {
    const pre = codeBlock.parentElement;
    const btn = document.createElement('button');
    btn.className = 'copy-code-btn';
    btn.textContent = 'Copier';
    btn.style.cssText = `
      position:absolute; top:8px; right:8px;
      background:rgba(201,146,42,0.15); border:1px solid rgba(201,146,42,0.3);
      color:#f0bc5e; font-family:'Cinzel',serif; font-size:0.65rem;
      letter-spacing:0.1em; padding:0.25rem 0.6rem; border-radius:4px;
      cursor:pointer; text-transform:uppercase; transition:all 0.3s;
    `;
    btn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(codeBlock.textContent);
      btn.textContent = 'Copié ✓';
      setTimeout(() => { btn.textContent = 'Copier'; }, 2000);
    });
    pre.style.position = 'relative';
    pre.appendChild(btn);
  });

  /* --------------------------------------------------------
     EXTERNAL LINKS → NEW TAB
  -------------------------------------------------------- */
  document.querySelectorAll('a[href]').forEach(link => {
    try {
      const url = new URL(link.href);
      if (url.origin !== window.location.origin) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    } catch (_) {}
  });

  console.log('⚓ Grand Line Theme — Prêt à partir vers le Grand Line !');
})();

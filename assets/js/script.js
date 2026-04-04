/* ============================================================
   BADASS CONSULTING & COMMUNITY — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Language ─────────────────────────────────────────────── */
  const STORAGE_KEY = 'badass_lang';
  let currentLang = localStorage.getItem(STORAGE_KEY) || 'sv';

  const langToggle = document.getElementById('langToggle');

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    // Update all translatable elements
    document.querySelectorAll('[data-sv], [data-en]').forEach(el => {
      const text = el.getAttribute('data-' + lang);
      if (text !== null) {
        // Don't overwrite elements that have child nodes (icons, etc.)
        if (el.children.length === 0) {
          el.textContent = text;
        }
      }
    });

    // Update lang toggle active state
    if (langToggle) {
      langToggle.classList.toggle('sv-active', lang === 'sv');
      langToggle.classList.toggle('en-active', lang === 'en');
    }

    // Update html lang attribute
    document.documentElement.lang = lang === 'sv' ? 'sv' : 'en';
  }

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      applyLanguage(currentLang === 'sv' ? 'en' : 'sv');
    });
  }

  // Apply on load
  applyLanguage(currentLang);


  /* ── Navigation — scroll effect ──────────────────────────── */
  const navbar = document.getElementById('navbar');

  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load


  /* ── Mobile Menu ──────────────────────────────────────────── */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        mobileMenu.classList.add('open');
        mobileMenu.setAttribute('aria-hidden', 'false');
      }
    });

    // Close on any mobile link click
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        closeMenu();
      }
    });
  }


  /* ── Scroll Animations — Intersection Observer ────────────── */
  const fadeEls = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    fadeEls.forEach(el => el.classList.add('visible'));
  }


  /* ── Hero Heading — wrap each line in inner span ──────────── */
  // Enables the slide-up reveal animation per line
  document.querySelectorAll('.hero-heading-line').forEach(line => {
    const text = line.textContent;
    line.textContent = '';
    const inner = document.createElement('span');
    inner.textContent = text;
    line.appendChild(inner);
  });


  /* ── Contact Form ─────────────────────────────────────────── */
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name    = document.getElementById('f-name').value.trim();
      const email   = document.getElementById('f-email').value.trim();
      const message = document.getElementById('f-message').value.trim();

      if (!name || !email || !message) return;

      const subject = encodeURIComponent(
        'Badass Consulting & Community — ' + name
      );
      const body = encodeURIComponent(
        (currentLang === 'sv' ? 'Namn' : 'Name') + ': ' + name +
        '\n' + (currentLang === 'sv' ? 'E-post' : 'Email') + ': ' + email +
        '\n\n' + (currentLang === 'sv' ? 'Meddelande' : 'Message') + ':\n' + message
      );

      window.location.href =
        'mailto:annsofie@gavitander.me?subject=' + subject + '&body=' + body;

      // Show success message
      if (formSuccess) {
        formSuccess.hidden = false;
        // Apply current language to success message
        const successText = formSuccess.getAttribute('data-' + currentLang);
        if (successText) formSuccess.textContent = successText;
      }

      // Reset form after short delay
      setTimeout(() => {
        form.reset();
        if (formSuccess) formSuccess.hidden = true;
      }, 4000);
    });
  }


  /* ── Footer year ──────────────────────────────────────────── */
  const yearEl = document.getElementById('footerYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* ── Smooth scroll polyfill for older Safari ─────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

})();

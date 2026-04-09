/* ============================================================
   VASEEM CHOLAKKAN — PORTFOLIO 2026
   main.js — Theme, Nav, Animations, Clock, Back-to-top
   ============================================================ */

/* ── THEME TOGGLE ─────────────────────────────────────────── */
(function initTheme() {
  const body  = document.body;
  const LIGHT = 'light-theme';
  const saved = localStorage.getItem('theme');

  if (saved === 'light') body.classList.add(LIGHT);

  function syncIcons() {
    const isLight = body.classList.contains(LIGHT);
    document.querySelectorAll('#theme-icon, #theme-icon-mobile').forEach(el => {
      el.className = isLight ? 'bx bxs-moon' : 'bx bxs-sun';
    });
  }
  syncIcons();

  document.querySelectorAll('#theme-btn, #theme-btn-mobile').forEach(btn => {
    btn.addEventListener('click', () => {
      body.classList.toggle(LIGHT);
      localStorage.setItem('theme', body.classList.contains(LIGHT) ? 'light' : 'dark');
      syncIcons();
    });
  });
})();


/* ── NAVBAR — AUTO-HIDE (with anchor-click guard) ────────── */
(function initNavHide() {
  const header = document.getElementById('header');
  let prev = 0;
  let isAnchorScrolling = false;

  // When a nav link is clicked, suppress hide for 800ms
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      isAnchorScrolling = true;
      setTimeout(() => { isAnchorScrolling = false; }, 800);
    });
  });

  window.addEventListener('scroll', () => {
    const curr = window.scrollY;
    if (!isAnchorScrolling) {
      header.classList.toggle('hidden', curr > prev && curr > 80);
    }
    prev = curr;
  }, { passive: true });
})();


/* ── MOBILE MENU TOGGLE ───────────────────────────────────── */
(function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('nav-menu');

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    toggle.classList.toggle('open');
  });

  menu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove('open');
      toggle.classList.remove('open');
    }
  });
})();


/* ── ACTIVE NAV LINK — accurate rootMargin spy ───────────── */
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__link');

  // rootMargin: top -10% bottom -55% means the "active zone" is the
  // band between 10% and 45% from the top of the viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-10% 0px -55% 0px',
    threshold: 0,
  });

  sections.forEach(s => observer.observe(s));
})();


/* ── SCROLL ANIMATIONS — no hero flash ───────────────────── */
(function initScrollAnimations() {
  const els = document.querySelectorAll('[data-animate]');

  // Fire immediately for any element already in the viewport on load
  // (prevents invisible flash on hero section)
  function checkInView(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom >= 0;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  els.forEach(el => {
    if (checkInView(el)) {
      // Already visible — add class after a tiny stagger based on delay attr
      const delay = parseInt(el.getAttribute('data-delay') || '0', 10) * 100;
      setTimeout(() => el.classList.add('in-view'), delay);
    } else {
      observer.observe(el);
    }
  });
})();


/* ── BACK TO TOP ──────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    const start    = window.scrollY;
    const duration = 600;
    let   startT   = null;

    function step(ts) {
      if (!startT) startT = ts;
      const p = Math.min((ts - startT) / duration, 1);
      const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      window.scrollTo(0, start * (1 - ease));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
})();


/* ── CLOCK + AVAILABILITY STATUS ─────────────────────────── */
function showTime() {
  const now   = new Date();
  const h24   = now.getHours();
  const min   = now.getMinutes();
  const sec   = now.getSeconds();
  const day   = now.getDay(); // 0=Sun, 6=Sat
  const h12   = h24 % 12 || 12;
  const ampm  = h24 < 12 ? 'AM' : 'PM';
  const pad   = n => String(n).padStart(2, '0');

  const clockEl = document.getElementById('clock-display');
  const dotEl   = document.getElementById('status-dot');
  const textEl  = document.getElementById('status-text');
  if (!clockEl) return;

  clockEl.textContent = `${pad(h12)}:${pad(min)}:${pad(sec)} ${ampm}`;

  const isWeekend  = day === 0 || day === 6;
  const isSleeping = h24 < 8;

  let color, status;
  if (isSleeping) {
    color  = isWeekend ? '#60a5fa' : '#f87171';
    status = 'Currently sleeping 😴';
  } else if (!isWeekend) {
    color  = '#4ade80';
    status = 'Available now ✓';
  } else {
    color  = '#f87171';
    status = 'Not available (weekend)';
  }

  dotEl.style.background = color;
  dotEl.style.boxShadow  = `0 0 6px ${color}`;
  textEl.textContent     = status;
  textEl.style.color     = color;

  setTimeout(showTime, 1000);
}
showTime();


/* ── DYNAMIC COPYRIGHT YEAR ───────────────────────────────── */
(function () {
  const el = document.getElementById('footer-copy');
  if (el) el.textContent = `© ${new Date().getFullYear()} Built with vanilla JS`;
})();

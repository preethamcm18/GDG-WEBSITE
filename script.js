/**
 * GDG on Campus – RIT Hassan
 * Club Website – Interactive JS
 */
'use strict';

/* ============================================================
   1. BODY LOAD
============================================================ */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  initHeroAnimations();
  initStatCounters();
  createFloatingShapes();
});

/* ============================================================
   2. NAVBAR
============================================================ */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link:not(.btn-join)');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveLink();
  toggleBackToTop();
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  const spans = hamburger.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

document.querySelectorAll('.nav-link, .btn-join').forEach(l => {
  l.addEventListener('click', () => {
    navMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') navMenu.classList.remove('open');
});

/* ============================================================
   3. ACTIVE NAV LINK
============================================================ */
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  const pos = window.scrollY + 100;
  let cur = '';
  sections.forEach(s => {
    if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) cur = s.id;
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === `#${cur}`);
  });
}

/* ============================================================
   4. SMOOTH SCROLL
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ============================================================
   5. AOS – INTERSECTION OBSERVER
============================================================ */
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.getAttribute('data-aos-delay') || 0);
      setTimeout(() => entry.target.classList.add('aos-animate'), delay);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => obs.observe(el));
}
initAOS();

/* ============================================================
   6. HERO – Stagger Animations
============================================================ */
function initHeroAnimations() {
  const items = document.querySelectorAll('.org-item, .hero-badge, .hero-heading, .hero-sub, .hero-actions, .hero-stats');
  items.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 200 + i * 100);
  });
}

/* ============================================================
   7. STAT COUNTERS – Animate on enter
============================================================ */
function initStatCounters() {
  const statEls = document.querySelectorAll('.stat-num[data-count]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const target = parseInt(entry.target.getAttribute('data-count'));
      animateCount(entry.target, target);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  statEls.forEach(el => obs.observe(el));
}

function animateCount(el, target, duration = 1500) {
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * target);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ============================================================
   8. FLOATING SHAPES
============================================================ */
function createFloatingShapes() {
  const container = document.getElementById('floatingShapes');
  if (!container) return;

  const colors = ['#4285f4', '#ea4335', '#fbbc05', '#34a853'];
  const count = window.innerWidth > 768 ? 20 : 10;

  for (let i = 0; i < count; i++) {
    const shape = document.createElement('div');
    const size = Math.random() * 6 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const x = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 20;

    shape.style.cssText = `
      position: absolute;
      left: ${x}%;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${color};
      opacity: 0;
      animation: float-up ${duration}s ${-delay}s linear infinite;
    `;
    container.appendChild(shape);
  }

  // Inject keyframe
  if (!document.getElementById('float-kf')) {
    const style = document.createElement('style');
    style.id = 'float-kf';
    style.textContent = `
      @keyframes float-up {
        0%   { transform: translateY(100vh); opacity: 0; }
        10%  { opacity: 0.5; }
        90%  { opacity: 0.2; }
        100% { transform: translateY(-10vh); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ============================================================
   9. GLASS CARD MOUSE GLOW
============================================================ */
document.querySelectorAll('.glass-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(66,133,244,0.07) 0%, rgba(255,255,255,0.03) 60%)`;
  });
  card.addEventListener('mouseleave', () => { card.style.background = ''; });
});

/* ============================================================
   10. BACK TO TOP
============================================================ */
const bttBtn = document.getElementById('backToTop');

function toggleBackToTop() {
  bttBtn.classList.toggle('visible', window.scrollY > 400);
}

bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ============================================================
   11. BTN RIPPLE EFFECT
============================================================ */
if (!document.getElementById('ripple-kf')) {
  const s = document.createElement('style');
  s.id = 'ripple-kf';
  s.textContent = `@keyframes ripple { to { transform: scale(30); opacity: 0; } }`;
  document.head.appendChild(s);
}

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:10px; height:10px;
      background:rgba(255,255,255,0.35);
      transform:scale(0);
      animation:ripple 0.6s linear;
      left:${e.clientX - rect.left - 5}px;
      top:${e.clientY - rect.top - 5}px;
      pointer-events:none;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

/* ============================================================
   12. PROGRAM LIST HOVER – Color per card
============================================================ */
document.querySelectorAll('.program-card').forEach(card => {
  const color = getComputedStyle(card).getPropertyValue('--pc').trim();
  card.querySelectorAll('.prog-list li').forEach(li => {
    li.addEventListener('mouseenter', () => {
      li.style.color = color || '#4285f4';
      li.style.background = `rgba(${hexToRgb(color || '#4285f4')},0.07)`;
    });
    li.addEventListener('mouseleave', () => { li.style.color = ''; li.style.background = ''; });
  });
});

function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : '66,133,244';
}

/* ============================================================
   13. GOOGLE DOTS – Interactive hover
============================================================ */
document.querySelectorAll('.dot').forEach(dot => {
  dot.style.cursor = 'pointer';
  dot.addEventListener('click', () => {
    dot.style.transform = 'scale(2)';
    setTimeout(() => { dot.style.transform = ''; }, 300);
  });
});

console.log('%c🎓 GDG on Campus – RIT Hassan', 'font-size:20px;font-weight:bold;color:#4285f4;font-family:monospace;');
console.log('%cLearn · Build · Share · Grow', 'font-size:14px;color:#8b949e;font-family:monospace;');

import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import './styles.css';

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ── Toast ──────────────────────────────────────────────────────────────── */
const toastEl = $('[data-toast]');
let toastTimer;
function toast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 3200);
}

/* ── Header & navigation ───────────────────────────────────────────────── */
const header = $('[data-header]');
const toggle = $('[data-nav-toggle]');
const menu = $('[data-nav-menu]');

function setMenu(open, { focusToggle = false } = {}) {
  toggle.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  if (open) $('a', menu)?.focus();
  else if (focusToggle) toggle.focus();
}

toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu?.addEventListener('click', (e) => {
  if (e.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu?.classList.contains('is-open')) setMenu(false, { focusToggle: true });
});
window.matchMedia('(min-width: 861px)').addEventListener('change', (e) => e.matches && setMenu(false));

// Highlight the nav link of the section in view.
const navLinks = $$('[data-nav-link]');
const sectionObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      navLinks.forEach((link) => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  },
  { rootMargin: '-45% 0px -50% 0px' },
);
navLinks.forEach((link) => {
  const section = document.getElementById(link.hash.slice(1));
  if (section) sectionObserver.observe(section);
});

/* ── Scroll-driven bits: header state + backdrop parallax ──────────────── */
const backdrop = $('[data-backdrop]');
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    header?.classList.toggle('is-scrolled', y > 12);
    if (!motionQuery.matches) backdrop?.style.setProperty('--parallax', `${(y * -0.06).toFixed(1)}px`);
    if (pendingReveals.size) revealPassed();
    ticking = false;
  });
}
window.addEventListener('scroll', onScroll, { passive: true });

/* ── Reveal on scroll ──────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) reveal(entry.target);
    }
  },
  { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
);
const pendingReveals = new Set($$('[data-reveal]'));
pendingReveals.forEach((el) => revealObserver.observe(el));

function reveal(el) {
  el.classList.add('is-visible');
  revealObserver.unobserve(el);
  pendingReveals.delete(el);
}

// A very fast scroll (End key, flick) can jump past elements without them ever
// intersecting, so also reveal anything that is already above the viewport bottom.
function revealPassed() {
  for (const el of pendingReveals) if (el.getBoundingClientRect().top < window.innerHeight) reveal(el);
}
onScroll();
requestAnimationFrame(() => document.documentElement.classList.add('is-loaded'));

/* ── 3D tilt on cards (fine pointers only) ─────────────────────────────── */
function bindTilt(card) {
  let frame;
  card.addEventListener('pointermove', (e) => {
    if (motionQuery.matches || !finePointer.matches) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--rx', `${((0.5 - y) * 7).toFixed(2)}deg`);
      card.style.setProperty('--ry', `${((x - 0.5) * 9).toFixed(2)}deg`);
      card.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
    });
  });
  card.addEventListener('pointerleave', () => {
    cancelAnimationFrame(frame);
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  });
}
$$('[data-tilt]').forEach(bindTilt);

/* ── Placeholder links & copy email ────────────────────────────────────── */
document.addEventListener('click', (e) => {
  const placeholder = e.target.closest('[data-placeholder]');
  if (placeholder) {
    e.preventDefault();
    toast('This link is a placeholder — add the real address in src/content.js.');
  }
});

$$('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copy;
    if (/\[[^\]]+\]/.test(value)) {
      toast('The email is still a placeholder — add yours in src/content.js.');
      return;
    }
    const label = $('[data-copy-label]', button);
    try {
      await navigator.clipboard.writeText(value);
      if (label) label.textContent = 'Copied';
      toast(`Copied ${value}`);
      setTimeout(() => label && (label.textContent = 'Copy email'), 2200);
    } catch {
      toast(value);
    }
  });
});

const year = $('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());

/* ── Hero 3D (lazy, with CSS fallback) ─────────────────────────────────── */
function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

const visual = $('[data-hero-visual]');
const logo = $('[data-logo]');
const saveData = navigator.connection?.saveData === true;

if ((visual || logo) && supportsWebGL() && !saveData) {
  let scenes = [];
  const reveal = (el) => () => requestAnimationFrame(() => el.classList.add('is-webgl'));
  const start = () =>
    import('./scene.js')
      .then(({ initScene, initLogo }) => {
        const reducedMotion = motionQuery.matches;
        if (visual)
          scenes.push(
            initScene({
              canvas: $('[data-hero-canvas]', visual),
              container: visual,
              anchor: $('[data-orb-anchor]', visual),
              reducedMotion,
              onReady: reveal(visual),
            }),
          );
        if (logo)
          scenes.push(
            initLogo({
              canvas: $('[data-logo-canvas]', logo),
              container: logo,
              hoverTarget: logo.closest('a') ?? logo,
              reducedMotion,
              onReady: reveal(logo),
            }),
          );
      })
      .catch((err) => console.warn('3D scene unavailable, using fallback.', err));

  if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 1200 });
  else setTimeout(start, 200);

  // Restart the scenes if the motion preference changes.
  motionQuery.addEventListener('change', () => {
    scenes.forEach((s) => s?.dispose());
    scenes = [];
    visual?.classList.remove('is-webgl');
    logo?.classList.remove('is-webgl');
    start();
  });
}

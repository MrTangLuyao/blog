/* ============================================================
 * blog/blog-core.js
 * Cross-cutting UI primitives + manifest plumbing for blog.html.
 *
 *   Ripple
 *     bindRipples()        — bind ripple effect to any new
 *                            .ripple-surface element
 *
 *   Fade-in (IntersectionObserver)
 *     bindFadeIn()         — re-bind on each render
 *
 *   Manifest + post-display utilities
 *     manifest             — { posts: [...] } (mutable)
 *     loadManifest()       — read window.__BLOG_MANIFEST,
 *                            drop drafts, sort (pinned → date desc)
 *     pickLang(field)      — resolve a {zh, en} field via currentLang
 *     formatDate(iso)      — Luxon-formatted date per UI locale
 *     postCoverUrl(post)   — build "blog/blog_data/<slug>/<file>" or null
 * ============================================================ */

/* ─── Ripple ─── */
function bindRipples() {
  const buttons = document.querySelectorAll('.ripple-surface:not(.ripple-bound)');
  for (const button of buttons) {
    button.classList.add('ripple-bound');
    const fire = (cx, cy) => {
      const circle = document.createElement("span");
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;
      const rect = button.getBoundingClientRect();
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${cx - rect.left - radius}px`;
      circle.style.top  = `${cy - rect.top  - radius}px`;
      circle.classList.add("ripple");
      const existing = button.querySelector('.ripple');
      if (existing) existing.remove();
      button.appendChild(circle);
    };
    button.addEventListener('touchstart', (e) => {
      button._lastTouch = Date.now();
      fire(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    button.addEventListener('mousedown', (e) => {
      if (Date.now() - (button._lastTouch || 0) < 500) return;
      fire(e.clientX, e.clientY);
    });
  }
}

/* ─── Brand-dropdown nav ─── */
const brandBtn = document.getElementById('brand-dropdown-btn');
const brandMenu = document.getElementById('brand-dropdown-menu');
const brandIcon = document.getElementById('brand-dropdown-icon');

brandBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = brandMenu.classList.contains('is-open');
  if (isOpen) {
    brandMenu.classList.remove('is-open');
    brandIcon.style.transform = 'rotate(0deg)';
  } else {
    brandMenu.classList.add('is-open');
    brandIcon.style.transform = 'rotate(180deg)';
  }
});

document.addEventListener('click', (e) => {
  if (!brandBtn.contains(e.target) && !brandMenu.contains(e.target)) {
    brandMenu.classList.remove('is-open');
    brandIcon.style.transform = 'rotate(0deg)';
  }
});

/* ─── Fade-in observer ─── */
let fadeObserver = null;
function bindFadeIn() {
  if (fadeObserver) fadeObserver.disconnect();
  fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.05 });
  document.querySelectorAll('.fade-in:not(.visible)').forEach(el => fadeObserver.observe(el));
}

/* ─── Manifest + post utilities ─── */
let manifest = { posts: [] };

function loadManifest() {
  const m = window.__BLOG_MANIFEST;
  if (!m) {
    console.error('blog/blog_data/manifest.js did not register window.__BLOG_MANIFEST');
    manifest = { posts: [] };
    return;
  }
  manifest = {
    ...m,
    posts: (m.posts || [])
      .filter(p => !p.draft)
      .sort((a, b) => {
        const pa = a.pinned ? 1 : 0;
        const pb = b.pinned ? 1 : 0;
        if (pa !== pb) return pb - pa;
        return (b.date || '').localeCompare(a.date || '');
      })
  };
}

function pickLang(field, fallback = '') {
  if (field == null) return fallback;
  if (typeof field === 'string') return field;
  return field[currentLang] || field.en || field.zh || fallback;
}

function formatDate(iso) {
  if (!iso) return '';
  try {
    const d = luxon.DateTime.fromISO(iso).setLocale(currentLang === 'zh' ? 'zh-CN' : 'en');
    return d.toFormat(currentLang === 'zh' ? 'yyyy.MM.dd' : 'LLL d, yyyy');
  } catch (e) { return iso; }
}

function postCoverUrl(post) {
  if (!post.cover) return null;
  return `blog/blog_data/${post.slug}/${post.cover}`;
}

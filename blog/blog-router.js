/* ============================================================
 * blog/blog-router.js
 * Hash router + boot for blog.html.
 * Loaded LAST so every cross-file symbol it references is already
 * defined.
 *
 *   route()         — read location.hash:
 *                       ''         → list view (renderTagBar + renderList)
 *                       '#<slug>'  → reader view (renderReader)
 *                     also flips visibility, scrolls, manages TOC.
 *
 *   Boot block (last lines): loadManifest + applyLang(currentLang)
 *   + bindFadeIn + bindRipples — kicks off first paint.
 *
 * Cross-file dependencies — every symbol below is defined in an
 * earlier blog-*.js script:
 *   currentLang, applyLang     ← blog-i18n.js
 *   loadManifest, manifest,
 *   bindFadeIn, bindRipples    ← blog-core.js
 *   updateTocBtn, clearToc     ← blog-toc.js
 *   renderTagBar, renderList,
 *   renderReader               ← blog-views.js
 * ============================================================ */

function route() {
  // Clear any leftover ripple spans before swapping views. A finished ripple
  // sitting on a persistent element (e.g. the reader "back" button) would
  // otherwise replay its CSS animation when its container toggles back from
  // display:none to block on navigation.
  document.querySelectorAll('.ripple').forEach(r => r.remove());

  const slug = location.hash.replace(/^#/, '').trim();
  const list = document.getElementById('view-list');
  const reader = document.getElementById('view-reader');
  if (slug) {
    list.style.display = 'none';
    reader.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'instant' });
    updateTocBtn();
    renderReader(slug);
  } else {
    reader.style.display = 'none';
    list.style.display = 'block';
    clearToc();
    renderTagBar();
    renderList();
  }
}

window.addEventListener('hashchange', route);

/* ─── Boot ─── */
loadManifest();
applyLang(currentLang);
bindFadeIn();
bindRipples();

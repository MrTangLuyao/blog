/* ============================================================
 * blog/blog-router.js
 * Path-based hash router + boot for index.html.  (The Librarian update)
 * Loaded LAST, so every Blog.* method it calls is already attached.
 *
 *   Hash grammar:
 *     ''  or '#'             → root list (head_librarian)
 *     '#/sql'                → collection list view
 *     '#/sql/sql-basics-1'   → reader
 *     '#welcome'             → still works (single segment, no slash) for
 *                              backward-compatible top-level post links
 *
 *   Blog.route()  — resolve the path against the Librarian, then render the
 *                   collection list, the reader, a not-found, or a load-error.
 *   Boot          — bind lang toggle, applyLang (→ first route), fade/ripple.
 * ============================================================ */

(function (Blog) {
  'use strict';

  function parseHash() {
    return location.hash.replace(/^#/, '').replace(/^\/+/, '').replace(/\/+$/, '').trim();
  }

  // Point the shared sticky "Back" button one level up; hide it at the root.
  function setBackButton(path) {
    const back = document.getElementById('back-btn');
    if (!back) return;
    const segs = path ? path.split('/').filter(Boolean) : [];
    if (segs.length === 0) { back.style.display = 'none'; return; }
    const parent = segs.slice(0, -1).join('/');
    back.setAttribute('href', parent ? `#/${parent}` : '#');
    back.style.display = '';
  }

  Blog.route = async function route() {
    // Clear leftover ripple spans before swapping views (a finished ripple on a
    // persistent element replays its CSS animation when its container toggles
    // back from display:none to block).
    document.querySelectorAll('.ripple').forEach(r => r.remove());

    const path = parseHash();
    setBackButton(path);
    const list = document.getElementById('view-list');
    const reader = document.getElementById('view-reader');

    let res;
    try {
      res = await Blog.resolvePath(path);
    } catch (e) {
      // root (or an ancestor) librarian failed to load
      reader.style.display = 'none';
      list.style.display = 'block';
      Blog.clearToc();
      Blog.renderListError(path, e);
      return;
    }

    if (!res.ok) {
      list.style.display = 'none';
      reader.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'instant' });
      Blog.clearToc();
      Blog.updateTocBtn();
      Blog.renderNotFound();
      return;
    }

    if (res.kind === 'post') {
      list.style.display = 'none';
      reader.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'instant' });
      Blog.updateTocBtn();
      Blog.renderReader(path, res.entry, res.chain);
    } else {
      reader.style.display = 'none';
      list.style.display = 'block';
      Blog.clearToc();
      Blog.renderList(path, res.lib, res.chain);
    }
  };

  window.addEventListener('hashchange', () => Blog.route());

  // Language toggle — bound here (was an inline onclick="toggleLang()" in HTML).
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) langBtn.addEventListener('click', () => Blog.toggleLang());

  /* ─── Boot ─── */
  Blog.applyLang(Blog.currentLang);   // applies i18n strings, then calls Blog.route()
  Blog.bindFadeIn();
  Blog.bindRipples();

})(window.Blog = window.Blog || {});

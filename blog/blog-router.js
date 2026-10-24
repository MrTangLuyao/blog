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
 *
 *   Protected entries: a top-level entry with "protected": true in
 *   head_librarian.json puts a full-screen notice (Blog.openGate) in front of
 *   every path under it, whether reached by a click or a direct link. After
 *   Continue, moving around inside that entry doesn't ask again; leaving it
 *   (or reloading) re-arms the notice. Cancel goes back to where the reader
 *   came from, or to the blog home when the link was opened directly.
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

  let _routeSeq = 0;          // bumps per route(); a stale await must not render
  let _unlockedTop = null;    // slug of the protected top-level entry the reader accepted
  let _renderedPath = null;   // last path actually rendered; null until the first paint

  // Cancel on the notice: step back to the page the reader came from; a
  // direct link has no such page in this tab, so land on the blog home.
  function leaveGate(seq) {
    if (seq !== _routeSeq) return;
    if (_renderedPath !== null) { history.back(); return; }
    history.replaceState(null, '', location.pathname + location.search);
    Blog.route();
  }

  Blog.route = async function route() {
    // Clear leftover ripple spans before swapping views (a finished ripple on a
    // persistent element replays its CSS animation when its container toggles
    // back from display:none to block). The protected-content notice fades
    // instead of toggling display, so its Cancel ripple is left to finish.
    document.querySelectorAll('.ripple').forEach(r => { if (!r.closest('#protect-gate')) r.remove(); });

    const seq = ++_routeSeq;
    const path = parseHash();
    setBackButton(path);

    let res;
    try {
      res = await Blog.resolvePath(path);
    } catch (e) {
      if (seq !== _routeSeq) return;
      // root (or an ancestor) librarian failed to load
      Blog.closeGate();
      document.getElementById('view-reader').style.display = 'none';
      document.getElementById('view-list').style.display = 'block';
      Blog.clearToc();
      Blog.renderListError(path, e);
      _renderedPath = path;
      return;
    }
    if (seq !== _routeSeq) return;   // a newer navigation has taken over

    const top = res.chain[0];
    if (top && top.entry.protected) {
      if (_unlockedTop !== top.slug) {
        Blog.openGate(
          () => {
            if (seq !== _routeSeq) return;
            _unlockedTop = top.slug;
            show(path, res);
          },
          () => leaveGate(seq)
        );
        return;
      }
    } else {
      _unlockedTop = null;
    }
    Blog.closeGate();
    show(path, res);
  };

  function show(path, res) {
    const list = document.getElementById('view-list');
    const reader = document.getElementById('view-reader');
    _renderedPath = path;

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
  }

  window.addEventListener('hashchange', () => Blog.route());

  // Coming back through the browser's back/forward cache restores the page as
  // it was left, notice already accepted; treat it as a fresh visit instead.
  window.addEventListener('pageshow', e => {
    if (!e.persisted) return;
    _unlockedTop = null;
    _renderedPath = null;
    Blog.route();
  });

  // Language toggle — bound here (was an inline onclick="toggleLang()" in HTML).
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) langBtn.addEventListener('click', () => Blog.toggleLang());

  /* ─── Boot ─── */
  Blog.applyLang(Blog.currentLang);   // applies i18n strings, then calls Blog.route()
  Blog.bindFadeIn();
  Blog.bindRipples();

})(window.Blog = window.Blog || {});

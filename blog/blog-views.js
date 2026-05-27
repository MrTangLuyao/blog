/* ============================================================
 * blog/blog-views.js
 * List + reader render functions for index.html.  (The Librarian update)
 *
 * Attaches to window.Blog:
 *   Blog.renderList(path, lib, chain)    — folder view: breadcrumb + tag bar +
 *                                          post & collection cards for one level
 *   Blog.renderReader(path, entry, chain)— reader skeleton, await body, buildToc
 *   Blog.renderNotFound()                — "post not found" view
 *   Blog.renderListError(path, err)      — librarian failed to load
 *
 * Cross-file deps (all on window.Blog): translations, currentLang, pickLang,
 *   formatDate, coverUrl, bindRipples, bindFadeIn, buildToc, dataPath.
 * Body highlighting uses window.highlightAllCode (blog-syntax.js) and
 * window.BlogInterpreter.render (blog-interpreter.js).
 * ============================================================ */

(function (Blog) {
  'use strict';

  let activeTag = '__all';
  let _activeListPath = null;   // reset the tag filter when entering a new level

  /* ─── Post → code language ───────────────────────────────────
     Map a post's tags to the highlight.js language its code blocks use, so
     blog-syntax.js colours them deterministically (C is hard to auto-detect).
     Returns null when no tag names a known language → auto-detection. */
  const CODE_LANG_BY_TAG = {
    c: 'c', 'c++': 'cpp', cpp: 'cpp',
    python: 'python', py: 'python',
    sql: 'sql',
    bash: 'bash', shell: 'bash', sh: 'bash',
    json: 'json',
    javascript: 'javascript', js: 'javascript',
    html: 'xml', xml: 'xml',
  };
  function postCodeLang(entry) {
    if (!entry || !Array.isArray(entry.tags)) return null;
    for (const tag of entry.tags) {
      const lang = CODE_LANG_BY_TAG[String(tag).toLowerCase()];
      if (lang) return lang;
    }
    return null;
  }

  // child path of an entry that sits directly under parentPath
  function childPath(parentPath, slug) {
    return parentPath ? `${parentPath}/${slug}` : slug;
  }
  function hashFor(path) { return path ? `#/${path}` : '#'; }

  /* ─── Breadcrumb ─── */
  function renderBreadcrumb(chain) {
    const el = document.getElementById('breadcrumb');
    if (!el) return;
    const t = Blog.translations[Blog.currentLang];
    if (!chain || !chain.length) { el.innerHTML = ''; el.style.display = 'none'; return; }
    el.style.display = '';
    const crumbs = [`<a class="bc-link" href="#">${t['lib-home']}</a>`];
    chain.forEach((c, i) => {
      const label = Blog.pickLang(c.entry.title) || c.slug;
      const isLast = i === chain.length - 1;
      crumbs.push(isLast
        ? `<span class="bc-current">${label}</span>`
        : `<a class="bc-link" href="${hashFor(c.path)}">${label}</a>`);
    });
    el.innerHTML = crumbs.join('<span class="bc-sep">›</span>');
  }

  /* ─── Tag bar (scoped to the current level's entries) ─── */
  function renderTagBar(entries, rerender) {
    const bar = document.getElementById('tag-bar');
    if (!bar) return;
    const tags = new Set();
    entries.forEach(e => (e.tags || []).forEach(tg => tags.add(tg)));
    if (tags.size === 0) { bar.innerHTML = ''; bar.style.display = 'none'; return; }
    bar.style.display = '';
    const allLabel = Blog.translations[Blog.currentLang]['blog-tag-all'] || 'All';
    const btn = (tag, label, active) => `
      <button class="ripple-surface ripple-surface-variant px-4 py-1.5 rounded-m3-full text-[13px] font-medium transition-colors ${active ? 'bg-m3-primaryContainer text-m3-onPrimaryContainer' : 'bg-m3-surfaceContainer text-m3-onSurfaceVariant hover:bg-m3-surfaceContainerHigh hover:text-m3-onSurface'}" data-tag="${tag}">${label}</button>`;
    bar.innerHTML = btn('__all', allLabel, activeTag === '__all') +
      [...tags].sort().map(tg => btn(tg, tg, activeTag === tg)).join('');
    bar.querySelectorAll('button[data-tag]').forEach(b => {
      b.addEventListener('click', () => { activeTag = b.dataset.tag; rerender(); });
    });
    Blog.bindRipples();
  }

  /* ─── Compact list rows — flat, one line, no tags / reading time ─── */
  const PIN_SVG = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(20deg)"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>';
  const FOLDER_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h5l2 2h9a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/></svg>';

  function articleThumb(entry, parentPath) {
    const initial = (Blog.pickLang(entry.title) || entry.slug).trim().charAt(0).toUpperCase();
    const cover = Blog.coverUrl(entry, parentPath);
    return cover
      ? `<span class="list-row__thumb"><img src="${cover}" alt="" loading="lazy" onerror="this.parentElement.textContent='${initial}'"></span>`
      : `<span class="list-row__thumb">${initial}</span>`;
  }
  // collections always show the folder icon — that's their visual signature
  const folderThumb = `<span class="list-row__thumb list-row__thumb--folder">${FOLDER_SVG}</span>`;

  // fixed-width pin slot, present on every row so titles line up (filled only when pinned)
  function pinSlot(entry) {
    return `<span class="list-row__pin">${entry.pinned ? PIN_SVG : ''}</span>`;
  }
  function dateMeta(entry) {
    return `<span class="list-row__meta">${Blog.formatDate(entry.date)}</span>`;
  }

  function postRow(entry, parentPath) {
    return `
      <a class="list-row ripple-surface group fade-in${entry.pinned ? ' pinned' : ''}" href="${hashFor(childPath(parentPath, entry.slug))}">
        ${articleThumb(entry, parentPath)}
        ${pinSlot(entry)}
        <span class="list-row__title">${Blog.pickLang(entry.title)}</span>
        ${dateMeta(entry)}
      </a>`;
  }

  function collectionRow(entry, parentPath) {
    return `
      <a class="list-row list-row--collection ripple-surface group fade-in${entry.pinned ? ' pinned' : ''}" href="${hashFor(childPath(parentPath, entry.slug))}">
        ${folderThumb}
        ${pinSlot(entry)}
        <span class="list-row__title">${Blog.pickLang(entry.title)}</span>
        ${dateMeta(entry)}
      </a>`;
  }

  /* ─── List view (one collection level) ─── */
  Blog.renderList = function renderList(path, lib, chain) {
    if (_activeListPath !== path) { activeTag = '__all'; _activeListPath = path; }
    const entries = (lib && lib.entries) || [];

    renderBreadcrumb(chain);
    renderTagBar(entries, () => Blog.renderList(path, lib, chain));

    const list = document.getElementById('blog-list');
    const empty = document.getElementById('blog-empty');
    const filtered = activeTag === '__all'
      ? entries
      : entries.filter(e => (e.tags || []).includes(activeTag));

    if (filtered.length === 0) {
      list.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';
    list.innerHTML = filtered.map(e =>
      e.kind === 'collection' ? collectionRow(e, path) : postRow(e, path)
    ).join('');
    Blog.bindFadeIn();
    Blog.bindRipples();
  };

  Blog.renderListError = function renderListError(path, err) {
    renderBreadcrumb(null);
    const bar = document.getElementById('tag-bar'); if (bar) bar.innerHTML = '';
    const empty = document.getElementById('blog-empty'); if (empty) empty.style.display = 'none';
    const list = document.getElementById('blog-list');
    const t = Blog.translations[Blog.currentLang];
    list.innerHTML = `
      <div class="text-center py-16 fade-in">
        <p class="text-m3-onSurfaceVariant mb-3">${t['lib-load-error']}</p>
        <p class="text-xs font-mono text-m3-onSurfaceVariant/50">${String(err).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'})[c])}</p>
      </div>`;
    Blog.bindFadeIn();
  };

  /* ─── Post body loader ─────────────────────────────────────────
   * md  → fetch blog/blog_data/<path>/post.<lang>.md  (raw text)
   * html→ inject <script src=…/post.<lang>.js> which registers the body into
   *        window.__BLOG_POSTS['<slug>:<lang>'] (slug-keyed, so a post keeps
   *        working even after it's moved into a collection folder).
   * ───────────────────────────────────────────────────────────── */
  const _bodyLoading = {};
  const _mdCache = {};
  function loadPostBody(path, lang, type) {
    const slug = path.split('/').pop();
    const key = `${path}:${lang}`;

    if (type === 'md') {
      if (_mdCache[key] != null) return Promise.resolve(_mdCache[key]);
      if (_bodyLoading[key]) return _bodyLoading[key];
      _bodyLoading[key] = fetch(Blog.dataPath(path, `post.${lang}.md`))
        .then(r => { if (!r.ok) throw new Error(`post.${lang}.md → HTTP ${r.status}`); return r.text(); })
        .then(txt => { delete _bodyLoading[key]; _mdCache[key] = txt; return txt; })
        .catch(e => { delete _bodyLoading[key]; throw e; });
      return _bodyLoading[key];
    }

    const regKey = `${slug}:${lang}`;
    const cached = (window.__BLOG_POSTS || {})[regKey];
    if (cached != null) return Promise.resolve(cached);
    if (_bodyLoading[key]) return _bodyLoading[key];

    _bodyLoading[key] = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = Blog.dataPath(path, `post.${lang}.js`);
      script.async = false;
      script.onload = () => {
        delete _bodyLoading[key];
        const body = (window.__BLOG_POSTS || {})[regKey];
        if (body != null) resolve(body);
        else reject(new Error(`Missing window.__BLOG_POSTS['${regKey}']`));
      };
      script.onerror = () => { delete _bodyLoading[key]; reject(new Error(`Failed to load ${script.src}`)); };
      document.head.appendChild(script);
    });
    return _bodyLoading[key];
  }

  /* In-post anchor links (e.g. README's EN/中文 nav). The router treats any
     hash change as navigation, so intercept clicks on in-post #anchors and
     smooth-scroll instead — same trick the TOC uses. */
  function bindReaderAnchors(root) {
    root.querySelectorAll('a[href^="#"]').forEach(a => {
      const raw = a.getAttribute('href').slice(1);
      if (!raw) return;
      let id = raw;
      try { id = decodeURIComponent(raw); } catch (_) {}
      a.addEventListener('click', e => {
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  Blog.renderNotFound = function renderNotFound() {
    const reader = document.getElementById('reader-content');
    const t = Blog.translations[Blog.currentLang];
    reader.innerHTML = `
      <div class="text-center py-20 fade-in">
        <h2 class="text-2xl font-bold text-m3-onSurface mb-4">${t['not-found-title']}</h2>
        <p class="text-m3-onSurfaceVariant mb-8">${t['not-found-desc']}</p>
        <a class="ripple-surface bg-m3-primaryContainer text-m3-onPrimaryContainer px-6 py-2.5 rounded-m3-full font-bold" href="#">${t['not-found-back']} →</a>
      </div>`;
    requestAnimationFrame(() => {
      const wrapper = reader.querySelector('.fade-in');
      if (wrapper) wrapper.classList.add('visible');
    });
    Blog.bindRipples();
  };

  /* ─── Reader view ─── */
  Blog.renderReader = async function renderReader(path, entry, chain) {
    const reader = document.getElementById('reader-content');
    const t = Blog.translations[Blog.currentLang];

    const segs = path.split('/');
    const slug = segs[segs.length - 1];
    const parentPath = segs.slice(0, -1).join('/');

    const tagsHtml = (entry.tags || []).map(tg => `<span class="px-3 py-1 rounded-m3-sm text-[12px] font-mono text-m3-primary bg-m3-primaryContainer/30">${tg}</span>`).join('');
    const minLabel = t['reader-min'];
    const cover = Blog.coverUrl(entry, parentPath);

    const updatedHtml = (entry.updated && entry.updated !== entry.date)
      ? `<span class="w-1 h-1 rounded-full bg-m3-onSurfaceVariant/50"></span><span class="italic">${t['reader-updated']} ${Blog.formatDate(entry.updated)}</span>` : '';
    const pinHtml = entry.pinned
      ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-m3-full text-[10px] font-bold uppercase tracking-widest text-m3-primary bg-m3-primaryContainer/40"><svg width="10" height="10" class="rotate-[20deg]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>${t['reader-pinned']}</span>` : '';

    reader.innerHTML = `
      <div class="fade-in">
        <div class="flex items-start justify-between gap-3 mb-6">
          <div class="flex flex-wrap items-center gap-3 text-sm text-m3-onSurfaceVariant tracking-wider">
            ${pinHtml}
            <span class="font-bold text-m3-primary tabular-nums">${Blog.formatDate(entry.date)}</span>
            ${updatedHtml}
            ${entry.readingTime ? `<span class="w-1 h-1 rounded-full bg-m3-onSurfaceVariant/50"></span><span>${entry.readingTime} ${minLabel}</span>` : ''}
          </div>
          <span class="shrink-0 px-2.5 py-0.5 rounded-m3-sm text-[11px] font-mono uppercase tracking-wider text-m3-onSurfaceVariant/70 bg-m3-surfaceContainerHigh">${(entry.type || 'html') === 'md' ? 'Markdown' : 'HTML'}</span>
        </div>

        <h1 class="text-4xl md:text-5xl font-extrabold text-m3-onSurface leading-tight mb-8">${Blog.pickLang(entry.title)}</h1>
        ${tagsHtml ? `<div class="flex flex-wrap gap-2 mb-12">${tagsHtml}</div>` : ''}

        ${cover ? `<div class="w-full rounded-m3-xl overflow-hidden mb-14 shadow-xl shadow-black/30"><img src="${cover}" class="w-full h-auto object-cover" alt=""></div>` : ''}

        <div class="reader-body" id="reader-body"><p class="text-m3-onSurfaceVariant/50 italic">…</p></div>

        <div class="mt-24 pt-8 border-t border-m3-outlineVariant">
          <span class="text-sm text-m3-onSurfaceVariant">— ${Blog.formatDate(entry.date)}${(entry.updated && entry.updated !== entry.date) ? ` · ${t['reader-updated']} ${Blog.formatDate(entry.updated)}` : ''}</span>
        </div>
      </div>`;

    requestAnimationFrame(() => {
      const wrapper = reader.querySelector('.fade-in');
      if (wrapper) wrapper.classList.add('visible');
    });
    Blog.bindRipples();

    const lang = entry.lang || 'both';
    const wantedLang = (lang === 'both') ? Blog.currentLang : lang;
    const type = entry.type || 'html';

    // Turn a RAW body (HTML or Markdown) into injectable HTML, then run the
    // DOM post-processors (highlight + TOC operate on the resulting DOM).
    function writeBody(raw) {
      const el = document.getElementById('reader-body');
      if (!el || el.dataset.path !== path) return false;
      let html = window.BlogInterpreter.render(raw, { type, basePath: path });
      // A post body hardcodes its own assets as blog/blog_data/<slug>/… . When the
      // post lives inside a collection its real path is deeper, so retarget that
      // prefix to the full path — keeps HTML posts (e.g. <iframe> anims) relocatable.
      if (path !== slug) {
        html = html.split(`blog/blog_data/${slug}/`).join(`blog/blog_data/${path}/`);
      }
      el.innerHTML = html;
      // Wrap wide tables so they scroll inside their own box on mobile instead
      // of stretching the page past the viewport (works for md + raw-HTML).
      el.querySelectorAll('table').forEach(function (tbl) {
        const parent = tbl.parentNode;
        if (!parent || (parent.classList && parent.classList.contains('table-scroll'))) return;
        const wrap = document.createElement('div');
        wrap.className = 'table-scroll';
        parent.insertBefore(wrap, tbl);
        wrap.appendChild(tbl);
      });
      if (typeof window.highlightAllCode === 'function') window.highlightAllCode(el, postCodeLang(entry));
      bindReaderAnchors(el);
      return true;
    }

    const bodyEl = document.getElementById('reader-body');
    if (bodyEl) bodyEl.dataset.path = path;

    try {
      let raw = await loadPostBody(path, wantedLang, type);
      if (!raw && type !== 'md') {
        if (window.__BLOG_POSTS) delete window.__BLOG_POSTS[`${slug}:${wantedLang}`];
        raw = await loadPostBody(path, wantedLang, type);
      }
      writeBody(raw);
      Blog.buildToc();
    } catch (e) {
      if (lang === 'both') {
        const altLang = wantedLang === 'zh' ? 'en' : 'zh';
        try {
          const raw = await loadPostBody(path, altLang, type);
          writeBody(raw);
          Blog.buildToc();
          return;
        } catch (_) {}
      }
      const el = document.getElementById('reader-body');
      if (el && el.dataset.path === path) {
        el.innerHTML = `
          <p class="text-red-400">Failed to load post body.</p>
          <pre class="bg-m3-surfaceContainer p-4 rounded-m3-md border border-m3-outlineVariant overflow-auto"><code class="text-m3-onSurface text-xs">${String(e).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'})[c])}</code></pre>`;
      }
    }
  };

})(window.Blog = window.Blog || {});

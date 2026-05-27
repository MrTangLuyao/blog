/* ============================================================
 * blog/blog-core.js
 * Cross-cutting UI primitives + the Librarian (recursive library
 * tree) loader for index.html.
 *
 * Everything public is attached to the single window.Blog namespace
 * (The Librarian update — was a pile of bare globals before). Internal
 * helpers stay local to this IIFE.
 *
 *   UI primitives
 *     Blog.bindRipples()   — ripple effect on .ripple-surface elements
 *     Blog.bindFadeIn()    — IntersectionObserver fade-in
 *
 *   Lang-aware helpers (Blog.currentLang is owned by blog-i18n.js)
 *     Blog.pickLang(field, fallback)
 *     Blog.formatDate(iso)
 *     Blog.coverUrl(entry, parentPath)
 *
 *   The Librarian — a recursive tree of librarian.json files
 *     blog/blog_data/head_librarian.json            (root)
 *     blog/blog_data/<path>/librarian.json          (a collection)
 *     Blog.loadLibrarian(path)   — fetch + cache + normalize one librarian
 *     Blog.resolvePath(path)     — walk root→path, returns {kind, entry|lib, chain}
 *     Blog.dataPath / Blog.librarianUrl / Blog.coverUrl  — path builders
 * ============================================================ */

(function (Blog) {
  'use strict';

  /* ─── Ripple ─── */
  Blog.bindRipples = function bindRipples() {
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
        // Remove the span once its 600ms animation finishes. Without this the
        // finished (invisible) span lingers on persistent elements like the
        // reader "back" button, and toggling #view-reader between display:none
        // and block (on navigation) re-fires the CSS animation — a phantom
        // ripple replays every time you open a post.
        circle.addEventListener('animationend', () => circle.remove());
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
  };

  /* ─── Brand-dropdown nav (immediate setup at load) ─── */
  const brandBtn = document.getElementById('brand-dropdown-btn');
  const brandMenu = document.getElementById('brand-dropdown-menu');
  const brandIcon = document.getElementById('brand-dropdown-icon');

  if (brandBtn && brandMenu && brandIcon) {
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
  }

  /* ─── About / changelog modal ─── */
  (function setupAbout() {
    const modal = document.getElementById('about-modal');
    const openBtn = document.getElementById('about-btn');
    if (!modal || !openBtn) return;
    const closeBtn = document.getElementById('about-close');
    const backdrop = modal.querySelector('.about-backdrop');

    const KIND = {
      add:     { zh: '新增', en: 'New',      cls: 'add' },
      improve: { zh: '改进', en: 'Improved', cls: 'improve' },
      fix:     { zh: '修复', en: 'Fixed',    cls: 'fix' },
    };

    // Newest release first (mirrors the reference dialog).
    const LOG = [
      {
        date: '2026-05-28', codename: 'The Librarian', items: [
          { kind: 'add', zh: '合集系统：文章可以归入合集，合集还能再套合集，路径式浏览配面包屑导航。', en: 'Collections: posts can live inside collections, nested arbitrarily, with path-based browsing and breadcrumbs.' },
          { kind: 'add', zh: '为 Markdown 提供数学公式支持。', en: 'Math support for Markdown.' },
          { kind: 'improve', zh: '文章列表改成扁平单行卡片，去掉所有描边；置顶与合集一眼可辨。', en: 'Flat single-line list cards with every outline removed; pins and collections read at a glance.' },
          { kind: 'improve', zh: '全站共用一个「返回」按钮，滚动时始终悬停在顶部。', en: 'One shared “Back” button, kept pinned at the top while you scroll.' },
          { kind: 'improve', zh: '前端代码收进单一 window.Blog 命名空间，告别满地的全局变量。', en: 'Front-end code consolidated under a single window.Blog namespace; no more loose globals.' },
          { kind: 'fix', zh: '移动端宽表格撑破页面的问题，现在表格在自己框内横向滚动。', en: 'Wide tables no longer stretch the page on mobile; they scroll inside their own frame now.' },
        ],
      },
      {
        date: '2026-05-01', codename: 'Genesis', items: [
          { kind: 'add', zh: '博客初版上线，首个公开版本，HTML 文章配一份手写清单。', en: 'First public release of the blog. HTML posts with a hand-written manifest.' },
        ],
      },
    ];

    const ORIGIN = {
      zh: '本站始于 2026-03-11，此后一直小修小补；首个公开版本 Genesis 于 2026-05-01 上线。',
      en: 'This site began on 2026-03-11 and has been quietly tended ever since; the first public version, Genesis, launched on 2026-05-01.',
    };

    function render() {
      const lang = Blog.currentLang === 'zh' ? 'zh' : 'en';
      const by = document.getElementById('about-by');
      if (by) by.innerHTML = lang === 'zh'
        ? '由 <span class="about-author">Louie</span> 为您呈现'
        : 'Presented by <span class="about-author">Louie</span>';
      const log = document.getElementById('about-log');
      if (!log) return;
      log.innerHTML = LOG.map(rel => `
        <div class="about-rel">
          <div class="about-rel__head">
            <span class="about-rel__date">${rel.date}</span>
            <span class="about-rel__code">${rel.codename}</span>
          </div>
          ${rel.items.map(it => `<div class="about-item"><span class="about-tag about-tag--${KIND[it.kind].cls}">${KIND[it.kind][lang]}</span><span>${it[lang]}</span></div>`).join('')}
        </div>`).join('') +
        `<p class="about-origin">${ORIGIN[lang]}</p>`;
    }

    function open() { render(); modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); }
    function close() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      // Sweep any finished ripple spans so none replay on the next open.
      document.querySelectorAll('.ripple').forEach(r => r.remove());
    }

    openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });

    Blog.renderAbout = render;   // let applyLang refresh content if the modal is open
  })();

  /* ─── Fade-in observer ─── */
  let fadeObserver = null;
  Blog.bindFadeIn = function bindFadeIn() {
    if (fadeObserver) fadeObserver.disconnect();
    fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.05 });
    document.querySelectorAll('.fade-in:not(.visible)').forEach(el => fadeObserver.observe(el));
  };

  /* ─── Lang-aware helpers ─── */
  Blog.pickLang = function pickLang(field, fallback = '') {
    if (field == null) return fallback;
    if (typeof field === 'string') return field;
    return field[Blog.currentLang] || field.en || field.zh || fallback;
  };

  Blog.formatDate = function formatDate(iso) {
    if (!iso) return '';
    try {
      const d = luxon.DateTime.fromISO(iso).setLocale(Blog.currentLang === 'zh' ? 'zh-CN' : 'en');
      return d.toFormat(Blog.currentLang === 'zh' ? 'yyyy.MM.dd' : 'LLL d, yyyy');
    } catch (e) { return iso; }
  };

  /* ============================================================
   * The Librarian — recursive library tree
   *
   * Files (JSON, fetched on demand):
   *   blog/blog_data/head_librarian.json     ← root, path ''
   *   blog/blog_data/<path>/librarian.json    ← a collection
   *
   * Each librarian is { version, updated, title?, entries: [...] }
   * where every entry is either
   *   { kind:'post',       slug, type, date, title, excerpt, tags, lang, … }
   *   { kind:'collection', slug, date, title, excerpt, cover?, tags? }
   * A collection's slug is the folder name that holds its own librarian.json.
   * ============================================================ */

  const DATA = 'blog/blog_data';
  const _libCache = {};     // path → normalized librarian
  const _libLoading = {};   // path → in-flight Promise

  // Build the on-disk path for a node (post or collection) and an optional file.
  Blog.dataPath = function dataPath(path, file) {
    const base = path ? `${DATA}/${path}` : DATA;
    return file ? `${base}/${file}` : base;
  };
  Blog.librarianUrl = function librarianUrl(path) {
    return path ? `${DATA}/${path}/librarian.json` : `${DATA}/head_librarian.json`;
  };

  // Cover URL for an entry that lives directly under `parentPath`.
  Blog.coverUrl = function coverUrl(entry, parentPath) {
    if (!entry || !entry.cover) return null;
    const p = parentPath ? `${parentPath}/${entry.slug}` : entry.slug;
    return Blog.dataPath(p, entry.cover);
  };

  // Drop drafts and sort entries into three bands:
  //   0) pinned (any kind) — keep declaration order
  //   1) collections       — newest first
  //   2) bare articles     — newest first
  // i.e. folders sit above bare articles, except anything pinned floats to top.
  function bandOf(e) {
    if (e.pinned) return 0;
    if (e.kind === 'collection') return 1;
    return 2;
  }
  function normalize(raw) {
    const entries = (raw.entries || [])
      .filter(e => e && !e.draft)
      .slice()
      .sort((a, b) => {
        const ba = bandOf(a), bb = bandOf(b);
        if (ba !== bb) return ba - bb;
        if (ba === 0) return 0;                        // pinned: keep declaration order
        return (b.date || '').localeCompare(a.date || '');
      });
    return { ...raw, entries };
  }

  // Fetch + cache one librarian. `path` '' means the root head_librarian.
  Blog.loadLibrarian = function loadLibrarian(path) {
    path = path || '';
    if (_libCache[path]) return Promise.resolve(_libCache[path]);
    if (_libLoading[path]) return _libLoading[path];
    _libLoading[path] = fetch(Blog.librarianUrl(path))
      .then(r => {
        if (!r.ok) throw new Error(`librarian "${path || '(root)'}" → HTTP ${r.status}`);
        return r.json();
      })
      .then(j => { delete _libLoading[path]; const lib = normalize(j); _libCache[path] = lib; return lib; })
      .catch(e => { delete _libLoading[path]; throw e; });
    return _libLoading[path];
  };

  // Walk root → path, loading each librarian along the way. Resolves to:
  //   { ok:true,  kind:'collection', lib, chain }   when path points at a collection (or root)
  //   { ok:true,  kind:'post',       entry, chain } when path points at an article
  //   { ok:false, notFound:true,     chain }        when a segment doesn't exist
  // `chain` is [{ slug, path, entry }] for breadcrumbs (carries titles + kinds).
  Blog.resolvePath = async function resolvePath(path) {
    const segs = path ? path.split('/').filter(Boolean) : [];
    const chain = [];
    let lib = await Blog.loadLibrarian('');     // root always loads first
    let cursor = '';
    for (let i = 0; i < segs.length; i++) {
      const slug = segs[i];
      const entry = (lib.entries || []).find(e => e.slug === slug);
      if (!entry) return { ok: false, notFound: true, chain };
      cursor = cursor ? `${cursor}/${slug}` : slug;
      chain.push({ slug, path: cursor, entry });
      const isLast = i === segs.length - 1;
      if (entry.kind === 'collection') {
        lib = await Blog.loadLibrarian(cursor);   // descend (or this is the target to list)
      } else {
        if (!isLast) return { ok: false, notFound: true, chain };   // post can't have children
        return { ok: true, kind: 'post', entry, chain };
      }
    }
    return { ok: true, kind: 'collection', lib, chain };            // root or a collection page
  };

})(window.Blog = window.Blog || {});

/* ============================================================
 * blog/blog-interpreter.js
 * The single seam between a raw post body and the HTML that gets
 * injected into #reader-body. Everything downstream (highlightAllCode,
 * buildToc) operates on the resulting DOM, so it never has to know
 * whether a post was authored as HTML or Markdown.
 *
 *   BlogInterpreter.render(raw, { type, slug }) -> htmlString
 *     type 'html' (default) → raw is already HTML, returned untouched
 *     type 'md'             → raw is Markdown; parsed via marked (window.marked)
 *                             then normalized to match .reader-body conventions
 *
 * Markdown normalization (DOM-based, robust vs regex):
 *   1. First top-level <p> gets class="lead"        (matches every post's opener)
 *   2. Relative <img src> → blog/blog_data/<slug>/  (resolves the "paths are
 *      relative to index.html, not the post folder" gotcha automatically)
 *   3. Fenced code: language hints (```c, ```python, ```sql, …) are left
 *      intact as class="language-xxx" so blog-syntax.js (highlight.js) can
 *      colour them; unlabeled fences are auto-detected downstream.
 *
 * marked v12 adds no heading ids by default, so buildToc keeps full control
 * of slugifying h2/h3 — nothing to disable here.
 *
 * Dependency: window.marked (lib/marked.min.js), loaded before this script.
 * ============================================================ */

(function () {
  'use strict';

  function isAbsoluteOrRooted(src) {
    return /^(?:[a-z]+:)?\/\//i.test(src)   // http://, https://, //
        || src.startsWith('/')               // site-root
        || src.startsWith('blog/')           // already a post-data path
        || src.startsWith('data:');          // inline data URI
  }

  function normalizeMarkdownDom(html, slug) {
    const root = document.createElement('div');
    root.innerHTML = html;

    // 1. lead paragraph — first DIRECT-child <p> (skip <p> nested in blockquote/li)
    const firstP = root.querySelector(':scope > p');
    if (firstP) firstP.classList.add('lead');

    // 2. relative image paths → blog/blog_data/<slug>/
    if (slug) {
      root.querySelectorAll('img[src]').forEach(img => {
        const src = img.getAttribute('src') || '';
        if (src && !isAbsoluteOrRooted(src)) {
          img.setAttribute('src', `blog/blog_data/${slug}/${src.replace(/^\.?\//, '')}`);
        }
      });
    }

    // 3. Fenced-code language hints (class="language-xxx") are kept as-is so
    //    blog-syntax.js / highlight.js can colour them; unlabeled fences are
    //    left classless and auto-detected downstream.

    return root.innerHTML;
  }

  function render(raw, opts) {
    const o = opts || {};
    const type = o.type || 'html';
    if (raw == null) return '';
    if (type !== 'md') return raw; // html → passthrough, byte-for-byte

    if (!window.marked || typeof window.marked.parse !== 'function') {
      throw new Error('BlogInterpreter: window.marked is not loaded (lib/marked.min.js)');
    }
    const html = window.marked.parse(raw);
    return normalizeMarkdownDom(html, o.slug);
  }

  window.BlogInterpreter = { render };
})();

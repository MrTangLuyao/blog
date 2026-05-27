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
 * Math: a marked extension renders $…$ (inline) and $$…$$ (display) with
 * KaTeX AT PARSE TIME, so the LaTeX is turned into HTML before markdown can
 * mangle it (no _ → <em>, no \ stripping). The output is plain KaTeX markup
 * styled by lib/katex/katex.min.css; nothing downstream needs to know.
 *
 * Dependencies (both loaded before this script):
 *   window.marked  (lib/marked.min.js)
 *   window.katex   (lib/katex/katex.min.js)
 * ============================================================ */

(function () {
  'use strict';

  // Register the KaTeX math extension on the shared marked instance once.
  function registerMathExtension() {
    if (!window.marked || typeof window.marked.use !== 'function') return;
    if (!window.katex || window.__katexMarkedRegistered) return;

    const renderTeX = (tex, displayMode) => {
      try {
        return window.katex.renderToString(tex, {
          displayMode,
          throwOnError: false,   // render the error in red instead of throwing
          strict: false,
        });
      } catch (e) {
        return '<code class="katex-error">' + tex + '</code>';
      }
    };

    window.marked.use({
      extensions: [
        {
          // $$ … $$  → display (block) math, may span multiple lines
          name: 'blockMath',
          level: 'block',
          start(src) { const i = src.indexOf('$$'); return i < 0 ? undefined : i; },
          tokenizer(src) {
            const m = /^\$\$([\s\S]+?)\$\$/.exec(src);
            if (m) return { type: 'blockMath', raw: m[0], text: m[1].trim() };
          },
          renderer(token) { return renderTeX(token.text, true); },
        },
        {
          // $ … $  → inline math (single line, no nested $, not opening with a space)
          name: 'inlineMath',
          level: 'inline',
          start(src) { const i = src.indexOf('$'); return i < 0 ? undefined : i; },
          tokenizer(src) {
            const m = /^\$(?!\s)((?:\\\$|[^$\n])+?)\$/.exec(src);
            if (m) return { type: 'inlineMath', raw: m[0], text: m[1] };
          },
          renderer(token) { return renderTeX(token.text, false); },
        },
      ],
    });

    window.__katexMarkedRegistered = true;
  }

  registerMathExtension();

  function isAbsoluteOrRooted(src) {
    return /^(?:[a-z]+:)?\/\//i.test(src)   // http://, https://, //
        || src.startsWith('/')               // site-root
        || src.startsWith('blog/')           // already a post-data path
        || src.startsWith('data:');          // inline data URI
  }

  function normalizeMarkdownDom(html, basePath) {
    const root = document.createElement('div');
    root.innerHTML = html;

    // 1. lead paragraph — first DIRECT-child <p> (skip <p> nested in blockquote/li)
    const firstP = root.querySelector(':scope > p');
    if (firstP) firstP.classList.add('lead');

    // 2. relative image paths → blog/blog_data/<basePath>/  (basePath is the
    //    post's full collection path, e.g. "sql/sql-syntax-guide-1")
    if (basePath) {
      root.querySelectorAll('img[src]').forEach(img => {
        const src = img.getAttribute('src') || '';
        if (src && !isAbsoluteOrRooted(src)) {
          img.setAttribute('src', `blog/blog_data/${basePath}/${src.replace(/^\.?\//, '')}`);
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
    if (!window.__katexMarkedRegistered) registerMathExtension(); // in case katex loaded late
    const html = window.marked.parse(raw);
    return normalizeMarkdownDom(html, o.basePath != null ? o.basePath : o.slug);
  }

  window.BlogInterpreter = { render };
})();

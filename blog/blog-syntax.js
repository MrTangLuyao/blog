/* ============================================================
 * blog/blog-syntax.js
 * Syntax highlighting for the blog, backed by highlight.js.
 *
 * Why highlight.js (replacing the old hand-rolled C tokenizer):
 *   - The blog spans C, Python, SQL, Bash, JSON … — one mature,
 *     well-tested highlighter covers them all instead of a C-only hack.
 *   - It is fully vendored under lib/highlight/ (no CDN, no fetch), so
 *     the site still runs from file:// exactly as before.
 *
 * Behaviour:
 *   - Auto-applied by blog-views.js after each post body is injected, which
 *     also passes the post's language (from its tags) as `defaultLang`.
 *   - Operates on every <pre><code> block under the reader root.
 *   - Language is resolved per block, most-specific first:
 *       1. an explicit hint on the block (class="language-xxx"/"lang-xxx"),
 *       2. else the post's `defaultLang` (e.g. a C post → every block is C),
 *       3. else auto-detected from the small set the blog actually uses.
 *   - A relevance gate keeps prose / program output / ASCII diagrams clean:
 *       · explicit hint   → always highlighted (the author asked for it),
 *       · post default    → highlighted only if relevance ≥ 1 (real code
 *                            scores ≥ 1; diagrams & prose score 0),
 *       · auto-detection  → highlighted only if relevance ≥ MIN_RELEVANCE
 *                            (it must also be confident *which* language).
 *   - Blocks that opt out via class="lang-text" / "no-highlight" / a
 *     "text"/"plaintext"/"none" language hint are left verbatim.
 *   - Idempotent: a `data-highlighted` flag prevents double-tokenization.
 *   - Every block is then wrapped in the "code box" chrome: a header bar
 *     (language label + copy button) and a line-number gutter (wrapCodeBox).
 *
 * Token colours come from the upstream VS Code Dark+ theme
 * (lib/highlight/vs2015.min.css). The box chrome + the real fixed-width
 * 'JBMono' @font-face live in blog/blog.css. The site's own 'JetBrains Mono'
 * family is a CJK body subset and must NOT be used for code (ragged ASCII).
 * ============================================================ */

(function () {
  'use strict';

  // Languages this blog uses — auto-detection (only reached when a post has
  // no declared language) is limited to these so a block resolves to one of
  // them instead of matching some unrelated grammar in the full bundle.
  // `python` precedes `c` so short snippets break ties toward Python; C is
  // notoriously hard to auto-detect, which is exactly why posts pass a
  // `defaultLang` and rarely fall through to auto-detection at all.
  const AUTO_LANGUAGES = ['python', 'c', 'sql', 'bash', 'json', 'javascript', 'xml'];

  // Relevance gate when the language was *guessed* (auto-detection): we need
  // enough confidence in the language choice itself before colouring.
  const MIN_RELEVANCE = 4;

  // Relevance gate when the language is *known* (explicit hint or post
  // default): real code scores ≥ 1 under its own grammar, while prose and
  // ASCII diagrams score 0 — so this cheaply skips non-code without dropping
  // legitimate short snippets like `SELECT * FROM t;` or `print("hi")`.
  const MIN_RELEVANCE_KNOWN = 1;

  const OPT_OUT_LANGS = new Set(['text', 'plaintext', 'plain', 'none', 'txt']);

  // Pretty labels for the code-box header (fallback: upper-cased id).
  const LANG_LABELS = {
    c: 'C', cpp: 'C++', python: 'Python', sql: 'SQL', bash: 'Bash',
    shell: 'Shell', json: 'JSON', javascript: 'JavaScript', typescript: 'TypeScript',
    xml: 'HTML', html: 'HTML', css: 'CSS', java: 'Java', go: 'Go', rust: 'Rust',
  };
  function langLabel(lang) {
    if (!lang) return 'Text';
    return LANG_LABELS[lang] || lang.toUpperCase();
  }

  // Localised copy-button captions (reads Blog.currentLang from blog-i18n.js).
  function copyCaptions() {
    const zh = !!(window.Blog && window.Blog.currentLang === 'zh');
    return zh ? { idle: '复制', done: '已复制' } : { idle: 'Copy', done: 'Copied' };
  }

  const COPY_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="9" y="9" width="13" height="13" rx="2"></rect>' +
    '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';

  function escapeHTML(s) {
    return s.replace(/[&<>]/g, function (c) {
      return c === '&' ? '&amp;' : c === '<' ? '&lt;' : '&gt;';
    });
  }

  // Pull a language name out of the element's classes, if any.
  // Recognises both `language-xxx` (Markdown / marked) and `lang-xxx`.
  function explicitLang(block) {
    const cls = block.className || '';
    const m = cls.match(/(?:^|\s)(?:language|lang)-([\w+#-]+)/i);
    return m ? m[1].toLowerCase() : null;
  }

  /* ── clipboard copy (works on file:// via execCommand fallback) ── */
  function copyToClipboard(text, btn) {
    const cap = copyCaptions();
    const labelEl = btn.querySelector('.code-box__copy-label');
    const flash = function () {
      if (labelEl) labelEl.textContent = cap.done;
      btn.classList.add('copied');
      setTimeout(function () {
        if (labelEl) labelEl.textContent = cap.idle;
        btn.classList.remove('copied');
      }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(flash, function () { legacyCopy(text, flash); });
    } else {
      legacyCopy(text, flash);
    }
  }
  function legacyCopy(text, done) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.top = '-9999px';
      ta.setAttribute('readonly', '');
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    } catch (e) { /* clipboard unavailable — silently ignore */ }
  }

  /* ── wrap a highlighted <pre> in the code-box chrome ──────────── */
  // Builds: .code-box > (.code-box__bar [lang + copy]) + (.code-box__main
  // [gutter + the original <pre>]). `code` is the raw text (for copy + line
  // count); `label` is the language caption.
  function wrapCodeBox(pre, code, label) {
    const lineCount = code.replace(/\n+$/, '').split('\n').length;
    const cap = copyCaptions();

    const box = document.createElement('div');
    box.className = 'code-box';

    const bar = document.createElement('div');
    bar.className = 'code-box__bar';
    const lang = document.createElement('span');
    lang.className = 'code-box__lang';
    lang.textContent = label;
    const copy = document.createElement('button');
    copy.type = 'button';
    // ripple-surface(-variant) gives the site's tap ripple (clipped by the
    // button's rounded corners via overflow:hidden); bound by bindRipples().
    copy.className = 'code-box__copy ripple-surface ripple-surface-variant';
    copy.setAttribute('aria-label', 'Copy code');
    copy.innerHTML = COPY_ICON + '<span class="code-box__copy-label">' + cap.idle + '</span>';
    copy.addEventListener('click', function () { copyToClipboard(code, copy); });
    bar.appendChild(lang);
    bar.appendChild(copy);

    const main = document.createElement('div');
    main.className = 'code-box__main';
    const gutter = document.createElement('span');
    gutter.className = 'code-box__gutter';
    gutter.setAttribute('aria-hidden', 'true');
    let nums = '';
    for (let k = 1; k <= lineCount; k++) nums += (k > 1 ? '\n' : '') + k;
    gutter.textContent = nums;

    pre.parentNode.insertBefore(box, pre);
    pre.classList.add('code-box__pre');
    main.appendChild(gutter);
    main.appendChild(pre);
    box.appendChild(bar);
    box.appendChild(main);
  }

  /* ── highlightAllCode(rootEl, defaultLang) — every <pre><code> ── */
  // `defaultLang` is the post's language (from its tags); pass null/undefined
  // to fall back to auto-detection for every block.
  function highlightAllCode(root, defaultLang) {
    if (!root) return;
    const hljs = window.hljs;
    if (typeof hljs === 'undefined') return; // bundle missing — leave plain

    const fallback = (defaultLang && hljs.getLanguage(defaultLang)) ? defaultLang : null;

    const blocks = root.querySelectorAll('pre code');
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      if (block.dataset.highlighted === 'true') continue;

      const pre = block.parentElement;
      if (!pre || pre.tagName !== 'PRE') { block.dataset.highlighted = 'true'; continue; }

      const code = block.textContent;
      const hint = explicitLang(block);
      const optOut = block.classList.contains('lang-text') ||
                     block.classList.contains('no-highlight') ||
                     (hint && OPT_OUT_LANGS.has(hint));

      let html = null;
      let resolved = null; // language actually applied (for the header label)

      if (!optOut) {
        const lang = (hint && hljs.getLanguage(hint)) ? hint : fallback;
        try {
          if (lang) {
            // known language (explicit hint, or post default)
            const res = hljs.highlight(code, { language: lang, ignoreIllegals: true });
            const gate = (lang === hint) ? 0 : MIN_RELEVANCE_KNOWN;
            if (res.relevance >= gate) { html = res.value; resolved = lang; }
          } else {
            // no hint and no post default → guess within the blog's languages
            const res = hljs.highlightAuto(code, AUTO_LANGUAGES);
            if (res && res.relevance >= MIN_RELEVANCE) { html = res.value; resolved = res.language || null; }
          }
        } catch (e) { html = null; }
      }

      if (html != null) {
        block.classList.add('hljs');
        block.innerHTML = html;
      } else {
        // plain (opt-out, or low confidence): keep verbatim, escaped
        block.innerHTML = escapeHTML(code);
      }
      block.dataset.highlighted = 'true';

      // header label: the applied language, else an author hint, else "Text"
      wrapCodeBox(pre, code, langLabel(resolved || (hint && !OPT_OUT_LANGS.has(hint) ? hint : null)));
    }

    // attach the site ripple to the copy buttons we just created (highlight
    // runs after the reader's own bindRipples(), so these would miss it)
    if (window.Blog && typeof window.Blog.bindRipples === 'function') window.Blog.bindRipples();
  }

  // expose on window so blog-views.js can call it after each writeBody
  window.highlightAllCode = highlightAllCode;
})();

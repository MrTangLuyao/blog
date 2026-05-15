/* ============================================================
 * blog/blog-syntax.js
 * Tiny C-language syntax highlighter for the blog.
 *
 * Why custom (not Prism / Highlight.js):
 *   - The blog needs to run on file:// (no fetch), so no remote CDN.
 *   - C is the only language used in these tutorials — a 150-line
 *     tokenizer is smaller than even the smallest Prism bundle.
 *   - Stays in the same minimalist, no-dependency style as the rest of /blog.
 *
 * Usage:
 *   - Auto-applied by blog-views.js after each post body is injected.
 *   - Operates on every <pre><code> block under the reader root.
 *   - Skips blocks that opt out via class="lang-text" or "no-highlight".
 *   - Idempotent: a `data-highlighted` flag prevents double-tokenization.
 *
 * Colour palette: VS Code Dark+ inspired, tuned for the #2a2a29 surface.
 * ============================================================ */

(function () {
  'use strict';

  const KEYWORDS = new Set([
    'if', 'else', 'for', 'while', 'do', 'return', 'break', 'continue',
    'switch', 'case', 'default', 'goto', 'sizeof',
    'typedef', 'struct', 'union', 'enum',
    'const', 'static', 'extern', 'register', 'auto', 'volatile', 'inline', 'restrict',
  ]);

  const TYPES = new Set([
    'int', 'char', 'short', 'long', 'float', 'double', 'void',
    'signed', 'unsigned', 'bool', '_Bool',
    'size_t', 'ssize_t', 'ptrdiff_t',
    'int8_t', 'int16_t', 'int32_t', 'int64_t',
    'uint8_t', 'uint16_t', 'uint32_t', 'uint64_t',
    'FILE',
  ]);

  const CONSTANTS = new Set([
    'NULL', 'true', 'false', 'TRUE', 'FALSE',
  ]);

  // Operator characters worth colouring (single chars; we don't bother with
  // multi-char operators — they each render fine as a sequence of operator chars)
  const OPERATOR_CHARS = '+-*/%=<>!&|^~?:';

  function escapeHTML(s) {
    return s.replace(/[&<>]/g, function (c) {
      return c === '&' ? '&amp;' : c === '<' ? '&lt;' : '&gt;';
    });
  }

  function isDigit(c)        { return c >= '0' && c <= '9'; }
  function isIdentStart(c)   { return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_'; }
  function isIdentPart(c)    { return isIdentStart(c) || isDigit(c); }
  function isHexish(c)       { return isDigit(c) || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F') || 'xXuUlLfFpP.'.indexOf(c) >= 0; }

  /* ── highlightC(code) → highlighted HTML string ──────────────── */
  function highlightC(code) {
    let i = 0;
    const n = code.length;
    const out = [];

    function span(cls, text) {
      out.push('<span class="syn-' + cls + '">' + escapeHTML(text) + '</span>');
    }

    while (i < n) {
      const ch = code[i];
      const next = code[i + 1];

      // single-line comment
      if (ch === '/' && next === '/') {
        let j = i;
        while (j < n && code[j] !== '\n') j++;
        span('comment', code.substring(i, j));
        i = j;
        continue;
      }

      // multi-line comment
      if (ch === '/' && next === '*') {
        let j = i + 2;
        while (j < n - 1 && !(code[j] === '*' && code[j + 1] === '/')) j++;
        j = Math.min(j + 2, n);
        span('comment', code.substring(i, j));
        i = j;
        continue;
      }

      // string / char literal
      if (ch === '"' || ch === "'") {
        const quote = ch;
        let j = i + 1;
        while (j < n && code[j] !== quote) {
          if (code[j] === '\\' && j + 1 < n) { j += 2; }
          else { j++; }
          if (code[j - 1] === '\n') break;  // unterminated within line — bail
        }
        j = Math.min(j + 1, n);
        span('string', code.substring(i, j));
        i = j;
        continue;
      }

      // preprocessor directive (line begins with #, possibly after whitespace)
      if (ch === '#' && (i === 0 || code[i - 1] === '\n' || /^[ \t]+$/.test(code.substring(lastNewline(code, i) + 1, i)))) {
        let j = i;
        while (j < n && code[j] !== '\n') j++;
        span('preprocessor', code.substring(i, j));
        i = j;
        continue;
      }

      // number literal (incl. 0x... hex, decimals with leading dot)
      if (isDigit(ch) || (ch === '.' && isDigit(next))) {
        let j = i + 1;
        while (j < n && isHexish(code[j])) j++;
        span('number', code.substring(i, j));
        i = j;
        continue;
      }

      // identifier / keyword / type / constant / function-call name
      if (isIdentStart(ch)) {
        let j = i + 1;
        while (j < n && isIdentPart(code[j])) j++;
        const word = code.substring(i, j);
        let cls = null;
        if (KEYWORDS.has(word))       cls = 'keyword';
        else if (TYPES.has(word))     cls = 'type';
        else if (CONSTANTS.has(word)) cls = 'constant';
        else {
          // function detection: identifier directly followed by '(' (allow whitespace)
          let k = j;
          while (k < n && (code[k] === ' ' || code[k] === '\t')) k++;
          if (code[k] === '(') cls = 'function';
        }
        if (cls) span(cls, word);
        else     out.push(escapeHTML(word));
        i = j;
        continue;
      }

      // operator
      if (OPERATOR_CHARS.indexOf(ch) >= 0) {
        span('operator', ch);
        i++;
        continue;
      }

      // anything else (whitespace, brackets, commas, …) — passthrough
      out.push(escapeHTML(ch));
      i++;
    }

    return out.join('');
  }

  function lastNewline(code, idx) {
    for (let k = idx - 1; k >= 0; k--) {
      if (code[k] === '\n') return k;
    }
    return -1;
  }

  /* ── highlightAllCode(rootEl) — apply to every <pre><code> ──── */
  function highlightAllCode(root) {
    if (!root) return;
    const blocks = root.querySelectorAll('pre code');
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      if (block.dataset.highlighted === 'true') continue;
      if (block.classList.contains('lang-text') || block.classList.contains('no-highlight')) continue;
      const code = block.textContent;
      block.innerHTML = highlightC(code);
      block.dataset.highlighted = 'true';
    }
  }

  // expose on window so blog-views.js can call it after each writeBody
  window.highlightAllCode = highlightAllCode;
  window.highlightC = highlightC;
})();

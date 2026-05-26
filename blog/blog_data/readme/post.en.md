# Louie's Blog — README

- **English** → [§ English](#english)
- **中文** → [§ 中文](#中文)

---

<a id="english"></a>

# English

## Architecture in one paragraph

The site is static on Cloudflare Pages — no backend, no DB, no build step. `manifest.js` is the **index** (metadata for every post, no bodies); each post's **body** lives in its own folder and is loaded on demand when the reader opens it.

A post body comes in one of **two formats**, chosen per-post by the `type` field in the manifest:

- **`md` (Markdown)** — a plain `.md` file. Loaded with `fetch()`, then turned into HTML at runtime by `blog/blog-interpreter.js` (which wraps [marked](https://marked.js.org/), `lib/marked.min.js`). This is the recommended format for most posts.
- **`html` (default)** — a `post.<lang>.js` file that registers an HTML string into `window.__BLOG_POSTS`, injected via a `<script>` tag. Use it only when you need raw markup the reader doesn't otherwise support (custom `<iframe>` animations, bespoke layout, etc.).

> ⚠️ **`md` posts use `fetch()`, which the browser blocks on `file://`.** So you can no longer just double-click `index.html` to preview Markdown posts. Use the local server below. (`html` posts still work on `file://`, but just use the server for everything — it's one command.)

## Local preview

```bash
python3 localrun.py
```

Starts a static server rooted at the repo, opens the blog in your browser, and waits. **Press any key (or Ctrl+C) to stop.** It sends no-cache headers, so editing a `.md` / `.js` / `.css` file and refreshing shows the change immediately.

---

## File layout

```
index.html                         ← entry page. Hosts BOTH list view and reader view.
localrun.py                        ← local preview server (python3 localrun.py)
CNAME                              ← Cloudflare Pages custom domain
LICENSE
README.md                          ← this file (the only README — legacy ones were removed)
lib/
├── design/
│   ├── fonts.css                  ← @font-face for JetBrains Mono
│   ├── JetBrainsMono.woff2 / -Bold.woff2
│   ├── fonts_chunks/              ← subset CJK font chunks
│   ├── louie.css                  ← shared site styles + :root CSS variables (matches louie1.com)
│   ├── tailwindcss.js             ← Tailwind play CDN snapshot
│   └── tailwind.config.js
├── marked.min.js                  ← Markdown parser (marked, MIT). window.marked
├── highlight/                     ← highlight.js (BSD-3) — syntax highlighting
│   ├── highlight.min.js           ← common-language bundle. window.hljs
│   └── vs2015.min.css             ← VS Code Dark+ theme (token colours)
├── resources/po.webp              ← favicon / OG image
└── runtime/luxon.min.js           ← date formatting
blog/
├── blog.css                       ← blog-specific styles (list cards, reader, TOC, etc.)
├── blog-i18n.js                   ← translations table + applyLang() + toggleLang()
├── blog-core.js                   ← manifest loader, body loader, ripple, language fallback, tag state
├── blog-syntax.js                 ← highlight.js wrapper: per-post default lang + relevance gate + code-box chrome (lang label, copy, line numbers)
├── blog-interpreter.js            ← BlogInterpreter.render(): md → HTML (marked + normalize); html → passthrough
├── blog-toc.js                    ← buildToc / clearToc + IntersectionObserver scroll-spy
├── blog-views.js                  ← renderList, renderReader, renderTagBar, format badge, fade-in
├── blog-router.js                 ← hash-based route(), boot order
├── blog_data/
│   ├── manifest.js                ← INDEX ONLY. Sets window.__BLOG_MANIFEST.
│   ├── <slug>/                    ← one folder per post
│   │   ├── post.zh.md  / post.en.md    ← Markdown body  (type: 'md')
│   │   ├── post.zh.js  / post.en.js    ← HTML body      (type: 'html')
│   │   ├── cover.webp             ← OPTIONAL cover image, referenced from manifest.js
│   │   ├── anims/                 ← OPTIONAL self-contained HTML/JS animations (<iframe> targets)
│   │   └── (other assets, e.g. inline images)
│   └── (more post folders…)
└── editor/
    └── blog_writer.py             ← Tk manifest manager: create posts + edit manifest metadata.
                                     Bodies open in your own editor (.md / .js); HTML posts flagged "!".
```

URLs: `/` → list view, `/#<slug>` → reader view for that post.

### Script load order in `index.html`

```html
<!-- index.html, near </body> -->
<script src="lib/runtime/luxon.min.js"></script>
<script src="lib/marked.min.js"></script>           <!-- before the interpreter uses it -->
<script src="blog/blog_data/manifest.js"></script>   <!-- must run first: sets window.__BLOG_MANIFEST -->
<script src="blog/blog-i18n.js"></script>
<script src="blog/blog-core.js"></script>
<script src="lib/highlight/highlight.min.js"></script><!-- sets window.hljs; before blog-syntax.js -->
<script src="blog/blog-syntax.js"></script>
<script src="blog/blog-interpreter.js"></script>     <!-- before blog-views.js (writeBody calls it) -->
<script src="blog/blog-toc.js"></script>
<script src="blog/blog-views.js"></script>
<script src="blog/blog-router.js"></script>          <!-- must be last: kicks off route() -->
```

Don't reorder: `manifest.js` first (so `window.__BLOG_MANIFEST` exists), `blog-router.js` last (it boots routing).

---

## `manifest.js` schema (index only — no bodies)

```js
window.__BLOG_MANIFEST = {
  version: 3,
  updated: 'YYYY-MM-DD',         // top-level: when this manifest was last touched (informational)
  posts: [
    {
      slug: 'kebab-case-id',     // REQUIRED. URL hash AND post folder name. Never change after publish.
      date: 'YYYY-MM-DD',        // REQUIRED. ISO 8601 publish date. Used for sort + display.
      updated: 'YYYY-MM-DD',     // OPTIONAL. Last-modified date. Shown only if present and !== date.
      type: 'md',                // OPTIONAL. 'html' (default) | 'md'. Picks how the body is loaded + rendered.
      title:   { zh: '...', en: '...' },  // REQUIRED. Object for bilingual, or plain string.
      excerpt: { zh: '...', en: '...' },  // 1–2 sentence card summary. Object or string.
      tags: ['tag1', 'tag2'],    // OPTIONAL. Powers the filter chips. Identical strings group together.
      cover: 'cover.webp',       // OPTIONAL. Resolved as blog/blog_data/<slug>/cover.webp.
      readingTime: 3,            // OPTIONAL. Integer minutes.
      lang: 'both',              // 'both' (default) | 'zh' | 'en'
      pinned: false,             // OPTIONAL. true = sticky to top of the list.
      draft: false               // OPTIONAL. true = excluded from list AND blocked in the reader.
    }
  ]
};
```

Field rules:

- **`type`** decides everything about the body. `'md'` → reader fetches `post.<lang>.md` and renders it via `BlogInterpreter`. `'html'` (or omitted) → reader injects `post.<lang>.js` and uses its string verbatim.
- **`title` / `excerpt`** can be a string (single-language) or `{zh, en}`. Fallback chain: current lang → `en` → `zh` → empty.
- **`lang`**: `'both'` loads the requested-language body and falls back to the other on failure; `'zh'`/`'en'` loads a single body.
- **Sorting**:
  1. `pinned: true` posts come first.
  2. **Pinned posts keep their order of appearance in `manifest.js`** (stable sort) — so to reorder pins, just move their entries up/down in the file.
  3. Non-pinned posts: newest `date` first.
- **`updated`**: "last meaningful edit". Don't bump for typos. Hidden when `updated === date`.
- **`pinned` UX**: 📌 pill in the meta row, tinted card background, accent border on hover. Keep it to 2–3.
- **`draft: true`**: removed from list AND blocked in the reader (even via direct hash).

The list/reader meta row also shows an **`HTML` / `MARKDOWN` badge** on the right, derived automatically from `type`.

---

## Post formats: when to use which

| | **Markdown (`type: 'md'`)** | **HTML (`type: 'html'`, default)** |
|---|---|---|
| File | `post.<lang>.md` (plain Markdown) | `post.<lang>.js` (HTML in a JS template literal) |
| Loaded by | `fetch()` → `BlogInterpreter` → marked | `<script>` inject → `window.__BLOG_POSTS` |
| Escaping | **none** — write backticks/`${` freely | must escape `` ` `` → `` \` `` and `${` → `\${` |
| Works on `file://` | no (needs the local server) | yes |
| Use for | almost everything | raw markup the reader can't express (`<iframe>` anims, bespoke HTML) |

Both render into the same `#reader-body` DOM, so syntax highlighting and the TOC work identically regardless of format.

---

## How to add a post — Markdown (recommended)

1. **Pick a slug** — short, lowercase, hyphenated. It's the URL hash AND the folder name; never change it after publish.
2. **Create the folder** `blog/blog_data/<slug>/`.
3. **Write the body** as `post.zh.md` and/or `post.en.md` — pure Markdown, no JS wrapper, no escaping. You can write it in any editor (e.g. Typora).
4. **(Optional) cover** at `blog/blog_data/<slug>/cover.webp`.
5. **Append a manifest entry** with **`type: 'md'`**. Bump top-level `updated`.
6. **Preview** with `python3 localrun.py`.

Markdown niceties handled by `BlogInterpreter`:
- The **first paragraph** automatically gets the `lead` style.
- **Relative image paths** (`![](pic.webp)`) are auto-prefixed to `blog/blog_data/<slug>/pic.webp` — no need to write the full path.
- Code fences: ` ```c ` is syntax-highlighted; every other language (and unlabeled fences) renders verbatim.
- Raw HTML inside Markdown is passed through, so the signature line `<p style="color: var(--muted); …">— Louie</p>` and the like still work.

## How to add a post — HTML (advanced)

Use this only when you need markup Markdown can't express. Steps 1–2 and 4–6 are the same, except set **`type: 'html'`** (or omit `type`). For step 3, create `post.<lang>.js`:

```js
/* Post body — <slug> / <lang> */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['<slug>:<lang>'] = `
<p class="lead">Lead paragraph…</p>

<h2>Section heading</h2>
<p>Body…</p>
`;
```

The key MUST be exactly `<slug>:<lang>` or the loader errors. **Escape `` ` `` as `` \` `` and `${` as `\${`** inside the string (it's a JS template literal). In HTML posts you write `<p class="lead">` yourself and image `src` must be the full `blog/blog_data/<slug>/…` path.

---

## Post body conventions (both formats)

Styles available in the reader (defined under `.reader-body` in `blog/blog.css`). Markdown maps to these automatically; HTML posts must use the tags directly.

| Element | Markdown | Notes |
|---|---|---|
| `<p class="lead">` | first paragraph | accent left-border, italic — auto-applied for `md` |
| `<h2>` / `<h3>` | `##` / `###` | section / sub-heading; drive the TOC |
| `<p>` | paragraph | |
| `<strong>` / `<em>` | `**x**` / `*x*` | accent / cream italic |
| `<a href>` | `[x](url)` | underlined accent link |
| `<ul>` / `<ol>` / `<li>` | `-` / `1.` | comfortable spacing |
| `<code>` | `` `x` `` | inline code |
| `<pre><code>` | ` ``` ` fence | block code (C auto-highlighted; other langs verbatim) |
| `<blockquote>` | `>` | accent left-border, muted italic |
| `<img>` | `![](pic.webp)` | rounded + border; relative paths auto-prefixed for `md` |
| `<iframe>` | raw HTML | for self-contained interactive animations |
| `<hr>` | `---` | centered accent gradient divider |
| `<table>` | GFM table | styled rows |

Need a new prose element? Add it to `.reader-body …` in `blog/blog.css`.

---

## The interpreter (`blog/blog-interpreter.js`)

One seam between a raw body and the HTML injected into `#reader-body`:

```
BlogInterpreter.render(raw, { type, slug }) -> htmlString
  type 'html' → returns raw unchanged (byte-for-byte)
  type 'md'   → marked.parse(raw), then normalize:
                  1. first top-level <p> gets class="lead"
                  2. relative <img src> → blog/blog_data/<slug>/
                  3. fenced code keeps its language hint (class="language-xxx") for highlight.js;
                     unlabeled fences are auto-detected downstream
```

`writeBody()` (in `blog-views.js`) calls it once, then runs `highlightAllCode()` and `buildToc()` on the result — both operate on the DOM, so they don't care which format the body came from. To add Markdown features, change the normalization here; nothing downstream needs to know.

---

## TOC sidebar

On wide viewports (≥ 1360 px) the reader builds a sticky left sidebar from the post's `<h2>`/`<h3>` (`blog/blog-toc.js`). It slugifies headings into stable `id`s, renders `toc-link`s, and uses an `IntersectionObserver` (`rootMargin: '-10% 0px -80% 0px'`) for scroll-spy. Clicks use `scrollIntoView` with `e.preventDefault()` — **never let them change `location.hash`** (that would trigger `route()`). Below the breakpoint a floating `#toc-fab` opens `#mobile-toc`. Driven entirely by headings — fewer than 2 headings → no sidebar. Keep headings concise (links are ~220 px wide).

---

## Asset paths inside bodies

- **Markdown**: relative image paths are auto-prefixed to `blog/blog_data/<slug>/…` by the interpreter. Absolute (`http(s)://`, `/…`, `blog/…`, `data:`) paths are left alone.
- **HTML**: paths resolve relative to `index.html`, NOT the post folder — so write the full `blog/blog_data/<slug>/img.webp`.
- The manifest `cover` is just the filename; the renderer prepends `blog/blog_data/<slug>/`.

Convert covers to WebP and keep them < 200 KB:

```bash
python -c "from PIL import Image; Image.open('cover.png').save('cover.webp', 'webp', quality=90)"
```

---

## Editing an existing post

1. Edit the `.md` (or `.js`) body in `blog/blog_data/<slug>/`.
2. If the change is meaningful, set `updated: '<today>'` in the manifest entry.
3. Don't change `slug` — it's the permanent URL and folder name.

To re-surface a heavily-rewritten post, set `pinned: true` rather than faking a new `date`.

---

## Component map

| File | What it owns |
|---|---|
| `blog/blog_data/manifest.js` | Sets `window.__BLOG_MANIFEST` synchronously before any module runs |
| `lib/marked.min.js` | Markdown → HTML parser (`window.marked`), used only by the interpreter |
| `blog/blog-i18n.js` | `translations.{zh,en}`, `applyLang()`, `toggleLang()`, `localStorage['louie-lang']` |
| `blog/blog-core.js` | `loadManifest()` (drops drafts, sorts: pinned-in-manifest-order then date desc), `loadPostBody(slug, lang, type)` (md → `fetch` + `_mdCache`; html → `<script>` + `_bodyLoading`), `pickLang()`, ripple (`bindRipples`, with `animationend` cleanup), `activeTag` |
| `blog/blog-syntax.js` | highlight.js wrapper; runs over `<pre><code>` after body injection. Uses the post's tag-derived language (else auto-detect), with a relevance gate so prose/diagrams stay plain. Opt out with `class="lang-text"` / `"no-highlight"` / a `text`/`plaintext` fence |
| `blog/blog-interpreter.js` | `BlogInterpreter.render(raw, {type, slug})` — md→HTML + normalization, html passthrough |
| `blog/blog-toc.js` | `buildToc()`, `clearToc()`, scroll-spy, mobile TOC FAB |
| `blog/blog-views.js` | `renderTagBar()`, `renderList()`, `renderReader()` (skeleton → `writeBody` via interpreter), HTML/MARKDOWN badge, `formatDate()`, `bindFadeIn()` |
| `blog/blog-router.js` | `route()` reads `location.hash`, swaps view, clears stray ripples, re-renders |
| `blog/blog.css` | All blog-specific styles |

Routing is hash-based. Language preference persists via `localStorage['louie-lang']`.

---

## Style / design rules

- Stick to the `:root` CSS variables in `lib/design/louie.css` — they match the home site.
- Reader prose width is capped by `main { max-width }` — don't widen, it hurts readability. The **list** view is its own narrower column.
- Bilingual UI: every static label has `data-i18n="key"`. Add new keys to **both** `translations.zh` and `translations.en`.

---

## Gotchas

1. **`md` posts need a server.** `fetch()` is blocked on `file://`. Use `python3 localrun.py` locally; production (Cloudflare, http) is fine.
2. **`marked` must load before the interpreter is called.** Keep `lib/marked.min.js` above `blog-interpreter.js` in `index.html`.
3. **`window.__BLOG_MANIFEST` must exist before any blog module runs.** `manifest.js` stays first; `blog-router.js` stays last.
4. **HTML `post.<lang>.js` must register the exact key `<slug>:<lang>`**, or the loader reports a missing body.
5. **Slug rename = broken links + missing folder.** Old `/#old-slug` URLs will 404.
6. **Ripple cleanup**: ripple spans are removed on `animationend`, and `route()` sweeps any leftovers — otherwise a finished ripple on a persistent element (the reader "back" button) replays when `#view-reader` toggles `display`. Don't remove either cleanup.
7. **Highlighting picks the language from the post's tags.** A post tagged `c`/`python`/`sql`/… highlights every code block as that language (see `CODE_LANG_BY_TAG` in `blog-views.js`); untagged posts fall back to auto-detection. A relevance gate leaves prose, program output, and ASCII diagrams plain. To force a block's language use a `language-xxx` fence/class; to keep one verbatim use `text`/`plaintext` or `class="lang-text"`.
8. **Code font ≠ the site font.** The site-wide `'JetBrains Mono'` family is actually a CJK *body* subset and is NOT reliably fixed-width for ASCII — using it for code made columns ragged. `blog.css` loads the real `JetBrainsMono.woff2` as a separate `'JBMono'` family for code boxes only, ligatures disabled (`-> ` must not render as `→`).
9. **Date format**: ISO 8601 only, or Luxon returns "Invalid DateTime".
10. **Cloudflare**: a repo-root `_headers` with `/blog/* → no-cache` keeps `manifest.js` / bodies fresh. If a deploy doesn't show, check that (and Rocket Loader, which can disturb script timing).
11. **Reader reveal uses `requestAnimationFrame`, not `IntersectionObserver`** — toggling `view-reader` from `display:none` fires the IO before layout settles (blank screen). Don't switch it back to IO.

---

## Quick checklist before publishing

- [ ] Slug chosen (short, lowercase, hyphenated, permanent)
- [ ] Folder `blog/blog_data/<slug>/` created
- [ ] Body written: `post.<lang>.md` (`type: 'md'`) or `post.<lang>.js` (`type: 'html'`, exact `<slug>:<lang>` key, escaped backticks/`${`)
- [ ] Headings use `<h2>`/`<h3>` (`##`/`###`) for the TOC; concise (< ~30 chars)
- [ ] Markdown images use bare relative names; HTML images use full `blog/blog_data/<slug>/…`
- [ ] Manifest entry added (`slug`, `date`, `type`, `title`, `excerpt`, `lang`, …); top-level `updated` bumped
- [ ] `cover.webp` placed + `cover` set (if any), < 200 KB
- [ ] `pinned` / `draft` set deliberately; for pinned, position controls order
- [ ] Previewed via `python3 localrun.py` — list AND reader; both languages if `lang: 'both'`; TOC on wide screens

---

<a id="中文"></a>

# 中文

## 一段话讲清架构

整站静态部署在 Cloudflare Pages —— 没后端、没数据库、没编译。`manifest.js` 是**索引**（每篇文章的元数据，不含正文）；每篇文章的**正文**各自一个文件夹，点开阅读器才按需加载。

正文有**两种格式**，由 manifest 里的 `type` 字段逐篇决定：

- **`md`（Markdown）** —— 一个纯 `.md` 文件。用 `fetch()` 取来，再由 `blog/blog-interpreter.js`（封装了 [marked](https://marked.js.org/)，即 `lib/marked.min.js`）在前端实时转成 HTML。**大多数文章用这个。**
- **`html`（默认）** —— 一个 `post.<lang>.js` 文件，把一段 HTML 字符串注册进 `window.__BLOG_POSTS`，用 `<script>` 注入。**仅在需要阅读器不支持的原生标记时用**（自定义 `<iframe>` 动画、特殊排版等）。

> ⚠️ **`md` 文章走 `fetch()`，而浏览器在 `file://` 下禁用 fetch。** 所以不能再双击 `index.html` 预览 Markdown 文章，请用下面的本地服务器。（`html` 文章仍能在 `file://` 跑，但统一用服务器最省事——就一条命令。）

## 本地预览

```bash
python3 localrun.py
```

在仓库根起一个静态服务器，自动打开浏览器，然后等待。**按任意键（或 Ctrl+C）关闭。** 它发 no-cache 头，所以改完 `.md` / `.js` / `.css` 刷新即见。

---

## 目录结构

```
index.html                         ← 入口页面。同时承载列表视图和阅读视图。
localrun.py                        ← 本地预览服务器（python3 localrun.py）
CNAME                              ← Cloudflare Pages 自定义域名
LICENSE
README.md                          ← 本文件（唯一的 README——旧的散落笔记已删）
lib/
├── design/                        ← fonts.css、字体、louie.css、tailwind 等
├── marked.min.js                  ← Markdown 解析器（marked，MIT）。window.marked
├── highlight/                     ← highlight.js（BSD-3）—— 语法高亮
│   ├── highlight.min.js           ← 常用语言包。window.hljs
│   └── vs2015.min.css             ← VS Code Dark+ 主题（token 配色）
├── resources/po.webp              ← favicon / OG 图
└── runtime/luxon.min.js           ← 日期格式化
blog/
├── blog.css                       ← 博客专属样式（列表卡片、阅读器、TOC 等）
├── blog-i18n.js                   ← 翻译表 + applyLang() + toggleLang()
├── blog-core.js                   ← manifest 加载、正文加载、涟漪、语言降级、tag 状态
├── blog-syntax.js                 ← highlight.js 封装：按文章默认语言 + relevance 阈值上色 + 代码框外壳（语言标签、复制、行号）
├── blog-interpreter.js            ← BlogInterpreter.render()：md → HTML（marked + 规范化）；html 原样透传
├── blog-toc.js                    ← buildToc / clearToc + scroll-spy
├── blog-views.js                  ← renderList、renderReader、renderTagBar、格式标签、fade-in
├── blog-router.js                 ← hash 路由 route()、启动顺序
├── blog_data/
│   ├── manifest.js                ← 仅索引。设置 window.__BLOG_MANIFEST。
│   ├── <slug>/                    ← 每篇文章一个文件夹
│   │   ├── post.zh.md / post.en.md     ← Markdown 正文（type: 'md'）
│   │   ├── post.zh.js / post.en.js     ← HTML 正文（type: 'html'）
│   │   ├── cover.webp             ← 可选封面图，被 manifest 引用
│   │   ├── anims/                 ← 可选：自包含 HTML/JS 动画（<iframe> 目标）
│   │   └── （其它资源）
│   └── （更多文章文件夹…）
└── editor/
    └── blog_writer.py             ← Tk 清单管理器：新建文章 + 编辑 manifest 元数据。
                                     正文用你自己的编辑器打开（.md / .js）；HTML 文章标 "!"。
```

URL：`/` → 列表视图；`/#<slug>` → 阅读视图。

### `index.html` 里的脚本加载顺序

```html
<script src="lib/runtime/luxon.min.js"></script>
<script src="lib/marked.min.js"></script>            <!-- 必须在解释器用它之前 -->
<script src="blog/blog_data/manifest.js"></script>    <!-- 必须最先：设置 window.__BLOG_MANIFEST -->
<script src="blog/blog-i18n.js"></script>
<script src="blog/blog-core.js"></script>
<script src="lib/highlight/highlight.min.js"></script><!-- 设置 window.hljs；必须在 blog-syntax.js 之前 -->
<script src="blog/blog-syntax.js"></script>
<script src="blog/blog-interpreter.js"></script>      <!-- 必须在 blog-views.js 之前（writeBody 调用它） -->
<script src="blog/blog-toc.js"></script>
<script src="blog/blog-views.js"></script>
<script src="blog/blog-router.js"></script>           <!-- 必须最后：启动 route() -->
```

别打乱：`manifest.js` 最先，`blog-router.js` 最后。

---

## `manifest.js` 字段（仅索引，不含正文）

```js
window.__BLOG_MANIFEST = {
  version: 3,
  updated: 'YYYY-MM-DD',         // 顶层：manifest 上次改动的日期（仅信息）
  posts: [
    {
      slug: 'kebab-case-id',     // 必填。URL hash 和文件夹名。发布后永远不要改。
      date: 'YYYY-MM-DD',        // 必填。ISO 8601 发布日期。排序 + 展示用。
      updated: 'YYYY-MM-DD',     // 可选。最后修改日期。仅当存在且 !== date 时显示。
      type: 'md',                // 可选。'html'（默认）| 'md'。决定正文怎么加载和渲染。
      title:   { zh: '...', en: '...' },  // 必填。双语对象或单语字符串。
      excerpt: { zh: '...', en: '...' },  // 1-2 句卡片摘要。
      tags: ['tag1', 'tag2'],    // 可选。驱动过滤芯片；字符串完全相同的归为一组。
      cover: 'cover.webp',       // 可选。解析为 blog/blog_data/<slug>/cover.webp。
      readingTime: 3,            // 可选。整数分钟。
      lang: 'both',              // 'both'（默认）| 'zh' | 'en'
      pinned: false,             // 可选。true = 置顶。
      draft: false               // 可选。true = 列表和阅读器都拦截。
    }
  ]
};
```

字段规则：

- **`type`** 决定正文的一切。`'md'` → 阅读器 `fetch` `post.<lang>.md` 再交给 `BlogInterpreter` 渲染；`'html'`（或省略）→ 注入 `post.<lang>.js`，原样使用其字符串。
- **`title` / `excerpt`** 字符串或 `{zh, en}`。降级链：当前语言 → en → zh → 空。
- **`lang`**：`'both'` 加载请求语言、失败降级到另一种；`'zh'`/`'en'` 单语。
- **排序**：
  1. `pinned: true` 排最前。
  2. **置顶文章按它们在 `manifest.js` 里的出现顺序排列**（稳定排序）—— 想调置顶先后，直接在文件里上下挪条目即可。
  3. 非置顶：按 `date` 倒序（新的在前）。
- **`updated`**：表示"上次有意义的修改"。改错别字别动它。`updated === date` 时隐藏。
- **`pinned` UX**：元信息行 📌 小标签、卡片背景微着色、hover 强调色边框。一次别超过 2-3 篇。
- **`draft: true`**：从列表移除，且阅读器拦截（即使直接命中 hash）。

列表/阅读页的元信息行右侧还会显示一个 **`HTML` / `MARKDOWN` 标签**，按 `type` 自动生成。

---

## 两种格式：什么时候用哪个

| | **Markdown（`type: 'md'`）** | **HTML（`type: 'html'`，默认）** |
|---|---|---|
| 文件 | `post.<lang>.md`（纯 Markdown） | `post.<lang>.js`（模板字符串里的 HTML） |
| 加载方式 | `fetch()` → `BlogInterpreter` → marked | `<script>` 注入 → `window.__BLOG_POSTS` |
| 转义 | **不用** —— 反引号、`${` 随便写 | 必须把 `` ` `` 转成 `` \` ``、`${` 转成 `\${` |
| 能在 `file://` 跑 | 否（需本地服务器） | 是 |
| 适用 | 几乎所有文章 | 阅读器表达不了的原生标记（`<iframe>` 动画、特殊 HTML） |

两者最终都渲染进同一个 `#reader-body`，所以语法高亮和 TOC 对两种格式一视同仁。

---

## 添加新文章 —— Markdown（推荐）

1. **挑 slug** —— 短、小写、连字符。它既是 URL hash 又是文件夹名，发布后别改。
2. **建文件夹** `blog/blog_data/<slug>/`。
3. **写正文** `post.zh.md` 和/或 `post.en.md` —— 纯 Markdown，无 JS 包装、无需转义。可以用任意编辑器（如 Typora）。
4. **(可选) 封面** 放 `blog/blog_data/<slug>/cover.webp`。
5. **追加 manifest 条目**，带 **`type: 'md'`**。顺手 bump 顶层 `updated`。
6. **预览**：`python3 localrun.py`。

`BlogInterpreter` 为 Markdown 自动处理的细节：
- **首段**自动套用 `lead` 样式。
- **相对图片路径**（`![](pic.webp)`）自动补成 `blog/blog_data/<slug>/pic.webp`，不用写全路径。
- 代码围栏：` ```c ` 会语法高亮；其它语言（和无语言围栏）原样显示。
- Markdown 里的裸 HTML 会透传，所以署名行 `<p style="color: var(--muted); …">— Louie</p>` 这种照常生效。

## 添加新文章 —— HTML（进阶）

仅当需要 Markdown 表达不了的标记时用。第 1-2、4-6 步相同，只是把 **`type` 设为 `'html'`**（或省略）。第 3 步建 `post.<lang>.js`：

```js
/* Post body — <slug> / <lang> */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['<slug>:<lang>'] = `
<p class="lead">引导段…</p>

<h2>章节标题</h2>
<p>正文…</p>
`;
```

Key 必须精确等于 `<slug>:<lang>`，否则加载器报错。字符串里**把 `` ` `` 转成 `` \` ``、`${` 转成 `\${`**（它是 JS 模板字符串）。HTML 文章里 `<p class="lead">` 要自己写，图片 `src` 要写全 `blog/blog_data/<slug>/…`。

---

## 正文规范（两种格式通用）

阅读器支持的样式（`blog/blog.css` 里 `.reader-body`）。Markdown 自动映射到这些元素；HTML 文章直接用标签。

| 元素 | Markdown | 说明 |
|---|---|---|
| `<p class="lead">` | 首段 | 左侧强调色边框、斜体——`md` 自动套用 |
| `<h2>` / `<h3>` | `##` / `###` | 章节 / 子标题；驱动 TOC |
| `<p>` | 段落 | |
| `<strong>` / `<em>` | `**x**` / `*x*` | 强调色 / 米色斜体 |
| `<a href>` | `[x](url)` | 下划线强调色链接 |
| `<ul>`/`<ol>`/`<li>` | `-` / `1.` | 舒适间距 |
| `<code>` | `` `x` `` | 行内代码 |
| `<pre><code>` | ` ``` ` 围栏 | 代码块（C 自动高亮，其它语言原样） |
| `<blockquote>` | `>` | 左侧强调色边框、斜体灰 |
| `<img>` | `![](pic.webp)` | 圆角 + 边框；`md` 的相对路径自动补全 |
| `<iframe>` | 裸 HTML | 自包含交互动画 |
| `<hr>` | `---` | 居中强调色渐变分隔线 |
| `<table>` | GFM 表格 | 带样式 |

要新增样式？改 `blog/blog.css` 里的 `.reader-body …`。

---

## 解释器（`blog/blog-interpreter.js`）

正文从原始字符串到注入 `#reader-body` 的唯一一道缝：

```
BlogInterpreter.render(raw, { type, slug }) -> htmlString
  type 'html' → 原样返回（逐字节）
  type 'md'   → marked.parse(raw)，再规范化：
                  1. 第一个顶层 <p> 加 class="lead"
                  2. 相对 <img src> → blog/blog_data/<slug>/
                  3. 代码围栏保留语言提示（class="language-xxx"）交给 highlight.js；
                     无标注的围栏由下游自动检测
```

`writeBody()`（在 `blog-views.js`）调它一次，然后对结果跑 `highlightAllCode()` 和 `buildToc()` —— 这两个都对 DOM 操作，不关心正文来自哪种格式。要加 Markdown 特性，改这里的规范化即可，下游无需改动。

---

## TOC 侧栏

宽屏（≥ 1360 px）阅读器从 `<h2>`/`<h3>` 建粘性左侧目录（`blog/blog-toc.js`）：把标题 slug 化成稳定 `id`，渲染 `toc-link`，用 `IntersectionObserver`（`rootMargin: '-10% 0px -80% 0px'`）做 scroll-spy。点击用 `scrollIntoView` + `e.preventDefault()`——**绝不要改 `location.hash`**（会触发 `route()`）。窄屏用浮动 `#toc-fab` 打开 `#mobile-toc`。完全由标题驱动，少于 2 个标题不显示。标题尽量短（链接约 220px 宽）。

---

## 正文里的资源路径

- **Markdown**：相对图片路径由解释器自动补成 `blog/blog_data/<slug>/…`。绝对路径（`http(s)://`、`/…`、`blog/…`、`data:`）不动。
- **HTML**：路径相对 `index.html` 解析，不是文章文件夹——所以要写全 `blog/blog_data/<slug>/img.webp`。
- manifest 的 `cover` 只是文件名，渲染器自动加 `blog/blog_data/<slug>/` 前缀。

封面转 WebP 并保持 < 200 KB：

```bash
python -c "from PIL import Image; Image.open('cover.png').save('cover.webp', 'webp', quality=90)"
```

---

## 编辑现有文章

1. 改 `blog/blog_data/<slug>/` 里的 `.md`（或 `.js`）正文。
2. 改动有意义就把 manifest 条目的 `updated` 设为今天。
3. **永远不要改 `slug`** —— 永久 URL 和文件夹名。

大改后想"再次推荐"用 `pinned: true`，别伪造新 `date`。

---

## 组件分布

| 文件 | 职责 |
|---|---|
| `blog/blog_data/manifest.js` | 任何模块运行前同步设置 `window.__BLOG_MANIFEST` |
| `lib/marked.min.js` | Markdown → HTML 解析器（`window.marked`），仅解释器使用 |
| `blog/blog-i18n.js` | `translations.{zh,en}`、`applyLang()`、`toggleLang()`、`localStorage['louie-lang']` |
| `blog/blog-core.js` | `loadManifest()`（过滤 draft、排序：置顶按 manifest 顺序、非置顶日期倒序）、`loadPostBody(slug, lang, type)`（md → `fetch` + `_mdCache`；html → `<script>` + `_bodyLoading`）、`pickLang()`、涟漪（`bindRipples`，含 `animationend` 清理）、`activeTag` |
| `blog/blog-syntax.js` | highlight.js 封装；正文注入后跑过 `<pre><code>`。用文章标签推断的语言（否则自动检测），配合 relevance 阈值让散文/示意图保持纯文本。跳过：`class="lang-text"` / `"no-highlight"` / `text`/`plaintext` 围栏 |
| `blog/blog-interpreter.js` | `BlogInterpreter.render(raw, {type, slug})` —— md→HTML + 规范化，html 透传 |
| `blog/blog-toc.js` | `buildToc()`、`clearToc()`、scroll-spy、移动端 TOC FAB |
| `blog/blog-views.js` | `renderTagBar()`、`renderList()`、`renderReader()`（骨架 → 经解释器 `writeBody`）、HTML/MARKDOWN 标签、`formatDate()`、`bindFadeIn()` |
| `blog/blog-router.js` | `route()` 读 `location.hash`，切视图，清残留涟漪，重渲染 |
| `blog/blog.css` | 所有博客专属样式 |

路由是 hash 路由。语言偏好通过 `localStorage['louie-lang']` 持久化。

---

## 设计风格规则

- 守住 `lib/design/louie.css` 的 `:root` CSS 变量——和主站同步。
- 阅读器正文宽度由 `main { max-width }` 限制，别拓宽，损害可读性。**列表**视图是单独的、更窄的一列。
- 双语 UI：每个静态标签加 `data-i18n="key"`，新 key 必须**同时**加到 `translations.zh` 和 `translations.en`。

---

## 坑

1. **`md` 文章需要服务器。** `fetch()` 在 `file://` 被禁。本地用 `python3 localrun.py`；线上（Cloudflare, http）没问题。
2. **`marked` 必须在解释器被调用前加载。** `lib/marked.min.js` 要在 `index.html` 里排在 `blog-interpreter.js` 之前。
3. **`window.__BLOG_MANIFEST` 必须先于任何博客模块存在。** `manifest.js` 保持最先，`blog-router.js` 保持最后。
4. **HTML 的 `post.<lang>.js` 必须注册精确 key `<slug>:<lang>`**，否则加载器报"找不到正文"。
5. **改 slug = 死链 + 文件夹找不到**，老 `/#old-slug` 全 404。
6. **涟漪清理**：涟漪 span 在 `animationend` 时移除，`route()` 还会清扫残留——否则持久元素（阅读器"返回"键）上用完的涟漪会在 `#view-reader` 切 `display` 时重播。两处清理都别删。
7. **高亮按文章标签选语言。** 标 `c`/`python`/`sql`/… 的文章，所有代码块都按该语言上色（见 `blog-views.js` 的 `CODE_LANG_BY_TAG`）；无标签文章回退自动检测。relevance 阈值让散文、程序输出、ASCII 示意图保持纯文本。要强制某块语言用 `language-xxx` 围栏/类；要让某块原样显示用 `text`/`plaintext` 或 `class="lang-text"`。
8. **代码字体 ≠ 站点字体。** 全站的 `'JetBrains Mono'` 其实是个 CJK **正文**子集，ASCII 并非可靠等宽——拿它显示代码会导致列对不齐。`blog.css` 专门为代码框以 `'JBMono'` 这个独立 family 加载真正的 `JetBrainsMono.woff2`，并关闭连字（`-> ` 不能渲染成 `→`）。
9. **日期格式**：仅 ISO 8601，否则 Luxon 返回 "Invalid DateTime"。
10. **Cloudflare**：仓库根的 `_headers`（`/blog/* → no-cache`）保证 `manifest.js` / 正文刷新即新。发布没更新先查它（以及可能干扰脚本时序的 Rocket Loader）。
11. **阅读器显形用 `requestAnimationFrame`，不是 `IntersectionObserver`** —— 把 `view-reader` 从 `display:none` 切回时 IO 在 layout 稳定前触发（白屏）。别换回 IO。

---

## 发文章前的 checklist

- [ ] slug 选好（短、小写、连字符、永久不变）
- [ ] 文件夹 `blog/blog_data/<slug>/` 建好
- [ ] 正文写好：`post.<lang>.md`（`type: 'md'`）或 `post.<lang>.js`（`type: 'html'`，精确 `<slug>:<lang>` key、转义反引号/`${`）
- [ ] 标题用 `<h2>`/`<h3>`（`##`/`###`）给 TOC；精简（< 约 30 字）
- [ ] Markdown 图片用裸相对名；HTML 图片用全路径 `blog/blog_data/<slug>/…`
- [ ] manifest 条目加好（`slug`、`date`、`type`、`title`、`excerpt`、`lang` …）；顶层 `updated` bump
- [ ] 封面 `cover.webp` 放好 + 设 `cover`（若有），< 200 KB
- [ ] `pinned` / `draft` 该设的设；置顶靠条目位置决定先后
- [ ] 用 `python3 localrun.py` 预览过 —— 列表 + 阅读器；`lang: 'both'` 时两种语言；宽屏看 TOC
```

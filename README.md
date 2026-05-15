# Louie's Blog — README

> Notes for future-me. How the blog is wired together, and how to add a new post without breaking anything.
> 给未来自己的笔记。博客的内部结构，以及添加新文章不会踩坑的步骤。

- **English** → [§ English](#english)
- **中文** → [§ 中文](#中文)

---

<a id="english"></a>

# English

## Why the architecture looks like this

The site lives statically on Cloudflare Pages — no backend, no DB, no build step. But it should also "just work" when opened directly via `file://` for local preview (double-click `index.html`, see the blog).

To satisfy both, **everything is loaded via plain `<script>` tags** instead of `fetch()`. `fetch('local.json')` is blocked by the browser on `file://`; `<script src="local.js">` is not. Same code path on `file://`, `localhost`, and Cloudflare.

The split:

- `blog/blog_data/manifest.js` — the **index** only. Metadata for every post (slug, date, title, excerpt, tags, etc.). No bodies. Loaded once at page load.
- `blog/blog_data/<slug>/post.zh.js` and `blog/blog_data/<slug>/post.en.js` — each post's **body**, in its own folder. Loaded on demand when the reader view opens that post.

---

## File layout

```
index.html                         ← entry page. Hosts BOTH list view and reader view.
CNAME                              ← Cloudflare Pages custom domain
LICENSE
README.md                          ← this file
blog_readme.md                     ← legacy EN notes (kept for history; this README supersedes them)
blog_readme_c.md                   ← legacy ZH notes (kept for history; this README supersedes them)
lib/
├── design/
│   ├── fonts.css                  ← @font-face for JetBrains Mono
│   ├── JetBrainsMono.woff2
│   ├── JetBrainsMono-Bold.woff2
│   ├── fonts_chunks/              ← subset CJK font chunks
│   ├── louie.css                  ← shared site styles + :root CSS variables (matches the louie1.com home)
│   ├── tailwindcss.js             ← Tailwind play CDN snapshot (offline-friendly)
│   └── tailwind.config.js
├── resources/
│   └── po.webp                    ← favicon / OG image
└── runtime/
    └── luxon.min.js               ← date formatting
blog/
├── blog.css                       ← blog-specific styles (list cards, reader, TOC, etc.)
├── blog-i18n.js                   ← translations table + applyLang() + toggleLang()
├── blog-core.js                   ← manifest loader, body loader, language fallback, tag state
├── blog-syntax.js                 ← hand-written C tokenizer (~150 lines, zero-dep)
├── blog-toc.js                    ← buildToc / clearToc + IntersectionObserver scroll-spy
├── blog-views.js                  ← renderList, renderReader, renderTagBar, formatDate, fade-in
├── blog-router.js                 ← hash-based route(), boot order, init wiring
├── blog_data/
│   ├── manifest.js                ← INDEX ONLY. Sets window.__BLOG_MANIFEST.
│   ├── blog_readme.md             ← legacy duplicate of root EN notes
│   ├── blog_readme_c.md           ← legacy duplicate of root ZH notes
│   ├── <slug>/                    ← one folder per post
│   │   ├── post.zh.js             ← Chinese body. Sets window.__BLOG_POSTS['<slug>:zh'].
│   │   ├── post.en.js             ← English body. Sets window.__BLOG_POSTS['<slug>:en'].
│   │   ├── cover.webp             ← OPTIONAL cover image, referenced from manifest.js
│   │   ├── anims/                 ← OPTIONAL self-contained HTML/JS animations (e.g. <iframe> targets)
│   │   └── (other assets, e.g. inline images)
│   └── (more post folders…)
└── editor/
    └── blog_writer.py             ← desktop GUI for adding/editing posts (Tk-based)
```

URLs:

- `/` (i.e. `index.html`) → list view
- `/#<slug>` → reader view for that post (slug must match a manifest entry)

`index.html` loads `manifest.js` first, then the six `blog/blog-*.js` modules in a fixed order (see `index.html` bottom). The router dynamically injects `<script>` tags for `post.<lang>.js` files only when the reader opens. Bodies are cached in memory after first load.

### Script load order in `index.html`

```html
<!-- index.html, near </body> -->
<script src="blog/blog_data/manifest.js"></script>
<script src="blog/blog-i18n.js"></script>
<script src="blog/blog-core.js"></script>
<script src="blog/blog-syntax.js"></script>
<script src="blog/blog-toc.js"></script>
<script src="blog/blog-views.js"></script>
<script src="blog/blog-router.js"></script>   <!-- must be last: kicks off route() -->
```

Do not reorder. `manifest.js` must run first so `window.__BLOG_MANIFEST` exists before any module touches it; `blog-router.js` must run last because it boots routing.

---

## `manifest.js` schema (index only — no bodies)

`blog/blog_data/manifest.js` sets `window.__BLOG_MANIFEST` to:

```js
window.__BLOG_MANIFEST = {
  version: 3,
  updated: 'YYYY-MM-DD',         // top-level: when this manifest was last touched (informational)
  posts: [
    {
      slug: 'kebab-case-id',     // REQUIRED. URL hash AND post folder name. Never change after publish.
      date: 'YYYY-MM-DD',        // REQUIRED. ISO 8601 publish date. Used for sort + display.
      updated: 'YYYY-MM-DD',     // OPTIONAL. ISO 8601 last-modified date. Shown only if present and !== date.
      title:   { zh: '...', en: '...' },  // REQUIRED. Object for bilingual, or plain string.
      excerpt: { zh: '...', en: '...' },  // 1–2 sentence card summary. Object or string.
      tags: ['tag1', 'tag2'],    // OPTIONAL. Powers the filter chips.
      cover: 'cover.webp',       // OPTIONAL. Resolved as `blog/blog_data/<slug>/cover.webp`.
      readingTime: 3,            // OPTIONAL. Integer minutes.
      lang: 'both',              // 'both' (default) | 'zh' | 'en'
      pinned: false,             // OPTIONAL. true = sticky to top of the list.
      draft: false               // OPTIONAL. true = excluded from list AND blocked in the reader.
    }
  ]
};
```

**No `body` field.** Bodies live in `blog/blog_data/<slug>/post.<lang>.js`.

Field rules:

- **`title` / `excerpt`** can be a plain string (single-language) or `{zh, en}` object. The renderer falls back: current lang → `en` → `zh` → empty.
- **`lang`** controls which body files the reader looks for:
  - `'both'` → loads `post.zh.js` for zh-UI and `post.en.js` for en-UI. If the requested-language file fails to load, the reader falls back to the other language automatically.
  - `'zh'` or `'en'` → loads a single `post.<lang>.js`. The card and reader still show the manifest title/excerpt in the UI language; only the body is single-language.
- **Sorting** (priority order):
  1. `pinned: true` posts come first
  2. Then by `date` descending (newest first)
  3. Ties broken by string compare on the date
- **`updated` semantics**: think "last meaningful edit". Don't bump for typos. If published `2026-05-01` and meaningfully edited `2026-05-12`, set `updated: '2026-05-12'` — cards then show `May 1, 2026 · Updated May 12 · 3 min`. If `updated === date` it's hidden.
- **`pinned` UX**: pinned posts get a small "📌 PINNED" pill in the meta row, a slightly tinted card background, and the accent border on hover. Don't pin more than 2–3 at a time.
- **Drafts**: `"draft": true` removes from list AND blocks the reader (even via direct hash).

---

## `post.<lang>.js` schema (one body per file)

Each post body file has the form:

```js
/* Post body — <slug> / <lang> */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['<slug>:<lang>'] = `
<p class="lead">Lead paragraph here…</p>

<h2>Section heading</h2>
<p>Paragraph body…</p>

<!-- … rest of the post … -->
`;
```

That's the whole file — one statement that registers the body string into a global registry. The key MUST match `<slug>:<lang>` (e.g. `'vision-networks-fttb:zh'`). If it doesn't, the loader will fail with a clear error.

For single-language posts (`lang: 'zh'` or `lang: 'en'`), still use the matching filename: `post.zh.js` or `post.en.js`. The key still uses the same `<slug>:<lang>` shape.

---

## How to add a new post

1. **Pick a slug** — short, lowercase, hyphenated (`first-bug`, `melb-winter-2026`). Becomes both the URL hash and the folder name. Don't change it later — old links break.
2. **Create the folder**: `blog/blog_data/<slug>/`
3. **Create body files** in that folder (one per supported language):
   - `post.zh.js` → registers `window.__BLOG_POSTS['<slug>:zh']`
   - `post.en.js` → registers `window.__BLOG_POSTS['<slug>:en']`

   Just copy an existing post's body file as a template. The body itself is plain HTML inside a JS template literal (backticks). Available styles are listed under "Post body conventions".
4. **(Optional) Drop a cover image** at `blog/blog_data/<slug>/cover.webp`.
5. **Append a manifest entry** to `posts[]` in `blog/blog_data/manifest.js`. Bump the top-level `updated`.
6. **Verify locally** — just double-click `index.html`. The list page loads first; clicking the post triggers the body load. No server required.

Alternatively, run `python blog/editor/blog_writer.py` for a Tk-based GUI that scaffolds folders and manifest entries for you.

---

## Post body conventions

Body strings are plain HTML inside a JS template literal (backticks). Available styles in the reader (defined in `blog/blog.css` under `.reader-body`):

| Element | Notes |
|---|---|
| `<p class="lead">` | First-paragraph treatment with accent left-border, italic |
| `<h2>` | Section heading with top border separator |
| `<h3>` | Sub-heading |
| `<p>` | Paragraph |
| `<strong>` | Accent-colored emphasis |
| `<em>` | Cream-colored italic |
| `<a href="…">` | Underlined accent link |
| `<ul>` / `<ol>` / `<li>` | Standard list, with comfortable spacing |
| `<code>` | Inline code with subtle accent background |
| `<pre><code>` | Block code (auto-highlighted for C — see `blog/blog-syntax.js`) |
| `<blockquote>` | Accent left-border, italic muted |
| `<img src="blog/blog_data/<slug>/img.webp">` | Block image with rounded corners and border |
| `<iframe src="blog/blog_data/<slug>/anims/foo.html">` | For self-contained interactive animations |
| `<hr>` | Centered accent gradient divider |

Need a new prose element? Add it both to the post body AND to `.reader-body …` rules in `blog/blog.css`.

---

## TOC sidebar (table of contents)

On wide viewports (≥ 1300 px), the reader automatically builds a sticky left sidebar with all `<h2>` and `<h3>` headings from the post body. Clicking a heading scrolls smoothly to it; the current section is highlighted as the user scrolls.

**How it works** (`blog/blog-toc.js`):
- `buildToc()` is called in `renderReader` (`blog/blog-views.js`) right after the body HTML is injected.
- It queries `#reader-body` for `h2, h3` elements, assigns stable `id` attributes (slugified from text), and renders `<a class="toc-link">` elements into `<nav id="toc-sidebar">`.
- An `IntersectionObserver` with `rootMargin: '-10% 0px -80% 0px'` tracks which heading is in the upper portion of the viewport and adds `.toc-current` to the matching link.
- Clicks use `scrollIntoView({ behavior: 'smooth' })` with `e.preventDefault()` — **do not let these links change `location.hash`**, because any hash change triggers `route()` which would navigate away from the post.
- `clearToc()` is called in `route()` (`blog/blog-router.js`) when switching back to the list view; it disconnects the observer and empties the sidebar.
- Language toggle rebuilds the TOC automatically because `applyLang → route → renderReader → writeBody → buildToc`.

**CSS positioning** (in `blog/blog.css`):
```css
left: max(20px, calc(50vw - 450px - 210px));
```
This keeps the TOC left of the 880 px content column regardless of viewport width. Hidden via `display: none !important` below 1300 px. On mobile, a floating `#toc-fab` button (defined in `index.html`) opens `#mobile-toc` instead.

**Post authoring note:** The TOC is driven entirely by `<h2>` and `<h3>` in the post body — no extra markup needed. Posts with fewer than 2 headings get no sidebar.

---

## ⚠️ Template-literal escaping

`post.<lang>.js` body strings are JS backtick-delimited template literals. Two characters need escaping:

| Want to write literally | Escape as |
|---|---|
| `` ` `` (backtick) | `` \` `` |
| `${` (dollar-curly) | `\${` |

If a post discusses code that contains backticks (rare — bash heredocs, markdown ticks), or shell variable syntax like `${HOME}`, escape them. Forgetting means JS will try to template-substitute and you'll get a runtime error or wrong content.

For 99% of prose articles, neither character appears, so no escaping is needed.

---

## Asset paths inside post bodies

Assets are loaded via the browser's normal HTML resolver, which resolves URLs **relative to `index.html`** (the page in the address bar) — NOT relative to the post folder. So:

```html
<!-- Wrong: relative to nothing useful -->
<img src="img.webp">
<img src="cover.webp">

<!-- Right: explicit prefix -->
<img src="blog/blog_data/<slug>/img.webp">
```

Same rule for the `cover` field in the manifest — it's the *filename* (e.g. `"cover.webp"`); the renderer prepends `blog/blog_data/<slug>/`.

Convert PNG → WebP for size:

```bash
python -c "from PIL import Image; Image.open('cover.png').save('cover.webp', 'webp', quality=90)"
```

Aim for cover images < 200 KB.

---

## Editing an existing post

1. Edit `blog/blog_data/<slug>/post.zh.js` and/or `post.en.js`. The body string is the only thing inside.
2. **If the change is meaningful**, set `updated: '<today>'` in the manifest entry. Trivial typo? Leave `updated` alone.
3. Bump the top-level `manifest.updated` if you want.
4. Don't change `slug` — it's the permanent URL AND folder name. If you must rename, expect old links to 404.

If a post had a major rewrite and you want it to feel "new" again, set `pinned: true` instead of faking a fresh `date`.

---

## Component map (split across `blog/blog-*.js`)

| File | What it owns |
|---|---|
| `blog/blog_data/manifest.js` | Sets `window.__BLOG_MANIFEST` synchronously before any module runs |
| `blog/blog-i18n.js` | `translations.{zh,en}`, `applyLang(lang)`, `toggleLang()`, `localStorage['louie-lang']` |
| `blog/blog-core.js` | `loadManifest()` (drops drafts, sorts), `loadPostBody(slug, lang)` (script-tag injection + in-flight dedupe via `_bodyLoading`), `pickLang(field)` with fallback chain, `activeTag` state |
| `blog/blog-syntax.js` | C tokenizer; runs over every `<pre><code>` after body injection. Opt out with `class="lang-text"` or `class="no-highlight"` |
| `blog/blog-toc.js` | `buildToc()`, `clearToc()`, `IntersectionObserver` scroll-spy |
| `blog/blog-views.js` | `renderTagBar()`, `renderList()`, `renderReader(slug)` (skeleton-first, then awaits body), `formatDate(iso)` (Luxon), `bindFadeIn()` |
| `blog/blog-router.js` | `route()` reads `location.hash`, swaps view, re-renders; init wiring on `DOMContentLoaded` |
| `blog/blog.css` | All blog-specific styles (cards, reader, TOC, mobile TOC, syntax-highlight colour palette) |

Routing is **hash-based** (`#slug`). No history API, no server routing.

Language preference persists via `localStorage['louie-lang']` and is shared with the rest of the louie1.com sites.

---

## Style / design rules to keep consistent

- Stick to the `:root` CSS variables defined in `lib/design/louie.css` — they match the home site. If you start hardcoding `#d98c70`, you've drifted.
- Cards use the same glass-blur recipe as the home site's `.project-card` (`rgba(35,35,37,0.4)` + `backdrop-filter: blur(40px) saturate(150%)`).
- Reader prose width is capped by `main { max-width: 880px }` — don't widen, it hurts readability.
- Bilingual UI: every translatable static label has `data-i18n="key"`. Add new keys to **both** `translations.zh` and `translations.en` in `blog/blog-i18n.js`, or the missing-language toggle will display the raw key.

---

## Gotchas

1. **`window.__BLOG_MANIFEST` must exist before any blog module runs.** Keep `<script src="blog/blog_data/manifest.js">` *before* the six `blog/blog-*.js` tags in `index.html`. The current order is correct — don't reorder.
2. **`post.<lang>.js` files must register the EXACT key `<slug>:<lang>`.** Mismatch (`'foo:zh'` when slug is `bar`) means the loader sees the script load successfully but no body present, and shows a clear error.
3. **Slug rename = broken inbound links AND missing folder.** If you must rename, expect old `/#old-slug` URLs to show "Post not found".
4. **Cloudflare caching of `manifest.js`** — if you ship a `_headers` file at the repo root with a rule like `/blog/* → no-cache, must-revalidate`, every `manifest.js` / `post.<lang>.js` request short-circuits revalidation, so users get new content on the next page load without a force-refresh. If a deploy doesn't show up, check `_headers` first (or just add one).
5. **Cloudflare Rocket Loader** can interfere with script execution timing. If the blog ever loads weird in production but fine locally, disable Rocket Loader for this site in the Cloudflare dashboard.
6. **No `fetch()` at runtime** — every load goes through `<script>` tags. This is intentional and the reason the site works on `file://`.
7. **C syntax highlighting is bundled** — `blog/blog-syntax.js` (~150 lines, zero-dep, hand-written tokenizer). It runs automatically over every `<pre><code>` after body injection; colours are defined in `blog/blog.css` (VS Code Dark+ palette). To opt a block out, add `class="lang-text"` or `class="no-highlight"`. To support more languages, extend the tokenizer in `blog-syntax.js`; only C is highlighted today since these tutorials are C-only.
8. **Date format**: ISO 8601 only (`YYYY-MM-DD`). Anything else makes Luxon return "Invalid DateTime".
9. **Tag filter doesn't reset on language switch** — by design (`activeTag` is module-scoped). If you change tags between languages, just click "All".
10. **Reader skeleton uses `requestAnimationFrame` to reveal itself, not `IntersectionObserver`.** When `route()` flips `view-reader` from `display:none` to `display:block` and then immediately calls `renderReader`, the IO fires before layout is recomputed and reports `isIntersecting: false` — so the `.visible` class never gets added and the entire reader stays at `opacity: 0` (blank screen). The fix: after `reader.innerHTML = skeleton`, call `requestAnimationFrame(() => wrapper.classList.add('visible'))`. rAF fires after layout is stable, so the CSS transition plays correctly. The list-view cards still use IO because they scroll into view from a stable layout — no issue there. **Do not switch the reader back to IO.**

---

## Quick checklist before publishing a new post

- [ ] Slug picked (short, lowercase, hyphenated, never to be changed)
- [ ] Folder `blog/blog_data/<slug>/` created
- [ ] `post.zh.js` and/or `post.en.js` written, **registering the exact key `<slug>:<lang>`**
- [ ] Body HTML uses only the elements listed in "Post body conventions"
- [ ] Asset paths in body use `blog/blog_data/<slug>/...` (resolved against `index.html`)
- [ ] No unescaped `` ` `` or `${` inside body strings
- [ ] **Headings are well-structured for the TOC** — use `<h2>` for top-level sections and `<h3>` for sub-sections. The sidebar appears automatically when there are ≥ 2 headings. Avoid skipping levels (e.g. `<h2>` → `<h4>`) since only h2/h3 are picked up.
- [ ] **Heading text is concise** — TOC links are 220 px wide; very long headings wrap to two lines. Aim for headings under ~30 characters where possible.
- [ ] Manifest entry appended in `manifest.js` (matching `slug`, `date`, `title`, `excerpt`, `lang`, etc.)
- [ ] Cover image: place `cover.webp` in `blog/blog_data/<slug>/` and add `cover: 'cover.webp'` to the manifest entry. Convert PNG → WebP with `cwebp -q 90 cover.png -o cover.webp`.
- [ ] `pinned` / `draft` set deliberately (or omitted)
- [ ] If editing an existing post, `updated` bumped (or deliberately not)
- [ ] Top-level `manifest.updated` bumped
- [ ] Verified locally by opening `index.html` directly in the browser — list view AND clicking through to the reader should both work
- [ ] If `lang: 'both'`, verified in **both** languages via the language toggle
- [ ] On a wide screen (≥ 1360 px), verify the TOC sidebar appears and scroll-spy highlights correctly

---

<a id="中文"></a>

# 中文

## 为什么是这个架构

整站静态部署在 Cloudflare Pages —— 没后端、没数据库、没编译步骤。同时还要求**双击 `index.html` 直接在文件浏览器里也能跑** (`file://`)。

为了满足两边，**所有数据通过 `<script>` 标签加载**，不用 `fetch()`。`fetch('local.json')` 在 `file://` 下被浏览器禁了，`<script src="local.js">` 没问题。这样 `file://`、`localhost`、Cloudflare 同一份代码。

数据分两层：

- `blog/blog_data/manifest.js` —— **索引**。所有文章的元数据（slug、日期、标题、摘要、tags 等）。**不含正文**。页面加载时一次拉完。
- `blog/blog_data/<slug>/post.zh.js` 和 `post.en.js` —— 每篇文章的**正文**，每篇一个文件夹。点开阅读器才按需加载。

---

## 目录结构

```
index.html                         ← 入口页面。同时承载列表视图和阅读视图。
CNAME                              ← Cloudflare Pages 自定义域名
LICENSE
README.md                          ← 本文件
blog_readme.md                     ← 旧英文笔记（保留历史；本 README 已取代）
blog_readme_c.md                   ← 旧中文笔记（保留历史；本 README 已取代）
lib/
├── design/
│   ├── fonts.css                  ← JetBrains Mono 字体声明
│   ├── JetBrainsMono.woff2
│   ├── JetBrainsMono-Bold.woff2
│   ├── fonts_chunks/              ← CJK 子集字体切片
│   ├── louie.css                  ← 站点共享样式 + :root CSS 变量（与 louie1.com 主站同步）
│   ├── tailwindcss.js             ← Tailwind play CDN 离线快照
│   └── tailwind.config.js
├── resources/
│   └── po.webp                    ← favicon / OG 图
└── runtime/
    └── luxon.min.js               ← 日期格式化
blog/
├── blog.css                       ← 博客专属样式（列表卡片、阅读器、TOC 等）
├── blog-i18n.js                   ← 翻译表 + applyLang() + toggleLang()
├── blog-core.js                   ← manifest 加载器、正文加载器、语言降级链、tag 状态
├── blog-syntax.js                 ← 自写 C 语法分词器（约 150 行、零依赖）
├── blog-toc.js                    ← buildToc / clearToc + IntersectionObserver scroll-spy
├── blog-views.js                  ← renderList、renderReader、renderTagBar、formatDate、fade-in
├── blog-router.js                 ← hash 路由 route()、启动顺序、初始化
├── blog_data/
│   ├── manifest.js                ← 仅索引。设置 window.__BLOG_MANIFEST。
│   ├── blog_readme.md             ← 根目录英文笔记的旧副本
│   ├── blog_readme_c.md           ← 根目录中文笔记的旧副本
│   ├── <slug>/                    ← 每篇文章一个文件夹
│   │   ├── post.zh.js             ← 中文正文。注册 window.__BLOG_POSTS['<slug>:zh']。
│   │   ├── post.en.js             ← 英文正文。注册 window.__BLOG_POSTS['<slug>:en']。
│   │   ├── cover.webp             ← 可选封面图，被 manifest.js 引用
│   │   ├── anims/                 ← 可选：自包含的 HTML/JS 动画（用作 <iframe> 目标）
│   │   └── （其它资源，如内嵌图片）
│   └── （更多文章文件夹…）
└── editor/
    └── blog_writer.py             ← 桌面 GUI 写文工具（基于 Tk）
```

URL：

- `/`（即 `index.html`） → 列表视图
- `/#<slug>` → 该 slug 的阅读视图

`index.html` 先加载 `manifest.js`，再按固定顺序加载 `blog/blog-*.js` 六个模块（见 `index.html` 末尾）。阅读器打开时路由会动态注入对应 `post.<lang>.js`。正文加载后内存缓存。

### `index.html` 里的脚本加载顺序

```html
<!-- index.html，靠近 </body> -->
<script src="blog/blog_data/manifest.js"></script>
<script src="blog/blog-i18n.js"></script>
<script src="blog/blog-core.js"></script>
<script src="blog/blog-syntax.js"></script>
<script src="blog/blog-toc.js"></script>
<script src="blog/blog-views.js"></script>
<script src="blog/blog-router.js"></script>   <!-- 必须最后：负责启动 route() -->
```

别打乱。`manifest.js` 必须先跑，否则任何模块访问 `window.__BLOG_MANIFEST` 都会拿到 `undefined`；`blog-router.js` 必须最后，因为它负责启动路由。

---

## `manifest.js` 字段（仅索引，不含正文）

```js
window.__BLOG_MANIFEST = {
  version: 3,
  updated: 'YYYY-MM-DD',         // 顶层：本 manifest 上次改动的日期（仅信息）
  posts: [
    {
      slug: 'kebab-case-id',     // 必填。URL hash 和文件夹名。发布后永远不要改。
      date: 'YYYY-MM-DD',        // 必填。ISO 8601 发布日期。用于排序和展示。
      updated: 'YYYY-MM-DD',     // 可选。最后修改日期。仅当存在且 !== date 时显示。
      title:   { zh: '...', en: '...' },  // 必填。双语对象，或单语字符串。
      excerpt: { zh: '...', en: '...' },  // 1-2 句卡片摘要。对象或字符串。
      tags: ['tag1', 'tag2'],    // 可选。驱动 tag 过滤芯片。
      cover: 'cover.webp',       // 可选。解析为 blog/blog_data/<slug>/cover.webp。
      readingTime: 3,            // 可选。整数分钟。
      lang: 'both',              // 'both'（默认） | 'zh' | 'en'
      pinned: false,             // 可选。true = 置顶。
      draft: false               // 可选。true = 列表和阅读器都拦截。
    }
  ]
};
```

**没有 `body` 字段**。正文住在 `blog/blog_data/<slug>/post.<lang>.js`。

字段规则：

- **`title` / `excerpt`** 可以是字符串（单语）或 `{zh, en}` 对象。语言降级链：当前语言 → en → zh → 空。
- **`lang`** 决定阅读器找哪个正文文件：
  - `'both'` → zh UI 加载 `post.zh.js`，en UI 加载 `post.en.js`。请求语言文件失败时自动降到另一种。
  - `'zh'` 或 `'en'` → 只加载对应单语文件。卡片/阅读器仍按 UI 语言显示元数据，仅正文单语。
- **排序**（按优先级）：
  1. `pinned: true` 排最前
  2. 然后按 `date` 倒序
  3. 同日期按字符串比较打破平手
- **`updated` 含义**：表示"上次有意义的修改"。修个错别字别动它。如果发布于 `2026-05-01`，实质性编辑于 `2026-05-12`，设 `updated: '2026-05-12'` —— 卡片显示 `2026.05.01 · 已更新 5/12 · 3 分钟`。`updated === date` 时隐藏。
- **`pinned` UX**：置顶文章在元信息行有"📌 置顶"小标签，卡片背景微微着色，hover 时强调色边框。一次别置顶超过 2-3 篇。
- **草稿**：`draft: true` 从列表移除，且阅读器拦截（即使直接命中 hash）。

---

## `post.<lang>.js` 字段（一篇正文一个文件）

每个正文文件长这样：

```js
/* Post body — <slug> / <lang> */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['<slug>:<lang>'] = `
<p class="lead">引导段…</p>

<h2>章节标题</h2>
<p>段落正文…</p>

<!-- … 文章其它部分 … -->
`;
```

整个文件就一句话——把正文字符串注册到全局 registry。Key 必须是 `<slug>:<lang>` 形式（如 `'vision-networks-fttb:zh'`）。Key 不对，加载器会报清楚的错。

单语文章（`lang: 'zh'` 或 `lang: 'en'`）也用对应的文件名 `post.zh.js` 或 `post.en.js`，Key 形式不变。

---

## 添加新文章

1. **挑 slug** —— 短、小写、连字符（`first-bug`、`melb-winter-2026`）。同时是 URL hash 和文件夹名。**发布后别改**，老链接会断。
2. **建文件夹**：`blog/blog_data/<slug>/`
3. **写正文文件**（每个支持的语言一个）：
   - `post.zh.js` → 注册 `window.__BLOG_POSTS['<slug>:zh']`
   - `post.en.js` → 注册 `window.__BLOG_POSTS['<slug>:en']`

   抄一篇现有文章的正文文件做模板。正文是 JS 模板字符串里的纯 HTML（反引号包裹）。可用样式见"正文规范"。
4. **(可选) 放封面图** 到 `blog/blog_data/<slug>/cover.webp`。
5. **追加 manifest 条目** 到 `blog/blog_data/manifest.js` 的 `posts[]`。同时把顶层 `updated` 改成今天。
6. **本地验证** —— 双击 `index.html`。列表先加载，点击文章触发正文加载。不需要服务器。

或者用 `python blog/editor/blog_writer.py` 跑那个 Tk GUI，它会自动建文件夹和写 manifest 条目。

---

## 正文规范

正文字符串是 JS 模板字符串里的纯 HTML（反引号）。阅读器（`.reader-body` 在 `blog/blog.css` 里）支持的样式：

| 元素 | 说明 |
|---|---|
| `<p class="lead">` | 首段处理：左侧强调色边框、斜体 |
| `<h2>` | 章节标题（带顶部分隔线） |
| `<h3>` | 子标题 |
| `<p>` | 段落 |
| `<strong>` | 强调色 |
| `<em>` | 米色斜体 |
| `<a href="…">` | 下划线强调色链接 |
| `<ul>` / `<ol>` / `<li>` | 标准列表，舒适间距 |
| `<code>` | 行内代码，淡强调色背景 |
| `<pre><code>` | 代码块（C 自动高亮，见 `blog/blog-syntax.js`） |
| `<blockquote>` | 左侧强调色边框，斜体灰 |
| `<img src="blog/blog_data/<slug>/img.webp">` | 块级图片，圆角 + 边框 |
| `<iframe src="blog/blog_data/<slug>/anims/foo.html">` | 自包含交互动画 |
| `<hr>` | 居中强调色渐变分隔线 |

要新增样式？同时改正文 + `blog/blog.css` 里 `.reader-body …` 的 CSS。

---

## TOC 侧栏（目录）

宽屏（≥ 1300 px）阅读器自动给所有 `<h2>` `<h3>` 建一个粘性左侧目录。点击平滑滚动；当前章节随滚动高亮。

**原理**（`blog/blog-toc.js`）：
- `buildToc()` 在 `renderReader`（`blog/blog-views.js`）写完正文 HTML 之后调用
- 查 `#reader-body` 里的 `h2, h3`，给它们生成稳定 `id`（从文本 slug 化），把 `<a class="toc-link">` 渲染进 `<nav id="toc-sidebar">`
- 用 `IntersectionObserver`（`rootMargin: '-10% 0px -80% 0px'`）跟踪哪个标题在视口上部，给对应链接加 `.toc-current`
- 点击用 `scrollIntoView({ behavior: 'smooth' })` + `e.preventDefault()` —— **绝对不要让链接改 `location.hash`**，否则会触发 `route()` 跳走
- `clearToc()` 在 `route()`（`blog/blog-router.js`）切回列表视图时调用，断 observer 清空侧栏
- 切换语言时 TOC 会自动重建，因为 `applyLang → route → renderReader → writeBody → buildToc`

**CSS 定位**（在 `blog/blog.css` 里）：
```css
left: max(20px, calc(50vw - 450px - 210px));
```
不管视口多宽，都把 TOC 摆在 880px 内容列的左边。低于 1300px 时 `display: none !important` 隐藏。手机端用浮动 `#toc-fab` 按钮（定义在 `index.html`）打开 `#mobile-toc` 面板。

**写文章时的注意**：TOC 完全由正文里的 `<h2>` `<h3>` 驱动，不需要额外标记。少于 2 个标题的文章不显示侧栏。

---

## ⚠️ 模板字符串转义

`post.<lang>.js` 正文字符串是 JS 反引号模板。两个字符要转义：

| 字面量 | 转义 |
|---|---|
| `` ` ``（反引号） | `` \` `` |
| `${`（美元 + 大括号） | `\${` |

文章里若引用含反引号的代码（罕见——bash heredoc、markdown 反引号）或 shell 变量语法 `${HOME}`，要转义。忘了转义 JS 会尝试模板替换，要么运行时报错要么内容错。

99% 的散文文章这俩字符都不出现，不用转义。

---

## 正文里的资源路径

资源走浏览器正常 HTML 解析器，**相对地址是基于地址栏里的 `index.html` 路径**——不是文章文件夹。所以：

```html
<!-- 错：相对什么都不对 -->
<img src="img.webp">
<img src="cover.webp">

<!-- 对：明确前缀 -->
<img src="blog/blog_data/<slug>/img.webp">
```

manifest 里 `cover` 字段是个例外——它只是文件名（如 `"cover.webp"`），渲染器会自动加 `blog/blog_data/<slug>/` 前缀。

PNG → WebP 减小体积：

```bash
python -c "from PIL import Image; Image.open('cover.png').save('cover.webp', 'webp', quality=90)"
```

封面图目标 < 200 KB。

---

## 编辑现有文章

1. 改 `blog/blog_data/<slug>/post.zh.js` 和/或 `post.en.js`。文件里只有正文字符串这一项要改。
2. **如果改动有意义**，把 manifest 条目里 `updated` 设为今天。错别字之类无关紧要的改不用动 `updated`。
3. 想的话也把顶层 `manifest.updated` 改一下。
4. **永远不要改 `slug`** —— 这是永久 URL 和文件夹名。改了老链接全 404。

如果一篇文章被大改要"再次推荐"，用 `pinned: true` 而不是伪造一个新 `date`。

---

## 组件分布（`blog/blog-*.js` 模块）

| 文件 | 职责 |
|---|---|
| `blog/blog_data/manifest.js` | 任何模块运行前同步设置 `window.__BLOG_MANIFEST` |
| `blog/blog-i18n.js` | `translations.{zh,en}`、`applyLang(lang)`、`toggleLang()`、`localStorage['louie-lang']` |
| `blog/blog-core.js` | `loadManifest()`（过滤 draft、排序）、`loadPostBody(slug, lang)`（注入 `<script>` + `_bodyLoading` 防重复）、`pickLang(field)`（带降级链）、`activeTag` 状态 |
| `blog/blog-syntax.js` | C 分词器；正文注入后自动跑过所有 `<pre><code>`。要跳过加 `class="lang-text"` 或 `class="no-highlight"` |
| `blog/blog-toc.js` | `buildToc()`、`clearToc()`、`IntersectionObserver` scroll-spy |
| `blog/blog-views.js` | `renderTagBar()`、`renderList()`、`renderReader(slug)`（先骨架，再 await 正文）、`formatDate(iso)`（Luxon）、`bindFadeIn()` |
| `blog/blog-router.js` | `route()` 读 `location.hash`，切视图，重新渲染；`DOMContentLoaded` 时初始化 |
| `blog/blog.css` | 所有博客专属样式（卡片、阅读器、TOC、移动端 TOC、语法高亮配色） |

路由是**hash 路由**（`#slug`）。不用 history API，没服务端路由。

语言偏好通过 `localStorage['louie-lang']` 持久化，和 louie1.com 主站共享。

---

## 设计风格规则

- 守住 `lib/design/louie.css` 里的 `:root` CSS 变量 —— 它们和主站同步。一旦开始硬编码 `#d98c70`，就跑偏了
- 卡片用和主站 `.project-card` 同样的玻璃磨砂配方（`rgba(35,35,37,0.4)` + `backdrop-filter: blur(40px) saturate(150%)`）
- 阅读器正文宽度上限 `main { max-width: 880px }` —— 别拓宽，会损害可读性
- 双语 UI：每个可翻译的静态标签都加 `data-i18n="key"`。新 key 必须**同时**加到 `blog/blog-i18n.js` 里的 `translations.zh` 和 `translations.en`，否则切语言会显示原始 key

---

## 坑

1. **`window.__BLOG_MANIFEST` 必须先于任何博客模块就存在**。`<script src="blog/blog_data/manifest.js">` 必须在 `index.html` 那六个 `blog/blog-*.js` 标签**之前**。当前顺序对，别动。
2. **`post.<lang>.js` 必须注册精确的 `<slug>:<lang>` key**。不匹配（slug 是 `bar` 但写成 `'foo:zh'`）会让加载器看到脚本加载成功但找不到正文，给你一个清楚的错。
3. **改 slug = 死链 + 文件夹找不到**。如果非要改，预期所有 `/#old-slug` 链接显示"文章未找到"。
4. **Cloudflare 缓存 `manifest.js`** —— 在仓库根放一个 `_headers` 文件，写规则 `/blog/* → no-cache, must-revalidate`，所有 `manifest.js` / `post.<lang>.js` 请求就会走"短路重新验证"，用户下一次访问就能看到新内容，不用强刷。如果发布后没看到更新，先看 `_headers`（没有的话就加一个）。
5. **Cloudflare Rocket Loader** 可能干扰脚本执行时序。如果博客在生产环境出现奇怪问题但本地正常，去 Cloudflare dashboard 关掉 Rocket Loader。
6. **运行时不用 `fetch()`** —— 所有加载都通过 `<script>`。这是有意为之，也是站点能在 `file://` 跑的原因。
7. **C 语法高亮已自带** —— `blog/blog-syntax.js`（约 150 行自写的小型分词器，零依赖）。正文注入后自动对所有 `<pre><code>` 跑高亮，配色定义在 `blog/blog.css`（VS Code Dark+ 风格）。要让某段 `<pre><code>` 跳过高亮，加 `class="lang-text"` 或 `class="no-highlight"`。要支持其它语言就在 `blog-syntax.js` 里扩展分词器；C 是这套教程唯一用到的语言所以暂时只做 C。
8. **日期格式**：仅 ISO 8601（`YYYY-MM-DD`）。其它格式 Luxon 会返回"Invalid DateTime"。
9. **切语言不重置 tag 过滤** —— 这是设计，`activeTag` 是模块级状态。如果你在不同语言间切换，点一下"All"。
10. **阅读器骨架用 `requestAnimationFrame` 显形，不是 `IntersectionObserver`**。`route()` 把 `view-reader` 从 `display:none` 切到 `display:block` 后立刻调 `renderReader`，IO 在 layout 重新计算之前就触发，报告 `isIntersecting: false` —— 所以 `.visible` 类永远加不上，整个阅读器停在 `opacity: 0`（白屏）。修法：`reader.innerHTML = skeleton` 之后调 `requestAnimationFrame(() => wrapper.classList.add('visible'))`。rAF 在 layout 稳定后触发，CSS 过渡正常播放。列表卡片仍用 IO 因为它们从稳定 layout 滚入视口——那边没问题。**别把阅读器换回 IO**。

---

## 发文章前的 checklist

- [ ] slug 选好（短、小写、连字符、永远不变）
- [ ] 文件夹 `blog/blog_data/<slug>/` 建好
- [ ] `post.zh.js` 和/或 `post.en.js` 写好，**精确注册 `<slug>:<lang>` key**
- [ ] 正文 HTML 只用"正文规范"列出的元素
- [ ] 正文里的资源路径用 `blog/blog_data/<slug>/...`（基于 `index.html` 解析）
- [ ] 正文字符串里没有未转义的 `` ` `` 或 `${`
- [ ] **标题层级合理给 TOC 用** —— `<h2>` 顶层、`<h3>` 子层。≥ 2 个标题侧栏自动出现。别跳级（如 `<h2>` → `<h4>`），TOC 只认 h2/h3
- [ ] **标题文字精简** —— TOC 链接 220px 宽，太长会折两行。尽量 30 字以内
- [ ] manifest 条目追加（`slug` / `date` / `title` / `excerpt` / `lang` 等都对）
- [ ] 封面图：`cover.webp` 放进 `blog/blog_data/<slug>/`，manifest 加 `cover: 'cover.webp'`。PNG → WebP：`cwebp -q 90 cover.png -o cover.webp`
- [ ] `pinned` / `draft` 该设的设、该不设的不设
- [ ] 编辑现有文章时该 bump `updated` 就 bump
- [ ] 顶层 `manifest.updated` bump
- [ ] 本地直接双击 `index.html` 验过 —— 列表 + 点进阅读器都正常
- [ ] `lang: 'both'` 时**两种语言**都用切语言按钮验证
- [ ] 宽屏（≥ 1360 px）确认 TOC 侧栏出现，scroll-spy 高亮正常

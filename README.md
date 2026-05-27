# Louie's Blog

- **English** → [§ English](#english)
- **中文** → [§ 中文](#中文)

---

<a id="english"></a>

# English

A static, dependency-light blog. No backend, no database, no build step: the
browser loads `index.html`, fetches a tree of JSON index files and Markdown/HTML
post bodies on demand, and renders everything client-side. This document is the
complete technical reference for the codebase.

## Table of contents

1. [Architecture overview](#architecture-overview)
2. [Local development](#local-development)
3. [Repository layout](#repository-layout)
4. [Boot sequence and script order](#boot-sequence-and-script-order)
5. [The `window.Blog` namespace](#the-windowblog-namespace)
6. [The Librarian: data model](#the-librarian-data-model)
7. [Loading, caching, and path resolution](#loading-caching-and-path-resolution)
8. [Routing](#routing)
9. [List view rendering](#list-view-rendering)
10. [Reader view rendering](#reader-view-rendering)
11. [The interpreter](#the-interpreter)
12. [Math (KaTeX)](#math-katex)
13. [Syntax highlighting](#syntax-highlighting)
14. [Table of contents sidebar](#table-of-contents-sidebar)
15. [Navigation chrome](#navigation-chrome)
16. [Internationalization](#internationalization)
17. [Styling and design tokens](#styling-and-design-tokens)
18. [Asset and path conventions](#asset-and-path-conventions)
19. [Authoring: add a post](#authoring-add-a-post)
20. [Authoring: add a collection](#authoring-add-a-collection)
21. [Editing and moving content](#editing-and-moving-content)
22. [Component reference](#component-reference)
23. [Gotchas](#gotchas)
24. [Deployment](#deployment)
25. [Known limitations](#known-limitations)
26. [Publishing checklist](#publishing-checklist)

---

## Architecture overview

The index is a recursive tree of `librarian.json` files, internally referred to
as **The Librarian**:

- The root index is `blog/blog_data/head_librarian.json`.
- A **collection** is a directory that contains its own `librarian.json` plus
  child directories. Each child is either a **post** or another **collection**,
  so collections nest to arbitrary depth.
- A **post** is a directory containing its body files (`post.<lang>.md` or
  `post.<lang>.js`) and any local assets.

Librarian files are fetched lazily — only the indices needed to render the
current URL are requested. Post bodies are fetched only when their reader opens.

All first-party runtime code is attached to a single global object,
`window.Blog`. The five UI modules (`blog-i18n`, `blog-core`, `blog-toc`,
`blog-views`, `blog-router`) are IIFEs that attach their public functions to
`window.Blog`; internal helpers stay module-private. `blog-syntax.js` and
`blog-interpreter.js` are separate IIFEs that expose `window.highlightAllCode`
and `window.BlogInterpreter`.

A post body is one of two formats, selected per-post by the `type` field:

- **`md`** — a plain Markdown file fetched with `fetch()` and converted to HTML
  at runtime by `blog-interpreter.js` (a wrapper around [marked](https://marked.js.org/)).
  Inline `$…$` and block `$$…$$` math are rendered by KaTeX during parsing.
- **`html`** (default when `type` is omitted) — a `post.<lang>.js` file that
  assigns an HTML string to `window.__BLOG_POSTS['<slug>:<lang>']` and is loaded
  by injecting a `<script>` tag. Used for markup the Markdown pipeline cannot
  express (e.g. `<iframe>`-embedded animations).

Because both `librarian.json` fetching and `md` bodies use `fetch()`, the site
requires an HTTP(S) origin; it does not run from `file://`.

## Local development

```bash
python3 localrun.py
```

`localrun.py` starts a static file server rooted at the repository, opens the
blog in the default browser, and blocks until a key is pressed (or `Ctrl+C`). It
sends no-cache response headers, so editing any `.md`, `.js`, `.json`, or `.css`
file and reloading shows the change without a hard refresh.

If a change does not appear, the browser is serving a cached asset — reload with
cache disabled (`Cmd/Ctrl+Shift+R`).

## Repository layout

```
index.html                         Entry document. Hosts list view, reader view, and the About modal.
localrun.py                        Local no-cache preview server.
CNAME                              Custom domain for the host.
LICENSE
README.md                          This document.
lib/
├── design/
│   ├── louie.css                  Shared site styles and the :root design tokens.
│   ├── fonts.css                  @font-face for the site 'JetBrains Mono' (a CJK body subset).
│   ├── JetBrainsMono.woff2        The real fixed-width face, loaded by blog.css as 'JBMono' for code.
│   ├── JetBrainsMono-Bold.woff2
│   ├── fonts_chunks/              Subset CJK font chunks.
│   ├── tailwindcss.js             Tailwind browser build (runtime CSS generation).
│   └── tailwind.config.js
├── marked.min.js                  Markdown parser. Exposes window.marked.
├── katex/
│   ├── katex.min.js               KaTeX core. Exposes window.katex.
│   ├── katex.min.css
│   └── fonts/                     20 KaTeX_*.woff2 faces.
├── highlight/
│   ├── highlight.min.js           highlight.js. Exposes window.hljs.
│   └── vs2015.min.css             Token colour theme.
├── resources/po.webp              Favicon and Open Graph image.
└── runtime/luxon.min.js           Date formatting.
blog/
├── blog.css                       All blog-specific CSS (list rows, reader prose, TOC, back button, About modal).
├── blog-i18n.js                   Translations table; language state and switching.
├── blog-core.js                   The Librarian loader; UI primitives; About modal; lang-aware helpers.
├── blog-syntax.js                 highlight.js wrapper and code-box chrome. Exposes window.highlightAllCode.
├── blog-interpreter.js            Markdown→HTML + KaTeX; HTML passthrough. Exposes window.BlogInterpreter.
├── blog-toc.js                    Reader table of contents and scroll-spy.
├── blog-views.js                  List and reader rendering; post body loader.
├── blog-router.js                 Hash router and boot.
├── blog_data/
│   ├── head_librarian.json        Root index.
│   ├── <slug>/                    A top-level post directory.
│   │   ├── post.zh.md | post.en.md     Markdown body (type: "md").
│   │   ├── post.zh.js | post.en.js     HTML body (type: "html").
│   │   ├── cover.webp             Optional cover image.
│   │   └── anims/ , images, …     Optional assets.
│   ├── <collection>/              A collection directory.
│   │   ├── librarian.json         The collection's index (same schema as head_librarian.json).
│   │   ├── <slug>/                A post inside the collection.
│   │   └── <sub-collection>/      A nested collection.
│   └── …
└── editor/
    └── blog_writer.py             Desktop manifest editor. OUT OF DATE — see Known limitations.
```

## Boot sequence and script order

Scripts are loaded at the end of `<body>` in this order:

```html
<script src="lib/design/tailwindcss.js"></script>   <!-- in <head>: Tailwind runtime -->
<script src="lib/design/tailwind.config.js"></script>
<!-- …near </body>: -->
<script src="lib/runtime/luxon.min.js"></script>
<script src="lib/marked.min.js"></script>            <!-- before blog-interpreter.js -->
<script src="lib/katex/katex.min.js"></script>        <!-- before blog-interpreter.js -->
<script src="blog/blog-i18n.js"></script>
<script src="blog/blog-core.js"></script>
<script src="lib/highlight/highlight.min.js"></script><!-- before blog-syntax.js -->
<script src="blog/blog-syntax.js"></script>
<script src="blog/blog-interpreter.js"></script>      <!-- before blog-views.js -->
<script src="blog/blog-toc.js"></script>
<script src="blog/blog-views.js"></script>
<script src="blog/blog-router.js"></script>           <!-- last: boots the app -->
```

Ordering constraints:

- `marked` and `katex` must load before `blog-interpreter.js`, which references
  both when registering the math extension and rendering Markdown.
- `highlight.min.js` must load before `blog-syntax.js`.
- `blog-router.js` must load last; its top-level code is the boot entry point.
- The order *among* the `blog-*.js` files otherwise does not matter for symbol
  resolution: each attaches its API to `window.Blog`, and those functions are
  only invoked at boot or in response to events, by which time every module has
  executed. There is no synchronous "must exist first" global anymore.

The boot block at the bottom of `blog-router.js`:

1. `Blog.applyLang(Blog.currentLang)` — applies translations to all `[data-i18n]`
   elements, updates the language toggle label, then calls `Blog.route()`.
2. `Blog.bindFadeIn()` and `Blog.bindRipples()` — wire the intersection-observer
   reveal and the tap-ripple effect.

`Blog.route()` is `async`: it awaits the root librarian fetch before the first
paint, so the initial list is empty for the duration of that request.

## The `window.Blog` namespace

| Symbol | Module | Purpose |
|---|---|---|
| `Blog.translations` | blog-i18n | `{ zh, en }` string tables. |
| `Blog.currentLang` | blog-i18n | `'zh'` or `'en'` (mutable). |
| `Blog.applyLang(lang)` | blog-i18n | Apply `[data-i18n]` strings, persist, re-route. |
| `Blog.toggleLang()` | blog-i18n | Flip language and apply. |
| `Blog.bindRipples()` | blog-core | Bind the tap ripple to unbound `.ripple-surface` elements. |
| `Blog.bindFadeIn()` | blog-core | IntersectionObserver reveal for `.fade-in`. |
| `Blog.pickLang(field, fallback)` | blog-core | Resolve a `{zh,en}` field by `currentLang` with fallback. |
| `Blog.formatDate(iso)` | blog-core | Luxon-format an ISO date in the UI locale. |
| `Blog.coverUrl(entry, parentPath)` | blog-core | Build a cover URL, or `null`. |
| `Blog.dataPath(path, file?)` | blog-core | Build a path under `blog/blog_data/`. |
| `Blog.librarianUrl(path)` | blog-core | URL of a librarian file (`''` → root). |
| `Blog.loadLibrarian(path)` | blog-core | Fetch + normalize + cache one librarian. |
| `Blog.resolvePath(path)` | blog-core | Walk root→path; return kind + entry/lib + chain. |
| `Blog.renderAbout()` | blog-core | Render the About modal content for `currentLang`. |
| `Blog.buildToc()` | blog-toc | Build the reader TOC and scroll-spy. |
| `Blog.clearToc()` | blog-toc | Tear down the TOC when leaving the reader. |
| `Blog.updateTocBtn()` | blog-toc | Toggle the mobile TOC FAB. |
| `Blog.renderList(path, lib, chain)` | blog-views | Render a collection level. |
| `Blog.renderReader(path, entry, chain)` | blog-views | Render a post. |
| `Blog.renderNotFound()` | blog-views | Render the not-found view. |
| `Blog.renderListError(path, err)` | blog-views | Render a librarian-load error. |
| `Blog.route()` | blog-router | Resolve the hash and dispatch a view. |
| `window.BlogInterpreter.render(raw, opts)` | blog-interpreter | Raw body → injectable HTML. |
| `window.highlightAllCode(root, lang)` | blog-syntax | Highlight `<pre><code>` in a subtree. |
| `window.__BLOG_POSTS` | (post `.js` files) | Registry of HTML post body strings. |

## The Librarian: data model

A librarian file (root `head_librarian.json` or any collection's
`librarian.json`) has the shape:

```jsonc
{
  "version": 4,
  "updated": "YYYY-MM-DD",
  "title": { "zh": "…", "en": "…" },   // optional; a collection's own display name
  "entries": [ /* post and collection entries, in any order */ ]
}
```

### Post entry

| Field | Required | Notes |
|---|---|---|
| `kind` | yes | `"post"`. |
| `slug` | yes | Directory name and last URL segment. Permanent. |
| `date` | yes | ISO 8601. Used for sorting and display. |
| `updated` | no | ISO 8601. Shown only if present and `!== date`. |
| `type` | no | `"html"` (default) or `"md"`. Selects the body format. |
| `title` | yes | `{zh,en}` object or a plain string. |
| `excerpt` | no | `{zh,en}` or string. Not rendered on the list; kept for metadata. |
| `tags` | no | Array. Populates the tag chips, scoped to the current level. |
| `cover` | no | Filename, resolved under the post directory. |
| `readingTime` | no | Integer minutes; shown in the reader header. |
| `lang` | no | `"both"` (default), `"zh"`, or `"en"`. |
| `pinned` | no | `true` floats the entry to the top of its level. |
| `draft` | no | `true` excludes it from the list and blocks it in the reader. |

### Collection entry

| Field | Required | Notes |
|---|---|---|
| `kind` | yes | `"collection"`. |
| `slug` | yes | Directory name holding the collection's `librarian.json`. |
| `date` | yes | ISO 8601. Used for sorting. |
| `title` | yes | `{zh,en}` or string. |
| `excerpt` | no | `{zh,en}` or string. Not rendered on the list. |
| `tags` | no | Array. |
| `cover` | no | Ignored on the list: a collection always renders a folder icon. |
| `pinned` | no | `true` floats the collection to the top. |

### Sorting

`blog-core.js` normalizes every librarian on load by removing `draft` entries
and sorting into three bands:

1. **Pinned** entries (any kind), preserving their declaration order in the file.
2. **Collections**, newest `date` first.
3. **Posts**, newest `date` first.

The net effect: collections sit above bare posts, and anything pinned floats
above everything. To reorder pinned items, move their entries in the file.

## Loading, caching, and path resolution

`Blog.loadLibrarian(path)`:

- `path === ''` resolves to `blog/blog_data/head_librarian.json`; any other path
  resolves to `blog/blog_data/<path>/librarian.json`.
- The result is normalized (drafts dropped, entries sorted) and cached by path.
  Concurrent requests for the same path share one in-flight promise.

`Blog.resolvePath(path)` walks from the root to the target, loading each
librarian along the way:

- For each path segment, it finds the matching entry in the current librarian.
- A `collection` entry causes the next librarian to load and the walk to
  continue; a `post` entry must be the final segment.
- Returns one of:
  - `{ ok: true, kind: 'collection', lib, chain }` — for the root or a collection.
  - `{ ok: true, kind: 'post', entry, chain }` — for an article.
  - `{ ok: false, notFound: true, chain }` — a segment did not match.
- `chain` is an array of `{ slug, path, entry }` for every segment, used to build
  breadcrumbs with real titles.

## Routing

The router is hash-based. `parseHash()` strips a leading `#` and any leading or
trailing `/`, yielding a path string:

| Hash | Path | View |
|---|---|---|
| `#` or empty | `''` | Root list. |
| `#/sql` | `sql` | Collection list. |
| `#/sql/sql-basics-1` | `sql/sql-basics-1` | Reader. |
| `#welcome` | `welcome` | Reader (single segment, backward compatible). |

Because a leading slash is stripped, `#welcome` and `#/welcome` are equivalent,
so links created before collections existed still resolve.

`Blog.route()` is `async`. On each hash change it:

1. Clears stray ripple spans (see Gotchas).
2. Computes the path and calls `setBackButton(path)`.
3. Awaits `Blog.resolvePath(path)`.
4. Dispatches:
   - resolution error → `Blog.renderListError`,
   - not found → `Blog.renderNotFound`,
   - `kind: 'post'` → `Blog.renderReader`,
   - `kind: 'collection'` → `Blog.renderList`.

## List view rendering

`Blog.renderList(path, lib, chain)`:

- Resets the active tag filter when the level (`path`) changes.
- Renders breadcrumbs into `#breadcrumb` from `chain` (hidden at the root).
- Renders the tag bar into `#tag-bar`, scoped to the tags present at the current
  level; clicking a chip re-renders this level filtered by that tag.
- Renders one **row** per entry into `#blog-list`:
  - **Post row**: thumbnail (cover, or the title's initial) · reserved pin slot ·
    single-line title (ellipsised) · date.
  - **Collection row**: a folder icon in the collection accent colour · reserved
    pin slot · title · date.
- Rows are flat (no borders), one line tall, and carry no tags, reading time, or
  excerpt. The pin slot has a fixed width on every row so titles align whether or
  not an entry is pinned.

`Blog.renderListError(path, err)` replaces the list with a localized failure
message and the error text.

## Reader view rendering

`Blog.renderReader(path, entry, chain)`:

1. Computes `slug` (last segment) and `parentPath`.
2. Renders the reader skeleton: meta row (pin, date, optional "updated",
   reading time), the `Markdown`/`HTML` badge, the title, tag chips, optional
   cover, an empty `#reader-body`, and a closing date line.
3. Resolves the body language: `lang === 'both'` uses `currentLang` and falls
   back to the other language if the requested body fails to load; `'zh'`/`'en'`
   loads only that language.
4. Loads the body via `loadPostBody(path, lang, type)` and calls `writeBody`.

`loadPostBody(path, lang, type)`:

- **md** → `fetch('blog/blog_data/<path>/post.<lang>.md')`, cached by `path:lang`.
- **html** → inject `<script src='blog/blog_data/<path>/post.<lang>.js'>`. The
  script registers `window.__BLOG_POSTS['<slug>:<lang>']`. The registry key is
  the **slug** (last segment), not the full path, so a post body keeps working
  after the post is moved into a collection.

`writeBody(raw)`:

1. `window.BlogInterpreter.render(raw, { type, basePath: path })` → HTML.
2. If the post is nested (`path !== slug`), rewrite any `blog/blog_data/<slug>/`
   prefix in the HTML to `blog/blog_data/<path>/`. This retargets hardcoded asset
   paths (e.g. `<iframe>` animation sources) so HTML posts remain relocatable.
3. Wrap every `<table>` in a `.table-scroll` container so wide tables scroll
   inside their own box on small screens instead of widening the page.
4. `window.highlightAllCode(el, postCodeLang(entry))`.
5. Bind in-post `#anchor` links to smooth-scroll without changing the hash.

## The interpreter

`window.BlogInterpreter.render(raw, opts)`:

```
render(raw, { type, basePath }) -> htmlString
  type 'html'  → returns raw unchanged.
  type 'md'    → marked.parse(raw) (with the KaTeX extension), then:
                   1. the first top-level <p> gets class="lead";
                   2. relative <img src> values are prefixed with
                      blog/blog_data/<basePath>/ ;
                   3. fenced-code language hints are preserved for highlight.js.
```

Absolute image paths (`http(s)://`, `/…`, `blog/…`, `data:`) are left untouched.
To change Markdown behaviour, modify the normalization here; the list/reader/TOC
layers operate on the resulting DOM and require no changes.

## Math (KaTeX)

KaTeX is vendored in `lib/katex/` (core, CSS, and 20 woff2 faces) and works
offline. `blog-interpreter.js` registers a marked extension that renders math at
**parse time**, so the LaTeX is converted to HTML before Markdown can alter it:

- inline: `$ … $`
- display: `$$ … $$`
- A literal dollar sign in prose must be escaped as `\$`; an unescaped `$` begins
  inline math.

## Syntax highlighting

`window.highlightAllCode(root, defaultLang)` runs over every `<pre><code>` in a
subtree after the body is injected:

- The language defaults to `defaultLang`, which `blog-views.js` derives from the
  post's tags via `CODE_LANG_BY_TAG` (e.g. a post tagged `c`/`python`/`sql`
  highlights all blocks as that language). Untagged posts fall back to
  highlight.js auto-detection.
- A relevance gate leaves prose, program output, and ASCII diagrams unhighlighted.
- Each block is wrapped in code-box chrome: a language label, a copy button, and
  a line-number gutter. Copy-button captions read `Blog.currentLang`.
- Token colours come from `lib/highlight/vs2015.min.css`.
- Opt out per block with a `text`/`plaintext` fence or `class="lang-text"` /
  `"no-highlight"`. Force a language with a `language-xxx` fence.

## Table of contents sidebar

`blog-toc.js` builds the reader TOC from the body's `<h2>`/`<h3>` headings:

- Headings are slugified into stable, collision-free `id`s.
- On viewports ≥ 1360 px a fixed left sidebar (`#toc-sidebar`) lists the
  headings; below that width a floating action button (`#toc-fab`) opens a drawer
  (`#mobile-toc`).
- An `IntersectionObserver` (`rootMargin: '-10% 0px -80% 0px'`) drives scroll-spy.
- TOC links call `scrollIntoView` with `preventDefault()` and never change
  `location.hash` (that would trigger routing).
- Fewer than two headings → no sidebar. `Blog.clearToc()` tears everything down
  when leaving the reader.

## Navigation chrome

- **Back button** (`#back-btn`): one shared element in `<main>`, used by both the
  collection and reader views. It is a sticky pill at the top of the content
  column at every width. `setBackButton(path)` in `blog-router.js` sets its href
  to the parent level and hides it at the root.
- **Breadcrumbs** (`#breadcrumb`): built from the resolution `chain`; shown only
  below the root.
- **About modal** (`#about-btn` ⓘ in the navbar → `#about-modal`): a bilingual
  changelog rendered by `Blog.renderAbout()`. It fades in/out (no `display`
  toggle) so a click ripple stays visible and no finished animation replays on
  reopen; `close()` also sweeps stray ripple spans.
- **Language toggle** (`#lang-toggle`): bound in `blog-router.js` (no inline
  handler).
- **Brand dropdown** (`#brand-dropdown-btn`): set up in `blog-core.js`.

## Internationalization

- `Blog.translations` holds `{ zh, en }` string tables keyed by `data-i18n`
  attribute names.
- `Blog.currentLang` initializes from `navigator.language`, then from
  `localStorage['louie-lang']` if set.
- `Blog.applyLang(lang)` rewrites all `[data-i18n]` elements, updates the toggle
  label and document language, persists the choice, refreshes the About modal,
  and calls `Blog.route()`.
- `Blog.pickLang(field)` resolves a `{zh,en}` value with the fallback chain
  `currentLang → en → zh → ''`.
- Every static UI string must have a `data-i18n` key present in **both** language
  tables.

## Styling and design tokens

- Design tokens live in `lib/design/louie.css` `:root`: `--bg`, `--surface`,
  `--surface-high`, `--border`, `--outline`, `--text`, `--muted`, `--accent`,
  `--accent-dim`, `--accent-on`. `blog.css` defines one additional token,
  `--collection` (teal), used for collection folder icons.
- `blog.css` must reference tokens via `var(--…)` rather than hardcoding hex,
  except for a few intentional one-offs (pure-white headings, the copy-success
  green, the error red, the gutter grey).
- The visual language is flat: list rows, chips, the back button, and thumbnails
  use filled surfaces with **no borders**.
- Code uses a dedicated `'JBMono'` face (`blog.css`) loaded from the real
  `JetBrainsMono.woff2`, with ligatures disabled, because the site-wide
  `'JetBrains Mono'` is a CJK body subset and is not reliably monospaced for
  ASCII.
- Reader prose styles live under `.reader-body` in `blog.css`.

## Asset and path conventions

- `Blog.dataPath(path, file?)` builds a path under `blog/blog_data/`.
- `Blog.coverUrl(entry, parentPath)` returns
  `blog/blog_data/<parentPath>/<slug>/<cover>` or `null`.
- **Markdown** relative image paths (`![](pic.webp)`) are prefixed with the
  post's full path by the interpreter.
- **HTML** bodies should reference assets as `blog/blog_data/<slug>/…` using the
  bare slug; when the post is nested in a collection, `writeBody` retargets that
  prefix to the post's real path, so assets survive a move.

## Authoring: add a post

1. Choose a slug: short, lowercase, hyphenated. It is the directory name and the
   last URL segment, and is permanent.
2. Choose the location:
   - top level → directory `blog/blog_data/<slug>/`, entry in `head_librarian.json`;
   - inside collection `X` → directory `blog/blog_data/X/<slug>/`, entry in
     `X/librarian.json`.
3. Write the body:
   - Markdown: `post.zh.md` and/or `post.en.md`. The first paragraph becomes the
     lead; relative images and `$…$` math are handled automatically.
   - HTML: `post.<lang>.js`:
     ```js
     /* Post body — <slug> / <lang> */
     (window.__BLOG_POSTS = window.__BLOG_POSTS || {})['<slug>:<lang>'] = `
     <p class="lead">Lead paragraph…</p>
     <h2>Section</h2>
     `;
     ```
     The registry key must be exactly `<slug>:<lang>`. Escape `` ` `` as `` \` ``
     and `${` as `\${`. Write `<p class="lead">` yourself and reference assets as
     `blog/blog_data/<slug>/…`.
4. (Optional) Add `cover.webp` to the post directory and set `cover`.
5. Add a `{ "kind": "post", … }` entry to the directory's librarian, with
   `type: "md"` for Markdown. Bump that librarian's `updated`.
6. Preview with `python3 localrun.py`.

## Authoring: add a collection

1. Create the collection directory, e.g. `blog/blog_data/<collection>/` (or
   nested inside a parent collection).
2. Create `<collection>/librarian.json`:
   ```json
   { "version": 4, "updated": "YYYY-MM-DD", "title": { "zh": "…", "en": "…" }, "entries": [] }
   ```
3. Add a `{ "kind": "collection", "slug": "<collection>", "title": {…}, "excerpt": {…} }`
   entry to the **parent** librarian (`head_librarian.json` for a top-level
   collection).
4. Add posts and/or further collections into the directory and list them in its
   `librarian.json`. Nesting has no depth limit.

## Editing and moving content

- Editing a body: edit the `.md` or `.js` file. If the change is significant, set
  the entry's `updated` to today.
- The `slug` is permanent: renaming it breaks existing links and the directory
  mapping.
- Moving a post into a collection changes its URL from `#<slug>` to
  `#/<collection>/<slug>`; old deep links to the moved post will not resolve.
  Hardcoded asset paths inside the body are retargeted automatically (see
  [Asset and path conventions](#asset-and-path-conventions)).

## Component reference

| File | Responsibilities |
|---|---|
| `blog/blog_data/head_librarian.json` | Root index, fetched at runtime. |
| `blog/blog_data/<collection>/librarian.json` | A collection's index. |
| `lib/marked.min.js` | Markdown→HTML (`window.marked`). |
| `lib/katex/katex.min.js` | Math (`window.katex`). |
| `lib/highlight/highlight.min.js` | Highlighting engine (`window.hljs`). |
| `lib/runtime/luxon.min.js` | Date formatting. |
| `blog/blog-i18n.js` | `translations`, `currentLang`, `applyLang`, `toggleLang`. |
| `blog/blog-core.js` | `loadLibrarian`, `resolvePath`, `dataPath`/`librarianUrl`/`coverUrl`, `pickLang`/`formatDate`, ripple, fade, brand dropdown, About modal. |
| `blog/blog-syntax.js` | `window.highlightAllCode`, code-box chrome. |
| `blog/blog-interpreter.js` | `window.BlogInterpreter.render`, KaTeX extension. |
| `blog/blog-toc.js` | `buildToc`, `clearToc`, `updateTocBtn`, scroll-spy. |
| `blog/blog-views.js` | `renderList`, `renderReader`, `renderNotFound`, `renderListError`, `loadPostBody`. |
| `blog/blog-router.js` | `route`, `setBackButton`, boot. |
| `blog/blog.css` | All blog-specific styles. |

## Gotchas

1. **An HTTP server is required.** Both `librarian.json` files and `md` bodies use
   `fetch()`, which is blocked on `file://`. Use `python3 localrun.py`.
2. **`marked` and `katex` must load before `blog-interpreter.js`.**
3. **Boot is asynchronous.** `blog-router.js` boots `applyLang → route()`, which
   awaits the root librarian fetch. There is no synchronous index global.
4. **HTML bodies register `window.__BLOG_POSTS['<slug>:<lang>']`** with the exact
   slug; a mismatch yields a missing-body error.
5. **Moving or renaming a post changes its URL.** Slugs should be treated as
   permanent.
6. **Ripple spans are removed on `animationend`,** and both `route()` and the
   About modal's `close()` sweep stray `.ripple` spans. A finished ripple left on
   a persistent element (the back button, a modal button) replays its CSS
   animation when its container toggles visibility; do not remove these sweeps.
7. **A literal `$` in Markdown prose must be `\$`.**
8. **Code uses `'JBMono'`, not `'JetBrains Mono'`.** The latter is a CJK body
   subset and renders ASCII code with ragged columns.
9. **Dates must be ISO 8601,** or Luxon yields "Invalid DateTime".
10. **The reader reveal uses `requestAnimationFrame`, not `IntersectionObserver`**;
    toggling `display:none` would fire the observer before layout settles.
11. **Browser caching.** A static server without no-cache headers may serve stale
    assets. `localrun.py` sends no-cache; otherwise hard-reload.

## Deployment

The site is a static bundle served over HTTP(S) with a custom domain (`CNAME`).
There is no build step; the repository is served as-is. To keep `head_librarian.json`,
nested `librarian.json` files, and post bodies fresh after a deploy, configure a
no-cache (or short-max-age) rule for `/blog/*` on the host (for example, a
Cloudflare Pages `_headers` file — not currently present in the repository).

## Known limitations

- **`blog/editor/blog_writer.py` is out of date.** It reads the removed
  `manifest.js` and does not understand the librarian tree. Edit `librarian.json`
  files by hand until it is updated.
- **Tailwind runs in the browser.** `lib/design/tailwindcss.js` generates CSS at
  runtime rather than at build time.
- **No `file://` support.** The site requires an HTTP origin.

## Publishing checklist

- [ ] Slug chosen: short, lowercase, hyphenated, permanent.
- [ ] Directory created at the correct path.
- [ ] Body written: `post.<lang>.md` (`type: "md"`) or `post.<lang>.js`
      (`type: "html"`, exact `<slug>:<lang>` key).
- [ ] Headings use `<h2>`/`<h3>` (`##`/`###`) for the TOC.
- [ ] Markdown images use bare relative names; HTML assets use
      `blog/blog_data/<slug>/…`; literal `$` escaped as `\$`.
- [ ] Entry added to the correct `librarian.json`; that file's `updated` bumped.
- [ ] `cover.webp` added and `cover` set, if any (keep it small).
- [ ] `pinned` / `draft` set deliberately.
- [ ] Previewed with `python3 localrun.py`: list, collection, and reader; both
      languages if `lang: "both"`; TOC on wide viewports.

---

<a id="中文"></a>

# 中文

一个静态、轻依赖的博客。没有后端、没有数据库、没有编译步骤：浏览器加载
`index.html`，按需 fetch 一棵 JSON 索引文件树和 Markdown/HTML 正文，并在客户端
渲染全部内容。本文是该代码库的完整技术参考。

## 目录

1. [架构概览](#架构概览)
2. [本地开发](#本地开发)
3. [仓库结构](#仓库结构)
4. [启动顺序与脚本加载](#启动顺序与脚本加载)
5. [window.Blog 命名空间](#windowblog-命名空间)
6. [The Librarian：数据模型](#the-librarian数据模型)
7. [加载、缓存与路径解析](#加载缓存与路径解析)
8. [路由](#路由)
9. [列表视图渲染](#列表视图渲染)
10. [阅读视图渲染](#阅读视图渲染)
11. [解释器](#解释器)
12. [数学公式（KaTeX）](#数学公式katex)
13. [语法高亮](#语法高亮)
14. [目录侧栏](#目录侧栏)
15. [导航组件](#导航组件)
16. [国际化](#国际化)
17. [样式与设计 token](#样式与设计-token)
18. [资源与路径约定](#资源与路径约定)
19. [写作：添加文章](#写作添加文章)
20. [写作：添加合集](#写作添加合集)
21. [编辑与移动内容](#编辑与移动内容)
22. [组件参考](#组件参考)
23. [坑](#坑)
24. [部署](#部署)
25. [已知限制](#已知限制)
26. [发布清单](#发布清单)

---

## 架构概览

索引是一棵递归的 `librarian.json` 文件树，内部称为 **The Librarian**：

- 根索引是 `blog/blog_data/head_librarian.json`。
- **合集**是一个目录，包含它自己的 `librarian.json` 加若干子目录。每个子目录要
  么是**文章**、要么是另一个**合集**，所以合集可以无限层嵌套。
- **文章**是一个目录，包含正文文件（`post.<lang>.md` 或 `post.<lang>.js`）和本地
  资源。

librarian 文件按需懒加载——只请求渲染当前 URL 所需的索引。文章正文只在其阅读器
打开时才 fetch。

所有第一方运行时代码都挂在单一全局对象 `window.Blog` 上。五个 UI 模块
（`blog-i18n`、`blog-core`、`blog-toc`、`blog-views`、`blog-router`）是 IIFE，把
公开函数挂到 `window.Blog`，内部辅助函数保持私有。`blog-syntax.js` 和
`blog-interpreter.js` 是独立 IIFE，暴露 `window.highlightAllCode` 和
`window.BlogInterpreter`。

正文有两种格式，由 `type` 字段逐篇决定：

- **`md`** —— 纯 Markdown 文件，用 `fetch()` 取来，由 `blog-interpreter.js`
  （marked 的封装）在运行时转成 HTML。行内 `$…$` 与块级 `$$…$$` 公式在解析时由
  KaTeX 渲染。
- **`html`**（省略 `type` 时的默认）—— 一个 `post.<lang>.js` 文件，把一段 HTML
  字符串赋给 `window.__BLOG_POSTS['<slug>:<lang>']`，通过注入 `<script>` 加载。
  用于 Markdown 流水线表达不了的标记（如 `<iframe>` 嵌入的动画）。

由于 librarian 的 fetch 和 `md` 正文都用 `fetch()`，本站需要 HTTP(S) 来源，无法
从 `file://` 运行。

## 本地开发

```bash
python3 localrun.py
```

`localrun.py` 在仓库根起一个静态文件服务器，用默认浏览器打开博客，并阻塞直到按键
（或 `Ctrl+C`）。它发送 no-cache 响应头，所以改任意 `.md` / `.js` / `.json` /
`.css` 文件并刷新即可看到变化，无需硬刷新。

如果改动没出现，是浏览器在用缓存——用禁用缓存的方式重载（`Cmd/Ctrl+Shift+R`）。

## 仓库结构

```
index.html                         入口文档。承载列表视图、阅读视图和关于弹窗。
localrun.py                        本地 no-cache 预览服务器。
CNAME                              自定义域名。
LICENSE
README.md                          本文档。
lib/
├── design/
│   ├── louie.css                  站点共享样式与 :root 设计 token。
│   ├── fonts.css                  站点 'JetBrains Mono'（CJK 正文子集）的 @font-face。
│   ├── JetBrainsMono.woff2        真正的等宽字体，被 blog.css 以 'JBMono' 加载用于代码。
│   ├── JetBrainsMono-Bold.woff2
│   ├── fonts_chunks/              CJK 字体子集分块。
│   ├── tailwindcss.js             Tailwind 浏览器构建（运行时生成 CSS）。
│   └── tailwind.config.js
├── marked.min.js                  Markdown 解析器。暴露 window.marked。
├── katex/
│   ├── katex.min.js               KaTeX 核心。暴露 window.katex。
│   ├── katex.min.css
│   └── fonts/                     20 个 KaTeX_*.woff2。
├── highlight/
│   ├── highlight.min.js           highlight.js。暴露 window.hljs。
│   └── vs2015.min.css             token 配色主题。
├── resources/po.webp              favicon 与 Open Graph 图。
└── runtime/luxon.min.js           日期格式化。
blog/
├── blog.css                       所有博客专属 CSS（列表行、阅读正文、TOC、返回键、关于弹窗）。
├── blog-i18n.js                   翻译表；语言状态与切换。
├── blog-core.js                   The Librarian 加载器；UI 基元；关于弹窗；语言相关辅助函数。
├── blog-syntax.js                 highlight.js 封装与代码框外壳。暴露 window.highlightAllCode。
├── blog-interpreter.js            Markdown→HTML + KaTeX；HTML 透传。暴露 window.BlogInterpreter。
├── blog-toc.js                    阅读器目录与 scroll-spy。
├── blog-views.js                  列表与阅读渲染；正文加载器。
├── blog-router.js                 hash 路由与启动。
├── blog_data/
│   ├── head_librarian.json        根索引。
│   ├── <slug>/                    一篇顶层文章目录。
│   │   ├── post.zh.md | post.en.md     Markdown 正文（type: "md"）。
│   │   ├── post.zh.js | post.en.js     HTML 正文（type: "html"）。
│   │   ├── cover.webp             可选封面图。
│   │   └── anims/、图片…          可选资源。
│   ├── <collection>/              一个合集目录。
│   │   ├── librarian.json         合集索引（schema 同 head_librarian.json）。
│   │   ├── <slug>/                合集内的文章。
│   │   └── <sub-collection>/      嵌套合集。
│   └── …
└── editor/
    └── blog_writer.py             桌面清单编辑器。已过时——见已知限制。
```

## 启动顺序与脚本加载

脚本在 `<body>` 末尾按此顺序加载：

```html
<script src="lib/design/tailwindcss.js"></script>   <!-- 位于 <head>：Tailwind 运行时 -->
<script src="lib/design/tailwind.config.js"></script>
<!-- …接近 </body>： -->
<script src="lib/runtime/luxon.min.js"></script>
<script src="lib/marked.min.js"></script>            <!-- 在 blog-interpreter.js 之前 -->
<script src="lib/katex/katex.min.js"></script>        <!-- 在 blog-interpreter.js 之前 -->
<script src="blog/blog-i18n.js"></script>
<script src="blog/blog-core.js"></script>
<script src="lib/highlight/highlight.min.js"></script><!-- 在 blog-syntax.js 之前 -->
<script src="blog/blog-syntax.js"></script>
<script src="blog/blog-interpreter.js"></script>      <!-- 在 blog-views.js 之前 -->
<script src="blog/blog-toc.js"></script>
<script src="blog/blog-views.js"></script>
<script src="blog/blog-router.js"></script>           <!-- 最后：启动应用 -->
```

顺序约束：

- `marked` 与 `katex` 必须在 `blog-interpreter.js` 之前加载，后者注册数学扩展并渲
  染 Markdown 时会引用它们。
- `highlight.min.js` 必须在 `blog-syntax.js` 之前。
- `blog-router.js` 必须最后加载，其顶层代码是启动入口。
- 其余 `blog-*.js` 之间的顺序对符号解析无影响：各自把 API 挂到 `window.Blog`，这些
  函数只在启动时或事件中被调用，那时所有模块都已执行。不再有"必须先存在"的同步全
  局量。

`blog-router.js` 底部的启动块：

1. `Blog.applyLang(Blog.currentLang)` —— 对所有 `[data-i18n]` 元素套用翻译，更新语
   言切换按钮文案，然后调用 `Blog.route()`。
2. `Blog.bindFadeIn()` 与 `Blog.bindRipples()` —— 接上 IntersectionObserver 显形和
   点击涟漪效果。

`Blog.route()` 是 `async`：首屏绘制前会 await 根 librarian 的 fetch，所以在该请求
期间初始列表为空。

## window.Blog 命名空间

| 符号 | 模块 | 作用 |
|---|---|---|
| `Blog.translations` | blog-i18n | `{ zh, en }` 字符串表。 |
| `Blog.currentLang` | blog-i18n | `'zh'` 或 `'en'`（可变）。 |
| `Blog.applyLang(lang)` | blog-i18n | 套用 `[data-i18n]`、持久化、重新路由。 |
| `Blog.toggleLang()` | blog-i18n | 切换语言并套用。 |
| `Blog.bindRipples()` | blog-core | 给未绑定的 `.ripple-surface` 绑点击涟漪。 |
| `Blog.bindFadeIn()` | blog-core | `.fade-in` 的 IntersectionObserver 显形。 |
| `Blog.pickLang(field, fallback)` | blog-core | 按 `currentLang` 解析 `{zh,en}` 字段，带降级。 |
| `Blog.formatDate(iso)` | blog-core | 按界面语言用 Luxon 格式化 ISO 日期。 |
| `Blog.coverUrl(entry, parentPath)` | blog-core | 构造封面 URL，或 `null`。 |
| `Blog.dataPath(path, file?)` | blog-core | 构造 `blog/blog_data/` 下的路径。 |
| `Blog.librarianUrl(path)` | blog-core | librarian 文件 URL（`''` → 根）。 |
| `Blog.loadLibrarian(path)` | blog-core | fetch + 规范化 + 缓存一个 librarian。 |
| `Blog.resolvePath(path)` | blog-core | 从根走到 path；返回 kind + entry/lib + chain。 |
| `Blog.renderAbout()` | blog-core | 按 `currentLang` 渲染关于弹窗内容。 |
| `Blog.buildToc()` | blog-toc | 构建阅读器 TOC 与 scroll-spy。 |
| `Blog.clearToc()` | blog-toc | 离开阅读器时拆除 TOC。 |
| `Blog.updateTocBtn()` | blog-toc | 切换移动端 TOC 浮动按钮。 |
| `Blog.renderList(path, lib, chain)` | blog-views | 渲染一个合集层级。 |
| `Blog.renderReader(path, entry, chain)` | blog-views | 渲染一篇文章。 |
| `Blog.renderNotFound()` | blog-views | 渲染找不到视图。 |
| `Blog.renderListError(path, err)` | blog-views | 渲染 librarian 加载错误。 |
| `Blog.route()` | blog-router | 解析 hash 并分派视图。 |
| `window.BlogInterpreter.render(raw, opts)` | blog-interpreter | 原始正文 → 可注入 HTML。 |
| `window.highlightAllCode(root, lang)` | blog-syntax | 高亮子树内的 `<pre><code>`。 |
| `window.__BLOG_POSTS` | （文章 `.js` 文件） | HTML 正文字符串的注册表。 |

## The Librarian：数据模型

librarian 文件（根 `head_librarian.json` 或任意合集的 `librarian.json`）结构为：

```jsonc
{
  "version": 4,
  "updated": "YYYY-MM-DD",
  "title": { "zh": "…", "en": "…" },   // 可选；合集自身的显示名
  "entries": [ /* 文章条目和合集条目，顺序随意 */ ]
}
```

### 文章条目

| 字段 | 必填 | 说明 |
|---|---|---|
| `kind` | 是 | `"post"`。 |
| `slug` | 是 | 目录名与 URL 最后一段。永久。 |
| `date` | 是 | ISO 8601。用于排序与展示。 |
| `updated` | 否 | ISO 8601。仅当存在且 `!== date` 时显示。 |
| `type` | 否 | `"html"`（默认）或 `"md"`。选择正文格式。 |
| `title` | 是 | `{zh,en}` 对象或纯字符串。 |
| `excerpt` | 否 | `{zh,en}` 或字符串。列表上不渲染；保留作元信息。 |
| `tags` | 否 | 数组。填充标签芯片，作用于当前层级。 |
| `cover` | 否 | 文件名，解析到文章目录下。 |
| `readingTime` | 否 | 整数分钟；显示在阅读器头部。 |
| `lang` | 否 | `"both"`（默认）、`"zh"` 或 `"en"`。 |
| `pinned` | 否 | `true` 把条目浮到本层级顶部。 |
| `draft` | 否 | `true` 从列表排除并在阅读器拦截。 |

### 合集条目

| 字段 | 必填 | 说明 |
|---|---|---|
| `kind` | 是 | `"collection"`。 |
| `slug` | 是 | 含合集 `librarian.json` 的目录名。 |
| `date` | 是 | ISO 8601。用于排序。 |
| `title` | 是 | `{zh,en}` 或字符串。 |
| `excerpt` | 否 | `{zh,en}` 或字符串。列表上不渲染。 |
| `tags` | 否 | 数组。 |
| `cover` | 否 | 列表上忽略：合集始终渲染文件夹图标。 |
| `pinned` | 否 | `true` 把合集浮到顶部。 |

### 排序

`blog-core.js` 在加载时规范化每个 librarian：移除 `draft` 条目，并按三档排序：

1. **置顶**条目（任意类型），保持文件中的声明顺序。
2. **合集**，按 `date` 新到旧。
3. **文章**，按 `date` 新到旧。

净效果：合集排在裸文章之上，置顶的浮到一切之上。要调整置顶顺序，在文件里移动条目。

## 加载、缓存与路径解析

`Blog.loadLibrarian(path)`：

- `path === ''` 解析为 `blog/blog_data/head_librarian.json`；其它路径解析为
  `blog/blog_data/<path>/librarian.json`。
- 结果会被规范化（去 draft、排序）并按路径缓存。对同一路径的并发请求共享一个进行中
  的 promise。

`Blog.resolvePath(path)` 从根走到目标，沿途加载每个 librarian：

- 对每个路径段，在当前 librarian 中找匹配条目。
- `collection` 条目触发加载下一个 librarian 并继续；`post` 条目必须是最后一段。
- 返回以下之一：
  - `{ ok: true, kind: 'collection', lib, chain }` —— 根或合集。
  - `{ ok: true, kind: 'post', entry, chain }` —— 文章。
  - `{ ok: false, notFound: true, chain }` —— 某段不匹配。
- `chain` 是每段的 `{ slug, path, entry }` 数组，用于带真实标题构建面包屑。

## 路由

路由基于 hash。`parseHash()` 去掉开头的 `#` 和首尾的 `/`，得到路径字符串：

| Hash | 路径 | 视图 |
|---|---|---|
| `#` 或空 | `''` | 根列表。 |
| `#/sql` | `sql` | 合集列表。 |
| `#/sql/sql-basics-1` | `sql/sql-basics-1` | 阅读器。 |
| `#welcome` | `welcome` | 阅读器（单段，向后兼容）。 |

由于开头的斜杠被去掉，`#welcome` 与 `#/welcome` 等价，所以合集出现之前创建的链接仍
能解析。

`Blog.route()` 是 `async`。每次 hash 变化时：

1. 清除残留的涟漪 span（见坑）。
2. 计算路径并调用 `setBackButton(path)`。
3. await `Blog.resolvePath(path)`。
4. 分派：
   - 解析出错 → `Blog.renderListError`，
   - 找不到 → `Blog.renderNotFound`，
   - `kind: 'post'` → `Blog.renderReader`，
   - `kind: 'collection'` → `Blog.renderList`。

## 列表视图渲染

`Blog.renderList(path, lib, chain)`：

- 当层级（`path`）变化时重置当前标签筛选。
- 从 `chain` 把面包屑渲染进 `#breadcrumb`（根层级隐藏）。
- 把标签栏渲染进 `#tag-bar`，作用范围限于当前层级出现的标签；点击芯片会按该标签筛选
  并重新渲染本层级。
- 每个条目渲染一**行**到 `#blog-list`：
  - **文章行**：缩略图（封面，或标题首字母）· 固定的置顶槽 · 单行标题（省略号）·
    日期。
  - **合集行**：合集主题色的文件夹图标 · 固定的置顶槽 · 标题 · 日期。
- 行是扁平的（无描边）、一行高，不带标签、阅读时长或摘要。置顶槽在每行都有固定宽
  度，所以无论是否置顶，标题都对齐。

`Blog.renderListError(path, err)` 用本地化的失败信息和错误文本替换列表。

## 阅读视图渲染

`Blog.renderReader(path, entry, chain)`：

1. 计算 `slug`（最后一段）和 `parentPath`。
2. 渲染阅读器骨架：元信息行（置顶、日期、可选的"更新于"、阅读时长）、
   `Markdown`/`HTML` 标识、标题、标签芯片、可选封面、空的 `#reader-body`，和一行收
   尾日期。
3. 解析正文语言：`lang === 'both'` 用 `currentLang`，请求的正文加载失败时降级到另一
   语言；`'zh'`/`'en'` 只加载该语言。
4. 通过 `loadPostBody(path, lang, type)` 加载正文并调用 `writeBody`。

`loadPostBody(path, lang, type)`：

- **md** → `fetch('blog/blog_data/<path>/post.<lang>.md')`，按 `path:lang` 缓存。
- **html** → 注入 `<script src='blog/blog_data/<path>/post.<lang>.js'>`。该脚本注册
  `window.__BLOG_POSTS['<slug>:<lang>']`。注册表的 key 是 **slug**（最后一段），不
  是完整路径，所以文章被移进合集后正文仍能工作。

`writeBody(raw)`：

1. `window.BlogInterpreter.render(raw, { type, basePath: path })` → HTML。
2. 若文章是嵌套的（`path !== slug`），把 HTML 里任意 `blog/blog_data/<slug>/` 前缀
   重写成 `blog/blog_data/<path>/`。这会重定向硬编码的资源路径（如 `<iframe>` 动画
   源），使 HTML 文章可被移动。
3. 把每个 `<table>` 包进 `.table-scroll` 容器，使宽表格在小屏内部横向滚动，而不是撑
   宽页面。
4. `window.highlightAllCode(el, postCodeLang(entry))`。
5. 给文章内的 `#anchor` 链接绑定平滑滚动，且不改变 hash。

## 解释器

`window.BlogInterpreter.render(raw, opts)`：

```
render(raw, { type, basePath }) -> htmlString
  type 'html'  → 原样返回。
  type 'md'    → marked.parse(raw)（含 KaTeX 扩展），然后：
                   1. 第一个顶层 <p> 加 class="lead"；
                   2. 相对 <img src> 加前缀 blog/blog_data/<basePath>/ ；
                   3. 围栏代码的语言提示保留给 highlight.js。
```

绝对图片路径（`http(s)://`、`/…`、`blog/…`、`data:`）保持不动。要改 Markdown 行为，
改这里的规范化即可；列表/阅读/TOC 层对结果 DOM 操作，无需改动。

## 数学公式（KaTeX）

KaTeX 内置在 `lib/katex/`（核心、CSS、20 个 woff2），可离线工作。
`blog-interpreter.js` 注册一个 marked 扩展，在**解析时**渲染公式，这样 LaTeX 在
Markdown 改动它之前就被转成了 HTML：

- 行内：`$ … $`
- 块级：`$$ … $$`
- 正文里的真美元符号必须转义成 `\$`；未转义的 `$` 会开启行内公式。

## 语法高亮

`window.highlightAllCode(root, defaultLang)` 在正文注入后跑过子树内每个
`<pre><code>`：

- 语言默认取 `defaultLang`，由 `blog-views.js` 通过 `CODE_LANG_BY_TAG` 从文章标签推
  断（如标 `c`/`python`/`sql` 的文章把所有块按该语言高亮）。无标签文章回退到
  highlight.js 自动检测。
- relevance 阈值让散文、程序输出、ASCII 示意图保持不高亮。
- 每块被包进代码框外壳：语言标签、复制按钮、行号槽。复制按钮文案读 `Blog.currentLang`。
- token 配色来自 `lib/highlight/vs2015.min.css`。
- 按块跳过：用 `text`/`plaintext` 围栏或 `class="lang-text"` / `"no-highlight"`。强
  制某语言：用 `language-xxx` 围栏。

## 目录侧栏

`blog-toc.js` 从正文的 `<h2>`/`<h3>` 标题构建阅读器目录：

- 标题被 slug 化成稳定、无冲突的 `id`。
- 视口 ≥ 1360px 时用固定左侧栏（`#toc-sidebar`）列出标题；更窄时用浮动按钮
  （`#toc-fab`）打开抽屉（`#mobile-toc`）。
- `IntersectionObserver`（`rootMargin: '-10% 0px -80% 0px'`）驱动 scroll-spy。
- TOC 链接用 `scrollIntoView` + `preventDefault()`，绝不改 `location.hash`（那会触发
  路由）。
- 少于两个标题 → 无侧栏。`Blog.clearToc()` 在离开阅读器时拆除一切。

## 导航组件

- **返回按钮**（`#back-btn`）：`<main>` 里一个共用元素，列表和阅读视图都用。它在所有
  宽度下都是内容列顶部的置顶胶囊。`blog-router.js` 的 `setBackButton(path)` 把它的
  href 设为上一级并在根层级隐藏。
- **面包屑**（`#breadcrumb`）：从解析的 `chain` 构建；仅在根之下显示。
- **关于弹窗**（导航栏 `#about-btn` ⓘ → `#about-modal`）：双语更新日志，由
  `Blog.renderAbout()` 渲染。它淡入淡出（不切 `display`），所以点击涟漪可见、重开时
  不会重播已结束的动画；`close()` 还会清扫残留涟漪 span。
- **语言切换**（`#lang-toggle`）：在 `blog-router.js` 中绑定（无内联处理器）。
- **品牌下拉**（`#brand-dropdown-btn`）：在 `blog-core.js` 中设置。

## 国际化

- `Blog.translations` 保存按 `data-i18n` 属性名为 key 的 `{ zh, en }` 字符串表。
- `Blog.currentLang` 先从 `navigator.language` 初始化，若 `localStorage['louie-lang']`
  有值则用它。
- `Blog.applyLang(lang)` 重写所有 `[data-i18n]` 元素、更新切换按钮文案与文档语言、持
  久化选择、刷新关于弹窗，并调用 `Blog.route()`。
- `Blog.pickLang(field)` 按降级链 `currentLang → en → zh → ''` 解析 `{zh,en}` 值。
- 每个静态 UI 字符串都必须在**两个**语言表里都有 `data-i18n` key。

## 样式与设计 token

- 设计 token 在 `lib/design/louie.css` 的 `:root`：`--bg`、`--surface`、
  `--surface-high`、`--border`、`--outline`、`--text`、`--muted`、`--accent`、
  `--accent-dim`、`--accent-on`。`blog.css` 额外定义一个 token `--collection`（青
  色），用于合集文件夹图标。
- `blog.css` 必须通过 `var(--…)` 引用 token，而非硬编码 hex，少数有意的一次性色除外
  （纯白标题、复制成功的绿、报错红、行号灰）。
- 视觉语言是扁平的：列表行、芯片、返回按钮、缩略图用填充面、**无描边**。
- 代码用专用的 `'JBMono'` 字体（`blog.css`）从真正的 `JetBrainsMono.woff2` 加载、关
  闭连字，因为站点级 `'JetBrains Mono'` 是 CJK 正文子集，ASCII 并非可靠等宽。
- 阅读正文样式在 `blog.css` 的 `.reader-body` 下。

## 资源与路径约定

- `Blog.dataPath(path, file?)` 构造 `blog/blog_data/` 下的路径。
- `Blog.coverUrl(entry, parentPath)` 返回 `blog/blog_data/<parentPath>/<slug>/<cover>`
  或 `null`。
- **Markdown** 相对图片路径（`![](pic.webp)`）由解释器加上文章的完整路径前缀。
- **HTML** 正文应以裸 slug 形式引用资源 `blog/blog_data/<slug>/…`；当文章嵌在合集里
  时，`writeBody` 会把该前缀重定向到文章的真实路径，使资源在移动后仍可用。

## 写作：添加文章

1. 选 slug：短、小写、连字符。它是目录名和 URL 最后一段，永久不变。
2. 选位置：
   - 顶层 → 目录 `blog/blog_data/<slug>/`，条目放进 `head_librarian.json`；
   - 合集 `X` 内 → 目录 `blog/blog_data/X/<slug>/`，条目放进 `X/librarian.json`。
3. 写正文：
   - Markdown：`post.zh.md` 和/或 `post.en.md`。首段成为 lead；相对图片与 `$…$` 公式
     自动处理。
   - HTML：`post.<lang>.js`：
     ```js
     /* Post body — <slug> / <lang> */
     (window.__BLOG_POSTS = window.__BLOG_POSTS || {})['<slug>:<lang>'] = `
     <p class="lead">引导段…</p>
     <h2>章节</h2>
     `;
     ```
     注册表 key 必须精确等于 `<slug>:<lang>`。把 `` ` `` 转成 `` \` ``、`${` 转成
     `\${`。`<p class="lead">` 自己写，资源以 `blog/blog_data/<slug>/…` 引用。
4. （可选）把 `cover.webp` 放进文章目录并设 `cover`。
5. 往该目录的 librarian 加一个 `{ "kind": "post", … }` 条目，Markdown 用 `type: "md"`。
   bump 该 librarian 的 `updated`。
6. 用 `python3 localrun.py` 预览。

## 写作：添加合集

1. 创建合集目录，如 `blog/blog_data/<collection>/`（或嵌套在父合集内）。
2. 创建 `<collection>/librarian.json`：
   ```json
   { "version": 4, "updated": "YYYY-MM-DD", "title": { "zh": "…", "en": "…" }, "entries": [] }
   ```
3. 往**父** librarian（顶层合集即 `head_librarian.json`）加一个
   `{ "kind": "collection", "slug": "<collection>", "title": {…}, "excerpt": {…} }` 条目。
4. 把文章和/或更多合集放进目录并在它的 `librarian.json` 里列出。嵌套无深度限制。

## 编辑与移动内容

- 编辑正文：改 `.md` 或 `.js` 文件。改动重大时把条目的 `updated` 设为今天。
- `slug` 永久：改名会破坏已有链接和目录映射。
- 把文章移进合集会把它的 URL 从 `#<slug>` 变成 `#/<collection>/<slug>`；指向被移动文
  章的旧深链将无法解析。正文内硬编码的资源路径会被自动重定向（见
  [资源与路径约定](#资源与路径约定)）。

## 组件参考

| 文件 | 职责 |
|---|---|
| `blog/blog_data/head_librarian.json` | 根索引，运行时 fetch。 |
| `blog/blog_data/<collection>/librarian.json` | 合集索引。 |
| `lib/marked.min.js` | Markdown→HTML（`window.marked`）。 |
| `lib/katex/katex.min.js` | 数学（`window.katex`）。 |
| `lib/highlight/highlight.min.js` | 高亮引擎（`window.hljs`）。 |
| `lib/runtime/luxon.min.js` | 日期格式化。 |
| `blog/blog-i18n.js` | `translations`、`currentLang`、`applyLang`、`toggleLang`。 |
| `blog/blog-core.js` | `loadLibrarian`、`resolvePath`、`dataPath`/`librarianUrl`/`coverUrl`、`pickLang`/`formatDate`、涟漪、显形、品牌下拉、关于弹窗。 |
| `blog/blog-syntax.js` | `window.highlightAllCode`、代码框外壳。 |
| `blog/blog-interpreter.js` | `window.BlogInterpreter.render`、KaTeX 扩展。 |
| `blog/blog-toc.js` | `buildToc`、`clearToc`、`updateTocBtn`、scroll-spy。 |
| `blog/blog-views.js` | `renderList`、`renderReader`、`renderNotFound`、`renderListError`、`loadPostBody`。 |
| `blog/blog-router.js` | `route`、`setBackButton`、启动。 |
| `blog/blog.css` | 所有博客专属样式。 |

## 坑

1. **需要 HTTP 服务器。** `librarian.json` 文件和 `md` 正文都用 `fetch()`，在
   `file://` 下被禁。用 `python3 localrun.py`。
2. **`marked` 与 `katex` 必须在 `blog-interpreter.js` 之前加载。**
3. **启动是异步的。** `blog-router.js` 启动 `applyLang → route()`，后者 await 根
   librarian 的 fetch。不存在同步的索引全局量。
4. **HTML 正文以精确 slug 注册 `window.__BLOG_POSTS['<slug>:<lang>']`**；不匹配会报缺
   正文。
5. **移动或重命名文章会改变其 URL。** slug 应视为永久。
6. **涟漪 span 在 `animationend` 时移除**，且 `route()` 与关于弹窗的 `close()` 都清扫残
   留 `.ripple`。残留在持久元素（返回按钮、弹窗按钮）上用完的涟漪，会在其容器切换可见
   性时重播 CSS 动画；不要删掉这些清扫。
7. **Markdown 正文里的真美元符号必须写 `\$`。**
8. **代码用 `'JBMono'`，不是 `'JetBrains Mono'`。** 后者是 CJK 正文子集，渲染 ASCII 代
   码会列不齐。
9. **日期必须是 ISO 8601**，否则 Luxon 返回 "Invalid DateTime"。
10. **阅读器显形用 `requestAnimationFrame`，不是 `IntersectionObserver`**；切
    `display:none` 会在 layout 稳定前触发观察器。
11. **浏览器缓存。** 不发 no-cache 头的静态服务器可能返回过期资源。`localrun.py` 发
    no-cache；否则请硬刷新。

## 部署

本站是通过 HTTP(S) 提供、带自定义域名（`CNAME`）的静态包。没有编译步骤；仓库原样提
供。要在部署后保持 `head_librarian.json`、嵌套的 `librarian.json` 和正文新鲜，请在
宿主上为 `/blog/*` 配置 no-cache（或短 max-age）规则（例如 Cloudflare Pages 的
`_headers` 文件——目前仓库中没有）。

## 已知限制

- **`blog/editor/blog_writer.py` 已过时。** 它读取已删除的 `manifest.js`，不理解
  librarian 树。在它更新之前，请手动编辑 `librarian.json` 文件。
- **Tailwind 在浏览器里运行。** `lib/design/tailwindcss.js` 在运行时而非构建时生成
  CSS。
- **不支持 `file://`。** 本站需要 HTTP 来源。

## 发布清单

- [ ] slug 选好：短、小写、连字符、永久。
- [ ] 目录建在正确路径。
- [ ] 正文写好：`post.<lang>.md`（`type: "md"`）或 `post.<lang>.js`（`type: "html"`，
      精确 `<slug>:<lang>` key）。
- [ ] 标题用 `<h2>`/`<h3>`（`##`/`###`）以驱动 TOC。
- [ ] Markdown 图片用裸相对名；HTML 资源用 `blog/blog_data/<slug>/…`；真美元符号转义
      为 `\$`。
- [ ] 条目加进正确的 `librarian.json`；该文件的 `updated` 已 bump。
- [ ] 如有封面，`cover.webp` 已添加且设了 `cover`（保持小体积）。
- [ ] `pinned` / `draft` 有意识地设好。
- [ ] 用 `python3 localrun.py` 预览过：列表、合集、阅读器；`lang: "both"` 时两种语
      言；宽视口看 TOC。

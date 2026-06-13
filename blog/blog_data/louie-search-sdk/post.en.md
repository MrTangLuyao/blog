Every louie.* site shares one search box. Press ⌘K on the homepage, the blog, or the learn playground and the same overlay slides down — already knowing about every page, every post, and every lesson across all of them. It's a single file, `louie-search.js`, that any site pulls in with one line. This post is how you use it, and how it works underneath.

## One line to add it

The whole install is a single script tag:

```html
<script defer src="https://louie1.com/lib/search/louie-search.js"></script>
```

On load it starts listening for **⌘K** (Windows: **Ctrl+K**) and opens the overlay. No build step, no dependencies, nothing else to wire up. If you'd rather trigger it from your own button than rely on the hotkey:

```html
<button onclick="LouieSearch.open()">Search</button>
```

That's genuinely the minimum. Everything below is optional refinement.

## Configuring it

The script tag accepts a few `data-` attributes, mostly for locking the language or pointing the SDK at different origins when you develop another site locally:

| Attribute | Default | What it does |
|---|---|---|
| `data-lang` | follows browser / `localStorage` | Lock the overlay to `zh` or `en`. |
| `data-auto` | `true` | `"false"` skips the hotkey binding and only exposes the API. |
| `data-home-origin` | auto | Where homepage links point. Empty on `louie1.com`, `https://louie1.com` elsewhere. |
| `data-blog-origin` | `https://blog.louie1.com` | Blog base URL. |
| `data-blog-data-base` | `…/blog/blog_data` | Where the blog index files live. |
| `data-learn-origin` | `https://learn.louie1.com` | Learn base URL. |

And the JavaScript API:

| Call | Effect |
|---|---|
| `LouieSearch.open()` / `.close()` / `.toggle()` | Control the overlay. |
| `LouieSearch.setLang('zh' \| 'en')` | Sync the overlay's language. |
| `LouieSearch.prefetch()` | Warm the remote index before the user opens it. |
| `LouieSearch.configure({ … })` | Set `onLangSwitch` and `localItems` at runtime. |
| `LouieSearch.MOD` | `'⌘'` or `'Ctrl'`, handy for your own button label. |

### Keeping language in sync

The rule is one sentence: **the page owns the language.** If your site already manages its own bilingual UI, tell the overlay what language you're in at load time, and route the overlay's own language action back through your toggle. Then the two can never drift apart:

```js
LouieSearch.setLang(currentLang);
LouieSearch.configure({
  onLangSwitch: (next) => { if (next !== currentLang) toggleLang(); }
});
```

If you don't set `onLangSwitch`, the overlay just flips and remembers the choice on its own. Either way works — the hook only exists for sites that have their own switch to keep aligned.

### Adding your own entries

There are two paths, depending on scope. For static extras that should appear in search across every site, edit `search/extra_content.json` on the main site — no need to touch the SDK at all:

```jsonc
{
  "version": 1,
  "items": [
    {
      "title": { "zh": "标题", "en": "Title" },
      "sub":   { "zh": "副标题", "en": "Subtitle" },
      "hint":  "example.com",
      "url":   "https://example.com",
      "icon":  "link",
      "kw":    "extra search keywords"
    }
  ]
}
```

For per-page items — including actions that run code rather than navigate — pass `localItems`, which takes the same shape plus an optional `run`:

```js
LouieSearch.configure({
  localItems: [
    { title: 'Print this page', icon: 'file', run: () => window.print(), keepOpen: false }
  ]
});
```

## How it works

### Shadow DOM, zero dependencies

The whole overlay lives in a Shadow DOM root with `:host { all: initial }`, so the host page's CSS can't leak in and the overlay's styles can't leak out. That's what lets one stylesheet ride along to wildly different sites — a Tailwind homepage, a hand-rolled blog, a retro Windows-95 page — and look identical on each without a single collision. The colours come from the same `louie.css` tokens as the rest of the site, and it respects `prefers-reduced-motion`.

### One hotkey listener

Hotkeys are a single document-level `keydown` handler: ⌘/Ctrl+K toggles the overlay, Esc closes it (or clears the query first if there's text). The overlay itself is built lazily — the first time you actually open it — so a page that never triggers search pays almost nothing.

### Three tiers of content

What you search is assembled from three sources:

1. **Built-in items** ship inside the SDK: the louie.* sites, projects, and social links. They're available instantly, even offline.
2. **Remote items** are fetched live the first time you open the overlay:
   - **Blog** — it reads `head_librarian.json`, then each collection's `librarian.json`, turning every post and collection into a result. Publish a blog post and it's searchable immediately, with no change to the SDK.
   - **Learn** — it reads `search_broadcast.json`, a generated index covering every course, every lesson, and each playground. If that file is missing it falls back to `manifest.js`, which lists courses only.
   - **Extra** — the hand-curated `extra_content.json` above.
3. **Actions** sit at the bottom: switch language, view source, plus anything you added via `localItems`.

The "recent posts" group is derived, not fetched separately — it's just the remote post entries sorted by date, top three.

### Caching that refuses to lie

`loadRemote()` runs on every open, but it's careful. A complete snapshot is cached in `sessionStorage` for 30 minutes; failed sources get a 10-second back-off so one bad round doesn't stick. Collections are fetched with `Promise.allSettled`, so a single 404 doesn't sink the whole batch.

The detail I'm fondest of: **it never persists a partial snapshot.** The cache is written only when blog *and* learn *and* extra all loaded cleanly. If learn were down and we cached "everything except learn," that half-truth would poison every page in the tab for the full 30 minutes — search would silently pretend learn doesn't exist. So a partial load stays in memory only and gets retried; the cache always tells the truth or says nothing.

### Scoring

Ranking is a trimmed-down take on cmdk's command-score. The query is split into tokens, and **every** token has to match (an AND), with the final score averaged across them — so "sql join" only surfaces things matching both words. Within an item, each field is scored on a ladder:

- exact match — `1.0`
- prefix — `0.9`
- word-boundary hit — `0.8`
- substring — `0.6`
- subsequence (letters in order, gaps allowed) — `0.25`

and the fields are weighted: title `1.0`, keywords `0.9`, subtitle and hint `0.7`. Crucially, matching runs over both the `zh` and `en` text of every item, so "blog" and "博客" both find the same row — which is the whole point of a bilingual search.

### CORS and cache headers

The blog indexes sit on GitHub Pages, which already sends `Access-Control-Allow-Origin: *`. The main site opens `/search/*` and `/lib/search/*` the same way through a `_headers` file, with `Cache-Control: no-cache, must-revalidate`. That last part matters: the browser keeps a copy but has to revalidate it (a cheap `304` when nothing changed), so a fix to the SDK takes effect on every site immediately instead of lingering behind a `max-age` window, separately, in each origin's cache.

## Closing

The thing I like about this little SDK is that the seam is invisible. From a visitor's side it's just ⌘K, the same everywhere. From my side it's one file, one line per site, and a blog post becomes searchable across the whole network the moment it's published — no rebuild, no redeploy, no list to keep in sync by hand. The hard parts — style isolation, honest caching, bilingual ranking — are exactly the parts a visitor should never have to notice.

<p style="color: var(--muted); font-size: 14px; margin-top: 32px;">— Louie, written in Melbourne</p>

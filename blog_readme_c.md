# blog_readme_c.md（中文）

> 给未来的自己看的笔记。`blog.html` 的内部结构、添加新文章不会踩坑的步骤。

---

## 为什么是这个架构

整站静态部署在 Cloudflare Pages —— 没后端、没数据库、没编译步骤。同时还要求**双击 `blog.html` 直接在文件浏览器里也能跑** (`file://`)。

为了满足两边，**所有数据通过 `<script>` 标签加载**，不用 `fetch()`。`fetch('local.json')` 在 `file://` 下被浏览器禁了，`<script src="local.js">` 没问题。这样 `file://`、`localhost`、Cloudflare 同一份代码。

数据分两层：

- `blog/blog_data/manifest.js` —— **索引**。所有文章的元数据（slug、日期、标题、摘要、tags 等）。**不含正文**。页面加载时一次拉完。
- `blog/blog_data/<slug>/post.zh.js` 和 `post.en.js` —— 每篇文章的**正文**，每篇一个文件夹。点开阅读器才按需加载。

---

## 目录结构

```
blog.html                          ← 整个博客 UI（列表视图 + 阅读视图）
blog/
├── blog_data/
│   ├── manifest.js                ← 仅索引。设置 window.__BLOG_MANIFEST。
│   ├── blog_readme.md             ← 英文版
│   ├── blog_readme_c.md           ← 本文件
│   ├── <slug>/                    ← 每篇文章一个文件夹
│   │   ├── post.zh.js             ← 中文正文。注册 window.__BLOG_POSTS['<slug>:zh']。
│   │   ├── post.en.js             ← 英文正文。注册 window.__BLOG_POSTS['<slug>:en']。
│   │   ├── post.js                ← 单语版正文（lang !== 'both' 时用）。Key: '<slug>:<lang>'。
│   │   ├── cover.webp             ← 可选封面图，被 manifest.js 引用
│   │   └── （其它资源，比如内嵌图片）
│   └── （更多文章文件夹…）
└── editor/
    └── blog_writer.py             ← 桌面 GUI 写文工具（基于 Tk）
```

URL：

- `blog.html` → 列表视图
- `blog.html#<slug>` → 该 slug 的阅读视图

`blog.html` 启动时加载 `manifest.js`，然后阅读器打开时再注入对应 `post.<lang>.js`。正文加载后内存缓存。

---

## manifest.js 字段（仅索引，不含正文）

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

## post.<lang>.js 字段（一篇正文一个文件）

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
6. **本地验证** —— 双击 `blog.html`。列表先加载，点击文章触发正文加载。不需要服务器。

---

## 正文规范

正文字符串是 JS 模板字符串里的纯 HTML（反引号）。阅读器（`.reader-body` 在 `blog.html` 里）支持的样式：

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
| `<pre><code>` | 代码块 |
| `<blockquote>` | 左侧强调色边框，斜体灰 |
| `<img src="blog/blog_data/<slug>/img.webp">` | 块级图片，圆角 + 边框 |
| `<hr>` | 居中强调色渐变分隔线 |

要新增样式？同时改正文 + `blog.html` 里 `.reader-body …` 的 CSS。

---

## TOC 侧栏（目录）

宽屏（≥ 1300 px）阅读器自动给所有 `<h2>` `<h3>` 建一个粘性左侧目录。点击平滑滚动；当前章节随滚动高亮。

**原理**：
- `buildToc()` 在 `renderReader` → `writeBody(html)` 之后调用
- 查 `#reader-body` 里的 `h2, h3`，给它们生成稳定 `id`（从文本 slug 化），把 `<a class="toc-link">` 渲染进 `<nav id="toc-sidebar">`
- 用 `IntersectionObserver`（`rootMargin: '-10% 0px -80% 0px'`）跟踪哪个标题在视口上部，给对应链接加 `.toc-current`
- 点击用 `scrollIntoView({ behavior: 'smooth' })` + `e.preventDefault()` —— **绝对不要让链接改 `location.hash`**，否则会触发 `route()` 跳走
- `clearToc()` 在 `route()` 切回列表视图时调用，断 observer 清空侧栏
- 切换语言时 TOC 会自动重建，因为 `applyLang → route → renderReader → writeBody → buildToc`

**CSS 定位**：
```css
left: max(20px, calc(50vw - 450px - 210px));
```
不管视口多宽，都把 TOC 摆在 880px 内容列的左边。低于 1300px 时 `display: none !important` 隐藏。

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

资源走浏览器正常 HTML 解析器，**相对地址是基于地址栏里的 `blog.html` 路径**——不是文章文件夹。所以：

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

## blog.html 内部组件

| 元素/函数 | 用途 |
|---|---|
| `<script src="blog/blog_data/manifest.js">` | 主脚本运行前同步加载 `window.__BLOG_MANIFEST` |
| `loadManifest()` | 读 `__BLOG_MANIFEST`，过滤 drafts，排序（pinned → date desc） |
| `renderTagBar()` | 生成 tag 芯片 —— "All" + 所有文章 tags 去重排序的并集 |
| `renderList()` | 渲染匹配 `activeTag` 的文章卡片 |
| `loadPostBody(slug, lang)` | 按需注入 `<script src="blog/blog_data/<slug>/post.<lang>.js">`，等加载完返回正文。在 `__BLOG_POSTS` 和 `_bodyLoading` 里缓存以防重复 |
| `renderReader(slug)` | 立刻渲染元数据骨架，再 await `loadPostBody` 注入正文。失败时 fallback 到另一种语言 |
| `pickLang(field)` | 双语 `{zh, en}` 字段按 `currentLang` 解析（带降级链） |
| `formatDate(iso)` | Luxon 按 locale 格式化日期（zh: `yyyy.MM.dd`，en: `LLL d, yyyy`） |
| `route()` | 读 `location.hash`，切视图，重新渲染 |
| `applyLang(lang)` | 重新应用静态标签 + 重新 route（让可见内容反映新语言） |
| `bindFadeIn()` | 每次渲染后重新绑定 IntersectionObserver |

路由是**hash 路由**（`#slug`）。不用 history API，没服务端路由。

语言偏好通过 `localStorage['louie-lang']` 持久化，和 `index.html` 共享。

---

## 设计风格规则

- 守住 `:root` CSS 变量 —— 它们和 `index.html` 同步。一旦你开始硬编码 `#d98c70`，就跑偏了
- 卡片用和 `index.html` `.project-card` 同样的玻璃磨砂配方（`rgba(35,35,37,0.4)` + `backdrop-filter: blur(40px) saturate(150%)`）
- 阅读器正文宽度上限 `main { max-width: 880px }` —— 别拓宽，会损害可读性
- 双语 UI：每个可翻译的静态标签都加 `data-i18n="key"`。新 key 必须**同时**加到 `translations.zh` 和 `translations.en`，否则切语言会显示原始 key

---

## 坑

1. **`window.__BLOG_MANIFEST` 必须先于主脚本运行就存在**。`<script src="blog/blog_data/manifest.js">` 必须在 `blog.html` 内联 `<script>` **之前**。当前顺序对，别动。
2. **`post.<lang>.js` 必须注册精确的 `<slug>:<lang>` key**。不匹配（slug 是 `bar` 但写成 `'foo:zh'`）会让加载器看到脚本加载成功但找不到正文，给你一个清楚的错。
3. **改 slug = 死链 + 文件夹找不到**。如果非要改，预期所有 `blog.html#old-slug` 链接显示"文章未找到"。
4. **Cloudflare 缓存 `manifest.js`** —— 由仓库根的 `_headers` 文件处理。规则 `/blog/* → no-cache, must-revalidate` 让所有 `manifest.js` / `post.<lang>.js` 请求总是走"短路重新验证"，用户下一次访问就能看到新内容，不用强刷。如果发布后没看到更新，先看 `_headers`。
5. **Cloudflare Rocket Loader** 可能干扰脚本执行时序。如果博客在生产环境出现奇怪问题但本地正常，去 Cloudflare dashboard 关掉 Rocket Loader。
6. **运行时不用 fetch()** —— 所有加载都通过 `<script>`。这是有意为之，也是站点能在 `file://` 跑的原因。
7. **C 语法高亮已自带** —— `blog/blog-syntax.js`（~150 行自写的小型分词器，零依赖）。`writeBody` 之后自动对所有 `<pre><code>` 跑高亮，配色定义在 `blog.css`（VS Code Dark+ 风格）。要让某段 `<pre><code>` 跳过高亮，加 `class="lang-text"` 或 `class="no-highlight"`。要支持其它语言就在 `blog-syntax.js` 里扩展分词器；C 是这套教程唯一用到的语言所以暂时只做 C。
8. **日期格式**：仅 ISO 8601（`YYYY-MM-DD`）。其它格式 Luxon 会返回"Invalid DateTime"。
9. **切语言不重置 tag 过滤** —— 这是设计，`activeTag` 是模块级状态。如果你在不同语言间切换，点一下"All"。
10. **阅读器骨架用 `requestAnimationFrame` 显形，不是 `IntersectionObserver`**。`route()` 把 `view-reader` 从 `display:none` 切到 `display:block` 后立刻调 `renderReader`，IO 在 layout 重新计算之前就触发，报告 `isIntersecting: false` —— 所以 `.visible` 类永远加不上，整个阅读器停在 `opacity: 0`（白屏）。修法：`reader.innerHTML = skeleton` 之后调 `requestAnimationFrame(() => wrapper.classList.add('visible'))`。rAF 在 layout 稳定后触发，CSS 过渡正常播放。列表卡片仍用 IO 因为它们从稳定 layout 滚入视口——那边没问题。**别把阅读器换回 IO**。

---

## 发文章前的 checklist

- [ ] slug 选好（短、小写、连字符、永远不变）
- [ ] 文件夹 `blog/blog_data/<slug>/` 建好
- [ ] `post.zh.js` 和/或 `post.en.js` 写好，**精确注册 `<slug>:<lang>` key**
- [ ] 正文 HTML 只用"正文规范"列出的元素
- [ ] 正文里的资源路径用 `blog/blog_data/<slug>/...`（基于 `blog.html` 解析）
- [ ] 正文字符串里没有未转义的 `` ` `` 或 `${`
- [ ] **标题层级合理给 TOC 用** —— `<h2>` 顶层、`<h3>` 子层。≥ 2 个标题侧栏自动出现。别跳级（如 `<h2>` → `<h4>`），TOC 只认 h2/h3
- [ ] **标题文字精简** —— TOC 链接 220px 宽，太长会折两行。尽量 30 字以内
- [ ] manifest 条目追加（`slug` / `date` / `title` / `excerpt` / `lang` 等都对）
- [ ] 封面图：`cover.webp` 放进 `blog/blog_data/<slug>/`，manifest 加 `cover: 'cover.webp'`。PNG → WebP：`cwebp -q 90 cover.png -o cover.webp`
- [ ] `pinned` / `draft` 该设的设、该不设的不设
- [ ] 编辑现有文章时该 bump `updated` 就 bump
- [ ] 顶层 `manifest.updated` bump
- [ ] 本地直接双击 `blog.html` 验过 —— 列表 + 点进阅读器都正常
- [ ] `lang: 'both'` 时**两种语言**都用切语言按钮验证
- [ ] 宽屏（≥ 1360 px）确认 TOC 侧栏出现，scroll-spy 高亮正常

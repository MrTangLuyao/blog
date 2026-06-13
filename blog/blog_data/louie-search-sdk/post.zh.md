每一个 louie.* 站点，都共用同一个搜索框。在主页、博客、还是 learn 练习场，按下 ⌘K，滑下来的都是同一个浮层——它早已认得这些站点里的每一个页面、每一篇文章、每一节课。它只是一个文件，`louie-search.js`，任何站点用一行就能接入。这篇文章讲它怎么用，以及它在背后怎么工作。

## 一行接入

整个安装就是一个 script 标签：

```html
<script defer src="https://louie1.com/lib/search/louie-search.js"></script>
```

加载后它就开始监听 **⌘K**（Windows：**Ctrl+K**），弹出搜索浮层。零编译、零依赖，没有别的要接。如果你不想用快捷键，更想从自己的按钮触发：

```html
<button onclick="LouieSearch.open()">搜索</button>
```

这就是真正的最小用法了。下面的一切，都只是可选的精修。

## 配置

script 标签接受几个 `data-` 属性，多数是用来锁定语言、或在本地开发别的站点时把 SDK 指向不同的源：

| 属性 | 默认值 | 作用 |
|---|---|---|
| `data-lang` | 跟随浏览器 / `localStorage` | 把浮层锁定为 `zh` 或 `en`。 |
| `data-auto` | `true` | `"false"` 不绑定快捷键，只暴露 API。 |
| `data-home-origin` | 自动 | 主页链接指向哪里。在 `louie1.com` 上为空，其它站点为 `https://louie1.com`。 |
| `data-blog-origin` | `https://blog.louie1.com` | 博客根地址。 |
| `data-blog-data-base` | `…/blog/blog_data` | 博客索引文件所在位置。 |
| `data-learn-origin` | `https://learn.louie1.com` | learn 根地址。 |

以及 JavaScript API：

| 调用 | 效果 |
|---|---|
| `LouieSearch.open()` / `.close()` / `.toggle()` | 控制浮层。 |
| `LouieSearch.setLang('zh' \| 'en')` | 同步浮层的语言。 |
| `LouieSearch.prefetch()` | 在用户打开前，提前预热远程索引。 |
| `LouieSearch.configure({ … })` | 运行时设置 `onLangSwitch` 与 `localItems`。 |
| `LouieSearch.MOD` | `'⌘'` 或 `'Ctrl'`，方便你给自己的按钮做标签。 |

### 让语言保持同步

规则只有一句：**页面是语言的权威。** 如果你的站点自己管理双语 UI，就在加载时告诉浮层当前是什么语言，并把浮层内部的"切换语言"动作接回你自己的切换函数。这样两边永远不会跑偏：

```js
LouieSearch.setLang(currentLang);
LouieSearch.configure({
  onLangSwitch: (next) => { if (next !== currentLang) toggleLang(); }
});
```

如果你不设置 `onLangSwitch`，浮层就自己切换、自己记住选择。两种方式都行——这个钩子只是为那些有自己语言开关、需要保持一致的站点准备的。

### 加入你自己的条目

有两条路，取决于范围。想让某些条目在每个站点的搜索里都出现，就编辑主站的 `search/extra_content.json`，完全不用动 SDK：

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
      "kw":    "额外 搜索 关键词"
    }
  ]
}
```

想加只属于当前页面的条目——包括执行代码而非跳转的"操作"——就传 `localItems`，结构相同，外加一个可选的 `run`：

```js
LouieSearch.configure({
  localItems: [
    { title: '打印本页', icon: 'file', run: () => window.print(), keepOpen: false }
  ]
});
```

## 它在背后怎么工作

### Shadow DOM，零依赖

整个浮层活在一个 Shadow DOM 根里，带着 `:host { all: initial }`，所以宿主页面的 CSS 漏不进来，浮层的样式也漏不出去。正是这一点，让同一份样式能搭到差别极大的站点上——一个用 Tailwind 的主页、一个手写的博客、一个复古的 Windows 95 页面——在每个上面看起来都一模一样，没有一处冲突。配色取自和全站一致的 `louie.css` tokens，并且尊重 `prefers-reduced-motion`。

### 一个快捷键监听器

快捷键是一个挂在 document 上的 `keydown` 处理器：⌘/Ctrl+K 切换浮层，Esc 关闭（或在有输入时先清空查询）。浮层本身是惰性构建的——你第一次真正打开它时才建——所以一个从不触发搜索的页面，几乎不付出任何代价。

### 三层内容

你搜的东西，由三个来源拼起来：

1. **内置条目**随 SDK 一起发布：louie.* 站点、项目、社交链接。它们即时可用，离线也在。
2. **远程条目**在你第一次打开浮层时实时拉取：
   - **博客**——它读 `head_librarian.json`，再读每个合集的 `librarian.json`，把每一篇文章和合集都变成一个结果。发一篇博客，它立刻可搜，SDK 一个字都不用改。
   - **learn**——它读 `search_broadcast.json`，一份覆盖了每门课、每节课时、每个练习场的生成索引。这个文件缺失时，回退到只列课程的 `manifest.js`。
   - **额外**——上面那份手工维护的 `extra_content.json`。
3. **操作**在最底部：切换语言、查看源码，加上任何你通过 `localItems` 添加的东西。

"最新文章"这一组是推导出来的，不是单独拉取的——它就是远程文章按日期排序后的前三条。

### 拒绝说谎的缓存

`loadRemote()` 每次打开都会跑，但它很谨慎。一份完整的快照会在 `sessionStorage` 里缓存 30 分钟；失败的来源有 10 秒的退避，免得一轮坏掉就卡死。合集用 `Promise.allSettled` 拉取，所以单个 404 不会拖垮整批。

我最得意的细节是：**它从不缓存半成品快照。** 只有当博客、learn、额外内容**全部**干净加载时，缓存才会写入。假如 learn 挂了而我们缓存了"除 learn 之外的一切"，这个半真半假的东西会在这个标签页里毒害每一个页面，整整 30 分钟——搜索会悄悄装作 learn 不存在。所以一次不完整的加载只留在内存里、并会重试;缓存要么说真话，要么什么都不说。

### 打分

排序是 cmdk 的 command-score 的一个精简版。查询被切成若干 token，**每一个** token 都必须命中（这是个"与"），最终得分在它们之间取平均——所以"sql join"只会浮出同时匹配两个词的东西。在一个条目内部，每个字段按一个阶梯打分：

- 完全相等——`1.0`
- 前缀——`0.9`
- 词边界命中——`0.8`
- 子串——`0.6`
- 子序列（字母按序、允许间隔）——`0.25`

字段还有权重：标题 `1.0`，关键词 `0.9`，副标题和提示 `0.7`。关键之处在于，匹配同时跑在每个条目的 `zh` 和 `en` 文本上，所以"blog"和"博客"都能找到同一行——这正是一个双语搜索的意义所在。

### 跨域与缓存头

博客索引托管在 GitHub Pages，本身就带 `Access-Control-Allow-Origin: *`。主站通过一个 `_headers` 文件，用同样的方式开放 `/search/*` 与 `/lib/search/*`，并配上 `Cache-Control: no-cache, must-revalidate`。最后这一点很要紧：浏览器会留一份副本，但必须重新校验（没变化时就是一个廉价的 `304`），所以对 SDK 的一处修改会立刻在每个站点生效，而不是分别滞留在各个源的缓存里、等 `max-age` 窗口过期。

## 结语

我喜欢这个小 SDK 的地方，是那条缝隙是隐形的。从访客那一侧看，它就是 ⌘K，到处都一样。从我这一侧看，它是一个文件、每个站点一行，而一篇博客在发布的那一刻，就在整个网络里可搜了——不用重新构建、不用重新部署、不用手动维护一份清单。那些难的部分——样式隔离、诚实的缓存、双语排序——恰恰是访客永远不该察觉到的部分。

<p style="color: var(--muted); font-size: 14px; margin-top: 32px;">— Louie，写于墨尔本</p>

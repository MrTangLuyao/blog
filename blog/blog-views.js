/* ============================================================
 * blog/blog-views.js
 * List + reader render functions for blog.html.
 *
 *   activeTag                 — currently filtered tag (or '__all')
 *   renderTagBar()            — render tag pills above the list,
 *                               wire click handlers that update
 *                               activeTag and re-render the list
 *   renderList()              — render filtered cards into #blog-list
 *
 *   _bodyLoading              — in-flight Promise map per slug:lang,
 *                               prevents duplicate <script> injects
 *   loadPostBody(slug, lang)  — lazy-load blog/blog_data/<slug>/post.<lang>.js
 *                               and resolve the registered body string
 *   renderReader(slug)        — render reader skeleton, await body,
 *                               populate #reader-body, then buildToc.
 *                               If lang='both' and the requested lang
 *                               body fails, falls back to the other.
 *
 * Cross-file dependencies (all loaded earlier in blog.html):
 *   translations, currentLang     ← blog-i18n.js
 *   manifest, pickLang, formatDate,
 *   postCoverUrl, bindRipples,
 *   bindFadeIn                    ← blog-core.js
 *   buildToc                      ← blog-toc.js
 * ============================================================ */

let activeTag = '__all';

/* ─── Tag bar ─── */
function renderTagBar() {
  const bar = document.getElementById('tag-bar');
  const tags = new Set();
  manifest.posts.forEach(p => (p.tags || []).forEach(t => tags.add(t)));
  const allLabel = translations[currentLang]['blog-tag-all'] || 'All';

  const renderBtn = (tag, label, active) => `
    <button class="ripple-surface ripple-surface-variant px-4 py-1.5 rounded-m3-full text-[13px] font-medium transition-colors border border-m3-outlineVariant ${active ? 'bg-m3-primaryContainer text-m3-onPrimaryContainer border-m3-primary/30' : 'bg-m3-surfaceContainer text-m3-onSurfaceVariant hover:bg-m3-surfaceContainerHigh hover:text-m3-onSurface'}" data-tag="${tag}">${label}</button>
  `;

  bar.innerHTML = renderBtn('__all', allLabel, activeTag === '__all') +
    [...tags].sort().map(t => renderBtn(t, t, activeTag === t)).join('');

  bar.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTag = btn.dataset.tag;
      bar.querySelectorAll('button[data-tag]').forEach(b => {
        const act = b.dataset.tag === activeTag;
        b.classList.toggle('bg-m3-primaryContainer', act);
        b.classList.toggle('text-m3-onPrimaryContainer', act);
        b.classList.toggle('border-m3-primary/30', act);
        b.classList.toggle('bg-m3-surfaceContainer', !act);
        b.classList.toggle('text-m3-onSurfaceVariant', !act);
        b.classList.toggle('hover:bg-m3-surfaceContainerHigh', !act);
        b.classList.toggle('hover:text-m3-onSurface', !act);
      });
      renderList();
    });
  });
  bindRipples();
}

/* ─── List view ─── */
function renderList() {
  const list = document.getElementById('blog-list');
  const empty = document.getElementById('blog-empty');
  const filtered = activeTag === '__all'
    ? manifest.posts
    : manifest.posts.filter(p => (p.tags || []).includes(activeTag));

  if (filtered.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  const tt = translations[currentLang];
  list.innerHTML = filtered.map(post => {
    const cover = postCoverUrl(post);
    const initial = (pickLang(post.title) || post.slug).trim().charAt(0).toUpperCase();

    const coverHtml = cover
      ? `<div class="w-full sm:w-40 sm:h-40 h-56 shrink-0 rounded-m3-md overflow-hidden bg-m3-surface flex items-center justify-center border border-m3-outlineVariant/50"><img src="${cover}" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.parentElement.innerHTML='<span class=\\'text-3xl font-bold text-m3-primary/50\\'>${initial}</span>'"></div>`
      : `<div class="w-full sm:w-40 sm:h-40 h-56 shrink-0 rounded-m3-md bg-m3-primaryContainer/10 flex items-center justify-center border border-m3-primary/10"><span class="text-3xl font-bold text-m3-primary/50">${initial}</span></div>`;

    const tagsHtml = (post.tags || []).map(t => `<span class="px-2.5 py-0.5 rounded-m3-sm text-[11px] font-mono text-m3-primary bg-m3-primaryContainer/30 border border-m3-primary/20">${t}</span>`).join('');
    const minLabel = tt['reader-min'] || 'min';

    const updatedHtml = (post.updated && post.updated !== post.date)
      ? `<span class="w-1 h-1 rounded-full bg-m3-onSurfaceVariant/50"></span><span class="italic">${tt['reader-updated']} ${formatDate(post.updated)}</span>`
      : '';

    const pinHtml = post.pinned
      ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-m3-full text-[10px] font-bold uppercase tracking-widest text-m3-primary bg-m3-primaryContainer/40 border border-m3-primary/30"><svg width="10" height="10" class="rotate-[20deg]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>${tt['reader-pinned']}</span>`
      : '';

    return `
      <a class="ripple-surface group m3-card flex flex-col sm:flex-row gap-6 bg-m3-surfaceContainer rounded-m3-xl p-6 md:p-8 border border-m3-outlineVariant fade-in ${post.pinned ? 'border-m3-primary/30 bg-[#352c28]' : ''}" href="#${post.slug}">
        ${coverHtml}
        <div class="flex flex-col min-w-0 py-1">
          <div class="flex flex-wrap items-center gap-3 text-xs text-m3-onSurfaceVariant tracking-wider mb-3">
            ${pinHtml}
            <span class="font-bold text-m3-primary tabular-nums">${formatDate(post.date)}</span>
            ${updatedHtml}
            ${post.readingTime ? `<span class="w-1 h-1 rounded-full bg-m3-onSurfaceVariant/50"></span><span>${post.readingTime} ${minLabel}</span>` : ''}
          </div>
          <h2 class="text-2xl font-bold text-m3-onSurface leading-snug mb-3 group-hover:text-m3-primary transition-colors">${pickLang(post.title)}</h2>
          <p class="text-sm text-m3-onSurfaceVariant leading-relaxed line-clamp-2 mb-4 flex-grow">${pickLang(post.excerpt)}</p>
          ${tagsHtml ? `<div class="flex flex-wrap gap-2 mt-auto">${tagsHtml}</div>` : ''}
        </div>
      </a>
    `;
  }).join('');
  bindFadeIn();
  bindRipples();
}

/* ─── Post body loader ─── */
const _bodyLoading = {};
function loadPostBody(slug, lang) {
  const key = `${slug}:${lang}`;
  const cached = (window.__BLOG_POSTS || {})[key];
  if (cached != null) return Promise.resolve(cached);
  if (_bodyLoading[key]) return _bodyLoading[key];

  _bodyLoading[key] = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `blog/blog_data/${slug}/post.${lang}.js`;
    script.async = false;
    script.onload = () => {
      delete _bodyLoading[key];
      const body = (window.__BLOG_POSTS || {})[key];
      if (body != null) resolve(body);
      else reject(new Error(`Missing window.__BLOG_POSTS['${key}']`));
    };
    script.onerror = () => { delete _bodyLoading[key]; reject(new Error(`Failed to load ${script.src}`)); };
    document.head.appendChild(script);
  });
  return _bodyLoading[key];
}

/* ─── Reader view ─── */
async function renderReader(slug) {
  const post = manifest.posts.find(p => p.slug === slug);
  const reader = document.getElementById('reader-content');
  const t = translations[currentLang];

  if (!post) {
    reader.innerHTML = `
      <div class="text-center py-20 fade-in">
        <h2 class="text-2xl font-bold text-m3-onSurface mb-4">${t['not-found-title']}</h2>
        <p class="text-m3-onSurfaceVariant mb-8">${t['not-found-desc']}</p>
        <a class="ripple-surface bg-m3-primaryContainer text-m3-onPrimaryContainer px-6 py-2.5 rounded-m3-full font-bold" href="#">${t['not-found-back']} →</a>
      </div>
    `;
    requestAnimationFrame(() => {
      const wrapper = reader.querySelector('.fade-in');
      if (wrapper) wrapper.classList.add('visible');
    });
    bindRipples();
    return;
  }

  const tagsHtml = (post.tags || []).map(t => `<span class="px-3 py-1 rounded-m3-sm text-[12px] font-mono text-m3-primary bg-m3-primaryContainer/30 border border-m3-primary/20">${t}</span>`).join('');
  const minLabel = t['reader-min'];
  const cover = postCoverUrl(post);

  const updatedHtml = (post.updated && post.updated !== post.date)
    ? `<span class="w-1 h-1 rounded-full bg-m3-onSurfaceVariant/50"></span><span class="italic">${t['reader-updated']} ${formatDate(post.updated)}</span>`
    : '';

  const pinHtml = post.pinned
    ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-m3-full text-[10px] font-bold uppercase tracking-widest text-m3-primary bg-m3-primaryContainer/40 border border-m3-primary/30"><svg width="10" height="10" class="rotate-[20deg]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>${t['reader-pinned']}</span>`
    : '';

  reader.innerHTML = `
    <div class="fade-in">
      <div class="flex flex-wrap items-center gap-3 text-sm text-m3-onSurfaceVariant tracking-wider mb-6">
        ${pinHtml}
        <span class="font-bold text-m3-primary tabular-nums">${formatDate(post.date)}</span>
        ${updatedHtml}
        ${post.readingTime ? `<span class="w-1 h-1 rounded-full bg-m3-onSurfaceVariant/50"></span><span>${post.readingTime} ${minLabel}</span>` : ''}
      </div>

      <h1 class="text-4xl md:text-5xl font-extrabold text-m3-onSurface leading-tight mb-8">${pickLang(post.title)}</h1>
      ${tagsHtml ? `<div class="flex flex-wrap gap-2 mb-12">${tagsHtml}</div>` : ''}

      ${cover ? `<div class="w-full rounded-m3-xl overflow-hidden border border-m3-outlineVariant mb-14 shadow-xl shadow-black/30"><img src="${cover}" class="w-full h-auto object-cover" alt=""></div>` : ''}

      <div class="reader-body" id="reader-body"><p class="text-m3-onSurfaceVariant/50 italic">…</p></div>

      <div class="flex flex-wrap items-center justify-between gap-4 mt-24 pt-8 border-t border-m3-outlineVariant">
        <span class="text-sm text-m3-onSurfaceVariant">— ${formatDate(post.date)}${(post.updated && post.updated !== post.date) ? ` · ${t['reader-updated']} ${formatDate(post.updated)}` : ''}</span>
        <a class="ripple-surface ripple-surface-variant bg-m3-surfaceContainer hover:bg-m3-surfaceContainerHigh text-m3-onSurface px-5 py-2 rounded-m3-full text-sm font-bold border border-m3-outline transition-colors" href="#">${t['reader-back']} →</a>
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    const wrapper = reader.querySelector('.fade-in');
    if (wrapper) wrapper.classList.add('visible');
  });
  bindRipples();

  const lang = post.lang || 'both';
  const wantedLang = (lang === 'both') ? currentLang : lang;

  function writeBody(html) {
    const el = document.getElementById('reader-body');
    if (!el || el.dataset.slug !== slug) return false;
    el.innerHTML = html;
    if (typeof window.highlightAllCode === 'function') window.highlightAllCode(el);
    return true;
  }

  const bodyEl = document.getElementById('reader-body');
  if (bodyEl) bodyEl.dataset.slug = slug;

  try {
    let html = await loadPostBody(slug, wantedLang);
    if (!html) {
      if (window.__BLOG_POSTS) delete window.__BLOG_POSTS[`${slug}:${wantedLang}`];
      html = await loadPostBody(slug, wantedLang);
    }
    writeBody(html);
    buildToc();
  } catch (e) {
    if (lang === 'both') {
      const altLang = wantedLang === 'zh' ? 'en' : 'zh';
      try {
        const html = await loadPostBody(slug, altLang);
        writeBody(html);
        buildToc();
        return;
      } catch (_) {}
    }
    const el = document.getElementById('reader-body');
    if (el && el.dataset.slug === slug) {
      el.innerHTML = `
        <p class="text-red-400">Failed to load post body.</p>
        <pre class="bg-m3-surfaceContainer p-4 rounded-m3-md border border-m3-outlineVariant overflow-auto"><code class="text-m3-onSurface text-xs">${String(e).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'})[c])}</code></pre>
      `;
    }
  }
}

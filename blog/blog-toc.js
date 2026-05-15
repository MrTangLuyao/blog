/* ============================================================
 * blog/blog-toc.js
 * Table-of-contents widget for the blog reader view.
 *
 *   Mobile TOC drawer + FAB (immediate setup at module load)
 *     fireFabRipple(cx, cy) — bespoke ripple on the round FAB
 *     updateTocBtn()        — toggle FAB visibility based on
 *                             reader-view + viewport width
 *
 *   Desktop TOC sidebar
 *     buildToc()            — slugify h2/h3, render into
 *                             #toc-sidebar AND #mobile-toc-nav,
 *                             attach scroll-spy IntersectionObserver
 *     clearToc()            — disconnect observer, empty sidebars,
 *                             close mobile drawer (called from route
 *                             when leaving reader view)
 *
 * Cross-file dependencies (all loaded earlier in blog.html):
 *   currentLang        ← blog-i18n.js
 *   bindRipples        ← blog-core.js
 * ============================================================ */

/* ─── Mobile TOC drawer + FAB ─── */
const mobileToc = document.getElementById('mobile-toc');
const tocFab = document.getElementById('toc-fab');
document.getElementById('mobile-toc-close').addEventListener('click', () => mobileToc.classList.remove('open'));
mobileToc.addEventListener('click', (e) => { if (e.target === mobileToc) mobileToc.classList.remove('open'); });
tocFab.addEventListener('touchstart', (e) => {
  tocFab._lastTouch = Date.now();
  fireFabRipple(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });
tocFab.addEventListener('mousedown', (e) => {
  if (Date.now() - (tocFab._lastTouch || 0) < 500) return;
  fireFabRipple(e.clientX, e.clientY);
});
tocFab.addEventListener('click', () => mobileToc.classList.add('open'));

function fireFabRipple(cx, cy) {
  const circle = document.createElement('span');
  const diameter = Math.max(tocFab.clientWidth, tocFab.clientHeight);
  const radius = diameter / 2;
  const rect = tocFab.getBoundingClientRect();
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${cx - rect.left - radius}px`;
  circle.style.top  = `${cy - rect.top  - radius}px`;
  circle.classList.add('ripple');
  const existing = tocFab.querySelector('.ripple');
  if (existing) existing.remove();
  tocFab.appendChild(circle);
}

function updateTocBtn() {
  const inReader = document.getElementById('view-reader').style.display !== 'none';
  const isNarrow = window.innerWidth < 1360;
  tocFab.classList.toggle('visible', inReader && isNarrow);
}
window.addEventListener('resize', updateTocBtn);

/* ─── Desktop TOC sidebar ─── */
let _tocObserver = null;

function buildToc() {
  const sidebar = document.getElementById('toc-sidebar');
  const body    = document.getElementById('reader-body');
  if (!sidebar || !body) return;

  if (_tocObserver) { _tocObserver.disconnect(); _tocObserver = null; }

  const headings = Array.from(body.querySelectorAll('h2, h3'));
  if (headings.length < 2) {
    sidebar.innerHTML = '';
    sidebar.classList.remove('md:flex');
    return;
  }

  const used = {};
  headings.forEach(h => {
    let base = h.textContent.trim().replace(/[^\w一-鿿\s]/g, '').trim().replace(/\s+/g, '-').toLowerCase() || h.tagName.toLowerCase();
    let id = base;
    if (used[id] !== undefined) { used[id]++; id = `${base}-${used[id]}`; }
    else used[id] = 0;
    h.id = id;
  });

  const label = currentLang === 'zh' ? '目录' : 'Contents';

  // 强制 shrink-0，避免 flex 容器挤压内部元素
  sidebar.innerHTML =
    `<div class="shrink-0 text-xs tracking-[0.15em] uppercase text-m3-onSurfaceVariant font-bold px-3 pb-3 mb-2 border-b border-m3-outlineVariant/50">${label}</div>` +
    headings.map(h => {
      const isH3 = h.tagName.toLowerCase() === 'h3';
      return `<a class="toc-link shrink-0 ripple-surface ripple-surface-variant block w-full py-1.5 px-3 border-l-2 border-transparent text-[13px] transition-colors hover:bg-m3-surfaceContainerHigh hover:text-m3-onSurface ${isH3 ? 'pl-6 text-m3-onSurfaceVariant/70 text-[12px]' : 'text-m3-onSurfaceVariant'}" href="#${h.id}">${h.textContent.trim()}</a>`;
    }).join('');

  sidebar.classList.add('md:flex');

  // Mirror to mobile TOC
  const mobileNav = document.getElementById('mobile-toc-nav');
  if (mobileNav) {
    mobileNav.innerHTML = headings.map(h => {
      const isH3 = h.tagName.toLowerCase() === 'h3';
      return `<a class="toc-link block py-2 px-3 border-l-2 border-transparent text-[13px] transition-colors hover:text-m3-onSurface" style="color:${isH3 ? 'rgba(161,161,160,0.7)' : '#a1a1a0'}; font-size:${isH3 ? '12px' : '13px'}; padding-left:${isH3 ? '24px' : '12px'};" href="#${h.id}">${h.textContent.trim()}</a>`;
    }).join('');
    mobileNav.querySelectorAll('.toc-link').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('mobile-toc').classList.remove('open');
        const target = document.getElementById(a.getAttribute('href').slice(1));
        if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
      });
    });
  }

  updateTocBtn();
  bindRipples();

  sidebar.querySelectorAll('.toc-link').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(a.getAttribute('href').slice(1));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const links = sidebar.querySelectorAll('.toc-link');
  _tocObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(a => {
          a.classList.remove('text-m3-primary', 'border-m3-primary', 'bg-m3-primaryContainer/20', 'opacity-100');
        });
        const cur = sidebar.querySelector(`.toc-link[href="#${entry.target.id}"]`);
        if (cur) cur.classList.add('text-m3-primary', 'border-m3-primary', 'bg-m3-primaryContainer/20', 'opacity-100');
      }
    });
  }, { rootMargin: '-10% 0px -80% 0px' });
  headings.forEach(h => _tocObserver.observe(h));
}

function clearToc() {
  const sidebar = document.getElementById('toc-sidebar');
  if (sidebar) { sidebar.innerHTML = ''; sidebar.classList.remove('md:flex'); }
  if (_tocObserver) { _tocObserver.disconnect(); _tocObserver = null; }
  const mobileNav = document.getElementById('mobile-toc-nav');
  if (mobileNav) mobileNav.innerHTML = '';
  document.getElementById('mobile-toc')?.classList.remove('open');
  updateTocBtn();
}

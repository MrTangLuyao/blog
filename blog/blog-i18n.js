/* ============================================================
 * blog/blog-i18n.js
 * Translation tables + language helpers for blog.html.
 *
 * Exposes (as globals — no module wrapper, file:// compatible):
 *   translations    — { zh: {...}, en: {...} }
 *   currentLang     — 'zh' | 'en'  (mutable)
 *   applyLang(lang) — re-render all [data-i18n] elements + persist
 *   toggleLang()    — flip language and apply
 *
 * applyLang() calls route(), which is defined in blog-router.js.
 * That forward reference is safe because applyLang is first
 * invoked at boot, after every blog-*.js file has loaded.
 * ============================================================ */

const translations = {
  zh: {
    'blog-greeting': '笔记',
    'blog-title': '博客',
    'blog-sub': 'Louie 的博客及文章',
    'blog-tag-all': '全部',
    'blog-empty': '还没有文章——稍后回来看看吧。',
    'reader-back': '所有文章',
    'reader-min': '分钟',
    'reader-updated': '更新于',
    'reader-pinned': '置顶',
    'footer-copy': 'Copyright © 2026 路易的博客',
    'not-found-title': '没找到这篇文章',
    'not-found-desc': '可能链接已失效，回到列表试试看。',
    'not-found-back': '回到博客列表'
  },
  en: {
    'blog-greeting': 'notes',
    'blog-title': 'Blog',
    'blog-sub': "Louie's blog & articles",
    'blog-tag-all': 'All',
    'blog-empty': 'No posts yet — come back soon.',
    'reader-back': 'All posts',
    'reader-min': 'min',
    'reader-updated': 'Updated',
    'reader-pinned': 'Pinned',
    'footer-copy': 'Copyright © 2026 Louie’s Blog',
    'not-found-title': 'Post not found',
    'not-found-desc': 'The link may have changed. Go back to the list and try again.',
    'not-found-back': 'Back to blog'
  }
};

let currentLang = 'en';
const userBrowserLang = navigator.language.toLowerCase();
if (userBrowserLang === 'zh-cn' || userBrowserLang === 'zh') currentLang = 'zh';
try {
  const saved = localStorage.getItem('louie-lang');
  if (saved === 'zh' || saved === 'en') currentLang = saved;
} catch(e) {}

function applyLang(lang) {
  const t = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });
  const langLabel = document.getElementById('lang-label');
  if (langLabel) langLabel.textContent = lang === 'zh' ? '文 ⇄ EN' : 'EN ⇄ 文';
  const tocTitle = document.getElementById('mobile-toc-title');
  if (tocTitle) tocTitle.textContent = lang === 'zh' ? '目录' : 'Contents';
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  try { localStorage.setItem('louie-lang', lang); } catch(e) {}
  route();
}

function toggleLang() {
  currentLang = currentLang === 'zh' ? 'en' : 'zh';
  applyLang(currentLang);
}

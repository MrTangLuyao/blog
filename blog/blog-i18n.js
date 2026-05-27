/* ============================================================
 * blog/blog-i18n.js
 * Translation tables + language helpers for index.html.
 *
 * Attaches to the window.Blog namespace:
 *   Blog.translations    — { zh: {...}, en: {...} }
 *   Blog.currentLang     — 'zh' | 'en'  (mutable)
 *   Blog.applyLang(lang) — re-render all [data-i18n] elements + persist + re-route
 *   Blog.toggleLang()    — flip language and apply
 *
 * applyLang() calls Blog.route() (blog-router.js). The forward reference is
 * safe: applyLang is first invoked at boot, after every blog-*.js has loaded
 * and attached its methods to Blog.
 * ============================================================ */

(function (Blog) {
  'use strict';

  Blog.translations = {
    zh: {
      'blog-greeting': '笔记',
      'blog-title': '博客',
      'blog-sub': 'Louie 的博客及文章',
      'blog-tag-all': '全部',
      'blog-empty': '还没有文章——稍后回来看看吧。',
      'reader-back': '所有文章',
      'back': '返回',
      'reader-min': '分钟',
      'reader-updated': '更新于',
      'reader-pinned': '置顶',
      'footer-copy': 'Copyright © 2026 路易的博客',
      'not-found-title': '没找到这篇文章',
      'not-found-desc': '可能链接已失效，回到列表试试看。',
      'not-found-back': '回到博客列表',
      'lib-home': '博客',
      'lib-collection': '合集',
      'lib-items': '篇',
      'lib-load-error': '加载失败，请稍后重试。'
    },
    en: {
      'blog-greeting': 'notes',
      'blog-title': 'Blog',
      'blog-sub': "Louie's blog & articles",
      'blog-tag-all': 'All',
      'blog-empty': 'No posts yet — come back soon.',
      'reader-back': 'All posts',
      'back': 'Back',
      'reader-min': 'min',
      'reader-updated': 'Updated',
      'reader-pinned': 'Pinned',
      'footer-copy': 'Copyright © 2026 Louie’s Blog',
      'not-found-title': 'Post not found',
      'not-found-desc': 'The link may have changed. Go back to the list and try again.',
      'not-found-back': 'Back to blog',
      'lib-home': 'Blog',
      'lib-collection': 'Collection',
      'lib-items': 'items',
      'lib-load-error': 'Failed to load — please try again.'
    }
  };

  Blog.currentLang = 'en';
  const userBrowserLang = navigator.language.toLowerCase();
  if (userBrowserLang === 'zh-cn' || userBrowserLang === 'zh') Blog.currentLang = 'zh';
  try {
    const saved = localStorage.getItem('louie-lang');
    if (saved === 'zh' || saved === 'en') Blog.currentLang = saved;
  } catch (e) {}

  Blog.applyLang = function applyLang(lang) {
    const t = Blog.translations[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) el.innerHTML = t[key];
    });
    const langLabel = document.getElementById('lang-label');
    if (langLabel) langLabel.textContent = lang === 'zh' ? '文 ⇄ EN' : 'EN ⇄ 文';
    const tocTitle = document.getElementById('mobile-toc-title');
    if (tocTitle) tocTitle.textContent = lang === 'zh' ? '目录' : 'Contents';
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    try { localStorage.setItem('louie-lang', lang); } catch (e) {}
    if (Blog.renderAbout) Blog.renderAbout();
    Blog.route();
  };

  Blog.toggleLang = function toggleLang() {
    Blog.currentLang = Blog.currentLang === 'zh' ? 'en' : 'zh';
    Blog.applyLang(Blog.currentLang);
  };

})(window.Blog = window.Blog || {});

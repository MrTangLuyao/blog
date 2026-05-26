#!/usr/bin/env python3
"""blog_writer.py — manifest manager for Louie's blog.

Scope (deliberately small): create new posts and edit the manifest metadata
(slug, date, title, excerpt, cover, tags, lang, pinned, reading time, type).

It does NOT edit post bodies. Bodies are plain files on disk:
    Markdown posts (type 'md')  → blog/blog_data/<slug>/post.<lang>.md
    HTML posts     (type other) → blog/blog_data/<slug>/post.<lang>.js
Click "Open … ↗" to open a body file in your OS's default editor (point your
favourite Markdown editor at .md files). New body files are created from a
small template on first open. HTML posts are flagged with a "!" in the list,
since the recommended/normal format is Markdown.
"""

import json
import math
import os
import re
import shutil
import subprocess
import sys
import tkinter as tk
from tkinter import filedialog, messagebox, ttk
from datetime import date

# ── Paths ──────────────────────────────────────────────────────────────
# __file__ lives at  blog/editor/blog_writer.py
# blog_data/ is a sibling of editor/, both under blog/
HERE      = os.path.dirname(os.path.abspath(__file__))
BLOG_DATA = os.path.join(os.path.dirname(HERE), 'blog_data')
MANIFEST  = os.path.join(BLOG_DATA, 'manifest.js')

# ── M3 palette ─────────────────────────────────────────────────────────
C = dict(
    bg         = '#1f1f1e',
    surface    = '#2a2a29',
    surfaceHi  = '#333332',
    primary    = '#d97757',
    primaryDim = '#7a3a27',
    onPrimary  = '#ffffff',
    text       = '#e8e8e8',
    muted      = '#a1a1a0',
    outline    = '#4a4a49',
    outlineVar = '#3a3a39',
)

FONT_MONO = ('JetBrains Mono', 10)
FONT_MONO_SM = ('JetBrains Mono', 9)
FONT_MONO_LG = ('JetBrains Mono', 11)

# ── Manifest I/O ────────────────────────────────────────────────────────

def _js_to_json(js: str) -> str:
    """Best-effort conversion of a JS object literal to JSON."""
    # strip comments
    js = re.sub(r'//[^\n]*', '', js)
    js = re.sub(r'/\*[\s\S]*?\*/', '', js)
    # protect already-double-quoted strings from being touched by later steps
    dq: list[str] = []
    def _save(m: re.Match) -> str:
        dq.append(m.group(0))
        return f'__DQ{len(dq)-1}__'
    js = re.sub(r'"(?:[^"\\]|\\.)*"', _save, js)
    # quote bare keys (word chars at start of line content, before colon)
    js = re.sub(r'(?m)^(\s*)([A-Za-z_]\w*)(\s*:)', r'\1"\2"\3', js)
    # single-quoted strings → double-quoted (tags, lang values, simple slugs)
    js = re.sub(r"'([^']*)'", r'"\1"', js)
    # remove trailing commas before } or ]
    js = re.sub(r',(\s*[}\]])', r'\1', js)
    # restore protected strings
    for i, s in enumerate(dq):
        js = js.replace(f'__DQ{i}__', s)
    return js


def load_manifest() -> dict:
    with open(MANIFEST, 'r', encoding='utf-8') as f:
        src = f.read()
    m = re.search(r'window\.__BLOG_MANIFEST\s*=\s*(\{[\s\S]*\})\s*;', src)
    if not m:
        return {'version': 3, 'updated': str(date.today()), 'posts': []}
    try:
        return json.loads(_js_to_json(m.group(1)))
    except json.JSONDecodeError as e:
        messagebox.showerror('Parse error', f'Could not parse manifest.js:\n{e}')
        return {'version': 3, 'updated': str(date.today()), 'posts': []}


def _post_to_js(p: dict) -> str:
    lines = ['    {']
    order = ['slug', 'date', 'updated', 'type', 'title', 'excerpt', 'cover',
             'tags', 'readingTime', 'lang', 'pinned', 'draft']
    keys = order + [k for k in p if k not in order]
    for k in keys:
        if k not in p:
            continue
        v = p[k]
        if isinstance(v, dict):
            inner = ', '.join(
                f'"{lang}": {json.dumps(txt, ensure_ascii=False)}'
                for lang, txt in v.items()
            )
            lines.append(f'      {k}: {{ {inner} }},')
        elif isinstance(v, list):
            items = ', '.join(json.dumps(t, ensure_ascii=False) for t in v)
            lines.append(f'      {k}: [{items}],')
        elif isinstance(v, bool):
            lines.append(f'      {k}: {"true" if v else "false"},')
        elif isinstance(v, int):
            lines.append(f'      {k}: {v},')
        else:
            lines.append(f'      {k}: {json.dumps(v, ensure_ascii=False)},')
    lines.append('    }')
    return '\n'.join(lines)


def save_manifest(manifest: dict) -> None:
    today = str(date.today())
    posts_js = ',\n\n'.join(_post_to_js(p) for p in manifest['posts'])
    content = (
        "/* ─────────────────────────────────────────────────────────────\n"
        "   Louie's blog manifest — INDEX ONLY.\n\n"
        "   Each post entry is metadata. The body lives in its own folder:\n"
        "       blog/blog_data/<slug>/post.zh.(md|js)\n"
        "       blog/blog_data/<slug>/post.en.(md|js)\n"
        "   blog.html loads those on demand when the reader view opens a post.\n"
        "   ───────────────────────────────────────────────────────────── */\n\n"
        f"window.__BLOG_MANIFEST = {{\n"
        f"  version: 3,\n"
        f"  updated: '{today}',\n"
        f"  posts: [\n\n"
        f"{posts_js}\n\n"
        f"  ]\n"
        f"}};\n"
    )
    with open(MANIFEST, 'w', encoding='utf-8') as f:
        f.write(content)


# ── Body files (created/opened, never edited in-app) ────────────────────

def post_type(p: dict) -> str:
    """Normalised post type: 'md' or 'html' (the runtime default)."""
    return 'md' if (p.get('type') == 'md') else 'html'


def body_ext(typ: str) -> str:
    return 'md' if typ == 'md' else 'js'


def body_path(slug: str, lang: str, typ: str) -> str:
    return os.path.join(BLOG_DATA, slug, f'post.{lang}.{body_ext(typ)}')


def ensure_body_file(slug: str, lang: str, typ: str) -> str:
    """Return the body file path, creating it from a template if missing."""
    folder = os.path.join(BLOG_DATA, slug)
    os.makedirs(folder, exist_ok=True)
    path = body_path(slug, lang, typ)
    if not os.path.exists(path):
        if typ == 'md':
            content = f"# \n\n_Write the {lang.upper()} post here, in Markdown._\n"
        else:
            content = (
                f"/* Post body — {slug} / {lang} */\n\n"
                f"(window.__BLOG_POSTS = window.__BLOG_POSTS || {{}})['{slug}:{lang}'] = `\n"
                f'<p class="lead"></p>\n'
                f"`;\n"
            )
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
    return path


def read_body_text(slug: str, lang: str, typ: str) -> str:
    """Raw body text for reading-time estimation (empty if file absent)."""
    path = body_path(slug, lang, typ)
    if not os.path.exists(path):
        return ''
    with open(path, 'r', encoding='utf-8') as f:
        src = f.read()
    if typ == 'md':
        return src
    m = re.search(r"=\s*`([\s\S]*?)`;\s*$", src.strip())
    return m.group(1) if m else src


def open_in_editor(path: str) -> None:
    """Open a file with the OS default application (the user's editor)."""
    try:
        if sys.platform.startswith('win'):
            os.startfile(path)  # type: ignore[attr-defined]
        elif sys.platform == 'darwin':
            subprocess.Popen(['open', path])
        else:
            subprocess.Popen(['xdg-open', path])
    except Exception as e:  # noqa: BLE001
        messagebox.showerror('Open failed', f'Could not open:\n{path}\n\n{e}')


def estimate_reading_time(en_text: str, zh_text: str) -> int:
    en_text = re.sub(r'<[^>]+>', '', en_text)
    zh_text = re.sub(r'<[^>]+>', '', zh_text)
    words_en = len(en_text.split())
    chars_zh = len(re.sub(r'\s', '', zh_text))
    return max(1, math.ceil((words_en / 200) + (chars_zh / 400)))


# ── Reusable widgets ────────────────────────────────────────────────────

def make_btn(parent, text, command, primary=False, danger=False, **kw):
    if primary:
        bg, fg, abg = C['primary'], C['onPrimary'], C['primaryDim']
    elif danger:
        bg, fg, abg = '#4a1f1f', '#ff8080', '#6a2020'
    else:
        bg, fg, abg = C['surfaceHi'], C['text'], C['outline']
    return tk.Button(
        parent, text=text, command=command,
        bg=bg, fg=fg, activebackground=abg, activeforeground=fg,
        disabledforeground=C['outline'],
        relief='flat', bd=0, padx=12, pady=5,
        font=(*FONT_MONO, 'bold'), cursor='hand2', **kw
    )


def make_entry(parent, textvariable, width=20):
    return tk.Entry(
        parent, textvariable=textvariable, width=width,
        bg=C['surface'], fg=C['text'], insertbackground=C['text'],
        relief='flat', bd=4, font=FONT_MONO_LG,
        highlightthickness=1, highlightcolor=C['primary'],
        highlightbackground=C['outlineVar']
    )


def labeled_entry(parent, label, var, width=20):
    """Returns a Frame containing a label + entry, stacked vertically."""
    frame = tk.Frame(parent, bg=C['bg'])
    tk.Label(frame, text=label, bg=C['bg'], fg=C['muted'],
             font=FONT_MONO_SM, anchor='w').pack(fill='x')
    make_entry(frame, var, width).pack(fill='x')
    return frame


# ── Main app ─────────────────────────────────────────────────────────────

class BlogWriter(tk.Tk):

    def __init__(self):
        super().__init__()
        self.title('Blog Writer — louie.blog')
        self.geometry('1080x600')
        self.minsize(860, 520)
        self.configure(bg=C['bg'])
        self._manifest: dict = load_manifest()
        self._current_slug: str | None = None
        self._cover_src: str | None = None       # pending new cover file path
        self._build_ui()
        self._refresh_list()
        if self._manifest.get('posts'):
            self._select_post(self._manifest['posts'][0]['slug'])

    # ── UI build ────────────────────────────────────────────────────────

    def _build_ui(self):
        self._configure_ttk()

        # ── Top bar ───────────────────────────────────────────────────
        top = tk.Frame(self, bg=C['surface'], height=50)
        top.pack(fill='x', side='top')
        top.pack_propagate(False)
        tk.Label(top, text='louie.blog — manifest', bg=C['surface'],
                 fg=C['primary'], font=('JetBrains Mono', 13, 'bold'),
                 padx=16).pack(side='left', fill='y')
        btn_row = tk.Frame(top, bg=C['surface'])
        btn_row.pack(side='right', padx=12, pady=8)
        make_btn(btn_row, '+ New',  self._new_post).pack(side='left', padx=3)
        make_btn(btn_row, 'Save',   self._save_post, primary=True).pack(side='left', padx=3)
        make_btn(btn_row, 'Delete', self._delete_post, danger=True).pack(side='left', padx=3)

        # ── Paned split: sidebar | editor ─────────────────────────────
        pane = tk.PanedWindow(self, orient='horizontal', bg=C['outlineVar'],
                              sashwidth=2, sashrelief='flat', handlesize=0)
        pane.pack(fill='both', expand=True)

        # Sidebar
        sidebar = tk.Frame(pane, bg=C['surface'], width=260)
        pane.add(sidebar, minsize=200)
        tk.Label(sidebar, text='POSTS   ( ! = HTML )', bg=C['surface'], fg=C['muted'],
                 font=(*FONT_MONO_SM, 'bold'), padx=12, pady=10,
                 anchor='w').pack(fill='x')
        sb_scroll = tk.Scrollbar(sidebar, bg=C['surface'], troughcolor=C['bg'],
                                  relief='flat', width=8)
        sb_scroll.pack(side='right', fill='y')
        self._post_list = tk.Listbox(
            sidebar, bg=C['surface'], fg=C['text'],
            selectbackground=C['primaryDim'], selectforeground=C['primary'],
            activestyle='none', relief='flat', bd=0, font=FONT_MONO_LG,
            highlightthickness=0, yscrollcommand=sb_scroll.set,
        )
        self._post_list.pack(fill='both', expand=True)
        sb_scroll.config(command=self._post_list.yview)
        self._post_list.bind('<<ListboxSelect>>', self._on_list_select)

        # Editor panel
        editor_wrap = tk.Frame(pane, bg=C['bg'])
        pane.add(editor_wrap, minsize=560)
        editor = tk.Frame(editor_wrap, bg=C['bg'])
        editor.pack(fill='both', expand=True, padx=16, pady=12)

        # Row 1: slug, date, updated, reading time
        r1 = tk.Frame(editor, bg=C['bg'])
        r1.pack(fill='x', pady=(0, 6))
        self._v_slug = tk.StringVar()
        self._v_date = tk.StringVar()
        self._v_updated = tk.StringVar()
        self._v_rt = tk.StringVar()
        labeled_entry(r1, 'Slug',               self._v_slug, 22).pack(side='left', padx=(0,10))
        labeled_entry(r1, 'Date (YYYY-MM-DD)',   self._v_date, 12).pack(side='left', padx=(0,10))
        labeled_entry(r1, 'Updated',             self._v_updated, 12).pack(side='left', padx=(0,10))
        labeled_entry(r1, 'Reading time (min)',  self._v_rt, 5).pack(side='left', padx=(0,10))

        # Row 1b: type, lang, pinned
        r1b = tk.Frame(editor, bg=C['bg'])
        r1b.pack(fill='x', pady=(0, 6))

        type_f = tk.Frame(r1b, bg=C['bg'])
        type_f.pack(side='left', padx=(0, 16))
        tk.Label(type_f, text='Type', bg=C['bg'], fg=C['muted'],
                 font=FONT_MONO_SM).pack(anchor='w')
        self._v_type = tk.StringVar(value='md')
        ttk.Combobox(type_f, textvariable=self._v_type, values=['md', 'html'],
                     width=7, state='readonly', style='Dark.TCombobox').pack()
        self._v_type.trace_add('write', lambda *_: self._sync_body_buttons())

        lang_f = tk.Frame(r1b, bg=C['bg'])
        lang_f.pack(side='left', padx=(0, 16))
        tk.Label(lang_f, text='Lang', bg=C['bg'], fg=C['muted'],
                 font=FONT_MONO_SM).pack(anchor='w')
        self._v_lang = tk.StringVar(value='both')
        ttk.Combobox(lang_f, textvariable=self._v_lang, values=['both','en','zh'],
                     width=7, state='readonly', style='Dark.TCombobox').pack()
        self._v_lang.trace_add('write', lambda *_: self._sync_body_buttons())

        pin_f = tk.Frame(r1b, bg=C['bg'])
        pin_f.pack(side='left', padx=(0, 10))
        tk.Label(pin_f, text='Pinned', bg=C['bg'], fg=C['muted'],
                 font=FONT_MONO_SM).pack(anchor='w')
        self._v_pinned = tk.BooleanVar()
        tk.Checkbutton(pin_f, variable=self._v_pinned, bg=C['bg'], fg=C['text'],
                       selectcolor=C['surface'], activebackground=C['bg'],
                       relief='flat', highlightthickness=0).pack(anchor='w')

        # Row 2: cover
        r2 = tk.Frame(editor, bg=C['bg'])
        r2.pack(fill='x', pady=(0, 6))
        tk.Label(r2, text='Cover image', bg=C['bg'], fg=C['muted'],
                 font=FONT_MONO_SM, anchor='s').pack(side='left')
        self._cover_label = tk.Label(r2, text='None', bg=C['bg'], fg=C['muted'],
                                      font=FONT_MONO, padx=10)
        self._cover_label.pack(side='left')
        make_btn(r2, 'Choose…', self._pick_cover).pack(side='left', padx=(0,4))
        make_btn(r2, 'Clear',   self._clear_cover).pack(side='left')

        # Row 3: titles
        r3 = tk.Frame(editor, bg=C['bg'])
        r3.pack(fill='x', pady=(0, 6))
        self._v_title_en = tk.StringVar()
        self._v_title_zh = tk.StringVar()
        labeled_entry(r3, 'Title (EN)', self._v_title_en, 38).pack(
            side='left', padx=(0,10), fill='x', expand=True)
        labeled_entry(r3, 'Title (ZH)', self._v_title_zh, 38).pack(
            side='left', fill='x', expand=True)

        # Row 4: excerpts
        r4 = tk.Frame(editor, bg=C['bg'])
        r4.pack(fill='x', pady=(0, 6))
        self._v_excerpt_en = tk.StringVar()
        self._v_excerpt_zh = tk.StringVar()
        labeled_entry(r4, 'Excerpt (EN)', self._v_excerpt_en, 38).pack(
            side='left', padx=(0,10), fill='x', expand=True)
        labeled_entry(r4, 'Excerpt (ZH)', self._v_excerpt_zh, 38).pack(
            side='left', fill='x', expand=True)

        # Row 5: tags
        r5 = tk.Frame(editor, bg=C['bg'])
        r5.pack(fill='x', pady=(0, 12))
        self._v_tags = tk.StringVar()
        labeled_entry(r5, 'Tags (comma separated)', self._v_tags, 60).pack(
            side='left', fill='x', expand=True)

        # Row 6: body files — open in the external editor
        body = tk.Frame(editor, bg=C['surface'], padx=14, pady=12)
        body.pack(fill='x', pady=(4, 0))
        tk.Label(body, text='POST BODY', bg=C['surface'], fg=C['muted'],
                 font=(*FONT_MONO_SM, 'bold'), anchor='w').pack(fill='x')
        tk.Label(body,
                 text='Edited in your own editor (open .md in a Markdown app). '
                      'Missing files are created from a template.',
                 bg=C['surface'], fg=C['muted'], font=FONT_MONO_SM,
                 anchor='w', justify='left').pack(fill='x', pady=(2, 8))
        body_btns = tk.Frame(body, bg=C['surface'])
        body_btns.pack(fill='x')
        self._body_btn_en = make_btn(body_btns, 'Open EN ↗', lambda: self._open_body('en'))
        self._body_btn_en.pack(side='left', padx=(0, 8))
        self._body_btn_zh = make_btn(body_btns, 'Open ZH ↗', lambda: self._open_body('zh'))
        self._body_btn_zh.pack(side='left', padx=(0, 8))
        make_btn(body_btns, 'Open folder ↗', self._open_folder).pack(side='left', padx=(0, 8))
        self._body_hint = tk.Label(body, text='', bg=C['surface'], fg=C['muted'],
                                   font=FONT_MONO_SM, anchor='w')
        self._body_hint.pack(fill='x', pady=(8, 0))

    def _configure_ttk(self):
        s = ttk.Style(self)
        s.theme_use('clam')
        s.configure('Dark.TCombobox',
                    fieldbackground=C['surface'], background=C['surface'],
                    foreground=C['text'], selectbackground=C['primaryDim'],
                    selectforeground=C['primary'], arrowcolor=C['muted'])
        self.option_add('*TCombobox*Listbox.background', C['surface'])
        self.option_add('*TCombobox*Listbox.foreground', C['text'])
        self.option_add('*TCombobox*Listbox.selectBackground', C['primaryDim'])
        self.option_add('*TCombobox*Listbox.selectForeground', C['primary'])

    # ── Post list ───────────────────────────────────────────────────────

    def _refresh_list(self):
        self._post_list.delete(0, 'end')
        for p in self._manifest.get('posts', []):
            title = p.get('title', {})
            if isinstance(title, dict):
                label = title.get('en') or title.get('zh') or p['slug']
            else:
                label = str(title) or p['slug']
            pin  = '📌 ' if p.get('pinned') else '   '
            excl = '! ' if post_type(p) != 'md' else '  '  # HTML flag
            self._post_list.insert('end', f'{pin}{excl}{label}')

    def _on_list_select(self, _=None):
        sel = self._post_list.curselection()
        if not sel:
            return
        posts = self._manifest.get('posts', [])
        if sel[0] < len(posts):
            self._select_post(posts[sel[0]]['slug'])

    def _select_post(self, slug: str):
        self._current_slug = slug
        posts = self._manifest.get('posts', [])
        post = next((p for p in posts if p['slug'] == slug), None)
        if not post:
            return

        self._v_slug.set(post.get('slug', ''))
        self._v_date.set(post.get('date', ''))
        self._v_updated.set(post.get('updated', ''))
        self._v_rt.set(str(post.get('readingTime', '')))
        self._v_type.set(post_type(post))
        self._v_lang.set(post.get('lang', 'both'))
        self._v_pinned.set(bool(post.get('pinned', False)))

        title = post.get('title', {})
        self._v_title_en.set(title.get('en', '') if isinstance(title, dict) else str(title))
        self._v_title_zh.set(title.get('zh', '') if isinstance(title, dict) else '')

        excerpt = post.get('excerpt', {})
        self._v_excerpt_en.set(excerpt.get('en', '') if isinstance(excerpt, dict) else str(excerpt))
        self._v_excerpt_zh.set(excerpt.get('zh', '') if isinstance(excerpt, dict) else '')

        self._v_tags.set(', '.join(post.get('tags', [])))

        cover = post.get('cover', '')
        self._cover_src = None
        self._cover_label.config(
            text=cover if cover else 'None',
            fg=C['text'] if cover else C['muted'],
        )
        self._sync_body_buttons()

    # ── Body files ────────────────────────────────────────────────────────

    def _sync_body_buttons(self):
        """Enable the EN/ZH open buttons that the current lang implies."""
        if not hasattr(self, '_body_btn_en'):
            return
        lang = self._v_lang.get()
        self._body_btn_en.config(state='normal' if lang in ('both', 'en') else 'disabled')
        self._body_btn_zh.config(state='normal' if lang in ('both', 'zh') else 'disabled')
        slug = self._v_slug.get().strip()
        typ = self._v_type.get()
        if slug:
            existing = [lg for lg in ('en', 'zh') if os.path.exists(body_path(slug, lg, typ))]
            self._body_hint.config(
                text=f'files: post.{{en,zh}}.{body_ext(typ)}   '
                     f'(on disk: {", ".join(existing) if existing else "none yet"})')
        else:
            self._body_hint.config(text='')

    def _open_body(self, lang: str):
        slug = self._v_slug.get().strip()
        if not re.match(r'^[a-z0-9][a-z0-9\-]*$', slug):
            messagebox.showwarning('Invalid slug',
                'Set a valid slug (lowercase letters, digits, hyphens) first.')
            return
        typ = self._v_type.get()
        path = ensure_body_file(slug, lang, typ)
        open_in_editor(path)
        self._sync_body_buttons()

    def _open_folder(self):
        slug = self._v_slug.get().strip()
        if not slug:
            return
        folder = os.path.join(BLOG_DATA, slug)
        os.makedirs(folder, exist_ok=True)
        open_in_editor(folder)

    # ── Cover ────────────────────────────────────────────────────────────

    def _pick_cover(self):
        path = filedialog.askopenfilename(
            title='Choose cover image',
            filetypes=[('Images', '*.webp *.jpg *.jpeg *.png *.gif'), ('All', '*.*')],
        )
        if path:
            self._cover_src = path
            self._cover_label.config(text=os.path.basename(path), fg=C['text'])

    def _clear_cover(self):
        self._cover_src = None
        self._cover_label.config(text='(cleared on save)', fg=C['muted'])

    # ── Save (manifest only) ───────────────────────────────────────────────

    def _save_post(self):
        slug = self._v_slug.get().strip()
        if not slug:
            messagebox.showwarning('Missing slug', 'Slug is required.')
            return
        if not re.match(r'^[a-z0-9][a-z0-9\-]*$', slug):
            messagebox.showwarning('Invalid slug',
                'Slug must be lowercase letters, digits, and hyphens only.')
            return

        old_slug = self._current_slug

        title_en  = self._v_title_en.get().strip()
        title_zh  = self._v_title_zh.get().strip()
        exc_en    = self._v_excerpt_en.get().strip()
        exc_zh    = self._v_excerpt_zh.get().strip()
        tags      = [t.strip() for t in self._v_tags.get().split(',') if t.strip()]
        typ       = self._v_type.get()
        lang      = self._v_lang.get()
        pinned    = self._v_pinned.get()
        date_str  = self._v_date.get().strip() or str(date.today())
        updated   = self._v_updated.get().strip()

        # Rename folder if slug changed (before reading bodies for the estimate)
        if old_slug and old_slug != slug:
            old_dir = os.path.join(BLOG_DATA, old_slug)
            new_dir = os.path.join(BLOG_DATA, slug)
            if os.path.exists(old_dir) and not os.path.exists(new_dir):
                os.rename(old_dir, new_dir)

        rt_raw = self._v_rt.get().strip()
        try:
            rt = int(rt_raw) if rt_raw else estimate_reading_time(
                read_body_text(slug, 'en', typ), read_body_text(slug, 'zh', typ))
        except ValueError:
            rt = estimate_reading_time(
                read_body_text(slug, 'en', typ), read_body_text(slug, 'zh', typ))

        post: dict = {
            'slug':    slug,
            'date':    date_str,
            'title':   {'zh': title_zh, 'en': title_en},
            'excerpt': {'zh': exc_zh,   'en': exc_en},
            'tags':    tags,
            'readingTime': rt,
            'lang':    lang,
        }
        if updated and updated != date_str:
            post['updated'] = updated
        if typ == 'md':                 # html is the runtime default → no key
            post['type'] = 'md'
        if pinned:
            post['pinned'] = True

        # Cover image
        cover_text = self._cover_label.cget('text')
        if self._cover_src:
            slug_dir = os.path.join(BLOG_DATA, slug)
            os.makedirs(slug_dir, exist_ok=True)
            ext = os.path.splitext(self._cover_src)[1]
            dest_name = f'cover{ext}'
            shutil.copy2(self._cover_src, os.path.join(slug_dir, dest_name))
            post['cover'] = dest_name
            self._cover_src = None
            self._cover_label.config(text=dest_name, fg=C['text'])
        elif cover_text and cover_text not in ('None', '(cleared on save)'):
            post['cover'] = cover_text
        # else: no cover key added → cleared

        # Update manifest list (preserve any extra keys from the old entry)
        posts = self._manifest.setdefault('posts', [])
        lookup = old_slug or slug
        idx = next((i for i, p in enumerate(posts) if p['slug'] == lookup), None)
        if idx is not None:
            preserved = {k: v for k, v in posts[idx].items() if k not in post
                         and k not in ('updated', 'type', 'cover', 'pinned')}
            post = {**preserved, **post}
            posts[idx] = post
        else:
            posts.insert(0, post)

        self._current_slug = slug
        save_manifest(self._manifest)

        self._v_rt.set(str(rt))
        self._refresh_list()

        new_idx = next((i for i, p in enumerate(posts) if p['slug'] == slug), 0)
        self._post_list.selection_clear(0, 'end')
        self._post_list.selection_set(new_idx)
        self._post_list.see(new_idx)
        self._sync_body_buttons()

        self.title(f'Blog Writer — {slug} ✓')
        self.after(2000, lambda: self.title('Blog Writer — louie.blog'))

    # ── Delete ────────────────────────────────────────────────────────────

    def _delete_post(self):
        slug = self._current_slug
        if not slug:
            return
        if not messagebox.askyesno(
            'Delete post',
            f'Remove "{slug}" from the manifest?\n\n'
            f'The files in blog/blog_data/{slug}/ will NOT be deleted.',
        ):
            return
        posts = self._manifest.get('posts', [])
        self._manifest['posts'] = [p for p in posts if p['slug'] != slug]
        save_manifest(self._manifest)
        self._current_slug = None
        self._refresh_list()
        remaining = self._manifest.get('posts', [])
        if remaining:
            self._post_list.selection_set(0)
            self._select_post(remaining[0]['slug'])

    # ── New ────────────────────────────────────────────────────────────

    def _new_post(self):
        today = str(date.today())
        slug = f'new-post-{today}'
        new = {
            'slug':    slug,
            'date':    today,
            'type':    'md',
            'title':   {'zh': '', 'en': ''},
            'excerpt': {'zh': '', 'en': ''},
            'tags':    [],
            'readingTime': 5,
            'lang':    'both',
        }
        self._manifest.setdefault('posts', []).insert(0, new)
        self._refresh_list()
        self._post_list.selection_set(0)
        self._select_post(slug)


if __name__ == '__main__':
    app = BlogWriter()
    app.mainloop()

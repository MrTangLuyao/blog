#!/usr/bin/env python3
"""blog_writer.py — Librarian manager for Louie's blog.

Scope (deliberately small): manage the index tree and per-entry metadata —
create posts and collections, edit their metadata (slug, date, title, excerpt,
cover, tags, lang, pinned, draft, reading time, type), and delete entries.

The index is the recursive "Librarian" tree described in README.md:
    blog/blog_data/head_librarian.json          the root index
    blog/blog_data/<collection>/librarian.json   a collection's index (nests)
Each librarian is `{ version, updated, title?, entries: [...] }`; every entry is
a post (kind "post") or a collection (kind "collection"). Collections nest to
arbitrary depth.

It does NOT edit post bodies. Bodies are plain files on disk, located under the
entry's real path in the tree:
    Markdown posts (type 'md')   → <parent>/<slug>/post.<lang>.md
    HTML posts     (type other)  → <parent>/<slug>/post.<lang>.js
Click "Open … ↗" to open a body file in your OS's default editor (point your
favourite Markdown editor at .md files). New body files are created from a
small template on first open. HTML posts are flagged with a "!" in the tree,
since the recommended/normal format is Markdown.
"""

from __future__ import annotations

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
HERE           = os.path.dirname(os.path.abspath(__file__))
BLOG_DATA      = os.path.join(os.path.dirname(HERE), 'blog_data')
HEAD_LIBRARIAN = os.path.join(BLOG_DATA, 'head_librarian.json')

# Canonical key order when (re)writing entries, so diffs stay clean.
ENTRY_ORDER = ['kind', 'slug', 'date', 'updated', 'type', 'title', 'excerpt',
               'cover', 'tags', 'readingTime', 'lang', 'pinned', 'draft']
LIB_ORDER   = ['version', 'updated', 'title', 'entries']

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
    collection = '#5fb3a3',
)

FONT_MONO = ('JetBrains Mono', 10)
FONT_MONO_SM = ('JetBrains Mono', 9)
FONT_MONO_LG = ('JetBrains Mono', 11)


# ── Path helpers ────────────────────────────────────────────────────────

def _segs(path: str) -> list:
    """Split a '/'-joined librarian path into OS path segments ('' → [])."""
    return [s for s in path.split('/') if s]


def lib_file(dir_path: str) -> str:
    """Filesystem path of the librarian for a collection dir ('' → root)."""
    if dir_path == '':
        return HEAD_LIBRARIAN
    return os.path.join(BLOG_DATA, *_segs(dir_path), 'librarian.json')


def entry_dir(path: str) -> str:
    """Filesystem directory holding a post/collection at the given tree path."""
    return os.path.join(BLOG_DATA, *_segs(path))


def join_path(parent: str, slug: str) -> str:
    return slug if parent == '' else f'{parent}/{slug}'


# ── Entry / librarian (de)serialisation ──────────────────────────────────

def post_type(p: dict) -> str:
    """Normalised post type: 'md' or 'html' (the runtime default)."""
    return 'md' if (p.get('type') == 'md') else 'html'


def body_ext(typ: str) -> str:
    return 'md' if typ == 'md' else 'js'


def body_path(path: str, lang: str, typ: str) -> str:
    return os.path.join(entry_dir(path), f'post.{lang}.{body_ext(typ)}')


def ensure_body_file(path: str, slug: str, lang: str, typ: str) -> str:
    """Return the body file path, creating it from a template if missing."""
    folder = entry_dir(path)
    os.makedirs(folder, exist_ok=True)
    fpath = body_path(path, lang, typ)
    if not os.path.exists(fpath):
        if typ == 'md':
            content = f"# \n\n_Write the {lang.upper()} post here, in Markdown._\n"
        else:
            content = (
                f"/* Post body — {slug} / {lang} */\n\n"
                f"(window.__BLOG_POSTS = window.__BLOG_POSTS || {{}})['{slug}:{lang}'] = `\n"
                f'<p class="lead"></p>\n'
                f"`;\n"
            )
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
    return fpath


def read_body_text(path: str, lang: str, typ: str) -> str:
    """Raw body text for reading-time estimation (empty if file absent)."""
    fpath = body_path(path, lang, typ)
    if not os.path.exists(fpath):
        return ''
    with open(fpath, 'r', encoding='utf-8') as f:
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


def order_entry(entry: dict) -> dict:
    out = {}
    for k in ENTRY_ORDER:
        if k in entry:
            out[k] = entry[k]
    for k, v in entry.items():          # preserve unknown keys, in place
        if k not in out:
            out[k] = v
    return out


def order_lib(lib: dict, is_root: bool) -> dict:
    out = {}
    for k in LIB_ORDER:
        if k == 'title' and is_root:
            continue                    # the root index carries no title
        if k in lib:
            out[k] = lib[k]
    out['entries'] = [order_entry(e) for e in lib.get('entries', [])]
    for k, v in lib.items():            # preserve unknown top-level keys
        if k not in out:
            out[k] = v
    return out


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
        disabledbackground=C['bg'], disabledforeground=C['outline'],
        highlightthickness=1, highlightcolor=C['primary'],
        highlightbackground=C['outlineVar']
    )


def labeled_entry(parent, label, var, width=20):
    """Returns a Frame (label + entry stacked). The Entry is `frame.entry`."""
    frame = tk.Frame(parent, bg=C['bg'])
    frame.lbl = tk.Label(frame, text=label, bg=C['bg'], fg=C['muted'],
                         font=FONT_MONO_SM, anchor='w')
    frame.lbl.pack(fill='x')
    frame.entry = make_entry(frame, var, width)
    frame.entry.pack(fill='x')
    return frame


# ── Main app ─────────────────────────────────────────────────────────────

class BlogWriter(tk.Tk):

    def __init__(self):
        super().__init__()
        self.title('Blog Writer — louie.blog')
        self.geometry('1120x640')
        self.minsize(900, 540)
        self.configure(bg=C['bg'])
        self._libs: dict = {}            # dir_path -> librarian dict
        self._nodes: dict = {}           # tree iid -> node dict
        self._path_iid: dict = {}        # tree path -> iid
        self._current: dict | None = None
        self._cover_src: str | None = None
        self._build_ui()
        self._load_all()
        self._refresh_tree()
        first = self._first_entry_path()
        if first is not None:
            self._select_path(first)
        else:
            self._apply_kind(None)
        self._set_status()

    # ── Librarian tree I/O ────────────────────────────────────────────────

    def _load_all(self):
        self._libs = {}
        self._load_lib('')

    def _load_lib(self, dir_path: str):
        fpath = lib_file(dir_path)
        if not os.path.exists(fpath):
            self._libs[dir_path] = self._empty_lib(is_root=(dir_path == ''))
            return
        try:
            with open(fpath, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except (json.JSONDecodeError, OSError) as e:
            messagebox.showerror('Parse error',
                                 f'Could not read {fpath}:\n{e}')
            data = self._empty_lib(is_root=(dir_path == ''))
        data.setdefault('entries', [])
        self._libs[dir_path] = data
        for e in data['entries']:
            if e.get('kind') == 'collection' and e.get('slug'):
                self._load_lib(join_path(dir_path, e['slug']))

    @staticmethod
    def _empty_lib(is_root: bool) -> dict:
        lib = {'version': 4, 'updated': str(date.today())}
        if not is_root:
            lib['title'] = {'zh': '', 'en': ''}
        lib['entries'] = []
        return lib

    def _write_lib(self, dir_path: str):
        lib = self._libs[dir_path]
        lib['updated'] = str(date.today())
        ordered = order_lib(lib, is_root=(dir_path == ''))
        fpath = lib_file(dir_path)
        os.makedirs(os.path.dirname(fpath), exist_ok=True)
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(json.dumps(ordered, ensure_ascii=False, indent=2) + '\n')

    # ── UI build ────────────────────────────────────────────────────────

    def _build_ui(self):
        self._configure_ttk()

        # ── Top bar ───────────────────────────────────────────────────
        top = tk.Frame(self, bg=C['surface'], height=50)
        top.pack(fill='x', side='top')
        top.pack_propagate(False)
        tk.Label(top, text='louie.blog — librarian', bg=C['surface'],
                 fg=C['primary'], font=('JetBrains Mono', 13, 'bold'),
                 padx=16).pack(side='left', fill='y')
        btn_row = tk.Frame(top, bg=C['surface'])
        btn_row.pack(side='right', padx=12, pady=8)
        make_btn(btn_row, '+ Post',        self._new_post).pack(side='left', padx=3)
        make_btn(btn_row, '+ Collection',  self._new_collection).pack(side='left', padx=3)
        make_btn(btn_row, 'Save',   self._save_entry, primary=True).pack(side='left', padx=3)
        make_btn(btn_row, 'Delete', self._delete_entry, danger=True).pack(side='left', padx=3)

        # ── Paned split: tree | editor ────────────────────────────────
        pane = tk.PanedWindow(self, orient='horizontal', bg=C['outlineVar'],
                              sashwidth=2, sashrelief='flat', handlesize=0)
        pane.pack(fill='both', expand=True)

        # Sidebar tree
        sidebar = tk.Frame(pane, bg=C['surface'], width=300)
        pane.add(sidebar, minsize=220)
        tk.Label(sidebar, text='LIBRARIAN   ( 📁 collection · ! = HTML )',
                 bg=C['surface'], fg=C['muted'],
                 font=(*FONT_MONO_SM, 'bold'), padx=12, pady=10,
                 anchor='w').pack(fill='x')
        tree_wrap = tk.Frame(sidebar, bg=C['surface'])
        tree_wrap.pack(fill='both', expand=True)
        sb_scroll = tk.Scrollbar(tree_wrap, bg=C['surface'], troughcolor=C['bg'],
                                  relief='flat', width=8)
        sb_scroll.pack(side='right', fill='y')
        self._tree = ttk.Treeview(tree_wrap, show='tree', selectmode='browse',
                                   style='Dark.Treeview',
                                   yscrollcommand=sb_scroll.set)
        self._tree.pack(side='left', fill='both', expand=True)
        sb_scroll.config(command=self._tree.yview)
        self._tree.bind('<<TreeviewSelect>>', self._on_tree_select)

        # Editor panel
        editor_wrap = tk.Frame(pane, bg=C['bg'])
        pane.add(editor_wrap, minsize=560)
        editor = tk.Frame(editor_wrap, bg=C['bg'])
        editor.pack(fill='both', expand=True, padx=16, pady=12)

        # Kind / path header
        self._kind_lbl = tk.Label(editor, text='', bg=C['bg'], fg=C['collection'],
                                  font=(*FONT_MONO, 'bold'), anchor='w')
        self._kind_lbl.pack(fill='x', pady=(0, 8))

        # Row 1: slug, date, updated, reading time
        r1 = tk.Frame(editor, bg=C['bg'])
        r1.pack(fill='x', pady=(0, 6))
        self._v_slug = tk.StringVar()
        self._v_date = tk.StringVar()
        self._v_updated = tk.StringVar()
        self._v_rt = tk.StringVar()
        labeled_entry(r1, 'Slug',               self._v_slug, 22).pack(side='left', padx=(0,10))
        labeled_entry(r1, 'Date (YYYY-MM-DD)',   self._v_date, 12).pack(side='left', padx=(0,10))
        f_upd = labeled_entry(r1, 'Updated',     self._v_updated, 12)
        f_upd.pack(side='left', padx=(0,10))
        self._e_updated = f_upd.entry
        f_rt = labeled_entry(r1, 'Reading time (min)',  self._v_rt, 5)
        f_rt.pack(side='left', padx=(0,10))
        self._e_rt = f_rt.entry

        # Row 1b: type, lang, pinned, draft
        r1b = tk.Frame(editor, bg=C['bg'])
        r1b.pack(fill='x', pady=(0, 6))

        type_f = tk.Frame(r1b, bg=C['bg'])
        type_f.pack(side='left', padx=(0, 16))
        tk.Label(type_f, text='Type', bg=C['bg'], fg=C['muted'],
                 font=FONT_MONO_SM).pack(anchor='w')
        self._v_type = tk.StringVar(value='md')
        self._cmb_type = ttk.Combobox(type_f, textvariable=self._v_type,
                                      values=['md', 'html'], width=7,
                                      state='readonly', style='Dark.TCombobox')
        self._cmb_type.pack()
        self._v_type.trace_add('write', lambda *_: self._sync_body_buttons())

        lang_f = tk.Frame(r1b, bg=C['bg'])
        lang_f.pack(side='left', padx=(0, 16))
        tk.Label(lang_f, text='Lang', bg=C['bg'], fg=C['muted'],
                 font=FONT_MONO_SM).pack(anchor='w')
        self._v_lang = tk.StringVar(value='both')
        self._cmb_lang = ttk.Combobox(lang_f, textvariable=self._v_lang,
                                      values=['both', 'en', 'zh'], width=7,
                                      state='readonly', style='Dark.TCombobox')
        self._cmb_lang.pack()
        self._v_lang.trace_add('write', lambda *_: self._sync_body_buttons())

        pin_f = tk.Frame(r1b, bg=C['bg'])
        pin_f.pack(side='left', padx=(0, 16))
        tk.Label(pin_f, text='Pinned', bg=C['bg'], fg=C['muted'],
                 font=FONT_MONO_SM).pack(anchor='w')
        self._v_pinned = tk.BooleanVar()
        self._chk_pinned = tk.Checkbutton(
            pin_f, variable=self._v_pinned, bg=C['bg'], fg=C['text'],
            selectcolor=C['surface'], activebackground=C['bg'],
            relief='flat', highlightthickness=0)
        self._chk_pinned.pack(anchor='w')

        draft_f = tk.Frame(r1b, bg=C['bg'])
        draft_f.pack(side='left', padx=(0, 10))
        tk.Label(draft_f, text='Draft', bg=C['bg'], fg=C['muted'],
                 font=FONT_MONO_SM).pack(anchor='w')
        self._v_draft = tk.BooleanVar()
        self._chk_draft = tk.Checkbutton(
            draft_f, variable=self._v_draft, bg=C['bg'], fg=C['text'],
            selectcolor=C['surface'], activebackground=C['bg'],
            relief='flat', highlightthickness=0)
        self._chk_draft.pack(anchor='w')

        # Row 2: cover
        r2 = tk.Frame(editor, bg=C['bg'])
        r2.pack(fill='x', pady=(0, 6))
        self._cover_caption = tk.Label(r2, text='Cover image', bg=C['bg'],
                                       fg=C['muted'], font=FONT_MONO_SM, anchor='s')
        self._cover_caption.pack(side='left')
        self._cover_label = tk.Label(r2, text='None', bg=C['bg'], fg=C['muted'],
                                      font=FONT_MONO, padx=10)
        self._cover_label.pack(side='left')
        self._btn_cover_pick = make_btn(r2, 'Choose…', self._pick_cover)
        self._btn_cover_pick.pack(side='left', padx=(0,4))
        self._btn_cover_clear = make_btn(r2, 'Clear',   self._clear_cover)
        self._btn_cover_clear.pack(side='left')

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

        # Row 6: body files — open in the external editor (posts only)
        self._body_panel = tk.Frame(editor, bg=C['surface'], padx=14, pady=12)
        self._body_panel.pack(fill='x', pady=(4, 0))
        tk.Label(self._body_panel, text='POST BODY', bg=C['surface'], fg=C['muted'],
                 font=(*FONT_MONO_SM, 'bold'), anchor='w').pack(fill='x')
        tk.Label(self._body_panel,
                 text='Edited in your own editor (open .md in a Markdown app). '
                      'Missing files are created from a template.',
                 bg=C['surface'], fg=C['muted'], font=FONT_MONO_SM,
                 anchor='w', justify='left').pack(fill='x', pady=(2, 8))
        body_btns = tk.Frame(self._body_panel, bg=C['surface'])
        body_btns.pack(fill='x')
        self._body_btn_en = make_btn(body_btns, 'Open EN ↗', lambda: self._open_body('en'))
        self._body_btn_en.pack(side='left', padx=(0, 8))
        self._body_btn_zh = make_btn(body_btns, 'Open ZH ↗', lambda: self._open_body('zh'))
        self._body_btn_zh.pack(side='left', padx=(0, 8))
        make_btn(body_btns, 'Open folder ↗', self._open_folder).pack(side='left', padx=(0, 8))
        self._body_hint = tk.Label(self._body_panel, text='', bg=C['surface'],
                                   fg=C['muted'], font=FONT_MONO_SM, anchor='w')
        self._body_hint.pack(fill='x', pady=(8, 0))

        # Status line
        self._status = tk.Label(self, text='', bg=C['surface'], fg=C['muted'],
                                font=FONT_MONO_SM, anchor='w', padx=14, pady=4)
        self._status.pack(fill='x', side='bottom')

        # Track which widgets are post-only (disabled for collections)
        self._post_widgets = [
            self._e_updated, self._e_rt, self._cmb_type, self._cmb_lang,
            self._chk_draft, self._btn_cover_pick, self._btn_cover_clear,
            self._body_btn_en, self._body_btn_zh,
        ]

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
        s.configure('Dark.Treeview',
                    background=C['surface'], fieldbackground=C['surface'],
                    foreground=C['text'], borderwidth=0, rowheight=24,
                    font=FONT_MONO)
        s.map('Dark.Treeview',
              background=[('selected', C['primaryDim'])],
              foreground=[('selected', C['primary'])])
        s.layout('Dark.Treeview',
                 [('Dark.Treeview.treearea', {'sticky': 'nswe'})])

    # ── Tree population ───────────────────────────────────────────────────

    def _refresh_tree(self):
        self._tree.delete(*self._tree.get_children(''))
        self._nodes = {}
        self._path_iid = {}
        self._insert_level('', '')

    def _insert_level(self, tree_parent: str, dir_path: str):
        lib = self._libs.get(dir_path)
        if not lib:
            return
        for entry in lib.get('entries', []):
            slug = entry.get('slug', '')
            if not slug:
                continue
            kind = 'collection' if entry.get('kind') == 'collection' else 'post'
            path = join_path(dir_path, slug)
            iid = self._tree.insert(tree_parent, 'end',
                                    text=self._label_for(entry, kind),
                                    open=True)
            self._nodes[iid] = {'entry': entry, 'kind': kind,
                                'parent_path': dir_path, 'path': path}
            self._path_iid[path] = iid
            if kind == 'collection':
                self._insert_level(iid, path)

    @staticmethod
    def _label_for(entry: dict, kind: str) -> str:
        title = entry.get('title', {})
        if isinstance(title, dict):
            t = title.get('en') or title.get('zh') or entry.get('slug', '')
        else:
            t = str(title) or entry.get('slug', '')
        pin = '📌 ' if entry.get('pinned') else ''
        if kind == 'collection':
            return f'{pin}📁 {t}'
        draft = '✎ ' if entry.get('draft') else ''
        flag = '! ' if post_type(entry) != 'md' else ''
        return f'{pin}{draft}{flag}{t}'

    def _first_entry_path(self):
        roots = self._tree.get_children('')
        return self._nodes[roots[0]]['path'] if roots else None

    def _select_path(self, path: str):
        iid = self._path_iid.get(path)
        if iid is None:
            return
        self._tree.selection_set(iid)
        self._tree.see(iid)
        self._tree.focus(iid)
        self._select_node(self._nodes[iid])

    def _on_tree_select(self, _=None):
        sel = self._tree.selection()
        if sel and sel[0] in self._nodes:
            self._select_node(self._nodes[sel[0]])

    # ── Load a node into the editor ───────────────────────────────────────

    def _select_node(self, node: dict):
        self._current = node
        entry = node['entry']
        kind = node['kind']
        self._cover_src = None

        self._v_slug.set(entry.get('slug', ''))
        self._v_date.set(entry.get('date', ''))
        self._v_updated.set(entry.get('updated', ''))
        self._v_pinned.set(bool(entry.get('pinned', False)))

        title = entry.get('title', {})
        self._v_title_en.set(title.get('en', '') if isinstance(title, dict) else str(title))
        self._v_title_zh.set(title.get('zh', '') if isinstance(title, dict) else '')

        excerpt = entry.get('excerpt', {})
        self._v_excerpt_en.set(excerpt.get('en', '') if isinstance(excerpt, dict) else str(excerpt))
        self._v_excerpt_zh.set(excerpt.get('zh', '') if isinstance(excerpt, dict) else '')

        self._v_tags.set(', '.join(entry.get('tags', [])))

        if kind == 'post':
            self._v_rt.set(str(entry.get('readingTime', '')))
            self._v_type.set(post_type(entry))
            self._v_lang.set(entry.get('lang', 'both'))
            self._v_draft.set(bool(entry.get('draft', False)))
            cover = entry.get('cover', '')
            self._cover_label.config(text=cover if cover else 'None',
                                     fg=C['text'] if cover else C['muted'])
        else:
            self._v_rt.set('')
            self._v_type.set('md')
            self._v_lang.set('both')
            self._v_draft.set(False)
            self._cover_label.config(text='—', fg=C['muted'])

        self._apply_kind(kind)
        self._set_status()

    def _apply_kind(self, kind):
        """Show/disable widgets that do not apply to the current kind."""
        is_post = (kind == 'post')
        state = 'normal' if is_post else 'disabled'
        for w in self._post_widgets:
            try:
                if isinstance(w, ttk.Combobox):
                    w.config(state='readonly' if is_post else 'disabled')
                else:
                    w.config(state=state)
            except tk.TclError:
                pass
        cap = C['muted'] if is_post else C['outline']
        self._cover_caption.config(fg=cap)
        if kind == 'collection':
            path = self._current['path'] if self._current else ''
            self._kind_lbl.config(
                text=f'📁  COLLECTION   ·   {path}', fg=C['collection'])
        elif kind == 'post':
            path = self._current['path'] if self._current else ''
            self._kind_lbl.config(
                text=f'📄  POST   ·   {path}', fg=C['primary'])
        else:
            self._kind_lbl.config(text='No entry selected — add a post or '
                                       'collection to begin.', fg=C['muted'])
        if is_post:
            self._sync_body_buttons()
        else:
            self._body_hint.config(text='Collections have no body.')

    # ── Body files ────────────────────────────────────────────────────────

    def _sync_body_buttons(self):
        if not hasattr(self, '_body_btn_en') or self._current is None:
            return
        if self._current['kind'] != 'post':
            return
        lang = self._v_lang.get()
        self._body_btn_en.config(state='normal' if lang in ('both', 'en') else 'disabled')
        self._body_btn_zh.config(state='normal' if lang in ('both', 'zh') else 'disabled')
        slug = self._v_slug.get().strip()
        typ = self._v_type.get()
        path = self._current['path']
        if slug:
            existing = [lg for lg in ('en', 'zh')
                        if os.path.exists(body_path(path, lg, typ))]
            self._body_hint.config(
                text=f'files: {path}/post.{{en,zh}}.{body_ext(typ)}   '
                     f'(on disk: {", ".join(existing) if existing else "none yet"})')
        else:
            self._body_hint.config(text='')

    def _open_body(self, lang: str):
        if self._current is None or self._current['kind'] != 'post':
            return
        slug = self._v_slug.get().strip()
        if not re.match(r'^[a-z0-9][a-z0-9\-]*$', slug):
            messagebox.showwarning('Invalid slug',
                'Set a valid slug (lowercase letters, digits, hyphens) first.')
            return
        typ = self._v_type.get()
        fpath = ensure_body_file(self._current['path'], slug, lang, typ)
        open_in_editor(fpath)
        self._sync_body_buttons()

    def _open_folder(self):
        if self._current is None:
            return
        folder = entry_dir(self._current['path'])
        os.makedirs(folder, exist_ok=True)
        open_in_editor(folder)

    # ── Cover ────────────────────────────────────────────────────────────

    def _pick_cover(self):
        if self._current is None or self._current['kind'] != 'post':
            return
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

    # ── Save ───────────────────────────────────────────────────────────────

    def _save_entry(self):
        if self._current is None:
            messagebox.showinfo('Nothing selected', 'Add or select an entry first.')
            return
        node = self._current
        kind = node['kind']
        parent_path = node['parent_path']
        old_slug = node['entry'].get('slug', '')
        old_path = node['path']

        slug = self._v_slug.get().strip()
        if not slug:
            messagebox.showwarning('Missing slug', 'Slug is required.')
            return
        if not re.match(r'^[a-z0-9][a-z0-9\-]*$', slug):
            messagebox.showwarning('Invalid slug',
                'Slug must be lowercase letters, digits, and hyphens only.')
            return

        new_path = join_path(parent_path, slug)
        if slug != old_slug and new_path in self._path_iid:
            messagebox.showwarning('Slug in use',
                f'An entry "{slug}" already exists at this level.')
            return

        # Rename the directory if the slug changed (carries body files / a
        # collection's whole subtree with it).
        if slug != old_slug:
            old_dir = entry_dir(old_path)
            new_dir = entry_dir(new_path)
            if os.path.exists(old_dir) and not os.path.exists(new_dir):
                os.rename(old_dir, new_dir)

        title_en = self._v_title_en.get().strip()
        title_zh = self._v_title_zh.get().strip()
        exc_en   = self._v_excerpt_en.get().strip()
        exc_zh   = self._v_excerpt_zh.get().strip()
        tags     = [t.strip() for t in self._v_tags.get().split(',') if t.strip()]
        pinned   = self._v_pinned.get()
        date_str = self._v_date.get().strip() or str(date.today())

        entry: dict = {
            'kind':  kind,
            'slug':  slug,
            'date':  date_str,
            'title': {'zh': title_zh, 'en': title_en},
        }
        if exc_en or exc_zh:
            entry['excerpt'] = {'zh': exc_zh, 'en': exc_en}
        if tags:
            entry['tags'] = tags

        if kind == 'post':
            typ = self._v_type.get()
            lang = self._v_lang.get()
            updated = self._v_updated.get().strip()
            if updated and updated != date_str:
                entry['updated'] = updated
            if typ == 'md':                 # html is the runtime default → no key
                entry['type'] = 'md'
            entry['lang'] = lang
            rt_raw = self._v_rt.get().strip()
            try:
                rt = int(rt_raw) if rt_raw else estimate_reading_time(
                    read_body_text(new_path, 'en', typ),
                    read_body_text(new_path, 'zh', typ))
            except ValueError:
                rt = estimate_reading_time(
                    read_body_text(new_path, 'en', typ),
                    read_body_text(new_path, 'zh', typ))
            entry['readingTime'] = rt

            # Cover image
            cover_text = self._cover_label.cget('text')
            if self._cover_src:
                slug_dir = entry_dir(new_path)
                os.makedirs(slug_dir, exist_ok=True)
                ext = os.path.splitext(self._cover_src)[1]
                dest_name = f'cover{ext}'
                shutil.copy2(self._cover_src, os.path.join(slug_dir, dest_name))
                entry['cover'] = dest_name
            elif cover_text and cover_text not in ('None', '(cleared on save)', '—'):
                entry['cover'] = cover_text
            # else: no cover key → cleared

            if self._v_draft.get():
                entry['draft'] = True

        if pinned:
            entry['pinned'] = True

        # Preserve unknown keys from the previous entry.
        for k, v in node['entry'].items():
            if k not in entry and k not in ENTRY_ORDER:
                entry[k] = v

        # Replace the entry in its librarian.
        lib = self._libs[parent_path]
        entries = lib.setdefault('entries', [])
        idx = next((i for i, p in enumerate(entries)
                    if p.get('slug') == old_slug), None)
        if idx is not None:
            entries[idx] = entry
        else:
            entries.insert(0, entry)
        self._write_lib(parent_path)

        # A collection's own librarian title mirrors its entry title.
        if kind == 'collection':
            if new_path not in self._libs:
                self._load_lib(new_path)
            child = self._libs.setdefault(new_path, self._empty_lib(False))
            child['title'] = {'zh': title_zh, 'en': title_en}
            self._write_lib(new_path)

        self._reload_select(new_path)
        self._flash_saved(slug)

    # ── Delete ────────────────────────────────────────────────────────────

    def _delete_entry(self):
        if self._current is None:
            return
        node = self._current
        slug = node['entry'].get('slug', '')
        parent_path = node['parent_path']
        kind = node['kind']
        what = 'collection (and its sub-tree entries)' if kind == 'collection' else 'post'
        if not messagebox.askyesno(
            'Delete entry',
            f'Remove the {what} "{slug}" from its librarian?\n\n'
            f'The files in blog/blog_data/{node["path"]}/ will NOT be deleted.',
        ):
            return
        lib = self._libs[parent_path]
        lib['entries'] = [p for p in lib.get('entries', [])
                          if p.get('slug') != slug]
        self._write_lib(parent_path)
        self._current = None
        self._load_all()
        self._refresh_tree()
        sib = self._first_child_path(parent_path)
        target = sib or (parent_path if parent_path else self._first_entry_path())
        if target is not None and target in self._path_iid:
            self._select_path(target)
        else:
            self._clear_editor()
        self._set_status()

    # ── New entries ────────────────────────────────────────────────────────

    def _target_dir(self) -> str:
        """Where a new entry should be created, based on the selection."""
        if self._current is None:
            return ''
        if self._current['kind'] == 'collection':
            return self._current['path']
        return self._current['parent_path']

    def _unique_slug(self, dir_path: str, base: str) -> str:
        existing = {e.get('slug') for e in self._libs.get(dir_path, {}).get('entries', [])}
        if base not in existing:
            return base
        n = 2
        while f'{base}-{n}' in existing:
            n += 1
        return f'{base}-{n}'

    def _new_post(self):
        target = self._target_dir()
        today = str(date.today())
        slug = self._unique_slug(target, f'new-post-{today}')
        os.makedirs(entry_dir(join_path(target, slug)), exist_ok=True)
        entry = {
            'kind':  'post',
            'slug':  slug,
            'date':  today,
            'type':  'md',
            'title': {'zh': '', 'en': ''},
            'readingTime': 5,
            'lang':  'both',
        }
        self._libs.setdefault(target, self._empty_lib(target == '')) \
            .setdefault('entries', []).insert(0, entry)
        self._write_lib(target)
        self._reload_select(join_path(target, slug))

    def _new_collection(self):
        target = self._target_dir()
        today = str(date.today())
        slug = self._unique_slug(target, f'new-collection-{today}')
        new_path = join_path(target, slug)
        # The collection directory + its own (empty) librarian.
        self._libs[new_path] = {'version': 4, 'updated': today,
                                'title': {'zh': '', 'en': ''}, 'entries': []}
        self._write_lib(new_path)
        entry = {
            'kind':  'collection',
            'slug':  slug,
            'date':  today,
            'title': {'zh': '', 'en': ''},
        }
        self._libs.setdefault(target, self._empty_lib(target == '')) \
            .setdefault('entries', []).insert(0, entry)
        self._write_lib(target)
        self._reload_select(new_path)

    # ── Misc helpers ────────────────────────────────────────────────────────

    def _first_child_path(self, dir_path: str):
        lib = self._libs.get(dir_path, {})
        for e in lib.get('entries', []):
            if e.get('slug'):
                return join_path(dir_path, e['slug'])
        return None

    def _reload_select(self, path: str):
        self._load_all()
        self._refresh_tree()
        if path in self._path_iid:
            self._select_path(path)
        else:
            self._clear_editor()
        self._set_status()

    def _clear_editor(self):
        self._current = None
        for v in (self._v_slug, self._v_date, self._v_updated, self._v_rt,
                  self._v_title_en, self._v_title_zh, self._v_excerpt_en,
                  self._v_excerpt_zh, self._v_tags):
            v.set('')
        self._v_pinned.set(False)
        self._v_draft.set(False)
        self._cover_label.config(text='None', fg=C['muted'])
        self._apply_kind(None)

    def _flash_saved(self, slug: str):
        self.title(f'Blog Writer — {slug} ✓')
        self.after(2000, lambda: self.title('Blog Writer — louie.blog'))

    def _set_status(self):
        target = self._target_dir()
        loc = target if target else '(root)'
        n = len(self._libs.get('', {}).get('entries', []))
        self._status.config(
            text=f'New entries go into: {loc}    ·    root entries: {n}    '
                 f'·    data: {BLOG_DATA}')


if __name__ == '__main__':
    app = BlogWriter()
    app.mainloop()

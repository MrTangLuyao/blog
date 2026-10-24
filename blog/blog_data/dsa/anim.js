/* ============================================================
 * blog/blog_data/dsa/anim.js
 * Shared kit for the 数据结构与算法 animations. An animation page links
 *   /blog/blog_data/dsa/anim.css  and  /blog/blog_data/dsa/anim.js
 * records the algorithm as an array of frames (plain snapshots of its state,
 * each with an optional .note caption in HTML) and hands them to the player.
 *
 * Page skeleton the player expects:
 *   <div class="title">…</div>
 *   <div class="controls" id="controls"></div>   ← buttons are appended here
 *   <div class="stage" id="stage"></div>
 *   <div class="note" id="note"></div>
 *
 *   AnimKit.player({ frames, render, interval })
 *       render(frame, index) draws one frame into #stage.
 *       Returns { load(frames), go(i), index() } for pages that switch scenarios.
 *   AnimKit.cells(values, { cls, idx, ptr })        → HTML: a row of array cells
 *   AnimKit.tree(root, { cls, edgeCls, badge, key })  → SVG: binary tree {key, left, right}
 *   AnimKit.btree(root, { cls, edgeCls })            → SVG: multiway tree {keys: [], children: []}
 *   AnimKit.graph({ nodes, edges, directed }, { nodeCls, edgeCls, weightCls, badge, label })
 *                                                    → SVG: graph drawn at given x/y
 *   AnimKit.esc(s)                                   → HTML-escaped string
 *
 * Every <button> on the page gets the blog's tap ripple automatically.
 * ============================================================ */

(function () {
  'use strict';

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  /* ─── Ripple (delegated, so buttons created later get it too) ─── */
  document.addEventListener('pointerdown', e => {
    const btn = e.target.closest && e.target.closest('button, .btn');
    if (!btn || btn.disabled) return;
    const rect = btn.getBoundingClientRect();
    const d = Math.max(rect.width, rect.height);
    const dot = document.createElement('span');
    dot.className = 'ripple';
    dot.style.width = dot.style.height = d + 'px';
    dot.style.left = (e.clientX - rect.left - d / 2) + 'px';
    dot.style.top = (e.clientY - rect.top - d / 2) + 'px';
    btn.querySelectorAll('.ripple').forEach(r => r.remove());
    dot.addEventListener('animationend', () => dot.remove());
    btn.appendChild(dot);
  });

  /* ─── Step-through player ─── */
  function player(opts) {
    let frames = opts.frames || [];
    const render = opts.render;
    const bar = opts.controls || document.getElementById('controls');
    const noteEl = opts.noteEl || document.getElementById('note');
    let i = 0;
    let timer = null;

    function mk(tag, cls, text) {
      const el = document.createElement(tag);
      if (cls) el.className = cls;
      if (text != null) el.textContent = text;
      if (tag === 'button') el.type = 'button';
      return el;
    }
    const resetBtn = mk('button', 'ghost', '⟲ 重置');
    const prevBtn = mk('button', '', '◀ 上一步');
    const playBtn = mk('button', 'primary', '▶ 播放');
    const nextBtn = mk('button', '', '下一步 ▶');
    const spacer = mk('span', 'spacer');
    const slow = mk('span', 'label', '慢');
    const speed = mk('input');
    speed.type = 'range'; speed.min = '300'; speed.max = '2400';
    speed.value = String(2700 - (opts.interval || 1200));
    speed.setAttribute('aria-label', '速度');
    const fast = mk('span', 'label', '快');
    const counter = mk('span', 'counter');
    [resetBtn, prevBtn, playBtn, nextBtn, spacer, slow, speed, fast, counter].forEach(el => bar.appendChild(el));

    const last = () => Math.max(0, frames.length - 1);
    const delay = () => (+speed.min) + (+speed.max) - (+speed.value);

    function draw() {
      const f = frames[i];
      if (f !== undefined) render(f, i);
      if (noteEl) noteEl.innerHTML = f && f.note != null ? f.note : '';
      counter.textContent = frames.length ? `${i + 1} / ${frames.length}` : '';
      prevBtn.disabled = i === 0;
      nextBtn.disabled = i >= last();
      if (timer) { playBtn.textContent = '⏸ 暂停'; playBtn.classList.remove('primary'); }
      else { playBtn.textContent = i >= last() && frames.length > 1 ? '↻ 重播' : '▶ 播放'; playBtn.classList.add('primary'); }
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function tick() {
      if (i < last()) i++;
      if (i >= last()) stop();
      draw();
    }
    function play() {
      if (timer) { stop(); draw(); return; }
      if (i >= last()) i = 0;
      timer = setInterval(tick, delay());
      draw();
    }
    function go(k) { stop(); i = Math.min(Math.max(0, k), last()); draw(); }

    playBtn.addEventListener('click', play);
    prevBtn.addEventListener('click', () => go(i - 1));
    nextBtn.addEventListener('click', () => go(i + 1));
    resetBtn.addEventListener('click', () => go(0));
    speed.addEventListener('input', () => { if (timer) { clearInterval(timer); timer = setInterval(tick, delay()); } });
    document.addEventListener('keydown', e => {
      if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
      else if (e.key === ' ') { e.preventDefault(); play(); }
    });
    let pending = false;
    window.addEventListener('resize', () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => { pending = false; draw(); });
    });

    draw();
    return {
      load(next) { stop(); frames = next || []; i = 0; draw(); },
      go,
      index: () => i,
    };
  }

  /* ─── Array cells ───
     cls(value, i) → extra class: active | compare | visited | done | found | bad | warn | dim
     idx: true → 0..n-1 above each cell; array → custom labels; omitted → none
     ptr: { i: 'label' } or (i) → label, shown under the cell
     null / undefined / '' renders as an empty slot */
  function cells(values, opts = {}) {
    const cls = opts.cls || (() => '');
    const idx = opts.idx;
    const ptr = opts.ptr || {};
    return '<div class="cells">' + values.map((v, k) => {
      const empty = v === null || v === undefined || v === '';
      const c = ['cell', empty ? 'empty' : '', cls(v, k) || ''].filter(Boolean).join(' ');
      const lab = idx === true ? k : Array.isArray(idx) ? idx[k] : null;
      const p = typeof ptr === 'function' ? ptr(k) : ptr[k];
      return `<span class="${c}">` +
        (lab != null && lab !== '' ? `<span class="idx">${esc(lab)}</span>` : '') +
        (empty ? '·' : esc(v)) +
        (p ? `<span class="ptr">${esc(p)}</span>` : '') +
        '</span>';
    }).join('') + '</div>';
  }

  function svgWrap(w, h, body) {
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  }
  function emptySvg(text) {
    return svgWrap(240, 80, `<text x="120" y="40" class="k-badge" style="font-size:13px">${esc(text)}</text>`);
  }
  // line from (x1,y1) to (x2,y2), trimmed by r1 at the start and r2 at the end
  function trimmed(x1, y1, x2, y2, r1, r2) {
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
    return [x1 + dx / len * r1, y1 + dy / len * r1, x2 - dx / len * r2, y2 - dy / len * r2];
  }

  /* ─── Binary tree: { key, left, right } ───
     Nodes sit at their in-order rank, so a lone left child really is drawn to
     the left. cls(node) / edgeCls(parent, child) return a state class;
     badge(node) is a small label above the node (balance factor, height, …). */
  function tree(root, opts = {}) {
    if (!root) return emptySvg(opts.emptyText || '（空树）');
    const R = opts.r || 18, GX = opts.gapX || 44, GY = opts.gapY || 62, PAD = opts.pad || 30;
    const key = opts.key || (n => n.key);
    const cls = opts.cls || (() => '');
    const edgeCls = opts.edgeCls || (() => '');
    const badge = opts.badge || null;
    const pos = new Map();
    let col = 0, depth = 0;
    (function walk(n, d) {
      if (!n) return;
      walk(n.left, d + 1);
      pos.set(n, { x: PAD + col * GX, y: PAD + d * GY });
      col++;
      depth = Math.max(depth, d);
      walk(n.right, d + 1);
    })(root, 0);
    const w = PAD * 2 + Math.max(0, col - 1) * GX;
    const h = PAD * 2 + depth * GY;
    let edges = '', nodes = '';
    pos.forEach((p, n) => {
      for (const c of [n.left, n.right]) {
        if (!c) continue;
        const q = pos.get(c);
        const [a, b, x, y] = trimmed(p.x, p.y, q.x, q.y, R, R);
        edges += `<line class="k-edge ${edgeCls(n, c) || ''}" x1="${a}" y1="${b}" x2="${x}" y2="${y}"/>`;
      }
      nodes += `<g class="k-node ${cls(n) || ''}"><circle cx="${p.x}" cy="${p.y}" r="${R}"/><text x="${p.x}" y="${p.y}">${esc(key(n))}</text>` +
        (badge && badge(n) != null && badge(n) !== '' ? `<text class="k-badge" x="${p.x}" y="${p.y - R - 7}">${esc(badge(n))}</text>` : '') +
        '</g>';
    });
    return svgWrap(w, h, edges + nodes);
  }

  /* ─── Multiway tree (2-3 / B-tree): { keys: [..], children: [..] } ───
     Leaves are laid out left to right; a parent sits over its children.
     Child i hangs from the gap between keys i-1 and i of its parent. */
  function btree(root, opts = {}) {
    if (!root) return emptySvg(opts.emptyText || '（空树）');
    const KW = opts.keyW || 34, H = opts.boxH || 30, GX = opts.gapX || 18, GY = opts.gapY || 70, PAD = opts.pad || 24;
    const cls = opts.cls || (() => '');
    const edgeCls = opts.edgeCls || (() => '');
    const box = new Map();
    let cursor = PAD, depth = 0;
    (function layout(n, d) {
      const w = Math.max(1, n.keys.length) * KW;
      depth = Math.max(depth, d);
      const kids = (n.children || []).filter(Boolean);
      let cx;
      if (!kids.length) { cx = cursor + w / 2; }
      else {
        kids.forEach(c => layout(c, d + 1));
        cx = (box.get(kids[0]).cx + box.get(kids[kids.length - 1]).cx) / 2;
      }
      box.set(n, { cx, y: PAD + d * GY, w });
      cursor = Math.max(cursor, cx + w / 2 + GX);
    })(root, 0);
    const width = cursor - GX + PAD;
    const height = PAD * 2 + depth * GY + H;
    let edges = '', nodes = '';
    box.forEach((b, n) => {
      const left = b.cx - b.w / 2;
      (n.children || []).filter(Boolean).forEach((c, i) => {
        const cb = box.get(c);
        edges += `<line class="k-edge ${edgeCls(n, c, i) || ''}" x1="${left + i * KW}" y1="${b.y + H}" x2="${cb.cx}" y2="${cb.y}"/>`;
      });
      let g = `<g class="k-node ${cls(n) || ''}"><rect x="${left}" y="${b.y}" width="${b.w}" height="${H}" rx="7"/>`;
      n.keys.forEach((k, i) => {
        if (i > 0) g += `<line class="k-sep" x1="${left + i * KW}" y1="${b.y + 4}" x2="${left + i * KW}" y2="${b.y + H - 4}"/>`;
        g += `<text x="${left + i * KW + KW / 2}" y="${b.y + H / 2}">${esc(k)}</text>`;
      });
      nodes += g + '</g>';
    });
    return svgWrap(width, height, edges + nodes);
  }

  /* ─── Graph drawn at fixed coordinates ───
     spec.nodes: [{ id, x, y, label? }]   spec.edges: [{ u, v, w?, directed? }]
     spec.directed: default for edges without their own flag.
     Two directed edges u→v and v→u are bowed apart so both stay visible.
     badge(id) is a small label under the node (e.g. a distance). */
  function graph(spec, opts = {}) {
    const R = opts.r || 18, PAD = opts.pad || 34;
    const nodeCls = opts.nodeCls || (() => '');
    const edgeCls = opts.edgeCls || (() => '');
    const weightCls = opts.weightCls || edgeCls;
    const label = opts.label || (n => n.label != null ? n.label : n.id);
    const badge = opts.badge || null;
    const nodes = spec.nodes || [];
    const edges = spec.edges || [];
    if (!nodes.length) return emptySvg('（空图）');
    const at = new Map(nodes.map(n => [n.id, n]));
    const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y);
    const minX = Math.min(...xs) - PAD, minY = Math.min(...ys) - PAD;
    const w = Math.max(...xs) + PAD - minX, h = Math.max(...ys) + PAD + (badge ? 14 : 0) - minY;
    const isDir = e => e.directed != null ? e.directed : !!spec.directed;
    const has = new Set(edges.filter(isDir).map(e => e.u + '\u0000' + e.v));

    const defs = `<defs>${['', 'active', 'done', 'visited'].map(k =>
      `<marker id="k-arr${k ? '-' + k : ''}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">` +
      `<path d="M0,0 L10,5 L0,10 z" style="fill:${k === 'active' ? 'var(--accent)' : k === 'done' ? 'var(--green)' : k === 'visited' ? 'var(--blue)' : 'rgba(255,255,255,0.45)'}"/></marker>`).join('')}</defs>`;

    let lines = '', weights = '', dots = '';
    edges.forEach((e, k) => {
      const a = at.get(e.u), b = at.get(e.v);
      if (!a || !b) return;
      const dir = isDir(e);
      const c = edgeCls(e, k) || '';
      const marker = dir ? ` marker-end="url(#k-arr${/\bactive\b/.test(c) ? '-active' : /\b(done|tree)\b/.test(c) ? '-done' : /\bvisited\b/.test(c) ? '-visited' : ''})"` : '';
      const bend = dir && has.has(e.v + '\u0000' + e.u) ? 16 : 0;
      const [x1, y1, x2, y2] = trimmed(a.x, a.y, b.x, b.y, R, R + (dir ? 2 : 0));
      let mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      if (bend) {
        const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len, ny = dx / len;
        const cx = mx + nx * bend * 2, cy = my + ny * bend * 2;
        lines += `<path class="k-edge ${c}" d="M${x1},${y1} Q${cx},${cy} ${x2},${y2}"${marker}/>`;
        mx += nx * bend; my += ny * bend;
      } else {
        lines += `<line class="k-edge ${c}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"${marker}/>`;
      }
      if (e.w != null) weights += `<text class="k-weight ${weightCls(e, k) || ''}" x="${mx}" y="${my}">${esc(e.w)}</text>`;
    });
    nodes.forEach(n => {
      dots += `<g class="k-node ${nodeCls(n.id) || ''}"><circle cx="${n.x}" cy="${n.y}" r="${R}"/><text x="${n.x}" y="${n.y}">${esc(label(n))}</text>` +
        (badge && badge(n.id) != null && badge(n.id) !== '' ? `<text class="k-badge" x="${n.x}" y="${n.y + R + 14}">${esc(badge(n.id))}</text>` : '') +
        '</g>';
    });
    return `<svg viewBox="${minX} ${minY} ${w} ${h}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">${defs}${lines}${weights}${dots}</svg>`;
  }

  window.AnimKit = { player, cells, tree, btree, graph, esc };
})();

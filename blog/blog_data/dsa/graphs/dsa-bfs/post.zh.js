/* Post body — dsa-bfs / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-bfs:zh'] = `
<p class="lead">广度优先搜索（Breadth-First Search, BFS）从起点出发<strong>一层一层</strong>向外访问：先访问全部邻居，再访问邻居的邻居。它用一个 FIFO 队列和一个标记数组实现，在<strong>无权图</strong>里顺带求出起点到每个顶点的最短路径（边数最少）。</p>

<h2>一层一层往外扩</h2>
<p>课上的比喻：一个人有好消息，先告诉所有朋友；朋友再告诉他们的朋友；这样一轮一轮传下去。第 1 轮知道消息的是离他 1 步的人，第 2 轮是离他 2 步的人。BFS 就按这个顺序访问图。</p>
<p>课上的图（无向、无权，6 个顶点），从 A 出发，按“离 A 几条边”分层画出：</p>
<figure class="fig">
<svg viewBox="0 0 400 250" width="400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="课上的 6 顶点无向图，按到 A 的边数分三层">
<line x1="50" y1="135" x2="200" y2="55" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="50" y1="135" x2="200" y2="135" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="50" y1="135" x2="200" y2="215" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="200" y1="55" x2="200" y2="135" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="200" y1="55" x2="350" y2="95" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="200" y1="135" x2="350" y2="95" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="200" y1="215" x2="350" y2="215" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<text x="50" y="20" text-anchor="middle" font-size="13" font-weight="700" fill="#d97757">第 0 层</text>
<text x="200" y="20" text-anchor="middle" font-size="13" font-weight="700" fill="#38bdf8">第 1 层</text>
<text x="350" y="20" text-anchor="middle" font-size="13" font-weight="700" fill="#4ade80">第 2 层</text>
<circle cx="50" cy="135" r="18" fill="#343433" stroke="#d97757" stroke-width="2"/>
<text x="50" y="135" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">A</text>
<circle cx="200" cy="55" r="18" fill="#343433" stroke="#38bdf8" stroke-width="2"/>
<text x="200" y="55" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">B</text>
<circle cx="200" cy="135" r="18" fill="#343433" stroke="#38bdf8" stroke-width="2"/>
<text x="200" y="135" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">C</text>
<circle cx="200" cy="215" r="18" fill="#343433" stroke="#38bdf8" stroke-width="2"/>
<text x="200" y="215" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">D</text>
<circle cx="350" cy="95" r="18" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<text x="350" y="95" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">E</text>
<circle cx="350" cy="215" r="18" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<text x="350" y="215" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">F</text>
</svg>
<figcaption>边：A–B，A–C，A–D，B–C，B–E，C–E，D–F</figcaption>
</figure>
<p>邻接表（邻居按字母序，追踪时就按这个顺序检查）：</p>
<pre><code class="lang-text">A: B C D
B: A C E
C: A B E
D: A F
E: B C
F: D</code></pre>

<h2>队列 + 标记数组</h2>
<p>BFS 用两个结构：</p>
<ul>
  <li><strong>待访问队列（queue，FIFO）</strong>：已发现、还没处理的顶点。先进先出，先发现的先访问，访问顺序因此按层推进。</li>
  <li><strong>标记数组 mark[]</strong>：大小 V，初始全 0（未访问）；标成 1 的顶点不会再入队。</li>
</ul>
<p>“访问”顶点 u 的意思是：把 u 出队，检查它的每个邻居 w，<strong>未标记的就标记并入队</strong>。</p>

<h3>追踪：从 A 出发</h3>
<p>“✓”表示该邻居已标记，跳过。</p>
<table>
<thead><tr><th>步</th><th>出队（访问）</th><th>检查邻居</th><th>标记并入队</th><th>之后的队列</th></tr></thead>
<tbody>
<tr><td>0</td><td>—</td><td>—</td><td>A（起点）</td><td>[A]</td></tr>
<tr><td>1</td><td>A</td><td>B，C，D</td><td>B，C，D</td><td>[B, C, D]</td></tr>
<tr><td>2</td><td>B</td><td>A ✓，<strong>C ✓</strong>，E</td><td>E</td><td>[C, D, E]</td></tr>
<tr><td>3</td><td>C</td><td>A ✓，B ✓，E ✓</td><td>—</td><td>[D, E]</td></tr>
<tr><td>4</td><td>D</td><td>A ✓，F</td><td>F</td><td>[E, F]</td></tr>
<tr><td>5</td><td>E</td><td>B ✓，C ✓</td><td>—</td><td>[F]</td></tr>
<tr><td>6</td><td>F</td><td>D ✓</td><td>—</td><td>[ ]</td></tr>
</tbody>
</table>
<p><strong>BFS 顺序：A, B, C, D, E, F</strong>。队列先进先出，所以访问（出队）顺序就是入队顺序。</p>

<div class="callout key" data-label="考点">
<p><strong>顶点在入队时就标记，而不是出队（访问）时才标记。</strong>看第 2 步：访问 B 时，C 还在队列里、尚未被访问，但它在第 1 步入队时已经标记，所以不会第二次入队。若改成出队时才标记，此时 mark[C] 仍是 0，C 会再入队一次，之后被访问两次（完整后果见练习 2）。第 3 步的 E 同理。</p>
</div>

<iframe class="anim-frame" src="blog/blog_data/dsa-bfs/anims/bfs.html" loading="lazy" style="height: 540px;" title="BFS 逐步演示"></iframe>
<p class="anim-caption">按“下一步”逐个检查邻居，最后一帧按层着色；切到“出队才标记（错误）”看同一顶点怎样重复入队。</p>

<h2>伪代码与 C 实现</h2>
<p>课上的伪代码，结构与 DFS 相同：外层循环保证不连通的图也能访问到每个顶点。</p>
<pre><code class="lang-text">BFS(G):
    mark each vertex in V with 0
    for each vertex v in V:
        if v is marked with 0:
            mark v with 1
            enqueue(Q, v)
            while Q is not empty:
                u = dequeue(Q)
                visit(u)
                for each vertex w adjacent to u:
                    if w is marked with 0:
                        mark w with 1
                        enqueue(Q, w)</code></pre>
<p>C 实现用邻接表（见 7.2）。队列是普通数组加两个下标：head 处出队，tail 处入队。<strong>每个顶点最多入队一次，所以 V 格的数组就够，不需要循环队列</strong>。dist[] 记录离起点的边数，用于求最短路。</p>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

typedef struct node {
    int v;                              /* 邻居编号：0 = A, 1 = B, … */
    struct node *next;
} node_t;

/* 从 s 出发做一次 BFS，访问 s 所在连通分量的全部顶点。
   mark[v] = 1：v 已入过队；dist[v]：s 到 v 的最少边数 */
void bfs_explore(node_t *adj[], int n, int s, int mark[], int dist[]) {
    int *queue = malloc(n * sizeof(int));   /* 每个顶点最多入队一次 */
    int head = 0, tail = 0;             /* head 处出队，tail 处入队 */

    mark[s] = 1;                        /* 入队即标记 */
    dist[s] = 0;
    queue[tail++] = s;
    while (head &lt; tail) {               /* 队列非空 */
        int u = queue[head++];          /* 出队，访问 u */
        printf("%c ", 'A' + u);
        for (node_t *p = adj[u]; p != NULL; p = p-&gt;next) {
            int w = p-&gt;v;
            if (mark[w] == 0) {
                mark[w] = 1;            /* 入队的同时标记 */
                dist[w] = dist[u] + 1;  /* 比 u 多走一条边 */
                queue[tail++] = w;
            }
        }
    }
    free(queue);
}

/* 外层循环：每个连通分量各做一次 BFS */
void bfs(node_t *adj[], int n, int dist[]) {
    int *mark = calloc(n, sizeof(int)); /* 全 0 = 都未标记 */
    for (int v = 0; v &lt; n; v++) {
        if (mark[v] == 0) {
            bfs_explore(adj, n, v, mark, dist);
        }
    }
    free(mark);
}</code></pre>
<p>用课上的图（A–F 编号 0–5，邻接表按字母序）调用 <code>bfs</code>，输出 <code>A B C D E F</code>，dist 依次为 0, 1, 1, 1, 2, 2。外层循环每调用一次 <code>bfs_explore</code>，就走完一个连通分量。BFS 也适用于有向图，检查邻居时只沿出边走。</p>

<h2>复杂度</h2>
<ul>
  <li>每个顶点入队、出队各一次：O(V)。</li>
  <li>每个顶点出队时要找出全部邻居。<strong>邻接表</strong>：所有链表合起来只有 2E 个结点（有向图为 E），总共 <strong>O(V + E)</strong>。<strong>邻接矩阵</strong>：每个顶点扫一整行 V 格，总共 <strong>O(V²)</strong>。</li>
</ul>
<p>与 DFS 完全相同。额外空间是 mark、dist 和队列，各 O(V)。</p>

<h2>无权图的最短路</h2>
<p>回看追踪：B、C、D 由 A 发现，dist = 1；E 由 B 发现，F 由 D 发现，dist = 2，正是图中的三层。在<strong>无权图</strong>（有向、无向都行）里，BFS 求出的 dist[v] 就是起点到 v 的<strong>最少边数</strong>。</p>
<p>原因：队列里的顶点按 dist 从小到大排列，且队头与队尾最多相差 1（前面是第 k 层，后面跟着它们发现的第 k + 1 层）。因此第 k 层全部出队之后，第 k + 1 层才开始出队。顶点 w 第一次被发现时，发现它的 u 是 w 的邻居里最早出队、dist 最小的一个，dist[u] + 1 就是最少边数。入队即标记保证这个值写下后不会被改写。</p>
<p>只求单个起点 s 的最短路时，不要外层循环：把 mark 设为全 0、dist 设为全 −1，只调用一次 <code>bfs_explore</code>，结束后仍为 −1 的顶点就是不可达（距离 ∞）。要路径本身，入队时再记 from[w] = u，最后沿 from[] 倒推（与 Dijkstra 的 from[] 相同，见 7.5）。</p>

<h3>带权图上会出错</h3>
<p>BFS 只数边数，不看权重。课上的反例是一个带权的四边形：</p>
<figure class="fig">
<svg viewBox="0 0 360 220" width="360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="带权四边形：BFS 路径与真正最短路">
<line x1="40" y1="110" x2="180" y2="185" stroke="#f87171" stroke-width="3"/>
<line x1="40" y1="110" x2="180" y2="35" stroke="#4ade80" stroke-width="3"/>
<line x1="180" y1="35" x2="320" y2="110" stroke="#4ade80" stroke-width="3"/>
<line x1="320" y1="110" x2="180" y2="185" stroke="#4ade80" stroke-width="3"/>
<text x="98" y="164" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#f87171">10</text>
<text x="98" y="58" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">3</text>
<text x="262" y="58" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">2</text>
<text x="262" y="164" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">2</text>
<circle cx="40" cy="110" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="40" y="110" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">A</text>
<circle cx="180" cy="35" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="180" y="35" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">B</text>
<circle cx="320" cy="110" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="320" y="110" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">D</text>
<circle cx="180" cy="185" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="180" y="185" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">C</text>
</svg>
<figcaption>红：BFS 给出的 A → C，代价 10；绿：真正的最短路 A → B → D → C，代价 7</figcaption>
</figure>
<p>从 A 出发，C 是 A 的邻居，BFS 在第 1 层就发现 C，给出路径 A → C，代价 <strong>10</strong>；A → B → D → C 多走两条边，代价却只有 3 + 2 + 2 = <strong>7</strong>。<strong>BFS 只在无权图（或所有边权相等）时求得最短路</strong>。边权不同（且非负）时用 Dijkstra（见 7.5），它把 FIFO 队列换成按距离取最小的优先队列。</p>

<h2>BFS 与 DFS</h2>
<table>
<thead><tr><th></th><th>DFS（见 7.3）</th><th>BFS</th></tr></thead>
<tbody>
<tr><td>决定下一个顶点</td><td>递归调用栈 / 显式栈（LIFO）</td><td>队列（FIFO）</td></tr>
<tr><td>访问方式</td><td>一条路走到底再回溯</td><td>一层一层向外</td></tr>
<tr><td>何时标记</td><td>进入 DFSExplore(v) 时</td><td><strong>入队时</strong></td></tr>
<tr><td>无权图最短路</td><td>不保证</td><td><strong>保证</strong>（最少边数）</td></tr>
<tr><td>时间</td><td>邻接表 O(V + E)，矩阵 O(V²)</td><td>相同</td></tr>
<tr><td>用途</td><td>遍历、可达性、连通分量、环检测</td><td>相同，外加无权图最短路</td></tr>
</tbody>
</table>

<h2>考试怎么考</h2>
<ul>
  <li><strong>写遍历顺序</strong>：给图和起点写 BFS 顺序，有时还要写每步之后的队列。题目说平局按字母序（break ties alphabetically）就必须照做；没说时，同一顶点的几个邻居以任意顺序入队都算对，课上明确说过。</li>
  <li><strong>为什么入队时标记</strong>：答“防止同一顶点多次入队、被访问多次”，再用具体顶点说明（如课上例子第 2 步的 C）。读代码题可能给出“出队才标记”的版本，问输出或错在哪里。</li>
  <li><strong>写 C</strong>：数组队列 + head/tail、mark 数组、外层循环，必要时加 dist[]。</li>
  <li><strong>复杂度</strong>：邻接表 O(V + E)、邻接矩阵 O(V²)。公式表上没有，要记住并会解释。</li>
  <li><strong>判断题</strong>：2016 年考过“BFS 和 Dijkstra 在带权 DAG 上总能找到最短路”，错：BFS 不考虑权重（Dijkstra 的问题在负权，见 7.5）。同一卷还考过“一次深度优先遍历就能访问无向图的所有顶点”，错：图可能不连通，从一个顶点出发到不了别的连通分量，所以需要外层循环；换成 BFS 也一样。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>① 同一层内的顺序不一定是字母序，而由<strong>上一层顶点出队的先后</strong>决定：图 A–B、A–C、B–E、C–D 从 A 出发，顺序是 A, B, C, E, D（E 由先出队的 B 发现）。② 检查邻居时，还在队列里、尚未访问的顶点也算“已标记”，要跳过。③ 求单源最短路只跑一次 BFS，不可达顶点的距离是 ∞，不是 0。</p>
</div>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">1. 在课上的图上从 E 出发做 BFS，平局按字母序。写出每步出队的顶点和之后的队列、BFS 顺序和每个顶点的 dist。如果不要求字母序，还有哪个合法顺序？</summary>
  <div class="qa__body">
<table>
<thead><tr><th>步</th><th>出队</th><th>标记并入队（dist）</th><th>之后的队列</th></tr></thead>
<tbody>
<tr><td>0</td><td>—</td><td>E（0）</td><td>[E]</td></tr>
<tr><td>1</td><td>E</td><td>B（1），C（1）</td><td>[B, C]</td></tr>
<tr><td>2</td><td>B</td><td>A（2）；C、E 已标记</td><td>[C, A]</td></tr>
<tr><td>3</td><td>C</td><td>—；A、B、E 已标记</td><td>[A]</td></tr>
<tr><td>4</td><td>A</td><td>D（3）；B、C 已标记</td><td>[D]</td></tr>
<tr><td>5</td><td>D</td><td>F（4）；A 已标记</td><td>[F]</td></tr>
<tr><td>6</td><td>F</td><td>—；D 已标记</td><td>[ ]</td></tr>
</tbody>
</table>
<p>BFS 顺序 <strong>E, B, C, A, D, F</strong>。dist：A 2，B 1，C 1，D 3，E 0，F 4。</p>
<p>不要求字母序时，第 1 步可以让 C 先于 B 入队，得到 <strong>E, C, B, A, D, F</strong>（这时 A 由 C 发现）。两种都对；题目写明平局按字母序时只能答第一种。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">2. 下面的循环把标记移到了出队时（起点入队前不标记）。邻接表按字母序，在课上的图上从 A 运行，输出什么？队列一共写入多少个元素？queue 只开 V = 6 格会怎样？怎么改？</summary>
  <div class="qa__body">
<pre><code>    queue[tail++] = s;
    while (head &lt; tail) {
        int u = queue[head++];
        mark[u] = 1;                    /* 出队时才标记 */
        printf("%c ", 'A' + u);
        for (node_t *p = adj[u]; p != NULL; p = p-&gt;next) {
            if (mark[p-&gt;v] == 0) {
                queue[tail++] = p-&gt;v;
            }
        }
    }</code></pre>
<table>
<thead><tr><th>出队</th><th>入队</th><th>之后的队列</th></tr></thead>
<tbody>
<tr><td>A</td><td>B，C，D</td><td>[B, C, D]</td></tr>
<tr><td>B</td><td><strong>C</strong>，E（C 已在队列里，仍是 0）</td><td>[C, D, C, E]</td></tr>
<tr><td>C</td><td><strong>E</strong></td><td>[D, C, E, E]</td></tr>
<tr><td>D</td><td>F</td><td>[C, E, E, F]</td></tr>
<tr><td>C（第 2 次）</td><td><strong>E</strong></td><td>[E, E, F, E]</td></tr>
<tr><td>E</td><td>—</td><td>[E, F, E]</td></tr>
<tr><td>E（第 2 次）</td><td>—</td><td>[F, E]</td></tr>
<tr><td>F</td><td>—</td><td>[E]</td></tr>
<tr><td>E（第 3 次）</td><td>—</td><td>[ ]</td></tr>
</tbody>
</table>
<p>输出 <code>A B C D C E E F E</code>：C 被访问 2 次，E 被访问 3 次。队列一共写入 <strong>9</strong> 个元素（起点 A 一个，循环里又入队 8 次），超过 6 格，<code>queue[6]</code> 到 <code>queue[8]</code> 越界，是未定义行为。</p>
<p>修改：起点入队前 <code>mark[s] = 1</code>，循环里在 <code>queue[tail++] = p-&gt;v</code> 之前先 <code>mark[p-&gt;v] = 1</code>，删掉出队时的标记，也就是 bfs_explore 的写法。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">3. 图有 5 个顶点，边为 A–C、B–C、B–D、C–D，E 是孤立点（邻接表按字母序）。调用前面的 bfs 函数，输出什么？bfs_explore 被调用几次？再改写 bfs，使它返回连通分量的个数。</summary>
  <div class="qa__body">
<p>外层循环 v = A：bfs_explore(A)。A 出队，入队 C → [C]；C 出队，A 已标记，入队 B、D → [B, D]；B 出队，C、D 已标记；D 出队，B、C 已标记；队列空。外层循环接着看 B、C、D，都已标记；E 未标记，bfs_explore(E)，E 出队，没有邻居。</p>
<p>输出 <strong>A C B D E</strong>，bfs_explore 被调用 <strong>2</strong> 次，对应两个连通分量 {A, B, C, D} 和 {E}。dist：A 0，C 1，B 2，D 2，E 0（E 是第二次 BFS 的起点；从 A 出发它不可达）。</p>
<p>外层循环每开始一次新的 BFS，就是一个新的连通分量：</p>
<pre><code>int count_components(node_t *adj[], int n, int dist[]) {
    int *mark = calloc(n, sizeof(int));
    int count = 0;
    for (int v = 0; v &lt; n; v++) {
        if (mark[v] == 0) {
            count++;                    /* 发现一个新的连通分量 */
            bfs_explore(adj, n, v, mark, dist);
        }
    }
    free(mark);
    return count;
}</code></pre>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">4. 判断对错并说明：(a) 所有边权都是 5 的图上，BFS 找到的路径也是代价最小的路径；(b) 用邻接矩阵存图时 BFS 是 O(V + E)；(c) 顶点出队之后，它的 dist 还可能变小；(d) 在带权 DAG 上，BFS 总能找到代价最小的路径。</summary>
  <div class="qa__body">
<p>(a) <strong>对</strong>。路径代价 = 5 × 边数，边数最少就是代价最小。</p>
<p>(b) <strong>错</strong>。找一个顶点的邻居要扫整行 V 格，V 个顶点共 <strong>O(V²)</strong>。</p>
<p>(c) <strong>错</strong>。dist 在入队时写下，已经是最少边数；该顶点同时被标记，之后不会再被写。</p>
<p>(d) <strong>错</strong>。反例：DAG 中 A→B 1、B→C 1、A→C 5。BFS 从 A 出发在第 1 层发现 C，给出 A→C，代价 5；A→B→C 代价只有 2。</p>
  </div>
</details>
`;

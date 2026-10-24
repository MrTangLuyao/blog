/* Post body — dsa-dfs / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-dfs:zh'] = `
<p class="lead">深度优先搜索（Depth-First Search, DFS）从一个顶点出发，沿着未访问的邻居一路走到底，走不动了再退回上一个还有路的顶点换方向。加上外层循环，它<strong>恰好访问每个顶点一次</strong>：用邻接表 O(V + E)，用邻接矩阵 O(V²)。</p>

<h2>思路：用铅笔走迷宫</h2>
<p>走迷宫时从起点画线，到岔路口任选一个方向；走进死胡同（dead end）就沿线退回最近一个还有没走过方向的岔路口，换个方向再走。图上也一样：去一个<strong>未访问</strong>邻居，再去它的未访问邻居……能往深处走就一直走；当前顶点的邻居都访问过了，就<strong>回溯（backtrack）</strong>到上一个顶点。回溯正好对应函数返回，所以 DFS 最自然的写法是递归。</p>

<h2>伪代码（课上的写法）</h2>
<pre><code class="lang-text">DFS(G):
    mark each vertex in V with 0          // 0 = 未访问
    for each vertex v in V:
        if v is marked with 0:
            DFSExplore(v)

DFSExplore(v):
    mark v with 1                         // 1 = 已访问
    for each vertex w adjacent to v:      // 唯一取决于存储方式的一步
        if w is marked with 0:
            DFSExplore(w)</code></pre>
<ul>
  <li><strong>递归前先检查标记</strong>，而 DFSExplore 第一件事就是标 1，所以<strong>每个顶点恰好被访问一次</strong>，有环也不会绕圈。</li>
  <li><strong>外层循环</strong>：一次 DFSExplore(s) 只走到与 s 连通的顶点；外层循环把仍为 0 的顶点都当作新起点，所以<strong>非连通图（disconnected graph）也能全部访问</strong>，每次探索走完一个连通分量（connected component）。</li>
  <li><strong>DFS 顺序</strong>指顶点被标 1 的先后。</li>
</ul>

<h2>课上的例子：逐步追踪</h2>
<p>边 A–C、B–C、B–D、C–D，E 孤立。邻居按字母序处理。</p>
<figure class="fig">
<svg viewBox="0 0 480 172" width="480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="课上的 5 顶点无向图">
<line x1="50" y1="86" x2="180" y2="86" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="180" y1="86" x2="310" y2="30" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="180" y1="86" x2="310" y2="142" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="310" y1="30" x2="310" y2="142" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<circle cx="50" cy="86" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="50" y="86" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">A</text>
<circle cx="180" cy="86" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="180" y="86" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">C</text>
<circle cx="310" cy="30" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="310" y="30" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">B</text>
<circle cx="310" cy="142" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="310" y="142" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">D</text>
<circle cx="430" cy="86" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="430" y="86" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">E</text>
<text x="430" y="126" text-anchor="middle" font-size="12" fill="#a1a1a0">孤立</text>
</svg>
<figcaption>邻接表（按字母序）：A: C；B: C, D；C: A, B, D；D: B, C；E: 空</figcaption>
</figure>
<table>
<thead><tr><th>步</th><th>发生了什么</th><th>调用栈（底 → 顶）</th><th>访问顺序</th></tr></thead>
<tbody>
<tr><td>1</td><td>外层循环 v = A：A 为 0 → DFSExplore(A)，标记 A</td><td>A</td><td>A</td></tr>
<tr><td>2</td><td>A 的邻居 C 为 0 → DFSExplore(C)；A 的调用没结束，留在栈里</td><td>A C</td><td>A C</td></tr>
<tr><td>3</td><td>C 的邻居 A 是 1，跳过；B 为 0 → DFSExplore(B)</td><td>A C B</td><td>A C B</td></tr>
<tr><td>4</td><td>B 的邻居 C 是 1，跳过；D 为 0 → DFSExplore(D)</td><td>A C B D</td><td>A C B D</td></tr>
<tr><td>5</td><td>D 的邻居 B、C 都是 1 → D 结束，回到 B</td><td>A C B</td><td>A C B D</td></tr>
<tr><td>6</td><td>B 的邻居看完 → B 结束，回到 C</td><td>A C</td><td>A C B D</td></tr>
<tr><td>7</td><td>C 的最后一个邻居 D 已是 1，跳过 → C 结束</td><td>A</td><td>A C B D</td></tr>
<tr><td>8</td><td>A 的邻居看完 → A 结束，回到外层循环</td><td>（空）</td><td>A C B D</td></tr>
<tr><td>9</td><td>外层循环：B、C、D 是 1，跳过；E 为 0 → DFSExplore(E)</td><td>E</td><td>A C B D E</td></tr>
<tr><td>10</td><td>E 没有邻居 → E 结束；外层循环结束</td><td>（空）</td><td>A C B D E</td></tr>
</tbody>
</table>
<p><strong>访问顺序 A, C, B, D, E。</strong></p>
<ul>
  <li>D 是从 B 走到的：C 先看到 B 就一路深入到 D，回到 C 时 D 已访问。这就是“先走到底”。</li>
  <li><strong>栈里的顶点就是从起点到当前顶点的路径</strong>，最深时是 A → C → B → D。</li>
  <li>E 只能靠外层循环访问。外层循环发起 2 次探索（A、E），对应 2 个连通分量。</li>
  <li>调用<strong>结束</strong>的顺序是 D, B, C, A, E，7.8 拓扑排序会用到它。</li>
</ul>

<iframe class="anim-frame" src="blog/blog_data/dsa-dfs/anims/dfs.html" loading="lazy" style="height: 540px;" title="DFS 逐步演示"></iframe>
<p class="anim-caption">逐帧看递归：蓝色是还在调用栈里的顶点和路径，绿色是已结束的调用；“对照 BFS 的图”可比较两种遍历顺序。</p>

<h2>复杂度：每个顶点一次，每条边两次</h2>
<p>DFSExplore 对每个顶点<strong>恰好调用一次</strong>，共 V 次；每次都要列出 v 的所有邻居，代价取决于存储方式（见 7.2）：</p>
<ul>
  <li><strong>邻接表</strong>：走 v 的链表，deg(v) 步。合计 ∑ deg(v) = 2E：无向图每条边在两端各被看一次，例如 A–C 在探索 A 和探索 C 时各看一次。</li>
  <li><strong>邻接矩阵</strong>：不管有几个邻居都要扫完 v 那一整行，V 步；V 个顶点就是 V × V。</li>
</ul>
<table>
<thead><tr><th></th><th>邻接表</th><th>邻接矩阵</th></tr></thead>
<tbody>
<tr><td>列出 v 的邻居</td><td>O(deg(v))</td><td>O(V)</td></tr>
<tr><td>DFS 总时间</td><td><strong>O(V + E)</strong></td><td><strong>O(V²)</strong></td></tr>
</tbody>
</table>
<ul>
  <li>V 不能省：边再少，V 次标记和外层循环的检查照样要做。</li>
  <li>稠密图（E ≈ V²）两者都是 O(V²)；稀疏图（E ≈ V）邻接表只要 O(V)。</li>
  <li>有向图只沿出边走，每条边看一次，复杂度不变。</li>
</ul>

<h2>C 实现（邻接矩阵）</h2>
<p>考试手写最省事的是邻接矩阵：按下标 0, 1, 2, … 扫一行，邻居自然按字母序。外层循环顺便数出连通分量。</p>
<pre><code>#define MAXV 26

/* 先标记 v，再对每个未访问的邻居递归（按下标扫 = 按字母序） */
void dfs_explore(int n, int adj[][MAXV], int v,
                 int visited[], int order[], int *cnt) {
    visited[v] = 1;                     /* 标记为已访问 */
    order[(*cnt)++] = v;                /* 记录访问顺序 */
    for (int w = 0; w &lt; n; w++) {       /* 找邻居：扫一整行，O(V) */
        if (adj[v][w] &amp;&amp; !visited[w]) {
            dfs_explore(n, adj, w, visited, order, cnt);
        }
    }
}

/* 外层循环保证每个分量都被访问；返回探索次数 = 连通分量个数 */
int dfs(int n, int adj[][MAXV], int order[]) {
    int visited[MAXV] = {0};            /* 0 = 未访问 */
    int cnt = 0, components = 0;
    for (int v = 0; v &lt; n; v++) {
        if (!visited[v]) {
            components++;
            dfs_explore(n, adj, v, visited, order, &amp;cnt);
        }
    }
    return components;
}</code></pre>
<p>课上的图（A..E 编号 0..4，每条无向边填 <code>adj[u][v]</code> 和 <code>adj[v][u]</code> 两格）调用 <code>dfs(5, adj, order)</code>，得到 order = A C B D E，返回 2。换成邻接表只需把 for 循环改成沿 v 的链表走（结构体见 7.2），时间变为 O(V + E)；这时<strong>链表里结点的顺序决定访问顺序</strong>，按字母序加边并头插，链表就是逆字母序。</p>

<h2>用显式栈代替递归</h2>
<p>递归深度最坏为 V（图是一条长链时），图很大时可能撑爆调用栈。DFS 也可以用显式的<strong>栈（stack，后进先出 LIFO）</strong>记录进度：弹出一个顶点，已访问就跳过；否则标记、访问它，再把它的未访问邻居<strong>倒序</strong>压栈，让字母序最小的先弹出。</p>
<pre><code>/* 显式栈版：访问顺序与递归版相同，参数也相同，可直接替换 dfs_explore */
void dfs_stack(int n, int adj[][MAXV], int s,
               int visited[], int order[], int *cnt) {
    int stack[MAXV * MAXV + 1], top = 0;    /* 压栈总次数 ≤ 1 + 2E */
    stack[top++] = s;
    while (top &gt; 0) {
        int v = stack[--top];               /* 出栈 */
        if (visited[v]) continue;           /* 同一顶点可能被压过多次 */
        visited[v] = 1;                     /* 出栈时才标记、访问 */
        order[(*cnt)++] = v;
        for (int w = n - 1; w &gt;= 0; w--)    /* 倒序压栈 */
            if (adj[v][w] &amp;&amp; !visited[w]) stack[top++] = w;
    }
}</code></pre>
<p>在课上的图上从 A 开始：</p>
<pre><code class="lang-text">操作                          栈（底 → 顶）   访问顺序
压入 A                        A
弹出 A：访问，压入 C            C               A
弹出 C：访问，倒序压入 D、B      D B             A C
弹出 B：访问，压入 D            D D             A C B
弹出 D：访问，邻居都已访问       D               A C B D
弹出 D：已访问，跳过            （空）           A C B D</code></pre>
<p>外层循环再处理 E，结果同样是 A, C, B, D, E。复杂度不变：邻接表 O(V + E)，邻接矩阵 O(V²)。</p>
<div class="callout warn" data-label="易错">
<p>D 被压了两次，所以必须<strong>出栈时才标记</strong>，并跳过已访问的顶点。别照搬 BFS 的“入队就标记”（见 7.4）：压栈时就标记，顶点会在浅层被提前“占住”，更深的路径不能再经过它，结果一般不是 DFS 顺序（练习 4）。</p>
</div>

<h2>DFS 能做什么，不能做什么</h2>
<ul>
  <li><strong>可达性（reachability）</strong>：只调用一次 DFSExplore(u)，不要外层循环，结束后看 v 是否为 1（练习 3）。</li>
  <li><strong>连通分量</strong>：外层循环发起探索的次数就是分量个数；探索时给顶点记下分量编号，之后 O(1) 判断两点是否同一分量。</li>
  <li><strong>判环（cycle detection）</strong>：无向图中，探索 v 时遇到已访问、但不是“来时那个顶点”的邻居，就有环。课上的图里探索 D（从 B 来）时看到 C 已访问，找到环 C–B–D–C。完整写法见 7.9。</li>
  <li>适用于<strong>有向和无向、带权和无权</strong>的图，权重直接忽略。</li>
</ul>
<p>两件做不到的事：</p>
<ul>
  <li><strong>DFS 不保证找到最短路径。</strong>课上的反例：三角形 A、B、C 两两相连，从 A 出发按字母序，DFS 先到 B 再到 C，走的是 A–B–C（2 条边），而 A–C 一条边就够。5 点图里 DFS 经 A–C–B–D 到 D，也比 A–C–D 长。</li>
  <li><strong>DFS 不是逐层（level by level）访问</strong>，那是 BFS 的性质。复习课的找路算法表里 <strong>DFS 不是最优（not optimal）的</strong>，BFS 只在所有边代价相同时最优。</li>
</ul>

<h2>考试怎么考</h2>
<ul>
  <li><strong>追踪题</strong>：给图（矩阵或邻接表）和起点，写 DFS 访问顺序，可能还问某时刻的调用栈或最大递归深度。说按字母序就严格按字母序；给邻接表时按表中顺序；没规定顺序时，任何合法的 DFS 顺序都给分。</li>
  <li><strong>复杂度</strong>：邻接表 O(V + E)，邻接矩阵 O(V²)。<strong>不在公式表上</strong>，要会用“V 次 DFSExplore × 每次列邻居的代价”推出来。</li>
  <li><strong>判断题</strong>（课上投票和 2016 年真题）：DFS 总能找到最短路径（错）；DFS 逐层访问（错）；完整的 DFS 能访问连通图的每个顶点（对）；DFS 只适用于有向图或带权图（错）；一次深度优先遍历足以访问无向图的所有顶点（错，见练习 2）。</li>
  <li><strong>代码题</strong>：写递归 DFS；做小改动（数连通分量、判断可达、判环）；改写成显式栈。</li>
  <li><strong>匹配题</strong>：复习课把“遍历树或图逐个查找”归为蛮力（brute force）。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>① 漏了外层循环，非连通图只访问一部分。② 递归前不检查标记，有环就无限递归。③ 用矩阵却写 O(V + E)，或把 O(V + E) 写成 O(E)。④ 邻接表里的顺序不一定是字母序。</p>
</div>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">1. 7.4 BFS 用的图：边 A–B、A–C、A–D、B–C、B–E、C–E、D–F。先调用 DFSExplore(E)，邻居按字母序。写出访问顺序和 F 被访问时的调用栈，并与 BFS 从 E 出发的顺序 E, B, C, A, D, F 比较。</summary>
  <div class="qa__body">
<p>邻接表：A: B, C, D；B: A, C, E；C: A, B, E；D: A, F；E: B, C；F: D。</p>
<ol>
  <li>E 的邻居 B 为 0 → DFSExplore(B)；B 的邻居 A 为 0 → DFSExplore(A)。</li>
  <li>A 的邻居 B 是 1；C 为 0 → DFSExplore(C)。C 的邻居 A、B、E 都是 1 → C 结束，回到 A。</li>
  <li>A 的下一个邻居 D 为 0 → DFSExplore(D)；D 的邻居 A 是 1，F 为 0 → DFSExplore(F)。</li>
  <li>F 的邻居 D 是 1 → F 结束；D、A 依次结束；B 剩下的 C、E 都是 1 → B 结束；E 剩下的 C 是 1 → E 结束。</li>
</ol>
<p><strong>访问顺序 E, B, A, C, D, F。</strong>F 被访问时调用栈（底 → 顶）是 <strong>E, B, A, D, F</strong>，C 已结束出栈；这也是最大深度 5。</p>
<p>对比 BFS：C 是 E 的直接邻居，BFS 在第一层就访问它；DFS 先沿 B → A 走到底，经 E–B–A–C 才到 C。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">2. 判断对错并说明：(a) 用邻接矩阵存一棵有 V 个顶点、V − 1 条边的树，DFS 的时间是 O(V)；(b) 一次深度优先遍历足以访问无向图的所有顶点；(c) 在连通的无向图上，从任一顶点调用一次 DFSExplore 就能访问所有顶点；(d) DFS 访问顺序中相邻的两个顶点之间一定有边。</summary>
  <div class="qa__body">
<p>(a) <strong>错</strong>。矩阵版每个顶点都扫一整行，与边数无关，是 O(V²)；邻接表才是 O(V + E) = O(V)。</p>
<p>(b) <strong>错</strong>（2016 年真题）。图可能不连通，从一个起点只能走完它所在的分量，其余分量要靠外层循环。</p>
<p>(c) <strong>对</strong>。连通即每个顶点都有路径可达，DFSExplore 会全部访问到。</p>
<p>(d) <strong>错</strong>。回溯后的下一个顶点只和栈里某个较浅的顶点相邻。例：练习 1 的图从 A 开始，顺序是 A, B, C, E, D, F，E 和 D 之间没有边（D 是回溯到 A 后才访问的）。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">3. 利用上文的 dfs_explore 写函数 <code>int reachable(int n, int adj[][MAXV], int u, int v)</code>：u 能到达 v 返回 1，否则返回 0，并给出邻接矩阵上的最坏时间复杂度。</summary>
  <div class="qa__body">
<pre><code>int reachable(int n, int adj[][MAXV], int u, int v) {
    int visited[MAXV] = {0};
    int order[MAXV], cnt = 0;
    dfs_explore(n, adj, u, visited, order, &amp;cnt);  /* 只从 u 探索一次 */
    return visited[v];          /* v 被标记 ⇔ 存在 u 到 v 的路径 */
}</code></pre>
<p>关键是<strong>不要外层循环</strong>，否则所有顶点都会被标成 1，结果永远是“可达”。课上的图中 reachable(A, D) = 1，reachable(A, E) = 0。</p>
<p>最坏情况是 u 所在分量包含所有顶点，每个顶点扫一整行：<strong>O(V²)</strong>（邻接表为 O(V + E)）。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">4. 下面的函数把 BFS 的队列换成了栈，仍在压栈时标记。对图 A–B、A–C、A–D、B–D（A..D 编号 0..3）调用 traverse(4, adj, 0, order)，order 是什么？它是合法的 DFS 顺序吗？</summary>
  <div class="qa__body">
<pre><code>void traverse(int n, int adj[][MAXV], int s, int order[]) {
    int visited[MAXV] = {0}, stack[MAXV], top = 0, cnt = 0;
    visited[s] = 1;
    stack[top++] = s;
    while (top &gt; 0) {
        int v = stack[--top];
        order[cnt++] = v;
        for (int w = n - 1; w &gt;= 0; w--)
            if (adj[v][w] &amp;&amp; !visited[w]) {
                visited[w] = 1;             /* 压栈时就标记 */
                stack[top++] = w;
            }
    }
}</code></pre>
<p>弹出 A，输出 A，压入 D、C、B 并全部标记（栈 D C B）；弹出 B，邻居 A、D 都已标记，不压任何顶点；再依次弹出 C、D。order = <strong>A, B, C, D</strong>。</p>
<p>这<strong>不是</strong>合法的 DFS 顺序，无论邻居按什么顺序处理：访问 B 后，B 还有未访问的邻居 D，DFS 必须接着去 D，而 C 和 B 之间根本没有边。D 在 A 那一步就被“占住”，结果反倒成了 BFS 的顺序。按字母序的正确 DFS 是 <strong>A, B, D, C</strong>，改法见上文的 dfs_stack。</p>
  </div>
</details>
`;

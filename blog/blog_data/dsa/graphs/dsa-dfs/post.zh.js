/* Post body — dsa-dfs / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-dfs:zh'] = `
<p class="lead">深度优先搜索（Depth-First Search, DFS）遍历图的办法是：能往深处走就一直走，走进死胡同再退回上一个路口换条路。每个顶点恰好访问一次，邻接表 O(V + E)，邻接矩阵 O(V²)。</p>

<h2>从一个场景说起</h2>
<p>你拿铅笔走纸上的迷宫。到了岔路口，随便挑一条走下去，边走边画线。</p>
<p>走进死胡同（dead end）怎么办？顺着画过的线往回退，退到最近一个还有路没走过的岔路口，换一条接着走。</p>
<p>那条铅笔线干了两件事：告诉你哪里走过，不会绕圈；告诉你该往哪退。遍历一张图也要这两样：每个顶点都走到，又不在环里打转。</p>

<h2>它是什么</h2>
<p>简单说，DFS 就是：从一个顶点出发，<strong>只要还有没去过的邻居，就往那儿走；没有了，就退回上一个顶点</strong>。“深度优先”就是先往深处钻。往回退这一步叫回溯（backtrack）。</p>
<p>课上的写法由三部分组成：</p>
<ul>
  <li><strong>标记（mark）</strong>：每个顶点一个标记，0 = 没去过，1 = 去过。它就是那条铅笔线。</li>
  <li><strong>DFSExplore(v)</strong>：先把 v 标成 1，再对每个标记还是 0 的邻居 w 调用 DFSExplore(w)。调用自己 = 往深处走一步；函数返回 = 退回一步，所以回溯不用另外写。</li>
  <li><strong>外层循环 DFS(G)</strong>：一次 DFSExplore(s) 只能走到和 s 连通的顶点。图可能分成互不相连的几块（非连通图，disconnected graph），所以要把每个顶点检查一遍，还是 0 的就从它重新出发。每出发一次，走完一个连通分量（connected component）。</li>
</ul>
<pre><code class="lang-text">DFS(G):
    mark each vertex in V with 0          // 0 = 未访问
    for each vertex v in V:
        if v is marked with 0:
            DFSExplore(v)

DFSExplore(v):
    mark v with 1                         // 1 = 已访问
    for each vertex w adjacent to v:
        if w is marked with 0:
            DFSExplore(w)</code></pre>
<p>关键在于<strong>递归之前先检查标记</strong>，而 DFSExplore 第一件事就是标 1，所以<strong>每个顶点恰好被访问一次</strong>，有环也不会绕圈。顶点被标 1 的先后就是 <strong>DFS 顺序</strong>。</p>
<p>那程序怎么记住该退回哪里？靠调用栈（call stack）。它像一摞书：每调用一次 DFSExplore 就往上放一本，函数返回就拿走最上面那本。<strong>栈里从底到顶的顶点，正好是从起点走到当前顶点的那条路</strong>，也就是迷宫里的铅笔线。</p>

<h2>看个例子</h2>
<p>课上的图：边 A–C、B–C、B–D、C–D，E 没有边。邻居按字母序处理。</p>
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
<tr><td>1</td><td>外层循环：A 是 0 → DFSExplore(A)，标记 A</td><td>A</td><td>A</td></tr>
<tr><td>2</td><td>A 的邻居 C 是 0 → 进 C（A 没结束，留在栈里）</td><td>A C</td><td>A C</td></tr>
<tr><td>3</td><td>C 的邻居 A 是 1，跳过；B 是 0 → 进 B</td><td>A C B</td><td>A C B</td></tr>
<tr><td>4</td><td>B 的邻居 C 是 1，跳过；D 是 0 → 进 D</td><td>A C B D</td><td>A C B D</td></tr>
<tr><td>5</td><td>D 的邻居 B、C 都是 1 → D 结束，退回 B</td><td>A C B</td><td>A C B D</td></tr>
<tr><td>6</td><td>B 的邻居看完 → B 结束，退回 C</td><td>A C</td><td>A C B D</td></tr>
<tr><td>7</td><td>C 的最后一个邻居 D 已是 1 → C 结束</td><td>A</td><td>A C B D</td></tr>
<tr><td>8</td><td>A 的邻居看完 → A 结束，回到外层循环</td><td>（空）</td><td>A C B D</td></tr>
<tr><td>9</td><td>外层循环：B、C、D 是 1，跳过；E 是 0 → DFSExplore(E)</td><td>E</td><td>A C B D E</td></tr>
<tr><td>10</td><td>E 没有邻居 → E 结束，外层循环也结束</td><td>（空）</td><td>A C B D E</td></tr>
</tbody>
</table>
<p>结果：<strong>访问顺序 A, C, B, D, E</strong>。有几个地方值得看：</p>
<ul>
  <li>D 是从 B 走到的，不是从 C：C 先看到 B 就钻了进去，等退回 C，D 已经是 1 了。这就是“先走到底”。</li>
  <li>最深时栈是 A C B D，正好是路径 A → C → B → D。</li>
  <li>E 只能靠外层循环走到。外层循环出发 2 次（A、E），对应 2 个连通分量。</li>
  <li>调用<strong>结束</strong>的顺序是 D, B, C, A, E，7.8 拓扑排序会用到它。</li>
</ul>
<iframe class="anim-frame" src="blog/blog_data/dsa-dfs/anims/dfs.html" loading="lazy" style="height: 540px;" title="DFS 逐步演示"></iframe>
<p class="anim-caption">点“下一步”逐帧看递归：橙色是栈顶，蓝色是还在栈里的顶点，绿色是已结束的调用。“对照 BFS 的图”可以和 7.4 比一比。</p>
<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/Urx87-NMm6c" title="Depth-first search in 4 minutes" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Michael Sambol《Depth-first search in 4 minutes》（英文，约 4 分钟），在一张小图上演示走到底再回溯。视频里邻居的处理顺序可能和本课不同，考试按题目规定的顺序走。</p>

<h2>复杂度：每个顶点一次，每条边两次</h2>
<p>DFSExplore 对每个顶点<strong>恰好调用一次</strong>，共 V 次。每次都要把 v 的邻居列一遍，花多少取决于图怎么存（见 7.2）：</p>
<ul>
  <li><strong>邻接表</strong>：沿 v 的链表走，deg(v) 步。加起来 ∑ deg(v) = 2E，因为无向图每条边两头各看一次（A–C 在探索 A、探索 C 时各看一次）。再加上 V 次标记，总共 <strong>O(V + E)</strong>。</li>
  <li><strong>邻接矩阵</strong>：不管有几个邻居，都要扫完 v 那一整行 V 格，V 个顶点就是 <strong>O(V²)</strong>。</li>
</ul>
<p>V 不能省：边再少，每个顶点也要被标记、被外层循环检查。有向图只沿出边走，复杂度不变。</p>

<h2>写成 C（邻接矩阵）</h2>
<p>考试手写用邻接矩阵最省事：按下标扫一行，邻居自然是字母序。</p>
<pre><code>#define MAXV 26

void dfs_explore(int n, int adj[][MAXV], int v, int visited[]) {
    visited[v] = 1;
    printf("%c ", 'A' + v);
    for (int w = 0; w &lt; n; w++)
        if (adj[v][w] &amp;&amp; !visited[w])
            dfs_explore(n, adj, w, visited);
}

int dfs(int n, int adj[][MAXV]) {
    int visited[MAXV] = {0};
    int components = 0;
    for (int v = 0; v &lt; n; v++)
        if (!visited[v]) {
            components++;
            dfs_explore(n, adj, v, visited);
        }
    return components;
}</code></pre>
<ul>
  <li><code>visited[v] = 1</code>：一进来先标记；<code>printf</code> 就是“访问”，打印 v 的字母（0 → A，1 → B……）。</li>
  <li><code>for</code> 循环扫第 v 行：<code>adj[v][w]</code> 为 1 说明 w 是邻居，<code>!visited[w]</code> 说明还没去过，两个都满足才递归进去。</li>
  <li><code>dfs</code> 里 <code>visited</code> 先全清 0；外层 for 每从一个新顶点出发，<code>components</code> 加 1，最后返回连通分量个数。</li>
</ul>
<p>课上的图（A..E 编号 0..4，每条无向边填 <code>adj[u][v]</code> 和 <code>adj[v][u]</code> 两格）调用 <code>dfs(5, adj)</code>，打印 A C B D E，返回 2。换成邻接表，把 for 循环改成沿 v 的链表走就行，时间变成 O(V + E)；这时<strong>链表里结点的顺序决定访问顺序</strong>，不一定是字母序。</p>

<h3>补充：用显式栈代替递归</h3>
<p>递归最深可能有 V 层（图是一条长链时），图很大会把调用栈撑爆。这时可以自己用一个栈（stack，后进先出 LIFO）记进度：</p>
<ol>
  <li>把起点压栈。</li>
  <li>弹出一个顶点，访问过就跳过；否则标记、访问它，再把它没访问的邻居<strong>倒序</strong>压栈，让字母序最小的先弹出。</li>
  <li>重复第 2 步直到栈空。</li>
</ol>
<p>课上的图从 A 开始：</p>
<pre><code class="lang-text">操作                          栈（底 → 顶）   访问顺序
压入 A                        A
弹出 A：访问，压入 C            C               A
弹出 C：访问，倒序压入 D、B      D B             A C
弹出 B：访问，压入 D            D D             A C B
弹出 D：访问，邻居都已访问       D               A C B D
弹出 D：已访问，跳过            （空）           A C B D</code></pre>
<p>外层循环再处理 E，结果同样是 A, C, B, D, E，复杂度也不变。</p>
<div class="callout warn" data-label="易错">
<p>D 被压了两次，所以要<strong>出栈时才标记</strong>，并跳过已访问的顶点。别照搬 BFS 的“入队就标记”（见 7.4）：图 A–B、A–C、A–D、B–D 从 A 出发，压栈即标记会得到 A, B, C, D，而正确的 DFS 是 A, B, D, C（访问 B 后该接着去它的邻居 D）。</p>
</div>

<h2>DFS 能做什么，不能做什么</h2>
<p>能做的，都是在 DFS 上改一两行（有向、无向、带权、无权都能用，权重直接忽略）：</p>
<ul>
  <li><strong>可达性（reachability）</strong>：u 能不能走到 v？只调用一次 DFSExplore(u)，<strong>不要外层循环</strong>，结束后看 v 是不是 1。</li>
  <li><strong>连通分量</strong>：外层循环出发几次，就有几个分量（上面的 <code>components</code>）。</li>
  <li><strong>判环（cycle detection）</strong>：无向图里，探索 v 时碰到一个已经是 1、又不是“来时那个顶点”的邻居，就有环。课上的图里探索 D（从 B 来）时看到 C 已是 1，这就是环 C–B–D–C。详见 7.9。</li>
</ul>
<p>不能做的有两件：</p>
<ul>
  <li><strong>DFS 不保证找到最短路径。</strong>课上的反例：三角形 A、B、C 两两相连，从 A 出发，DFS 先到 B 再到 C，走了 A–B–C 两条边，可 A–C 一条边就到了。</li>
  <li><strong>DFS 不是逐层（level by level）访问</strong>，那是 BFS。复习课的找路算法表里，DFS 不是最优（not optimal）的。</li>
</ul>

<h2>考试怎么考</h2>
<ul>
  <li><strong>手算追踪</strong>：给图和起点，写 DFS 访问顺序，有时还问某一刻的调用栈或最大递归深度。说按字母序就严格按字母序；给了邻接表就按表里的顺序；没规定时，任何合法的 DFS 顺序都给分。</li>
  <li><strong>复杂度</strong>：<strong>不在公式表上</strong>，要会用“V 次调用 × 每次列邻居的代价”推出来。</li>
  <li><strong>判断题</strong>：见例题 2。</li>
  <li><strong>代码题</strong>：写递归 DFS，或做小改动（数连通分量、判断可达、判环），或改成显式栈。</li>
</ul>

<h3>例题 1：手算 DFS 顺序</h3>
<p>题目：图的边是 A–B、A–C、A–D、B–C、B–E、C–E、D–F（就是 7.4 BFS 用的图）。调用 DFSExplore(E)，邻居按字母序。写出访问顺序，以及 F 被访问那一刻的调用栈。</p>
<p>先写邻接表：A: B, C, D；B: A, C, E；C: A, B, E；D: A, F；E: B, C；F: D。然后一步步走：</p>
<ol>
  <li>访问 E。E 的第一个邻居 B 是 0 → 进 B；B 的第一个邻居 A 是 0 → 进 A。</li>
  <li>A 的邻居 B 是 1，跳过；C 是 0 → 进 C。C 的邻居 A、B、E 都是 1 → C 结束，退回 A。</li>
  <li>A 的下一个邻居 D 是 0 → 进 D。D 的邻居 A 是 1，F 是 0 → 进 F。</li>
  <li>F 的邻居 D 是 1 → F 结束；D、A 依次结束；B 剩下的 C、E 都是 1 → B 结束；E 剩下的 C 是 1 → E 结束。</li>
</ol>
<p>答案：<strong>访问顺序 E, B, A, C, D, F</strong>。F 被访问时，调用栈（底 → 顶）是 <strong>E, B, A, D, F</strong>，C 已经结束出栈了。这也是最大递归深度 5。</p>
<p>对比 BFS 从 E 出发是 E, B, C, A, D, F：C 是 E 的直接邻居，BFS 第一层就访问它，DFS 却绕了一圈才到。</p>

<h3>例题 2：判断对错</h3>
<ul>
  <li>(a) DFS 总能找到最短路径。<strong>错</strong>，见三角形反例。</li>
  <li>(b) 一次深度优先遍历就足以访问无向图的所有顶点（2016 年真题）。<strong>错</strong>：图可能不连通，一个起点只能走完它所在的分量，其余的靠外层循环。题目说图连通时才对。</li>
  <li>(c) 用邻接矩阵存一棵 V 个顶点、V − 1 条边的树，DFS 是 O(V)。<strong>错</strong>：矩阵版每个顶点都扫一整行，与边数无关，是 O(V²)；邻接表才是 O(V)。</li>
  <li>(d) DFS 访问顺序里相邻的两个顶点之间一定有边。<strong>错</strong>：例题 1 里 C 后面是 D，可 C 和 D 之间没有边，D 是退回 A 之后才走到的。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>① 漏了外层循环，非连通图只访问一部分。② 递归前不检查标记，有环就无限递归。③ 用矩阵却写 O(V + E)，或把 O(V + E) 写成 O(E)。④ 邻接表里的顺序不一定是字母序。⑤ 显式栈版在压栈时就标记。</p>
</div>

<h2>小结</h2>
<ul>
  <li>DFS：能往深处走就走，走不动就回溯。回溯就是函数返回，调用栈就是当前走的路。</li>
  <li>递归前先检查标记 → 每个顶点恰好访问一次；外层循环 → 非连通图也全部访问，出发次数 = 连通分量个数。</li>
  <li>复杂度：<strong>邻接表 O(V + E)，邻接矩阵 O(V²)</strong>，要会推。</li>
  <li>显式栈版：倒序压栈，<strong>出栈时才标记</strong>。</li>
  <li>DFS 不保证最短路径，也不是逐层访问。</li>
</ul>
`;

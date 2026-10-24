/* Post body — dsa-graph-modelling / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-graph-modelling:zh'] = `
<p class="lead">图建模（graph modelling）就是把问题翻译成顶点、边和边权，再交给学过的图算法。课上三个例子：倒水谜题（BFS）、无向图判环（改 DFS）、货币套利（负权环 + Floyd-Warshall）。</p>

<h2>从一个场景说起</h2>
<p>厨房里有三个没有刻度的壶：8 L、5 L、3 L。8 L 壶装满了水，另外两个是空的。你只能把一个壶的水倒进另一个，倒到前一个空了、或者后一个满了为止。怎样量出正好 4 L？最少倒几次？</p>
<p>看起来是道智力题。换个角度：把“三个壶里各有多少水”记成一个点，每倒一次水就从一个点走到另一个点。“最少倒几次”就成了“从起点到目标最少走几条边”，这正是 BFS 做的事。</p>

<h2>它是什么</h2>
<p>简单说，图建模就是先把问题翻译成图，再套现成的算法。翻译时说清四件事：</p>
<ul>
<li><strong>顶点</strong>：城市、货币，还是“某一时刻的状态”。倒水里是三个壶的水量 (x, y, z)。</li>
<li><strong>边，有没有方向</strong>：倒水里一条边是倒一次水，有向，因为倒过去不一定倒得回来。</li>
<li><strong>边权</strong>：倒水只数次数，不带权。边权会不会是负数，决定能用哪些算法。</li>
<li><strong>算法及其前提</strong>：最少步数用 BFS，判环用 DFS，找负权环用 Floyd-Warshall；用 Dijkstra 得说明边权非负。</li>
</ul>

<h2>看个例子 1：倒水问题</h2>
<p>起点 (8, 0, 0)，目标是任何一个壶里有 4 L 的状态。每次倒出的量 = min(倒出壶里的水, 接水壶剩的空间)。从起点只有两种倒法：8→5 得 (3, 5, 0)，8→3 得 (5, 0, 3)。从 (3, 5, 0) 有三种：8→3 得 (0, 5, 3)，5→8 回到 (8, 0, 0)，5→3 得 (3, 2, 3)。</p>
<p>这张图从没完整存下来过：事先不知道有多少状态，也不建邻接矩阵或邻接表，BFS 取出一个状态时才现算它能到哪些状态。这种边搜边生成的图叫<strong>隐式图（implicit graph）</strong>；顶点和边事先存在内存里的叫<strong>显式图（explicit graph）</strong>。</p>
<p>BFS 照常用 FIFO 队列，入队时标记 visited。<strong>visited 不能省</strong>：5→8 会倒回起点，不记就会兜圈子。水总量恒为 8 L，状态由后两个壶决定，最多 6 × 4 = 24 种，visited 开 6 × 4 的数组就够。</p>
<iframe class="anim-frame" src="blog/blog_data/dsa-graph-modelling/anims/water-jug-bfs.html" loading="lazy" style="height: 500px;" title="倒水问题的 BFS"></iframe>
<p class="anim-caption">点“下一步”逐帧看：每一列是倒水次数，红色弯线表示倒回了已访问的状态，最后一帧绿色是回溯出的路径。</p>
<p>结果：<strong>最少 6 次</strong>，(8,0,0) → (3,5,0) → (3,2,3) → (6,2,0) → (6,0,2) → (1,5,2) → (1,4,3)，最后 5 L 壶里正好 4 L。</p>
<p>为什么是最少？BFS 一层层往外扩，第 k 层就是倒 k 次才能到的新状态。目标第一次出现在第 6 层，说明 5 次以内都到不了。</p>

<h2>看个例子 2：改 DFS 判断无向图有没有环</h2>
<p>题目：修改 DFS，让它在无向图有<strong>环（cycle）</strong>时返回 true，否则返回 false。环就是从一个顶点出发，不重复走同一条边，又回到出发点。</p>
<p>课上的图：边 A–C、A–D、B–C、C–D。A–C–D–A 是环；B–C–B 不算，来回走的是同一条边。</p>
<figure class="fig">
<svg viewBox="0 0 420 220" width="420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="DFS 判环：树边与发现环的边">
<line x1="68" y1="60" x2="192" y2="60" stroke="#4ade80" stroke-width="3"/>
<line x1="228" y1="60" x2="352" y2="60" stroke="#4ade80" stroke-width="3"/>
<line x1="199.4" y1="74.6" x2="140.6" y2="155.4" stroke="#4ade80" stroke-width="3"/>
<line x1="60.6" y1="74.6" x2="119.4" y2="155.4" stroke="#f87171" stroke-width="2.5" stroke-dasharray="6 4"/>
<text x="76" y="128" text-anchor="end" font-size="13" font-weight="700" fill="#f87171">发现环</text>
<circle cx="50" cy="60" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="50" y="60" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">A</text>
<text x="50" y="30" text-anchor="middle" font-size="13" font-weight="700" fill="#d97757">1</text>
<circle cx="210" cy="60" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="210" y="60" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">C</text>
<text x="210" y="30" text-anchor="middle" font-size="13" font-weight="700" fill="#d97757">2</text>
<circle cx="370" cy="60" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="370" y="60" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">B</text>
<text x="370" y="30" text-anchor="middle" font-size="13" font-weight="700" fill="#d97757">3</text>
<circle cx="130" cy="170" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="130" y="170" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">D</text>
<text x="130" y="208" text-anchor="middle" font-size="13" font-weight="700" fill="#d97757">4</text>
</svg>
<figcaption>数字 = 访问顺序（邻居按字母序）；绿色 = DFS 走过的边；红色虚线 = 发现环的边 D–A</figcaption>
</figure>
<p>最直接的想法是“碰到已访问的邻居就报环”。这不行：无向边两头各存一份，从 A 走到 C 后，C 的邻居里就有已访问的 A。这就像走进房间回头看见刚进来的门，不说明有别的路绕回来。</p>
<p>办法是递归时多带一个参数 <code>parent</code>，记住“我从哪个顶点走过来”。对当前顶点 v 的每个邻居 w：</p>
<ul>
<li>w 没访问过：递归 explore(w, v)，往深处走；</li>
<li>w 访问过，而且 <strong>w ≠ parent</strong>：之前从另一条路到过 w，边 v–w 把两条路接成一圈，<strong>有环</strong>；</li>
<li>w 访问过，但 w = parent：就是来时那条边，忽略。</li>
</ul>
<p>在课上的图上从 A 开始（邻居按字母序）：</p>
<table>
<thead><tr><th>调用</th><th>检查的邻居</th><th>结果</th></tr></thead>
<tbody>
<tr><td>explore(A, −)</td><td>C 未访问</td><td>递归</td></tr>
<tr><td>explore(C, A)</td><td>A = parent，忽略；B 未访问</td><td>递归</td></tr>
<tr><td>explore(B, C)</td><td>C = parent，忽略</td><td>返回 false，回到 C</td></tr>
<tr><td>explore(C, A)（续）</td><td>D 未访问</td><td>递归</td></tr>
<tr><td>explore(D, C)</td><td><strong>A 已访问且 A ≠ C</strong></td><td>返回 true，逐层传回</td></tr>
</tbody>
</table>
<p>写成 C（邻接矩阵，顶点编号 0 到 n − 1）：</p>
<pre><code>#define MAXV 26

/* 有环返回 1；parent = 走到 v 之前所在的顶点，起点传 -1 */
int explore(int n, int adj[MAXV][MAXV], int visited[], int v, int parent) {
    visited[v] = 1;
    for (int w = 0; w &lt; n; w++) {
        if (!adj[v][w]) continue;                 /* 不是邻居 */
        if (!visited[w]) {
            if (explore(n, adj, visited, w, v)) return 1;
        } else if (w != parent) {
            return 1;                             /* 已访问又不是来时的顶点 */
        }
    }
    return 0;
}

int has_cycle(int n, int adj[MAXV][MAXV]) {
    int visited[MAXV] = {0};
    for (int v = 0; v &lt; n; v++)                   /* 图可能不连通，每块都查 */
        if (!visited[v] &amp;&amp; explore(n, adj, visited, v, -1)) return 1;
    return 0;
}</code></pre>
<ul>
<li><strong>第 5–7 行</strong>：同普通 DFS，标记 v，扫第 v 行找邻居。</li>
<li><strong>第 8–9 行</strong>：没访问过的邻居，把 v 当作它的 parent 递归下去；下层返回 1，这层立刻返回 1。</li>
<li><strong>第 10–11 行</strong>：访问过又不是 parent，有环。w 等于 parent 时两个分支都不进，来时的边就被忽略了。</li>
<li><strong>第 17–21 行</strong>：对每个没访问的顶点启动一次，parent 传 −1。漏了这层，不连通的图只查了一块。</li>
</ul>
<p>复杂度和 DFS 一样：邻接表 <strong>O(V + E)</strong>，邻接矩阵 <strong>O(V²)</strong>。BFS 版见“考试怎么考”的例题 1。</p>
<div class="callout warn" data-label="易错">
<p>parent 规则<strong>只适用于无向图</strong>。有向图 A→B、A→C、C→B 没有环，照搬却会误报：A 先走完 B，再走到 C，C 指向已访问的 B，B ≠ parent，于是报环。有向图要看 w 是否<strong>还在当前递归栈上</strong>，或用拓扑排序（7.8）。</p>
</div>

<h2>看个例子 3：货币套利</h2>
<p>课上的汇率：1 澳元（AUD）换 4.67 人民币（CNY），1 人民币换 0.133 欧元（EUR），1 欧元换 1.62 澳元。拿 1 澳元转一圈：4.67 × 0.133 × 1.62 ≈ 1.0062 澳元，白赚 0.62%。这种换一圈就赚钱的机会叫<strong>套利（arbitrage）</strong>。</p>
<h3>建模</h3>
<p>给定 n × n 矩阵 R，R[i][j] 是 1 单位货币 i 能换到多少货币 j。顶点 = 货币，有向边 i → j 带汇率 R[i][j]。必须有向：澳元换欧元和欧元换澳元是两个价。要找的是沿途汇率<strong>乘积 &gt; 1</strong> 的环。</p>
<p>麻烦在于，学过的路径算法都把边权<strong>加</strong>起来，没有乘的。两步变过去：取对数，乘变加（log(ab) = log a + log b）；再取负，“&gt; 0”变成“&lt; 0”。</p>
<pre><code class="lang-text">R[i₁][i₂] × … × R[iₖ][i₁] &gt; 1
⇔   log R[i₁][i₂] + … + log R[iₖ][i₁] &gt; 0
⇔  (−log R[i₁][i₂]) + … + (−log R[iₖ][i₁]) &lt; 0</code></pre>
<p>所以令边权 <strong>w(i, j) = −log R[i][j]</strong>，就有：<strong>有套利 ⇔ 图里有负权环（negative-weight cycle）</strong>。代回课上的三个汇率（用 ln，底数不影响正负）：</p>
<pre><code class="lang-text">w(AUD→CNY) = −ln 4.67  = −1.5412
w(CNY→EUR) = −ln 0.133 =  2.0174
w(EUR→AUD) = −ln 1.62  = −0.4824
一圈之和                = −0.0062 &lt; 0   （= −ln 1.0062）</code></pre>
<h3>用 Floyd-Warshall 找负环</h3>
<p>Floyd-Warshall 平时要求没有负权环，这里反过来用它找负环：跑完看对角线，<strong>某个 D[i][i] &lt; 0，就是从 i 绕一圈回到 i 总权重为负，即有套利</strong>。R[i][i] = 1，−log 1 = 0，对角线初值正好是 0。</p>
<pre><code class="lang-text">HasArbitrage(R[0..n-1][0..n-1]):
    for each i, j: D[i][j] = −log R[i][j]   // 不能直接兑换（R = 0）则为 ∞
    FloydWarshall(D)                         // k 在最外层，见 7.6
    for i = 0 to n-1:
        if D[i][i] &lt; 0: return true
    return false</code></pre>
<p>课上的例子跑完，三种货币的 D[i][i] 都是负数。有负环时 D 里其他数已不是真正的最短距离（绕圈能无限变小），<strong>只看对角线</strong>；浮点有误差，程序里宜写 D[i][i] &lt; −ε。复杂度 <strong>Θ(n³)</strong>。不能用 Dijkstra：汇率大于 1 的边权重是负的。</p>

<h2>补充：隐式图上用哪种搜索</h2>
<p>在隐式图上从起点找到目标，课上最后的总结表：</p>
<table>
<thead><tr><th>算法</th><th>容器</th><th>找到的路最优吗</th></tr></thead>
<tbody>
<tr><td>BFS</td><td>FIFO 队列</td><td><strong>有条件</strong>：每个动作代价相同</td></tr>
<tr><td>DFS</td><td>栈 / 递归</td><td><strong>否</strong>（倒水 DFS 的解要 9 次）</td></tr>
<tr><td>一致代价搜索（uniform-cost search, UCS）</td><td>按已花代价排序的优先队列</td><td><strong>是</strong>（代价非负）</td></tr>
<tr><td>IW（作业 3）</td><td>—</td><td>有条件最优；细节不考</td></tr>
</tbody>
</table>
<p>动作代价不同时（比如按倒出的升数算），步数最少不等于代价最小，要用 UCS。它就是用在隐式图上的 Dijkstra，等目标<strong>出队</strong>才停，那时代价才确定。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>算法设计长题</strong>：给场景，要你建图、选算法（课上说最接近第 11 周 workshop 练习 6）。按顶点、边、边权、算法及其前提、复杂度的顺序写。</li>
<li><strong>改写 DFS / BFS</strong>：写 C 或伪代码，BFS 判环被点名可能考。别漏外层循环和递归返回值。</li>
<li><strong>套利</strong>：“取 −log”和“Floyd-Warshall 后看对角线”要背，公式表上只有对数恒等式。</li>
<li><strong>判断题</strong>：BFS 总能找到最优解（错）；DFS 能找最少步数（错）；parent 规则可直接用于有向图（错）；有负环时 Floyd-Warshall 给出正确最短路（错，但能检测负环）。</li>
</ul>

<h3>例题 1：用 BFS 判环</h3>
<p>题目：用 BFS 判断无向图有没有环，在课上的图上从 A 开始追踪，说出在哪一步发现环。</p>
<p>思路同 DFS 版。BFS 没有递归参数可传，就用数组 <code>parent[w]</code> 记下“w 是被谁发现的”。核心循环：</p>
<pre><code>while (head &lt; tail) {
    int u = queue[head++];
    for (int w = 0; w &lt; n; w++) {
        if (!adj[u][w]) continue;
        if (!visited[w]) {
            visited[w] = 1;               /* 入队时标记 */
            parent[w] = u;                /* w 是被 u 发现的 */
            queue[tail++] = w;
        } else if (w != parent[u]) {
            return 1;                     /* 已访问又不是 u 的父亲：有环 */
        }
    }
}</code></pre>
<p>外面同样套一层循环：对每个没访问的顶点 s，令 visited[s] = 1、parent[s] = −1，入队，再跑上面的循环。追踪（邻居按字母序）：</p>
<ol>
<li>A 标记、入队，parent[A] = −1。队列 [A]。</li>
<li>取出 A：C、D 都没访问，标记，parent 设为 A，入队。队列 [C, D]。</li>
<li>取出 C：A 是 parent[C]，忽略；B 没访问，parent[B] = C，入队，队列 [D, B]；再看 D，D 已访问且 <strong>D ≠ parent[C] = A</strong>，返回 1。</li>
</ol>
<p>答：在边 C–D 上发现环 A–C–D–A（DFS 是在边 D–A 上）。复杂度同 BFS：矩阵 O(V²)，邻接表 O(V + E)。</p>

<h3>例题 2：两种货币的套利</h3>
<p>题目：1 X 换 0.5 Y，1 Y 换 2.1 X。用 Floyd-Warshall 判断有没有套利；边权取 +ln R 行不行；为什么不用 Dijkstra。</p>
<p>边权 w(X, Y) = −ln 0.5 = 0.6931，w(Y, X) = −ln 2.1 = −0.7419，对角线 0。k = X 时，D[Y][Y] = D[Y][X] + D[X][Y] = −0.7419 + 0.6931 = −0.0488 &lt; 0，<strong>有套利</strong>：1 Y → 2.1 X → 1.05 Y，赚 5%（−0.0488 = −ln 1.05）。</p>
<p>取 +ln 不行：赚钱的环权重和 &gt; 0，Floyd-Warshall 只取更小的值，正权环不会让距离变小，找不到。</p>
<p>不用 Dijkstra：Y → X 的汇率 2.1 &gt; 1，权重为负，而 Dijkstra 要求边权非负，也不检测负环。</p>
<div class="callout warn" data-label="易错">
<p>① 用 log 而不是 −log。② 判环忘了排除 parent。③ 隐式图 BFS 不记 visited，在旧状态间打转。</p>
</div>

<h2>小结</h2>
<ul>
<li>建模说清四件事：顶点、边（方向）、边权、算法及其前提。</li>
<li>无向图判环：DFS 带上 parent，碰到“已访问且不是 parent”的邻居就有环；BFS 版用 parent[] 数组。不能用于有向图。</li>
<li>套利：w = −log R，<strong>有套利 ⇔ 负权环</strong>；Floyd-Warshall 后看 D[i][i] &lt; 0，Θ(n³)。</li>
<li>隐式图：状态是顶点、动作是边，边搜边生成；BFS + visited 求最少步数（倒水 6 次）。</li>
<li>BFS 只在代价相同时最优，DFS 不保证，代价不同用 UCS（即 Dijkstra）。</li>
</ul>
`;

/* Post body — dsa-graph-modelling / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-graph-modelling:zh'] = `
<p class="lead">图建模（graph modelling）：说清顶点、边、边权各是什么，把问题变成图，再套用学过的算法。课上三例：改 DFS 判断无向图有没有环；把货币套利变成负权环交给 Floyd-Warshall；把倒水谜题看成隐式图，用 BFS 求最少步数。</p>

<h2>无向图判环：DFS 记住来时的顶点</h2>
<p>题目：修改 DFS，使它在无向图含环（cycle）时返回 true，否则返回 false。环：从某顶点出发、不重复用边、回到出发点的路径。</p>
<p>课上的例子：边 A–C、A–D、B–C、C–D。A–C–D–A 是环；B–C–B 不算，来回用的是同一条边。</p>
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
<p>只加“碰到已访问的邻居就报环”不行：无向边存了两份，从 A 走到 C 后，C 的邻居 A 已访问，但那只是来时的边。所以递归时多传一个参数 <code>parent</code>（走到当前顶点之前所在的顶点），对当前顶点 v 的每个邻居 w：</p>
<ul>
  <li>w 未访问：调用 <code>explore(w, v)</code> 继续深入；</li>
  <li>w 已访问且 <strong>w ≠ parent</strong>：之前已沿另一条路到过 w，边 v–w 把两条路接成一圈，<strong>有环</strong>；</li>
  <li>w 已访问且 w = parent：来时的边，忽略。</li>
</ul>
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
<p>访问顺序 A, C, B, D，检查边 D–A 时发现环。C 实现（邻接矩阵，顶点编号 0..n−1）：</p>
<pre><code>#define MAXV 26

/* adj[v][w] = 1 表示有无向边 v–w（矩阵对称）。
   从 v 开始 DFS，parent = 走到 v 之前所在的顶点（没有则为 -1）。
   发现环返回 1，否则返回 0 */
int explore(int n, int adj[MAXV][MAXV], int visited[], int v, int parent) {
    visited[v] = 1;
    for (int w = 0; w &lt; n; w++) {
        if (!adj[v][w]) {
            continue;                     /* w 不是邻居 */
        }
        if (!visited[w]) {
            if (explore(n, adj, visited, w, v)) {
                return 1;                 /* 下层发现了环，立刻往上传 */
            }
        } else if (w != parent) {
            return 1;                     /* 已访问又不是来时的顶点：成环 */
        }
    }
    return 0;
}

int has_cycle(int n, int adj[MAXV][MAXV]) {
    int visited[MAXV] = {0};
    for (int v = 0; v &lt; n; v++) {         /* 不连通的图：每个分量都要查 */
        if (!visited[v] &amp;&amp; explore(n, adj, visited, v, -1)) {
            return 1;
        }
    }
    return 0;
}</code></pre>
<p>第一次调用没有真正的来时顶点，传 −1（传任意不存在的顶点都行）。递归返回 1 要立刻往上返回，循环走完都没发现才返回 0。复杂度与 DFS 相同：邻接表 <strong>O(V + E)</strong>，邻接矩阵 <strong>O(V²)</strong>。</p>
<p><strong>BFS 也能做</strong>，课上留作思考题并说可能出成考题：数组 <code>parent[]</code> 记下每个顶点是被谁发现（入队）的；取出 u 后，若邻居 w 已访问且 w ≠ parent[u]，就有环。代码见练习 1。</p>
<div class="callout warn" data-label="易错">
<p>parent 规则只适用于<strong>无向图</strong>。有向图里“已访问且不是 parent”不代表有环（练习 2），要看 w 是否<strong>还在当前递归栈上</strong>；或者跑拓扑排序的 source removal，输出的顶点不足 V 个就说明有环（见 7.8 拓扑排序）。</p>
</div>

<h2>货币套利：乘积变成负权环</h2>
<p>课上的例子：1 澳元（AUD）换 4.67 人民币（CNY），1 人民币换 0.133 欧元（EUR），1 欧元换 1.62 澳元。转一圈得到 4.67 × 0.133 × 1.62 ≈ 1.0062 澳元，多出 0.62%，这叫套利（arbitrage）。</p>
<p>问题：n 种货币，n × n 矩阵 R，R[i][j] 是 1 单位货币 i 能换到的货币 j 的数量。判断能否从某种货币出发、换一圈回来钱变多。</p>
<h3>建模</h3>
<p>顶点 = 货币，有向边 i → j 带汇率 R[i][j]。必须有向：澳元换欧元可能是 0.6，欧元换回澳元可能是 1.5，乘起来不一定是 1。要找的是一个环 i₁ → i₂ → … → iₖ → i₁，使沿途汇率的乘积 &gt; 1。</p>
<p>学过的路径算法都把边权<strong>相加</strong>，没有相乘的。取对数（log(ab) = log a + log b）把乘积变成和，再整体取负：</p>
<pre><code class="lang-text">R[i₁][i₂] × … × R[iₖ][i₁] &gt; 1
⇔   log R[i₁][i₂] + … + log R[iₖ][i₁] &gt; 0
⇔  (−log R[i₁][i₂]) + … + (−log R[iₖ][i₁]) &lt; 0</code></pre>
<p>所以令边权 <strong>w(i, j) = −log R[i][j]</strong>，<strong>有套利 ⇔ 图中有负权环（negative-weight cycle）</strong>。Floyd-Warshall 本来要求没有负环，这里反过来用：跑完后检查对角线，<strong>某个 D[i][i] &lt; 0，说明从 i 出发能绕回 i 且总权重为负，即存在套利</strong>。R[i][i] = 1 时 −log 1 = 0，对角线初值正好是 Floyd-Warshall 需要的 0。</p>
<pre><code class="lang-text">HasArbitrage(R[0..n-1][0..n-1]):
    for each i, j: D[i][j] = −log R[i][j]   // 不能直接兑换（R = 0）则为 ∞
    FloydWarshall(D)                         // k 在最外层，见 7.6
    for i = 0 to n-1:
        if D[i][i] &lt; 0: return true          // 从 i 绕回 i 总权重为负
    return false</code></pre>
<p>复杂度 Θ(n²) + Θ(n³) = <strong>Θ(n³)</strong>。不能换成 Dijkstra：汇率大于 1 的边权重为负。单源检测负环用 Bellman-Ford（细节不考）。</p>

<h3>手算一遍</h3>
<p>在课上那三个汇率之外补上反方向的汇率（行 = 从，列 = 到）：</p>
<table>
<thead><tr><th>R</th><th>AUD</th><th>CNY</th><th>EUR</th></tr></thead>
<tbody>
<tr><td>AUD</td><td>1</td><td>4.67</td><td>0.60</td></tr>
<tr><td>CNY</td><td>0.21</td><td>1</td><td>0.133</td></tr>
<tr><td>EUR</td><td>1.62</td><td>7.40</td><td>1</td></tr>
</tbody>
</table>
<p>两两往返都亏：4.67 × 0.21 = 0.9807，0.60 × 1.62 = 0.972，0.133 × 7.40 = 0.9842。取 w = −ln R（底数不影响正负，保留 4 位小数）：</p>
<table>
<thead><tr><th>W</th><th>AUD</th><th>CNY</th><th>EUR</th></tr></thead>
<tbody>
<tr><td>AUD</td><td>0</td><td>−1.5412</td><td>0.5108</td></tr>
<tr><td>CNY</td><td>1.5606</td><td>0</td><td>2.0174</td></tr>
<tr><td>EUR</td><td>−0.4824</td><td>−2.0015</td><td>0</td></tr>
</tbody>
</table>
<ul>
  <li><strong>k = AUD</strong>：只有 D[EUR][CNY] 变小：−0.4824 + (−1.5412) = −2.0236 &lt; −2.0015。即欧元经澳元换人民币（1.62 × 4.67 = 7.5654）比直接换（7.40）划算，只是路线更好，不是套利。</li>
  <li><strong>k = CNY</strong>：D[AUD][EUR] = −1.5412 + 2.0174 = 0.4762 &lt; 0.5108；<strong>D[EUR][EUR] = D[EUR][CNY] + D[CNY][EUR] = −2.0236 + 2.0174 = −0.0062 &lt; 0</strong>，负环 EUR → AUD → CNY → EUR 出现，−0.0062 = −ln 1.0062。</li>
  <li><strong>k = EUR</strong>：D[AUD][AUD]、D[CNY][CNY] 也变成 −0.0062，D[EUR][EUR] 再降到 −0.0124（相当于绕环两圈）。</li>
</ul>
<p>结论：存在套利。有负环时 D 里的数已不是最短距离（绕圈可以无限变小），<strong>只看对角线的正负</strong>。浮点有舍入误差，程序里宜写 D[i][i] &lt; −ε。</p>

<h2>隐式图：倒水问题</h2>
<p>三个壶容量 8 L、5 L、3 L，8 L 壶装满，另外两个空。壶上没有刻度，只能把一个壶的水倒进另一个壶，直到倒出的壶空了或接水的壶满了。能否让某个壶里正好有 4 L？</p>
<ul>
  <li><strong>顶点 = 状态</strong> (x, y, z)：三个壶里各有几升。起点 (8, 0, 0)。</li>
  <li><strong>边 = 一次倒水</strong>（有向）：从壶 i 倒向壶 j，倒出 min(i 里的水, j 剩余的空间)。</li>
  <li><strong>目标</strong>：任何含 4 的状态。</li>
</ul>
<p>例如 (8, 0, 0) 只有两种倒法：8→5 得 (3, 5, 0)，8→3 得 (5, 0, 3)。从 (3, 5, 0) 有三种：8→3 得 (0, 5, 3)，5→8 回到 (8, 0, 0)，5→3 得 (3, 2, 3)。</p>
<p>这就是<strong>隐式图（implicit graph）</strong>：事先不知道有多少顶点和边，也不存邻接矩阵或邻接表；搜索到某个状态时才按规则生成它的出边和邻居，碰到目标就结束。<strong>显式图（explicit graph）</strong>则是顶点和边事先给定、存在内存里。</p>
<p>BFS 照常用 FIFO 队列 + visited，入队时标记。<strong>visited 不能省</strong>：倒水能退回旧状态（5→8 回到起点），不记就会兜圈子。水总量恒为 8 L，状态由 (y, z) 决定，最多 6 × 4 = 24 种，visited 用 6 × 4 的数组即可。</p>
<iframe class="anim-frame" src="blog/blog_data/dsa-graph-modelling/anims/water-jug-bfs.html" loading="lazy" style="height: 500px;" title="倒水问题的 BFS"></iframe>
<p class="anim-caption">逐帧看 BFS 逐层生成状态：每列是倒水次数，红色弯线 = 倒回已访问状态，最后一帧绿色 = 回溯出的路径。</p>
<p>结果：<strong>最少 6 次</strong>，(8,0,0) → (3,5,0) → (3,2,3) → (6,2,0) → (6,0,2) → (1,5,2) → (1,4,3)，最后 5 L 壶里是 4 L。BFS 按倒水次数逐层扩展，第一次碰到目标的层数就是最少次数。</p>

<h2>隐式图上的搜索：谁保证最优</h2>
<p>找一条从起点到目标的路叫搜索（search）。课上的总结：</p>
<table>
<thead><tr><th>算法</th><th>容器</th><th>找到的路最优吗</th></tr></thead>
<tbody>
<tr><td>BFS</td><td>FIFO 队列</td><td><strong>有条件</strong>：所有动作代价相同（如只数倒水次数）</td></tr>
<tr><td>DFS</td><td>栈 / 递归</td><td><strong>否</strong>（倒水问题里 DFS 找到的解要 9 次）</td></tr>
<tr><td>一致代价搜索（uniform-cost search, UCS）</td><td>按已花代价排序的优先队列</td><td><strong>是</strong>（代价非负）；即 Dijkstra 的一个版本</td></tr>
<tr><td>IW（作业 3）</td><td>—</td><td>课上的表标为有条件最优；细节不考</td></tr>
</tbody>
</table>
<p>动作代价不同时（例如每次倒水的代价是倒出的升数），步数最少不等于代价最小，要用 UCS。它与 Dijkstra 的差别只在用法：状态边搜边生成，只求到目标的一条路；并且要等目标<strong>出队</strong>才停，那时代价才确定，和 Dijkstra“出 PQ 才确定”同理。</p>

<h2>考试怎么考</h2>
<ul>
  <li><strong>算法设计长题</strong>：描述一个场景，要求建图并选算法；课上说期末设计题最接近第 11 周 workshop 练习 6。按顺序写清：顶点、边（有向？）、边权、算法及其前提为何满足、复杂度。</li>
  <li><strong>改写 DFS/BFS</strong>：判环的 DFS 版课上讲过，BFS 版被点名可能考。要能写 C 或伪代码，别漏外层循环和递归返回值。</li>
  <li><strong>套利</strong>：记住“取 −log，乘积 &gt; 1 变成和 &lt; 0”和“Floyd-Warshall 后看对角线是否 &lt; 0”。对数恒等式在公式表上，这两步不在。</li>
  <li><strong>隐式图</strong>：定义状态和动作；说明 visited 的作用、BFS 为何步数最少、何时改用 UCS。</li>
  <li><strong>判断题</strong>：BFS 总能找到最优解（错）；DFS 能找最短路（错）；parent 规则可直接用于有向图（错）；Floyd-Warshall 在有负环的图上给出正确最短路（错，但能检测负环）。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>① 用 log 而不是 −log：赚钱的环变成<strong>正</strong>权环，最短路算法不会去找。② 把“碰到已访问顶点”直接当成环，忘了排除 parent。③ 隐式图 BFS 不记 visited，在旧状态间打转。</p>
</div>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">1. 用 BFS 判断无向图是否有环：写出 C 函数（沿用正文的邻接矩阵表示），并在课上的图（A–C、A–D、B–C、C–D）上从 A 出发追踪，说明在哪一步发现环。</summary>
  <div class="qa__body">
<pre><code>/* BFS 版：parent[v] = 发现 v 的顶点。有环返回 1，否则返回 0 */
int bfs_has_cycle(int n, int adj[MAXV][MAXV]) {
    int visited[MAXV] = {0}, parent[MAXV], queue[MAXV];
    for (int s = 0; s &lt; n; s++) {         /* 每个连通分量各做一次 BFS */
        if (visited[s]) {
            continue;
        }
        int head = 0, tail = 0;
        visited[s] = 1;
        parent[s] = -1;
        queue[tail++] = s;
        while (head &lt; tail) {
            int u = queue[head++];
            for (int w = 0; w &lt; n; w++) {
                if (!adj[u][w]) {
                    continue;
                }
                if (!visited[w]) {
                    visited[w] = 1;       /* 入队时标记 */
                    parent[w] = u;
                    queue[tail++] = w;
                } else if (w != parent[u]) {
                    return 1;             /* 已发现、又不是 u 的父亲：成环 */
                }
            }
        }
    }
    return 0;
}</code></pre>
<p>追踪（邻居按字母序）：</p>
<ol>
  <li>A 标记并入队，parent[A] = −1。队列 [A]。</li>
  <li>取出 A：C、D 未访问，都标记，parent 设为 A，入队。队列 [C, D]。</li>
  <li>取出 C：A = parent[C]，忽略；B 未访问，parent[B] = C，入队，队列 [D, B]；D 已访问且 <strong>D ≠ parent[C] = A</strong>，返回 1。</li>
</ol>
<p>BFS 在边 C–D 上发现环 A–C–D–A（DFS 是在边 D–A 上）。</p>
<p>为什么正确：w 已访问，说明 u、w 都已通过 BFS 树连到起点；w 又不是 u 的父亲，边 u–w 不是树边，两条树上路径加这条边就构成环。复杂度同 BFS：矩阵 O(V²)，邻接表 O(V + E)。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">2. 有向图：A→B、A→C、C→B。把正文的 parent 规则原样用在这张图上（只沿出边走，邻居按字母序），会得出什么结论？结论对吗？</summary>
  <div class="qa__body">
<p>explore(A, −)：先走 B，explore(B, A)，B 没有出边，返回；再走 C，explore(C, A)：出边指向 B，B 已访问且 B ≠ parent = A，<strong>报告有环</strong>。</p>
<p><strong>结论错误</strong>：图里没有有向环，A, C, B 是一个拓扑序，三条边都从左指向右。从 C 能到 B，但从 B 回不到 C；“另一条路也能到 B”在有向图里不构成环。</p>
<p>正确做法：顶点分三种状态（未访问 / 还在递归栈上 / 已完成），只有碰到<strong>还在栈上</strong>的顶点才是环：它能沿递归路径走到当前顶点，再加这条边就回到它。这里碰到 B 时 B 已完成。也可以跑 source removal：所有顶点都能输出，说明无环。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">3. 两种货币 X、Y：1 X 换 0.5 Y，1 Y 换 2.1 X。(a) 写出 −ln 权重矩阵，用 Floyd-Warshall 判断是否有套利；(b) 如果边权取 +ln R，为什么同样的方法不行？(c) 为什么不用 Dijkstra？</summary>
  <div class="qa__body">
<p>(a) w(X, Y) = −ln 0.5 = 0.6931，w(Y, X) = −ln 2.1 = −0.7419，对角线为 0。k = X 时：D[Y][Y] = D[Y][X] + D[X][Y] = −0.7419 + 0.6931 = −0.0488 &lt; 0，<strong>有套利</strong>：1 Y → 2.1 X → 1.05 Y，赚 5%（−0.0488 = −ln 1.05）。</p>
<p>(b) 取 +ln 后，赚钱的环权重和 &gt; 0。Floyd-Warshall 取的是最小值，正权环永远不会让距离变小，所以检测不到；要找“和 &gt; 0 的环”相当于求最长路，学过的算法都不做这件事。</p>
<p>(c) 汇率大于 1 的边（这里 Y → X）权重为负，Dijkstra 要求边权非负；它也没有检测负环的功能。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">4. 4 L、3 L 两个空壶，每步可以装满一个壶（水龙头随便用）、倒空一个壶，或把一个壶倒进另一个（倒到一方空或另一方满）。要让某个壶里正好 2 L：建模成图并求最少步数。</summary>
  <div class="qa__body">
<p><strong>顶点</strong>：(a, b)，0 ≤ a ≤ 4，0 ≤ b ≤ 3，最多 5 × 4 = 20 个；起点 (0, 0)；目标 a = 2 或 b = 2。<strong>边</strong>：6 种动作（装满 4、装满 3、倒空 4、倒空 3、4→3、3→4），状态不变的动作不算。每步代价相同，用 <strong>BFS</strong>，并记 visited（“倒空”能撤销“装满”，图里有环）。</p>
<p>按上面的动作顺序逐层展开：</p>
<ul>
  <li>第 0 层：(0,0)</li>
  <li>第 1 层：(4,0)、(0,3)</li>
  <li>第 2 层：(4,3)、(1,3)、(3,0)</li>
  <li>第 3 层：(1,0)、(3,3)</li>
  <li>第 4 层：(1,0) 生成 (0,1)；(3,3) 做 3→4 生成 (4,2)，含 2 L，停止。</li>
</ul>
<p><strong>最少 4 步</strong>：装满 3 L 壶 (0,3) → 3→4 得 (3,0) → 装满 3 L 壶 (3,3) → 3→4 得 (4,2)。</p>
  </div>
</details>
`;

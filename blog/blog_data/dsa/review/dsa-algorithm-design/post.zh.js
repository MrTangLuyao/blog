/* Post body — dsa-algorithm-design / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-algorithm-design:zh'] = `
<p class="lead">算法设计题（algorithm design）给一段文字场景，要你设计算法、说明为什么对、给出复杂度。大多数题是把一个课内算法改一两处，答案按五步写：建模、选算法、写改动、说正确性、给复杂度。</p>

<h2>例 1：肥度最小的路径</h2>
<p>题目：无向图，边权 ≥ 0。一条路径的<strong>肥度（fatness）</strong>是路上<strong>最重</strong>的那条边。给定 s 和 t，求肥度最小的 s→t 路径。</p>
<p>好比开车翻山：不在乎总路程，只在乎最陡的那一段有多陡。动画里的图从 A 到 F 有这几条路线：</p>
<table>
<thead><tr><th>路线</th><th>总长</th><th>肥度</th></tr></thead>
<tbody>
<tr><td>A→C→E→F</td><td>2 + 3 + 9 = 14（最短）</td><td>9</td></tr>
<tr><td>A→B→D→F</td><td>6 + 4 + 5 = 15</td><td><strong>6（最小）</strong></td></tr>
<tr><td>A→C→E→D→F</td><td>2 + 3 + 7 + 5 = 17</td><td>7</td></tr>
</tbody>
</table>
<p>总长最短的路线偏偏经过最重的边 9，所以直接跑 Dijkstra 会答错：它最小化的是<strong>总和</strong>。但它的框架可以整个留下：每次从优先队列（priority queue, PQ）取出键最小的顶点，再松弛（relax）它的边。只要把计算代价的 <code>+</code> 换成 <code>max</code>。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-algorithm-design/anims/min-fatness.html" loading="lazy" style="height: 520px;" title="最小肥度路径：Dijkstra 的 max 版"></iframe>
<p class="anim-caption">用按钮切换松弛规则：max（求肥度）或 +（普通最短路），对比同一张图的结果。节点下方是当前的键，最后一帧橙色的是沿 from[] 回溯出的路径。</p>

<h3>按五步写成答案</h3>
<ul>
  <li><strong>建模</strong>：原图不用改，只是路径代价从“边权相加”变成“取最大边权”。</li>
  <li><strong>选算法</strong>：单源、求代价最小的路径 → Dijkstra。</li>
  <li><strong>修改</strong>：fat[] 代替 dist[]，fat[s] = 0（还没走任何边），其余 ∞。松弛 (u, v) 的候选值改成 <strong>max(fat[u], w(u, v))</strong>：到 u 为止最重的边和这条新边，谁大谁就是新路线的肥度。比 fat[v] 小就更新 fat[v]、from[v] 和 PQ。t 出队即停，沿 from[] 回溯出路径。</li>
  <li><strong>正确性</strong>：Dijkstra 敢在出队时把答案定死，靠的是<strong>路径往后延长，代价不会变小</strong>：PQ 里最小的键，绕别的路只会更大。加法要靠边权 ≥ 0 才满足这一点；max(fat[u], w) ≥ fat[u] 则永远成立。</li>
  <li><strong>复杂度</strong>：循环结构没变，和 Dijkstra 相同：邻接表（adjacency list）+ 二叉堆 O((V + E) log V)；邻接矩阵（adjacency matrix）+ 数组扫描 O(V²)。</li>
</ul>

<h3>手算一遍：从 F 出发</h3>
<p>同一张图以 F 为起点，每行是一次出队和它带来的更新：</p>
<pre><code class="lang-text">出队 F(0)：D = max(0, 5) = 5，E = max(0, 9) = 9
出队 D(5)：B = max(5, 4) = 5；E：max(5, 7) = 7 &lt; 9，改为 7
出队 B(5)：A = max(5, 6) = 6，C = max(5, 8) = 8
出队 A(6)：C：max(6, 2) = 6 &lt; 8，改为 6
出队 C(6)：E：max(6, 3) = 6 &lt; 7，改为 6
出队 E(6)，结束。出队顺序 F, D, B, A, C, E
fat[A..F] = 6, 5, 6, 5, 6, 0</code></pre>
<p>E 的键 9 → 7 → 6 改了两次：直连是 9，绕 D 是 7，绕 D、B、A、C 是 6。路线 F–D–B–A–C–E 有 5 条边，最重的却只有 6：<strong>肥度只看最重的边，和路线长短无关。</strong></p>

<h3>第二种答法：先求 MST</h3>
<p><strong>先求最小生成树（minimum spanning tree, MST），树上 s 到 t 的唯一路径就是肥度最小的路径。</strong></p>
<p>为什么：设这条树上路径最重的边是 e，假如另有一条 s→t 路径，每条边都比 e 轻。把 e 从树里删掉，树断成两半，s、t 各在一边，那条路径一定有某条边 e′ 跨过两半。用 e′ 换掉 e，得到一棵更轻的生成树，和“MST 最轻”矛盾。</p>
<p>复杂度：Prim 的 O((V + E) log V)，加上树上 BFS 找路径的 O(V)；一棵 MST 能回答所有点对。上图的 MST 是 A–C、C–E、B–D、D–F、A–B，树上 A 到 F 正是 A–B–D–F。</p>

<h3>要写代码时</h3>
<p>邻接矩阵版本，和数组扫描版的 Dijkstra 只差一行：</p>
<pre><code>#include &lt;limits.h&gt;
#define MAXV   26
#define NOEDGE (-1)                 /* w[u][v] == NOEDGE：没有边 */

void min_fat_paths(int n, int w[MAXV][MAXV], int s, int fat[], int from[]) {
    int done[MAXV];
    for (int v = 0; v &lt; n; v++) { fat[v] = INT_MAX; from[v] = -1; done[v] = 0; }
    fat[s] = 0;
    for (int k = 0; k &lt; n; k++) {
        int u = -1;                     /* deleteMin：扫描数组找最小键 */
        for (int v = 0; v &lt; n; v++)
            if (!done[v] &amp;&amp; fat[v] != INT_MAX &amp;&amp; (u == -1 || fat[v] &lt; fat[u])) u = v;
        if (u == -1) break;             /* 剩下的顶点都到不了 */
        done[u] = 1;
        for (int v = 0; v &lt; n; v++) {   /* 松弛 u 的边 */
            if (done[v] || w[u][v] == NOEDGE) continue;
            int cand = fat[u] &gt; w[u][v] ? fat[u] : w[u][v];   /* 原版：fat[u] + w[u][v] */
            if (cand &lt; fat[v]) { fat[v] = cand; from[v] = u; }
        }
    }
}</code></pre>
<ul>
  <li>初始化：fat 全设为 ∞（用 INT_MAX 表示），再令 fat[s] = 0。</li>
  <li>每轮先扫一遍数组，找“没确定、到得了、fat 最小”的 u，这就是 deleteMin；找不到说明剩下的都到不了，提前结束。</li>
  <li>done[u] = 1 定下 u，再松弛它的边：<strong>cand 那一行是唯一的改动</strong>，比 fat[v] 小就更新。n 轮、每轮扫描 n 步，共 O(V²)。</li>
</ul>

<h2>答题五步</h2>
<p>例 1 的答案就是这五步，一步都不能省：</p>
<table>
<thead><tr><th>步骤</th><th>要写出什么</th><th>为什么不能省</th><th>例 1 中</th></tr></thead>
<tbody>
<tr><td>建模</td><td>顶点、边、权重（或排序用的键）各是什么；有向还是无向</td><td>模型定了才知道能套哪个算法</td><td>原图；代价 = 最大边权</td></tr>
<tr><td>选算法</td><td>最接近的课内算法，点名</td><td>后面的改动都以它为基准</td><td>Dijkstra</td></tr>
<tr><td>修改</td><td>改了哪些数组、初值、哪条规则、何时停止</td><td>不写清楚就没法照着执行</td><td>+ 换成 max；fat[s] = 0</td></tr>
<tr><td>正确性</td><td>原算法依赖的性质为什么仍然成立</td><td>规则改了，原来的证明未必还成立</td><td>max 不会让代价变小</td></tr>
<tr><td>复杂度</td><td>写明图的表示和 PQ 的实现</td><td>表示不同，复杂度就不同</td><td>邻接表 + 二叉堆 O((V + E) log V)</td></tr>
</tbody>
</table>
<p>选算法时按场景特征对号入座：</p>
<table>
<thead><tr><th>场景特征</th><th>首选</th><th>为什么</th></tr></thead>
<tbody>
<tr><td>无权图的最少步数、谜题的最少操作</td><td>BFS</td><td>一层层往外扩，第一次到达时步数最少</td></tr>
<tr><td>非负权的单源最短 / 最便宜</td><td>Dijkstra</td><td>边权不同时，步数少不等于代价小</td></tr>
<tr><td>所有点对的可达性</td><td>Warshall</td><td>一次算出整张可达矩阵</td></tr>
<tr><td>所有点对最短路；有负权边（无负环）；判负环</td><td>Floyd–Warshall</td><td>不怕负权边，看对角线能发现负环</td></tr>
<tr><td>用最小总代价把所有点连起来</td><td>Prim（MST）</td><td>要的是一棵树，不是两点间的路径</td></tr>
<tr><td>可达、连通分量、判环</td><td>BFS / DFS + 外层循环</td><td>外层循环保证每个分量都被访问</td></tr>
<tr><td>有先后依赖的顺序</td><td>拓扑排序（topological sort）</td><td>依赖关系就是有向无环图（DAG）</td></tr>
<tr><td>反复取最大 / 最小、前 k 个</td><td>堆（优先队列）</td><td>每次取最值 O(log n)，不用重新排序</td></tr>
</tbody>
</table>

<h2>例 2：不连通图上的 Prim</h2>
<p>题目：图可能不连通，求每个连通分量（connected component）的 MST，合起来叫<strong>最小生成森林（minimum spanning forest）</strong>。</p>
<figure class="fig">
<svg viewBox="0 0 470 210" width="470" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="两个连通分量的图及其最小生成森林">
<line x1="40" y1="40" x2="170" y2="40" stroke="rgba(255,255,255,0.35)" stroke-width="2" stroke-dasharray="5 4"/>
<line x1="40" y1="40" x2="40" y2="170" stroke="#4ade80" stroke-width="3"/>
<line x1="170" y1="40" x2="40" y2="170" stroke="#4ade80" stroke-width="3"/>
<line x1="170" y1="40" x2="170" y2="170" stroke="#4ade80" stroke-width="3"/>
<line x1="40" y1="170" x2="170" y2="170" stroke="rgba(255,255,255,0.35)" stroke-width="2" stroke-dasharray="5 4"/>
<line x1="300" y1="40" x2="430" y2="40" stroke="#4ade80" stroke-width="3"/>
<line x1="430" y1="40" x2="365" y2="170" stroke="#4ade80" stroke-width="3"/>
<line x1="300" y1="40" x2="365" y2="170" stroke="rgba(255,255,255,0.35)" stroke-width="2" stroke-dasharray="5 4"/>
<text x="105" y="28" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#a1a1a0">3</text>
<text x="26" y="105" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">1</text>
<text x="115" y="115" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">2</text>
<text x="184" y="105" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">4</text>
<text x="105" y="184" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#a1a1a0">5</text>
<text x="365" y="28" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">2</text>
<text x="409" y="111" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">1</text>
<text x="321" y="111" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#a1a1a0">3</text>
<circle cx="40" cy="40" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="40" y="40" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">A</text>
<circle cx="170" cy="40" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="170" y="40" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">B</text>
<circle cx="40" cy="170" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="40" y="170" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">C</text>
<circle cx="170" cy="170" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="170" y="170" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">D</text>
<circle cx="300" cy="40" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="300" y="40" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">E</text>
<circle cx="430" cy="40" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="430" y="40" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">F</text>
<circle cx="365" cy="170" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="365" y="170" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">G</text>
</svg>
<figcaption>两个连通分量。绿色实线 = 最小生成森林：A–C 1、C–B 2、B–D 4 与 E–F 2、F–G 1，共 5 条边，总权重 10</figcaption>
</figure>
<p>直接从 A 跑 Prim：取出 A、C（1）、B（2，C–B 比 A–B 便宜）、D（4），PQ 就空了。E、F、G 和左边没有边相连，键永远是 ∞，Prim 看不见它们。</p>
<ul>
  <li><strong>建模 / 选算法</strong>：原图，Prim。</li>
  <li><strong>修改</strong>：像 DFS/BFS 那样加外层循环：对每个顶点 s，若 inMST[s] 为假，令 cost[s] = 0，从 s 再跑一次 Prim，每次长出一棵树。数组扫描版里，树外顶点的 cost 全是 ∞ 就说明本分量已长完，任取一个令 cost = 0 开新树。上图第二次从 E 开始，取出 E、F（2）、G（1，F–G 比 E–G 便宜）。</li>
  <li><strong>正确性</strong>：分量之间没有边，每棵树只能用本分量的边，各自最小，合起来就最小。</li>
  <li><strong>复杂度</strong>：重启不多做工作：所有重启加起来，每个顶点只进出 PQ 一次，每条边只检查两次，和一次 Prim 相同：O((V + E) log V)，矩阵版 O(V²)。</li>
</ul>
<p>森林的边数：k 个顶点的树有 k − 1 条边，c 棵树合计 <strong>V − c</strong>（c = 分量数），上图 7 − 2 = 5。</p>

<h2>例 3：用 BFS 判断无向图有没有环</h2>
<p>课上用 DFS 做过（见 7.9 图建模），并点名“改成 BFS”可能是考题。思路：BFS 沿“发现新顶点的边”长出一棵树，树里没有环；如果碰到一条<strong>不在树里</strong>的边，它加上树上的路径就是一个环。</p>
<p>课上的图：A–C、A–D、B–C、C–D，从 A 出发，邻居按字母序：</p>
<ol>
  <li>出队 A：C、D 都没标记 → 标记，parent[C] = parent[D] = A，入队。</li>
  <li>出队 C：A 是 parent[C]，即来时那条边，跳过；B 没标记 → 标记，parent[B] = C；D <strong>已标记，又不是 C 的父亲</strong> → 边 C–D 不在树里，有环 A–C–D–A。</li>
</ol>
<p>为什么要排除父亲？无向边在邻接表里存两份，C 的表里一定有 A。A 已标记，但那只是来时的路，不是环。</p>
<pre><code class="lang-text">HasCycle(G):                                  // 无向简单图
    for each vertex v: mark[v] = 0, parent[v] = none
    for each vertex s:
        if mark[s] == 0:
            mark[s] = 1; enqueue(Q, s)
            while Q is not empty:
                u = dequeue(Q)
                for each vertex w adjacent to u:
                    if mark[w] == 0:
                        mark[w] = 1; parent[w] = u; enqueue(Q, w)
                    else if w != parent[u]:
                        return true           // 非树边 → 有环
    return false</code></pre>
<p>入队时就标记（本课约定）；外层 for 让每个分量都跑一次 BFS。</p>
<ul>
  <li><strong>正确性</strong>：反过来，有环就一定能发现：环上至少一条边不在树里，它两端中先出队的那个处理它时，另一端必已标记（否则它就成了树边），于是被 <code>else if</code> 抓到。</li>
  <li><strong>复杂度</strong>：和普通 BFS 一样，邻接表 O(V + E)，矩阵 O(V²)。</li>
</ul>
<p>另一种答法：BFS 数出分量数 c，<strong>有环 ⇔ E &gt; V − c</strong>。无环的图就是森林，正好 V − c 条边，多一条就必然成环。</p>
<p>判断<strong>是不是树</strong>也同理：树 ⇔ 连通且 E = V − 1。先数边（各链表长度之和除以 2），再从任一顶点 BFS，看能否标记全部 V 个顶点，共 O(V + E)。（连通且 V − 1 条边就无环：若有环，删一条环边仍连通，边数却少于 V − 1，不可能。）</p>

<h2>例 4：最小的 k 个数</h2>
<p>题目：n 个无序整数，输出最小的 k 个。</p>
<table>
<thead><tr><th>方法</th><th>时间</th><th>额外空间</th></tr></thead>
<tbody>
<tr><td>全部排序，取前 k 个</td><td>O(n log n)</td><td>视排序算法</td></tr>
<tr><td>自底向上建最小堆，deleteMin k 次</td><td>O(n + k log n)</td><td>O(n)，原地建堆则 O(1)</td></tr>
<tr><td>大小为 k 的最大堆扫一遍</td><td>O(n log k)</td><td>O(k)</td></tr>
</tbody>
</table>
<p>时间从哪来：排序把用不到的 n − k 个也排好了；自底向上建堆只要 O(n)，再取 k 次最小；大小 k 的堆，每个元素最多做一次 O(log k) 的替换。</p>
<p>第三种的堆里放“目前见过的最小的 k 个”，根是其中最大的，像一道门槛：新来的 x 比门槛小，就替换根并 sift down（和较大的孩子交换）；否则丢掉。[9, 4, 7, 1, 8, 2, 6]，k = 3，堆数组从下标 1 开始：</p>
<pre><code class="lang-text">前 3 个建堆          [9, 4, 7]
1 &lt; 9：替换根        [1, 4, 7] → sift down → [7, 4, 1]
8 ≥ 7：丢弃
2 &lt; 7：替换根        [2, 4, 1] → sift down → [4, 2, 1]
6 ≥ 4：丢弃
结果 {1, 2, 4}</code></pre>
<p>怎么选：数据都在内存里时，第二种渐近上不比第三种慢（k = √n 时它是 O(n)，第三种是 O(n log n)）；数据是一串流、或内存只放得下 k 个时用第三种，它看一个丢一个。细节见 6.5 优先队列与 Top-k 问题。</p>

<h2>例 5：货币套利</h2>
<p>题目：n 种货币，R[i][j] 是 1 单位货币 i 能换到的货币 j 的数量。判断能否从某种货币出发换一圈回来，数量变多（套利，arbitrage）。课上的例子：1 澳元 → 4.67 人民币 → 欧元（×0.133）→ 澳元（×1.62），4.67 × 0.133 × 1.62 ≈ 1.0062 &gt; 1。</p>
<ul>
  <li><strong>建模</strong>：顶点 = 货币，有向边 i→j（两个方向汇率不同）。套利 ⇔ 有一个环，环上汇率的<strong>乘积</strong> &gt; 1。</li>
  <li><strong>转换</strong>：最短路算法只会把边权相加。取对数把乘法变成加法：乘积 &gt; 1 ⇔ ∑ log R &gt; 0 ⇔ ∑ (−log R) &lt; 0。令<strong>边权 w(i, j) = −log R[i][j]</strong>，套利就是<strong>负权环（negative cycle）</strong>；负号把“越大越好”翻成最短路的“越小越好”。例子中 −ln 4.67 − ln 0.133 − ln 1.62 ≈ −1.541 + 2.017 − 0.482 = −0.006 &lt; 0。</li>
  <li><strong>选算法</strong>：Floyd–Warshall，它允许负权边。D[i][i] 是从 i 绕回 i 的最短距离，没有负环时是 0；<strong>任一 D[i][i] &lt; 0</strong> 就说明 i 在负环上，能套利。不能用 Dijkstra：有负权边，“路径延长代价不变小”不成立。</li>
  <li><strong>复杂度</strong>：任意两种货币都有汇率，是完全图，正好用 n × n 矩阵存：时间 Θ(n³)，空间 Θ(n²)。</li>
</ul>

<h2>考试怎么考</h2>
<ul>
  <li><strong>题型</strong>：长答案题给一个场景（路网、布线、依赖关系、交易……），要求设计算法或数据结构并给复杂度，有时追加一问写 C 代码。考试说明给出的样题是 workshop W11.6。</li>
  <li><strong>五步写全</strong>：只写“改进的 Dijkstra”不写初值、规则、停止条件，等于没给算法；复杂度要带上表示法和 PQ 实现。</li>
  <li><strong>要背的复杂度</strong>（公式表上没有）：BFS/DFS 邻接表 O(V + E)、矩阵 O(V²)；Dijkstra、Prim 用二叉堆 <strong>O((V + E) log V)</strong>（本课程默认）；Floyd–Warshall Θ(V³)；自底向上建堆 O(n)，堆插入、删除 O(log n)。</li>
  <li><strong>常见坑</strong>：带权图用 BFS 求最短路；有负权还用 Dijkstra（套利题）；把 MST 当最短路（但它恰好给出最小肥度路径）；不连通图忘了外层循环；无向图判环忘了排除父亲。</li>
</ul>

<h3>例题：最大载重路线</h3>
<p>题目：每条道路有限重，一条路线能通过的最大载重等于路上<strong>最小</strong>的限重。求 s 到 t 能通过的最大载重和路线，给出复杂度。</p>
<p>这是例 1 反过来：让最小值尽量大，叫最宽路径（widest path）。</p>
<ul>
  <li><strong>建模</strong>：路口为顶点，道路为无向边，权 = 限重；路线代价 = 最小边权，要<strong>最大化</strong>。</li>
  <li><strong>选算法 / 修改</strong>：Dijkstra 的镜像。cap[s] = ∞（起点没有限制），其余为 0（还到不了）；PQ 改成<strong>最大</strong>优先队列（最大堆，或在最小堆里存 −cap）。松弛 (u, v) 的候选值 = <strong>min(cap[u], w(u, v))</strong>，大于 cap[v] 就更新 cap[v]、from[v] 和 PQ。t 出队即停，沿 from[] 回溯。</li>
  <li><strong>正确性</strong>：路径往后延长，min 只会变小或不变，正是 Dijkstra 那条性质的镜像，所以出队的最大键不会再被改进。</li>
  <li><strong>复杂度</strong>：邻接表 + 二叉堆 O((V + E) log V)；矩阵 + 数组扫描 O(V²)。</li>
</ul>
<p>也可以求<strong>最大</strong>生成树（Prim 每次选最重的跨越边），取树上 s 到 t 的路径，理由和例 1 的 MST 答法对称。</p>

<h3>例题：必须经过 m 的最短路</h3>
<p>题目：无向图，边权非负，求从 s 到 t、且必须经过顶点 m 的最短路长度。Dijkstra 最少跑几次？</p>
<p><strong>一次。</strong>路线拆成 s→m 和 m→t 两段，两段互不影响，各取最短再拼起来即可。无向图里 dist(s, m) = dist(m, s)，所以<strong>从 m 跑一次</strong>，答案 = dist[s] + dist[t]，O((V + E) log V)。</p>
<p>若是有向图，m→t 照样从 m 跑一次；s→m 方向相反，要再从 s 跑一次，或在<strong>反向图</strong>（所有边掉头）上从 m 跑一次。共两次，复杂度不变。</p>

<h2>小结</h2>
<ul>
  <li>五步：建模 → 选算法 → 写清改动（数组、初值、规则、停止条件）→ 说明为什么仍正确 → 带表示法的复杂度。</li>
  <li>最小肥度：Dijkstra 把 + 换成 max，或取 MST 上的路径；最宽路径反过来用 min + 最大 PQ。</li>
  <li>不连通图：加外层循环重启；森林有 V − c 条边。</li>
  <li>无向图判环：碰到“已标记、又不是父亲”的邻居就有环，或看 E &gt; V − c。</li>
  <li>最小 k 个：内存里建堆 + k 次 deleteMin，O(n + k log n)；数据流用大小 k 的最大堆，O(n log k)。</li>
  <li>套利：取对数后变成负权环，用 Floyd–Warshall 看 D[i][i] &lt; 0。</li>
</ul>
`;

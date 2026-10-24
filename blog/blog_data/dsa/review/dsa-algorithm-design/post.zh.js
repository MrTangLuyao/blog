/* Post body — dsa-algorithm-design / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-algorithm-design:zh'] = `
<p class="lead">算法设计题（algorithm design）给出一个文字场景，要求设计算法（有时还有数据结构）并分析复杂度。答案的骨架固定为五步：把场景建模成图或键，点名最接近的课内算法，精确写出改动，用一两句话说明为什么仍然正确，给出写明表示法的复杂度。</p>

<h2>例 1：肥度最小的路径</h2>
<p>题目：无向图，边权 ≥ 0。一条路径的<strong>肥度（fatness）</strong>定义为路径上<strong>最大</strong>的边权。给定 s 和 t，求肥度最小的 s→t 路径。</p>
<p>下图从 A 到 F 的几条路线：</p>
<table>
<thead><tr><th>路线</th><th>总长</th><th>肥度</th></tr></thead>
<tbody>
<tr><td>A→C→E→F</td><td>2 + 3 + 9 = 14（最短）</td><td>9</td></tr>
<tr><td>A→B→D→F</td><td>6 + 4 + 5 = 15</td><td><strong>6（最小）</strong></td></tr>
<tr><td>A→C→E→D→F</td><td>2 + 3 + 7 + 5 = 17</td><td>7</td></tr>
</tbody>
</table>
<p>最短的路线肥度反而最大，所以直接跑 Dijkstra 是错的。但“每次从 PQ 取出键最小的顶点、松弛它的边”这个框架可以原样保留，只换掉路径代价的计算方式：</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-algorithm-design/anims/min-fatness.html" loading="lazy" style="height: 520px;" title="最小肥度路径：Dijkstra 的 max 版"></iframe>
<p class="anim-caption">按钮切换松弛规则 max（肥度）与 +（最短路）；节点下方是当前键，最后一帧橙色为回溯出的路径。</p>

<p>按五步写成答案：</p>
<ul>
  <li><strong>建模</strong>：顶点、边就是原图；路径代价从“边权之和”变成“边权最大值”。</li>
  <li><strong>选算法</strong>：单源、求代价最小的路径 → Dijkstra。</li>
  <li><strong>修改</strong>：数组 fat[] 代替 dist[]，fat[s] = 0，其余 ∞。松弛 (u, v) 时候选值由 dist[u] + w(u, v) 改为 <strong>max(fat[u], w(u, v))</strong>，小于 fat[v] 就更新 fat[v]、from[v] 和 PQ。t 出队即可停止，路径沿 from[] 回溯。</li>
  <li><strong>正确性</strong>：Dijkstra 的贪心靠的是这条性质：<strong>路径往后延长，代价不会变小</strong>，所以出队的最小键不可能再被别的路线改进。加法要靠边权 ≥ 0 才满足它；max(fat[u], w) ≥ fat[u] 则永远成立。</li>
  <li><strong>复杂度</strong>：与 Dijkstra 相同。邻接表 + 二叉堆 O((V + E) log V)；邻接矩阵 + 数组扫描 O(V²)。</li>
</ul>
<p>第二种答法：<strong>先求 MST，树上 s 到 t 的唯一路径就是肥度最小的路径</strong>。理由：设树上这条路径最重的边是 e。若另有一条 s→t 路径的边都比 e 轻，从树中删掉 e，树分成含 s 和含 t 的两半，那条路径必有一条边 e′ 跨过两半；用 e′ 换掉 e 得到更轻的生成树，与 MST 矛盾。复杂度为 Prim 的 O((V + E) log V) 加上在树上 BFS 找路径的 O(V)，而且一棵 MST 同时回答所有点对。上图的 MST 是 A–C、C–E、B–D、D–F、A–B，树上 A 到 F 正是 A–B–D–F。</p>
<p>若题目要求写代码，邻接矩阵版本与 Dijkstra 只差松弛那一行：</p>
<pre><code>#include &lt;limits.h&gt;

#define MAXV   26
#define NOEDGE (-1)          /* w[u][v] == NOEDGE：没有边；边权 ≥ 0 */

/* 从 s 出发：fat[v] = s 到 v 所有路径中“最大边权”的最小值
   （到不了为 INT_MAX）；from[v] = 这条路径上 v 的前一个顶点。 */
void min_fat_paths(int n, int w[MAXV][MAXV], int s, int fat[], int from[]) {
    int done[MAXV];
    for (int v = 0; v &lt; n; v++) {
        fat[v] = INT_MAX;
        from[v] = -1;
        done[v] = 0;
    }
    fat[s] = 0;

    for (int k = 0; k &lt; n; k++) {
        int u = -1;                       /* deleteMin：扫描数组，O(V) */
        for (int v = 0; v &lt; n; v++) {
            if (!done[v] &amp;&amp; fat[v] != INT_MAX &amp;&amp; (u == -1 || fat[v] &lt; fat[u])) {
                u = v;
            }
        }
        if (u == -1) break;               /* 剩下的顶点都不可达 */
        done[u] = 1;

        for (int v = 0; v &lt; n; v++) {     /* 松弛 u 的边 */
            if (done[v] || w[u][v] == NOEDGE) continue;
            int cand = fat[u] &gt; w[u][v] ? fat[u] : w[u][v];  /* Dijkstra：fat[u] + w[u][v] */
            if (cand &lt; fat[v]) {
                fat[v] = cand;
                from[v] = u;
            }
        }
    }
}</code></pre>

<h2>答题五步</h2>
<table>
<thead><tr><th>步骤</th><th>要写出的内容</th><th>例 1 中</th></tr></thead>
<tbody>
<tr><td>建模</td><td>顶点、边、权重（或排序用的键）各是什么；有向还是无向</td><td>原图；代价 = 最大边权</td></tr>
<tr><td>选算法</td><td>最接近的课内算法，点名</td><td>Dijkstra</td></tr>
<tr><td>修改</td><td>改了哪些数组、初值、哪条规则、何时停止</td><td>+ 换成 max；fat[s] = 0</td></tr>
<tr><td>正确性</td><td>原算法依赖的性质为什么仍然成立</td><td>max 不会让代价变小</td></tr>
<tr><td>复杂度</td><td>写明图的表示和 PQ 的实现</td><td>邻接表 + 二叉堆 O((V + E) log V)</td></tr>
</tbody>
</table>
<p>选算法时按场景特征对号入座：</p>
<table>
<thead><tr><th>场景特征</th><th>首选</th></tr></thead>
<tbody>
<tr><td>无权图的最少步数、谜题的最少操作</td><td>BFS</td></tr>
<tr><td>非负权的单源最短 / 最便宜</td><td>Dijkstra</td></tr>
<tr><td>所有点对的可达性</td><td>Warshall</td></tr>
<tr><td>所有点对最短路；有负权边（无负环）；判负环</td><td>Floyd–Warshall</td></tr>
<tr><td>用最小总代价连通所有点</td><td>Prim（MST）</td></tr>
<tr><td>可达、连通分量、判环</td><td>BFS / DFS + 外层循环</td></tr>
<tr><td>先后依赖的顺序</td><td>拓扑排序</td></tr>
<tr><td>反复取最大 / 最小、前 k 个</td><td>堆（优先队列）</td></tr>
</tbody>
</table>

<h2>例 2：不连通图上的 Prim</h2>
<p>题目：图可能不连通，求每个连通分量的 MST，合起来叫<strong>最小生成森林（minimum spanning forest）</strong>。</p>
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
<p>从 A 运行 Prim：依次取出 A、C（1）、B（2，C–B 比 A–B 便宜）、D（4），然后 PQ 就空了，E、F、G 永远进不了 PQ。</p>
<ul>
  <li><strong>建模 / 选算法</strong>：原图，Prim。</li>
  <li><strong>修改</strong>：像 DFS/BFS 那样加外层循环：对每个顶点 s，若 inMST[s] 为假，令 cost[s] = 0 并从 s 跑一次 Prim；每跑一次得到一棵树。数组扫描版本里，若树外顶点的 cost 全是 ∞，说明当前分量已完成，任取一个树外顶点令 cost = 0 开新树。上图第二次从 E 开始，取出 E、F（2）、G（1，F–G 比 E–G 便宜）。</li>
  <li><strong>正确性</strong>：分量之间没有边，每个分量的生成树只能用本分量的边，各自最小即整体最小；每次重启恰好覆盖一个分量。</li>
  <li><strong>复杂度</strong>：每个顶点进出 PQ 一次，每条边检查两次，与一次 Prim 相同：O((V + E) log V)，矩阵版 O(V²)。森林有 <strong>V − c</strong> 条边（c = 分量数），上图 7 − 2 = 5。</li>
</ul>

<h2>例 3：用 BFS 判断无向图有没有环</h2>
<p>课上用 DFS 做过（见 7.9 图建模），并点名“改成 BFS”可能是考题。课上的图：A–C、A–D、B–C、C–D，从 A 出发，邻居按字母序：</p>
<ol>
  <li>出队 A：C、D 未标记 → 标记，parent[C] = parent[D] = A，入队。</li>
  <li>出队 C：A 是 parent[C]，即来时那条边，跳过；B 未标记 → 标记，parent[B] = C；<strong>D 已标记且 D ≠ parent[C]</strong> → 有环 A–C–D–A。</li>
</ol>
<p>无向边在邻接表里存两份，C 一定会看见父亲 A，所以必须排除 parent。</p>
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
<ul>
  <li><strong>正确性</strong>：使新顶点入队的边构成 BFS 森林，森林无环。已标记又不是父亲的邻居 w 说明边 (u, w) 不在森林里，它加上森林中 u 到 w 的路径就是环。反过来，有环则至少一条边不在森林里；它先出队的一端处理它时，另一端必已标记（否则这条边就成了树边），于是一定被发现。</li>
  <li><strong>复杂度</strong>：邻接表 O(V + E)，矩阵 O(V²)。另一种答法：BFS 数出分量数 c，<strong>有环 ⇔ E &gt; V − c</strong>。</li>
</ul>

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
<p>第三种的堆里始终放“目前见过的最小的 k 个”，根是其中最大的，充当门槛：新元素 x 小于根就替换根并 sift down，否则丢弃。[9, 4, 7, 1, 8, 2, 6]，k = 3，堆数组从下标 1 开始：</p>
<pre><code class="lang-text">前 3 个建堆          [9, 4, 7]
1 &lt; 9：替换根        [1, 4, 7] → sift down → [7, 4, 1]
8 ≥ 7：丢弃
2 &lt; 7：替换根        [2, 4, 1] → sift down → [4, 2, 1]
6 ≥ 4：丢弃
结果 {1, 2, 4}</code></pre>
<p>怎么选：数据都在内存里时第二种渐近上不慢于第三种（k = √n 时它是 O(n)，第三种是 O(n log n)）；数据是一串流、或内存只放得下 k 个，用第三种。细节见 6.5 优先队列与 Top-k 问题。</p>

<h2>例 5：货币套利</h2>
<p>题目：n 种货币，R[i][j] 是 1 单位货币 i 能换到的货币 j 的数量。判断能否从某种货币出发换一圈回来，数量变多。课上的例子：1 澳元 → 4.67 人民币 → 欧元（×0.133）→ 澳元（×1.62），4.67 × 0.133 × 1.62 ≈ 1.0062 &gt; 1。</p>
<ul>
  <li><strong>建模</strong>：顶点 = 货币，有向边 i→j；套利 ⇔ 存在汇率乘积 &gt; 1 的环。</li>
  <li><strong>转换</strong>：课内的最短路算法只会把边权相加。取对数，乘积 &gt; 1 ⇔ ∑ log R &gt; 0 ⇔ ∑ (−log R) &lt; 0。令<strong>边权 w(i, j) = −log R[i][j]</strong>，套利 ⇔ <strong>负权环</strong>。例子中 −ln 4.67 − ln 0.133 − ln 1.62 ≈ −1.541 + 2.017 − 0.482 = −0.006 &lt; 0。</li>
  <li><strong>选算法</strong>：Floyd–Warshall（允许负权边），跑完检查对角线，<strong>任一 D[i][i] &lt; 0</strong> 就有套利（i 在负环上）。边权有负数，Dijkstra 不能用。</li>
  <li><strong>复杂度</strong>：任意两种货币都有汇率，是完全图，用 n × n 矩阵存：时间 Θ(n³)，空间 Θ(n²)。</li>
</ul>

<h2>考试怎么考</h2>
<ul>
  <li><strong>题型</strong>：长答案题给一个场景（路网、布线、依赖关系、交易……），要求设计算法或数据结构并给复杂度，有时追加“写出 C 代码”。考试说明给出的样题是 workshop W11.6。</li>
  <li><strong>答案要覆盖五步</strong>。只写“用改进的 Dijkstra”而不写初值、更新规则、停止条件，等于没有给出算法；复杂度必须同时写明邻接表还是矩阵、PQ 用什么实现，否则结论不确定。</li>
  <li><strong>要背的复杂度</strong>（公式表上没有，公式表只有对数、求和、主定理和散列估计）：BFS/DFS 邻接表 O(V + E)、矩阵 O(V²)；Dijkstra、Prim 用二叉堆 <strong>O((V + E) log V)</strong>（本课程默认）；Floyd–Warshall Θ(V³)；自底向上建堆 O(n)，堆插入、删除 O(log n)。</li>
  <li><strong>陷阱</strong>：带权图用 BFS 求最短路；有负权还用 Dijkstra（套利题）；把 MST 当最短路（但它恰好给出最小肥度路径）；不连通图忘了外层循环；无向图判环忘了排除父亲。</li>
</ul>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">1. 在例 1 的图上以 F 为起点运行 max 版 Dijkstra。写出顶点出队（确定）的顺序和最终的 fat[]，并指出哪个顶点的键被改了两次。</summary>
  <div class="qa__body">
    <p>fat[F] = 0，其余 ∞。</p>
    <ol>
      <li>出队 F：D = max(0, 5) = 5，E = max(0, 9) = 9。PQ {D5, E9}。</li>
      <li>出队 D（5）：B = max(5, 4) = 5；E：max(5, 7) = 7 &lt; 9，改为 7。PQ {B5, E7}。</li>
      <li>出队 B（5）：A = max(5, 6) = 6，C = max(5, 8) = 8。PQ {A6, E7, C8}。</li>
      <li>出队 A（6）：C：max(6, 2) = 6 &lt; 8，改为 6。PQ {C6, E7}。</li>
      <li>出队 C（6）：E：max(6, 3) = 6 &lt; 7，改为 6。PQ {E6}。</li>
      <li>出队 E（6），结束。</li>
    </ol>
    <p>顺序 <strong>F, D, B, A, C, E</strong>；fat[A..F] = <strong>6, 5, 6, 5, 6, 0</strong>。E 的键 9 → 7 → 6 被改了两次。沿 from[] 回溯，F 到 E 肥度最小的路径是 F–D–B–A–C–E（边权 5、4、6、2、3），肥度 6，比直连边 E–F 的 9 小。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">2. 每条道路有限重（容量）。一条路线能通过的最大载重等于路线上最小的限重。设计算法求 s 到 t 能通过的最大载重及路线，给出复杂度。</summary>
  <div class="qa__body">
    <ul>
      <li><strong>建模</strong>：路口为顶点，道路为无向边，权 = 限重；路线代价 = 边权最小值，要<strong>最大化</strong>。</li>
      <li><strong>选算法</strong>：Dijkstra 的镜像版本（最宽路径）。</li>
      <li><strong>修改</strong>：cap[s] = ∞，其余 0（表示不可达）；PQ 改为<strong>最大</strong>优先队列（最大堆，或在最小堆里存 −cap）。取出 cap 最大的 u，对边 (u, v)：候选值 = <strong>min(cap[u], w(u, v))</strong>，大于 cap[v] 就更新 cap[v]、from[v] 和 PQ。t 出队即停，沿 from[] 回溯。</li>
      <li><strong>正确性</strong>：路径往后延长，min 只会变小或不变，正好是 Dijkstra 所需性质的镜像，所以出队的最大键不会再被改进。</li>
      <li><strong>复杂度</strong>：邻接表 + 二叉堆 O((V + E) log V)；矩阵 + 数组扫描 O(V²)。</li>
    </ul>
    <p>另一种答法：求<strong>最大</strong>生成树（Prim 每次选最重的跨越边），树上 s 到 t 的路径即为答案，论证与例 1 的 MST 答法对称。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">3. 给定无向图（邻接表），设计算法判断它是不是一棵树，给出复杂度。</summary>
  <div class="qa__body">
    <p><strong>树 ⇔ 连通且 E = V − 1</strong>（等价于连通且无环）。</p>
    <ol>
      <li>数边：各链表长度之和除以 2（无向边存两份），O(V + E)。若 E ≠ V − 1，不是树。</li>
      <li>从任一顶点 BFS，数被标记的顶点个数；等于 V（连通）才是树。</li>
    </ol>
    <p>为什么连通加 V − 1 条边就无环：若有环，删掉环上一条边图仍连通，就得到只有 V − 2 条边的连通图，但连通图至少要 V − 1 条边，矛盾。总复杂度 O(V + E)；若用邻接矩阵则为 O(V²)。也可以答“例 3 判环 + 一次 BFS 判连通”，复杂度相同。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">4. 无向图边权非负。求从 s 到 t、且必须经过顶点 m 的最短路长度，Dijkstra 最少跑几次？</summary>
  <div class="qa__body">
    <p>最短的 s→m→t 路线由一条最短 s→m 路径和一条最短 m→t 路径拼成，两段互不影响。无向图中 dist(s, m) = dist(m, s)，所以<strong>只需从 m 跑一次 Dijkstra</strong>，答案 = dist[s] + dist[t]，复杂度 O((V + E) log V)。若是有向图，m→t 从 m 跑一次；s→m 要么再从 s 跑一次，要么在<strong>反向图</strong>上从 m 跑一次，共两次，复杂度不变。</p>
  </div>
</details>
`;

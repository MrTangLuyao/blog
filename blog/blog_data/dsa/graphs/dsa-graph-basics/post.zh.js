/* Post body — dsa-graph-basics / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-graph-basics:zh'] = `
<p class="lead">图（graph）G = (V, E) 由顶点集合 V 和边集合 E 组成，描述对象之间的关系。按边有无方向、有无权重等可以分成几类；度、路径、环、连通分量是后面所有图算法共用的术语，<strong>度数之和 = 2E</strong> 与<strong>入度和 = 出度和 = E</strong> 是常考结论。</p>

<h2>顶点与边</h2>
<p>在平面上画几个点，再用线连起其中一些点对，就得到一个图：点叫<strong>顶点（vertex，也叫 node）</strong>，线叫<strong>边（edge）</strong>。课上贯穿始终的例子：</p>
<pre><code class="lang-text">顶点集 V = {A, B, C, D, E}
边集   E = {A–C, B–C, B–D, C–D}      顶点 E 不在任何边上</code></pre>
<figure class="fig">
<svg viewBox="0 0 480 240" width="480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="5 个顶点的无向图：边 A–C、B–C、B–D、C–D，E 孤立；度数 A1、B2、C3、D2、E0"><g stroke="rgba(255,255,255,0.35)" stroke-width="2"><line x1="80" y1="75" x2="220" y2="75"/><line x1="160" y1="185" x2="220" y2="75"/><line x1="160" y1="185" x2="290" y2="185"/><line x1="220" y1="75" x2="290" y2="185"/></g><g fill="#343433" stroke="#5a5a59" stroke-width="2"><circle cx="80" cy="75" r="18"/><circle cx="160" cy="185" r="18"/><circle cx="220" cy="75" r="18"/><circle cx="290" cy="185" r="18"/><circle cx="410" cy="130" r="18"/></g><g fill="#e8e8e8" font-size="15" font-weight="700" text-anchor="middle"><text x="80" y="80">A</text><text x="160" y="190">B</text><text x="220" y="80">C</text><text x="290" y="190">D</text><text x="410" y="135">E</text></g><g fill="#fbbf24" font-size="13" font-weight="600" text-anchor="middle"><text x="80" y="45">deg 1</text><text x="220" y="45">deg 3</text><text x="160" y="228">deg 2</text><text x="290" y="228">deg 2</text><text x="410" y="100">deg 0</text></g><text x="410" y="170" fill="#a1a1a0" font-size="12" text-anchor="middle">孤立顶点</text></svg>
<figcaption>图 1　课上的例子。黄色数字是每个顶点的度：连在它上面的边数。</figcaption>
</figure>
<p>复杂度式子里 V 和 E 直接表示<strong>顶点数和边数</strong>：本课写 O(V + E)、O(V²)，不写 |V|、|E|。图 1 中 V = 5，E = 4。图只由“有哪些顶点、哪些边”决定，和画法无关：点换了位置、线画弯了，顶点和边不变就是同一个图。</p>
<p>课上的建模例子：</p>
<ul>
<li><strong>航班网络</strong>：城市是顶点，有直飞航班就连一条边。Adelaide 和 Darwin 之间没有直飞，只能中转。</li>
<li><strong>社交网络</strong>：人是顶点。“互相认识”是对称关系，用无向边；“关注（follow）”是单向的，A 关注 B 不代表 B 关注 A，用<strong>有向边</strong>。</li>
<li><strong>先修课</strong>：课程是顶点，X → Y 表示选 Y 之前必须修完 X。</li>
</ul>

<h2>图的类型</h2>
<h3>有向与无向</h3>
<p><strong>无向图（undirected graph）</strong>的边 u–v 两个方向都能走。<strong>有向图（directed graph）</strong>的边 u→v 只能沿箭头走。有向图中 u→v 和 v→u 是<strong>两条不同的边</strong>，可以只有一条，也可以都有（两人互相关注）。</p>

<h3>带权与无权</h3>
<p><strong>带权图（weighted graph）</strong>的每条边带一个数，表示费用、时间或距离；<strong>无权图（unweighted graph）</strong>的边只表示“相连”。路径长度在无权图里是<strong>边数</strong>，在带权图里是<strong>边权之和</strong>。本课程默认<strong>边权 ≥ 0</strong>（Dijkstra 的前提）；Floyd-Warshall 允许负权边，但不允许负权环（7.6）；专门处理负权的 Bellman-Ford 不考。</p>
<p>课上的投票题：雨天逛校园、走遍几间教室并少淋雨，用哪种图？地点是顶点，步行时间是边权，所以一定带权。下楼梯比上楼梯快，两个方向代价不同，用<strong>有向带权图</strong>；假设往返代价相同，无向带权图也算对。<strong>建模题看理由</strong>，要写出假设。</p>

<h3>简单图与多重图</h3>
<p><strong>多重图（multigraph）</strong>允许同一对顶点之间有多条平行边，也允许自环（self-loop，顶点连向自己）。<strong>简单图（simple graph）</strong>两者都不允许：每对顶点之间最多一条边（有向图是每个方向最多一条）。<strong>本课程只用简单图</strong>，所以 n 个顶点时<strong>每个顶点的度最多是 n − 1</strong>。</p>

<h3>完全图</h3>
<p><strong>完全图（complete graph）</strong>：每一对顶点之间都有边。n 个顶点时，第 1 个顶点连向其余 n − 1 个；第 2 个顶点和第 1 个之间的边已经数过，新增 n − 2 条；依此类推，最后一对只剩 1 条：</p>
<p>(n − 1) + (n − 2) + … + 1 = <strong>n(n − 1)/2</strong></p>
<p>（公式表上的等差数列求和）。这是简单无向图边数的上限，所以总有 <strong>E ≤ V(V − 1)/2，即 E = O(V²)</strong>。完全图的邻接矩阵除主对角线为 0 外全是 1。有向图中每个有序对 (u, v)（u ≠ v）都可以有一条边，上限是 <strong>n(n − 1)</strong>。</p>

<h3>有向无环图（DAG）</h3>
<p><strong>DAG（directed acyclic graph）</strong>：有向，且没有环，从任何顶点出发沿箭头都回不到自己。先修课关系必须是 DAG，否则环上的课一门都选不了。拓扑排序（7.8）只对 DAG 有定义。</p>
<figure class="fig">
<svg viewBox="0 0 560 205" width="560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="三种图：多重图（平行边和自环），完全图 K4，有向无环图"><defs><marker id="g71-arr3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.6)"/></marker></defs><g stroke="rgba(255,255,255,0.35)" stroke-width="2"><path d="M40,85 Q85,40 130,85" fill="none"/><path d="M40,85 Q85,130 130,85" fill="none"/><path d="M143,76 C182,52 182,118 143,94" fill="none"/><line x1="240" y1="45" x2="320" y2="45"/><line x1="240" y1="45" x2="240" y2="125"/><line x1="240" y1="45" x2="320" y2="125"/><line x1="320" y1="45" x2="240" y2="125"/><line x1="320" y1="45" x2="320" y2="125"/><line x1="240" y1="125" x2="320" y2="125"/><line x1="422.8" y1="75.4" x2="454.8" y2="51.4" marker-end="url(#g71-arr3)"/><line x1="422.8" y1="94.6" x2="454.8" y2="118.6" marker-end="url(#g71-arr3)"/><line x1="470" y1="56" x2="470" y2="111" marker-end="url(#g71-arr3)"/><line x1="482.8" y1="49.6" x2="514.8" y2="73.6" marker-end="url(#g71-arr3)"/><line x1="482.8" y1="120.4" x2="514.8" y2="96.4" marker-end="url(#g71-arr3)"/></g><g fill="#343433" stroke="#5a5a59" stroke-width="2"><circle cx="40" cy="85" r="16"/><circle cx="130" cy="85" r="16"/><circle cx="240" cy="45" r="16"/><circle cx="320" cy="45" r="16"/><circle cx="240" cy="125" r="16"/><circle cx="320" cy="125" r="16"/><circle cx="410" cy="85" r="16"/><circle cx="470" cy="40" r="16"/><circle cx="470" cy="130" r="16"/><circle cx="530" cy="85" r="16"/></g><g fill="#e8e8e8" font-size="14" font-weight="700" text-anchor="middle"><text x="40" y="90">B</text><text x="130" y="90">C</text><text x="240" y="50">A</text><text x="320" y="50">B</text><text x="240" y="130">C</text><text x="320" y="130">D</text><text x="410" y="90">A</text><text x="470" y="45">B</text><text x="470" y="135">C</text><text x="530" y="90">D</text></g><text x="95" y="172" fill="#e8e8e8" font-size="13" font-weight="700" text-anchor="middle">多重图</text><text x="95" y="192" fill="#f87171" font-size="12" text-anchor="middle">平行边、自环：本课不用</text><text x="280" y="172" fill="#e8e8e8" font-size="13" font-weight="700" text-anchor="middle">完全图 K₄</text><text x="280" y="192" fill="#a1a1a0" font-size="12" text-anchor="middle">6 条边，每个顶点度为 3</text><text x="470" y="172" fill="#e8e8e8" font-size="13" font-weight="700" text-anchor="middle">DAG</text><text x="470" y="192" fill="#a1a1a0" font-size="12" text-anchor="middle">有向、无环</text></svg>
<figcaption>图 2　左：B、C 之间两条平行边，C 上一个自环。中：K₄ 有 4·3/2 = 6 条边。右：沿箭头走不出环。</figcaption>
</figure>

<h3>显式图与隐式图</h3>
<p><strong>显式图（explicit graph）</strong>：顶点和边事先全部给出，存成邻接矩阵或邻接表（7.2）。<strong>隐式图（implicit graph）</strong>：顶点和边不预先存储，<strong>搜索时按规则现场生成</strong>，典型是谜题：状态是顶点，合法动作是边。课上的倒水题有 8、5、3 升三个壶，从状态 (8, 0, 0) 只能倒出 (3, 5, 0) 和 (5, 0, 3)，这就是它的两个邻居；搜到哪个状态才生成它的邻居（7.9）。</p>

<h3>稠密与稀疏</h3>
<p>E 介于 0 和 V(V − 1)/2 之间。<strong>稠密图（dense graph）</strong>：E 接近 V²；<strong>稀疏图（sparse graph）</strong>：E 接近 V。同一个 O(V + E)，在稠密图上是 O(V²)，在稀疏图上是 O(V)。稠密图适合邻接矩阵，稀疏图适合邻接表（7.2）。</p>

<h2>度、路径与环</h2>
<table>
<thead><tr><th>术语</th><th>含义</th><th>图 1 中的例子</th></tr></thead>
<tbody>
<tr><td>相邻 / 邻居（adjacent / neighbour）</td><td>两个顶点之间有一条边</td><td>A 与 C 相邻；C 的邻居是 A、B、D</td></tr>
<tr><td>度（degree）deg(v)</td><td>连在 v 上的边数</td><td>deg(C) = 3，deg(B) = 2</td></tr>
<tr><td>孤立顶点（isolated vertex）</td><td>度为 0 的顶点</td><td>E</td></tr>
<tr><td>路径（path）</td><td>顶点序列，前后相邻的两个之间有边，顶点不重复</td><td>B–D–C–A，A–C–D，C–B–D</td></tr>
<tr><td>路径长度</td><td>经过的边数（带权图：边权之和）</td><td>B–D–C–A 的长度是 3</td></tr>
<tr><td>环（cycle）</td><td>回到起点的路径</td><td>B–C–D–B</td></tr>
<tr><td>子图（subgraph）</td><td>取一部分顶点，再取这些顶点之间的一部分边</td><td>顶点 A、B、C、E 和边 A–C、B–C</td></tr>
</tbody>
</table>
<p>无向图里 B–C–B <strong>不是环</strong>：来回走的是同一条边，所以简单无向图的环至少有 3 个顶点。子图中每条边的两个端点都必须在子图里：取了边 C–D 就必须取 D；从表中的子图再删掉 A–C，仍然是子图。</p>

<h3>有向图：入度与出度</h3>
<p>有向图分开数：<strong>入度（in-degree）</strong>是指向 v 的边数，<strong>出度（out-degree）</strong>是从 v 出发的边数。把图 1 的边改成有向（图 3）：B 有进来的边 C→B，出去的边 B→C、B→D，所以 in(B) = 1，out(B) = 2；E 的入度、出度都是 0。</p>
<figure class="fig">
<svg viewBox="0 0 480 240" width="480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="有向图：A→C、B→C、C→B、B→D、C→D，E 孤立；每个顶点标出入度和出度"><defs><marker id="g71-arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.6)"/></marker></defs><g stroke="rgba(255,255,255,0.35)" stroke-width="2"><line x1="98" y1="75" x2="199" y2="75" marker-end="url(#g71-arr2)"/><path d="M173,172.6 Q207.6,139.6 216,95.6" fill="none" marker-end="url(#g71-arr2)"/><path d="M207,87.4 Q172.4,120.4 164,164.4" fill="none" marker-end="url(#g71-arr2)"/><line x1="178" y1="185" x2="269" y2="185" marker-end="url(#g71-arr2)"/><line x1="229.7" y1="90.2" x2="278.7" y2="167.3" marker-end="url(#g71-arr2)"/></g><g fill="#343433" stroke="#5a5a59" stroke-width="2"><circle cx="80" cy="75" r="18"/><circle cx="160" cy="185" r="18"/><circle cx="220" cy="75" r="18"/><circle cx="290" cy="185" r="18"/><circle cx="410" cy="130" r="18"/></g><g fill="#e8e8e8" font-size="15" font-weight="700" text-anchor="middle"><text x="80" y="80">A</text><text x="160" y="190">B</text><text x="220" y="80">C</text><text x="290" y="190">D</text><text x="410" y="135">E</text></g><g font-size="13" font-weight="600" text-anchor="middle"><text x="80" y="45"><tspan fill="#38bdf8">入 0</tspan><tspan fill="#a1a1a0"> / </tspan><tspan fill="#fbbf24">出 1</tspan></text><text x="220" y="45"><tspan fill="#38bdf8">入 2</tspan><tspan fill="#a1a1a0"> / </tspan><tspan fill="#fbbf24">出 2</tspan></text><text x="160" y="228"><tspan fill="#38bdf8">入 1</tspan><tspan fill="#a1a1a0"> / </tspan><tspan fill="#fbbf24">出 2</tspan></text><text x="290" y="228"><tspan fill="#38bdf8">入 2</tspan><tspan fill="#a1a1a0"> / </tspan><tspan fill="#fbbf24">出 0</tspan></text><text x="410" y="100"><tspan fill="#38bdf8">入 0</tspan><tspan fill="#a1a1a0"> / </tspan><tspan fill="#fbbf24">出 0</tspan></text></g></svg>
<figcaption>图 3　图 1 的有向版本：A→C、B→C、C→B、B→D、C→D。蓝色是入度，黄色是出度。</figcaption>
</figure>
<p>有向路径必须顺着箭头：B→D 是路径，D→B 不是。<strong>B→C→B 在有向图中是环</strong>，因为 B→C 和 C→B 是两条不同的边，这一点和无向图正好相反。</p>

<h2>度数之和 = 2E</h2>
<p>把图 1 的度加起来：1 + 2 + 3 + 2 + 0 = 8，正好是边数 4 的 2 倍。原因：每条无向边 u–v 有两个端点，给 deg(u) 和 deg(v) 各贡献 1，在总和里<strong>恰好被数两次</strong>。所以对任何无向图：</p>
<p><strong>∑ deg(v) = 2E</strong>（对所有顶点求和）</p>
<p>推论：度数之和一定是偶数，<strong>奇数度的顶点一定有偶数个</strong>；平均度 = 2E/V。用它重新数完全图的边：每个顶点的度是 n − 1，总和 n(n − 1) = 2E，得 E = n(n − 1)/2。</p>
<p>有向图里每条边 u→v 只给 u 的出度加 1、给 v 的入度加 1，所以</p>
<p><strong>∑ in(v) = ∑ out(v) = E</strong></p>
<p>图 3：入度和 0 + 1 + 2 + 2 + 0 = 5，出度和 1 + 2 + 2 + 0 + 0 = 5，正好 5 条边。2016 年期末问过这两个和的关系：相等，都等于 E，理由是每条边恰好贡献一个出度和一个入度。</p>
<p>从边列表算度数的 C 代码就是这个论证本身：</p>
<pre><code>typedef struct {
    int u, v;                /* 无向图：边 u–v；有向图：边 u→v */
} edge_t;

/* 无向图：每条边给两个端点的度各加 1 */
void degrees(int nv, const edge_t e[], int ne, int deg[]) {
    for (int i = 0; i &lt; nv; i++) {
        deg[i] = 0;
    }
    for (int k = 0; k &lt; ne; k++) {
        deg[e[k].u]++;
        deg[e[k].v]++;       /* 一条边让总和 +2 */
    }
}

/* 有向图：u→v 给 u 的出度、v 的入度各加 1 */
void in_out_degrees(int nv, const edge_t e[], int ne, int in[], int out[]) {
    for (int i = 0; i &lt; nv; i++) {
        in[i] = out[i] = 0;
    }
    for (int k = 0; k &lt; ne; k++) {
        out[e[k].u]++;
        in[e[k].v]++;
    }
}

/* 用法：图 1，A=0, B=1, …, E=4 */
edge_t g1[] = { {0, 2}, {1, 2}, {1, 3}, {2, 3} };
int deg[5];
degrees(5, g1, 4, deg);      /* deg = {1, 2, 3, 2, 0}，总和 8 = 2 × 4 */</code></pre>
<p>两个函数都是初始化 V 个计数器、每条边处理一次，<strong>O(V + E)</strong>。循环每走一轮，度数总和加 2（无向），或入度和、出度和各加 1（有向），结束时正好是 2E 和 E。拓扑排序（7.8）第一步就这样算入度。</p>

<h2>连通性</h2>
<p>无向图中，<strong>任意两个顶点之间都有路径</strong>，图就是<strong>连通的（connected）</strong>；只要有一对顶点之间没有路径，就是<strong>不连通的（disconnected）</strong>。不连通的图由几块<strong>连通分量（connected component）</strong>组成：块内两两可达，块与块之间没有边。图 1 有 2 个连通分量：{A, B, C, D} 和 {E}，<strong>孤立顶点自成一个分量</strong>。</p>
<p>有向图要看方向：</p>
<ul>
<li><strong>强连通（strongly connected）</strong>：对任意两个顶点 u、v，既有 u 到 v 的有向路径，也有 v 到 u 的。</li>
<li><strong>弱连通（weakly connected）</strong>：去掉所有箭头、当成无向图之后是连通的。</li>
</ul>
<p>强连通一定弱连通，反之不成立，分类时答成立的最强一档。快速排除：顶点数 ≥ 2 时，只要有<strong>入度为 0 或出度为 0 的顶点</strong>，就不可能强连通（前者谁也到不了它，后者哪也去不了）。图 3 去掉 E 后忽略方向是连通的，但 A 的入度为 0、D 的出度为 0，只是弱连通；带上孤立的 E，连弱连通都不是。</p>
<figure class="fig">
<svg viewBox="0 0 560 210" width="560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="左：无向图有两个连通分量 {A,B,C} 和 {D,E}；中：有向环 A→B→C→A，强连通；右：A→B、B→C、A→C，只是弱连通"><defs><marker id="g71-arr4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.6)"/></marker></defs><g fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="5 4"><rect x="11" y="24" width="120" height="127" rx="16"/><rect x="140" y="24" width="46" height="127" rx="16"/></g><g stroke="rgba(255,255,255,0.35)" stroke-width="2"><line x1="36" y1="50" x2="106" y2="50"/><line x1="106" y1="50" x2="71" y2="125"/><line x1="36" y1="50" x2="71" y2="125"/><line x1="163" y1="50" x2="163" y2="125"/><line x1="266" y1="50" x2="311" y2="50" marker-end="url(#g71-arr4)"/><line x1="322.5" y1="64.1" x2="298.9" y2="108.2" marker-end="url(#g71-arr4)"/><line x1="282.5" y1="110.9" x2="258.9" y2="66.8" marker-end="url(#g71-arr4)"/><line x1="446" y1="50" x2="491" y2="50" marker-end="url(#g71-arr4)"/><line x1="502.5" y1="64.1" x2="478.9" y2="108.2" marker-end="url(#g71-arr4)"/><line x1="437.5" y1="64.1" x2="461.1" y2="108.2" marker-end="url(#g71-arr4)"/></g><g fill="#343433" stroke="#5a5a59" stroke-width="2"><circle cx="36" cy="50" r="16"/><circle cx="106" cy="50" r="16"/><circle cx="71" cy="125" r="16"/><circle cx="163" cy="50" r="16"/><circle cx="163" cy="125" r="16"/><circle cx="250" cy="50" r="16"/><circle cx="330" cy="50" r="16"/><circle cx="290" cy="125" r="16"/><circle cx="430" cy="50" r="16"/><circle cx="510" cy="50" r="16"/><circle cx="470" cy="125" r="16"/></g><g fill="#e8e8e8" font-size="14" font-weight="700" text-anchor="middle"><text x="36" y="55">A</text><text x="106" y="55">B</text><text x="71" y="130">C</text><text x="163" y="55">D</text><text x="163" y="130">E</text><text x="250" y="55">A</text><text x="330" y="55">B</text><text x="290" y="130">C</text><text x="430" y="55">A</text><text x="510" y="55">B</text><text x="470" y="130">C</text></g><text x="95" y="178" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">2 个连通分量</text><text x="95" y="198" fill="#a1a1a0" font-size="12" text-anchor="middle">{A, B, C} 与 {D, E}</text><text x="290" y="178" fill="#4ade80" font-size="13" font-weight="700" text-anchor="middle">强连通</text><text x="290" y="198" fill="#a1a1a0" font-size="12" text-anchor="middle">任意两点互相可达</text><text x="470" y="178" fill="#fbbf24" font-size="13" font-weight="700" text-anchor="middle">弱连通</text><text x="470" y="198" fill="#a1a1a0" font-size="12" text-anchor="middle">忽略方向才连通；C 到不了 A</text></svg>
<figcaption>图 4　左：无向图，虚线框出两个连通分量。中：有向环，每个顶点都能沿箭头到达其余顶点。右：去掉方向是连通的，但 C 没有出边。</figcaption>
</figure>

<h2>考试怎么考</h2>
<ul>
<li><strong>术语选择题、判断题</strong>：度、路径、环、子图、连通分量、强/弱连通、完全图、简单图、DAG 的定义公式表上没有，必须记住。</li>
<li><strong>度数和</strong>：∑deg = 2E；有向图 ∑in = ∑out = E（2016 原题），要写出“每条边贡献一个出度、一个入度”的理由。变形：给度数序列问是否可能，给度数求边数。</li>
<li><strong>边数上限</strong>：无向完全图 n(n − 1)/2，有向 n(n − 1)，可用公式表上的等差数列求和推出。</li>
<li><strong>稠密与稀疏</strong>：把复杂度改写成 E = V² 或 E = V 时的形式，2015、2016 都考过。例如 Θ(V³)：稠密图 V = E<sup>1/2</sup>，得 Θ(E<sup>3/2</sup>)；稀疏图得 Θ(E³)。</li>
<li><strong>建模</strong>：说明顶点、边各是什么，有向还是无向、带不带权，并写出假设；隐式图要说清状态和动作。</li>
<li>2016 有判断题问：对无向图只做一次 DFS，是否一定能访问全部顶点？答案是<strong>否</strong>：图可能不连通，一次遍历只走遍起点所在的连通分量。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>度数和写成 E（应为 2E）；把入度和与出度和加起来说“等于 E”（加起来是 2E）；把无向图的 B–C–B 当成环，或把有向图的 B→C、C→B 当成同一条边；漏数孤立顶点这个连通分量；把“弱连通”当成“不连通”。</p>
</div>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">下面哪些度数序列可以是某个简单无向图的度数？(a) 3, 3, 2, 2, 1　(b) 4, 3, 2, 2, 1　(c) 4, 4, 1, 1, 0　(d) 3, 3, 3, 3</summary>
<div class="qa__body">
<p>(a) 和为 11，是奇数，而度数和必须等于 2E。<strong>不可能</strong>。</p>
<p>(b) 和为 12，E = 6。构造：A 连 B、C、D、E，再加 B–C、B–D，共 6 条边，度数依次为 4、3、2、2、1。<strong>可能</strong>。</p>
<p>(c) 和为 10，是偶数，但仍然不行：5 个顶点的简单图中，度为 4 的顶点必须和其余 4 个顶点都相邻，包括度为 0 的那个，矛盾。<strong>不可能</strong>。</p>
<p>(d) 4 个顶点、每个度都是 3 = n − 1，就是完全图 K₄（图 2），E = 12/2 = 6。<strong>可能</strong>。</p>
<p>答案 (b)、(d)。度数和为偶数只是必要条件，(c) 说明它不充分。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">有向图 G 的边为 A→B、A→C、B→C、C→A、D→C。(a) 写出每个顶点的入度和出度。(b) 对任意有向图，所有顶点的出度之和与入度之和是什么关系？为什么？(c) 某有向图有 10 个顶点，每个顶点的出度都是 3，它有几条边？平均入度是多少？</summary>
<div class="qa__body">
<p>(a)</p>
<table>
<thead><tr><th>顶点</th><th>入度（来自）</th><th>出度（指向）</th></tr></thead>
<tbody>
<tr><td>A</td><td>1（C→A）</td><td>2（A→B、A→C）</td></tr>
<tr><td>B</td><td>1（A→B）</td><td>1（B→C）</td></tr>
<tr><td>C</td><td>3（A→C、B→C、D→C）</td><td>1（C→A）</td></tr>
<tr><td>D</td><td>0</td><td>1（D→C）</td></tr>
</tbody>
</table>
<p>入度和 1 + 1 + 3 + 0 = 5，出度和 2 + 1 + 1 + 1 = 5，边数 5。</p>
<p>(b) <strong>相等，都等于 E</strong>。每条边 u→v 恰好给 u 的出度加 1、给 v 的入度加 1；按出度求和与按入度求和，都是把每条边各数一次。</p>
<p>(c) E = ∑out = 10 × 3 = <strong>30</strong>。∑in 也是 30，平均入度 30/10 = <strong>3</strong>，但单个顶点的入度可以不是 3。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">判断对错：(1) 无向图所有顶点的度数之和一定是偶数。(2) 6 个顶点的简单无向图中可能有度为 6 的顶点。(3) 强连通的有向图一定是弱连通的。(4) 有向图中同时有 A→B 和 B→A，就不是简单图。(5) 上一题的图 G 是强连通的。(6) 从图中删去任意一条边，得到的是原图的子图。</summary>
<div class="qa__body">
<p>(1) <strong>对</strong>：∑deg = 2E。</p>
<p>(2) <strong>错</strong>：没有自环和平行边，一个顶点最多与其余 5 个顶点各连一条边，度 ≤ 5。</p>
<p>(3) <strong>对</strong>：u 到 v 的有向路径去掉方向后仍是路径。</p>
<p>(4) <strong>错</strong>：方向不同是两条不同的边，简单有向图允许；不允许的是自环和同方向的重复边。</p>
<p>(5) <strong>错</strong>：D 的入度为 0，没有顶点能到达 D。去掉方向后 D–C 把 D 接了进来，所以 G 是<strong>弱连通</strong>的；它含环 A→B→C→A，也不是 DAG。</p>
<p>(6) <strong>对</strong>：顶点全部保留，边是原图的一部分。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">简单无向图有 20 个顶点。(a) 最多有几条边？这时每个顶点的度是多少？(b) 已用 degrees() 算出 deg[]，写 C 函数 <code>int is_complete(int nv, const int deg[])</code> 判断该图是否为完全图，并说明为什么只看度数就够。(c) 某算法在邻接表上是 O(V + E)，在邻接矩阵上是 O(V²)。E ≈ V² 和 E ≈ V 时各是什么量级？</summary>
<div class="qa__body">
<p>(a) 完全图时最多：20 × 19 / 2 = <strong>190</strong> 条，每个顶点的度是 <strong>19</strong>。验证：20 × 19 = 380 = 2 × 190。</p>
<p>(b)</p>
<pre><code>int is_complete(int nv, const int deg[]) {
    for (int i = 0; i &lt; nv; i++) {
        if (deg[i] != nv - 1) {
            return 0;        /* 有顶点没和所有其他顶点相邻 */
        }
    }
    return 1;
}</code></pre>
<p>简单图中 deg(v) = n − 1 当且仅当 v 和其余每个顶点都相邻；所有顶点都满足，就是每一对顶点都相邻，即完全图。时间 O(V)。多重图里度数可能来自平行边，这个判断就不成立。</p>
<p>(c) E ≈ V²：邻接表 O(V + V²) = O(V²)，矩阵也是 O(V²)，两者一样。E ≈ V：邻接表 O(V)，矩阵仍是 O(V²)。差距只出现在稀疏图上，所以稀疏图用邻接表。</p>
</div>
</details>
`;

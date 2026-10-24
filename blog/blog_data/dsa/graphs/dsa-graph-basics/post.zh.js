/* Post body — dsa-graph-basics / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-graph-basics:zh'] = `
<p class="lead">图（graph）由顶点和边组成，表示“谁和谁有关系”：它分哪几类，度、路径、环、连通分量怎么数，以及常考的<strong>度数之和 = 2E</strong>、<strong>入度和 = 出度和 = E</strong>。</p>

<h2>从一个场景说起</h2>
<p>打开一张航班地图：每个城市是一个点，两个城市之间有直飞航班就连一条线。课上的航班图里，Adelaide 和 Darwin 之间没有线：没有直飞，只能中转。</p>
<p>“能不能飞到”“最少转几次”“怎么飞最便宜”，这些问题只关心<strong>哪些城市之间连着线</strong>，和城市画在哪儿无关。</p>
<p>数组、链表是一个接一个排成一列，树是一层管一层，都表示不了这种“谁都可能连着谁”的关系。这就要用图。</p>

<h2>它是什么</h2>
<p>简单说，图就是<strong>一些点，加上连接其中一些点对的线</strong>。点叫<strong>顶点（vertex，也叫 node）</strong>，线叫<strong>边（edge）</strong>，写成 G = (V, E)。本课在复杂度里直接用 V、E 表示<strong>顶点数和边数</strong>，写 O(V + E)，不写 |V|、|E|。</p>
<p>每条边可以从两个角度看，图也就按这两点分类：</p>
<ul>
<li><strong>有没有方向。</strong>“互相认识”是对称的，画成线 A–B，这是<strong>无向图（undirected graph）</strong>。“关注（follow）”是单向的，A 关注 B 不代表 B 关注 A，画成箭头 A→B，只能顺着箭头走，这是<strong>有向图（directed graph）</strong>。A→B 和 B→A 是<strong>两条不同的边</strong>，互关就是两条都有。</li>
<li><strong>边上有没有数。</strong>航班的边可以标上票价或飞行时间，这是<strong>带权图（weighted graph）</strong>；边只表示“连着”的是<strong>无权图（unweighted graph）</strong>。路径长度在无权图里是<strong>边数</strong>，在带权图里是<strong>边权之和</strong>。本课默认边权 ≥ 0；Floyd-Warshall（7.6）例外，允许负权边，但不能有负权环。</li>
</ul>
<p>本课只用<strong>简单图（simple graph）</strong>：没有<strong>自环（self-loop，顶点连向自己）</strong>，同一对顶点之间最多一条边（有向图每个方向最多一条）。允许这两样的叫<strong>多重图（multigraph）</strong>，本课不用。</p>

<h2>看个例子</h2>
<p>课上一直用这个图：</p>
<pre><code class="lang-text">顶点集 V = {A, B, C, D, E}
边集   E = {A–C, B–C, B–D, C–D}      顶点 E 不在任何边上</code></pre>
<figure class="fig">
<svg viewBox="0 0 480 240" width="480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="5 个顶点的无向图：边 A–C、B–C、B–D、C–D，E 孤立；度数 A1、B2、C3、D2、E0"><g stroke="rgba(255,255,255,0.35)" stroke-width="2"><line x1="80" y1="75" x2="220" y2="75"/><line x1="160" y1="185" x2="220" y2="75"/><line x1="160" y1="185" x2="290" y2="185"/><line x1="220" y1="75" x2="290" y2="185"/></g><g fill="#343433" stroke="#5a5a59" stroke-width="2"><circle cx="80" cy="75" r="18"/><circle cx="160" cy="185" r="18"/><circle cx="220" cy="75" r="18"/><circle cx="290" cy="185" r="18"/><circle cx="410" cy="130" r="18"/></g><g fill="#e8e8e8" font-size="15" font-weight="700" text-anchor="middle"><text x="80" y="80">A</text><text x="160" y="190">B</text><text x="220" y="80">C</text><text x="290" y="190">D</text><text x="410" y="135">E</text></g><g fill="#fbbf24" font-size="13" font-weight="600" text-anchor="middle"><text x="80" y="45">deg 1</text><text x="220" y="45">deg 3</text><text x="160" y="228">deg 2</text><text x="290" y="228">deg 2</text><text x="410" y="100">deg 0</text></g><text x="410" y="170" fill="#a1a1a0" font-size="12" text-anchor="middle">孤立顶点</text></svg>
<figcaption>图 1　课上的例子，V = 5，E = 4。黄色数字是每个顶点的度。</figcaption>
</figure>
<p><strong>邻居和度。</strong>有边相连的两个顶点<strong>相邻（adjacent）</strong>，互为<strong>邻居（neighbour）</strong>：C 的邻居是 A、B、D。顶点上连着几条边，就是它的<strong>度（degree）</strong>：deg(C) = 3，deg(A) = 1。E 的度为 0，叫<strong>孤立顶点（isolated vertex）</strong>。简单图里一个顶点最多连其余 n − 1 个顶点，所以<strong>度 ≤ n − 1</strong>。</p>
<p><strong>路径和环。</strong><strong>路径（path）</strong>是沿着边一步步走出的顶点序列，顶点不重复，比如 B–D–C–A，走了 3 条边，长度是 3。走一圈回到起点是<strong>环（cycle）</strong>，比如 B–C–D–B。但 B–C–B <strong>不是环</strong>，那只是同一条边走过去又走回来，所以简单无向图的环至少要 3 个顶点。</p>
<p><strong>连通分量。</strong>A、B、C、D 两两之间都有路径，E 谁也到不了。“内部互相走得通”的一块叫<strong>连通分量（connected component）</strong>，图 1 有 2 个：{A, B, C, D} 和 {E}，<strong>孤立顶点自己算一个</strong>。只有一个分量的图是<strong>连通的（connected）</strong>，否则是<strong>不连通的（disconnected）</strong>。</p>
<p><strong>子图。</strong>挑出一部分顶点，再挑它们之间的一部分边，就是<strong>子图（subgraph）</strong>，比如顶点 A、B、C、E 加边 A–C、B–C。规矩是挑了一条边，两个端点都得挑上。</p>

<h3>度数之和 = 2E</h3>
<p>把图 1 的度加起来：1 + 2 + 3 + 2 + 0 = 8，正好是边数 4 的 2 倍。</p>
<p>想象一场聚会，每人记下自己握了几次手，再把所有人的数加起来。每次握手有两个人，各记一次，所以总数一定是握手次数的 2 倍。边就是握手，度就是每人记的数：</p>
<p><strong>∑ deg(v) = 2E</strong>（任何无向图都成立）</p>
<p>所以度数之和一定是偶数，<strong>奇数度的顶点一定有偶数个</strong>。</p>
<p><strong>完全图（complete graph）</strong>是每一对顶点之间都有边。n 个顶点的度都是 n − 1，n(n − 1) = 2E，得 <strong>E = n(n − 1)/2</strong>。这是简单无向图边数的上限，所以总有 <strong>E = O(V²)</strong>。</p>

<h2>有向图：入度和出度</h2>
<p>有向图分开数：<strong>入度（in-degree）</strong>是指向 v 的边数，<strong>出度（out-degree）</strong>是从 v 出去的边数。拿“关注”对照：出度是关注数，入度是粉丝数。</p>
<p>把图 1 的边加上方向，再加一条 C→B，得到图 2。B 有进来的 C→B，出去的 B→C、B→D，所以 in(B) = 1，out(B) = 2。</p>
<figure class="fig">
<svg viewBox="0 0 480 240" width="480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="有向图：A→C、B→C、C→B、B→D、C→D，E 孤立；每个顶点标出入度和出度"><defs><marker id="g71-arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.6)"/></marker></defs><g stroke="rgba(255,255,255,0.35)" stroke-width="2"><line x1="98" y1="75" x2="199" y2="75" marker-end="url(#g71-arr2)"/><path d="M173,172.6 Q207.6,139.6 216,95.6" fill="none" marker-end="url(#g71-arr2)"/><path d="M207,87.4 Q172.4,120.4 164,164.4" fill="none" marker-end="url(#g71-arr2)"/><line x1="178" y1="185" x2="269" y2="185" marker-end="url(#g71-arr2)"/><line x1="229.7" y1="90.2" x2="278.7" y2="167.3" marker-end="url(#g71-arr2)"/></g><g fill="#343433" stroke="#5a5a59" stroke-width="2"><circle cx="80" cy="75" r="18"/><circle cx="160" cy="185" r="18"/><circle cx="220" cy="75" r="18"/><circle cx="290" cy="185" r="18"/><circle cx="410" cy="130" r="18"/></g><g fill="#e8e8e8" font-size="15" font-weight="700" text-anchor="middle"><text x="80" y="80">A</text><text x="160" y="190">B</text><text x="220" y="80">C</text><text x="290" y="190">D</text><text x="410" y="135">E</text></g><g font-size="13" font-weight="600" text-anchor="middle"><text x="80" y="45"><tspan fill="#38bdf8">入 0</tspan><tspan fill="#a1a1a0"> / </tspan><tspan fill="#fbbf24">出 1</tspan></text><text x="220" y="45"><tspan fill="#38bdf8">入 2</tspan><tspan fill="#a1a1a0"> / </tspan><tspan fill="#fbbf24">出 2</tspan></text><text x="160" y="228"><tspan fill="#38bdf8">入 1</tspan><tspan fill="#a1a1a0"> / </tspan><tspan fill="#fbbf24">出 2</tspan></text><text x="290" y="228"><tspan fill="#38bdf8">入 2</tspan><tspan fill="#a1a1a0"> / </tspan><tspan fill="#fbbf24">出 0</tspan></text><text x="410" y="100"><tspan fill="#38bdf8">入 0</tspan><tspan fill="#a1a1a0"> / </tspan><tspan fill="#fbbf24">出 0</tspan></text></g></svg>
<figcaption>图 2　A→C、B→C、C→B、B→D、C→D。蓝色是入度，黄色是出度。</figcaption>
</figure>
<p>每一次关注，都让一个人的关注数 +1、另一个人的粉丝数 +1。所以关注数之和、粉丝数之和都等于关注的总次数：</p>
<p><strong>∑ in(v) = ∑ out(v) = E</strong></p>
<p>核对图 2：入度和 0 + 1 + 2 + 2 + 0 = 5，出度和 1 + 2 + 2 + 0 + 0 = 5，正好 5 条边。两个和<strong>各自</strong>等于 E，加起来是 2E。</p>
<p>拿到边列表算入度、出度，也就是照这句话做：每条边让起点出度 +1、终点入度 +1，<strong>O(V + E)</strong>。拓扑排序（7.8）第一步就这样算入度。</p>
<p>有向图的路径和环要顺着箭头：B→D 是路径，D→B 不是。<strong>B→C→B 在有向图里是环</strong>，因为 B→C 和 C→B 是两条不同的边，正好和无向图相反。</p>

<h3>强连通与弱连通</h3>
<p>有向图的“连通”分两档：</p>
<ul>
<li><strong>强连通（strongly connected）</strong>：任意两个顶点 u、v，顺着箭头 u 能到 v，v 也能到 u。</li>
<li><strong>弱连通（weakly connected）</strong>：把箭头全去掉、当成无向图，是连通的。</li>
</ul>
<p>强连通一定弱连通，反过来不行，分类时答成立的最强一档。快速判断：顶点数 ≥ 2 时，只要有顶点<strong>入度为 0</strong>（谁都到不了它）或<strong>出度为 0</strong>（它哪儿也去不了），就<strong>不可能强连通</strong>。图 2 去掉 E 后，A 入度为 0，只是弱连通；带上孤立的 E，连弱连通都不是。</p>
<figure class="fig">
<svg viewBox="0 0 560 210" width="560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="左：无向图有两个连通分量 {A,B,C} 和 {D,E}；中：有向环 A→B→C→A，强连通；右：A→B、B→C、A→C，只是弱连通"><defs><marker id="g71-arr4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.6)"/></marker></defs><g fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="5 4"><rect x="11" y="24" width="120" height="127" rx="16"/><rect x="140" y="24" width="46" height="127" rx="16"/></g><g stroke="rgba(255,255,255,0.35)" stroke-width="2"><line x1="36" y1="50" x2="106" y2="50"/><line x1="106" y1="50" x2="71" y2="125"/><line x1="36" y1="50" x2="71" y2="125"/><line x1="163" y1="50" x2="163" y2="125"/><line x1="266" y1="50" x2="311" y2="50" marker-end="url(#g71-arr4)"/><line x1="322.5" y1="64.1" x2="298.9" y2="108.2" marker-end="url(#g71-arr4)"/><line x1="282.5" y1="110.9" x2="258.9" y2="66.8" marker-end="url(#g71-arr4)"/><line x1="446" y1="50" x2="491" y2="50" marker-end="url(#g71-arr4)"/><line x1="502.5" y1="64.1" x2="478.9" y2="108.2" marker-end="url(#g71-arr4)"/><line x1="437.5" y1="64.1" x2="461.1" y2="108.2" marker-end="url(#g71-arr4)"/></g><g fill="#343433" stroke="#5a5a59" stroke-width="2"><circle cx="36" cy="50" r="16"/><circle cx="106" cy="50" r="16"/><circle cx="71" cy="125" r="16"/><circle cx="163" cy="50" r="16"/><circle cx="163" cy="125" r="16"/><circle cx="250" cy="50" r="16"/><circle cx="330" cy="50" r="16"/><circle cx="290" cy="125" r="16"/><circle cx="430" cy="50" r="16"/><circle cx="510" cy="50" r="16"/><circle cx="470" cy="125" r="16"/></g><g fill="#e8e8e8" font-size="14" font-weight="700" text-anchor="middle"><text x="36" y="55">A</text><text x="106" y="55">B</text><text x="71" y="130">C</text><text x="163" y="55">D</text><text x="163" y="130">E</text><text x="250" y="55">A</text><text x="330" y="55">B</text><text x="290" y="130">C</text><text x="430" y="55">A</text><text x="510" y="55">B</text><text x="470" y="130">C</text></g><text x="95" y="178" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">2 个连通分量</text><text x="95" y="198" fill="#a1a1a0" font-size="12" text-anchor="middle">{A, B, C} 与 {D, E}</text><text x="290" y="178" fill="#4ade80" font-size="13" font-weight="700" text-anchor="middle">强连通</text><text x="290" y="198" fill="#a1a1a0" font-size="12" text-anchor="middle">任意两点互相可达</text><text x="470" y="178" fill="#fbbf24" font-size="13" font-weight="700" text-anchor="middle">弱连通</text><text x="470" y="198" fill="#a1a1a0" font-size="12" text-anchor="middle">忽略方向才连通；C 到不了 A</text></svg>
<figcaption>图 3　左：无向图，虚线框出两个连通分量。中：有向环，强连通。右：去掉方向才连通，C 没有出边。</figcaption>
</figure>

<h2>其他几种图</h2>
<p><strong>有向完全图</strong>：每个有序对 (u, v)（u ≠ v）都能有一条边，上限是 <strong>n(n − 1)</strong>，是无向的 2 倍。</p>
<p><strong>有向无环图（directed acyclic graph, DAG）</strong>：有向，而且顺着箭头走永远回不到出发点。先修课关系必须是 DAG，否则环上的课一门都选不了。拓扑排序（7.8）只对 DAG 有定义。</p>
<figure class="fig">
<svg viewBox="0 0 560 205" width="560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="三种图：多重图（平行边和自环），完全图 K4，有向无环图"><defs><marker id="g71-arr3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.6)"/></marker></defs><g stroke="rgba(255,255,255,0.35)" stroke-width="2"><path d="M40,85 Q85,40 130,85" fill="none"/><path d="M40,85 Q85,130 130,85" fill="none"/><path d="M143,76 C182,52 182,118 143,94" fill="none"/><line x1="240" y1="45" x2="320" y2="45"/><line x1="240" y1="45" x2="240" y2="125"/><line x1="240" y1="45" x2="320" y2="125"/><line x1="320" y1="45" x2="240" y2="125"/><line x1="320" y1="45" x2="320" y2="125"/><line x1="240" y1="125" x2="320" y2="125"/><line x1="422.8" y1="75.4" x2="454.8" y2="51.4" marker-end="url(#g71-arr3)"/><line x1="422.8" y1="94.6" x2="454.8" y2="118.6" marker-end="url(#g71-arr3)"/><line x1="470" y1="56" x2="470" y2="111" marker-end="url(#g71-arr3)"/><line x1="482.8" y1="49.6" x2="514.8" y2="73.6" marker-end="url(#g71-arr3)"/><line x1="482.8" y1="120.4" x2="514.8" y2="96.4" marker-end="url(#g71-arr3)"/></g><g fill="#343433" stroke="#5a5a59" stroke-width="2"><circle cx="40" cy="85" r="16"/><circle cx="130" cy="85" r="16"/><circle cx="240" cy="45" r="16"/><circle cx="320" cy="45" r="16"/><circle cx="240" cy="125" r="16"/><circle cx="320" cy="125" r="16"/><circle cx="410" cy="85" r="16"/><circle cx="470" cy="40" r="16"/><circle cx="470" cy="130" r="16"/><circle cx="530" cy="85" r="16"/></g><g fill="#e8e8e8" font-size="14" font-weight="700" text-anchor="middle"><text x="40" y="90">B</text><text x="130" y="90">C</text><text x="240" y="50">A</text><text x="320" y="50">B</text><text x="240" y="130">C</text><text x="320" y="130">D</text><text x="410" y="90">A</text><text x="470" y="45">B</text><text x="470" y="135">C</text><text x="530" y="90">D</text></g><text x="95" y="172" fill="#e8e8e8" font-size="13" font-weight="700" text-anchor="middle">多重图</text><text x="95" y="192" fill="#f87171" font-size="12" text-anchor="middle">平行边、自环：本课不用</text><text x="280" y="172" fill="#e8e8e8" font-size="13" font-weight="700" text-anchor="middle">完全图 K₄</text><text x="280" y="192" fill="#a1a1a0" font-size="12" text-anchor="middle">6 条边，每个顶点度为 3</text><text x="470" y="172" fill="#e8e8e8" font-size="13" font-weight="700" text-anchor="middle">DAG</text><text x="470" y="192" fill="#a1a1a0" font-size="12" text-anchor="middle">有向、无环</text></svg>
<figcaption>图 4　左：平行边和自环。中：K₄ 有 4·3/2 = 6 条边。右：顺着箭头走不出环。</figcaption>
</figure>
<p><strong>显式图与隐式图</strong>：<strong>显式图（explicit graph）</strong>的顶点和边事先全部存好（邻接矩阵或邻接表，7.2）。<strong>隐式图（implicit graph）</strong>不预先存，<strong>搜索走到哪个顶点，才按规则现场生成它的邻居</strong>。典型是谜题：状态是顶点，一步合法操作是边。课上倒水题有 8、5、3 升三个壶，状态 (8, 0, 0) 只能倒出 (3, 5, 0) 和 (5, 0, 3)，这就是它的两个邻居（7.9）。</p>
<p><strong>稠密与稀疏</strong>：E 接近 V² 叫<strong>稠密图（dense graph）</strong>，E 接近 V 叫<strong>稀疏图（sparse graph）</strong>。同一个 O(V + E)，在稠密图上是 O(V²)，在稀疏图上是 O(V)。稠密图适合邻接矩阵，稀疏图适合邻接表（7.2）。</p>
<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/eQA-m22wjTQ" title="Graph Theory Introduction" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：WilliamFiset《Graph Theory Introduction》（英文），看 2:23–9:03 这段，用图过一遍无向、有向、带权、DAG、完全图；其中的树和二分图这里不展开，9:03 之后的存储方式见 7.2。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>选择、判断考术语</strong>：度、路径、环、子图、连通分量、强/弱连通、完全图、简单图、DAG。公式表上没有，要记住。</li>
<li><strong>度数和</strong>：给一串度数问可不可能，或由度数求边数；有向图问入度和与出度和的关系（2016 考过），要写出“每条边贡献一个出度、一个入度”这个理由。</li>
<li><strong>稠密 / 稀疏改写复杂度</strong>（2015、2016 都考过）：比如 Θ(V³)，稠密图 E ≈ V²，V = E<sup>1/2</sup>，得 Θ(E<sup>3/2</sup>)；稀疏图 E ≈ V，得 Θ(E³)。</li>
<li><strong>建模题</strong>：说清顶点、边各是什么，有没有方向、带不带权，并写出假设。课上的例子：雨天走几间教室、尽量少淋雨。步行时间是边权；下楼比上楼快，选<strong>有向带权图</strong>；假设往返一样，无向带权图也算对。<strong>看的是理由</strong>。</li>
<li>2016 判断题：对无向图做一次 DFS 一定能访问全部顶点吗？<strong>不一定</strong>，图可能不连通，一次遍历只走遍起点所在的分量。</li>
</ul>

<h3>例题 1：度数序列</h3>
<p>哪些度数序列可能来自某个简单无向图？(a) 3, 3, 2, 2, 1　(b) 4, 3, 2, 2, 1　(c) 4, 4, 1, 1, 0　(d) 3, 3, 3, 3</p>
<ul>
<li>(a) 和为 11，是奇数，不可能等于 2E。<strong>不可能</strong>。</li>
<li>(b) 和为 12，E = 6。画一个：A 连 B、C、D、E，再加 B–C、B–D，度数正是 4、3、2、2、1。<strong>可能</strong>。</li>
<li>(c) 和为 10，是偶数，但 5 个顶点里度为 4 的顶点必须和其余 4 个都相邻，包括度为 0 的那个，矛盾。<strong>不可能</strong>。</li>
<li>(d) 每个度都是 3 = n − 1，就是 K₄（图 4），E = 6。<strong>可能</strong>。</li>
</ul>
<p>答案 (b)、(d)。(c) 说明度数和为偶数只是必要条件。</p>

<h3>例题 2：入度、出度与连通性</h3>
<p>有向图的边是 A→B、A→C、B→C、C→A、D→C。写出各顶点的入度、出度，并判断连通性。</p>
<table>
<thead><tr><th>顶点</th><th>入度（来自）</th><th>出度（指向）</th></tr></thead>
<tbody>
<tr><td>A</td><td>1（C→A）</td><td>2（A→B、A→C）</td></tr>
<tr><td>B</td><td>1（A→B）</td><td>1（B→C）</td></tr>
<tr><td>C</td><td>3（A→C、B→C、D→C）</td><td>1（C→A）</td></tr>
<tr><td>D</td><td>0</td><td>1（D→C）</td></tr>
</tbody>
</table>
<p>入度和 1 + 1 + 3 + 0 = 5，出度和 2 + 1 + 1 + 1 = 5，都等于边数。D 的入度为 0，谁都到不了 D，<strong>不是强连通</strong>；去掉方向后 D–C 把 D 接进来，是<strong>弱连通</strong>。它含环 A→B→C→A，也不是 DAG。</p>

<div class="callout warn" data-label="易错">
<ul>
<li>度数和写成 E（应为 2E）；把入度和、出度和加起来说“等于 E”（加起来是 2E）。</li>
<li>把无向图的 B–C–B 当成环；把有向图的 B→C、C→B 当成同一条边。</li>
<li>漏数孤立顶点这个连通分量；把“弱连通”当成“不连通”。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>图 = 顶点 + 边，G = (V, E)；复杂度里的 V、E 是顶点数和边数。</li>
<li>有向 / 无向看方向，带权 / 无权看边上的数；本课只用简单图，度 ≤ n − 1。</li>
<li>无向图 <strong>∑deg = 2E</strong>（每条边两端各数一次）；有向图 <strong>∑in = ∑out = E</strong>。</li>
<li>完全图 n(n − 1)/2 条边（有向 n(n − 1)），E = O(V²)；稠密 E ≈ V²，稀疏 E ≈ V。</li>
<li>无向图 B–C–B 不是环，有向图 B→C→B 是；孤立顶点自成一个连通分量。</li>
<li>强连通一定弱连通；有入度或出度为 0 的顶点就不可能强连通。</li>
</ul>
`;

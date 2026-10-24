/* Post body — dsa-mst-prim / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-mst-prim:zh'] = `
<p class="lead">最小生成树（Minimum Spanning Tree, MST）是把图里所有顶点连起来、总边权最小的那组边。Prim 算法从一个顶点出发，每次接上一条最便宜的“往外连”的边；写成代码，就是 Dijkstra 换了一个键。</p>

<h2>从一个场景说起</h2>
<p>校园里有 6 栋楼，要用光纤把它们全部连通。哪两栋楼之间能铺线、每段花多少钱，都已经知道。</p>
<p>不用每两栋楼都直连：A 连 B、B 连 C，A 和 C 就通了，信号经过 B 转一下就行。所以问题是：<strong>选哪几段线，能让所有楼连通，总花费又最少？</strong></p>
<p>换成图的说法：楼是顶点，能铺的线路是带权的边，权重就是成本。</p>

<h2>它是什么</h2>
<p>先想想最省钱的方案长什么样。如果已经全部连通，再多铺一段，一定会绕出一个圈；圈上随便拆掉一段，大家照样连通，那段钱就白花了。所以最省钱的方案里<strong>没有环</strong>，它是一棵树。</p>
<p>简单说，<strong>生成树（spanning tree）</strong>就是从原图里挑出一部分边，把所有顶点连成一棵树。它有三个特点：</p>
<ul>
<li><strong>包含全部 V 个顶点</strong>，一栋楼都不漏；</li>
<li><strong>连通</strong>，任意两栋楼之间都有路；</li>
<li><strong>恰好 V − 1 条边，没有环</strong>。从一栋楼开始，每接进一栋新楼正好要一段线，接完其余 V − 1 栋就是 V − 1 段。少一段就有楼连不上，多一段就成环。</li>
</ul>
<p>一张图通常有很多棵生成树，<strong>最小生成树</strong>就是其中总边权最小的那棵。它针对<strong>连通的无向带权图</strong>。边权有相等时，MST 可能不止一棵，但它们的<strong>总权重都一样</strong>。</p>
<p>Prim 算法（Prim's algorithm）找 MST 的办法，像一个村子慢慢往外扩：</p>
<ul>
<li>随便挑一栋楼当起点，它就是只有一栋楼的“村子”，也就是当前的树；</li>
<li>看所有<strong>一端在村里、一端在村外</strong>的线路，这种边叫<strong>跨越边（crossing edge）</strong>；</li>
<li>铺上其中<strong>最便宜</strong>的一条，村外那栋楼就进了村；</li>
<li>重复，直到所有楼都进村。</li>
</ul>
<p>每一步只挑眼前最便宜的，铺了就不再改，这叫<strong>贪心算法（greedy algorithm）</strong>。对 MST 来说，这样贪心得到的一定是最优解。</p>

<h2>看个例子</h2>
<h3>手算：从 A 出发</h3>
<p>课上沿用 7.5 Dijkstra 那张无向带权图：</p>
<figure class="fig">
<svg viewBox="0 0 480 240" width="480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="6 顶点带权无向图及其最小生成树">
<line x1="36" y1="120" x2="116" y2="40" stroke="#4ade80" stroke-width="3"/>
<line x1="36" y1="120" x2="196" y2="200" stroke="#4ade80" stroke-width="3"/>
<line x1="116" y1="40" x2="366" y2="40" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-dasharray="5 4"/>
<line x1="116" y1="40" x2="196" y2="200" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-dasharray="5 4"/>
<line x1="196" y1="200" x2="286" y2="200" stroke="#4ade80" stroke-width="3"/>
<line x1="286" y1="200" x2="366" y2="40" stroke="#4ade80" stroke-width="3"/>
<line x1="286" y1="200" x2="446" y2="120" stroke="#4ade80" stroke-width="3"/>
<line x1="366" y1="40" x2="446" y2="120" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-dasharray="5 4"/>
<text x="68.2" y="72.2" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">2</text>
<text x="111.1" y="169.8" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">3</text>
<text x="241" y="29" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#a1a1a0">5</text>
<text x="165.8" y="115.1" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#a1a1a0">4</text>
<text x="241" y="211" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">1</text>
<text x="316.2" y="115.1" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">2</text>
<text x="370.9" y="169.8" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">4</text>
<text x="413.8" y="72.2" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#a1a1a0">6</text>
<circle cx="36" cy="120" r="18" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<text x="36" y="120" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">A</text>
<circle cx="116" cy="40" r="18" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<text x="116" y="40" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">C</text>
<circle cx="196" cy="200" r="18" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<text x="196" y="200" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">F</text>
<circle cx="286" cy="200" r="18" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<text x="286" y="200" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">B</text>
<circle cx="366" cy="40" r="18" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<text x="366" y="40" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">D</text>
<circle cx="446" cy="120" r="18" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<text x="446" y="120" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">E</text>
</svg>
<figcaption>边：A–C 2，A–F 3，C–D 5，C–F 4，F–B 1，B–D 2，B–E 4，D–E 6。绿色实线 = MST，总权重 12</figcaption>
</figure>
<p>从 A 开始，每一步列出全部跨越边，挑最便宜的：</p>
<table>
<thead><tr><th>步</th><th>村里的顶点</th><th>跨越边</th><th>选中</th></tr></thead>
<tbody>
<tr><td>1</td><td>A</td><td>A–C 2，A–F 3</td><td>A–C 2</td></tr>
<tr><td>2</td><td>A, C</td><td>A–F 3，C–F 4，C–D 5</td><td>A–F 3</td></tr>
<tr><td>3</td><td>A, C, F</td><td>F–B 1，C–D 5</td><td>F–B 1</td></tr>
<tr><td>4</td><td>A, B, C, F</td><td>B–D 2，B–E 4，C–D 5</td><td>B–D 2</td></tr>
<tr><td>5</td><td>A, B, C, D, F</td><td>B–E 4，D–E 6</td><td>B–E 4</td></tr>
</tbody>
</table>
<p>第 1 步，村里只有 A，只能选 A–C 或 A–F，选便宜的 A–C。第 2 步，C 进了村，C–F、C–D 也成了候选，但 A–F 3 仍最便宜。</p>
<p>第 3 步要留意：C–F 已经<strong>不是</strong>跨越边了。C 和 F 都在村里，再铺就成环 A–C–F。</p>
<p>5 步、5 条边，正好 V − 1。总权重 2 + 3 + 1 + 2 + 4 = <strong>12</strong>。对比一下，A–C、C–D、D–E、E–B、B–F 也是一棵生成树，总权重却是 18。</p>

<h3>程序里怎么记：每个顶点一个 cost</h3>
<p>手算时每一步都把跨越边重列一遍。程序不这么做，而是给每个顶点记三样东西：</p>
<ul>
<li><code>inMST[v]</code>：v 是否已经在树里；</li>
<li><code>cost[v]</code>：<strong>把 v 接到当前树上，最便宜的那条边的权重</strong>；还没有边连到树上就是 ∞；</li>
<li><code>from[v]</code>：那条边在树里的一端。最后，MST 的边就是所有的 (from[v], v)。</li>
</ul>
<p>树外的顶点按 cost 放进优先队列（priority queue, PQ），和 Dijkstra 一样（见 7.5）。每一轮做两件事：</p>
<ol>
<li>从 PQ 取出 cost 最小的顶点 u（deleteMin），标记它进树。这时进入 MST 的是边 (from[u], u)；</li>
<li>看 u 的每个树外邻居 v：如果 <strong>w(u, v) &lt; cost[v]</strong>，说明找到了接 v 的更便宜的边，就把 cost[v] 改成 w(u, v)，from[v] 改成 u。</li>
</ol>
<p>有边连到树上、自己还没进树的顶点，2015 年考题叫它 <strong>fringe</strong>，PQ 里放的就是它们。课上的实现例子从 C 出发：</p>
<table>
<thead><tr><th>轮</th><th>取出</th><th>加入的边</th><th>更新树外邻居（cost/from）</th><th>之后的 PQ</th></tr></thead>
<tbody>
<tr><td>0</td><td>C 0</td><td>—</td><td>A：2/C；D：5/C；F：4/C</td><td>{A2, F4, D5}</td></tr>
<tr><td>1</td><td>A 2</td><td>C–A 2</td><td>F：3 &lt; 4 → 3/A</td><td>{F3, D5}</td></tr>
<tr><td>2</td><td>F 3</td><td>A–F 3</td><td>B：1/F</td><td>{B1, D5}</td></tr>
<tr><td>3</td><td>B 1</td><td>F–B 1</td><td>D：2 &lt; 5 → 2/B；E：4/B</td><td>{D2, E4}</td></tr>
<tr><td>4</td><td>D 2</td><td>B–D 2</td><td>E：6 ≥ 4，不变</td><td>{E4}</td></tr>
<tr><td>5</td><td>E 4</td><td>B–E 4</td><td>—</td><td>{}</td></tr>
</tbody>
</table>
<p>结果是同一棵 MST，总权重 12。看第 1 轮：F 本来的 cost 是 4（经 C–F），A 进树后出现了更便宜的 A–F 3，F 就改成 3/A。这和 Dijkstra 里把距离改小是同一个动作。</p>
<iframe class="anim-frame" src="blog/blog_data/dsa-mst-prim/anims/prim.html" loading="lazy" style="height: 560px;" title="Prim 逐步演示"></iframe>
<p class="anim-caption">上方按钮切换“Prim·从 A”“Prim·从 C”和“Dijkstra·从 C”。蓝色实线是决定各顶点当前 cost 的边，蓝色虚线是其他跨越边，顶点下方是当前的键。</p>
<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/cplfcGZmX7I" title="Prim's algorithm in 2 minutes" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Michael Sambol《Prim's algorithm in 2 minutes》（英文），两分钟在另一张图上把“每次加最便宜的跨越边”完整走一遍。</p>

<h2>和 Dijkstra 只差一个键</h2>
<p>Prim 和 Dijkstra 的流程一模一样：取 PQ 里最小的、标记、更新邻居。<strong>唯一的区别是 PQ 的键</strong>：</p>
<ul>
<li>Dijkstra：从起点到 v 的<strong>整条路径长度</strong>，更新条件是 dist[u] + w(u, v) &lt; dist[v]；</li>
<li>Prim：把 v 接到树上的<strong>单条边权</strong>，更新条件是 w(u, v) &lt; cost[v]。</li>
</ul>
<p>同一张图、同样从 C 出发，两者得到的树不一样：</p>
<table>
<thead><tr><th>顶点</th><th>A</th><th>B</th><th>D</th><th>E</th><th>F</th><th>树的总权重</th></tr></thead>
<tbody>
<tr><td>Prim：cost/from</td><td>2/C</td><td>1/F</td><td>2/B</td><td>4/B</td><td>3/A</td><td>12</td></tr>
<tr><td>Dijkstra：dist/from</td><td>2/C</td><td>5/F</td><td>5/C</td><td>9/B</td><td>4/C</td><td>16</td></tr>
</tbody>
</table>
<p>A 那一轮，Dijkstra 算的是 2 + 3 = 5 ≥ 4，F 不更新；B 那一轮算的是 5 + 2 = 7 ≥ 5，D 也不更新。它得到的最短路径树是 C–A、C–F、C–D、F–B、B–E，总权重 16。</p>
<div class="callout warn" data-label="易错">
<p><strong>MST 不给最短路径。</strong>三角形 A–B 2、B–C 2、A–C 3：MST 是 A–B、B–C（总权重 4），但 A 到 C 的最短路是直连的 3，在 MST 里却要绕 4。MST 管的是整张网的总花费，不是两点之间的距离。</p>
</div>

<h2>C 代码：邻接矩阵版</h2>
<p>考试手写用<strong>邻接矩阵 + 数组</strong>最省事：不建堆，每轮扫一遍 cost[]，找树外最小的那个，就当是 deleteMin。</p>
<pre><code>#define MAXV 26
#define INF  INT_MAX                 /* 没有边；cost 为 ∞ */

int prim(int n, int w[MAXV][MAXV], int s, int from[]) {
    int cost[MAXV], inMST[MAXV], total = 0;
    for (int v = 0; v &lt; n; v++) {
        cost[v] = INF; from[v] = -1; inMST[v] = 0;
    }
    cost[s] = 0;
    for (int k = 0; k &lt; n; k++) {
        int u = -1;                  /* deleteMin：找树外 cost 最小的 */
        for (int v = 0; v &lt; n; v++)
            if (!inMST[v] &amp;&amp; cost[v] != INF &amp;&amp; (u == -1 || cost[v] &lt; cost[u]))
                u = v;
        if (u == -1) break;          /* 剩下的连不上：图不连通 */
        inMST[u] = 1;                /* 边 (from[u], u) 进入 MST */
        total += cost[u];
        for (int v = 0; v &lt; n; v++)  /* 更新树外邻居 */
            if (w[u][v] != INF &amp;&amp; !inMST[v] &amp;&amp; w[u][v] &lt; cost[v]) {
                cost[v] = w[u][v];   /* Dijkstra：cost[u] + w[u][v] */
                from[v] = u;
            }
    }
    return total;
}</code></pre>
<p>一段一段看（<code>INT_MAX</code> 来自 <code>&lt;limits.h&gt;</code>）：</p>
<ul>
<li><code>w[u][v]</code> 是边权，没有边填 INF；无向图 <code>w[u][v]</code> 和 <code>w[v][u]</code> 两格都要填。</li>
<li>第一个 <code>for</code>：cost 全设 ∞、from 设 −1、都不在树里；起点 cost 设 0，第一轮就选中它。</li>
<li>外层 <code>for</code> 跑 n 轮，每轮扫一遍，在“不在树里、cost 不是 ∞”的顶点里找 cost 最小的 u。平局时先遇到下标小的，正好是字母序。</li>
<li><code>u == -1</code>：剩下的顶点都连不上，图不连通。</li>
<li><code>inMST[u] = 1</code>、<code>total += cost[u]</code>：边 (from[u], u) 进树，成本累加。</li>
<li>最后的循环：单条边 <code>w[u][v]</code> 比 <code>cost[v]</code> 小就更新。换成 <code>cost[u] + w[u][v]</code> 就成了 Dijkstra。</li>
</ul>
<p>在上面的图上（A–F 编号 0–5）从 A、C、D 出发，都返回 12。</p>

<h2>补充：复杂度</h2>
<p>不管 PQ 怎么实现，操作次数都和 Dijkstra 一样：<strong>V 次 deleteMin，最多 E 次更新键</strong>（每条边最多让一个顶点的 cost 变小一次）。</p>
<table>
<thead><tr><th>PQ 实现</th><th>deleteMin</th><th>更新键</th><th>Prim 总时间</th></tr></thead>
<tbody>
<tr><td>未排序数组 + 邻接矩阵（上面的代码）</td><td>O(V)</td><td>O(1)</td><td>V 轮 × O(V) = <strong>O(V²)</strong></td></tr>
<tr><td>二叉堆 min-heap + 邻接表</td><td>O(log V)</td><td>O(log V)</td><td><strong>O((V + E) log V)</strong></td></tr>
<tr><td>平衡 BST（2016 年考题）</td><td>O(log V)</td><td>O(log V)（删旧键、插新键）</td><td><strong>O((V + E) log V)</strong></td></tr>
</tbody>
</table>
<ul>
<li><strong>本课程默认 Prim 的复杂度是 O((V + E) log V)</strong>，和 Dijkstra 相同，不在公式表上，要记住。</li>
<li>平衡 BST 的最小值是最左的结点，它没有左孩子，删掉它不用找后继，所以也是 O(log V)（见 6.5 优先队列）。</li>
<li>稠密图 E ≈ V² 时，数组版 O(V²) 比堆版 O(V² log V) 快；稀疏图 E ≈ V 时，堆版 O(V log V) 更好。</li>
<li>另一种 MST 算法 Kruskal（边从小到大加，跳过会成环的）本学期不考。</li>
</ul>

<h2>考试怎么考</h2>
<p>常见形式：给图和起点手算 Prim（平局按字母序），写边的加入顺序、每轮的 PQ 或 cost/from、MST 总权重；选择判断题考生成树的性质和 Prim 与 Dijkstra 的区别；复杂度填空；还有改算法的设计题。</p>

<h3>例题 1（手算）</h3>
<p>在上面那张图上从 D 出发运行 Prim，写出每轮取出的顶点、加入的边、PQ 内容和 MST 总权重。</p>
<table>
<thead><tr><th>轮</th><th>取出</th><th>加入的边</th><th>更新（cost/from）</th><th>之后的 PQ</th></tr></thead>
<tbody>
<tr><td>0</td><td>D 0</td><td>—</td><td>B：2/D；C：5/D；E：6/D</td><td>{B2, C5, E6}</td></tr>
<tr><td>1</td><td>B 2</td><td>D–B 2</td><td>E：4 &lt; 6 → 4/B；F：1/B</td><td>{F1, E4, C5}</td></tr>
<tr><td>2</td><td>F 1</td><td>B–F 1</td><td>A：3/F；C：4 &lt; 5 → 4/F</td><td>{A3, C4, E4}</td></tr>
<tr><td>3</td><td>A 3</td><td>F–A 3</td><td>C：2 &lt; 4 → 2/A</td><td>{C2, E4}</td></tr>
<tr><td>4</td><td>C 2</td><td>A–C 2</td><td>邻居 A、D、F 都在树里</td><td>{E4}</td></tr>
<tr><td>5</td><td>E 4</td><td>B–E 4</td><td>—</td><td>{}</td></tr>
</tbody>
</table>
<p>加入顺序 D–B、B–F、F–A、A–C、B–E，总权重 2 + 1 + 3 + 2 + 4 = <strong>12</strong>，和从 A 出发是同一棵树，只是顺序不同。</p>
<p>注意 C 的 cost 改了两次：5（经 D）→ 4（经 F）→ 2（经 A）。第 2 轮后 C4 和 E4 相等，但 A3 更小，轮不到比字母序。</p>

<h3>例题 2（设计，2015 年考题改编）</h3>
<p>Prim 只能处理连通图：从起点够不到的顶点永远进不了 PQ。怎样小改一下，让它给不连通图的每个连通分量各生成一棵 MST？在图 A–B 4、B–C 1、A–C 2、D–E 3 上给出结果。</p>
<p>思路：PQ 空了（剩下的 cost 全是 ∞）而还有顶点不在树里时，任取一个树外顶点当新起点，cost 设 0，接着跑，直到所有顶点进树。这和 DFS 外层循环对每个未访问的顶点调用一次 explore 是同一个套路。在上面的 C 代码里，把 <code>if (u == -1) break;</code> 换成：</p>
<pre><code>        if (u == -1)                 /* 这棵树长不出去了 */
            for (int v = 0; v &lt; n; v++)
                if (!inMST[v]) { u = v; cost[u] = 0; break; }</code></pre>
<p>找到的第一个树外顶点当新树的根：cost 设 0，from 保持 −1。外层共 n 轮、每轮一个顶点进树，所以一定找得到。</p>
<p>例子（从 A 开始）：A 进树；C 以 2 进树（A–C）；B 的 cost 从 4 改成 1，以 1 进树（C–B）。这时 D、E 的 cost 还是 ∞，选 D 当新根，E 以 3 进树（D–E）。</p>
<p>结果叫<strong>最小生成森林（minimum spanning forest）</strong>：A–C 2、C–B 1、D–E 3，总权重 6。k 个连通分量共 V − k 条边，这里 5 − 2 = 3。复杂度不变。</p>

<div class="callout warn" data-label="易错">
<ul>
<li>更新条件是 w(u, v) &lt; cost[v]；写成 cost[u] + w(u, v) 就成了 Dijkstra。</li>
<li>顶点出 PQ 时加入的是边 (from[u], u)，不是刚检查过的那条边。</li>
<li>起点不同，边加入的顺序不同，但<strong>MST 总权重不变</strong>。</li>
<li>“最重的边一定不在 MST 里”是错的：A–B 1、B–C 9 只有一棵生成树，它就得用 B–C 9。</li>
<li>Prim <strong>能处理负权边</strong>：它只比较边权，从不把边权相加。这一点和 Dijkstra 不同。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>生成树：包含全部 V 个顶点、连通、<strong>恰好 V − 1 条边、没有环</strong>；MST 是总边权最小的那棵，总权重唯一。</li>
<li>Prim：从任一顶点出发，<strong>每次加最便宜的跨越边</strong>，直到所有顶点进树，是贪心算法。</li>
<li>实现和 Dijkstra 相同，<strong>唯一区别是键</strong>：单条边权 w(u, v)，不是路径长度。</li>
<li>复杂度：堆版 <strong>O((V + E) log V)</strong>，数组 + 邻接矩阵版 O(V²)。</li>
<li>MST 不是最短路径树；不连通图每个分量重新起步，得到最小生成森林。</li>
</ul>
`;

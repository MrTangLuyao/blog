/* Post body — dsa-mst-prim / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-mst-prim:zh'] = `
<p class="lead">最小生成树（Minimum Spanning Tree, MST）用总权重最小的一组边把图的所有顶点连起来。Prim 算法从任一顶点出发，每次加入连接“树内”和“树外”的最便宜的边；实现上就是 Dijkstra，只把优先队列的键从路径总长换成单条边的权重。</p>

<h2>生成树与最小生成树</h2>
<p>课上的应用：几栋楼要用光纤（或水管、电缆）全部连通，每条可铺的线路有一个成本，求总成本最低的铺法。楼是顶点，可铺的线路是带权的边。下面沿用 7.5 Dijkstra 那张无向带权图：</p>
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
<p><strong>生成树（spanning tree）</strong>是原图的一个子图：</p>
<ul>
  <li>包含<strong>全部 V 个顶点</strong>，只取原图的一部分边；</li>
  <li>仍然<strong>连通</strong>；</li>
  <li>边数最少，恰好 <strong>V − 1 条</strong>，所以<strong>没有环</strong>。</li>
</ul>
<p>为什么是 V − 1：从一个顶点开始，每接入一个新顶点恰好要一条边，接完其余 V − 1 个顶点就是 V − 1 条。少一条就不连通，多一条必然成环。</p>
<p>一张图通常有很多棵生成树，例如 A–C、C–D、D–E、E–B、B–F 也是一棵，总权重 2 + 5 + 6 + 4 + 1 = 18。<strong>最小生成树</strong>是总边权最小的那棵，这张图里是绿色的 A–C、A–F、F–B、B–D、B–E，总权重 2 + 3 + 1 + 2 + 4 = <strong>12</strong>。</p>
<ul>
  <li>MST 针对<strong>连通的无向带权图</strong>；不连通的图没有生成树（见练习 3）。</li>
  <li>边权互不相同时 MST 唯一；有相等的边权时可能有好几棵，但<strong>总权重都一样</strong>。</li>
</ul>

<h2>贪心规则：每次加最便宜的跨越边</h2>
<p>从 A 开始。任何生成树里 A 都必须连到别的顶点，只能用 A–C（2）或 A–F（3），选便宜的 A–C。再把 {A, C} 看成一个整体：它也必须用某条边连到其余顶点，候选是 A–F 3、C–F 4、C–D 5，选 A–F。一端在树内、一端在树外的边叫<strong>跨越边（crossing edge）</strong>，整个过程：</p>
<table>
<thead><tr><th>步</th><th>树中顶点</th><th>跨越边</th><th>选中</th></tr></thead>
<tbody>
<tr><td>1</td><td>A</td><td>A–C 2，A–F 3</td><td>A–C 2</td></tr>
<tr><td>2</td><td>A, C</td><td>A–F 3，C–F 4，C–D 5</td><td>A–F 3</td></tr>
<tr><td>3</td><td>A, C, F</td><td>F–B 1，C–D 5</td><td>F–B 1</td></tr>
<tr><td>4</td><td>A, B, C, F</td><td>B–D 2，B–E 4，C–D 5</td><td>B–D 2</td></tr>
<tr><td>5</td><td>A, B, C, D, F</td><td>B–E 4，D–E 6</td><td>B–E 4</td></tr>
</tbody>
</table>
<p>5 步、5 条边，总权重 12。第 3 步起 C–F 不再是跨越边：两端都在树里，加上就成环 A–C–F。</p>
<p>这就是 <strong>Prim 算法</strong>：从任意顶点出发，<strong>反复加入权重最小的跨越边</strong>，直到所有顶点进树。每步只做眼前最好的选择，属于<strong>贪心算法（greedy algorithm）</strong>。</p>
<p>为什么不会选错（割性质，cut property）：设这一步最便宜的跨越边是 e。若某棵 MST T 不含 e，把 e 加进 T 会形成一个环；这个环经 e 从树内走到树外，还得再走回来，所以环上还有另一条跨越边 e′，且 w(e′) ≥ w(e)。用 e 换掉 e′，仍是生成树，总权重不增。所以总有一棵 MST 包含 e，每一步都安全。</p>

<h2>实现：Dijkstra 换一个键</h2>
<p>手算时每步列出全部跨越边；程序里改为给每个树外顶点记一个值，像 Dijkstra 一样放进优先队列（PQ）：</p>
<ul>
  <li><code>inMST[v]</code>：v 是否已在树中；</li>
  <li><code>cost[v]</code>：<strong>把 v 接到当前树上的最便宜的那条边的权重</strong>，即 PQ 的键；</li>
  <li><code>from[v]</code>：那条边在树内的一端，MST 的边就是所有 (from[v], v)。</li>
</ul>
<p>“不在树中、但有边连到树上”的顶点，2015 年考题称为 <strong>fringe</strong>，PQ 里放的就是它们。</p>
<pre><code class="lang-text">Prim(G, s):
    for each vertex v: cost[v] = ∞, from[v] = none, inMST[v] = false
    cost[s] = 0
    insert(PQ, s, 0)
    while PQ is not empty:
        u = deleteMin(PQ)
        inMST[u] = true                     // 边 (from[u], u) 进入 MST
        for each edge (u, v) where not inMST[v]:
            if w(u, v) &lt; cost[v]:           // Dijkstra: dist[u] + w(u, v) &lt; dist[v]
                cost[v] = w(u, v)
                from[v] = u
                if v is in PQ: update(PQ, v, cost[v])
                else:          insert(PQ, v, cost[v])</code></pre>
<p><strong>与 Dijkstra 唯一的区别</strong>：Dijkstra 的键是从起点出发的<strong>整条路径长度</strong>，Prim 的键是连到树上的<strong>单条边权</strong>。其余步骤（取最小、更新树外邻居、改 PQ）完全相同。课上的实现例子从 C 出发：</p>
<table>
<thead><tr><th>轮</th><th>取出</th><th>加入的边</th><th>更新树外邻居（cost/from）</th><th>之后的 PQ</th></tr></thead>
<tbody>
<tr><td>0</td><td>C 0</td><td>—</td><td>A：2 → 2/C；D：5 → 5/C；F：4 → 4/C</td><td>{A2, F4, D5}</td></tr>
<tr><td>1</td><td>A 2</td><td>C–A 2</td><td>F：3 &lt; 4 → 3/A</td><td>{F3, D5}</td></tr>
<tr><td>2</td><td>F 3</td><td>A–F 3</td><td>B：1 → 1/F</td><td>{B1, D5}</td></tr>
<tr><td>3</td><td>B 1</td><td>F–B 1</td><td>D：2 &lt; 5 → 2/B；E：4 → 4/B</td><td>{D2, E4}</td></tr>
<tr><td>4</td><td>D 2</td><td>B–D 2</td><td>E：6 ≥ 4，不变</td><td>{E4}</td></tr>
<tr><td>5</td><td>E 4</td><td>B–E 4</td><td>—</td><td>{}</td></tr>
</tbody>
</table>
<p>得到同一棵 MST，总权重 12。第 1 轮 F 已有键 4（经 C–F），A 进树后出现更便宜的 A–F，于是改成 3，与 Dijkstra 里 D7 换成 D6 是同一种操作。</p>
<p>同一张图、同一起点 C 换成 Dijkstra，结果就不同了：</p>
<table>
<thead><tr><th>顶点</th><th>A</th><th>B</th><th>D</th><th>E</th><th>F</th><th>树的总权重</th></tr></thead>
<tbody>
<tr><td>Prim：cost/from</td><td>2/C</td><td>1/F</td><td>2/B</td><td>4/B</td><td>3/A</td><td>12</td></tr>
<tr><td>Dijkstra：dist/from</td><td>2/C</td><td>5/F</td><td>5/C</td><td>9/B</td><td>4/C</td><td>16</td></tr>
</tbody>
</table>
<p>Dijkstra 在 A 那一轮算的是 2 + 3 = 5 ≥ 4，F 不更新；在 B 那一轮算的是 5 + 2 = 7 ≥ 5，D 也不更新。它得到的最短路径树是 C–A、C–F、C–D、F–B、B–E，总权重 16。从 A 出发时两棵树碰巧相同（对照 7.5 的最短路径树），换个起点就不同。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-mst-prim/anims/prim.html" loading="lazy" style="height: 560px;" title="Prim 逐步演示"></iframe>
<p class="anim-caption">按钮切换“从 A / 从 C 运行 Prim”和“从 C 运行 Dijkstra”；蓝色实线是决定各顶点当前键的边，蓝色虚线是其他跨越边，顶点下方是当前键。</p>

<div class="callout warn" data-label="易错">
<p><strong>MST 不给最短路径。</strong>三角形 A–B 2、B–C 2、A–C 3：MST 是 A–B、B–C（总权重 4），可 A 到 C 的最短路是直连的 3，在 MST 里却要走 4。MST 最小化的是<strong>整张网的总权重</strong>，不是两点间的距离。</p>
</div>

<h2>C 实现与复杂度</h2>
<p>考试手写用<strong>邻接矩阵 + 数组扫描</strong>最省事：每轮扫一遍 cost[] 找树外的最小值，相当于拿未排序数组当 PQ。平局时先遇到下标小的，正好是字母序。</p>
<pre><code>#include &lt;limits.h&gt;

#define MAXV 26
#define INF  INT_MAX            /* 没有边；cost 为 ∞ */

/* 无向连通图，w[u][v] = w[v][u] 为边权，没有边为 INF。
   从 s 出发求 MST，返回总权重。
   结束后 from[v] = 把 v 接进树的那条边的另一端（s 为 -1）。 */
int prim(int n, int w[MAXV][MAXV], int s, int from[]) {
    int cost[MAXV];     /* v 连到当前树的最便宜一条边的权重 */
    int inMST[MAXV];    /* 1 = 已在树中 */
    int total = 0;
    for (int v = 0; v &lt; n; v++) {
        cost[v] = INF;
        from[v] = -1;
        inMST[v] = 0;
    }
    cost[s] = 0;

    for (int k = 0; k &lt; n; k++) {
        /* deleteMin：在树外顶点里找 cost 最小的，O(V) */
        int u = -1;
        for (int v = 0; v &lt; n; v++) {
            if (!inMST[v] &amp;&amp; cost[v] != INF &amp;&amp; (u == -1 || cost[v] &lt; cost[u])) {
                u = v;
            }
        }
        if (u == -1) {
            break;                      /* 剩下的顶点连不上：图不连通 */
        }
        inMST[u] = 1;                   /* 边 (from[u], u) 进入 MST */
        total += cost[u];

        /* 更新树外邻居的 cost：只看这一条边的权重 */
        for (int v = 0; v &lt; n; v++) {
            if (w[u][v] != INF &amp;&amp; !inMST[v] &amp;&amp; w[u][v] &lt; cost[v]) {
                cost[v] = w[u][v];      /* Dijkstra 这里是 dist[u] + w[u][v] */
                from[v] = u;
            }
        }
    }
    return total;
}</code></pre>
<p>用上面的图（A–F 编号 0–5，无向边填对称的两格）运行，从 A、C、D 出发都返回 12，from[] 与上面的表一致。没有边用 INF 表示，所以负权边也能存。</p>
<p>不论 PQ 怎么实现，操作次数都和 Dijkstra 一样：<strong>V 次 deleteMin，最多 E 次更新键</strong>（每条边最多让一个顶点的键变小一次）。</p>
<table>
<thead><tr><th>PQ 实现</th><th>deleteMin</th><th>更新键</th><th>Prim 总时间</th></tr></thead>
<tbody>
<tr><td>未排序数组 + 邻接矩阵（上面的 C 代码）</td><td>O(V)</td><td>O(1)</td><td>V 轮 × O(V) = <strong>O(V²)</strong></td></tr>
<tr><td>二叉堆 min-heap + 邻接表</td><td>O(log V)</td><td>O(log V)</td><td>(V + E)·O(log V) = <strong>O((V + E) log V)</strong></td></tr>
<tr><td>平衡 BST（2016 年考题）</td><td>O(log V)</td><td>O(log V)（删旧键、插新键）</td><td><strong>O((V + E) log V)</strong></td></tr>
</tbody>
</table>
<ul>
  <li><strong>本课程默认 Prim 的复杂度是 O((V + E) log V)</strong>，与 Dijkstra 相同。Fibonacci 堆更快，但不考。</li>
  <li>稠密图 E ≈ V² 时，数组版 O(V²) 比堆版 O(V² log V) 快；稀疏图 E ≈ V 时，堆版 O(V log V) 更好。</li>
  <li>另一种 MST 算法 Kruskal（边按权重从小到大加，跳过会成环的边）只在 workshop 出现，本学期不考。</li>
</ul>

<h2>考试怎么考</h2>
<ul>
  <li><strong>追踪题</strong>：给图和起点（平局常按字母序），写出边加入 MST 的顺序、每轮的 PQ 或 cost/from、MST 总权重。手算直接用“最便宜跨越边”的规则，结果与 PQ 版一致。</li>
  <li><strong>概念题</strong>：生成树有 V − 1 条边；MST 的总权重唯一；Prim 与 Dijkstra 的区别在键（单条边权 vs 路径总长）；MST 不是最短路径树。</li>
  <li><strong>复杂度题</strong>：O((V + E) log V) <strong>不在公式表上</strong>，要记住，并会用“V 次 deleteMin + E 次更新”推出换 PQ 后的结果。2016 年问平衡 BST：最小值是最左结点，它没有左孩子，删除时用不着找后继；更新是删旧键再插新键，都是 O(log V)，所以仍是 O((V + E) log V)（见 6.5 优先队列）。</li>
  <li><strong>设计题</strong>（2015 年）：让 Prim 能处理不连通图，见练习 3。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>① 更新条件是 w(u, v) &lt; cost[v]，写成 cost[u] + w(u, v) 就成了 Dijkstra。② 顶点出 PQ 时加入的是边 (from[u], u)，不是刚检查过的那条边。③ 一个顶点的键可以被改小好几次（练习 1 里 C 的键 5 → 4 → 2）。④ 起点不同，边加入的顺序不同，MST 总权重不变。</p>
</div>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">1. 在上面那张图上从 D 出发运行 Prim（平局按字母序），写出每轮取出的顶点、加入的边、PQ 内容，以及 MST 的总权重。</summary>
  <div class="qa__body">
<table>
<thead><tr><th>轮</th><th>取出</th><th>加入的边</th><th>更新（cost/from）</th><th>之后的 PQ</th></tr></thead>
<tbody>
<tr><td>0</td><td>D 0</td><td>—</td><td>B：2/D；C：5/D；E：6/D</td><td>{B2, C5, E6}</td></tr>
<tr><td>1</td><td>B 2</td><td>D–B 2</td><td>E：4 &lt; 6 → 4/B；F：1/B</td><td>{F1, E4, C5}</td></tr>
<tr><td>2</td><td>F 1</td><td>B–F 1</td><td>A：3/F；C：4 &lt; 5 → 4/F</td><td>{A3, C4, E4}</td></tr>
<tr><td>3</td><td>A 3</td><td>F–A 3</td><td>C：2 &lt; 4 → 2/A</td><td>{C2, E4}</td></tr>
<tr><td>4</td><td>C 2</td><td>A–C 2</td><td>邻居 A、D、F 都在树中</td><td>{E4}</td></tr>
<tr><td>5</td><td>E 4</td><td>B–E 4</td><td>—</td><td>{}</td></tr>
</tbody>
</table>
<p>加入顺序 D–B、B–F、F–A、A–C、B–E，总权重 2 + 1 + 3 + 2 + 4 = <strong>12</strong>，与从 A 出发是同一棵树。C 的键变了两次：5（经 D）→ 4（经 F）→ 2（经 A）。第 2 轮后 C4 与 E4 相等，但 A3 更小，不需要比较字母序。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">2. 判断对错并说明理由（图连通、无向）：(a) 图中最重的边一定不在 MST 里；(b) 边权互不相同时，最轻的边一定在 MST 里；(c) Prim 能处理负权边；(d) 从不同起点运行 Prim，得到的 MST 总权重可能不同。</summary>
  <div class="qa__body">
<p>(a) <strong>错</strong>。如果最重的边是到某个顶点的唯一一条边，任何生成树都得用它。例如 A–B 1、B–C 9：唯一的生成树就包含 B–C 9。</p>
<p>(b) <strong>对</strong>。设最轻的边是 u–v。从 u 出发运行 Prim，第一步的跨越边就是 u 的所有边，最便宜的正是 u–v；边权互不相同时 MST 唯一，所以它一定在 MST 里。</p>
<p>(c) <strong>对</strong>。Prim 只比较边权大小，从不把边权相加，割性质的论证也不要求边权 ≥ 0。另一种看法：给每条边加同一个常数 c，每棵生成树都恰好增加 (V − 1)·c，排名不变。这与 Dijkstra 不同：路径的边数不一样，加常数会改变哪条路最短（见 7.5 练习 2）。</p>
<p>(d) <strong>错</strong>。每次运行得到的都是一棵 MST，总权重都是最小值；有相等边权时树的形状可以不同，总权重相同。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">3. （2015 年考题改编）Prim 只能处理连通图：从起点够不到的顶点永远不会进 PQ。给出一个小改动，使它对不连通图的每个连通分量都生成一棵 MST，并在图 A–B 4、B–C 1、A–C 2、D–E 3 上给出结果。</summary>
  <div class="qa__body">
<p>思路：PQ 空了（或剩下的键全是 ∞）而还有顶点不在树中时，任取一个树外顶点当新的起点，键设为 0，继续运行；直到所有顶点都进树。这和 DFS 外层循环对每个未访问顶点调用一次 explore 是同一个写法。在上面的 C 代码里，把 <code>break</code> 换成：</p>
<pre><code>        if (u == -1) {                  /* 当前这棵树长不出去了 */
            for (int v = 0; v &lt; n; v++) {
                if (!inMST[v]) {        /* 任取一个树外顶点当新树的根 */
                    u = v;
                    cost[u] = 0;
                    break;
                }
            }
        }</code></pre>
<p>外层循环共 n 轮、每轮恰好有一个顶点进树，所以总能找到 u。新树的根 from 为 −1。</p>
<p>例子（A–E 编号 0–4，从 A 开始）：A 进树；C 以 2 进树（边 A–C）；B 的键从 4 改成 1，以 1 进树（边 C–B）。这时 D、E 的键还是 ∞，选 D 作新根，E 以 3 进树（边 D–E）。结果是<strong>最小生成森林（minimum spanning forest）</strong>：A–C 2、C–B 1、D–E 3，总权重 6。k 个连通分量时共 V − k 条边，这里 5 − 2 = 3。复杂度不变。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">4. （2016 年考题改编）分别用“二叉堆 + 邻接表”和“未排序数组 + 邻接矩阵”实现 Prim。当 E ≈ V 和 E ≈ V² 时，各是什么复杂度？各选哪一种？</summary>
  <div class="qa__body">
<p><strong>堆版</strong>：V 次 deleteMin、最多 E 次更新，每次 O(log V)，扫邻接表共 O(V + E)，合计 O((V + E) log V)。E ≈ V 时为 O(V log V)；E ≈ V² 时为 O(V² log V)。</p>
<p><strong>数组版</strong>：V 轮，每轮扫 cost[] 找最小 O(V)、扫邻接矩阵一行 O(V)，合计 O(V²)，与 E 无关。</p>
<p>结论：<strong>稀疏图（E ≈ V）选堆版</strong>，O(V log V) &lt; O(V²)；<strong>稠密图（E ≈ V²）选数组版</strong>，O(V²) &lt; O(V² log V)。</p>
  </div>
</details>
`;

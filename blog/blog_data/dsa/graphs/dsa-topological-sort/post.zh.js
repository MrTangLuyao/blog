/* Post body — dsa-topological-sort / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-topological-sort:zh'] = `
<p class="lead"><strong>拓扑排序（topological sort）</strong>就是把有向无环图的所有顶点排成一行，让每条边都从左指向右。课上教了两种做法，都是 <strong>O(V + E)</strong>：反复取出入度为 0 的顶点（源点删除），或者把 DFS 的完成顺序倒过来。</p>

<h2>从一个场景说起</h2>
<p>早上出门要穿 7 样东西：shirt、jacket、socks、glasses、shoes、pants、watch，一次穿一样。其中有三条先后要求：衬衫在夹克前（shirt → jacket），袜子和裤子都在鞋前（socks → shoes，pants → shoes）。眼镜和手表什么时候戴都行。</p>
<p>只要不违反这三条，怎么排都行：shirt, jacket, pants, socks, shoes, glasses, watch 可以；watch, socks, glasses, pants, shoes, shirt, jacket 看着别扭，也可以。合法的顺序一共有 840 种。</p>
<p>怎么找出一个？先看<strong>哪些东西没有任何前提</strong>，挑一样穿上。穿完之后，有的东西前提满足了（shirt 穿好，jacket 就能穿了），再接着挑，直到穿完。这就是下面的第一种算法。</p>

<h2>它是什么</h2>
<p>把每样东西看成顶点，每条先后要求看成一条有向边 u → v，意思是“u 必须排在 v 前面”。</p>
<p>简单说，<strong>拓扑排序就是把所有顶点排成一行，让每条边都从左指向右</strong>。它只对<strong>有向无环图（directed acyclic graph, DAG）</strong>有定义。记住三点：</p>
<ul>
<li><strong>有环就排不出来。</strong>衬衫要在夹克前、夹克又要在衬衫前，哪件都没法先穿。</li>
<li><strong>答案一般不唯一。</strong>穿衣服就有 840 种，只要每条边都向右就都对。</li>
<li><strong>不是比较排序。</strong>顶点没有大小可比，顺序只由边决定。</li>
</ul>
<p>算法要用到两个词。<strong>入度（in-degree）</strong>：有几条边指向这个顶点，也就是它有几个“前提”。<strong>源点（source）</strong>：入度为 0 的顶点，没有前提，可以排第一。</p>
<p>第一种算法叫<strong>源点删除（source removal）</strong>：反复挑一个源点输出，再把它连同出边一起删掉，剩下的图又会冒出新的源点。每轮把问题缩小一点，属于<strong>减治（decrease-and-conquer）</strong>。第二种是 <strong>DFS 法</strong>，下面一起看。</p>

<h2>看个例子</h2>
<p>课上用的是下面这张 5 个顶点的图。</p>
<figure class="fig">
<svg viewBox="0 0 420 250" width="420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="课上的 5 顶点有向无环图及各顶点入度">
<defs><marker id="dsa-topo-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.6)"/></marker></defs>
<line x1="68" y1="50" x2="190" y2="50" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-topo-arr)"/>
<line x1="65.6" y1="59" x2="292.7" y2="190" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-topo-arr)"/>
<line x1="66.3" y1="192.4" x2="351.9" y2="58.5" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-topo-arr)"/>
<line x1="68" y1="200" x2="290" y2="200" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-topo-arr)"/>
<line x1="228" y1="50" x2="350" y2="50" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-topo-arr)"/>
<line x1="220" y1="65" x2="298.9" y2="183.4" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-topo-arr)"/>
<circle cx="50" cy="50" r="18" fill="#343433" stroke="#38bdf8" stroke-width="2"/>
<text x="50" y="50" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">A</text>
<text x="50" y="20" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#38bdf8">入度 0</text>
<circle cx="210" cy="50" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="210" y="50" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">C</text>
<text x="210" y="20" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">入度 1</text>
<circle cx="370" cy="50" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="370" y="50" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">D</text>
<text x="370" y="20" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">入度 2</text>
<circle cx="50" cy="200" r="18" fill="#343433" stroke="#38bdf8" stroke-width="2"/>
<text x="50" y="200" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">B</text>
<text x="50" y="234" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#38bdf8">入度 0</text>
<circle cx="310" cy="200" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="310" y="200" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">E</text>
<text x="310" y="234" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">入度 3</text>
</svg>
<figcaption>边：A→C，A→E，B→D，B→E，C→D，C→E；蓝色 = 源点</figcaption>
</figure>

<h3>方法一：源点删除</h3>
<p>每一轮：挑一个入度为 0 的顶点输出，再把它<strong>每条出边终点</strong>的入度减 1，等于删掉这些边。</p>
<table>
<thead><tr><th>轮</th><th>入度为 0 的</th><th>输出</th><th>删掉的边</th><th>之后剩余顶点的入度</th></tr></thead>
<tbody>
<tr><td>0</td><td>—</td><td>—</td><td>—</td><td>A 0，B 0，C 1，D 2，E 3</td></tr>
<tr><td>1</td><td>A, B</td><td><strong>B</strong></td><td>B→D，B→E</td><td>A 0，C 1，D 1，E 2</td></tr>
<tr><td>2</td><td>A</td><td><strong>A</strong></td><td>A→C，A→E</td><td>C 0，D 1，E 1</td></tr>
<tr><td>3</td><td>C</td><td><strong>C</strong></td><td>C→D，C→E</td><td>D 0，E 0</td></tr>
<tr><td>4</td><td>D, E</td><td><strong>E</strong></td><td>无出边</td><td>D 0</td></tr>
<tr><td>5</td><td>D</td><td><strong>D</strong></td><td>无出边</td><td>—</td></tr>
</tbody>
</table>
<p>结果是 <strong>B A C E D</strong>。第 1、4 轮有平局，课上两次都选了字母靠后的；平局时选字母靠前的，就得到 A B C D E，同样合法。<strong>题目规定了平局规则就照做</strong>，没规定就写明自己怎么选。</p>

<h3>方法二：DFS 完成顺序倒过来</h3>
<p>DFS（见 7.3 深度优先搜索）对每个没访问过的顶点调用 explore(v)；explore(v) 标记 v，再递归访问没访问过的邻居。</p>
<p>这里要看的不是 explore 开始的顺序（访问顺序，visiting order），而是它<strong>结束</strong>的顺序，叫<strong>完成顺序（finishing order）</strong>，课上也叫 traversal stack pop order。调用栈像一摞书，每次调用放上一本，返回时拿走一本，拿走的先后就是完成顺序。从 A 开始，邻居按字母序：</p>
<pre><code class="lang-text">explore(A)                  访问 #1
  explore(C)                访问 #2   (A→C)
    explore(D)              访问 #3   (C→D)
    D 完成 #1               L = D
    explore(E)              访问 #4   (C→E)
    E 完成 #2               L = E D
  C 完成 #3                 L = C E D
  (A→E：E 已访问，跳过)
A 完成 #4                   L = A C E D
explore(B)                  访问 #5   (主循环)
  (B→D、B→E：都已访问)
B 完成 #5                   L = B A C E D</code></pre>
<p>访问顺序是 A C D E B，完成顺序是 <strong>D E C A B</strong>：越深的调用越先结束。倒过来，<strong>B A C E D</strong> 就是一个拓扑序（这张图上碰巧和源点删除一样）。</p>
<p>实现时不用最后再倒一遍：<strong>explore(v) 结束时把 v 插到链表表头</strong>（就是上面右边的 L），DFS 跑完，链表就是拓扑序。只比普通 DFS 多一行。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-topological-sort/anims/topo-sort.html" loading="lazy" style="height: 520px;" title="拓扑排序逐步演示"></iframe>
<p class="anim-caption">上方按钮切换两种方法和两张图（课上的图 / 2016 考题）。源点删除模式里顶点旁的数字是当前入度；DFS 模式里 #k 表示第 k 个完成。</p>

<h3>补充：为什么倒过来就对</h3>
<p>任取一条边 u → v。explore(u) 检查 v 时，v 要么没访问过（于是在 explore(u) 里面先跑完），要么早已完成，总之 <strong>v 比 u 先完成</strong>。v 不可能还在调用栈上：那说明有路从 v 走到 u，加上 u → v 就成环了。所以完成顺序里每条边都向左，倒过来就全部向右。</p>

<h2>复杂度和代码</h2>
<p>“找一个入度为 0 的顶点”如果每次都扫一遍所有顶点，总共要 O(V²)。改用<strong>队列存入度为 0 的顶点</strong>：开始时源点全部入队，之后谁的入度减到 0 就把谁入队，每次取源点只要 O(1)。下面的 node_t 是 7.2 的邻接表结点：<code>v</code> 是边的终点，<code>next</code> 指向下一个结点。</p>
<pre><code>int topo_sort(int n, node_t *adj[], int order[]) {
    int indeg[MAXV] = {0}, queue[MAXV];
    int head = 0, tail = 0, cnt = 0;
    for (int u = 0; u &lt; n; u++)                       /* 1. 算入度 */
        for (node_t *p = adj[u]; p != NULL; p = p-&gt;next)
            indeg[p-&gt;v]++;
    for (int v = 0; v &lt; n; v++)                       /* 2. 源点入队 */
        if (indeg[v] == 0) queue[tail++] = v;
    while (head &lt; tail) {                             /* 队列非空 */
        int u = queue[head++];                        /* 3. 取出一个源点 */
        order[cnt++] = u;                             /*    输出它 */
        for (node_t *p = adj[u]; p != NULL; p = p-&gt;next)
            if (--indeg[p-&gt;v] == 0)                   /* 删掉边 u→v */
                queue[tail++] = p-&gt;v;                 /* v 成了新源点 */
    }
    return cnt;                                       /* cnt &lt; n 说明有环 */
}</code></pre>
<ul>
<li>第 2–3 行：入度清零。<code>queue</code> 是普通数组，<code>head</code> 是队头，<code>tail</code> 是队尾后一格。每个顶点最多入队一次，长度 n 就够。</li>
<li>第 4–6 行：每看到一条边 u → v，就给 v 的入度加 1。</li>
<li>第 7–8 行：所有源点入队。</li>
<li>第 10–14 行：取出队头 u 并输出；u 的每个出边终点入度减 1（删边），减到 0 就入队。</li>
</ul>
<p>对课上的图（邻接表按字母序），它输出 <strong>A B C D E</strong>：队列先进先出，平局时先入队的先输出，所以和手算的不同，也合法。</p>
<p><strong>复杂度</strong>：算入度 O(V + E)；每个顶点进出队各一次，O(V)；<strong>每条边恰好处理一次</strong>，O(E)。合计 <strong>O(V + E)</strong>，和 BFS、DFS 一样；DFS 法也是 O(V + E)。用<strong>邻接矩阵</strong>时找出边要扫一整行，两种方法都是 <strong>O(V²)</strong>。</p>
<p><strong>返回值小于 n 说明有环</strong>：环上顶点的入度永远减不到 0。比如课上的图加一条 D → A，开始只有 B 是源点；输出 B 之后再没有入度为 0 的顶点，只输出了 1 个。</p>
<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/cIBFEhD77b4" title="Topological Sort | Kahn's Algorithm | Graph Theory" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：WilliamFiset《Topological Sort | Kahn's Algorithm | Graph Theory》（英文），里面的 Kahn's algorithm 就是源点删除。看 0:22–11:15：定义、为什么有环不行、两个例子；之后是伪代码。</p>

<h2>检验答案：画边看方向</h2>
<p>选择题常给几个顺序，问哪些合法。把顺序写成一行，画上原图的<strong>每一条</strong>边：全部向右就合法，有一条向左就不合法。</p>
<figure class="fig">
<svg viewBox="0 0 500 270" width="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="把两个顺序排成一行并画出所有边">
<defs><marker id="dsa-topo-arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.6)"/></marker><marker id="dsa-topo-arr2-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f87171"/></marker></defs>
<path d="M131,77 Q167.5,21 204,77" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-topo-arr2)"/>
<path d="M131,77 Q210,-7 289,77" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-topo-arr2)"/>
<path d="M46,77 Q210,-63 374,77" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-topo-arr2)"/>
<path d="M46,77 Q167.5,-35 289,77" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-topo-arr2)"/>
<path d="M216,77 Q295,-7 374,77" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-topo-arr2)"/>
<path d="M216,77 Q252.5,21 289,77" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-topo-arr2)"/>
<circle cx="40" cy="95" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="40" y="95" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">B</text>
<circle cx="125" cy="95" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="125" y="95" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">A</text>
<circle cx="210" cy="95" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="210" y="95" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">C</text>
<circle cx="295" cy="95" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="295" y="95" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">E</text>
<circle cx="380" cy="95" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="380" y="95" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">D</text>
<text x="420" y="95" dominant-baseline="central" font-size="14" font-weight="700" fill="#4ade80">合法</text>
<path d="M46,182 Q82.5,126 119,182" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-topo-arr2)"/>
<path d="M46,182 Q167.5,70 289,182" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-topo-arr2)"/>
<path d="M374,218 Q295,302 216,218" fill="none" stroke="#f87171" stroke-width="2.5" stroke-dasharray="5 4" marker-end="url(#dsa-topo-arr2-bad)"/>
<path d="M374,218 Q337.5,274 301,218" fill="none" stroke="#f87171" stroke-width="2.5" stroke-dasharray="5 4" marker-end="url(#dsa-topo-arr2-bad)"/>
<path d="M131,182 Q167.5,126 204,182" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-topo-arr2)"/>
<path d="M131,182 Q210,98 289,182" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-topo-arr2)"/>
<circle cx="40" cy="200" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="40" y="200" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">A</text>
<circle cx="125" cy="200" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="125" y="200" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">C</text>
<circle cx="210" cy="200" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="210" y="200" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">D</text>
<circle cx="295" cy="200" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="295" y="200" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">E</text>
<circle cx="380" cy="200" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="380" y="200" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">B</text>
<text x="420" y="200" dominant-baseline="central" font-size="14" font-weight="700" fill="#f87171">不合法</text>
</svg>
<figcaption>上：B A C E D，6 条边全部向右。下：A C D E B（DFS 的访问顺序），B→D、B→E 向左（红色虚线）</figcaption>
</figure>
<p>下面那行说明<strong>访问顺序不是拓扑序</strong>：B 最后才被访问，却必须排在 D、E 前面。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>手算一个拓扑序</strong>（2016 期末考过，要写过程）：源点删除就写出每轮哪些顶点入度为 0、选了谁、入度怎么变；DFS 就写出完成顺序再倒过来。</li>
<li><strong>多选哪些顺序合法</strong>（课上小测的题型）：逐条边查方向。</li>
<li><strong>概念判断</strong>：只对 DAG 有定义；一般不唯一；邻接表 O(V + E)、邻接矩阵 O(V²)；访问顺序不是拓扑序；每个 DAG 都至少有一个源点。</li>
<li><strong>写代码</strong>：源点删除（入度数组 + 队列），或在 DFS 里加一行；用“输出个数 &lt; n”判断有没有环。公式表上没有这些，要记住。</li>
</ul>

<h3>例题 1：求一个拓扑序（2016 期末改编）</h3>
<p>有向图的边：1→2，1→4，2→3，2→4，2→6，3→5，4→6，5→4，5→6。求一个拓扑序，写出过程。</p>
<p>用源点删除。初始入度：1 是 0，2 是 1，3 是 1，4 是 3（来自 1、2、5），5 是 1，6 是 3（来自 2、4、5）。</p>
<table>
<thead><tr><th>轮</th><th>输出</th><th>删掉的边</th><th>之后剩余顶点的入度</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>1→2，1→4</td><td>2:0，3:1，4:2，5:1，6:3</td></tr>
<tr><td>2</td><td>2</td><td>2→3，2→4，2→6</td><td>3:0，4:1，5:1，6:2</td></tr>
<tr><td>3</td><td>3</td><td>3→5</td><td>4:1，5:0，6:2</td></tr>
<tr><td>4</td><td>5</td><td>5→4，5→6</td><td>4:0，6:1</td></tr>
<tr><td>5</td><td>4</td><td>4→6</td><td>6:0</td></tr>
<tr><td>6</td><td>6</td><td>无出边</td><td>—</td></tr>
</tbody>
</table>
<p>每轮都只有一个入度为 0 的顶点，结果是 <strong>1 2 3 5 4 6</strong>。用 DFS 核对（从 1 开始，邻居按编号）：1 → 2 → 3 → 5 → 4 → 6 一路递归到底，完成顺序 6 4 5 3 2 1，倒过来一样。</p>
<p>这个答案还是<strong>唯一</strong>的：1→2、2→3、3→5、5→4、4→6 串起了全部 6 个顶点，相邻两个的先后都被边定死了。</p>

<h3>例题 2：选出合法的顺序</h3>
<p>课上那张图（A→C，A→E，B→D，B→E，C→D，C→E），下面哪些是合法的拓扑序？(a) A B C D E　(b) A C B E D　(c) A C D E B　(d) B C A E D　(e) B A C D E</p>
<p>每个顺序都把 6 条边逐条看一遍：</p>
<ul>
<li>(a) <strong>合法</strong>，上面的 C 代码输出的就是它。</li>
<li>(b) <strong>合法</strong>：A 在 C、E 前，B 在 D、E 前，C 在 D、E 前。</li>
<li>(c) <strong>不合法</strong>：B 在最后，B→D、B→E 向左。</li>
<li>(d) <strong>不合法</strong>：C 在 A 前，A→C 向左。</li>
<li>(e) <strong>合法</strong>。</li>
</ul>
<p>答案是 (a)(b)(e)。</p>

<div class="callout warn" data-label="易错">
<p>① 删除 u 时，减 1 的是 u 的<strong>出边终点</strong>的入度，不是指向 u 的顶点。② 要倒过来的是<strong>完成</strong>顺序，不是访问顺序；完成顺序不倒过来，每条边都向左。③ 有平局按题目规则选。④ 邻接矩阵下是 O(V²)，不是 O(V + E)。</p>
</div>

<h2>小结</h2>
<ul>
<li>拓扑排序：把 DAG 的所有顶点排成一行，每条边 u → v 都是 u 在前；有环就不存在，一般不唯一。</li>
<li>源点删除：反复输出入度为 0 的顶点，并把它出边终点的入度减 1；用队列存源点，<strong>O(V + E)</strong>。</li>
<li>DFS 法：把<strong>完成顺序倒过来</strong>（explore 结束时插到链表表头），O(V + E)；访问顺序不是拓扑序。邻接矩阵下两种方法都是 O(V²)。</li>
<li>检查答案：逐条边看是不是都从左指向右；源点删除输出不满 n 个，说明有环。</li>
</ul>
`;

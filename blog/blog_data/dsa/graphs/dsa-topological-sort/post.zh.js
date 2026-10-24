/* Post body — dsa-topological-sort / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-topological-sort:zh'] = `
<p class="lead"><strong>拓扑排序（topological sort）</strong>把有向无环图的所有顶点排成一行，使每条边都从左指向右。两种做法都是 O(V + E)：反复删掉入度为 0 的顶点（源点删除），或把 DFS 的完成顺序倒过来。</p>

<h2>例子：穿衣服的顺序</h2>
<p>早上要穿 7 件东西（shirt、jacket、socks、glasses、shoes、pants、watch），一次穿一件。三条先后约束画成箭头：shirt → jacket，socks → shoes，pants → shoes。</p>
<p>没有箭头相连的两件，谁先都行。shirt, jacket, pants, socks, shoes, glasses, watch 不违反任何箭头；watch, socks, glasses, pants, shoes, shirt, jacket 看着别扭，也合法。</p>
<p>合法顺序很多：7! = 5040 种排列里，shirt 在 jacket 前的占 1/2，shoes 在 socks、pants 之后的占 1/3，两者互不相干，共 5040 × 1/2 × 1/3 = 840 种。没有箭头指进来的 5 件（shirt、socks、glasses、pants、watch）都能排第一。</p>

<h2>定义</h2>
<p>物品换成顶点，箭头换成有向边。<strong>拓扑排序</strong>：给定一个<strong>有向无环图（directed acyclic graph, DAG）</strong>，把<strong>所有</strong>顶点排成一个线性顺序，使得<strong>每条边 (u, v) 的 u 都排在 v 前面</strong>。换句话说，顶点排成一行后，所有边都从左指向右。</p>
<ul>
  <li><strong>有环就没有拓扑序</strong>：环 v₁ → v₂ → … → vₖ → v₁ 要求 v₁ 在 v₂ 前、v₂ 在 v₃ 前……vₖ 在 v₁ 前，推出 v₁ 在自己前面，矛盾。</li>
  <li><strong>一般不唯一</strong>：上例有 840 个，下面两种算法各给出其中一个。</li>
  <li>它<strong>不是</strong> selection / insertion / merge / quick / heap sort 那样的比较排序：顶点上没有要比较的值，顺序只由边决定。</li>
</ul>

<h2>方法一：源点删除</h2>
<p>顶点的<strong>入度（in-degree）</strong>= 指向它的边数。<strong>入度为 0 的顶点叫源点（source）</strong>：没有顶点必须排在它前面，可以排第一。把它输出并连同出边删掉，剩下的仍是 DAG，再找新的源点。每轮把问题缩小一个顶点，属于减治（decrease-and-conquer）。这就是<strong>源点删除（source removal）</strong>：</p>
<ol>
  <li>算出每个顶点的入度。</li>
  <li>找一个入度为 0 的顶点。</li>
  <li>把它加入输出，删掉它的出边，即它的每个出邻居入度减 1。</li>
  <li>重复 2、3，直到图被删空。删除的顺序就是拓扑序。</li>
</ol>
<p>课上的例子：</p>
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
<p>结果 <strong>B A C E D</strong>。第 1 轮和第 4 轮有平局，课上分别选了 B 和 E（两次都取字母靠后的）；若<strong>按字母序取靠前的</strong>，依次输出 A B C D E，同样合法。<strong>题目规定了平局规则就必须照做</strong>，没规定就写明自己怎么选。</p>

<h3>复杂度</h3>
<p>第 2 步若每次扫一遍所有顶点找入度 0，每次 O(V)，总共 O(V²)。改用一个<strong>队列存入度为 0 的顶点</strong>：开始时所有源点入队；第 3 步里谁的入度减到 0，就把谁入队。每次取源点只要 O(1)。</p>
<ul>
  <li>算入度：邻接表把所有链表走一遍，O(V + E)；</li>
  <li>每个顶点入队、出队各一次，O(V)；</li>
  <li>每个顶点被删时看一遍它的出边，<strong>每条边恰好处理一次</strong>，O(E)。</li>
</ul>
<p>合计 <strong>O(V + E)</strong>，与 BFS、DFS 相同。用<strong>邻接矩阵</strong>时，算入度要扫整个矩阵，删一个顶点要扫一整行，总共 <strong>O(V²)</strong>。</p>

<h2>方法二：DFS 完成顺序倒过来</h2>
<p>DFS（见 7.3 深度优先搜索）的主循环对每个未访问顶点调用 explore(v)；explore(v) 标记 v，再对未访问的邻居递归。除了<strong>访问顺序</strong>（visiting / traversal order，explore 被调用的顺序），还要看 explore <strong>结束</strong>的顺序，课上叫 <strong>traversal stack pop order</strong>，简称完成顺序（finishing order）。</p>
<p>同一张图，从 A 开始，邻居按字母序：</p>
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
<p>访问顺序 A C D E B，完成顺序 <strong>D E C A B</strong>：内层调用先结束，explore(A) 要等 explore(C) 结束后才能结束。<strong>完成顺序倒过来，B A C E D，就是一个拓扑序</strong>（在这张图上恰好与源点删除的结果相同）。</p>

<h3>为什么倒过来就对</h3>
<p>任取一条边 u → v。explore(u) 检查 v 时只有三种情况：</p>
<ol>
  <li>v 未访问：explore(v) 在 explore(u) 里面被调用，<strong>v 先完成</strong>。</li>
  <li>v 已完成：v 更早就完成了。</li>
  <li>v 已访问但未完成：v 还在调用栈上，说明 u 是从 v 一路递归下来的，存在路径 v ⇝ u，再加上 u → v 就成了环。DAG 里不会出现这种情况。</li>
</ol>
<p>所以每条边都是终点先完成、起点后完成；倒过来以后，每条边都从左指向右。</p>
<p>实现时不必最后再倒序：<strong>explore(v) 结束时把 v 插到链表表头</strong>，DFS 跑完，链表就是拓扑序。只比 DFS 多一行，复杂度与 DFS 相同：邻接表 <strong>O(V + E)</strong>，邻接矩阵 O(V²)。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-topological-sort/anims/topo-sort.html" loading="lazy" style="height: 520px;" title="拓扑排序逐步演示"></iframe>
<p class="anim-caption">上方按钮切换“源点删除 / DFS 完成顺序”和两张图；源点删除模式下顶点旁的数字是当前入度，DFS 模式下 #k 表示第 k 个完成。</p>

<h2>检验答案：画边看方向</h2>
<p>考试常给出几个顺序，要求选出所有合法的。把顺序写成一行，画上原图的<strong>每一条</strong>边：全部向右就合法，有一条向左就不合法。</p>
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
<p>写成代码：记 pos[v] 为 v 在顺序中的位置，逐条边检查 pos[u] &lt; pos[v]，O(V + E)。第二行说明 <strong>DFS 的访问顺序不是拓扑序</strong>：B 最后才被访问，却必须排在 D、E 前面。这张图共有 6 个合法拓扑序：A B C D E、A B C E D、A C B D E、A C B E D、B A C D E、B A C E D。</p>

<h2>C 实现</h2>
<p>源点删除，邻接表存图，用数组当队列（每个顶点最多入队一次，长度 n 就够）：</p>
<pre><code>#include &lt;stddef.h&gt;          /* NULL */

#define MAXV 26

typedef struct node node_t;
struct node {
    int v;                /* 边 u→v 的终点 v */
    node_t *next;
};

/* 源点删除。adj[u] 是 u 的出边链表，顶点编号 0..n-1。
   拓扑序写进 order[]，返回写入的顶点个数；小于 n 说明图里有环 */
int topo_source_removal(int n, node_t *adj[], int order[]) {
    int indeg[MAXV], queue[MAXV];
    int head = 0, tail = 0, cnt = 0;

    for (int v = 0; v &lt; n; v++) {
        indeg[v] = 0;
    }
    for (int u = 0; u &lt; n; u++) {               /* 1. 算入度：O(V + E) */
        for (node_t *p = adj[u]; p != NULL; p = p-&gt;next) {
            indeg[p-&gt;v]++;
        }
    }
    for (int v = 0; v &lt; n; v++) {               /* 2. 源点入队 */
        if (indeg[v] == 0) {
            queue[tail++] = v;
        }
    }
    while (head &lt; tail) {
        int u = queue[head++];                  /* O(1) 拿到一个源点 */
        order[cnt++] = u;
        for (node_t *p = adj[u]; p != NULL; p = p-&gt;next) {
            indeg[p-&gt;v]--;                      /* 3. 删掉边 u→v */
            if (indeg[p-&gt;v] == 0) {
                queue[tail++] = p-&gt;v;           /* v 成了新的源点 */
            }
        }
    }
    return cnt;
}</code></pre>
<p><strong>返回值小于 n 说明有环</strong>：环上的顶点入度永远减不到 0，队列会提前变空（见练习 3）。对课上的图（链表按字母序），A、B 依次入队，输出 <strong>A B C D E</strong>：队列的平局规则是“先入队的先出”，结果与手算的 B A C E D 不同，两者都合法。</p>
<p>DFS 版只在 explore 末尾加一行。下面用数组代替链表，从末尾往前填，效果与“插到表头”相同：</p>
<pre><code>/* explore(v) 结束时把 v 写到 order[] 当前最前面的空位 */
void explore(node_t *adj[], int v, int visited[], int order[], int *front) {
    visited[v] = 1;
    for (node_t *p = adj[v]; p != NULL; p = p-&gt;next) {
        if (!visited[p-&gt;v]) {
            explore(adj, p-&gt;v, visited, order, front);
        }
    }
    order[--*front] = v;          /* 完成：相当于插到链表表头 */
}

void topo_dfs(int n, node_t *adj[], int order[]) {
    int visited[MAXV] = {0}, front = n;      /* 全部未访问 */
    for (int v = 0; v &lt; n; v++) {
        if (!visited[v]) {
            explore(adj, v, visited, order, &amp;front);
        }
    }
}</code></pre>
<p>同一张图输出 B A C E D，与上面的追踪一致。</p>

<h2>考试怎么考</h2>
<ul>
  <li><strong>求一个拓扑序</strong>：2016 年期末考过（6 个顶点，要求写过程，见练习 1）。源点删除就写出每轮入度为 0 的顶点和入度变化；DFS 就写出完成顺序，再倒过来。</li>
  <li><strong>选出所有合法顺序</strong>：课上小测的题型。逐条边检查 pos[u] &lt; pos[v]，有一条反向就排除。</li>
  <li><strong>概念判断</strong>：只对 DAG 有定义；一般不唯一；不是比较排序；两种方法都是 O(V + E)（邻接表）或 O(V²)（邻接矩阵）；DFS 的访问顺序不是拓扑序。</li>
  <li><strong>写代码 / 设计</strong>：写源点删除（入度数组 + 队列），或在 DFS 上加一行；改成判断有向图是否有环。</li>
  <li>公式表上没有这些，两种算法的步骤和复杂度都要记住。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>① 删除顶点 u 时，减 1 的是 u 的<strong>出边终点</strong>的入度，不是指向 u 的顶点。② 倒过来的是<strong>完成</strong>顺序，不是访问顺序；完成顺序本身是反向的拓扑序，不倒过来就错。③ 有平局时按题目给的规则选。④ 邻接矩阵下复杂度是 O(V²)，不是 O(V + E)。</p>
</div>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">1.（2016 年期末题改写）有向图的边为 1→2，1→4，2→3，2→4，2→6，3→5，4→6，5→4，5→6。求一个拓扑序，写出过程。</summary>
  <div class="qa__body">
<p>源点删除。初始入度：1 是 0，2 是 1，3 是 1，4 是 3，5 是 1，6 是 3。</p>
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
<p>每轮都只有一个入度为 0 的顶点，结果 <strong>1 2 3 5 4 6</strong>。</p>
<p>用 DFS 核对（从 1 开始，邻居按编号）：递归链 1 → 2 → 3 → 5 → 4 → 6 一路走到底，之后遇到的邻居都已访问，完成顺序 6 4 5 3 2 1，倒过来同样是 1 2 3 5 4 6。</p>
<p>这个答案是<strong>唯一</strong>的：1→2、2→3、3→5、5→4、4→6 连成一条经过全部 6 个顶点的路径，任意两个相邻顶点的先后都被边固定了。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">2. 课上那张图（A→C，A→E，B→D，B→E，C→D，C→E）。下列哪些是合法的拓扑序（多选）？(a) A B C D E　(b) A C B E D　(c) A C D E B　(d) B C A E D　(e) B A C D E</summary>
  <div class="qa__body">
<p>对每个顺序逐条检查 6 条边是否都向右：</p>
<ul>
  <li>(a) <strong>合法</strong>。按字母序处理平局的源点删除、以及上面的 C 代码，输出的都是它。</li>
  <li>(b) <strong>合法</strong>。B 在 D、E 前，A 在 C、E 前，C 在 D、E 前。</li>
  <li>(c) <strong>不合法</strong>：B 在最后，B→D、B→E 向左。这是 DFS 的访问顺序。</li>
  <li>(d) <strong>不合法</strong>：C 排在 A 前，A→C 向左。</li>
  <li>(e) <strong>合法</strong>。</li>
</ul>
<p>答案 (a)(b)(e)。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">3. 在课上那张图里加一条边 D→A。(1) 运行上面的 topo_source_removal 会发生什么？(2) 怎样用它判断有向图有没有环？(3) DFS 版怎样发现这个环？</summary>
  <div class="qa__body">
<p>(1) 入度变为 A 1，B 0，C 1，D 2，E 3，只有 B 入队。输出 B，删掉 B→D、B→E：D 变 1，E 变 2，没有新的入度 0，队列空了，返回 <strong>cnt = 1 &lt; 5</strong>。剩下的 A、C、D、E 入度都 ≥ 1：A→C→D→A 是环，E 被环上的顶点指着，也出不来。</p>
<p>(2) <strong>cnt &lt; n 当且仅当有环</strong>。有环时，假如环上的顶点都能输出，看其中最先输出的那个：那时它在环上的前一个顶点还没输出，那条边还在，入度 ≥ 1，矛盾。无环时不会卡住：每个 DAG 都有源点，否则从任一顶点沿入边倒着走能一直走下去，走 V 步必有顶点重复，形成环；删掉顶点后剩下的仍是 DAG，所以每轮都有源点。</p>
<p>(3) 看“为什么倒过来就对”里的第 3 种情况：检查边 u→v 时 v 已访问但<strong>还没完成</strong>（还在调用栈上），就说明有环。把 visited 的 0/1 换成三种状态：未访问、在栈上、已完成。本例 explore(A) → explore(C) → explore(D)，D 检查 D→A 时，A 还在栈上，发现环。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">4. 判断对错：(a) 每个 DAG 至少有一个入度为 0 的顶点；(b) 用邻接矩阵存图时，源点删除是 O(V + E)；(c) 若 DAG 中有一条经过所有顶点的路径，它的拓扑序唯一；(d) 直接输出 DFS 的完成顺序（不倒过来）也是一个合法拓扑序。</summary>
  <div class="qa__body">
<p>(a) <strong>对</strong>，论证见练习 3。</p>
<p>(b) <strong>错</strong>，是 O(V²)：算入度要读完 V × V 个格子；每删一个顶点要扫它那一行的 V 个格子，共 V 次。</p>
<p>(c) <strong>对</strong>：路径上相邻的两个顶点之间有边，先后被固定，只能按路径的顺序排，练习 1 就是例子。</p>
<p>(d) <strong>错</strong>：完成顺序里每条边都是终点在前，是反向的拓扑序。例如 D E C A B 中，A→C 指向左边。</p>
  </div>
</details>
`;

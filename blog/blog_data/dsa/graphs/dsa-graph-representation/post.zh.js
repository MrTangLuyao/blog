/* Post body — dsa-graph-representation / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-graph-representation:zh'] = `
<p class="lead">图在程序里有两种标准存法：<strong>邻接矩阵（adjacency matrix）</strong>是一张 V × V 的“有没有边”表格，<strong>邻接表（adjacency lists）</strong>给每个顶点挂一条邻居链表。矩阵查边快，邻接表省空间、列邻居快，DFS、BFS 的复杂度也跟着变。</p>

<h2>从一个场景说起</h2>
<p>你要记下全年级 200 个同学里谁和谁是微信好友，有两种记法。</p>
<p><strong>记法一：一张大表格。</strong>行和列都写上 200 个名字，两人是好友就在对应的格子打勾。问两个人是不是好友，看一格就知道。可表格有 40000 格，每人只有几十个好友，绝大多数格子是空的。</p>
<p><strong>记法二：每人一页通讯录</strong>，只写这个人的好友。纸省多了，列出小王的所有好友，翻到他那页照着念就行。但问“小王和小李是不是好友”，就得把小王那页从头读到尾。</p>
<p>图在程序里也正好这两种存法。</p>

<h2>它是什么</h2>
<p>图（graph）由顶点（vertex）和连接两个顶点的边（edge）组成。复杂度里 V 是顶点个数，E 是边的条数；程序里顶点编号 0 到 V − 1。存一张图，就是记住<strong>哪两个顶点之间有边</strong>：</p>
<ul>
<li><strong>邻接矩阵</strong>：V × V 的二维数组，<code>adj[i][j] = 1</code> 表示 i 和 j 之间有边，0 表示没有。就是那张大表格。</li>
<li><strong>邻接表</strong>：长度为 V 的数组，第 i 格是一条链表的表头，链表里存 i 的所有邻居（neighbour，和 i 有边相连的顶点）。就是每人一页的通讯录。</li>
</ul>

<h2>看个例子</h2>
<p>课上的图：5 个顶点 A–E（编号 0–4），4 条无向边 A–C、B–C、B–D、C–D。顶点 E 一条边都没有，叫孤立点（isolated vertex）。别把边数 E 和顶点 E 搞混。</p>
<figure class="fig">
<svg viewBox="0 0 380 180" width="380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="课上的 5 顶点无向图">
<line x1="40" y1="95" x2="140" y2="95" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="240" y1="35" x2="140" y2="95" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="240" y1="35" x2="240" y2="155" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="140" y1="95" x2="240" y2="155" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<circle cx="40" cy="95" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="40" y="95" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">A</text>
<text x="40" y="131" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#a1a1a0">0</text>
<circle cx="240" cy="35" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="240" y="35" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">B</text>
<text x="268" y="35" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#a1a1a0">1</text>
<circle cx="140" cy="95" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="140" y="95" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">C</text>
<text x="140" y="59" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#a1a1a0">2</text>
<circle cx="240" cy="155" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="240" y="155" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">D</text>
<text x="268" y="155" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#a1a1a0">3</text>
<circle cx="340" cy="95" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="340" y="95" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">E</text>
<text x="340" y="131" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#a1a1a0">4</text>
</svg>
<figcaption>边：A–C、B–C、B–D、C–D；灰色小字是顶点编号</figcaption>
</figure>

<h3>存成邻接矩阵</h3>
<p>每条边填两个 1，比如 A–C 填 A 行 C 列和 C 行 A 列。4 条边填完：</p>
<table>
<thead><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr></thead>
<tbody>
<tr><th>A</th><td>0</td><td>0</td><td><strong>1</strong></td><td>0</td><td>0</td></tr>
<tr><th>B</th><td>0</td><td>0</td><td><strong>1</strong></td><td><strong>1</strong></td><td>0</td></tr>
<tr><th>C</th><td><strong>1</strong></td><td><strong>1</strong></td><td>0</td><td><strong>1</strong></td><td>0</td></tr>
<tr><th>D</th><td>0</td><td><strong>1</strong></td><td><strong>1</strong></td><td>0</td><td>0</td></tr>
<tr><th>E</th><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
</tbody>
</table>
<p>按行读就是每个顶点的邻居：C 行有三个 1，C 的邻居是 A、B、D；E 行全是 0。在 C 里它就是 <code>int adj[5][5]</code>，字母并不存。三个规律：</p>
<ul>
<li><strong>对称（symmetric）</strong>：加一条边要改两格，所以 1 的个数 = 2E（这里是 8）。</li>
<li><strong>一行里 1 的个数 = 这个顶点的度（degree）</strong>，即它有几条边，记作 deg(u)。C 的度是 3。</li>
<li><strong>对角线全是 0</strong>：本课只用简单图（simple graph），没有自己连自己的自环（self-loop）。</li>
</ul>

<h3>存成邻接表</h3>
<p>左边一列是长度为 5 的表头数组，每格拉出一条邻居链表（图里按字母序画）：</p>
<figure class="fig">
<svg viewBox="0 0 280 200" width="280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="课上例子的邻接表">
<defs><marker id="dsa-grep-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.6)"/></marker></defs>
<text x="12" y="22" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#a1a1a0">A</text>
<rect x="26" y="2.5" width="30" height="39" fill="#343433" stroke="#5a5a59" stroke-width="1.5"/>
<circle cx="41" cy="22" r="3" fill="#e8e8e8"/>
<line x1="41" y1="22" x2="76" y2="22" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" marker-end="url(#dsa-grep-arr)"/>
<rect x="76" y="8" width="44" height="28" rx="4" fill="#343433" stroke="#5a5a59" stroke-width="1.5"/>
<line x1="104" y1="8" x2="104" y2="36" stroke="#5a5a59" stroke-width="1.5"/>
<text x="90" y="22" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">C</text>
<line x1="107" y1="32" x2="117" y2="12" stroke="#a1a1a0" stroke-width="1.5"/>
<text x="12" y="61" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#a1a1a0">B</text>
<rect x="26" y="41.5" width="30" height="39" fill="#343433" stroke="#5a5a59" stroke-width="1.5"/>
<circle cx="41" cy="61" r="3" fill="#e8e8e8"/>
<line x1="41" y1="61" x2="76" y2="61" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" marker-end="url(#dsa-grep-arr)"/>
<rect x="76" y="47" width="44" height="28" rx="4" fill="#343433" stroke="#5a5a59" stroke-width="1.5"/>
<line x1="104" y1="47" x2="104" y2="75" stroke="#5a5a59" stroke-width="1.5"/>
<text x="90" y="61" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">C</text>
<circle cx="112" cy="61" r="3" fill="#e8e8e8"/>
<line x1="112" y1="61" x2="142" y2="61" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" marker-end="url(#dsa-grep-arr)"/>
<rect x="142" y="47" width="44" height="28" rx="4" fill="#343433" stroke="#5a5a59" stroke-width="1.5"/>
<line x1="170" y1="47" x2="170" y2="75" stroke="#5a5a59" stroke-width="1.5"/>
<text x="156" y="61" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">D</text>
<line x1="173" y1="71" x2="183" y2="51" stroke="#a1a1a0" stroke-width="1.5"/>
<text x="12" y="100" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#a1a1a0">C</text>
<rect x="26" y="80.5" width="30" height="39" fill="#343433" stroke="#5a5a59" stroke-width="1.5"/>
<circle cx="41" cy="100" r="3" fill="#e8e8e8"/>
<line x1="41" y1="100" x2="76" y2="100" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" marker-end="url(#dsa-grep-arr)"/>
<rect x="76" y="86" width="44" height="28" rx="4" fill="#343433" stroke="#5a5a59" stroke-width="1.5"/>
<line x1="104" y1="86" x2="104" y2="114" stroke="#5a5a59" stroke-width="1.5"/>
<text x="90" y="100" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">A</text>
<circle cx="112" cy="100" r="3" fill="#e8e8e8"/>
<line x1="112" y1="100" x2="142" y2="100" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" marker-end="url(#dsa-grep-arr)"/>
<rect x="142" y="86" width="44" height="28" rx="4" fill="#343433" stroke="#5a5a59" stroke-width="1.5"/>
<line x1="170" y1="86" x2="170" y2="114" stroke="#5a5a59" stroke-width="1.5"/>
<text x="156" y="100" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">B</text>
<circle cx="178" cy="100" r="3" fill="#e8e8e8"/>
<line x1="178" y1="100" x2="208" y2="100" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" marker-end="url(#dsa-grep-arr)"/>
<rect x="208" y="86" width="44" height="28" rx="4" fill="#343433" stroke="#5a5a59" stroke-width="1.5"/>
<line x1="236" y1="86" x2="236" y2="114" stroke="#5a5a59" stroke-width="1.5"/>
<text x="222" y="100" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">D</text>
<line x1="239" y1="110" x2="249" y2="90" stroke="#a1a1a0" stroke-width="1.5"/>
<text x="12" y="139" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#a1a1a0">D</text>
<rect x="26" y="119.5" width="30" height="39" fill="#343433" stroke="#5a5a59" stroke-width="1.5"/>
<circle cx="41" cy="139" r="3" fill="#e8e8e8"/>
<line x1="41" y1="139" x2="76" y2="139" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" marker-end="url(#dsa-grep-arr)"/>
<rect x="76" y="125" width="44" height="28" rx="4" fill="#343433" stroke="#5a5a59" stroke-width="1.5"/>
<line x1="104" y1="125" x2="104" y2="153" stroke="#5a5a59" stroke-width="1.5"/>
<text x="90" y="139" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">B</text>
<circle cx="112" cy="139" r="3" fill="#e8e8e8"/>
<line x1="112" y1="139" x2="142" y2="139" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" marker-end="url(#dsa-grep-arr)"/>
<rect x="142" y="125" width="44" height="28" rx="4" fill="#343433" stroke="#5a5a59" stroke-width="1.5"/>
<line x1="170" y1="125" x2="170" y2="153" stroke="#5a5a59" stroke-width="1.5"/>
<text x="156" y="139" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">C</text>
<line x1="173" y1="149" x2="183" y2="129" stroke="#a1a1a0" stroke-width="1.5"/>
<text x="12" y="178" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#a1a1a0">E</text>
<rect x="26" y="158.5" width="30" height="39" fill="#343433" stroke="#5a5a59" stroke-width="1.5"/>
<line x1="30" y1="193" x2="52" y2="163" stroke="#a1a1a0" stroke-width="1.5"/>
</svg>
<figcaption>左边一列是表头数组，斜线表示 NULL；顶点 E 的表为空</figcaption>
</figure>
<ul>
<li><strong>每条无向边存两次</strong>：B–D 既在 B 的表里，也在 D 的表里，就像好友在两人的通讯录里各写一遍。结点总数 = 2E = 8。</li>
<li><strong>表的长度 = 度</strong>。孤立点 E 的表头是 NULL，但数组里照样占一格。</li>
<li><strong>表内顺序没有规定</strong>：C 的表写成 D → B → A 也对，所以同一张图可以有多种邻接表。顺序会影响 DFS、BFS 先走哪个邻居（见 7.3、7.4）。</li>
</ul>

<iframe class="anim-frame" src="blog/blog_data/dsa-graph-representation/anims/adj-toggle.html" loading="lazy" style="height: 520px;" title="邻接矩阵与邻接表同步加边删边"></iframe>
<p class="anim-caption">点一个顶点，黄框标出它的矩阵行和链表；再点另一个顶点（或直接点矩阵格子）就加边或删边，留意两种存法总是一起变。切到“有向”，看矩阵不再对称。</p>

<h2>有向图和带权图</h2>
<p><strong>有向图（directed graph）</strong>的边有方向，像“关注”：你关注他，他不一定关注你。</p>
<ul>
<li>矩阵：adj[i][j] = 1 表示边 i → j，只改一格，所以<strong>一般不对称</strong>。行和 = 出度（out-degree，从它出发的边数），列和 = 入度（in-degree，指向它的边数）。</li>
<li>邻接表：u → v 只存一次，在 u 的表里，结点总数 = E。</li>
</ul>
<p><strong>带权图（weighted graph）</strong>的每条边带一个数，比如距离。矩阵格子里直接存权重，“没有边”用 <strong>∞ 或 −1</strong> 表示，<strong>不能用 0</strong>，因为 0 可能是合法的权重；邻接表在结点里多存一个权重。课上的例子（A–B 3，A–C 10，B–D 2，C–D 2）：</p>
<table>
<thead><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead>
<tbody>
<tr><th>A</th><td>∞</td><td>3</td><td>10</td><td>∞</td></tr>
<tr><th>B</th><td>3</td><td>∞</td><td>∞</td><td>2</td></tr>
<tr><th>C</th><td>10</td><td>∞</td><td>∞</td><td>2</td></tr>
<tr><th>D</th><td>∞</td><td>2</td><td>2</td><td>∞</td></tr>
</tbody>
</table>
<p>对角线也是“没有边”，写 ∞（Floyd–Warshall 的距离矩阵把对角线设为 0，见 7.6）。</p>

<h2>各项操作的代价</h2>
<p>汇总一下：</p>
<table>
<thead><tr><th>操作</th><th>邻接矩阵</th><th>邻接表</th></tr></thead>
<tbody>
<tr><td>空间</td><td>O(V²)</td><td>O(V + E)</td></tr>
<tr><td>查边 u–v</td><td>O(1)</td><td>O(deg(u))，最坏 O(V)</td></tr>
<tr><td>列出 u 的邻居</td><td>O(V)</td><td>O(deg(u))</td></tr>
<tr><td>加边</td><td>O(1)</td><td>O(1)（插到表头，不查重）</td></tr>
<tr><td>删边 u–v</td><td>O(1)</td><td>O(deg(u) + deg(v))，要先找到结点</td></tr>
</tbody>
</table>
<p>矩阵永远占 V² 格，一条边都没有也一样；邻接表是 V 个表头加 2E 个结点。矩阵查边读一格，列邻居却要扫完一整行；邻接表正好反过来，查边要沿表一个个比（deg(u) 最多 V − 1），列邻居只碰真正的邻居。</p>
<p>选哪种，看边多不多。每两个顶点都连上的叫完全图（complete graph），有 V(V − 1)/2 条边，所以总有 E = O(V²)。</p>
<ul>
<li><strong>稀疏图（sparse graph）</strong>：E 和 V 同阶，比如路网。V = 10⁴、E = 3 × 10⁴ 时，矩阵要 10⁸ 格，邻接表约 10⁴ + 6 × 10⁴ = 7 × 10⁴ 个单元。<strong>用邻接表。</strong></li>
<li><strong>稠密图（dense graph）</strong>：E 和 V² 同阶。邻接表省不下空间，每个结点还多一个指针，查边又慢。<strong>用邻接矩阵。</strong></li>
</ul>
<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/4R7chuhzq7k" title="Representation of graph using adjacency matrix and adjacency list" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Techdose《Representation of graph using adjacency matrix and adjacency list》（英文，约 11 分钟），演示无向图、有向图的两种存法和各自的优缺点。</p>

<h2>存法决定 DFS / BFS 的复杂度</h2>
<p>DFS 和 BFS 都把每个顶点“展开”恰好一次，也就是列出它的全部邻居。总代价就是每个顶点列一次邻居，加起来：</p>
<ul>
<li>邻接表：V 个表头 + 2E 个结点，<strong>O(V + E)</strong>。例子里是 5 + 8 = 13 次。</li>
<li>邻接矩阵：每个顶点扫一整行，V × V，<strong>O(V²)</strong>。例子里是 25 格，和边数无关。</li>
</ul>
<p>稀疏图上 V² 比 V + E 大得多；稠密图上两者同阶。Dijkstra 也一样：二叉堆 + 邻接表是 O((V + E) log V)；矩阵 + 每轮线性扫描找最小 dist 是 O(V²)，稠密图上反而更快（见 7.5）。</p>
<div class="callout key" data-label="考点"><p>图算法的复杂度要连同存法一起答：“DFS/BFS 是 O(V + E)”说的是邻接表；题目给的是邻接矩阵，就答 O(V²)。</p></div>

<h2>C 里怎么写</h2>
<p>输入通常是一串边（边表，edge list），逐条读进来建邻接表：</p>
<pre><code>typedef struct node {
    int v;                     /* 邻居的编号 */
    struct node *next;
} node_t;

node_t *adj[MAXV];             /* adj[u]：u 的表头，初值全是 NULL */

/* 把 v 插到 u 的表头 */
void push(int u, int v) {
    node_t *p = malloc(sizeof(*p));
    assert(p != NULL);
    p-&gt;v = v;
    p-&gt;next = adj[u];
    adj[u] = p;
}

/* 无向边 u-v：两张表各插一次 */
void add_edge(int u, int v) {
    push(u, v);
    push(v, u);
}</code></pre>
<ul>
<li><code>adj</code>：表头数组。全局数组自动初始化成 NULL，一开始每张表都是空的。</li>
<li><code>push</code>：新结点的 <code>next</code> 指向原来的第一个结点，再让表头指向新结点，v 就插到了最前面，O(1)。</li>
<li><code>add_edge</code>：u 的表里放 v，v 的表里放 u，两张表都要插。</li>
</ul>
<p>因为插在表头，后加的邻居排在前面：按 A–C、B–C、B–D、C–D 的顺序加边，C 的表是 D → B → A，和上图顺序相反，仍是同一张图。</p>
<p>查边就是沿 u 的表逐个比 <code>p-&gt;v == v</code>，走到 NULL 还没找到就是没有。矩阵版加边只有两句 <code>m[u][v] = 1; m[v][u] = 1;</code>，查边读一格。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>手算转换</strong>：图、矩阵、邻接表互相转换。画出来形状不同没关系，顶点和边一样就是同一张图。</li>
<li><strong>选择、填空</strong>：代价表（公式表上没有，要自己记）；计数：无向图矩阵里 1 的个数 = 邻接表结点数 = 2E，有向图都是 E；完全图 E = V(V − 1)/2。</li>
<li><strong>用 E 表示复杂度</strong>：2015 年对 Floyd–Warshall 这样问过。稠密图 E ≈ V²，即 V ≈ √E；稀疏图 E ≈ V。</li>
<li><strong>写代码</strong>：结构体、加边、查边，或者把矩阵转成邻接表。</li>
</ul>

<h3>例题 1：有向图，矩阵转邻接表</h3>
<p>有向图的邻接矩阵如下（行 = 起点，列 = 终点）。(a) 矩阵对称吗？(b) 写出邻接表（表内按字母序）。(c) 求每个顶点的出度和入度。(d) 要找出所有指向 C 的顶点，两种存法各要多少代价？</p>
<table>
<thead><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead>
<tbody>
<tr><th>A</th><td>0</td><td>1</td><td>1</td><td>0</td></tr>
<tr><th>B</th><td>0</td><td>0</td><td>1</td><td>0</td></tr>
<tr><th>C</th><td>1</td><td>0</td><td>0</td><td>1</td></tr>
<tr><th>D</th><td>0</td><td>1</td><td>0</td><td>0</td></tr>
</tbody>
</table>
<p>(a) <strong>不对称</strong>，找到一对不相等的格子就够了：adj[A][B] = 1 而 adj[B][A] = 0。</p>
<p>(b) 每行的一个 1 变成起点表里的一个结点：A: B → C；B: C；C: A → D；D: B。共 6 个结点，等于边数（有向边只存一次）。</p>
<p>(c) 出度看行和：A 2，B 1，C 2，D 1。入度看列和：A 1（C→A），B 2（A→B、D→B），C 2（A→C、B→C），D 1（C→D）。两组之和都是 6 = 边数，可以自检。</p>
<p>(d) 矩阵：扫 C 那一列 4 格，得 A、B，O(V)。邻接表：指向 C 的边不在 C 自己的表里，只能把所有表走一遍，4 个表头 + 6 个结点，O(V + E)。</p>

<h3>例题 2：路网用哪种</h3>
<p>某无向路网 V = 10⁴，E = 5 × 10⁴，int 占 4 字节、指针占 8 字节。(a) int 型邻接矩阵和上面 node_t 的邻接表各占多少内存？(b) 邻接矩阵上的 DFS 是 O(V²)，分别写成稀疏图（E ≈ V）和稠密图（E ≈ V²）下关于 E 的式子。</p>
<p>(a) 矩阵：10⁸ 格 × 4 字节 = 4 × 10⁸ 字节，约 400 MB。邻接表：表头 10⁴ 个指针，8 × 10⁴ 字节；结点 2E = 10⁵ 个，每个 16 字节（int 4 + 对齐填充 4 + 指针 8），共 1.6 × 10⁶ 字节。合计约 1.7 MB，不到矩阵的 1/200。</p>
<p>(b) 稀疏图 E ≈ V，O(V²) = <strong>O(E²)</strong>。稠密图 V ≈ √E，O(V²) = <strong>O(E)</strong>。邻接表的 O(V + E) 两种情况下都是 O(E)，所以稀疏图上矩阵慢了一个 E 的因子。</p>

<div class="callout warn" data-label="易错">
<ul>
<li>无向图加边只改了一格，或只插了一张表。</li>
<li>矩阵列邻居不是 O(1)，要扫整行；邻接表查边不是 O(1)，要沿链表走。</li>
<li>邻接表空间写成 O(E)：漏了 V 个表头，孤立点多时 V 可能远大于 E。</li>
<li>带权矩阵用 0 表示“没有边”。</li>
<li>矩阵转邻接表时对每个 1 调 <code>add_edge</code>：每条无向边在矩阵里本来就有两个 1，结果存了 4 次。每个 1 只 <code>push</code> 一次即可，每格都要看，Θ(V²)。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>邻接矩阵：V × V 的 0/1 表。无向图对称，1 的个数 = 2E；有向图行和 = 出度，列和 = 入度；带权图用 ∞ 或 −1 表示没有边。</li>
<li>邻接表：V 个表头各挂一条邻居链表。无向边存两次，有向边存一次；表内顺序不固定。</li>
<li>矩阵：空间 O(V²)，查边 O(1)，列邻居 O(V)。邻接表：空间 O(V + E)，查边和列邻居都是 O(deg(u))。</li>
<li>稀疏图用邻接表，稠密图用矩阵。</li>
<li>DFS/BFS 用邻接表 O(V + E)，用矩阵 O(V²)。</li>
</ul>
`;

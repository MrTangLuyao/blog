/* Post body — dsa-graph-representation / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-graph-representation:zh'] = `
<p class="lead">图在程序里有两种标准存法：<strong>邻接矩阵（adjacency matrix）</strong>用 V × V 的二维数组记录每对顶点之间有没有边，<strong>邻接表（adjacency lists）</strong>给每个顶点挂一条邻居链表。两者在空间、查边、列邻居上的代价不同，DFS、BFS、Dijkstra 的复杂度也随之改变。</p>

<h2>课上的例子</h2>
<p>5 个顶点 A–E，4 条无向边 A–C、B–C、B–D、C–D，顶点 E 是孤立点（isolated vertex），没有边。程序里顶点用编号 0 到 V − 1 表示（A = 0，…，E = 4）。复杂度里的 V 是顶点数，E 是边数（与顶点 E 无关）。</p>
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

<h2>邻接矩阵</h2>
<p>每一对顶点要么有边，要么没有，于是开一张 V × V 的表，<strong>adj[i][j] = 1 表示 i 与 j 之间有边，0 表示没有</strong>。例子的矩阵：</p>
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
<p>按行读：A 行是 0 0 1 0 0，A 只和 C 相连；C 行有三个 1，C 的邻居是 A、B、D；顶点 E 那一行全是 0。在 C 语言里它就是 <code>int adj[5][5]</code> 这 25 个整数，行列上的字母不存。</p>
<ul>
  <li><strong>无向图的矩阵对称</strong>：adj[i][j] = adj[j][i]，加一条边要改两格，所以 1 的个数 = 2E（例子是 8）。第 i 行 1 的个数就是 i 的度（degree）。</li>
  <li>本课程只用简单图（simple graph），没有自环，<strong>主对角线全为 0</strong>。</li>
  <li><strong>有向图</strong>：adj[i][j] = 1 表示边 i → j，<strong>矩阵一般不对称</strong>。第 i 行的 1 是从 i 出发的边（行和 = 出度 out-degree），第 j 列的 1 是指向 j 的边（列和 = 入度 in-degree）。</li>
  <li><strong>带权图</strong>：格子里存权重，“没有边”用 <strong>∞ 或 −1</strong> 表示；不能用 0，因为 0 可能是合法的权重。</li>
</ul>
<p>带权的例子（A–B 3，A–C 10，B–D 2，C–D 2）。对角线也是“没有边”，写 ∞（Floyd–Warshall 的距离矩阵把对角线设为 0，见 7.6）。</p>
<table>
<thead><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead>
<tbody>
<tr><th>A</th><td>∞</td><td>3</td><td>10</td><td>∞</td></tr>
<tr><th>B</th><td>3</td><td>∞</td><td>∞</td><td>2</td></tr>
<tr><th>C</th><td>10</td><td>∞</td><td>∞</td><td>2</td></tr>
<tr><th>D</th><td>∞</td><td>2</td><td>2</td><td>∞</td></tr>
</tbody>
</table>
<p>代价：<strong>空间 O(V²)</strong>，与边数无关，一条边都没有也占 V² 格；<strong>查边 u–v 是 O(1)</strong>，读一格即可；<strong>列出 u 的全部邻居是 O(V)</strong>，没有邻居也得扫完整行。</p>

<h2>邻接表</h2>
<p>矩阵里多数格子往往是 0。换个存法，每个顶点只记真正的邻居。开一个长度为 V 的数组，第 i 格是一条链表的表头，链表结点存 i 的邻居编号。例子（表内按字母序）：</p>
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
  <li><strong>每条无向边存两次</strong>：B–D 既是 B 表里的 D，也是 D 表里的 B，结点总数 = 2E（例子是 8）。有向边 u → v 只存一次，在 u 的表里，结点总数 = E。</li>
  <li>u 的表长 = deg(u)。孤立点的表头是 NULL，但数组里照样占一格。</li>
  <li><strong>表内顺序没有要求</strong>，同一张图可以写出多种邻接表；矩阵则在编号定好后唯一。顺序会影响 DFS、BFS 的访问顺序（见 7.3、7.4）。</li>
  <li>带权图在结点里多存一个权重字段。</li>
</ul>
<p>代价：<strong>空间 O(V + E)</strong>，V 个表头加 2E 个结点；<strong>查边 u–v 是 O(deg(u))</strong>，要沿 u 的表逐个比较，deg(u) 最多 V − 1，最坏 O(V)；<strong>列出 u 的全部邻居也是 O(deg(u))</strong>，只碰真正的邻居。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-graph-representation/anims/adj-toggle.html" loading="lazy" style="height: 520px;" title="邻接矩阵与邻接表同步加边删边"></iframe>
<p class="anim-caption">点一个顶点看它的矩阵行和链表，再点另一个顶点（或点矩阵格子）加边、删边；切到“有向”看矩阵失去对称。</p>

<h2>C 实现：从边表建邻接表</h2>
<p>输入常是一串边（边表，edge list）。逐条读入，对无向边 u–v 在两张表的<strong>表头</strong>各插一个结点，每次 O(1)，整张图 O(V + E) 建好：</p>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;assert.h&gt;

typedef struct node {
    int v;                        /* 邻居的编号 */
    struct node *next;
} node_t;

typedef struct {
    int nv;                       /* 顶点数 V */
    node_t **adj;                 /* adj[u]：u 的邻居链表的表头 */
} graph_t;

graph_t *graph_new(int nv) {
    graph_t *g = malloc(sizeof(*g));
    assert(g != NULL);
    g-&gt;nv = nv;
    g-&gt;adj = calloc(nv, sizeof(*g-&gt;adj));   /* V 个表头，全是 NULL */
    assert(g-&gt;adj != NULL);
    return g;
}

/* 把 v 插到 u 的表头：O(1) */
void push(graph_t *g, int u, int v) {
    node_t *p = malloc(sizeof(*p));
    assert(p != NULL);
    p-&gt;v = v;
    p-&gt;next = g-&gt;adj[u];
    g-&gt;adj[u] = p;
}

/* 无向边 u-v：两张表各插一次 */
void add_edge(graph_t *g, int u, int v) {
    push(g, u, v);
    push(g, v, u);
}

/* 查边：沿 u 的表逐个比较，O(deg(u)) */
int has_edge(const graph_t *g, int u, int v) {
    for (node_t *p = g-&gt;adj[u]; p != NULL; p = p-&gt;next) {
        if (p-&gt;v == v) return 1;
    }
    return 0;
}

void graph_free(graph_t *g) {
    for (int u = 0; u &lt; g-&gt;nv; u++) {
        while (g-&gt;adj[u] != NULL) {
            node_t *dead = g-&gt;adj[u];
            g-&gt;adj[u] = dead-&gt;next;
            free(dead);
        }
    }
    free(g-&gt;adj);
    free(g);
}</code></pre>
<p>用课上的边表建图，打印每张表，再查两条边：</p>
<pre><code>int main(void) {
    int edges[][2] = {{0, 2}, {1, 2}, {1, 3}, {2, 3}};   /* A-C B-C B-D C-D */
    graph_t *g = graph_new(5);                          /* A..E = 0..4 */
    for (int i = 0; i &lt; 4; i++) {
        add_edge(g, edges[i][0], edges[i][1]);
    }
    for (int u = 0; u &lt; g-&gt;nv; u++) {
        printf("%c:", 'A' + u);
        for (node_t *p = g-&gt;adj[u]; p != NULL; p = p-&gt;next) {
            printf(" %c", 'A' + p-&gt;v);
        }
        printf("\\n");
    }
    printf("B-D? %d  A-B? %d\\n", has_edge(g, 1, 3), has_edge(g, 0, 1));
    graph_free(g);
    return 0;
}</code></pre>
<p>输出：</p>
<pre><code class="lang-text">A: C
B: D C
C: D B A
D: C B
E:
B-D? 1  A-B? 0</code></pre>
<p>表头插入让后加入的邻居排在前面，所以顺序与上图的字母序相反，表示的仍是同一张图。</p>
<p>矩阵版只要一个二维数组，加边改两个对称格：</p>
<pre><code>#define MAXV 100
int adj[MAXV][MAXV];              /* 全局数组，初值全是 0 */
void add_edge_m(int u, int v) {
    adj[u][v] = 1;
    adj[v][u] = 1;
}
/* 查边读 adj[u][v]：O(1)。列出 u 的邻居要扫整行：O(V) */
for (int w = 0; w &lt; nv; w++) {
    if (adj[u][w]) { /* w 是 u 的邻居 */ }
}</code></pre>

<h2>对比与选择</h2>
<table>
<thead><tr><th>操作</th><th>邻接矩阵</th><th>邻接表</th></tr></thead>
<tbody>
<tr><td>空间</td><td>O(V²)</td><td>O(V + E)</td></tr>
<tr><td>查边 u–v</td><td>O(1)</td><td>O(deg(u))，最坏 O(V)</td></tr>
<tr><td>列出 u 的邻居</td><td>O(V)</td><td>O(deg(u))</td></tr>
<tr><td>加边</td><td>O(1)</td><td>O(1)（表头插入，不查重）</td></tr>
<tr><td>删边 u–v</td><td>O(1)</td><td>O(deg(u) + deg(v))，要先找到结点</td></tr>
<tr><td>DFS / BFS 全图</td><td>O(V²)</td><td>O(V + E)</td></tr>
</tbody>
</table>
<p>选哪种取决于 E 与 V² 的关系。简单无向图最多 V(V − 1)/2 条边（完全图），所以总有 E = O(V²)：</p>
<ul>
  <li><strong>稀疏图（sparse graph，E 与 V 同阶）</strong>，如路网：V = 10⁴、E = 3 × 10⁴ 时，矩阵要 10⁸ 格，邻接表约 10⁴ + 6 × 10⁴ = 7 × 10⁴ 个单元。<strong>用邻接表</strong>。</li>
  <li><strong>稠密图（dense graph，E 与 V² 同阶）</strong>：2E 接近 V²，邻接表省不下空间，每个结点还多一个指针，查边又慢。<strong>用邻接矩阵</strong>。</li>
</ul>

<h2>表示决定遍历的复杂度</h2>
<p>DFS 和 BFS 对每个顶点恰好展开一次，展开时列出它的全部邻居，总代价就是所有顶点“列邻居”之和：</p>
<ul>
  <li>邻接表：∑(1 + deg(v)) = V + 2E，即 <strong>O(V + E)</strong>。例子：5 个表头 + 8 个结点，共 13 次访问。</li>
  <li>邻接矩阵：每个顶点扫 V 格，共 V × V，即 <strong>O(V²)</strong>。例子：25 格，与边数无关。</li>
</ul>
<p>稀疏图上 V² 远大于 V + E；稠密图上两者同阶。Dijkstra 也一样：二叉堆 + 邻接表是 O((V + E) log V)；邻接矩阵 + 每轮线性扫描找最小 dist 是 O(V²)，在稠密图上反而更快（见 7.5）。</p>
<div class="callout key" data-label="考点"><p>图算法的复杂度要连同表示一起回答：“DFS/BFS 是 O(V + E)”指邻接表；题目给的是邻接矩阵时答 O(V²)。</p></div>

<h2>考试怎么考</h2>
<ul>
  <li><strong>互相转换</strong>：图 ↔ 矩阵 ↔ 邻接表，逐行或逐表处理；画出的布局不同，只要顶点和边相同就是同一张图。</li>
  <li><strong>代价表要背</strong>，公式表上没有。<strong>计数</strong>：无向图矩阵中 1 的个数 = 邻接表结点数 = 2E，有向图都是 E；完全图 E = V(V − 1)/2。</li>
  <li><strong>用 E 表示复杂度</strong>（2015 年对 Floyd–Warshall 这样问过）：稠密图 E ≈ V²，即 V ≈ √E；稀疏图 E ≈ V（练习 3）。</li>
  <li><strong>写 C</strong>：结构体、加边、查边、矩阵转邻接表（练习 4）。</li>
</ul>
<div class="callout warn" data-label="易错"><p>① 无向图加边只改了一格，或只插了一张表。② 以为矩阵列邻居是 O(1)：要扫整行，O(V)。③ 以为邻接表查边是 O(1)：要沿链表走。④ 邻接表空间写成 O(E)：漏了 V 个表头，孤立点多时 V 可能远大于 E。⑤ 带权矩阵用 0 表示“没有边”。</p></div>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">1. 有向图的邻接矩阵（行 = 起点，列 = 终点，顺序 A B C D）：A 行 0110，B 行 0010，C 行 1001，D 行 0100。(a) 矩阵对称吗？(b) 写出邻接表（表内按字母序）。(c) 求每个顶点的出度和入度。(d) 要找出所有指向 C 的顶点，两种表示各要多少代价？</summary>
  <div class="qa__body">
<p>(a) <strong>不对称</strong>：adj[A][B] = 1 而 adj[B][A] = 0。A→C 和 C→A 恰好都在，这一对格子对称，但整个矩阵不是。</p>
<p>(b) A: B → C；B: C；C: A → D；D: B。共 6 个结点，等于边数（有向边只存一次）。</p>
<p>(c) 出度 = 行和：A 2，B 1，C 2，D 1。入度 = 列和：A 1（C→A），B 2（A→B、D→B），C 2（A→C、B→C），D 1（C→D）。两组之和都是 6，等于边数。</p>
<p>(d) 矩阵：扫 C 那一列 4 格，得 A、B，O(V)。邻接表：指向 C 的边不在 C 自己的表里，只能走遍所有表找 C，4 个表头 + 6 个结点，O(V + E)。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">2. 无向图的邻接表：A: B → E；B: A → C → D；C: B → D；D: B → C → E；E: A → D。(a) 写出邻接矩阵。(b) 图有几条边？(c) 判断 B 与 E 是否相邻，两种表示各要访问几次？</summary>
  <div class="qa__body">
<p>(a) 每个结点填一个 1：</p>
<table>
<thead><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr></thead>
<tbody>
<tr><th>A</th><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td></tr>
<tr><th>B</th><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td></tr>
<tr><th>C</th><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td></tr>
<tr><th>D</th><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><th>E</th><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
</tbody>
</table>
<p>矩阵对称，可用来自检。</p>
<p>(b) 结点共 2 + 3 + 2 + 3 + 2 = 12 个，每条无向边存两次，所以有 <strong>6 条边</strong>：A–B、A–E、B–C、B–D、C–D、D–E。矩阵中的 1 也是 12 个。</p>
<p>(c) 矩阵：读 adj[B][E] 一格，是 0，不相邻。邻接表：沿 B 的表依次比较 A、C、D，都不是 E，走到 NULL 才能下结论，共 3 次比较。查 E 的表（A、D）只要 2 次：从度数小的一端查更快。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">3. 某无向路网 V = 10⁴，有 5 × 10⁴ 条边，机器上 int 占 4 字节、指针占 8 字节。(a) int 型邻接矩阵和上面的 node_t 邻接表各占多少内存？(b) DFS 各要检查多少次“是否邻居”？(c) 把邻接矩阵上 DFS 的 O(V²) 分别写成稀疏图（E ≈ V）和稠密图（E ≈ V²）下关于 E 的式子。</summary>
  <div class="qa__body">
<p>(a) 矩阵：V² = 10⁸ 格 × 4 字节 = 4 × 10⁸ 字节，约 400 MB。邻接表：表头 10⁴ × 8 = 8 × 10⁴ 字节；结点 2E = 10⁵ 个，sizeof(node_t) = 16（int 4 字节 + 4 字节对齐填充 + 指针 8 字节），共 1.6 × 10⁶ 字节；合计约 1.7 MB，不到矩阵的 1/200。</p>
<p>(b) 矩阵：每个顶点扫一整行，10⁴ × 10⁴ = 10⁸ 次。邻接表：V + 2E = 10⁴ + 10⁵ = 1.1 × 10⁵ 次。</p>
<p>(c) 稀疏图 E ≈ V：O(V²) = <strong>O(E²)</strong>。稠密图 E ≈ V²，V ≈ √E：O(V²) = <strong>O(E)</strong>。邻接表的 O(V + E) 在两种情况下都是 O(E)，所以稠密图上两者同阶，稀疏图上矩阵慢了一个 E 的因子。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">4. 写函数 graph_t *matrix_to_lists(int nv, int m[][MAXV])：把 nv 个顶点的邻接矩阵 m 转成邻接表（可用上面的 graph_new 和 push），表内按编号从小到大，并给出时间复杂度。</summary>
  <div class="qa__body">
<pre><code>graph_t *matrix_to_lists(int nv, int m[][MAXV]) {
    graph_t *g = graph_new(nv);
    for (int u = 0; u &lt; nv; u++) {
        /* 表头插入会反转顺序，所以 v 从大到小扫 */
        for (int v = nv - 1; v &gt;= 0; v--) {
            if (m[u][v]) {
                push(g, u, v);    /* 只插 u 的表 */
            }
        }
    }
    return g;
}</code></pre>
<p>关键是<strong>只调 push，不调 add_edge</strong>：无向边在矩阵里已有 m[u][v] 和 m[v][u] 两格，各插一次正好存两次；若调 add_edge，每条边会存 4 次。同一段代码对有向图也正确，每个 1 只在起点的表里插一次。</p>
<p>每一格都必须看，时间 <strong>Θ(V²)</strong>，与边数无关。</p>
  </div>
</details>
`;

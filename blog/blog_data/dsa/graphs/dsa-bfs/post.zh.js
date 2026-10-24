/* Post body — dsa-bfs / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-bfs:zh'] = `
<p class="lead">广度优先搜索（Breadth-First Search, BFS）从起点出发一圈一圈往外走：先访问全部邻居，再访问邻居的邻居。它靠一个队列和一个标记数组实现，在无权图里还能顺手求出最短路径。</p>

<h2>从一个场景说起</h2>
<p>课上的比喻：你有个好消息要传开。第一轮，你告诉自己的每个朋友；第二轮，朋友们再告诉他们的朋友；就这样一圈一圈往外扩。第一轮听到的是离你 1 步的人，第二轮是离你 2 步的人。</p>
<p>传的时候要管好两件事：</p>
<ul>
<li><strong>谁先听到，谁先往下传。</strong>听到的人排成一队，轮流去通知别人。</li>
<li><strong>听过的人不用再说。</strong>手里有一份“已通知名单”，开口前先查一下。</li>
</ul>
<p>把人换成顶点，把“认识”换成边，这就是 BFS。</p>

<h2>它是什么</h2>
<p>简单说，BFS 就是从起点出发，先访问离它 1 条边的所有顶点，再访问离它 2 条边的，一层一层往外扩。DFS（见 7.3）正相反，一条路走到底再回头。</p>
<p>BFS 由两样东西组成，对应场景里的两件事：</p>
<ul>
<li><strong>队列（queue）</strong>：已发现、还没处理的顶点在这里排队。队列先进先出（FIFO），像食堂打饭，先来的先打，所以访问顺序自然按层推进。</li>
<li><strong>标记数组 mark[]</strong>：就是“已通知名单”。开始全是 0；顶点一进队列就标成 1，以后不会再入队。</li>
</ul>
<p>算法反复做一件事：从队头取出一个顶点 u（出队，dequeue）访问它，再逐个检查它的邻居 w，没标记的就<strong>标记并放到队尾</strong>（入队，enqueue）。队列空了就结束。课上的伪代码：</p>
<pre><code class="lang-text">BFS(G):
    mark each vertex in V with 0
    for each vertex v in V:
        if v is marked with 0:
            mark v with 1
            enqueue(Q, v)
            while Q is not empty:
                u = dequeue(Q)
                visit(u)
                for each vertex w adjacent to u:
                    if w is marked with 0:
                        mark w with 1
                        enqueue(Q, w)</code></pre>
<p>最外层的 for 循环是给不连通的图准备的：从一个起点只能走完它所在的连通分量（connected component），剩下没标记的顶点由外层循环换个起点再跑。这和 DFS 一样。</p>

<h2>看个例子</h2>
<p>课上的图：无向、无权，6 个顶点。按“离 A 几条边”分成三层：</p>
<figure class="fig">
<svg viewBox="0 0 400 250" width="400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="课上的 6 顶点无向图，按到 A 的边数分三层">
<line x1="50" y1="135" x2="200" y2="55" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="50" y1="135" x2="200" y2="135" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="50" y1="135" x2="200" y2="215" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="200" y1="55" x2="200" y2="135" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="200" y1="55" x2="350" y2="95" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="200" y1="135" x2="350" y2="95" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="200" y1="215" x2="350" y2="215" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<text x="50" y="20" text-anchor="middle" font-size="13" font-weight="700" fill="#d97757">第 0 层</text>
<text x="200" y="20" text-anchor="middle" font-size="13" font-weight="700" fill="#38bdf8">第 1 层</text>
<text x="350" y="20" text-anchor="middle" font-size="13" font-weight="700" fill="#4ade80">第 2 层</text>
<circle cx="50" cy="135" r="18" fill="#343433" stroke="#d97757" stroke-width="2"/>
<text x="50" y="135" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">A</text>
<circle cx="200" cy="55" r="18" fill="#343433" stroke="#38bdf8" stroke-width="2"/>
<text x="200" y="55" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">B</text>
<circle cx="200" cy="135" r="18" fill="#343433" stroke="#38bdf8" stroke-width="2"/>
<text x="200" y="135" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">C</text>
<circle cx="200" cy="215" r="18" fill="#343433" stroke="#38bdf8" stroke-width="2"/>
<text x="200" y="215" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">D</text>
<circle cx="350" cy="95" r="18" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<text x="350" y="95" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">E</text>
<circle cx="350" cy="215" r="18" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<text x="350" y="215" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">F</text>
</svg>
<figcaption>边：A–B，A–C，A–D，B–C，B–E，C–E，D–F</figcaption>
</figure>
<p>邻接表里邻居按字母序排好，追踪时就照这个顺序检查：</p>
<pre><code class="lang-text">A: B C D
B: A C E
C: A B E
D: A F
E: B C
F: D</code></pre>
<p>开始：标记 A 并入队，队列是 [A]。之后每步出队一个顶点，“✓”表示这个邻居已经标记过，跳过：</p>
<table>
<thead><tr><th>步</th><th>出队（访问）</th><th>检查邻居</th><th>标记并入队</th><th>之后的队列</th></tr></thead>
<tbody>
<tr><td>0</td><td>—</td><td>—</td><td>A（起点）</td><td>[A]</td></tr>
<tr><td>1</td><td>A</td><td>B，C，D</td><td>B，C，D</td><td>[B, C, D]</td></tr>
<tr><td>2</td><td>B</td><td>A ✓，<strong>C ✓</strong>，E</td><td>E</td><td>[C, D, E]</td></tr>
<tr><td>3</td><td>C</td><td>A ✓，B ✓，E ✓</td><td>—</td><td>[D, E]</td></tr>
<tr><td>4</td><td>D</td><td>A ✓，F</td><td>F</td><td>[E, F]</td></tr>
<tr><td>5</td><td>E</td><td>B ✓，C ✓</td><td>—</td><td>[F]</td></tr>
<tr><td>6</td><td>F</td><td>D ✓</td><td>—</td><td>[ ]</td></tr>
</tbody>
</table>
<p>第 1 步，A 的邻居 B、C、D 都是新的，全部标记、入队，这就是第 1 层。第 2 步最关键：B 出队时，C 还在队列里没轮到，但它入队时已经标记，所以跳过，只有 E 是新的。之后只有 D 带来新的 F，其余顶点出队时邻居都已标记。</p>
<p>出队顺序就是 <strong>BFS 顺序：A, B, C, D, E, F</strong>。队列先进先出，它和入队顺序完全一样，也和上面的分层对得上。</p>

<div class="callout key" data-label="考点">
<p><strong>顶点在入队时就标记，而不是出队时才标记。</strong>要是出队时才标记，第 2 步时 mark[C] 还是 0，C 会第二次入队、被访问两次（见例题 2）。</p>
</div>

<iframe class="anim-frame" src="blog/blog_data/dsa-bfs/anims/bfs.html" loading="lazy" style="height: 540px;" title="BFS 逐步演示"></iframe>
<p class="anim-caption">按“下一步”逐个检查邻居，下方是队列和 mark 数组，最后一帧按层着色；切到“出队才标记（错误）”，看同一个顶点怎样重复入队。</p>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/HZ5YTanv5QE" title="Breadth-first search in 4 minutes" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Michael Sambol《Breadth-first search in 4 minutes》（英文，约 4 分钟），讲 BFS 怎样借助队列一层层访问图。视频里标记的时机、邻居的顺序可能和本课不同，考试按本课：入队即标记。</p>

<h2>补充：用 C 写出来</h2>
<p>写代码题里，BFS 的核心是下面这个函数：从 s 出发，走完 s 所在的连通分量。图用 7.2 的邻接表，<code>v</code> 是邻居编号（0 = A，1 = B，…），<code>next</code> 指向下一个邻居。</p>
<pre><code>void bfs_explore(node_t *adj[], int n, int s, int mark[], int dist[]) {
    int *queue = malloc(n * sizeof(int));
    int head = 0, tail = 0;           /* head 处出队，tail 处入队 */

    mark[s] = 1;                      /* 入队即标记 */
    dist[s] = 0;
    queue[tail++] = s;
    while (head &lt; tail) {             /* 队列非空 */
        int u = queue[head++];        /* 出队，访问 u */
        printf("%c ", 'A' + u);
        for (node_t *p = adj[u]; p != NULL; p = p-&gt;next) {
            int w = p-&gt;v;
            if (mark[w] == 0) {       /* 没进过队列 */
                mark[w] = 1;
                dist[w] = dist[u] + 1;
                queue[tail++] = w;
            }
        }
    }
    free(queue);
}</code></pre>
<ul>
<li><code>queue</code> 是普通数组：<code>head</code> 指向队头，<code>tail</code> 指向下一个空位。每个顶点最多入队一次，所以<strong>开 n 格就够，不需要循环队列</strong>。</li>
<li>起点也是先标记、再入队，dist 记 0。</li>
<li><code>head &lt; tail</code> 说明队列非空；<code>queue[head++]</code> 取出队头，就是出队。</li>
<li>for 循环沿 u 的链表看每个邻居 w：没标记就标记，记 <code>dist[w] = dist[u] + 1</code>（比 u 多一条边），再放到队尾。</li>
</ul>
<p>外层循环照搬伪代码：mark 用 calloc 清零，对每个 <code>mark[v] == 0</code> 的 v 调一次 <code>bfs_explore</code>，调用次数就是连通分量的个数。在课上的图上输出 <code>A B C D E F</code>，dist 依次是 0, 1, 1, 1, 2, 2。有向图照用，只沿出边走。</p>

<h2>补充：复杂度</h2>
<ul>
<li>每个顶点入队、出队各一次：O(V)。</li>
<li>每个顶点出队时要找出全部邻居。<strong>邻接表</strong>：所有链表合起来只有 2E 个结点（有向图是 E），合计 <strong>O(V + E)</strong>。<strong>邻接矩阵</strong>：每个顶点扫一整行 V 格，合计 <strong>O(V²)</strong>。</li>
</ul>
<p>和 DFS 完全一样。额外空间是 mark、dist 和队列，各 O(V)。</p>

<h2>补充：无权图的最短路</h2>
<p>例子里的 dist 正好是层号。在<strong>无权图</strong>（有向、无向都行）里，BFS 求出的 dist[v] 就是起点到 v 的<strong>最少边数</strong>。原因是近的顶点总比远的先出队，一个顶点第一次被发现时，走的就是最短的那条；入队即标记保证这个值不会再被改写。</p>
<p>只求单个起点的最短路时不跑外层循环：mark 清零、dist 全设为 −1，只调一次 <code>bfs_explore</code>，最后仍是 −1 的就是不可达（距离 ∞）。要路径本身，入队时再记 from[w] = u，最后沿 from[] 倒推（和 7.5 的 Dijkstra 一样）。</p>

<h3>带权图上会出错</h3>
<p>BFS 只数边数，不看权重。课上的反例：</p>
<figure class="fig">
<svg viewBox="0 0 360 220" width="360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="带权四边形：BFS 路径与真正最短路">
<line x1="40" y1="110" x2="180" y2="185" stroke="#f87171" stroke-width="3"/>
<line x1="40" y1="110" x2="180" y2="35" stroke="#4ade80" stroke-width="3"/>
<line x1="180" y1="35" x2="320" y2="110" stroke="#4ade80" stroke-width="3"/>
<line x1="320" y1="110" x2="180" y2="185" stroke="#4ade80" stroke-width="3"/>
<text x="98" y="164" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#f87171">10</text>
<text x="98" y="58" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">3</text>
<text x="262" y="58" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">2</text>
<text x="262" y="164" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">2</text>
<circle cx="40" cy="110" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="40" y="110" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">A</text>
<circle cx="180" cy="35" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="180" y="35" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">B</text>
<circle cx="320" cy="110" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="320" y="110" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">D</text>
<circle cx="180" cy="185" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="180" y="185" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">C</text>
</svg>
<figcaption>红：BFS 给出的 A → C，代价 10；绿：真正的最短路 A → B → D → C，代价 7</figcaption>
</figure>
<p>C 是 A 的邻居，BFS 在第 1 层就发现它，给出 A → C，代价 <strong>10</strong>；而 A → B → D → C 虽然多走两条边，代价只有 3 + 2 + 2 = <strong>7</strong>。所以 <strong>BFS 只在无权图（或所有边权相等）时求得最短路</strong>。边权不同（且非负）时用 Dijkstra（见 7.5），它把 FIFO 队列换成按距离取最小的优先队列。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>手算顺序</strong>：给图和起点写 BFS 顺序，常要写每步之后的队列。题目说平局按字母序（break ties alphabetically）就照做；没说时，同一顶点的邻居以任意顺序入队都算对，课上明确说过。</li>
<li><strong>简答</strong>：为什么入队时标记？答“防止同一顶点多次入队、被访问多次”，并举出具体顶点。</li>
<li><strong>读 / 写代码</strong>：找出“出队才标记”的错（例题 2）；写数组队列 + mark + 外层循环，需要时加 dist[]。</li>
<li><strong>复杂度</strong>：邻接表 O(V + E)、邻接矩阵 O(V²)，公式表上没有，要自己记。</li>
<li><strong>判断题</strong>：2016 年考过“BFS 和 Dijkstra 在带权 DAG 上总能找到最短路”，<strong>错</strong>：BFS 不看权重（Dijkstra 的问题在负权，见 7.5）。同卷的“一次深度优先遍历就能访问无向图的所有顶点”也<strong>错</strong>：图可能不连通，所以才要外层循环，BFS 同理。</li>
</ul>

<h3>例题 1：从 E 出发</h3>
<p>题目：在课上的图上从 E 出发做 BFS，平局按字母序。写出每步出队的顶点、之后的队列、BFS 顺序和每个顶点的 dist。</p>
<table>
<thead><tr><th>步</th><th>出队</th><th>标记并入队（dist）</th><th>之后的队列</th></tr></thead>
<tbody>
<tr><td>0</td><td>—</td><td>E（0）</td><td>[E]</td></tr>
<tr><td>1</td><td>E</td><td>B（1），C（1）</td><td>[B, C]</td></tr>
<tr><td>2</td><td>B</td><td>A（2）；C、E 已标记</td><td>[C, A]</td></tr>
<tr><td>3</td><td>C</td><td>—；A、B、E 已标记</td><td>[A]</td></tr>
<tr><td>4</td><td>A</td><td>D（3）；B、C 已标记</td><td>[D]</td></tr>
<tr><td>5</td><td>D</td><td>F（4）；A 已标记</td><td>[F]</td></tr>
<tr><td>6</td><td>F</td><td>—；D 已标记</td><td>[ ]</td></tr>
</tbody>
</table>
<p>B 先出队，所以 A 由 B 发现，dist[A] = dist[B] + 1 = 2；轮到 C 时 A 已标记，跳过。答案：BFS 顺序 <strong>E, B, C, A, D, F</strong>；dist：A 2，B 1，C 1，D 3，E 0，F 4。</p>
<p>没要求字母序时，C 也可以先于 B 入队，得到 E, C, B, A, D, F（A 改由 C 发现），同样正确。</p>

<h3>例题 2：出队才标记</h3>
<p>题目：下面的循环把标记挪到了出队时（起点入队前也不标记）。邻接表按字母序，在课上的图上从 A 运行，输出什么？queue 只开 V = 6 格会怎样？</p>
<pre><code>    queue[tail++] = s;
    while (head &lt; tail) {
        int u = queue[head++];
        mark[u] = 1;                  /* 出队时才标记 */
        printf("%c ", 'A' + u);
        for (node_t *p = adj[u]; p != NULL; p = p-&gt;next) {
            if (mark[p-&gt;v] == 0) {
                queue[tail++] = p-&gt;v;
            }
        }
    }</code></pre>
<p>B 出队时，C 还在队列里，但 mark[C] 仍是 0，于是 C 再入队一次；E 也会被 B 和 C 重复加入。追下去：</p>
<table>
<thead><tr><th>出队</th><th>入队</th><th>之后的队列</th></tr></thead>
<tbody>
<tr><td>A</td><td>B，C，D</td><td>[B, C, D]</td></tr>
<tr><td>B</td><td><strong>C</strong>，E</td><td>[C, D, C, E]</td></tr>
<tr><td>C</td><td><strong>E</strong></td><td>[D, C, E, E]</td></tr>
<tr><td>D</td><td>F</td><td>[C, E, E, F]</td></tr>
<tr><td>C（第 2 次）</td><td><strong>E</strong></td><td>[E, E, F, E]</td></tr>
<tr><td>E</td><td>—</td><td>[E, F, E]</td></tr>
<tr><td>E（第 2 次）</td><td>—</td><td>[F, E]</td></tr>
<tr><td>F</td><td>—</td><td>[E]</td></tr>
<tr><td>E（第 3 次）</td><td>—</td><td>[ ]</td></tr>
</tbody>
</table>
<p>输出 <code>A B C D C E E F E</code>：C 被访问 2 次，E 被访问 3 次。队列一共写入 <strong>9</strong> 个元素（起点 1 个，循环里 8 个），6 格的数组从 <code>queue[6]</code> 起越界，是未定义行为。</p>
<p>改法：起点入队前先 <code>mark[s] = 1</code>，循环里入队前先 <code>mark[p-&gt;v] = 1</code>，删掉出队时那行标记，就是上面的 <code>bfs_explore</code>。</p>

<div class="callout warn" data-label="易错">
<p>同一层里的顺序不一定是字母序，而是由<strong>上一层顶点出队的先后</strong>决定：图 A–B、A–C、B–E、C–D 从 A 出发，顺序是 A, B, C, E, D（E 由先出队的 B 发现）。另外，求单源最短路只跑一次 BFS，不可达顶点的距离是 ∞，不是 0。</p>
</div>

<h2>小结</h2>
<ul>
<li>BFS 一层一层往外访问：FIFO 队列存“已发现、未处理”的顶点，mark[] 记“进过队列”。</li>
<li><strong>入队即标记</strong>，否则同一顶点会多次入队、被访问多次。</li>
<li>外层循环对每个未标记的顶点再跑一次，才能走完不连通的图；每跑一次就是一个连通分量。</li>
<li>时间：邻接表 O(V + E)，邻接矩阵 O(V²)，和 DFS 相同。</li>
<li>无权图里 dist[] 就是最少边数；带权图上 BFS 会出错（四边形反例：10 对 7），要用 Dijkstra。</li>
</ul>
`;

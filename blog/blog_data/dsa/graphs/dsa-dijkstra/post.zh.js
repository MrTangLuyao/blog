/* Post body — dsa-dijkstra / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-dijkstra:zh'] = `
<p class="lead">Dijkstra 算法（Dijkstra's algorithm）求带权图上从一个起点到所有顶点的最短路，前提是<strong>所有边权 ≥ 0</strong>。</p>

<h2>从一个场景说起</h2>
<p>你住在 A 村，想知道走到附近每个村子最少要几分钟。村子之间有小路，每条路标着要走多少分钟。</p>
<p>BFS（见 7.4）在这里不管用：它数的是“经过几条路”，可一条 10 分钟的路比两条 3 分钟的路还慢。要比的是<strong>分钟数之和</strong>。</p>
<p>换个想法：在 A 村倒一桶水，水沿着小路往外流，流过一条 3 分钟的路就要 3 分钟。<strong>离 A 越近的村子，越早被水淹到</strong>；水第一次流进某个村子时走的那条路，就是到它的最短路。</p>

<h2>它是什么</h2>
<p>简单说，Dijkstra 就是在模拟这桶水：<strong>每次从还没确定的顶点里挑出离起点最近的那个，把它定下来，再看经过它能不能更快到达邻居。</strong></p>
<p>它解决的问题叫<strong>单源最短路（single-source shortest paths）</strong>：一个起点 s，求 s 到每个顶点的最短距离。在带权图（weighted graph）里，<strong>路径长度 = 路径上所有边权之和</strong>；到不了的顶点，距离记为 ∞。</p>
<p>算法由四样东西组成：</p>
<ul>
<li><code>dist[v]</code>：目前知道的起点到 v 的最短距离，叫<strong>暂定距离（tentative distance）</strong>，相当于“水目前最快几分钟能流到 v”。起点是 0，其余一开始都是 ∞。</li>
<li><code>from[v]</code>：这条路上 v 的<strong>前一个顶点（predecessor）</strong>，也就是水从哪个村流过来。最后靠它还原路径。</li>
<li><strong>优先队列（priority queue, PQ）</strong>：放“已经够得着、但还没确定”的顶点，<strong>dist 越小越先出</strong>。课上把元素写成“顶点 + 距离”，如 D7 表示 dist[D] = 7。</li>
<li><strong>松弛（relaxation）</strong>：取出顶点 u 后，对它每个还没确定的邻居 v，试试“先到 u，再走一条边到 v”这条新路：</li>
</ul>
<pre><code class="lang-text">if dist[u] + w(u, v) &lt; dist[v]:
    dist[v] = dist[u] + w(u, v)
    from[v] = u        // v 不在 PQ 就插入，在就更新它的值</code></pre>
<p><strong>只有严格更小才更新</strong>，相等时 from 不变。一个顶点从 PQ 取出时就<strong>被确定（finalised）</strong>，以后再也不改。</p>

<h2>看个例子</h2>
<p>课上的图：无向带权图，6 个顶点，起点 A。</p>
<figure class="fig">
<svg viewBox="0 0 480 240" width="480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="课上的 6 顶点带权无向图">
<line x1="36" y1="120" x2="116" y2="40" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="36" y1="120" x2="196" y2="200" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="116" y1="40" x2="366" y2="40" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="116" y1="40" x2="196" y2="200" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="196" y1="200" x2="286" y2="200" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="286" y1="200" x2="366" y2="40" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="286" y1="200" x2="446" y2="120" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="366" y1="40" x2="446" y2="120" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<text x="68.2" y="72.2" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">2</text>
<text x="111.1" y="169.8" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">3</text>
<text x="241" y="29" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">5</text>
<text x="165.8" y="115.1" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">4</text>
<text x="241" y="211" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">1</text>
<text x="316.2" y="115.1" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">2</text>
<text x="370.9" y="169.8" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">4</text>
<text x="413.8" y="72.2" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">6</text>
<circle cx="36" cy="120" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="36" y="120" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">A</text>
<circle cx="116" cy="40" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="116" y="40" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">C</text>
<circle cx="196" cy="200" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="196" y="200" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">F</text>
<circle cx="286" cy="200" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="286" y="200" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">B</text>
<circle cx="366" cy="40" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="366" y="40" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">D</text>
<circle cx="446" cy="120" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="446" y="120" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">E</text>
</svg>
<figcaption>边：A–C 2，A–F 3，C–D 5，C–F 4，F–B 1，B–D 2，B–E 4，D–E 6</figcaption>
</figure>
<p>开始时 dist[A] = 0，其余是 ∞，PQ = {A0}。</p>
<p><strong>第 0 轮：取出 A0。</strong>A 的邻居是 C 和 F。到 C 是 0 + 2 = 2，比 ∞ 小，记下 dist[C] = 2、from[C] = A；到 F 是 0 + 3 = 3，同理。PQ = {C2, F3}。</p>
<p><strong>第 1 轮：取出 C2，C 确定。</strong>2 一定最短：绕别的路就得先走 A–F，已经花了 3，后面的边又都 ≥ 0。接着松弛 C 的边：D 是 2 + 5 = 7，记为 7/C，D7 入 PQ；F 是 2 + 4 = 6，不比 3 小，<strong>不更新</strong>。PQ = {F3, D7}。</p>
<p><strong>第 2 轮：取出 F3。</strong>B 是 3 + 1 = 4，记为 4/F。PQ = {B4, D7}。</p>
<p><strong>第 3 轮：取出 B4。</strong>D 是 4 + 2 = 6，比 7 小，<strong>改成 6/B</strong>，PQ 里的 D7 换成 D6；E 是 4 + 4 = 8，记为 8/B。PQ = {D6, E8}。</p>
<p><strong>第 4 轮：取出 D6。</strong>E 是 6 + 6 = 12，不比 8 小，不更新。PQ = {E8}。</p>
<p><strong>第 5 轮：取出 E8。</strong>邻居都已确定，PQ 空了，结束。</p>
<p>每轮之后两个数组的样子（格子写 dist/from，<strong>加粗</strong> = 已确定）：</p>
<table>
<thead><tr><th>轮后</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th></tr></thead>
<tbody>
<tr><td>初始</td><td>0/–</td><td>∞</td><td>∞</td><td>∞</td><td>∞</td><td>∞</td></tr>
<tr><td>0（A）</td><td><strong>0/–</strong></td><td>∞</td><td>2/A</td><td>∞</td><td>∞</td><td>3/A</td></tr>
<tr><td>1（C）</td><td><strong>0/–</strong></td><td>∞</td><td><strong>2/A</strong></td><td>7/C</td><td>∞</td><td>3/A</td></tr>
<tr><td>2（F）</td><td><strong>0/–</strong></td><td>4/F</td><td><strong>2/A</strong></td><td>7/C</td><td>∞</td><td><strong>3/A</strong></td></tr>
<tr><td>3（B）</td><td><strong>0/–</strong></td><td><strong>4/F</strong></td><td><strong>2/A</strong></td><td>6/B</td><td>8/B</td><td><strong>3/A</strong></td></tr>
<tr><td>4（D）</td><td><strong>0/–</strong></td><td><strong>4/F</strong></td><td><strong>2/A</strong></td><td><strong>6/B</strong></td><td>8/B</td><td><strong>3/A</strong></td></tr>
<tr><td>5（E）</td><td><strong>0/–</strong></td><td><strong>4/F</strong></td><td><strong>2/A</strong></td><td><strong>6/B</strong></td><td><strong>8/B</strong></td><td><strong>3/A</strong></td></tr>
</tbody>
</table>
<ul>
<li>确定顺序是 A 0、C 2、F 3、B 4、D 6、E 8，<strong>顶点按最短距离从小到大依次确定</strong>，正是水流到的先后。</li>
<li>D 第 1 轮就有了 7，第 3 轮才改成 6。<strong>被够到不等于被确定，只有从 PQ 取出时才确定</strong>。</li>
</ul>

<iframe class="anim-frame" src="blog/blog_data/dsa-dijkstra/anims/dijkstra.html" loading="lazy" style="height: 520px;" title="Dijkstra 逐步演示"></iframe>
<p class="anim-caption">按“下一步”逐帧看松弛和 PQ 的变化，颜色含义见图例；最后一帧的绿色边就是下面说的最短路径树。切到“负权反例”看算法怎样出错。</p>

<h3>用 from[] 还原路径</h3>
<p>要知道 A 到 E 怎么走，就从 E 沿 from[] 往回走：from[E] = B，from[B] = F，from[F] = A。倒过来就是 <strong>A → F → B → E</strong>，长度 3 + 1 + 4 = 8，和 dist[E] 一致。</p>
<p>所有 (from[v], v) 边合起来是一棵以起点为根的树，叫<strong>最短路径树（shortest-path tree）</strong>。</p>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/_lHSawdgXpI" title="Dijkstra's algorithm in 3 minutes" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Michael Sambol《Dijkstra's algorithm in 3 minutes》（英文，约 2 分 45 秒），在一张小图上一步步运行 Dijkstra，可以当作手算追踪的复习。</p>

<h2>为什么边权不能是负数</h2>
<p>Dijkstra 敢在取出时就把顶点定死，靠的是<strong>路只会越走越长</strong>。设 u 是 PQ 里 dist 最小的。任何别的到 u 的路，总要在某处第一次走到一个还没确定的顶点 x；x 的前一个顶点已确定，早就用这条边松弛过 x，所以走到 x 这一段至少是 dist[x]，而 dist[x] ≥ dist[u]，后面的边又都 ≥ 0，所以这条路不可能比 dist[u] 短。</p>
<p>每步取眼前最好的、从不反悔，所以 Dijkstra 是<strong>贪心算法（greedy algorithm）</strong>。</p>
<p>有了负权边就不一样了：眼下更长的路，走上负权边反而可能更短。反例（有向图，起点 A）：</p>
<figure class="fig">
<svg viewBox="0 0 460 240" width="460" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="含一条负权边的有向图">
<defs><marker id="dsa-dij-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.6)"/></marker></defs>
<line x1="57.1" y1="114.3" x2="261" y2="46.3" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-dij-arrow)"/>
<line x1="55.6" y1="128.9" x2="162.6" y2="190.1" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-dij-arrow)"/>
<line x1="189.5" y1="184.7" x2="269.4" y2="57" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-dij-arrow)"/>
<line x1="298" y1="40" x2="400" y2="40" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-dij-arrow)"/>
<text x="156.5" y="69.6" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">2</text>
<text x="104.5" y="169.6" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">3</text>
<text x="239.3" y="125.8" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#f87171">−2</text>
<text x="350" y="29" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">2</text>
<circle cx="40" cy="120" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="40" y="120" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">A</text>
<circle cx="280" cy="40" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="280" y="40" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">B</text>
<circle cx="180" cy="200" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="180" y="200" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">C</text>
<circle cx="420" cy="40" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="420" y="40" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">D</text>
</svg>
<figcaption>A→B 2，A→C 3，C→B −2，B→D 2</figcaption>
</figure>
<p>过程：取出 A0，得到 B2、C3；取出 B2，<strong>B 被确定</strong>，D 得到 2 + 2 = 4；取出 C3，这时才发现 A→C→B = 3 + (−2) = 1 比 2 短，可 B 已经确定，不再更新；最后取出 D4。</p>
<p>结果是 dist[B] = 2、dist[D] = 4，正确答案是 1 和 3（A→C→B→D）。所以<strong>有负权边就不能用 Dijkstra</strong>，要用 Bellman-Ford（细节不考）。</p>
<p>反例要画成<strong>有向图</strong>：无向图里负权边可以来回走，最短路就没有定义了。</p>

<h2>C 代码</h2>
<p>考试手写最省事的是<strong>邻接矩阵 + 数组</strong>版：不建 PQ，每轮扫一遍 dist[]，找未确定顶点里最小的。约定：顶点 A–F 编号 0–5；<code>w[u][v]</code> 是边权，没有边时是 <code>NOEDGE</code>（−1）；<code>INF</code> 定义为 <code>INT_MAX</code>，表示 ∞。</p>
<pre><code>void dijkstra(int n, int w[MAXV][MAXV], int s, int dist[], int from[]) {
    int done[MAXV] = {0};                     /* 1 = 已确定 */
    for (int v = 0; v &lt; n; v++) {
        dist[v] = INF;
        from[v] = -1;
    }
    dist[s] = 0;
    for (int k = 0; k &lt; n; k++) {
        int u = -1;                           /* deleteMin */
        for (int v = 0; v &lt; n; v++) {
            if (!done[v] &amp;&amp; dist[v] != INF &amp;&amp; (u == -1 || dist[v] &lt; dist[u])) u = v;
        }
        if (u == -1) break;                   /* 剩下的都到不了 */
        done[u] = 1;
        for (int v = 0; v &lt; n; v++) {         /* 松弛 u 的边 */
            if (w[u][v] != NOEDGE &amp;&amp; !done[v] &amp;&amp; dist[u] + w[u][v] &lt; dist[v]) {
                dist[v] = dist[u] + w[u][v];
                from[v] = u;
            }
        }
    }
}</code></pre>
<ul>
<li><strong>第 2–7 行</strong>：初始化。done[] 记谁已确定；dist 全设成 ∞，起点设成 0；from 设成 −1，表示“没有前一个顶点”。</li>
<li><strong>第 9–12 行</strong>：这就是 deleteMin：在未确定、并且够得着（dist 不是 INF）的顶点里找 dist 最小的 u。比较用 &lt;，平局时留下下标小的，正好是字母序。</li>
<li><strong>第 13–14 行</strong>：找不到 u 说明剩下的都到不了，提前结束；否则 u 确定。</li>
<li><strong>第 15–20 行</strong>：松弛。有边、v 还没确定、新路严格更短，三个条件都满足才更新。只有 dist 有限的顶点才会被选为 u，所以这里的加法不会溢出。</li>
</ul>

<h2>复杂度：看 PQ 怎么实现</h2>
<p>不管 PQ 怎么实现，操作次数都一样：<strong>V 次 deleteMin</strong>（每个顶点出队一次），<strong>最多 E 次插入/更新</strong>（每条边最多带来一次成功的松弛），再各乘上单次代价。</p>
<table>
<thead><tr><th>PQ 实现</th><th>deleteMin</th><th>插入/更新</th><th>Dijkstra 总时间</th></tr></thead>
<tbody>
<tr><td>未排序数组（上面的 C 代码）</td><td>O(V)</td><td>O(1)</td><td>V·O(V) + E·O(1) = <strong>O(V²)</strong></td></tr>
<tr><td>二叉堆 min-heap</td><td>O(log V)</td><td>O(log V)</td><td>(V + E)·O(log V) = <strong>O((V + E) log V)</strong></td></tr>
<tr><td>有序链表</td><td>O(1)（取表头）</td><td>O(V)（找到旧结点、摘下、按序重插）</td><td>V·O(1) + E·O(V) = <strong>O(VE)</strong></td></tr>
</tbody>
</table>
<ul>
<li><strong>本课默认的 Dijkstra 复杂度是 O((V + E) log V)</strong>（二叉堆 + 邻接表）。</li>
<li>堆不总是更快：稠密图 E ≈ V² 时，堆版是 O(V² log V)，数组版 O(V²) 反而更好；稀疏图 E ≈ V 时，堆版 O(V log V) 好得多。</li>
<li>有序数组同样是 O(VE)。</li>
</ul>

<h2>和 BFS、Prim 的区别</h2>
<table>
<thead><tr><th>算法</th><th>容器</th><th>每次取出</th><th>比较的值</th></tr></thead>
<tbody>
<tr><td>BFS</td><td>FIFO 队列</td><td>最早入队的</td><td>不看权重</td></tr>
<tr><td>Dijkstra</td><td>优先队列</td><td>值最小的</td><td>从起点出发的<strong>整条路径长度</strong> dist[u] + w(u, v)</td></tr>
<tr><td>Prim（见 7.7）</td><td>优先队列</td><td>值最小的</td><td>连到当前树的<strong>单条边</strong>的权重 w(u, v)</td></tr>
</tbody>
</table>
<p>边权全相同时用 BFS 就够了，O(V + E)。有向图也能用 Dijkstra，松弛时只看出边。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>手算追踪</strong>：给图和起点（常注明平局按字母序），写出确定顺序、每轮的 dist/from 或 PQ，再用 from[] 写出到某点的路径。</li>
<li><strong>复杂度</strong>（2015 年考过）：分别用二叉堆、有序链表作 PQ 时的 Big-O。<strong>公式表上没有</strong>，要会用“V 次 deleteMin + 最多 E 次更新”推出来。</li>
<li><strong>举反例</strong>（2016 年考过）：画一个让 Dijkstra 出错的图并解释。用上面 A、B、C 三点的有向图，说明“B 先被确定，之后经负权边的更短路没法再更新”。</li>
<li><strong>判断题</strong>：负权边、零权边、BFS 能不能求带权最短路，见例题 2。</li>
</ul>

<h3>例题 1：换个起点手算</h3>
<p>在课上那张图上以 D 为起点运行 Dijkstra，平局按字母序。写出确定顺序、最终 dist 和 from，以及 D 到 A 的最短路径。</p>
<table>
<thead><tr><th>轮</th><th>取出</th><th>松弛</th><th>之后的 PQ</th></tr></thead>
<tbody>
<tr><td>0</td><td>D 0</td><td>B：0 + 2 = 2 → 2/D；C：0 + 5 = 5 → 5/D；E：0 + 6 = 6 → 6/D</td><td>{B2, C5, E6}</td></tr>
<tr><td>1</td><td>B 2</td><td>E：2 + 4 = 6，不比 6 小，不变；F：2 + 1 = 3 → 3/B</td><td>{F3, C5, E6}</td></tr>
<tr><td>2</td><td>F 3</td><td>A：3 + 3 = 6 → 6/F；C：3 + 4 = 7，不比 5 小，不变</td><td>{C5, A6, E6}</td></tr>
<tr><td>3</td><td>C 5</td><td>A：5 + 2 = 7，不比 6 小，不变</td><td>{A6, E6}</td></tr>
<tr><td>4</td><td>A 6</td><td>邻居都已确定</td><td>{E6}</td></tr>
<tr><td>5</td><td>E 6</td><td>邻居都已确定</td><td>{}</td></tr>
</tbody>
</table>
<p>确定顺序 D、B、F、C、A、E。最终 dist：A 6，B 2，C 5，D 0，E 6，F 3；from：A←F，B←D，C←D，E←D，F←B。</p>
<p>两处易错：第 1 轮经 B 到 E 也是 6，<strong>相等不更新，from[E] 仍是 D</strong>。第 4 轮 A6 和 E6 平局，按字母序先取 A。</p>
<p>路径：from[A] = F，from[F] = B，from[B] = D，倒过来是 <strong>D → B → F → A</strong>，长度 2 + 1 + 3 = 6。</p>

<h3>例题 2：判断对错</h3>
<p>(a) BFS 和 Dijkstra 在带权 DAG 上总能找到最短路径。(b) 有负权边时，给每条边加同一个常数使权重都 ≥ 0，再跑 Dijkstra，就能得到原图的最短路。(c) 图里有权重为 0 的边时，Dijkstra 仍然正确。</p>
<p>(a) <strong>错</strong>。BFS 只数边数：A→C 10、A→B 3、B→C 3，BFS 给出 10，最短其实是 6。Dijkstra 遇到负权边也会错，上面的反例就是 DAG，<strong>出错和有没有环无关</strong>。</p>
<p>(b) <strong>错</strong>。把上面的反例每条边加 2：A→B 4，A→C 5，C→B 0。新图里直走 A→B 更短（4 &lt; 5），可原图里 A→C→B（长 1）才最短。k 条边的路会被多加 k 次，<strong>边多的路被罚得更重</strong>，长短关系就变了。</p>
<p>(c) <strong>对</strong>。“路只会越走越长”只要求每条边 ≥ 0，0 满足。</p>

<div class="callout warn" data-label="易错">
<p>① dist 是<strong>从起点出发的整条路径长度</strong>，不是单条边权；把 dist[u] + w 写成 w 就成了 Prim。② 相等不更新，from 保持原值。③ 已经在 PQ 里的顶点也可能被更新（D7 → D6），追踪时别漏。</p>
</div>

<h2>小结</h2>
<ul>
<li>Dijkstra 求单源最短路，前提是<strong>边权 ≥ 0</strong>；有负权边会出错，要用 Bellman-Ford。</li>
<li>就是把 BFS 的队列换成按 dist 取最小的 PQ。<strong>取出即确定</strong>，顶点按最短距离从小到大依次确定。</li>
<li>松弛：dist[u] + w(u, v) &lt; dist[v] 才更新 dist 和 from，相等不更新。</li>
<li>还原路径：沿 from[] 倒着走，再反过来，如 A → F → B → E，长 8。</li>
<li>复杂度：二叉堆 O((V + E) log V)（课上默认），数组 O(V²)，有序链表 O(VE)。</li>
</ul>
`;

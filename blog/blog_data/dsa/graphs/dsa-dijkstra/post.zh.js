/* Post body — dsa-dijkstra / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-dijkstra:zh'] = `
<p class="lead">Dijkstra 算法（Dijkstra's algorithm）求<strong>边权非负</strong>的图上的<strong>单源最短路</strong>：把 BFS 的 FIFO 队列换成“按暂定距离取最小”的优先队列，再用 dist[] 和 from[] 两个数组记下最短距离和路径。</p>

<h2>问题：带权图上的最短路</h2>
<p><strong>单源最短路（single-source shortest paths）</strong>：给定图 G 和起点 s，求 s 到每个顶点 v 的最短路径。在带权图（weighted graph）里，<strong>一条路径的长度 = 路径上所有边权之和</strong>，不是边的条数；到不了的顶点，距离记为 ∞。</p>
<p>无权图用 BFS 就够了（见 7.4 广度优先搜索），它找的是边数最少的路；边一旦有权重，边数最少不等于最便宜。</p>
<p>本课程约定<strong>所有边权 ≥ 0</strong>（0 也可以），这是 Dijkstra 的前提。<strong>有负权边就不能用 Dijkstra，要用 Bellman-Ford</strong>（细节不考）。</p>

<h2>课上的例子：第一步</h2>
<p>无向带权图，6 个顶点，起点 A：</p>
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
<p>算法维护两个数组和一个优先队列：</p>
<ul>
  <li><code>dist[v]</code>：目前找到的从 A 到 v 的最短距离，叫<strong>暂定距离（tentative distance）</strong>。起点为 0，其余开始时为 ∞。</li>
  <li><code>from[v]</code>：这条路径上 v 的<strong>前一个顶点</strong>（predecessor），最后用来还原路径。</li>
  <li><strong>优先队列（priority queue, PQ）</strong>：存“已经能到达、但还没确定”的顶点，<strong>优先级就是 dist，越小越先出</strong>。课上把 PQ 元素写成“顶点 + 距离”，如 D7 表示 dist[D] = 7。</li>
</ul>
<p>开始时 PQ 只有 A0。取出 A，它的邻居是 C 和 F：经 A 到 C 的长度 0 + 2 = 2，比 ∞ 小，于是 dist[C] = 2、from[C] = A，C2 入 PQ；同理 F3 入 PQ。PQ = {C2, F3}。</p>
<p>接着取出最小的 C2。2 一定是 A 到 C 的最短距离：别的走法都得先走 A–F（已花 3），之后边权都 ≥ 0，总长至少 3 &gt; 2。所以 C <strong>被确定（finalised）</strong>，以后不再改。</p>

<h3>松弛（relaxation）</h3>
<p>C 确定之后，把 C 当作“垫脚石”（stepping stone），看经过它能否更便宜地到达邻居：D 经 C 是 2 + 5 = 7 &lt; ∞，更新 dist[D] = 7、from[D] = C，D7 入 PQ（7 只是目前最好）；F 经 C 是 2 + 4 = 6，不比 3 小，<strong>不更新</strong>；A 已确定，跳过。</p>
<p>这一步叫<strong>松弛 u 的边</strong>。对刚取出的 u 和每条边 (u, v)，v 尚未确定：</p>
<pre><code class="lang-text">dist[v] = min( dist[v], dist[u] + w(u, v) )
若变小了：from[v] = u，并更新 v 在 PQ 里的值（不在 PQ 就插入）</code></pre>
<p>dist[u] + w(u, v) 就是“先沿最短路到 u，再走边 u–v”这条新路的长度。<strong>只有严格更小才更新</strong>，相等时 from 保持不变。</p>

<h2>完整追踪</h2>
<table>
<thead><tr><th>轮</th><th>取出（确定）</th><th>松弛</th><th>之后的 PQ</th></tr></thead>
<tbody>
<tr><td>0</td><td>A 0</td><td>C：0 + 2 = 2 &lt; ∞ → 2/A；F：0 + 3 = 3 &lt; ∞ → 3/A</td><td>{C2, F3}</td></tr>
<tr><td>1</td><td>C 2</td><td>A 已确定；D：2 + 5 = 7 &lt; ∞ → 7/C；F：2 + 4 = 6 ≥ 3，不变</td><td>{F3, D7}</td></tr>
<tr><td>2</td><td>F 3</td><td>A、C 已确定；B：3 + 1 = 4 &lt; ∞ → 4/F</td><td>{B4, D7}</td></tr>
<tr><td>3</td><td>B 4</td><td>F 已确定；D：4 + 2 = 6 &lt; 7 → 6/B；E：4 + 4 = 8 &lt; ∞ → 8/B</td><td>{D6, E8}</td></tr>
<tr><td>4</td><td>D 6</td><td>B、C 已确定；E：6 + 6 = 12 ≥ 8，不变</td><td>{E8}</td></tr>
<tr><td>5</td><td>E 8</td><td>B、D 已确定</td><td>{}</td></tr>
</tbody>
</table>
<p>每轮结束后两个数组的状态（格子写 dist/from，<strong>加粗</strong> = 已确定）：</p>
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
<p>确定顺序 A 0、C 2、F 3、B 4、D 6、E 8：<strong>顶点按最短距离从小到大依次确定</strong>。D 第 1 轮就有了 7，第 3 轮经 B 降为 6（from[D] 改成 B，PQ 里 D7 换成 D6）：<strong>被够到不等于被确定，只有从 PQ 取出时才确定</strong>。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-dijkstra/anims/dijkstra.html" loading="lazy" style="height: 520px;" title="Dijkstra 逐步演示"></iframe>
<p class="anim-caption">按“下一步”逐帧看松弛和 PQ 的变化，颜色含义见图例；切到“负权反例”看算法怎样出错。</p>

<h2>用 from[] 还原路径</h2>
<p>要路径，就从终点沿 from[] 往回走到起点，再倒过来。以 E 为例：from[E] = B，from[B] = F，from[F] = A（起点）。倒过来是 <strong>A → F → B → E</strong>，长度 3 + 1 + 4 = 8，与 dist[E] 一致。</p>
<p>每个可达的非起点顶点恰好有一个 from，所以所有 (from[v], v) 边合起来是一棵以起点为根的树，叫<strong>最短路径树（shortest-path tree）</strong>：</p>
<figure class="fig">
<svg viewBox="0 0 480 250" width="480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="从 A 出发的最短路径树">
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
<text x="36" y="153" text-anchor="middle" font-size="13" font-weight="700" fill="#d97757">0</text>
<circle cx="116" cy="40" r="18" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<text x="116" y="40" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">C</text>
<text x="116" y="73" text-anchor="middle" font-size="13" font-weight="700" fill="#d97757">2</text>
<circle cx="196" cy="200" r="18" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<text x="196" y="200" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">F</text>
<text x="196" y="233" text-anchor="middle" font-size="13" font-weight="700" fill="#d97757">3</text>
<circle cx="286" cy="200" r="18" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<text x="286" y="200" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">B</text>
<text x="286" y="233" text-anchor="middle" font-size="13" font-weight="700" fill="#d97757">4</text>
<circle cx="366" cy="40" r="18" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<text x="366" y="40" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">D</text>
<text x="366" y="73" text-anchor="middle" font-size="13" font-weight="700" fill="#d97757">6</text>
<circle cx="446" cy="120" r="18" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<text x="446" y="120" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">E</text>
<text x="446" y="153" text-anchor="middle" font-size="13" font-weight="700" fill="#d97757">8</text>
</svg>
<figcaption>绿色实线 = 最短路径树；橙色数字 = 最终 dist；虚线边不在任何一条从 A 出发的最短路上</figcaption>
</figure>

<h2>为什么取出的最小值就是最终答案</h2>
<p>设某一轮 PQ 里 dist 最小的是 u。任取另一条从 s 到 u 的路径 P。P 从已确定的顶点出发，总有第一次走到“未确定顶点”的时候，设那个顶点是 x：</p>
<ol>
  <li>P 走到 x 的前半段，长度 ≥ dist[x]：x 的前一个顶点已确定（它的 dist 已是最短），确定时已经用这条边松弛过 x。</li>
  <li>dist[x] ≥ dist[u]：u 是 PQ 里最小的。</li>
  <li>从 x 继续走到 u 的后半段，长度 ≥ 0：<strong>因为所有边权 ≥ 0</strong>。</li>
</ol>
<p>合起来，P 的长度 ≥ dist[u]，dist[u] 可以定下来。每步只做眼前最好的选择、不反悔，所以 Dijkstra 是<strong>贪心算法（greedy algorithm）</strong>。</p>

<h2>负权边为什么会出错</h2>
<p>上面第 3 条“后半段 ≥ 0”一旦不成立，论证就垮了：眼下更长的路走上负权边后可能反而更短。反例（有向图，起点 A）：</p>
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
<table>
<thead><tr><th>轮</th><th>取出（确定）</th><th>松弛</th><th>之后的 PQ</th></tr></thead>
<tbody>
<tr><td>0</td><td>A 0</td><td>B：0 + 2 = 2 → 2/A；C：0 + 3 = 3 → 3/A</td><td>{B2, C3}</td></tr>
<tr><td>1</td><td>B 2</td><td>D：2 + 2 = 4 → 4/B</td><td>{C3, D4}</td></tr>
<tr><td>2</td><td>C 3</td><td>B 已确定，跳过（其实 3 + (−2) = 1 &lt; 2）</td><td>{D4}</td></tr>
<tr><td>3</td><td>D 4</td><td>—</td><td>{}</td></tr>
</tbody>
</table>
<p>B 在第 1 轮以 2 被确定；第 2 轮才出现更短的 A→C→B = 3 + (−2) = 1，可 B 已确定，不再更新。错误还会往后传：D 的 4 用的是 B 的旧值，真正最短是 A→C→B→D = 3。<strong>Dijkstra 给出 dist[B] = 2、dist[D] = 4，正确答案是 1 和 3</strong>。只看 A、B、C 三点就已是完整反例。</p>
<ul>
  <li>反例最好画成<strong>有向图</strong>：无向图里负权边可以来回走，相当于负环，最短路没有定义；画无向图就要说明比较的是<strong>简单路径（simple path）</strong>。</li>
  <li>出错与有没有环无关：这张图是 DAG，照样出错。</li>
</ul>

<h2>伪代码与 C 实现</h2>
<p>课上的版本（第一次够到时插入 PQ，变短时更新）：</p>
<pre><code class="lang-text">Dijkstra(G, s):
    for each vertex v: dist[v] = ∞, from[v] = none
    dist[s] = 0
    insert(PQ, s, 0)
    while PQ is not empty:
        u = deleteMin(PQ)                    // dist[u] 从此确定
        for each edge (u, v) where v is not finalised:
            if dist[u] + w(u, v) &lt; dist[v]:
                dist[v] = dist[u] + w(u, v)
                from[v] = u
                if v is in PQ: update(PQ, v, dist[v])    // 例如 D7 → D6
                else:          insert(PQ, v, dist[v])</code></pre>
<p>考试手写 C 最省事的是<strong>邻接矩阵 + 数组</strong>版：每轮扫一遍 dist[]，在未确定的顶点里找最小的，相当于用“未排序数组”当 PQ。dist 相同时先遇到下标小的，正好是字母序。</p>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;limits.h&gt;

#define MAXV   26
#define INF    INT_MAX          /* dist 为 ∞ */
#define NOEDGE (-1)             /* 邻接矩阵里表示“没有边” */

/* w[u][v] 是边 u-v 的权重（≥ 0），没有边为 NOEDGE。
   结束后：dist[v] = 起点 s 到 v 的最短距离（不可达为 INF），
           from[v] = 最短路上 v 的前一个顶点（起点和不可达点为 -1） */
void dijkstra(int n, int w[MAXV][MAXV], int s, int dist[], int from[]) {
    int done[MAXV];                       /* 1 = 已确定 */
    for (int v = 0; v &lt; n; v++) {
        dist[v] = INF;
        from[v] = -1;
        done[v] = 0;
    }
    dist[s] = 0;

    for (int k = 0; k &lt; n; k++) {
        /* deleteMin：在未确定的顶点里找 dist 最小的，O(V) */
        int u = -1;
        for (int v = 0; v &lt; n; v++) {
            if (!done[v] &amp;&amp; dist[v] != INF &amp;&amp; (u == -1 || dist[v] &lt; dist[u])) {
                u = v;
            }
        }
        if (u == -1) {
            break;                        /* 剩下的顶点都不可达 */
        }
        done[u] = 1;                      /* dist[u] 从此不再改变 */

        /* 松弛：只看未确定的邻居，严格更小才更新 */
        for (int v = 0; v &lt; n; v++) {
            if (w[u][v] != NOEDGE &amp;&amp; !done[v] &amp;&amp; dist[u] + w[u][v] &lt; dist[v]) {
                dist[v] = dist[u] + w[u][v];
                from[v] = u;
            }
        }
    }
}

/* 先递归打印到前一个顶点的路径，再打印自己：A -&gt; F -&gt; B -&gt; E */
void print_path(const int from[], int v) {
    if (from[v] == -1) {                  /* 回到起点 */
        printf("%c", 'A' + v);
        return;
    }
    print_path(from, from[v]);
    printf(" -&gt; %c", 'A' + v);
}</code></pre>
<p>只有 dist 有限的顶点才会被选为 u，所以只要路径长度小于 INT_MAX，<code>dist[u] + w[u][v]</code> 就不会溢出。用课上的图（A–F 编号 0–5，无向图填对称的两个格子）运行，结果与“完整追踪”一致，<code>print_path(from, 4)</code> 输出 <code>A -&gt; F -&gt; B -&gt; E</code>。不可达顶点的 from 也是 −1，打印路径前要先判断 <code>dist[v] != INF</code>。</p>

<h2>复杂度：取决于 PQ 怎么实现</h2>
<p>不论 PQ 怎么实现，操作次数都一样：</p>
<ul>
  <li><strong>V 次 deleteMin</strong>：每个顶点出 PQ 一次；</li>
  <li><strong>最多 E 次插入/更新</strong>：每次成功松弛一次，每条边最多带来一次；</li>
  <li>找邻居：邻接表总共 O(V + E)，邻接矩阵每个顶点扫一整行，总共 O(V²)。</li>
</ul>
<table>
<thead><tr><th>PQ 实现</th><th>deleteMin</th><th>插入/更新</th><th>Dijkstra 总时间</th></tr></thead>
<tbody>
<tr><td>未排序数组（上面的 C 代码）</td><td>O(V)</td><td>O(1)</td><td>V·O(V) + E·O(1) = <strong>O(V²)</strong></td></tr>
<tr><td>二叉堆 min-heap</td><td>O(log V)</td><td>O(log V)</td><td>(V + E)·O(log V) = <strong>O((V + E) log V)</strong></td></tr>
<tr><td>有序链表</td><td>O(1)（取表头）</td><td>O(V)（找到旧结点、摘下、按序重插）</td><td>V·O(1) + E·O(V) = <strong>O(VE)</strong></td></tr>
</tbody>
</table>
<p>同理，<strong>有序数组</strong>与有序链表一样是 O(VE)；<strong>未排序链表</strong>只要每个顶点存一个指向自己结点的指针（更新 O(1)），就和未排序数组一样是 O(V²)。</p>
<ul>
  <li><strong>本课程默认的 Dijkstra 复杂度是 O((V + E) log V)</strong>（二叉堆 + 邻接表）。</li>
  <li>堆不总是赢：稠密图 E ≈ V² 时，堆版是 O(V² log V)，数组版 O(V²) 反而更快；稀疏图 E ≈ V 时，堆版 O(V log V) 远好于 O(V²)。</li>
  <li>有序链表最差：连通图有 E ≥ V − 1，所以 O(VE) 不会比 O(V²) 好。</li>
</ul>

<h2>和 BFS、Prim 的关系</h2>
<table>
<thead><tr><th>算法</th><th>容器</th><th>每次取出</th><th>比较的值</th></tr></thead>
<tbody>
<tr><td>BFS</td><td>FIFO 队列</td><td>最早入队的</td><td>不看权重</td></tr>
<tr><td>Dijkstra</td><td>优先队列</td><td>值最小的</td><td>从起点出发的<strong>整条路径长度</strong> dist[u] + w(u, v)</td></tr>
<tr><td>Prim（见 7.7）</td><td>优先队列</td><td>值最小的</td><td>连到当前树的<strong>单条边</strong>的权重 w(u, v)</td></tr>
</tbody>
</table>
<p>所有边权相同时，最短距离就是“边数 × 权重”，用 BFS 即可，只要 O(V + E)。Dijkstra 也适用于有向图，松弛时只看出边。</p>

<h2>考试怎么考</h2>
<ul>
  <li><strong>追踪题</strong>：给图和起点（常注明平局按字母序），写出确定顺序、每轮的 dist/from 或 PQ 内容，再用 from[] 写出到某点的路径。</li>
  <li><strong>复杂度题</strong>（2015 年考过）：分别用堆、有序链表作 PQ 时 Dijkstra 的 Big-O。答案 O((V + E) log V) 和 O(VE)，理由都是“V 次 deleteMin + 最多 E 次更新”乘以各自单次代价。<strong>这些不在公式表上</strong>，要会推。</li>
  <li><strong>反例题</strong>（2016 年考过）：画一个让 Dijkstra 给出错误距离的图并解释。上面的 A、B、C 三点有向图加一句“B 先被确定，之后经负权边出现的更短路无法再更新”即可。</li>
  <li><strong>判断题</strong>：Dijkstra 能处理负权边（错，要用 Bellman-Ford）；BFS 能求带权图最短路（错）；顶点出 PQ 后 dist 不再变（对，前提是边权非负）。</li>
  <li><strong>设计题</strong>：在 Dijkstra 上做小改动解决新问题，例如换掉“路径代价”的计算方式（见练习 4）。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>① dist 是<strong>从起点出发的整条路径长度</strong>，不是单条边权；把 dist[u] + w 写成 w 就成了 Prim。② 相等不更新，from 保持原值。③ “给每条边加同一个常数把负权变成非负”不能救 Dijkstra（见练习 2）。④ 追踪时别忘了已在 PQ 里的顶点也可能被更新（D7 → D6）。</p>
</div>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">1. 在课上那张图上以 D 为起点运行 Dijkstra，平局按字母序。写出确定顺序、最终 dist 与 from，以及 D 到 A 的最短路径。</summary>
  <div class="qa__body">
<table>
<thead><tr><th>轮</th><th>取出</th><th>松弛</th><th>之后的 PQ</th></tr></thead>
<tbody>
<tr><td>0</td><td>D 0</td><td>B：0 + 2 = 2 → 2/D；C：0 + 5 = 5 → 5/D；E：0 + 6 = 6 → 6/D</td><td>{B2, C5, E6}</td></tr>
<tr><td>1</td><td>B 2</td><td>D 已确定；E：2 + 4 = 6 ≥ 6，不变；F：2 + 1 = 3 → 3/B</td><td>{F3, C5, E6}</td></tr>
<tr><td>2</td><td>F 3</td><td>B 已确定；A：3 + 3 = 6 → 6/F；C：3 + 4 = 7 ≥ 5，不变</td><td>{C5, A6, E6}</td></tr>
<tr><td>3</td><td>C 5</td><td>D、F 已确定；A：5 + 2 = 7 ≥ 6，不变</td><td>{A6, E6}</td></tr>
<tr><td>4</td><td>A 6</td><td>C、F 已确定</td><td>{E6}</td></tr>
<tr><td>5</td><td>E 6</td><td>B、D 已确定</td><td>{}</td></tr>
</tbody>
</table>
<p>确定顺序 D, B, F, C, A, E。最终 dist：A 6，B 2，C 5，D 0，E 6，F 3；from：A←F，B←D，C←D，E←D，F←B（D 是起点）。</p>
<p>两处要小心：第 1 轮经 B 到 E 也是 6，<strong>不严格更小，from[E] 仍是 D</strong>；第 4 轮 A6 和 E6 平局，按字母序先取 A。</p>
<p>路径：from[A] = F，from[F] = B，from[B] = D，倒过来是 <strong>D → B → F → A</strong>，长度 2 + 1 + 3 = 6。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">2. 有人提议：图里有负权边时，给每条边都加上同一个常数 c，使所有权重 ≥ 0，再运行 Dijkstra，得到的就是原图的最短路径。用“负权边”一节的有向图检验这个说法。</summary>
  <div class="qa__body">
<p>最小的负权是 −2，取 c = 2：A→B 4，A→C 5，C→B 0，B→D 4。</p>
<p>新图中 A 到 B：直连 4，A→C→B 是 5 + 0 = 5，所以 Dijkstra 选直连 A→B。但在原图里 A→B 长 2，A→C→B 长 1，真正的最短路是 A→C→B。<strong>说法错误</strong>。</p>
<p>原因：k 条边的路径总长增加 k·c，边数多的路径被罚得更多，长短关系随之改变。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">3. 判断对错并说明：(a) BFS 和 Dijkstra 在带权 DAG 上总能找到最短路径；(b) 边权非负时，顶点一旦出 PQ，它的 dist 不会再改变；(c) 图中有权重为 0 的边时 Dijkstra 仍然正确。</summary>
  <div class="qa__body">
<p>(a) <strong>错</strong>。BFS 只数边数：DAG 中 A→C 10、A→B 3、B→C 3，BFS 给出 A 到 C 为 10，最短是 6。Dijkstra 遇到负权边也会错，“负权边”一节的反例本身就是 DAG。</p>
<p>(b) <strong>对</strong>。这正是贪心论证的结论。</p>
<p>(c) <strong>对</strong>。论证只要求后半段长度 ≥ 0，权重为 0 满足条件。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">4. 在带权有向图中，定义一条路径的“胖度”（fatness）为路径上最大的那条边的权重。给出算法，求从 u 到 v 所有路径中最小的胖度，并给出复杂度。</summary>
  <div class="qa__body">
<p>用 Dijkstra，只改“路径代价”的算法：fat[x] 表示目前找到的到 x 的最小胖度。初始 fat[u] = −∞（还没有边），其余为 ∞。每次取出 fat 最小的顶点 x 并确定，松弛它的出边 (x, y)：</p>
<pre><code class="lang-text">cand = max( fat[x], w(x, y) )      // 原来是 dist[x] + w(x, y)
if cand &lt; fat[y]: fat[y] = cand, from[y] = x</code></pre>
<p>v 出 PQ 时 fat[v] 就是答案，沿 from[] 可以还原路径。</p>
<p>为什么正确：路径往后延长时胖度只会不变或变大（max(f, w) ≥ f），这代替了原论证中“后半段 ≥ 0”那一条，所以取出的最小值仍是最终值；因此这个版本连负权边都不怕。复杂度与 Dijkstra 相同，二叉堆实现为 <strong>O((V + E) log V)</strong>。</p>
  </div>
</details>
`;

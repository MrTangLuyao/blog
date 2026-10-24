/* Post body — dsa-floyd-warshall / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-floyd-warshall:zh'] = `
<p class="lead">Warshall 算法回答“图里谁能到谁”，Floyd-Warshall 算法回答“任意两点之间最短多远”。两者是同一个三重循环：让每个顶点轮流当<strong>垫脚石</strong>（stepping stone），垫脚石 k 放在<strong>最外层</strong>，时间 <strong>Θ(V³)</strong>。</p>

<h2>从一个场景说起</h2>
<p>你在旅行社上班，手上有一张直飞航班表：哪两座城市之间有直飞，票价多少。老板要一张完整的表：任意两座城市之间<strong>能不能飞到</strong>（可以转机），<strong>最便宜多少钱</strong>。</p>
<p>一对对去搜路线太累。换个办法：先只算直飞。再宣布“可以在 A 转机了”，把整张表过一遍，看哪些城市对经 A 一转就能到了，或者更便宜了。再开放 B，又过一遍……每座城市都开放后，表就是最终答案。</p>
<p>转机城市就是课上说的垫脚石。只问能不能到，是 Warshall 算法；问最便宜多少，是 Floyd-Warshall 算法。做法一样。</p>

<h2>它是什么</h2>
<h3>Warshall：谁能到谁</h3>
<p><strong>可达性（reachability）</strong>问的是能不能沿着边从 i 走到 j。把答案填进一张 V × V 的 0/1 表 R：<strong>R[i][j] = 1 当且仅当存在一条从 i 到 j 的路径</strong>。这张表叫<strong>传递闭包（transitive closure）</strong>，它保留邻接矩阵（adjacency matrix）里所有的 1，再补上要走好几条边才能到的格子。</p>
<p>垫脚石的规则就一句：<strong>i 能到 k，k 能到 j，那么 i 能到 j</strong>。Warshall 算法分三部分，对回场景：</p>
<ul>
<li><strong>起点</strong>：R 从邻接矩阵开始，即“只许直飞”。</li>
<li><strong>最外层循环 k</strong>：每个顶点轮流当垫脚石，即“又开放一座转机城市”。</li>
<li><strong>里面两层 i、j</strong>：扫整张表，能经 k 连起来的格子置 1。</li>
</ul>
<pre><code class="lang-text">Warshall(R):                     // R 开始是邻接矩阵
    for k = 0 to n-1              // 垫脚石，最外层
        for i = 0 to n-1          // 起点
            for j = 0 to n-1      // 终点
                if R[i][k] and R[k][j]:
                    R[i][j] = 1
    return R                      // 传递闭包</code></pre>

<h3>Floyd-Warshall：最短多远</h3>
<p><strong>全源最短路（all-pairs shortest paths, APSP）</strong>要求每对顶点之间的最短距离。起点换成<strong>距离矩阵（distance matrix）</strong> D：有边 i→j 填边权，<strong>对角线填 0，没有边填 ∞</strong>。循环不动，最里面那句从“置 1”换成“取最小”：</p>
<pre><code class="lang-text">D[i][j] = min(D[i][j], D[i][k] + D[k][j])</code></pre>
<p>意思是：经 k 绕一下比表上记的还短，就改过来。</p>
<p>为什么对？做完第 k 轮，D[i][j] 是“只许前 k 个顶点当垫脚石”时的最短距离，记作 D⁽ᵏ⁾。新开放 k 后，最短路要么不经过 k（值不变），要么在 k 处切成 i⇝k、k⇝j 两段，两段的最短长度表上已经有了。</p>
<p>一张表原地改就够：第 k 轮里第 k 行和第 k 列不会变，因为 D[i][k] 的候选值是 D[i][k] + D[k][k] = D[i][k] + 0（无负环时）。</p>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/4OQeCuLYj-4" title="Floyd–Warshall algorithm in 4 minutes" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Michael Sambol《Floyd–Warshall algorithm in 4 minutes》（英文，约 4.5 分钟），在一个小图上逐轮跑 Floyd-Warshall，手算方法和课上一样。</p>

<h2>看个例子</h2>
<h3>Warshall：课上的 5 顶点有向图</h3>
<p>A 没有入边，E 没有出边，B 和 D 互相指向。</p>
<figure class="fig">
<svg viewBox="0 0 360 210" width="360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="5 个顶点的有向图">
<defs><marker id="dsa-fw-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.6)"/></marker></defs>
<line x1="58" y1="40" x2="160" y2="40" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-fw-arrow)"/>
<line x1="48.5" y1="55.8" x2="100.5" y2="152.4" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-fw-arrow)"/>
<path d="M264.1,158.9 Q313.2,120.2 318.3,59.9" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-fw-arrow)"/>
<line x1="232" y1="170" x2="130" y2="170" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-fw-arrow)"/>
<line x1="198" y1="40" x2="300" y2="40" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-fw-arrow)"/>
<line x1="171.5" y1="55.8" x2="119.5" y2="152.4" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-fw-arrow)"/>
<path d="M305.9,51.1 Q256.8,89.8 251.7,150.1" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" marker-end="url(#dsa-fw-arrow)"/>
<circle cx="40" cy="40" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="40" y="40" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">A</text>
<circle cx="180" cy="40" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="180" y="40" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">C</text>
<circle cx="320" cy="40" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="320" y="40" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">D</text>
<circle cx="110" cy="170" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="110" y="170" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">E</text>
<circle cx="250" cy="170" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="250" y="170" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">B</text>
</svg>
<figcaption>边：A→C，A→E，B→D，B→E，C→D，C→E，D→B</figcaption>
</figure>
<p>手算一轮只看<strong>第 k 列的 1</strong>（谁能到 k）和<strong>第 k 行的 1</strong>（k 能到谁），交叉的格子全部置 1。读的是<strong>当前</strong>的表，前几轮新加的 1 也算。</p>
<table>
<thead><tr><th>轮 k</th><th>能到 k（第 k 列的 1）</th><th>k 能到（第 k 行的 1）</th><th>新增的 1</th></tr></thead>
<tbody>
<tr><td>A</td><td>无</td><td>C, E</td><td>无（没有顶点能到 A）</td></tr>
<tr><td>B</td><td>D</td><td>D, E</td><td>D→D，D→E</td></tr>
<tr><td>C</td><td>A</td><td>D, E</td><td>A→D（A→E 原本就是 1）</td></tr>
<tr><td>D</td><td>A, B, C, D</td><td>B, D, E</td><td>A→B，B→B，C→B（其余交叉格已是 1）</td></tr>
<tr><td>E</td><td>A, B, C, D</td><td>无</td><td>无（E 没有出边）</td></tr>
</tbody>
</table>
<p>第 D 轮最忙：能到 D 的 A 是第 C 轮加的，D 自己是第 B 轮加的，前面的轮次在给后面铺路。最后的传递闭包（加粗的 1 是邻接矩阵里没有的）：</p>
<table>
<thead><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr></thead>
<tbody>
<tr><th>A</th><td>0</td><td><strong>1</strong></td><td>1</td><td><strong>1</strong></td><td>1</td></tr>
<tr><th>B</th><td>0</td><td><strong>1</strong></td><td>0</td><td>1</td><td>1</td></tr>
<tr><th>C</th><td>0</td><td><strong>1</strong></td><td>0</td><td>1</td><td>1</td></tr>
<tr><th>D</th><td>0</td><td>1</td><td>0</td><td><strong>1</strong></td><td><strong>1</strong></td></tr>
<tr><th>E</th><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
</tbody>
</table>
<p>比如 R[A][B] = 1，因为 A→C→D→B。<strong>对角线不会自动是 1</strong>：R[i][i] = 1 表示 i 能绕环回到自己（B→D→B），A、C、E 不在环上，仍是 0。</p>

<h3>Floyd-Warshall：课上的 6 顶点图</h3>
<p>还是 7.5 Dijkstra 的那张无向图。无向边等于两条反向的有向边，表是对称的，更新每对只写一次。</p>
<figure class="fig">
<svg viewBox="0 0 450 240" width="450" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="6 个顶点的带权无向图">
<line x1="54.6" y1="109.4" x2="135.4" y2="50.6" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="54.6" y1="130.6" x2="135.4" y2="189.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="168" y1="40" x2="282" y2="40" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="150" y1="58" x2="150" y2="182" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="168" y1="200" x2="282" y2="200" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="300" y1="182" x2="300" y2="58" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="314.6" y1="189.4" x2="395.4" y2="130.6" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="314.6" y1="50.6" x2="395.4" y2="109.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<text x="86" y="72" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">2</text>
<text x="86" y="168" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">3</text>
<text x="225" y="28" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">5</text>
<text x="162" y="120" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">4</text>
<text x="225" y="212" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">1</text>
<text x="312" y="120" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">2</text>
<text x="364" y="168" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">4</text>
<text x="364" y="72" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="#fbbf24">6</text>
<circle cx="40" cy="120" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="40" y="120" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">A</text>
<circle cx="150" cy="40" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="150" y="40" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">C</text>
<circle cx="150" cy="200" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="150" y="200" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">F</text>
<circle cx="300" cy="40" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="300" y="40" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">D</text>
<circle cx="300" cy="200" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="300" y="200" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">B</text>
<circle cx="410" cy="120" r="18" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="410" y="120" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="#e8e8e8">E</text>
</svg>
<figcaption>边：A–C 2，A–F 3，C–D 5，C–F 4，F–B 1，B–D 2，B–E 4，D–E 6</figcaption>
</figure>
<table>
<thead><tr><th>D⁽⁰⁾</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th></tr></thead>
<tbody>
<tr><th>A</th><td>0</td><td>∞</td><td>2</td><td>∞</td><td>∞</td><td>3</td></tr>
<tr><th>B</th><td>∞</td><td>0</td><td>∞</td><td>2</td><td>4</td><td>1</td></tr>
<tr><th>C</th><td>2</td><td>∞</td><td>0</td><td>5</td><td>∞</td><td>4</td></tr>
<tr><th>D</th><td>∞</td><td>2</td><td>5</td><td>0</td><td>6</td><td>∞</td></tr>
<tr><th>E</th><td>∞</td><td>4</td><td>∞</td><td>6</td><td>0</td><td>∞</td></tr>
<tr><th>F</th><td>3</td><td>1</td><td>4</td><td>∞</td><td>∞</td><td>0</td></tr>
</tbody>
</table>
<p>手算和 Warshall 一样：第 k 轮只看第 k 行和第 k 列，对每个交叉格算 D[i][k] + D[k][j]，<strong>严格更小才改</strong>。</p>
<table>
<thead><tr><th>轮 k</th><th>更新（旧 → 新）</th><th>由来</th></tr></thead>
<tbody>
<tr><td>A</td><td>无</td><td>C→A→F = 2 + 3 = 5，不比 C–F 的 4 短</td></tr>
<tr><td>B</td><td>D–F：∞ → 3<br>E–F：∞ → 5</td><td>D→B→F = 2 + 1，E→B→F = 4 + 1；D→B→E = 6 等于原值，不改</td></tr>
<tr><td>C</td><td>A–D：∞ → 7</td><td>A→C→D = 2 + 5</td></tr>
<tr><td>D</td><td>A–B：∞ → 9<br>A–E：∞ → 13<br>B–C：∞ → 7<br>C–E：∞ → 11</td><td>如 A–B = D[A][D] + D[D][B] = 7 + 2</td></tr>
<tr><td>E</td><td>无</td><td>经过 E 的路都不更短</td></tr>
<tr><td>F</td><td>A–B：9 → 4<br>A–D：7 → 6<br>A–E：13 → 8<br>B–C：7 → 5<br>C–E：11 → 9</td><td>如 A→F→B = 3 + 1 = 4 &lt; 9</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>D⁽⁶⁾</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th></tr></thead>
<tbody>
<tr><th>A</th><td>0</td><td>4</td><td>2</td><td>6</td><td>8</td><td>3</td></tr>
<tr><th>B</th><td>4</td><td>0</td><td>5</td><td>2</td><td>4</td><td>1</td></tr>
<tr><th>C</th><td>2</td><td>5</td><td>0</td><td>5</td><td>9</td><td>4</td></tr>
<tr><th>D</th><td>6</td><td>2</td><td>5</td><td>0</td><td>6</td><td>3</td></tr>
<tr><th>E</th><td>8</td><td>4</td><td>9</td><td>6</td><td>0</td><td>5</td></tr>
<tr><th>F</th><td>3</td><td>1</td><td>4</td><td>3</td><td>5</td><td>0</td></tr>
</tbody>
</table>
<p>盯住 A–B：第 D 轮先变成 9（A→C→D→B），第 F 轮才降到 4（A→F→B）。<strong>中途的表只是“用前 k 个垫脚石”时的最优，不是最终答案</strong>。A 行最后是 0 4 2 6 8 3，和 7.5 里从 A 跑 Dijkstra 的结果一样。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-floyd-warshall/anims/floyd-warshall.html" loading="lazy" style="height: 520px;" title="Warshall 与 Floyd-Warshall 逐步演示"></iframe>
<p class="anim-caption">先选模式再按“下一步”：每轮先高亮第 k 行和第 k 列，再逐格显示被改的格子和它用到的两格，左侧图上标出对应路径（窄屏只显示矩阵）。</p>

<h2>为什么 k 必须在最外层</h2>
<p>回到场景：“开放 A 转机”必须对<strong>所有</strong>城市对做完，才能开放下一座。如果 i 在最外层（顺序 i、k、j），A 行会在别的行还没动时一口气算完，用到的都是旧值。反例：A→C 1，C→B 1，B→D 1。</p>
<ul>
<li>算 A 行、k = B 时，D[A][B] 还是 ∞：A 要经 C 才到 B，而 C 还没轮到。</li>
<li>k = C 时，D[A][B] 变成 2，可 D[C][D] 还是 ∞：C 行排在 A 行后面，还没算。</li>
</ul>
<p>A 行之后不会再算，D[A][D] 停在 ∞，正确答案是 3（A→C→B→D）。k 在最外层时，第 B 轮先得到 D[C][D] = 2，第 C 轮再得到 D[A][D] = 1 + 2 = 3。</p>

<h2>负权边与负环</h2>
<p>Floyd-Warshall <strong>允许负权边，但不允许负环（negative-weight cycle）</strong>，即总权重 &lt; 0 的环：每多绕一圈路就更短，最短路不存在。有环本身没问题，它<strong>不要求图是 DAG</strong>。</p>
<p>负环还能顺手查出来：跑完后某个 <strong>D[i][i] &lt; 0</strong>，就说明 i 能沿负环回到自己。比如 A→B 1，B→A −2，结束时 D[A][A] = −1。7.9 的货币套利就靠这一点。</p>

<h2>复杂度：和别的算法比</h2>
<p>三重循环不管图稀疏还是稠密都跑满 V³ 次：<strong>时间 Θ(V³)，空间 Θ(V²)</strong>。用边数 E 表示：稠密图 E ≈ V²，即 V ≈ E<sup>1/2</sup>，得 <strong>Θ(E<sup>3/2</sup>)</strong>；稀疏图 E ≈ V，得 <strong>Θ(E³)</strong>。</p>
<p>另一种做法是每个顶点跑一次 Dijkstra（二叉堆）：O(V(V + E) log V)。稠密图上是 O(V³ log V)，不如 Floyd-Warshall；稀疏图上是 O(V² log V)，反而更快，但不能有负权边。</p>
<p>传递闭包同理：每个顶点跑一次 BFS 或 DFS（见 7.3、7.4）是 O(V² + VE)，最坏也就 O(V³)，Warshall 并不占优。</p>

<h2>C 代码</h2>
<p>要写的话，核心就是三重循环加一个 INF 判断：</p>
<pre><code>#include &lt;limits.h&gt;
#define MAXV 26
#define INF  INT_MAX                /* 没有路径 */

void floyd_warshall(int n, int D[MAXV][MAXV]) {
    for (int k = 0; k &lt; n; k++) {           /* 垫脚石，最外层 */
        for (int i = 0; i &lt; n; i++) {
            for (int j = 0; j &lt; n; j++) {
                if (D[i][k] != INF &amp;&amp; D[k][j] != INF &amp;&amp;
                    D[i][k] + D[k][j] &lt; D[i][j]) {
                    D[i][j] = D[i][k] + D[k][j];
                }
            }
        }
    }
}</code></pre>
<ul>
<li><code>INF</code>：INT_MAX 当 ∞。D 进来是距离矩阵，出去是最短距离，不可达的仍是 INF。</li>
<li>if 的前两个条件：有一段不通就跳过。少了它，INF 加正数会溢出（未定义行为），加负数会得到比 INF 小的“假距离”。</li>
<li>第三个条件：经 k 严格更短，才改成新值。</li>
</ul>
<p>Warshall 版把 if 换成 <code>if (R[i][k] &amp;&amp; R[k][j]) R[i][j] = 1;</code>。查负环：跑完扫一遍对角线，看有没有 D[i][i] &lt; 0。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>填矩阵</strong>（最常见）：给图或上一轮的表，写出第 k 轮之后的表，或问这轮改了哪几格。</li>
<li><strong>选择、判断</strong>：循环顺序（课上随堂测验考过）、能不能有环、负权边和负环。</li>
<li><strong>复杂度</strong>：Θ(V³)，用 E 表示（2015 年考过），和重复 Dijkstra 比。</li>
<li><strong>写 C</strong>：三重循环加 INF 判断。</li>
<li>初始化规则、递推式、k 最外层、Θ(V³) 都要背，公式表上没有。</li>
</ul>

<h3>例题 1：带负权边的填表</h3>
<p>有向图：A→B 4，A→C 1，C→B 2，B→D 3，C→D 6，D→A −2。写出 D⁽⁰⁾，用 Floyd-Warshall 逐轮列出更新，给出最终矩阵，并判断有没有负环。</p>
<table>
<thead><tr><th>D⁽⁰⁾</th><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead>
<tbody>
<tr><th>A</th><td>0</td><td>4</td><td>1</td><td>∞</td></tr>
<tr><th>B</th><td>∞</td><td>0</td><td>∞</td><td>3</td></tr>
<tr><th>C</th><td>∞</td><td>2</td><td>0</td><td>6</td></tr>
<tr><th>D</th><td>−2</td><td>∞</td><td>∞</td><td>0</td></tr>
</tbody>
</table>
<p>每轮先找第 k 列和第 k 行的有限值，再逐个交叉格比较：</p>
<ul>
<li>k = A：能到 A 的只有 D（−2），A 能到 B（4）、C（1）。D[D][B] = −2 + 4 = 2，D[D][C] = −2 + 1 = −1。</li>
<li>k = B：能到 B 的有 A 4、C 2、D 2，B 只能到 D（3）。D[A][D] = 4 + 3 = 7；D[C][D] = 2 + 3 = 5 &lt; 6；D[D][D] 得 2 + 3 = 5，不比 0 小，不改。</li>
<li>k = C：能到 C 的有 A 1、D −1，C 能到 B 2、D 5。D[A][B] = 1 + 2 = 3 &lt; 4；D[A][D] = 1 + 5 = 6 &lt; 7；D[D][B] = −1 + 2 = 1 &lt; 2；D[D][D] 得 4，不改。</li>
<li>k = D：能到 D 的有 A 6、B 3、C 5，D 能到 A −2、B 1、C −1。D[B][A] = 3 − 2 = 1；D[B][C] = 3 − 1 = 2；D[C][A] = 5 − 2 = 3；其余交叉格都不更小。</li>
</ul>
<table>
<thead><tr><th>D⁽⁴⁾</th><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead>
<tbody>
<tr><th>A</th><td>0</td><td>3</td><td>1</td><td>6</td></tr>
<tr><th>B</th><td>1</td><td>0</td><td>2</td><td>3</td></tr>
<tr><th>C</th><td>3</td><td>2</td><td>0</td><td>5</td></tr>
<tr><th>D</th><td>−2</td><td>1</td><td>−1</td><td>0</td></tr>
</tbody>
</table>
<p>对角线全是 0，没有负环（比如环 A→C→B→D→A 总权重 1 + 2 + 3 − 2 = 4 ≥ 0）。有负权边照样算对。</p>

<h3>例题 2：判断对错</h3>
<p>关于 Floyd-Warshall，哪些说法正确？(a) 循环顺序改成 i、k、j，结果不变；(b) 能用在有环的有向图上；(c) 跑完后 D[i][i] &lt; 0 说明有经过 i 的负环；(d) 求传递闭包时，Warshall 比“每个顶点跑一次 DFS”渐近更快。</p>
<p>正确的是 <strong>(b)(c)</strong>。</p>
<ul>
<li>(a) 错：见前面 A→C→B→D 的反例。k 必须在最外层。</li>
<li>(b) 对：只要求没有负环，不要求 DAG。</li>
<li>(c) 对：D[i][i] 是从 i 绕回 i 的最短长度，小于 0 就是负环。</li>
<li>(d) 错：重复 DFS 是 O(V² + VE)，最坏也才 O(V³)，稀疏图上还更快。</li>
</ul>

<div class="callout warn" data-label="易错">
<ul>
<li>Warshall 的对角线不自动是 1（R[i][i] = 1 表示 i 在环上）；Floyd-Warshall 的对角线初始化为 0。</li>
<li>第 k 轮用的是本轮开始时的表，含前面各轮的结果，不是原始矩阵。</li>
<li>中途的表不是最终答案。</li>
<li>无向图里一条负权边自己就是负环（来回走）。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>垫脚石：i 能到 k、k 能到 j，则 i 能到 j。每个顶点轮流当垫脚石，<strong>k 在最外层</strong>。</li>
<li>Warshall 从邻接矩阵开始；Floyd-Warshall 从距离矩阵开始（边权 / 对角线 0 / 没边 ∞），D[i][j] = min(D[i][j], D[i][k] + D[k][j])。</li>
<li>手算第 k 轮：只看第 k 行和第 k 列，它们本轮不变；严格更小才改。</li>
<li>允许负权边，不允许负环，不要求 DAG；跑完后 D[i][i] &lt; 0 说明有负环。</li>
<li>Θ(V³)，稠密图 Θ(E<sup>3/2</sup>)，稀疏图 Θ(E³)；稀疏且无负权边时，重复 Dijkstra 更快。</li>
</ul>
`;

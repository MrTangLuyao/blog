/* Post body — dsa-floyd-warshall / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-floyd-warshall:zh'] = `
<p class="lead">传递闭包（transitive closure）记录图中“谁能到谁”。Warshall 算法用<strong>垫脚石</strong>（stepping stone）的思路，三重循环把它算出来；Floyd-Warshall 算法沿用同一个循环，把“或”换成“取最小”，一次求出所有顶点对之间的最短距离。两者都是 <strong>Θ(V³)</strong>，垫脚石 k 必须是最外层循环。</p>

<h2>可达性与传递闭包</h2>
<p><strong>可达性（reachability）</strong>问的是：能否沿着边从 i 走到 j。把答案写成 V × V 的 0/1 矩阵 R，<strong>R[i][j] = 1 当且仅当存在一条从 i 到 j 的（有向）路径</strong>，这个矩阵就是传递闭包。它保留邻接矩阵的所有 1，再加上要走多条边才能到达的格子。有向、无向、带权、无权的图都适用（求可达性时忽略权重）。</p>
<p>例子：5 个顶点的有向图，A 没有入边，E 没有出边，B 和 D 互相指向。</p>
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
<p>它的传递闭包（加粗的 1 是邻接矩阵里没有的）：</p>
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
<p>例如 R[A][B] = 1，因为 A→C→D→B。<strong>对角线不会自动是 1</strong>：R[i][i] = 1 表示 i 能沿一个环回到自己（B→D→B），A、C、E 不在环上，仍是 0。</p>

<h2>Warshall 算法</h2>
<p>A→C、C→D 都存在，所以 A 能到 D，C 充当了垫脚石，也就是路径上的中间顶点。一般地：<strong>若 i 能到 k，且 k 能到 j，则 i 能到 j</strong>；换句话说，能到 k 的每个顶点都能到 k 能到的每个顶点。Warshall 算法让每个顶点依次当垫脚石，每轮扫一遍整个矩阵：</p>
<pre><code class="lang-text">Warshall(R):                     // R 开始是邻接矩阵
    for k = 0 to n-1              // 垫脚石，最外层
        for i = 0 to n-1          // 起点
            for j = 0 to n-1      // 终点
                if R[i][k] and R[k][j]:
                    R[i][j] = 1
    return R                      // 传递闭包</code></pre>
<p>手算一轮只看第 k 列和第 k 行：<strong>第 k 列为 1 的行（能到 k 的）与第 k 行为 1 的列（k 能到的）交叉处全部置 1</strong>。读的是<strong>当前</strong>矩阵，前几轮新增的 1 也算。</p>
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
<p>第 D 轮的“能到 D”里，A 是第 C 轮加上的，D 自己是第 B 轮加上的：前面的轮次给后面的轮次铺路。</p>
<p><strong>每一轮都要检查全部 V² 个 (i, j)</strong>，哪怕只改了 0 格或 2 格。三重循环各跑 V 次，<strong>时间 Θ(V³)</strong>，空间就是这个矩阵（原地更新）。</p>
<p>另一种做法是从每个顶点各跑一次 BFS 或 DFS（见 7.3、7.4）：邻接表上每次 O(V + E)，共 O(V² + VE)；E 最多约 V²，最坏也是 O(V³)。所以<strong>求传递闭包时 Warshall 在复杂度上没有优势</strong>，它的价值在于 Floyd-Warshall 用的是同一个框架。</p>

<h2>Floyd-Warshall：全源最短路</h2>
<p><strong>全源最短路（all-pairs shortest paths, APSP）</strong>要求每一对顶点之间的最短距离。起点是<strong>距离矩阵（distance matrix）</strong>：有边 i→j 填边权，<strong>对角线填 0，没有边填 ∞</strong>。它是“不允许任何垫脚石”时的答案，记为 D⁽⁰⁾。</p>
<p>把顶点编号为 1..n，D⁽ᵏ⁾[i][j] 表示<strong>只允许前 k 个顶点当垫脚石</strong>时 i 到 j 的最短距离（起点、终点不受限制）。这样的一条最短路：</p>
<ul>
  <li>不经过顶点 k：长度就是 D⁽ᵏ⁻¹⁾[i][j]；</li>
  <li>经过 k：在 k 处切成 i⇝k 和 k⇝j 两段，每段只用前 k−1 个顶点，长度为 D⁽ᵏ⁻¹⁾[i][k] + D⁽ᵏ⁻¹⁾[k][j]。</li>
</ul>
<pre><code class="lang-text">D(k)[i][j] = min( D(k-1)[i][j],  D(k-1)[i][k] + D(k-1)[k][j] )</code></pre>
<p>伪代码与 Warshall 只差一行：</p>
<pre><code class="lang-text">FloydWarshall(D):                // D 开始是距离矩阵
    for k = 0 to n-1              // 垫脚石，必须最外层
        for i = 0 to n-1
            for j = 0 to n-1
                D[i][j] = min(D[i][j], D[i][k] + D[k][j])
    return D</code></pre>
<p>一个矩阵原地更新就够：第 k 轮里第 k 行和第 k 列不会变（D[i][k] 只和 D[i][k] + D[k][k] = D[i][k] + 0 比较），读到的正是 D⁽ᵏ⁻¹⁾ 的值。</p>

<h2>追踪：课上的 6 顶点图</h2>
<p>沿用 7.5 Dijkstra 的无向图。一条无向边相当于两条方向相反的有向边，所以矩阵对称、更新成对出现，下表每对只写一次。</p>
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
<table>
<thead><tr><th>轮 k</th><th>更新（旧 → 新）</th><th>由来</th></tr></thead>
<tbody>
<tr><td>A</td><td>无</td><td>C→A→F = 2 + 3 = 5，不比 C–F 的 4 短</td></tr>
<tr><td>B</td><td>D–F：∞ → 3<br>E–F：∞ → 5</td><td>D→B→F = 2 + 1，E→B→F = 4 + 1；D→B→E = 2 + 4 = 6 与原值相等，不更新</td></tr>
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
<p>A–B 在第 D 轮得到 9（A→C→D→B），第 F 轮才降到 4（A→F→B）：<strong>D⁽ᵏ⁾ 只是用前 k 个垫脚石时的最优，中途的值不是最终答案</strong>。最后 A 行 0 4 2 6 8 3 与 7.5 中从 A 跑 Dijkstra 的结果相同。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-floyd-warshall/anims/floyd-warshall.html" loading="lazy" style="height: 520px;" title="Warshall 与 Floyd-Warshall 逐步演示"></iframe>
<p class="anim-caption">先选模式再按“下一步”：每轮先高亮第 k 行和第 k 列，再逐格显示被改的格子和它用到的两格，左侧图上标出对应路径（窄屏只显示矩阵）。</p>

<h2>为什么 k 必须在最外层</h2>
<p>第 k 轮用到的 D[i][k] 和 D[k][j] 必须已经是完整的 D⁽ᵏ⁻¹⁾。若把 i 放在最外层（顺序 i、k、j），A 行会在其他行动之前一次算完。反例：A→C 1，C→B 1，B→D 1。</p>
<ul>
  <li>处理 A 行、k = B 时，D[A][B] 还是 ∞：A 要经 C 才能到 B，而 C 还没轮到；</li>
  <li>k = C 时，D[A][B] 变成 2，但 D[C][D] 还是 ∞：C 行排在 A 行之后，还没处理。</li>
</ul>
<p>A 行之后不会再被处理，D[A][D] 停在 ∞，正确答案是 3（A→C→B→D）。k 在最外层时，第 B 轮先得到 D[C][D] = 2，第 C 轮再得到 D[A][D] = 1 + 2 = 3。</p>

<h2>负权边与负环</h2>
<p>Floyd-Warshall <strong>允许负权边，但不允许负环（negative-weight cycle）</strong>：若某个环的总权重 &lt; 0，每绕一圈路径就更短，最短路不存在。有环本身没问题，它<strong>不要求图是 DAG</strong>，只要求每个环的总权重 ≥ 0。</p>
<p>7.5 中让 Dijkstra 出错的图（A→B 2，A→C 3，C→B −2，B→D 2），Floyd-Warshall 得到 D[A][B] = 1、D[A][D] = 3，都正确。</p>
<p>负环可以检测：跑完后若某个 <strong>D[i][i] &lt; 0</strong>，说明 i 能沿负环回到自己。例：A→B 1，B→A −2，结束时 D[A][A] = −1。7.9 的货币套利就靠这一点。</p>

<h2>C 实现</h2>
<pre><code>#include &lt;limits.h&gt;

#define MAXV 26
#define INF  INT_MAX            /* 没有路径 */

/* Warshall：R 开始是邻接矩阵（0/1），结束时是传递闭包 */
void warshall(int n, int R[MAXV][MAXV]) {
    for (int k = 0; k &lt; n; k++) {               /* 垫脚石，最外层 */
        for (int i = 0; i &lt; n; i++) {
            for (int j = 0; j &lt; n; j++) {
                if (R[i][k] &amp;&amp; R[k][j]) {
                    R[i][j] = 1;
                }
            }
        }
    }
}

/* Floyd-Warshall：D 开始是距离矩阵（边权，对角线 0，没有边为 INF），
   结束时 D[i][j] = i 到 j 的最短距离（不可达仍为 INF） */
void floyd_warshall(int n, int D[MAXV][MAXV]) {
    for (int k = 0; k &lt; n; k++) {
        for (int i = 0; i &lt; n; i++) {
            for (int j = 0; j &lt; n; j++) {
                /* 任一段不通就跳过：避免溢出，也避免“INF + 负数” */
                if (D[i][k] != INF &amp;&amp; D[k][j] != INF &amp;&amp;
                    D[i][k] + D[k][j] &lt; D[i][j]) {
                    D[i][j] = D[i][k] + D[k][j];
                }
            }
        }
    }
}

/* 在 floyd_warshall 之后调用：有负环返回 1，否则返回 0 */
int has_negative_cycle(int n, int D[MAXV][MAXV]) {
    for (int i = 0; i &lt; n; i++) {
        if (D[i][i] &lt; 0) {
            return 1;
        }
    }
    return 0;
}</code></pre>
<p>INF 判断不能省：D[i][k] 为 INT_MAX 时，加正数会溢出（未定义行为），加负数会得到一个比 INF 小的“假距离”，把不通的格子改成有限值。</p>

<h2>复杂度与比较</h2>
<p>三重循环无论图稀疏还是稠密都跑满 V³ 次，所以 Floyd-Warshall 是 <strong>Θ(V³)</strong>，空间 Θ(V²)。改用边数 E 表示：</p>
<ul>
  <li>稠密图 E ≈ V²，即 V ≈ E<sup>1/2</sup>，时间 <strong>Θ(E<sup>3/2</sup>)</strong>；</li>
  <li>稀疏图 E ≈ V，时间 <strong>Θ(E³)</strong>。</li>
</ul>
<table>
<thead><tr><th>算法</th><th>问题</th><th>边权要求</th><th>时间</th></tr></thead>
<tbody>
<tr><td>BFS</td><td>单源，无权（按边数）</td><td>—</td><td>O(V + E)</td></tr>
<tr><td>Dijkstra（二叉堆）</td><td>单源</td><td>不能有负权边</td><td>O((V + E) log V)</td></tr>
<tr><td>每个顶点跑一次 Dijkstra</td><td>全源</td><td>不能有负权边</td><td>O(V(V + E) log V)</td></tr>
<tr><td>Floyd-Warshall</td><td>全源</td><td>可有负权边，不能有负环</td><td>Θ(V³)</td></tr>
</tbody>
</table>
<p>重复 Dijkstra 展开是 O(V² log V + VE log V)：稠密图上变成 O(V³ log V)，不如 Floyd-Warshall；稀疏图上是 O(V² log V)，反而更快，但它处理不了负权边。</p>

<h2>考试怎么考</h2>
<ul>
  <li><strong>填矩阵</strong>：给出图或 D⁽ᵏ⁻¹⁾，写出第 k 轮之后的矩阵，或问这一轮改了哪几格。只看第 k 行和第 k 列（它们本轮不变），逐个交叉格比较；Floyd-Warshall <strong>严格更小才改</strong>。</li>
  <li><strong>复杂度</strong>：Θ(V³)；用 E 表示时稠密 Θ(E<sup>3/2</sup>)、稀疏 Θ(E³)（2015 年考过）；与重复 Dijkstra、重复 BFS/DFS 比较。</li>
  <li><strong>判断 / 多选</strong>（课上随堂测验的题型）：“循环顺序任意”错；“k 最外层，然后 i、j”对；“i 最外层，然后 k、j”错；“只适用于 DAG”错；负权边可以、负环不行。</li>
  <li><strong>写 C</strong>：三重循环加 INF 判断。</li>
  <li>初始化规则（边权 / 0 / ∞）、递推式、k 最外层、Θ(V³) 都要背，公式表上没有。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
  <li>Warshall 的对角线不自动是 1；R[i][i] = 1 表示 i 在环上。</li>
  <li>手算第 k 轮用的是本轮开始时的矩阵（含前面所有轮次的结果），不是原始邻接矩阵。</li>
  <li>第 k 轮之后的矩阵只是“前 k 个顶点当垫脚石”时的最优，不是最终答案。</li>
  <li>无向图里一条负权边自己就构成负环（来回走），最短路没有定义。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">有向图：A→B，B→C，C→A，C→D。用 Warshall 算法求传递闭包，写出每一轮新增的 1 和最终矩阵。</summary>
  <div class="qa__body">
<p>每轮看“能到 k 的”×“k 能到的”：</p>
<ul>
  <li>k = A：能到 A 的只有 C，A 能到 B → 新增 C→B。</li>
  <li>k = B：能到 B 的是 A、C，B 能到 C → 新增 A→C、C→C。</li>
  <li>k = C：能到 C 的是 A、B、C，C 能到 A、B、C、D → 新增 A→A、A→D、B→A、B→B、B→D（其余已是 1）。</li>
  <li>k = D：D 没有出边 → 无。</li>
</ul>
<table>
<thead><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead>
<tbody>
<tr><th>A</th><td>1</td><td>1</td><td>1</td><td>1</td></tr>
<tr><th>B</th><td>1</td><td>1</td><td>1</td><td>1</td></tr>
<tr><th>C</th><td>1</td><td>1</td><td>1</td><td>1</td></tr>
<tr><th>D</th><td>0</td><td>0</td><td>0</td><td>0</td></tr>
</tbody>
</table>
<p>A、B、C 在同一个环上，彼此可达且能回到自己；D 没有出边，整行为 0，R[D][D] 也是 0。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">有向图：A→B 4，A→C 1，C→B 2，B→D 3，C→D 6，D→A −2。写出 D⁽⁰⁾，用 Floyd-Warshall 逐轮列出更新，给出最终矩阵，并判断有没有负环。</summary>
  <div class="qa__body">
<table>
<thead><tr><th>D⁽⁰⁾</th><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead>
<tbody>
<tr><th>A</th><td>0</td><td>4</td><td>1</td><td>∞</td></tr>
<tr><th>B</th><td>∞</td><td>0</td><td>∞</td><td>3</td></tr>
<tr><th>C</th><td>∞</td><td>2</td><td>0</td><td>6</td></tr>
<tr><th>D</th><td>−2</td><td>∞</td><td>∞</td><td>0</td></tr>
</tbody>
</table>
<ul>
  <li>k = A：能到 A 的只有 D（−2），A 能到 B（4）、C（1）→ D[D][B] = −2 + 4 = 2，D[D][C] = −2 + 1 = −1。</li>
  <li>k = B：能到 B 的有 A 4、C 2、D 2，B 只能到 D（3）→ D[A][D] = 4 + 3 = 7；D[C][D] = 2 + 3 = 5 &lt; 6；D[D][D] = 2 + 3 = 5 不比 0 小，不变。</li>
  <li>k = C：能到 C 的有 A 1、D −1，C 能到 B 2、D 5 → D[A][B] = 1 + 2 = 3 &lt; 4；D[A][D] = 1 + 5 = 6 &lt; 7；D[D][B] = −1 + 2 = 1 &lt; 2；D[D][D] 得 4，不变。</li>
  <li>k = D：能到 D 的有 A 6、B 3、C 5，D 能到 A −2、B 1、C −1 → D[B][A] = 3 − 2 = 1；D[B][C] = 3 − 1 = 2；D[C][A] = 5 − 2 = 3；其余交叉格都不更小。</li>
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
<p>对角线全是 0，没有负环（如环 A→C→B→D→A 的总权重是 1 + 2 + 3 − 2 = 4 ≥ 0）。有负权边照样能算对。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">图有 V 个顶点、E 条边，边权都非负。(a) 分别用 V、稠密图的 E、稀疏图的 E 表示 Floyd-Warshall 的运行时间。(b) 稀疏图（E ≈ V）上求全源最短路，重复 Dijkstra（二叉堆）和 Floyd-Warshall 哪个更快？若存在负权边呢？</summary>
  <div class="qa__body">
<p>(a) 三重循环固定跑 V³ 次：<strong>Θ(V³)</strong>。稠密图 E ≈ V²，V = E<sup>1/2</sup>，得 <strong>Θ(E<sup>3/2</sup>)</strong>；稀疏图 E ≈ V，得 <strong>Θ(E³)</strong>。</p>
<p>(b) 重复 Dijkstra 是 V · O((V + E) log V)，E ≈ V 时为 O(V² log V)，比 Θ(V³) 快。有负权边时 Dijkstra 可能出错（见 7.5 的反例），应该用 Floyd-Warshall（前提是没有负环）。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">多选：关于 Floyd-Warshall，哪些说法正确？(a) 把循环顺序改成 i、k、j，结果不变；(b) 可以用于有环的有向图；(c) 结束后 D[i][i] &lt; 0 说明存在经过 i 的负环；(d) 求传递闭包时，Warshall 比“从每个顶点跑一次 DFS”渐近更快；(e) 图中无负环时，第 k 轮里第 k 行和第 k 列的值不会改变。</summary>
  <div class="qa__body">
<p>正确的是 <strong>(b)(c)(e)</strong>。</p>
<ul>
  <li>(a) 错：A→C 1、C→B 1、B→D 1 用 i、k、j 顺序，D[A][D] 停在 ∞，正确值是 3。</li>
  <li>(b) 对：只要求没有负环，不要求 DAG。</li>
  <li>(c) 对：D[i][i] 是从 i 出发回到 i 的最短长度，小于 0 就是负环。</li>
  <li>(d) 错：重复 DFS 是 O(V² + VE)，最坏也是 O(V³)，稀疏图上更快。</li>
  <li>(e) 对：D[i][k] 的候选值是 D[i][k] + D[k][k] = D[i][k] + 0，不会更小；第 k 行同理。</li>
</ul>
  </div>
</details>
`;

/* Post body — dsa-closest-pair / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-closest-pair:zh'] = `
<p class="lead">最近点对问题（closest pair problem）：平面上 n 个点，找出欧氏距离最小的两个点。逐对比较的蛮力是 Θ(n²)；先解一维版本，再把“分成两半、单独处理跨界点对”的分治思路搬到二维，得到 Θ(n log n)。</p>

<h2>问题</h2>
<p>输入是 n 个点，没有任何顺序。两点 p、q 的<strong>欧氏距离（Euclidean distance）</strong>是 dist(p, q) = √((x<sub>p</sub> − x<sub>q</sub>)² + (y<sub>p</sub> − y<sub>q</sub>)²)。只比较大小时不必开方：距离越小，距离的平方也越小。所以实现里全程比较<strong>距离的平方</strong>，要输出距离时才开方。</p>
<p>课上的路线：先解简化的一维版本（所有点在一条直线上，y = 0），再看每个想法能不能推广到二维。</p>

<h2>思路一：蛮力</h2>
<p>把每一对点的距离都算一遍，记住最小的。第 1 个点和后面 n − 1 个点配对，第 2 个点和后面 n − 2 个点配对……总对数是 (n − 1) + (n − 2) + … + 1 = <strong>n(n − 1)/2</strong>。不论输入如何都要算满，最好、最坏都是 <strong>Θ(n²)</strong>，而且一维、二维都适用。</p>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;math.h&gt;

typedef struct {
    double x, y;
} point_t;

/* 两点距离的平方。只比较大小时不必开方：距离越小，平方也越小 */
double dist2(point_t p, point_t q) {
    double dx = p.x - q.x, dy = p.y - q.y;
    return dx * dx + dy * dy;
}

/* 蛮力：检查全部 n(n-1)/2 对，要求 n &gt;= 2。
   返回最小的距离平方，最近两点的下标写进 *bi、*bj */
double closest_brute(const point_t pts[], int n, int *bi, int *bj) {
    double best = dist2(pts[0], pts[1]);
    *bi = 0;
    *bj = 1;
    for (int i = 0; i &lt; n - 1; i++) {
        for (int j = i + 1; j &lt; n; j++) {   /* j &gt; i：每对只算一次，也不和自己比 */
            double d = dist2(pts[i], pts[j]);
            if (d &lt; best) {
                best = d;
                *bi = i;
                *bj = j;
            }
        }
    }
    return best;
}

int main(void) {
    point_t pts[] = { {9, 1}, {5, 9}, {16, 10}, {1, 8},    /* 输入不必有序 */
                      {7, 7}, {18, 6}, {2, 2}, {6, 4} };
    int n = sizeof(pts) / sizeof(pts[0]);
    int i, j;
    double best = closest_brute(pts, n, &amp;i, &amp;j);
    printf("(%g,%g) (%g,%g) d = %.3f\\n",
           pts[i].x, pts[i].y, pts[j].x, pts[j].y, sqrt(best));
    return 0;
}</code></pre>
<p>输出 <code>(5,9) (7,7) d = 2.828</code>（用了 math.h，编译时加 <code>-lm</code>）。8 个点共 8 × 7 / 2 = 28 对。</p>

<h2>一维：排序后只看相邻点</h2>
<p>例：16, 4, 20, 9, 1, 10。排序得 1, 4, 9, 10, 16, 20，相邻差 3, 5, 1, 6, 4，最小是 1（9 与 10）。</p>
<p>只看相邻就够了：若 a &lt; b &lt; c，则 c − a = (c − b) + (b − a) &gt; b − a，不相邻的一对总比夹在中间的某一对远。排序 Θ(n log n) 加一次扫描 Θ(n)，合计 <strong>Θ(n log n)</strong>。</p>
<p><strong>这个办法推广不到二维</strong>：按 x 排还是按 y 排？x 很接近的两点 y 可以差很远，反之亦然，没有一种排序能反映二维距离。例如 P(0,0)、Q(2,2)、R(1,20)、S(20,1)：最近的是 P 和 Q（√8 ≈ 2.83，其余各对都超过 18），可按 x 排是 P, R, Q, S，按 y 排是 P, S, Q, R，P 和 Q 在两种顺序里都不相邻。</p>

<h3>一维分治</h3>
<p>排好序后从中间分成左右两半：递归求左半的最近距离 d<sub>L</sub> 和右半的 d<sub>R</sub>，再算 <strong>d<sub>M</sub> = 右半最左点 − 左半最右点</strong>，答案是 <strong>min(d<sub>L</sub>, d<sub>R</sub>, d<sub>M</sub>)</strong>。</p>
<p>跨界只需看这一对：左半任一点 ≤ 左半最右点 ≤ 右半最左点 ≤ 右半任一点，所以任何跨界点对的距离都 ≥ d<sub>M</sub>。上例分成 1, 4, 9 | 10, 16, 20：d<sub>L</sub> = 3（1 与 4），d<sub>R</sub> = 4（16 与 20），d<sub>M</sub> = 10 − 9 = 1，答案 1。</p>
<p>每次调用除递归外只做常数次工作（一次减法、三者取最小），所以 T(n) = 2T(n/2) + c。主定理：a = 2，b = 2，<strong>d = 0</strong>，a = 2 &gt; b<sup>d</sup> = 1，得 Θ(n<sup>log₂ 2</sup>) = <strong>Θ(n)</strong>（展开法见 1.8）。加上开头的排序，总共仍是 <strong>Θ(n log n)</strong>，并不比“排序 + 扫描”快。它的价值是给出二维能用的框架：<strong>分两半递归，再单独处理跨界的点对</strong>。</p>

<h2>二维分治</h2>
<ol>
  <li><strong>预处理</strong>：按 x 排序一次，Θ(n log n)；另备一份按 y 排序的副本。</li>
  <li><strong>分</strong>：用一条竖线把点分成左右各一半（n 为奇数时，中间的点归哪边都行）。</li>
  <li><strong>治</strong>：递归求左半的 d<sub>L</sub>、右半的 d<sub>R</sub>，令 <strong>d = min(d<sub>L</sub>, d<sub>R</sub>)</strong>。点数 ≤ 3 时直接蛮力。</li>
  <li><strong>合</strong>：检查有没有跨过竖线、距离小于 d 的点对。</li>
</ol>
<p>第 4 步的关键：<strong>距离小于 d 的跨线点对，两个点到竖线的水平距离都小于 d</strong>。离竖线至少 d 的点，和另一侧任何点的水平距离已经至少是 d，直线距离不可能小于 d。所以只需检查竖线两侧各宽 d 的<strong>中间带（strip）</strong>，总宽 2d。</p>
<p>带里的点按 y 从小到大排好，对每个点 p 只往后看：一旦后面的点 q 满足 q.y − p.y ≥ d，q 以及更后面的点都不可能比 d 近，p 就停下。和一维不同，跨界最近的一对不一定是左半最右点和右半最左点，带内的比较省不掉。</p>

<h3>为什么每个点只比常数次</h3>
<p>p 往后要比的点，都落在 p 上方高 d、宽 2d（竖线两侧各 d）的矩形里。把矩形切成 8 个边长 d/2 的小方格，每格都只在竖线的一侧：</p>
<figure class="fig">
<svg viewBox="0 0 400 245" width="400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="p 上方的 d 乘 2d 矩形切成 8 个小方格">
<rect x="60" y="50" width="280" height="140" fill="rgba(251,191,36,0.08)" stroke="#fbbf24" stroke-width="2"/>
<line x1="130" y1="50" x2="130" y2="190" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" stroke-dasharray="5 4"/>
<line x1="270" y1="50" x2="270" y2="190" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" stroke-dasharray="5 4"/>
<line x1="60" y1="120" x2="340" y2="120" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" stroke-dasharray="5 4"/>
<line x1="200" y1="22" x2="200" y2="212" stroke="#d97757" stroke-width="2.5"/>
<line x1="62" y1="36" x2="198" y2="36" stroke="#a1a1a0" stroke-width="1"/>
<line x1="202" y1="36" x2="338" y2="36" stroke="#a1a1a0" stroke-width="1"/>
<line x1="62" y1="31" x2="62" y2="41" stroke="#a1a1a0" stroke-width="1"/>
<line x1="198" y1="31" x2="198" y2="41" stroke="#a1a1a0" stroke-width="1"/>
<line x1="202" y1="31" x2="202" y2="41" stroke="#a1a1a0" stroke-width="1"/>
<line x1="338" y1="31" x2="338" y2="41" stroke="#a1a1a0" stroke-width="1"/>
<text x="130" y="28" text-anchor="middle" font-size="14" fill="#e8e8e8">d</text>
<text x="270" y="28" text-anchor="middle" font-size="14" fill="#e8e8e8">d</text>
<line x1="44" y1="52" x2="44" y2="188" stroke="#a1a1a0" stroke-width="1"/>
<line x1="39" y1="52" x2="49" y2="52" stroke="#a1a1a0" stroke-width="1"/>
<line x1="39" y1="188" x2="49" y2="188" stroke="#a1a1a0" stroke-width="1"/>
<text x="30" y="125" text-anchor="middle" font-size="14" fill="#e8e8e8">d</text>
<text x="95" y="89" text-anchor="middle" font-size="12" fill="#a1a1a0">d/2</text>
<circle cx="165" cy="190" r="6" fill="#d97757"/>
<text x="165" y="210" text-anchor="middle" font-size="14" font-weight="700" fill="#d97757">p</text>
<text x="110" y="232" text-anchor="middle" font-size="13" fill="#a1a1a0">左半</text>
<text x="200" y="232" text-anchor="middle" font-size="13" fill="#d97757">分割线</text>
<text x="290" y="232" text-anchor="middle" font-size="13" fill="#a1a1a0">右半</text>
</svg>
<figcaption>p 上方高 d、宽 2d 的矩形，竖线两侧各 4 个边长 d/2 的小方格</figcaption>
</figure>
<p>同一侧的两个点距离至少是 d（d 不超过两半各自的最小距离），而小方格的对角线只有 d/√2 ≈ 0.71d，所以<strong>每格最多 1 个点，矩形里最多 8 个点（含 p）</strong>，p 往后最多比 7 次。课上给的数字是这块区域最多 8 个点、真正要比的另一侧点最多 5 个；具体常数随区域画法而变，<strong>要点是“常数个”</strong>。</p>
<p>注意带里本身可能有很多点，极端情况下全部 n 个点都在带里。合并步线性，靠的不是“带里点少”，而是<strong>每个点只和 y 方向上紧随其后的常数个点比较</strong>。带内若不按 y 排、两两全比，最坏是 Θ(n²)。</p>

<h3>例子</h3>
<p>还是上面 C 程序的 8 个点，按 x 排序后命名为 A–H：A(1,8) B(2,2) C(5,9) D(6,4) E(7,7) F(9,1) G(16,10) H(18,6)。</p>
<ul>
  <li>竖线 x = 6.5（D 与 E 之间），左半 A–D，右半 E–H。</li>
  <li>递归得 d<sub>L</sub> = √17 ≈ 4.12（A 与 C：左半再分成 A, B | C, D 时，在它自己的中间带里找到），d<sub>R</sub> = √20 ≈ 4.47（G 与 H）。d = √17。</li>
  <li>中间带 |x − 6.5| &lt; 4.12：C、D、E、F 在带里，B（差 4.5）和 G（差 9.5）在带外。按 y 排序：F(1), D(4), E(7), C(9)。</li>
</ul>
<table>
<thead><tr><th>p</th><th>q</th><th>y 差</th><th>动作</th><th>之后的 d</th></tr></thead>
<tbody>
<tr><td>F</td><td>D</td><td>3 &lt; √17</td><td>算距离 √18 ≈ 4.24，不更近</td><td>√17</td></tr>
<tr><td>F</td><td>E</td><td>6 ≥ √17</td><td>停，F 不再往后</td><td>√17</td></tr>
<tr><td>D</td><td>E</td><td>3 &lt; √17</td><td>算距离 √10 ≈ 3.16，更新</td><td>√10</td></tr>
<tr><td>D</td><td>C</td><td>5 ≥ √10</td><td>停</td><td>√10</td></tr>
<tr><td>E</td><td>C</td><td>2 &lt; √10</td><td>算距离 √8 ≈ 2.83，更新</td><td>√8</td></tr>
</tbody>
</table>
<p>答案是 <strong>C 与 E，√8 ≈ 2.83</strong>，与蛮力一致。D、E 正是“左半最右点 + 右半最左点”，距离 √10，却不是答案。F、D 都在带里，算出来也不更近：带只是缩小候选范围。</p>
<iframe class="anim-frame" src="blog/blog_data/dsa-closest-pair/anims/closest-pair.html" loading="lazy" style="height: 540px;" title="最近点对分治逐步演示"></iframe>
<p class="anim-caption">逐帧看完整递归：浅色区域是当前子问题，橙色虚线是分割线，黄色是中间带，绿线是目前最近的一对；底部是带内按 y 排好的点，实心橙色是 p，浅橙色是正在和它比较的 q。“随机 10 点”每次换一组新点。</p>

<h3>伪代码与合并步</h3>
<pre><code class="lang-text">ClosestPair(P, Q)    // P：按 x 排好序；Q：同一批点按 y 排好序；返回最小距离
    n = P 的点数
    if n ≤ 3: return 蛮力(P)
    L = P 的前 ⌈n/2⌉ 个点，R = 其余的点
    m = (L 最右点的 x + R 最左点的 x) / 2          // 竖线 x = m
    QL, QR = 顺序扫 Q：属于 L 的进 QL，其余进 QR     // 仍按 y 有序，Θ(n)
    d = min( ClosestPair(L, QL), ClosestPair(R, QR) )
    S = Q 中满足 |x − m| &lt; d 的点                    // 中间带，按 y 有序，Θ(n)
    对 S 中每个点 p，往后看 q，直到 q.y − p.y ≥ d：
        d = min(d, dist(p, q))
    return d</code></pre>
<p>合并步的扫描写成 C（沿用上面的 <code>point_t</code> 和 <code>dist2</code>，全程用平方比较）：</p>
<pre><code>/* s[0..ns-1]：带内的点，已按 y 从小到大排好；
   best：min(dL, dR) 的平方。返回更新后的最小距离平方 */
double strip_closest(const point_t s[], int ns, double best) {
    for (int i = 0; i &lt; ns - 1; i++) {
        for (int j = i + 1; j &lt; ns; j++) {
            double dy = s[j].y - s[i].y;
            if (dy * dy &gt;= best) {
                break;              /* 后面的点 y 差更大，不可能更近 */
            }
            double d = dist2(s[i], s[j]);
            if (d &lt; best) {
                best = d;
            }
        }
    }
    return best;
}</code></pre>

<h3>复杂度</h3>
<p>递归调用之外的工作 f(n) 是：把 Q 分成两份、挑出带内的点、扫描中间带（每点常数次），都是 Θ(n)。于是 <strong>T(n) = 2T(n/2) + Θ(n)</strong>。主定理：a = 2，b = 2，d = 1，a = b<sup>d</sup>，得 <strong>Θ(n log n)</strong>。加上预排序的 Θ(n log n)，总计 <strong>Θ(n log n)</strong>。</p>
<p>要让 f(n) 保持线性，带内的 y 顺序必须来自预先排好的副本（或在递归返回时像归并排序那样按 y 合并）。若每层都把带重新排序，f(n) = Θ(n log n) 不是多项式，主定理不能直接套用，结果是 Θ(n log² n)。</p>

<h2>考试怎么考</h2>
<table>
<thead><tr><th>做法</th><th>适用</th><th>递推式</th><th>时间</th></tr></thead>
<tbody>
<tr><td>蛮力</td><td>一维、二维</td><td>无（n(n − 1)/2 对）</td><td>Θ(n²)</td></tr>
<tr><td>排序 + 扫描相邻</td><td>仅一维</td><td>无</td><td>Θ(n log n)</td></tr>
<tr><td>一维分治</td><td>一维</td><td>T(n) = 2T(n/2) + c</td><td>Θ(n)，加排序后 Θ(n log n)</td></tr>
<tr><td>二维分治</td><td>二维</td><td>T(n) = 2T(n/2) + Θ(n)</td><td>Θ(n log n)（含预排序）</td></tr>
</tbody>
</table>
<ul>
  <li><strong>复杂度题</strong>：写出某种做法的递推式并用主定理求解。主定理和等差数列求和都在 equation sheet 上，要自己读对 a、b、d：一维分治的 f(n) 是常数，<strong>d = 0</strong>（和二分查找同一个坑）；二维分治 d = 1。</li>
  <li><strong>解释题</strong>：为什么只看中间带（带外点到另一侧任何点的距离都不小于 d）；为什么合并步是线性的（按 y 扫描，每点只比常数个，小方格论证）；为什么一维的排序扫描不能推广到二维（举 P、Q、R、S 那样的反例）。</li>
  <li><strong>代码题</strong>：手写蛮力版；读带内扫描的循环，说出 <code>break</code> 为什么正确。</li>
  <li><strong>配对题</strong>：同一个问题两种范式，逐对比较是蛮力（brute force），按竖线分两半是分治（divide and conquer），见 1.10。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>① 中间带是竖线<strong>两侧各 d</strong>，总宽 2d。② d 取 min(d<sub>L</sub>, d<sub>R</sub>)，不是 max。③ 带内必须按 y 处理，两两全比最坏 Θ(n²)。④ 一维分治本身是 Θ(n)，问整个算法时要加上排序，答 Θ(n log n)。⑤ 主定理里的 d 是指数，别和距离 d 混淆。⑥ 蛮力的内层循环从 i + 1 开始，否则会拿点和自己比，得到 0。</p>
</div>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">1. 一维点 26, 9, 31, 17, 5, 24, 12, 18。(a) 用“排序 + 扫描”求最近点对；(b) 用一维分治，写出顶层的 dL、dR、dM；(c) 分治一直递归到只剩 1 个点（1 个点返回 ∞），不算排序共调用多少次？由此说明这部分为什么是 Θ(n)。</summary>
  <div class="qa__body">
<p>(a) 排序得 5, 9, 12, 17, 18, 24, 26, 31，相邻差 4, 3, 5, 1, 6, 2, 5，最小是 1，即 <strong>17 与 18</strong>。</p>
<p>(b) 左半 5, 9, 12, 17：d<sub>L</sub> = 3（9 与 12，正是这一半自己的 d<sub>M</sub> = 12 − 9）；右半 18, 24, 26, 31：d<sub>R</sub> = 2（24 与 26，也是它自己的 d<sub>M</sub>）；顶层 d<sub>M</sub> = 18 − 17 = 1。min(3, 2, 1) = <strong>1</strong>。</p>
<p>(c) 8 个单点调用是叶子；每个 ≥ 2 个点的调用分出两个子调用，这样的调用有 7 个。共 <strong>15 = 2n − 1</strong> 次，每次 O(1)，所以是 Θ(n)，与主定理 a = 2 &gt; b<sup>d</sup> = 1 的结论一致。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">2. 用主定理求下列做法的时间（不含预排序），写出 a、b、d：(a) 一维分治；(b) 二维分治，带内点按 y 有序、每点只往后比常数个；(c) 二维分治，但带内的点两两全部比较，且带里可能有全部 n 个点。</summary>
  <div class="qa__body">
<p>(a) T(n) = 2T(n/2) + c：a = 2，b = 2，d = 0；b<sup>d</sup> = 1 &lt; a，情况 3，<strong>Θ(n<sup>log₂ 2</sup>) = Θ(n)</strong>。</p>
<p>(b) T(n) = 2T(n/2) + cn：d = 1，b<sup>d</sup> = 2 = a，情况 2，<strong>Θ(n log n)</strong>。</p>
<p>(c) 最坏 T(n) = 2T(n/2) + cn²：d = 2，b<sup>d</sup> = 4 &gt; a，情况 1，<strong>Θ(n²)</strong>，和蛮力一样，分治白做了。带里装满所有点的例子：左半的点都在 x = −1、y = 0, 10, 20, …，右半的点都在 x = 1、y = 5, 15, 25, …。两半内的最近距离都是 10，而所有点离竖线 x = 0 只有 1，全部落在带里。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">3. 10 个点（已按 x 排序）：P(1,8) Q(2,3) R(6,6) S(9,2) T(10,11) U(11,4) V(12,10) W(17,1) X(18,12) Y(19,7)。二维分治的顶层，两半递归返回 dL = 5、dR = √26 ≈ 5.10。写出分割竖线、中间带里的点、按 y 扫描的每一步和最终答案。</summary>
  <div class="qa__body">
<p>左半是前 5 个点 P–T，右半 U–Y，竖线 x = (10 + 11)/2 = 10.5。d = min(5, √26) = 5，带是 5.5 &lt; x &lt; 15.5：R、S、T、U、V（Q 和 W 在带外）。按 y 排序：S(2), U(4), R(6), V(10), T(11)。</p>
<table>
<thead><tr><th>p</th><th>q</th><th>y 差</th><th>动作</th><th>之后的 d</th></tr></thead>
<tbody>
<tr><td>S</td><td>U</td><td>2 &lt; 5</td><td>算距离 √8 ≈ 2.83，更新</td><td>√8</td></tr>
<tr><td>S</td><td>R</td><td>4 ≥ √8</td><td>停</td><td>√8</td></tr>
<tr><td>U</td><td>R</td><td>2 &lt; √8</td><td>算距离 √29 ≈ 5.39，不更近</td><td>√8</td></tr>
<tr><td>U</td><td>V</td><td>6 ≥ √8</td><td>停</td><td>√8</td></tr>
<tr><td>R</td><td>V</td><td>4 ≥ √8</td><td>停</td><td>√8</td></tr>
<tr><td>V</td><td>T</td><td>1 &lt; √8</td><td>算距离 √5 ≈ 2.24，更新</td><td>√5</td></tr>
</tbody>
</table>
<p>答案 <strong>T(10,11) 与 V(12,10)，√5 ≈ 2.24</strong>，只算了 3 次距离。先找到的 S–U 不是最终答案，扫描必须走完。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">4. 把蛮力代码的两层循环都写成从 0 到 n − 1：for (int i = 0; i &lt; n; i++) 和 for (int j = 0; j &lt; n; j++)，其余不变。对上面 8 个点的输入返回什么？为什么？在循环体里加上 if (i != j) 行不行？三种写法的循环体各调用 dist2 多少次？</summary>
  <div class="qa__body">
<p>返回 <strong>0</strong>。j == i 时 dist2(pts[i], pts[i]) = 0 &lt; best，best 变成 0，之后没有比 0 更小的值，等于把同一个点报成了最近点对。</p>
<p>加 <code>if (i != j)</code> 结果正确，但每对算了两次。n = 8 时：两层都从 0 开始是 n² = 64 次；跳过 i == j 是 n(n − 1) = 56 次；原写法（i 到 n − 2，j 从 i + 1 开始）是 n(n − 1)/2 = 28 次。三者都是 Θ(n²)，原写法最省。</p>
  </div>
</details>
`;

/* Post body — dsa-closest-pair / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-closest-pair:zh'] = `
<p class="lead">最近点对问题：平面上 n 个点，找出离得最近的两个。每对都比是 Θ(n²)；课上先解一维，再用“分两半、单独查跨界点对”的分治做到 Θ(n log n)。</p>

<h2>从一个场景说起</h2>
<p>塔台的雷达屏幕上有上千架飞机，每架是一个点。系统要随时找出靠得最近的两架，它们最需要预警。</p>
<p>最直接的办法：每两架量一次距离，留下最小的。可 1000 架就有将近 50 万对，飞机还在动，每秒都要重算。</p>
<p>能不能少量几次？在屏幕中间画一条竖线，两边各找各的，最后只盯着竖线附近可能“跨线”的几架。这就是最近点对的分治算法，从 n² 降到 n log n。</p>

<h2>它是什么</h2>
<p>简单说：给你平面上 n 个点（没有排好序），找出距离最近的两个点。这叫<strong>最近点对问题（closest pair problem）</strong>。</p>
<p>距离用<strong>欧氏距离（Euclidean distance）</strong>，就是勾股定理：dist(p, q) = √((x<sub>p</sub> − x<sub>q</sub>)² + (y<sub>p</sub> − y<sub>q</sub>)²)。只比大小时不用开方：距离越小，平方也越小，所以程序里全程比平方，输出时才开方。</p>
<p>课上分三步走：</p>
<ul>
<li><strong>蛮力（brute force）</strong>：每一对都算，Θ(n²)。</li>
<li><strong>先排序</strong>：只适用于一维（点都在一条直线上），Θ(n log n)。</li>
<li><strong>分治（divide and conquer）</strong>：分两半递归，再单独处理跨过中线的点对。先在一维练手，再搬到二维，Θ(n log n)。</li>
</ul>

<h2>思路一：蛮力，每一对都量</h2>
<pre><code>typedef struct { double x, y; } point_t;

double dist2(point_t p, point_t q) {
    double dx = p.x - q.x, dy = p.y - q.y;
    return dx * dx + dy * dy;           /* 距离的平方，不开方 */
}

/* 返回最小距离的平方，要求 n &gt;= 2 */
double closest_brute(const point_t pts[], int n) {
    double best = dist2(pts[0], pts[1]);
    for (int i = 0; i &lt; n - 1; i++) {
        for (int j = i + 1; j &lt; n; j++) {
            double d = dist2(pts[i], pts[j]);
            if (d &lt; best) {
                best = d;
            }
        }
    }
    return best;
}</code></pre>
<ul>
<li><code>point_t</code>：一个点就是两个 <code>double</code>。</li>
<li><code>dist2</code>：算 dx² + dy²，即距离的平方，省掉 <code>sqrt</code>。</li>
<li><code>best</code> 先取第 0、1 个点的距离，当作“目前最好”。</li>
<li>外层 <code>i</code> 从 0 到 n − 2，内层 <code>j</code> <strong>从 i + 1 开始</strong>：每对只算一次，也不会拿点和自己比。</li>
<li>遇到更小的 <code>d</code> 就更新 <code>best</code>；返回的是平方，调用方再开方。</li>
</ul>
<p>算几次？i = 0 时内层跑 n − 1 次，i = 1 时跑 n − 2 次……一直到 1 次。合计 (n − 1) + (n − 2) + … + 1 = <strong>n(n − 1)/2 对</strong>。输入怎样都要跑满，最好、最坏都是 <strong>Θ(n²)</strong>。</p>
<p>课上的 8 个点 (9,1) (5,9) (16,10) (1,8) (7,7) (18,6) (2,2) (6,4) 共 8 × 7 / 2 = 28 对，返回 8，开方 ≈ 2.83，是 (5,9) 和 (7,7)。</p>

<h2>思路二：一维，排好序只看邻居</h2>
<p>先把问题变简单：所有点都在一条直线上（y = 0），每个点就是一个数。</p>
<p>例：16, 4, 20, 9, 1, 10。排序得 1, 4, 9, 10, 16, 20，相邻差是 3, 5, 1, 6, 4，最小是 1（9 和 10）。</p>
<p>为什么只看相邻就够？排成一队的人里，隔着一个人的两人，一定比其中任一人和中间那人离得远。写成式子：a &lt; b &lt; c 时，c − a = (c − b) + (b − a) &gt; b − a。排序 Θ(n log n)，扫一遍 Θ(n)，合计 <strong>Θ(n log n)</strong>。</p>
<p>可惜<strong>推广不到二维</strong>：按 x 排还是按 y 排？x 很近的两点，y 可能差很远，反过来也一样。例如 P(0,0)、Q(2,2)、R(1,20)、S(20,1)：最近的是 P 和 Q（√8 ≈ 2.83，其余各对都超过 18）。可按 x 排是 P, R, Q, S，按 y 排是 P, S, Q, R，P 和 Q 两次都不相邻。</p>

<h3>一维也能分治</h3>
<p>排好序后从中间切开，左右两半各自递归，求出最近距离 d<sub>L</sub> 和 d<sub>R</sub>。还漏了“一个点在左、一个点在右”的跨界点对。</p>
<p>一维里跨界只要看一对：<strong>左半最右点和右半最左点</strong>，它们的距离叫 <strong>d<sub>M</sub></strong>。别的跨界点对都把这两个点夹在中间，只会更远。答案就是 <strong>min(d<sub>L</sub>, d<sub>R</sub>, d<sub>M</sub>)</strong>。</p>
<p>上例切成 1, 4, 9 | 10, 16, 20：d<sub>L</sub> = 3（1 与 4），d<sub>R</sub> = 4（16 与 20），d<sub>M</sub> = 10 − 9 = 1，答案 1。</p>
<p>每次调用除了递归，只做常数次工作（一次减法、三个数取最小），所以 <strong>T(n) = 2T(n/2) + c</strong>。主定理（见 1.9）：a = 2，b = 2，<strong>d = 0</strong>，a &gt; b<sup>d</sup> = 1，得 Θ(n<sup>log₂ 2</sup>) = <strong>Θ(n)</strong>。加上开头的排序，总共还是 <strong>Θ(n log n)</strong>，并不比“排序 + 扫描”快。</p>
<p>它的价值是这个框架：<strong>分两半递归，再单独处理跨界的点对</strong>。二维照搬。</p>

<h2>思路三：二维分治</h2>
<ol>
<li><strong>预处理</strong>：按 x 排序一次，Θ(n log n)；另备一份按 y 排好的副本。</li>
<li><strong>分</strong>：用一条竖线把点分成左右各一半（n 为奇数时，中间那个点归哪边都行）。</li>
<li><strong>治</strong>：递归求左半的 d<sub>L</sub>、右半的 d<sub>R</sub>，令 <strong>d = min(d<sub>L</sub>, d<sub>R</sub>)</strong>。剩 ≤ 3 个点时直接蛮力。</li>
<li><strong>合</strong>：检查有没有跨过竖线、距离小于 d 的点对。</li>
</ol>
<p>难点在第 4 步。二维不能只看“左半最右 + 右半最左”这一对，它俩的 y 可能差很远。那要两边两两全比吗？不用，两条线索就能把候选砍到很少。</p>

<h3>线索 1：只看中间带</h3>
<p>像隔着一条河找两岸最近的两个人：离河边至少 d 远的人，光走到河边就要 d，不可能更近，不用考虑。</p>
<p>同理，离竖线至少 d 的点，和另一侧任何点的水平距离已经 ≥ d，直线距离只会更长。所以只看竖线<strong>两侧各宽 d</strong> 的一条带子，叫<strong>中间带（strip）</strong>，总宽 2d。</p>

<h3>线索 2：带里按 y 排，每个点只往后看几个</h3>
<p>带里的点按 y 从小到大排好（从按 y 排好的副本里按顺序挑出来，不用重排）。每个点 p 只往后看：一旦某个 q 满足 q.y − p.y ≥ d，后面的点 y 差只会更大，p 就停。</p>
<p>p 往后要比的点，都落在 p 上方高 d、宽 2d 的矩形里。把它切成 8 个边长 d/2 的小方格，每格只在竖线的一侧：</p>
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
<p>同一侧的两个点距离至少是 d（d 不超过两半各自的最近距离），而小方格的对角线只有 d/√2 ≈ 0.71d，装不下两个点。所以<strong>每格最多 1 个点，矩形里最多 8 个点（含 p）</strong>，p 往后最多比 7 次。课上的说法是这块区域最多 8 个点、另一侧最多 5 个；常数随区域的画法而变，<strong>要点是“常数个”</strong>。</p>
<p>注意，带里可能有很多点，极端时全部 n 个都在。合并步是线性的，靠的不是“带里点少”，而是<strong>每个点只和 y 方向紧随其后的常数个点比较</strong>。</p>

<h2>看个例子</h2>
<p>还是蛮力那 8 个点，按 x 排序后叫 A–H：A(1,8) B(2,2) C(5,9) D(6,4) E(7,7) F(9,1) G(16,10) H(18,6)。</p>
<ol>
<li><strong>分</strong>：竖线 x = 6.5（D 与 E 中间），左半 A–D，右半 E–H。</li>
<li><strong>治</strong>：递归得 d<sub>L</sub> = √17 ≈ 4.12（A 与 C，左半再分成 A, B | C, D 时在它的中间带里找到），d<sub>R</sub> = √20 ≈ 4.47（G 与 H）。d = √17。</li>
<li><strong>画带</strong>：|x − 6.5| &lt; 4.12 的点在带里：C、D、E、F。B（差 4.5）和 G（差 9.5）在带外。按 y 排好：F(1), D(4), E(7), C(9)。</li>
<li><strong>扫描</strong>：每个点往后看，y 差 ≥ d 就停：</li>
</ol>
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
<p>答案 <strong>C 与 E，√8 ≈ 2.83</strong>，和蛮力一致。注意 D、E 正是“左半最右 + 右半最左”，距离 √10，却不是答案；F、D 在带里也没更近，带只是缩小候选范围。</p>
<iframe class="anim-frame" src="blog/blog_data/dsa-closest-pair/anims/closest-pair.html" loading="lazy" style="height: 540px;" title="最近点对分治逐步演示"></iframe>
<p class="anim-caption">逐帧看完整递归：浅色区域是当前子问题，橙色虚线是分割线，黄色是中间带，绿线是目前最近的一对；底部是带内按 y 排好的点，实心橙色是 p，浅橙色是正在和它比较的 q。“随机 10 点”每次换一组新点。</p>

<h2>补充：复杂度从哪来</h2>
<p>递归之外的工作：把按 y 的副本分成两份、挑出带里的点、扫描中间带（每点常数次），都是 Θ(n)。于是 <strong>T(n) = 2T(n/2) + Θ(n)</strong>。主定理：a = 2，b = 2，d = 1，a = b<sup>d</sup>，得 <strong>Θ(n log n)</strong>，加上预排序仍是 <strong>Θ(n log n)</strong>。</p>
<p>前提是带里的 y 顺序来自预先排好的副本。每层都把带重新排序的话，总时间会变成 Θ(n log² n)。</p>
<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/6u_hWxbOc7E" title="Closest Pair of Points (Divide and Conquer) Explained" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：iDeer7《Closest Pair of Points (Divide and Conquer) Explained》（英文），用图讲二维分治的分、治、中间带和带内扫描。视频把 d 写成 δ，比较个数的常数可能和课上不同，记住“常数个”就够。</p>

<h2>考试怎么考</h2>
<p>选择 / 填空问递推式和复杂度；解释题问为什么只看中间带、合并为什么是线性的、一维排序为什么推广不到二维；代码题手写蛮力；手算题走一遍带内扫描。主定理在 equation sheet 上，a、b、d 要自己读对。</p>
<table>
<thead><tr><th>做法</th><th>递推式</th><th>时间</th></tr></thead>
<tbody>
<tr><td>蛮力（一维、二维）</td><td>无（n(n − 1)/2 对）</td><td>Θ(n²)</td></tr>
<tr><td>排序 + 扫描相邻（仅一维）</td><td>无</td><td>Θ(n log n)</td></tr>
<tr><td>一维分治</td><td>T(n) = 2T(n/2) + c</td><td>Θ(n)，加排序 Θ(n log n)</td></tr>
<tr><td>二维分治</td><td>T(n) = 2T(n/2) + Θ(n)</td><td>Θ(n log n)</td></tr>
</tbody>
</table>

<h3>例题 1：用主定理求时间（不含预排序）</h3>
<p>(a) 一维分治；(b) 二维分治，带内按 y 有序、每点只往后比常数个；(c) 二维分治，但带内的点两两全比，且带里可能有全部 n 个点。</p>
<ul>
<li>(a) T(n) = 2T(n/2) + c：a = 2，b = 2，d = 0。b<sup>d</sup> = 1 &lt; a，得 Θ(n<sup>log₂ 2</sup>) = <strong>Θ(n)</strong>。常数项对应 d = 0，不是 1。</li>
<li>(b) T(n) = 2T(n/2) + cn：d = 1，b<sup>d</sup> = 2 = a，得 <strong>Θ(n log n)</strong>。</li>
<li>(c) 最坏 T(n) = 2T(n/2) + cn²：d = 2，b<sup>d</sup> = 4 &gt; a，得 <strong>Θ(n²)</strong>，分治白做了。例如左半的点都在 x = −1、y = 0, 10, 20, …，右半都在 x = 1、y = 5, 15, …：两半内最近距离都是 10，所有点却离竖线只有 1，全在带里。</li>
</ul>

<h3>例题 2：走一遍中间带</h3>
<p>10 个点已按 x 排好：P(1,8) Q(2,3) R(6,6) S(9,2) T(10,11) U(11,4) V(12,10) W(17,1) X(18,12) Y(19,7)。顶层两半递归返回 d<sub>L</sub> = 5、d<sub>R</sub> = √26 ≈ 5.10。求竖线、带里的点和最终答案。</p>
<p>左半是前 5 个点 P–T，右半 U–Y，竖线 x = (10 + 11)/2 = 10.5。d = min(5, √26) = 5，带是 5.5 &lt; x &lt; 15.5，带里有 R、S、T、U、V（Q 和 W 在带外）。按 y 排好：S(2), U(4), R(6), V(10), T(11)。</p>
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
<p>答案 <strong>T(10,11) 与 V(12,10)，√5 ≈ 2.24</strong>。先找到的 S–U 不是最终答案，扫描必须走完。</p>

<div class="callout warn" data-label="易错">
<p>① 中间带是竖线<strong>两侧各 d</strong>，总宽 2d。② d 取 min(d<sub>L</sub>, d<sub>R</sub>)，不是 max。③ 带内必须按 y 扫描；两两全比最坏 Θ(n²)。④ 一维分治本身是 Θ(n)，问整个算法要加上排序，答 Θ(n log n)。⑤ 主定理里的 d 是指数，别和距离 d 混淆。⑥ 蛮力的内层循环从 i + 1 开始；从 0 开始会拿点和自己比，返回 0。</p>
</div>

<h2>小结</h2>
<ul>
<li>蛮力：n(n − 1)/2 对，Θ(n²)；内层循环从 i + 1 开始。</li>
<li>一维：排序后只看相邻点，Θ(n log n)；推广不到二维。</li>
<li>一维分治：min(d<sub>L</sub>, d<sub>R</sub>, d<sub>M</sub>)，T(n) = 2T(n/2) + c → Θ(n)，加排序 Θ(n log n)。</li>
<li>二维分治：d = min(d<sub>L</sub>, d<sub>R</sub>)，只查竖线两侧各宽 d 的中间带，带内按 y 扫描，每点只比常数个。</li>
<li>T(n) = 2T(n/2) + Θ(n) → a = b<sup>d</sup> → Θ(n log n)。</li>
</ul>
`;

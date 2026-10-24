/* Post body — dsa-counting-operations / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-counting-operations:zh'] = `
<p class="lead">比较两个算法谁快，不掐秒表，而是数它要做多少次基本操作，写成输入规模 n 的函数 T(n)。决定算法在大输入上还能不能用的，是 n 变大时 T(n) 涨得多快，也就是增长率。</p>

<h2>从一个场景说起</h2>
<p>课上有个例子：有人用多米诺骨牌搭了一台加法器，加两个很小的数，要等一分多钟。同样的加法，你心算几秒，电脑只要几毫秒。</p>
<p>同一件事，耗时天差地别，差别出在机器上。而且同一台电脑上，两位数相加一眨眼，几千位的大数相加也要算一阵：耗时还跟输入有关。</p>
<p>所以掐秒表，比出来的主要是机器。想公平地比算法本身，得找一个换了机器也不变的量：<strong>它一共做了多少步</strong>。</p>

<h2>它是什么</h2>
<p>简单说：<strong>T(n) 就是输入规模为 n 时，算法要做的基本操作次数。</strong></p>
<p>可以把算法想成一份菜谱：切几刀、炒几下，谁来做都一样；快手 10 分钟做完、新手要半小时，那是厨师的差别，不是菜谱的差别。T(n) 数的就是“菜谱上的步数”。它由三部分组成：</p>
<ul>
<li><strong>基本操作（basic operation）</strong>：加、减、乘、比较（如 <code>==</code>）、赋值、<code>if</code> 分支、函数调用。本课约定<strong>每种都算 1 次，代价相同</strong>（unit cost），就像菜谱里的“切一刀”。</li>
<li><strong>输入规模 n（input size）</strong>：数组有多长、有几名选手、有几个盘子，就像“做几人份”。</li>
<li><strong>增长率（growth rate）</strong>：n 变大时 T(n) 怎么涨。2 人份和 200 人份差多少工作量，才是真正关心的。</li>
</ul>
<p>还有一条省事的约定：<strong>只数最主要（最贵、执行最多）的那种操作</strong>，其余的忽略。</p>
<p>为什么要专门看增长？因为规模变大，成本不一定按比例变。课上的快递例子：接 50 单，打包要 50 倍时间，但装车能一次搬好几件、送货能顺路，都用不了 50 倍。也有涨得快得多的，见例 2、例 3。</p>

<h2>看个例子</h2>
<h3>例 1：数组求和，先把每一步都数上</h3>
<p>对长度为 n 的数组 A 求和，注释写着每行做了几次操作：</p>
<pre><code>int sum = 0;                    /* 赋值：1 次 */
for (int i = 0; i &lt; n; i++) {   /* i = 0：1 次；i &lt; n：n + 1 次；i++：n 次 */
    sum = sum + A[i];           /* 每轮加法 1 次 + 赋值 1 次：共 2n 次 */
}</code></pre>
<ul>
<li>第 1 行：赋值一次。</li>
<li>第 2 行有三部分。<code>i = 0</code> 只在开头做一次；<code>i &lt; n</code> 每轮开始前比较一次，i 从 0 到 n − 1 共 n 次为真，到 i = n 还要再比一次才知道该停，所以是 n + 1 次；<code>i++</code> 每轮末尾一次，共 n 次。</li>
<li>第 3 行：每轮一次加法、一次赋值，n 轮共 2n 次。</li>
</ul>
<p>合计 T(n) = 1 + 1 + (n + 1) + n + 2n = <strong>4n + 3</strong>。</p>
<p>要是把 <code>i++</code> 算成“加法 + 赋值”两次，就变成 5n + 3。常数随数法而变，形状却不变，都是“常数 × n + 常数”：n 翻倍，工作量也差不多翻倍。所以只数循环体里那次加法、记 <strong>T(n) = n</strong> 就够了，这就是“只数主要操作”的道理。</p>

<h3>例 2：循环赛要赛几场</h3>
<p>n 名选手，每两人之间赛一场（循环赛，round robin），一共几场？有两种算法。</p>
<p><strong>算法 1：逐场列出来再数。</strong></p>
<pre><code>long games_by_listing(int n) {
    long count = 0;
    for (int i = 0; i &lt; n; i++)
        for (int j = i + 1; j &lt; n; j++)
            count++;            /* 列出一场：选手 i 对选手 j */
    return count;
}

long games_by_formula(int n) {
    return (long)n * (n - 1) / 2;
}</code></pre>
<p>外层的 i 选定一名选手；内层的 j 从 <code>i + 1</code> 开始，只跟排在他后面的人配对，这样 A 对 B 和 B 对 A 不会算两遍；每配出一对，<code>count</code> 加 1。拿 4 个人 A、B、C、D 走一遍：</p>
<pre><code class="lang-text">i = 0（A）：j = 1, 2, 3  → AB, AC, AD   3 场
i = 1（B）：j = 2, 3     → BC, BD       2 场
i = 2（C）：j = 3        → CD           1 场
i = 3（D）：没有 j                      0 场
合计 3 + 2 + 1 + 0 = 6 场</code></pre>
<p>n 个人时，内层依次跑 n − 1、n − 2、……、1、0 次，用公式表上的等差求和：</p>
<pre><code class="lang-text">T(n) = (n − 1) + (n − 2) + … + 1 + 0 = n(n − 1)/2</code></pre>
<p>40 人要列 780 场，1000 人约 50 万场。<strong>工作量按 n² 的速度涨</strong>：人数翻倍，场数差不多翻 4 倍。</p>
<p><strong>算法 2：直接套组合数公式</strong> C(n, 2) = n(n − 1)/2，就是上面的 <code>games_by_formula</code>。不管 n 多大，都只做 1 次减法、1 次乘法、1 次除法，<strong>T(n) = 3，是常数</strong>。</p>
<p>两个算法答案一样，增长率却天差地别。数操作的好处就在这：<strong>不用真的跑，就知道该选哪个</strong>。</p>

<h3>例 3：汉诺塔，问题本身就难</h3>
<p>汉诺塔（Tower of Hanoi）：三根柱子，n 个大小不同的盘叠在第一根上，要全部移到第三根。每次只能移一个盘，<strong>大盘不能压在小盘上</strong>。</p>
<p>标准解法是递归的：先把上面 n − 1 个盘挪到中间那根，再把最大的盘移到目标柱，最后把那 n − 1 个盘叠回它上面。所以移动次数满足 M(n) = 2M(n − 1) + 1、M(1) = 1，依次是 1, 3, 7, 15, …，也就是 <strong>M(n) = 2ⁿ − 1</strong>（怎么解这种递推式见 1.8）。</p>
<p>这已经是最少的步数：最大的盘要动，其余 n − 1 个盘得先全部让到另一根柱子上，之后再全部搬回它上面。假设每秒能移 10⁹ 次：</p>
<table>
<thead><tr><th>盘数 n</th><th>移动次数 2ⁿ − 1</th><th>用时</th></tr></thead>
<tbody>
<tr><td>20</td><td>1,048,575</td><td>约 1 ms</td></tr>
<tr><td>40</td><td>约 1.1 × 10¹²</td><td>约 18 分钟</td></tr>
<tr><td>64</td><td>约 1.8 × 10¹⁹</td><td>约 585 年</td></tr>
</tbody>
</table>
<p>只多了 24 个盘，时间就从 18 分钟变成 585 年。算法已经最优，慢在<strong>问题本身就需要指数级的步数</strong>。这样的问题叫<strong>难解的（intractable）</strong>。</p>

<h3>放在一起：增长率表</h3>
<p>课上把常见的增长率排成一张表，按每秒 10⁹ 次操作估算用时：</p>
<table>
<thead><tr><th>n</th><th>log₂ n</th><th>n</th><th>n log₂ n</th><th>n²</th><th>2ⁿ</th><th>n!</th></tr></thead>
<tbody>
<tr><td>10</td><td>3.3 ns</td><td>10 ns</td><td>33 ns</td><td>100 ns</td><td>1.0 µs</td><td>3.6 ms</td></tr>
<tr><td>20</td><td>4.3 ns</td><td>20 ns</td><td>86 ns</td><td>400 ns</td><td>1.0 ms</td><td>77 年</td></tr>
<tr><td>30</td><td>4.9 ns</td><td>30 ns</td><td>147 ns</td><td>900 ns</td><td>1.1 s</td><td>8.4 × 10¹⁵ 年</td></tr>
<tr><td>100</td><td>6.6 ns</td><td>100 ns</td><td>664 ns</td><td>10 µs</td><td>4.0 × 10¹³ 年</td><td>3.0 × 10¹⁴¹ 年</td></tr>
<tr><td>10⁶</td><td>20 ns</td><td>1 ms</td><td>20 ms</td><td>16.7 分钟</td><td>远超宇宙年龄</td><td>远超宇宙年龄</td></tr>
<tr><td>10⁹</td><td>30 ns</td><td>1 s</td><td>30 s</td><td>31.7 年</td><td>远超宇宙年龄</td><td>远超宇宙年龄</td></tr>
</tbody>
</table>
<ul>
<li><strong>n = 30 时 n! 已经算不完，n = 100 时 2ⁿ 也算不完</strong>。指数级、阶乘级的算法只能处理很小的 n。</li>
<li>log₂ n 几乎不涨：n 从 10 变到 10⁹，它只从 3.3 变到 30。</li>
</ul>
<p>换一台快 1000 倍的机器也救不了指数级算法。限时 1 小时，2ⁿ 的算法能处理的 n 只从 41 涨到 51，因为 1000 ≈ 2¹⁰。</p>
<iframe class="anim-frame" src="blog/blog_data/dsa-counting-operations/anims/growth.html" loading="lazy" style="height: 520px;" title="各增长级别的操作次数与用时"></iframe>
<p class="anim-caption">拖动 n 的滑块或按“播放”，看每一级的用时和操作次数。条形按对数刻度画操作次数，虚线是 1 µs、1 秒、1 年和宇宙年龄。</p>

<h2>补充：复杂度阶梯</h2>
<p>本课列出的常见级别，从慢到快：</p>
<p><strong>1 &lt; log n &lt; n &lt; n log n &lt; n² &lt; n³ &lt; 2ⁿ &lt; 3ⁿ &lt; n!</strong></p>
<table>
<thead><tr><th>级别</th><th>名称</th><th>典型例子</th></tr></thead>
<tbody>
<tr><td>O(1)</td><td>常数（constant）</td><td>按下标取数组元素；循环赛公式</td></tr>
<tr><td>O(log n)</td><td>对数（logarithmic）</td><td>有序数组上的二分查找</td></tr>
<tr><td>O(n)</td><td>线性（linear）</td><td>线性查找；数组求和</td></tr>
<tr><td>O(n log n)</td><td>线性对数（n log n）</td><td>归并排序</td></tr>
<tr><td>O(n²)</td><td>平方（quadratic）</td><td>选择排序；列出所有两两配对</td></tr>
<tr><td>O(n³)</td><td>立方（cubic）</td><td>三重循环，如 Floyd-Warshall</td></tr>
<tr><td>O(2ⁿ)</td><td>指数（exponential）</td><td>枚举所有子集；汉诺塔</td></tr>
<tr><td>O(3ⁿ)</td><td>指数</td><td>每个元素有 3 种选择的全部方案</td></tr>
<tr><td>O(n!)</td><td>阶乘（factorial）</td><td>枚举所有排列，如蛮力求旅行商路线</td></tr>
</tbody>
</table>
<p>两点要记牢：<strong>2ⁿ 和 3ⁿ 不是同一级</strong>（理由见 1.6）；<strong>n! 比任何 cⁿ 都长得快</strong>。“级别”的精确定义是 Big-O 等记号，见 1.4。</p>

<h2>补充：数循环的三种形状</h2>
<p>数循环只问一件事：<strong>最里面那条语句一共执行几次？</strong>每轮加 1 的单层循环是 n 次（例 1）；两层循环内层跟 i 无关时直接相乘，是 n²，内层从 i + 1 开始（例 2）约为一半，仍是 n² 级。第三种是<strong>翻倍循环</strong>，次数是 log₂ n 级：</p>
<pre><code>for (int i = 1; i &lt;= n; i *= 2)    /* 翻倍：⌊log₂ n⌋ + 1 次 */
    count++;</code></pre>
<p>翻倍循环为什么是 log？拿 n = 20 走一遍：i 依次是 1, 2, 4, 8, 16，<code>count</code> 加了 5 次；下一个 i = 32 &gt; 20，结束。5 = ⌊log₂ 20⌋ + 1。从 n 开始每轮 <code>i /= 2</code> 的减半循环也一样（20, 10, 5, 2, 1，共 5 次）。</p>
<p>一句话判断：<strong>循环变量每轮加减一个常数，是 n 级；每轮乘除一个常数，是 log n 级。</strong></p>
<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/9TlHvipP5yA" title="1.5.1 Time Complexity #1" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Abdul Bari《1.5.1 Time Complexity #1》（英文，约 10 分钟），拿几段 for 循环演示怎么数执行次数、看出是哪一级。视频里的 O(n) 记号见 1.4。</p>

<h2>考试怎么考</h2>
<p>多出现在选择题、填空题里，也是长题里“求这段代码的复杂度”的第一步。常见问法：</p>
<ul>
<li><strong>排序</strong>：给一串函数（可能带系数和常数项），按增长率从慢到快排。</li>
<li><strong>数次数</strong>：给一段循环，问某条语句执行几次、属于哪一级。</li>
<li><strong>归类</strong>：给出 T(n)，问是哪一级。只看最高阶项：n(n − 1)/2 = n²/2 − n/2 是 n² 级，2ⁿ − 1 是 2ⁿ 级。</li>
<li><strong>概念</strong>：为什么不用运行时间比较算法；哪些算基本操作。</li>
</ul>
<div class="callout key" data-label="考点">
<p><strong>复杂度阶梯要背，公式表上没有。</strong>等差求和 n(n + 1)/2、等比求和 (1 − rⁿ⁺¹)/(1 − r) 在公式表上，但把循环翻译成求和式要自己做。</p>
</div>

<h3>例题 1：按增长率排序</h3>
<p>题目：把下列函数按增长率从慢到快排列：n²，2²⁰，3ⁿ，50n，n log₂ n，1000 log₂ n，n!，0.001n³，2ⁿ。</p>
<p><strong>第一步，挑出常数。</strong>2²⁰ 约 100 万，看着大，可里面没有 n，所以是常数级，排最前。</p>
<p><strong>第二步，去掉系数。</strong>1000 log₂ n 看成 log n，50n 看成 n，0.001n³ 看成 n³。系数只决定“什么时候追上”，不改变级别：0.001n³ 在 n &gt; 1000 之后就超过 n² 了。</p>
<p><strong>第三步，对照阶梯排好：</strong></p>
<p><strong>2²⁰ &lt; 1000 log₂ n &lt; 50n &lt; n log₂ n &lt; n² &lt; 0.001n³ &lt; 2ⁿ &lt; 3ⁿ &lt; n!</strong></p>
<p>两处容易犹豫。n log₂ n 要等 log₂ n &gt; 50（n &gt; 2⁵⁰）才超过 50n，但从那以后一直领先，所以它长得更快。3ⁿ ÷ 2ⁿ = 1.5ⁿ 会无限变大，所以 3ⁿ 排在 2ⁿ 后面。</p>

<h3>例题 2：数循环次数</h3>
<p>题目：下面两段代码，分别求 n = 16 时 <code>x++</code> 执行几次、一般 n 时执行几次，以及属于哪一级。</p>
<pre><code>/* (a) */
for (int i = 0; i &lt; n; i++)
    for (int j = 1; j &lt;= n; j *= 2)
        x++;

/* (b) */
for (int i = 1; i &lt;= n; i *= 2)
    for (int j = 0; j &lt; i; j++)
        x++;</code></pre>
<p><strong>(a)</strong> 先看内层：j = 1, 2, 4, 8, 16，是翻倍循环，跑 5 次，而且跟 i 无关。外层跑 16 次，一共 16 × 5 = <strong>80</strong> 次。一般 n 时是 n(⌊log₂ n⌋ + 1)，<strong>n log n 级</strong>。</p>
<p><strong>(b)</strong> 这次是外层翻倍：i = 1, 2, 4, 8, 16。内层跑到 i，所以 5 轮里内层分别跑 1, 2, 4, 8, 16 次，一共 <strong>31</strong> 次。一般 n 时，设 k = ⌊log₂ n⌋，总次数是等比求和（r = 2，套公式表）：</p>
<pre><code class="lang-text">1 + 2 + 4 + … + 2ᵏ = (1 − 2ᵏ⁺¹)/(1 − 2) = 2ᵏ⁺¹ − 1</code></pre>
<p>因为 2ᵏ ≤ n &lt; 2ᵏ⁺¹，这个数在 n 和 2n − 1 之间，所以是 <strong>n 级</strong>。外层虽然跑了 log n 轮，但每轮工作量翻倍，最后一轮就占了一半多，<strong>不能写成 n × log n</strong>。</p>
<div class="callout warn" data-label="易错">
<p>① <code>i *= 2</code>、<code>i /= 2</code> 的循环是 log n 级。② 内层从 i + 1 开始的两层循环仍是 n² 级。③ 2ⁿ 和 3ⁿ 是不同的级；2²⁰ 这种不含 n 的数是常数。④ 比的是 n 足够大以后：n = 10 时 1000 log₂ n ≈ 3322 比 n² = 100 大，但 n² 长得快。⑤ 问精确次数要看边界：翻倍循环把 <code>i &lt;= n</code> 改成 <code>i &lt; n</code>，n = 16 时从 5 次变成 4 次。</p>
</div>

<h2>小结</h2>
<ul>
<li>比较算法不掐秒表，而是数基本操作：每种操作算 1 次（unit cost），写成输入规模 n 的函数 T(n)。</li>
<li>只数最主要的操作，只看最高阶项：4n + 3 是 n 级，n(n − 1)/2 是 n² 级，3 次运算是常数级。</li>
<li>复杂度阶梯要背：1 &lt; log n &lt; n &lt; n log n &lt; n² &lt; n³ &lt; 2ⁿ &lt; 3ⁿ &lt; n!。</li>
<li>指数级、阶乘级只能处理很小的 n；汉诺塔要 2ⁿ − 1 步，是难解问题，换快机器也没用。</li>
<li>数循环：加减常数是 n 级，乘除常数是 log n 级；两层循环把内层次数加起来求和。</li>
</ul>
`;

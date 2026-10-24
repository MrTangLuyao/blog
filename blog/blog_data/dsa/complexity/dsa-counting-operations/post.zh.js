/* Post body — dsa-counting-operations / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-counting-operations:zh'] = `
<p class="lead">比较算法快慢不看秒表，而是数它执行了多少次基本操作，写成输入规模 n 的函数 T(n)。一个算法在大输入上还能不能用，取决于 T(n) 随 n 增长的速度，也就是增长率（growth rate）。</p>

<h2>不计时间，数操作</h2>
<p>同一个算法换一台机器，耗时就不同。课上的例子：用多米诺骨牌搭的加法器，加两个很小的数要一分多钟；人算要几秒；电脑只要几毫秒。耗时还取决于输入：两位数相加很快，几千位的大数相加电脑也要算一阵。所以分析算法时把机器因素拿掉，改为数操作。本课程的约定：</p>
<ul>
  <li>把算法拆成<strong>基本操作</strong>：加、减、乘、比较（如 <code>==</code>）、赋值、<code>if</code> 分支、函数调用。<strong>每种都算 1 次，代价相同</strong>（unit cost）。</li>
  <li>用 <strong>T(n)</strong> 表示操作次数，n 是<strong>输入规模</strong>：数组长度、选手人数、盘子个数等。</li>
  <li>关心的是 <strong>n 变大时 T(n) 怎样增长</strong>，而且只数<strong>最主要（最贵、执行最多）的那种操作</strong>。</li>
</ul>
<p>例：对长度为 n 的数组 A 求和，先把每个操作都数上：</p>
<pre><code>int sum = 0;                    /* 赋值：1 次 */
for (int i = 0; i &lt; n; i++) {   /* i = 0：1 次；i &lt; n：n + 1 次；i++：n 次 */
    sum = sum + A[i];           /* 每轮加法 1 次 + 赋值 1 次：共 2n 次 */
}</code></pre>
<p>合计 T(n) = 1 + 1 + (n + 1) + n + 2n = <strong>4n + 3</strong>。如果把 <code>i++</code> 算成加法和赋值两次，就是 5n + 3；把计算 <code>A[i]</code> 地址的那次加法也算上，又是另一个数。常数随数法而变，形状却不变：都是“常数 × n + 常数”。所以通常只数循环体里那次加法，记 <strong>T(n) = n</strong>：n 翻倍，工作量也翻倍。</p>
<p>规模相同的输入，次数也可能不同：线性查找第一个就命中只比较 1 次，找不到要比较 n 次。这是最好、最坏情况的区别，见 1.7。</p>

<h2>为什么要看增长：课上的三个例子</h2>
<h3>规模变大，成本不一定按比例变</h3>
<p>打印 1 页 3 秒、100 页 300 秒，这种按比例放大的估计常常成立，但不能默认。快递的例子：一单要打包 10 分钟、装车 2 分钟、送货平均 1 小时。50 单时打包确实是 50 × 10 = 500 分钟；装车却能一次搬好几件，送货能沿一条路线顺路送多家，都远少于 50 倍。也有比按比例涨得快得多的情况，下面两个例子就是。成本怎样随规模变化，要分析才知道。</p>

<h3>选算法：循环赛要赛几场</h3>
<p>n 名选手，每两人之间赛一场（循环赛，round robin），一共几场？</p>
<p><strong>算法 1：逐场列出来再数。</strong>4 人 A、B、C、D：AB、AC、AD、BC、BD、CD，共 6 场（B 对 A 已经列过，跳过）。写成代码是两层循环，内层从 <code>i + 1</code> 开始。下面的程序同时给出了算法 2 和后面汉诺塔的解法：</p>
<pre><code>#include &lt;stdio.h&gt;

/* 算法 1：把每场比赛列出来再数，返回列出的场数 */
long games_by_listing(int n) {
    long count = 0;
    for (int i = 0; i &lt; n; i++) {
        for (int j = i + 1; j &lt; n; j++) {  /* 只列 i &lt; j：A-B 与 B-A 是同一场 */
            count++;                       /* 列出一场：选手 i 对选手 j */
        }
    }
    return count;
}

/* 算法 2：组合数 C(n, 2) = n(n-1)/2，不论 n 多大都是 3 次运算 */
long games_by_formula(int n) {
    return (long)n * (n - 1) / 2;
}

/* 汉诺塔：把 k 个盘从 from 移到 to（via 作中转），返回移动次数 */
long hanoi(int k, char from, char via, char to) {
    if (k == 0) {
        return 0;
    }
    long moves = hanoi(k - 1, from, to, via);  /* 上面 k-1 个先挪到中转柱 */
    moves++;                                   /* 最大的盘 from -&gt; to */
    moves += hanoi(k - 1, via, from, to);      /* k-1 个再叠到最大的盘上 */
    return moves;
}

int main(void) {
    int players[] = {4, 5, 10, 20, 40};
    for (int k = 0; k &lt; 5; k++) {
        int n = players[k];
        printf("n = %2d: listing %3ld, formula %3ld\\n",
               n, games_by_listing(n), games_by_formula(n));
    }
    int disks[] = {1, 2, 3, 10, 20};
    for (int k = 0; k &lt; 5; k++) {
        printf("%2d disks: %7ld moves\\n", disks[k], hanoi(disks[k], 'A', 'B', 'C'));
    }
    return 0;
}</code></pre>
<pre><code class="lang-text">n =  4: listing   6, formula   6
n =  5: listing  10, formula  10
n = 10: listing  45, formula  45
n = 20: listing 190, formula 190
n = 40: listing 780, formula 780
 1 disks:       1 moves
 2 disks:       3 moves
 3 disks:       7 moves
10 disks:    1023 moves
20 disks: 1048575 moves</code></pre>
<p>数内层循环体（列出一场）执行了几次：i = 0 时内层跑 n − 1 次，i = 1 时 n − 2 次，……，i = n − 1 时 0 次：</p>
<pre><code class="lang-text">T(n) = (n − 1) + (n − 2) + … + 1 + 0 = n(n − 1)/2</code></pre>
<p>最后一步用公式表上的等差求和 ∑ i = m(m + 1)/2，取 m = n − 1。40 人要列 780 场，1000 人约 50 万场：<strong>工作量按 n² 的速度涨</strong>，手工列 40 人的对阵就得花一个多小时。</p>
<p><strong>算法 2：组合数公式</strong> C(n, 2) = n(n − 1)/2。不管 n 多大，都只做 1 次减法、1 次乘法、1 次除法，<strong>T(n) = 3，是常数</strong>。两个算法答案相同，增长率却完全不同；分析增长率，才知道哪个适合手头的规模。</p>

<h3>问题本身就难：汉诺塔</h3>
<p>汉诺塔（Tower of Hanoi）：三根柱子 A、B、C，n 个大小不同的盘叠在 A 上，要全部移到 C。每次移一个盘，<strong>大盘不能压在小盘上</strong>。</p>
<p>程序里的 <code>hanoi</code> 是标准解法：先把上面 n − 1 个移到中转柱，再把最大的移到目标柱，最后把 n − 1 个移到它上面。移动次数满足 M(n) = 2M(n − 1) + 1、M(1) = 1，依次是 1, 3, 7, 15, …，即 <strong>M(n) = 2ⁿ − 1</strong>（解递推式的方法见 1.8）。不存在步数更少的解法：最大的盘移动的那一刻，其余 n − 1 个必须全在第三根柱子上，之后还要全部移到它上面，所以至少要 2M(n − 1) + 1 步。</p>
<p>假设每秒能移 10⁹ 次（课上说“闪电侠的速度”）：</p>
<table>
<thead><tr><th>盘数 n</th><th>移动次数 2ⁿ − 1</th><th>用时</th></tr></thead>
<tbody>
<tr><td>20</td><td>1,048,575</td><td>约 1 ms</td></tr>
<tr><td>40</td><td>约 1.1 × 10¹²</td><td>约 18 分钟</td></tr>
<tr><td>64</td><td>约 1.8 × 10¹⁹</td><td>约 585 年</td></tr>
</tbody>
</table>
<p>盘子多了 24 个，时间就从 18 分钟变成 585 年。这时慢的不是算法（它已经最优），而是<strong>问题本身就需要指数级的步数</strong>，这样的问题称为<strong>难解的（intractable）</strong>。</p>

<h2>增长率表</h2>
<p>课上把常见的增长率放进一张表，按每秒 10⁹ 次操作估算用时。下表按同样的速度重新计算：</p>
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
  <li><strong>n = 30 时 n! 已不可行，n = 100 时 2ⁿ 也不可行</strong>：指数级和阶乘级的算法只能处理很小的 n，再正确也没用。</li>
  <li>n 和 n² 在 n ≤ 30 时只差不到 1 µs；到 n = 10⁹，一个 1 秒，一个约 32 年。</li>
  <li>log₂ n 几乎不涨：n 从 10 变到 10⁹，它只从 3.3 变到 30。</li>
</ul>
<iframe class="anim-frame" src="blog/blog_data/dsa-counting-operations/anims/growth.html" loading="lazy" style="height: 520px;" title="各增长级别的操作次数与用时"></iframe>
<p class="anim-caption">拖动 n 的滑块或按“播放”，看每一级的用时和操作次数。条形按对数刻度画操作次数，虚线是 1 µs、1 秒、1 年和宇宙年龄。</p>

<h3>复杂度阶梯</h3>
<p>本课程列出的常见级别，从慢到快：</p>
<p><strong>1 &lt; log n &lt; n &lt; n log n &lt; n² &lt; n³ &lt; 2ⁿ &lt; 3ⁿ &lt; n!</strong></p>
<table>
<thead><tr><th>级别</th><th>名称</th><th>典型例子</th></tr></thead>
<tbody>
<tr><td>O(1)</td><td>常数（constant）</td><td>按下标取数组元素；循环赛公式</td></tr>
<tr><td>O(log n)</td><td>对数（logarithmic）</td><td>有序数组上的二分查找</td></tr>
<tr><td>O(n)</td><td>线性（linear）</td><td>线性查找；数组求和</td></tr>
<tr><td>O(n log n)</td><td>线性对数（n log n）</td><td>归并排序；快速排序的平均情况</td></tr>
<tr><td>O(n²)</td><td>平方（quadratic）</td><td>选择排序；列出所有两两配对</td></tr>
<tr><td>O(n³)</td><td>立方（cubic）</td><td>三重循环，如 Floyd-Warshall 全源最短路</td></tr>
<tr><td>O(2ⁿ)</td><td>指数（exponential）</td><td>枚举所有子集；汉诺塔</td></tr>
<tr><td>O(3ⁿ)</td><td>指数</td><td>每个元素有 3 种选择的全部方案，如 n 个任务各派给 3 台机器之一</td></tr>
<tr><td>O(n!)</td><td>阶乘（factorial）</td><td>枚举所有排列，如蛮力求旅行商路线</td></tr>
</tbody>
</table>
<p>要记住两点：<strong>2ⁿ 和 3ⁿ 不是同一级</strong>（指数的底数不同就是不同的级，理由见 1.6）；<strong>n! 比任何 cⁿ 都长得快</strong>。“级别”的精确定义是 Big-O 等记号，见 1.4。</p>

<h2>数循环：三种基本形状</h2>
<p>数循环只问一件事：<strong>最内层的语句一共执行几次？</strong></p>
<ul>
  <li><strong>单层循环</strong>，i 从 0 加到 n − 1：n 次（上面的求和）。</li>
  <li><strong>两层循环</strong>：内层次数与 i 无关时直接相乘，n × n = n²；内层从 i + 1 开始（循环赛）时是 n(n − 1)/2，约为一半，但仍是 n² 级。</li>
  <li><strong>翻倍循环</strong>：循环变量每轮乘 2，次数是 log₂ n 级。</li>
</ul>
<pre><code>for (int i = 0; i &lt; n; i++)        /* 两层：n × n 次 */
    for (int j = 0; j &lt; n; j++)
        count++;

for (int i = 1; i &lt;= n; i *= 2)    /* 翻倍：⌊log₂ n⌋ + 1 次 */
    count++;</code></pre>
<p>翻倍循环在 n = 20 时的执行过程：</p>
<pre><code class="lang-text">轮次    i    i &lt;= 20 ?
 1      1    是，count = 1
 2      2    是，count = 2
 3      4    是，count = 3
 4      8    是，count = 4
 5     16    是，count = 5
 -     32    否，结束</code></pre>
<p>共 5 次 = ⌊log₂ 20⌋ + 1 = 4 + 1。一般地，第 k + 1 轮时 i = 2ᵏ，循环一直跑到 2ᵏ &gt; n 为止，所以次数是 <strong>⌊log₂ n⌋ + 1</strong>。从 n 开始每轮 <code>i /= 2</code> 的减半循环也一样（n = 20：20, 10, 5, 2, 1，共 5 次）。判断方法：循环变量每轮<strong>加</strong>一个常数是 n 级，每轮<strong>乘或除</strong>一个常数是 log n 级。</p>

<h2>考试怎么考</h2>
<ul>
  <li><strong>排序题</strong>：给一串函数（可能带系数、常数项），按增长率从慢到快排列。做法：每个函数只留最高阶项、去掉系数，再对照阶梯。<strong>阶梯要背，公式表上没有</strong>。</li>
  <li><strong>数次数题</strong>：给一段循环，问某条语句执行几次、T(n) 是多少或属于哪一级。<strong>等差求和 n(n + 1)/2 与等比求和 (1 − rⁿ⁺¹)/(1 − r) 在公式表上</strong>，但把循环翻译成求和式要自己做。</li>
  <li><strong>归类题</strong>：给出 T(n)（如 4n + 3、n(n − 1)/2、2ⁿ − 1），说出属于哪一级：只看最高阶项。</li>
  <li><strong>概念题</strong>：为什么不用运行时间比较算法（机器不同、输入不同）；哪些算基本操作；只数主要操作。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>① <code>i *= 2</code> 或 <code>i /= 2</code> 的循环是 log n 级，不是 n 级。② 内层从 i + 1 开始的两层循环仍是 n² 级。③ 2ⁿ 和 3ⁿ 是不同的级；2²⁰ 这种与 n 无关的数是常数。④ 比的是 n 足够大以后：n = 10 时 1000 log₂ n ≈ 3322，比 n² = 100 大，但 n² 长得快。⑤ 数精确次数要看边界：把 <code>i &lt;= n</code> 改成 <code>i &lt; n</code>，n = 16 时翻倍循环从 5 次变成 4 次。⑥ 外层翻倍、内层跑到 i 的两层循环总次数不到 2n，是 n 级，不是 n log n（练习 2）。</p>
</div>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">1. 把下列函数按增长率从慢到快排列：n²，2²⁰，3ⁿ，50n，n log₂ n，1000 log₂ n，n!，0.001n³，2ⁿ。</summary>
  <div class="qa__body">
<p><strong>2²⁰ &lt; 1000 log₂ n &lt; 50n &lt; n log₂ n &lt; n² &lt; 0.001n³ &lt; 2ⁿ &lt; 3ⁿ &lt; n!</strong></p>
<p>2²⁰ ≈ 10⁶ 虽然大，但与 n 无关，是常数级，排最前。系数 1000、50、0.001 不改变级别，只改变“什么时候追上”：n log₂ n ÷ 50n = log₂ n / 50，n &gt; 2⁵⁰ 之后 n log₂ n 才更大，但比值会无限变大，所以它长得更快；0.001n³ 在 n &gt; 1000 之后超过 n²。3ⁿ ÷ 2ⁿ = 1.5ⁿ 无限变大，所以 3ⁿ 在 2ⁿ 之后；n! 最快。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">2. 对下面两段代码，分别求 n = 16 时 x++ 执行的次数、一般 n 时的次数，以及所属的级别。</summary>
  <div class="qa__body">
<pre><code>/* (a) */
for (int i = 0; i &lt; n; i++)
    for (int j = 1; j &lt;= n; j *= 2)
        x++;

/* (b) */
for (int i = 1; i &lt;= n; i *= 2)
    for (int j = 0; j &lt; i; j++)
        x++;</code></pre>
<p>(a) 内层是翻倍循环，j = 1, 2, 4, 8, 16，跑 5 次，与 i 无关；外层 16 次，共 16 × 5 = <strong>80</strong>。一般为 n(⌊log₂ n⌋ + 1)，<strong>n log n 级</strong>。</p>
<p>(b) 外层 i = 1, 2, 4, 8, 16，内层分别跑 1, 2, 4, 8, 16 次，共 <strong>31</strong>。一般地，设 k = ⌊log₂ n⌋，总次数是等比求和（r = 2）：</p>
<pre><code class="lang-text">1 + 2 + 4 + … + 2ᵏ = (1 − 2ᵏ⁺¹)/(1 − 2) = 2ᵏ⁺¹ − 1</code></pre>
<p>因为 2ᵏ ≤ n &lt; 2ᵏ⁺¹，总次数在 n 与 2n − 1 之间，是 <strong>n 级</strong>。外层虽然跑 log n 轮，但内层次数一轮比一轮翻倍，最后一轮就占了一半，不能写成 n × log n。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">3. 机器每秒执行 10⁹ 次操作，时限 1 小时。T(n) = 2ⁿ 和 T(n) = n² 的算法各能处理多大的 n？换一台快 1000 倍的机器呢？</summary>
  <div class="qa__body">
<p>1 小时能做 3600 × 10⁹ = 3.6 × 10¹² 次操作。</p>
<p>2ⁿ ≤ 3.6 × 10¹²：n ≤ log₂(3.6 × 10¹²) ≈ 41.7，所以 <strong>n = 41</strong>（2⁴¹ ≈ 2.2 × 10¹²，2⁴² ≈ 4.4 × 10¹² 超了）。快 1000 倍后是 3.6 × 10¹⁵，n ≤ 51.7，即 <strong>n = 51</strong>，只多了 10，因为 1000 ≈ 2¹⁰。</p>
<p>n² ≤ 3.6 × 10¹²：n ≤ √(3.6 × 10¹²) ≈ <strong>1.9 × 10⁶</strong>。快 1000 倍后 n ≤ √(3.6 × 10¹⁵) = <strong>6 × 10⁷</strong>，是原来的 √1000 ≈ 31.6 倍。</p>
<p>结论：对指数级算法，硬件快 1000 倍，n 只能加一个常数；改进算法的增长率才有用。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">4. 下列 T(n) 各属于阶梯上的哪一级？(a) 4n + 3；(b) n(n − 1)/2；(c) 2ⁿ − 1；(d) 100n + 0.01n²；(e) 5 log₂ n + 20；(f) 3。</summary>
  <div class="qa__body">
<p>(a) <strong>n</strong>，常数项和系数不影响级别。(b) 展开为 n²/2 − n/2，最高阶项是 n²，<strong>n²</strong>。(c) <strong>2ⁿ</strong>，减 1 不影响。(d) <strong>n²</strong>：n &lt; 10⁴ 时 100n 更大（n = 10⁴ 时两项都是 10⁶），之后 0.01n² 占主导，级别看的是 n 足够大以后。(e) <strong>log n</strong>。(f) <strong>常数，O(1)</strong>，就是循环赛公式的 3 次运算。</p>
  </div>
</details>
`;

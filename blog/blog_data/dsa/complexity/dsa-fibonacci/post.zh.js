/* Post body — dsa-fibonacci / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-fibonacci:zh'] = `
<p class="lead">斐波那契数（Fibonacci numbers）有三种算法：照定义直接递归，时间是指数级；记忆化（memoization）把算过的值存进数组，时间降到 O(n)，代价是 O(n) 额外空间；循环里只保留前两个数，O(n) 时间、O(1) 空间。三者答案相同，差别全在时间和空间上。</p>

<h2>定义与直接递归</h2>
<p><strong>F(0) = 0，F(1) = 1，F(n) = F(n−1) + F(n−2)（n ≥ 2）</strong>，每一项是前两项之和：0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, …。把定义直接翻译成 C：</p>

<pre><code>/* 算法 1：直接递归 */
long long fib_naive(int n) {
    if (n == 0) return 0;          /* 基本情况 */
    if (n == 1) return 1;          /* 基本情况 */
    return fib_naive(n - 1) + fib_naive(n - 2);
}</code></pre>

<p>它是<strong>正确</strong>的：两个基本情况加一条递归式，和定义一一对应。但它很慢，课上用它说明<strong>代码短不等于效率高</strong>。</p>

<h3>递归树：同一个子问题被算了很多遍</h3>
<p>以 fib(5) 为例：fib(5) 调用 fib(4) 和 fib(3)，fib(4) 又调用 fib(3) 和 fib(2)……每次调用画成一个结点，得到<strong>递归树（recursion tree）</strong>。树里 fib(3) 出现 2 次，fib(2) 3 次，fib(1) 5 次，fib(0) 3 次，加上 fib(5)、fib(4) 各 1 次，一共 <strong>15 次调用</strong>。不同的参数只有 0…5 这 6 个，其余 9 次都在重做已经做过的计算：fib(n−2) 既被 fib(n) 调用，又被 fib(n−1) 调用，越往下重复越多。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-fibonacci/anims/fib-tree.html" loading="lazy" style="height: 520px;" title="斐波那契递归树：直接递归与记忆化"></iframe>
<p class="anim-caption">逐步播放调用过程，可切换 n 和“直接递归 / 记忆化”。黄色结点是重复调用，实心绿色结点是查表直接返回；树上方一行是每个参数被调用的次数，记忆化模式下换成 memo 数组。</p>

<h2>数调用次数与操作次数</h2>
<p>设 C(n) 为 fib_naive(n) 的总调用次数。n ≤ 1 时只有自己这一次；n ≥ 2 时是自己一次，加上两个子调用各自的次数：</p>
<pre><code class="lang-text">C(0) = C(1) = 1
C(n) = C(n−1) + C(n−2) + 1
C:  1, 1, 3, 5, 9, 15, 25, 41, ...      （= 2F(n+1) − 1）</code></pre>

<p>课上数的是操作次数 T(n)。n ≥ 2 的一次调用自身做 3 个操作：比较 n == 0、比较 n == 1、一次加法；n = 0 只做 1 次比较，n = 1 做 2 次。取 T(0) = 1、T(1) = 2：</p>
<pre><code class="lang-text">T(n) = T(n−1) + T(n−2) + 3          (n ≥ 2)

T(2) = T(1) + T(0) + 3 = 2 + 1 + 3  = 6
T(3) = T(2) + T(1) + 3 = 6 + 2 + 3  = 11
T(4) = T(3) + T(2) + 3 = 11 + 6 + 3 = 20</code></pre>
<p>T(4) = 20 就是课上的结果。从小往大填表，<strong>每一层都要加上那个 3</strong>，漏掉就错。n 变大后：</p>

<table>
<thead><tr><th>n</th><th>F(n)</th><th>调用次数 C(n)</th><th>操作次数 T(n)</th></tr></thead>
<tbody>
<tr><td>5</td><td>5</td><td>15</td><td>34</td></tr>
<tr><td>10</td><td>55</td><td>177</td><td>408</td></tr>
<tr><td>20</td><td>6,765</td><td>21,891</td><td>50,546</td></tr>
<tr><td>30</td><td>832,040</td><td>2,692,537</td><td>6,217,113</td></tr>
<tr><td>50</td><td>≈ 1.26 × 10¹⁰</td><td>≈ 4.07 × 10¹⁰</td><td>≈ 9.40 × 10¹⁰</td></tr>
<tr><td>100</td><td>≈ 3.54 × 10²⁰</td><td>≈ 1.15 × 10²¹</td><td>≈ 2.65 × 10²¹</td></tr>
</tbody>
</table>
<p>按每秒 10⁹ 次操作算，n = 50 约需 94 秒，n = 100 约需 8.4 万年。</p>

<h3>为什么是指数级</h3>
<ul>
<li><strong>下界</strong>：fib_naive 的返回值全是基本情况返回的 1 加起来的（fib(0) 返回 0，不贡献）。要凑出 F(n)，fib(1) 必须被调用 F(n) 次，所以调用次数 ≥ F(n)。而 F(n) = F(n−1) + F(n−2) ≥ 2F(n−2)，每往后两项至少翻一倍，F(n) 至少按 (√2)ⁿ ≈ 1.41ⁿ 增长。</li>
<li><strong>上界</strong>：T 是递增的，T(n−2) ≤ T(n−1)，所以 T(n) ≤ 2T(n−1) + 3，每多一项最多翻一倍（再加 3），T(n) ∈ O(2ⁿ)。</li>
<li><strong>精确增长率</strong>：令 S(n) = T(n) + 3，代入得 S(n) = S(n−1) + S(n−2)，和斐波那契数满足同一个递推。所以 T(n) = 5F(n) + 4F(n−1) − 3（n ≥ 1），只是 F(n) 的常数倍（比值趋近约 7.47）。F(n) 每一项约是前一项的 1.618 倍（黄金比 φ），所以 T(n) ∈ Θ(1.618ⁿ)。</li>
</ul>

<div class="callout key" data-label="考点">
<p>直接递归的时间是<strong>指数级</strong>，写 <strong>O(2ⁿ)</strong> 即可；它<strong>不是 Θ(2ⁿ)</strong>：2ⁿ / 1.618ⁿ ≈ 1.236ⁿ 无界，指数的底数不同就是不同的复杂度类（见 1.6）。慢的根源是<strong>反复计算同一个子问题</strong>。</p>
<p>它没开数组，但递归最深 n 层（fib(n) → fib(n−1) → … → fib(1)），<strong>调用栈占 O(n) 空间</strong>，额外空间不是 O(1)。</p>
</div>

<h2>记忆化：每个 F(k) 只算一次</h2>
<p>修法是给递归配一张备忘表。单词是 <strong>memoization</strong>，来自 memo（备忘录），不是 memorization。数组 memo[0..n] 记录算过的 F(k)，−1 表示还没算。调用 fib(k) 时先查表：有值就直接返回；没有才递归计算，算完写进表里。</p>

<pre><code>/* 算法 2：记忆化（自顶向下） */
static long long memo_rec(int n, long long memo[]) {
    if (memo[n] == -1)                       /* 还没算过 */
        memo[n] = memo_rec(n - 1, memo) + memo_rec(n - 2, memo);
    return memo[n];                          /* 算过的直接查表，O(1) */
}

long long fib_memo(int n) {
    long long *memo = malloc((n + 1) * sizeof(*memo));
    assert(memo != NULL);
    for (int i = 0; i &lt;= n; i++)
        memo[i] = -1;
    memo[0] = 0;                             /* 基本情况预先放进表 */
    if (n &gt;= 1)
        memo[1] = 1;
    long long result = memo_rec(n, memo);
    free(memo);
    return result;
}</code></pre>

<p>算 fib(5) 的调用顺序是 5, 4, 3, 2, 1, 0, 1, 2, 3。先沿左边一路下到 fib(2)，它的两个子调用 fib(1)、fib(0) 查表，相加得 1，写进 memo[2]；回到 fib(3)，第二个子调用 fib(1) 查表；回到 fib(4)，fib(2) 查表；回到 fib(5)，fib(3) 查表。共 9 次调用：4 次真正做加法（k = 5, 4, 3, 2 各一次），5 次查表。一般地，n ≥ 1 时有 <strong>n − 1 次加法、2n − 1 次调用</strong>，时间 <strong>O(n)</strong>。</p>
<p>代价是空间：memo 数组 n + 1 格，递归深度 n，额外空间 <strong>O(n)</strong>。直接递归的调用栈本来也是 O(n)，两者额外空间同阶；记忆化多付出的是这张 n + 1 格的表，换来的是从指数级降到线性的时间。这种“多存一张表来省时间”叫<strong>时间–空间权衡（time–space trade-off）</strong>：用空间换时间。不用递归、从 f[0]、f[1] 开始用循环往上填数组（自底向上）也一样是 O(n) 时间、O(n) 空间，见练习 3。</p>

<h2>只记前两个数</h2>
<p>自底向上填表时，算 F(i) 只用到 F(i−1) 和 F(i−2)，更早的格子再也不会被读。所以整个数组可以换成两个变量：</p>

<pre><code>/* 算法 3：循环，只保留前两项 */
long long fib_iter(int n) {
    long long prev = 0, curr = 1;            /* F(0), F(1) */
    if (n == 0)
        return 0;
    for (int i = 2; i &lt;= n; i++) {
        long long next = prev + curr;        /* F(i) */
        prev = curr;
        curr = next;
    }
    return curr;
}</code></pre>

<p>fib_iter(7) 的变量变化（每行是一轮循环结束后的值）：</p>
<table>
<thead><tr><th>i</th><th>next = prev + curr</th><th>prev</th><th>curr</th></tr></thead>
<tbody>
<tr><td>开始</td><td>—</td><td>0</td><td>1</td></tr>
<tr><td>2</td><td>0 + 1 = 1</td><td>1</td><td>1</td></tr>
<tr><td>3</td><td>1 + 1 = 2</td><td>1</td><td>2</td></tr>
<tr><td>4</td><td>1 + 2 = 3</td><td>2</td><td>3</td></tr>
<tr><td>5</td><td>2 + 3 = 5</td><td>3</td><td>5</td></tr>
<tr><td>6</td><td>3 + 5 = 8</td><td>5</td><td>8</td></tr>
<tr><td>7</td><td>5 + 8 = 13</td><td>8</td><td>13</td></tr>
</tbody>
</table>
<p>返回 curr = 13 = F(7)。循环 n − 1 次，每次一次加法：时间 <strong>O(n)</strong>，额外空间 <strong>O(1)</strong>。斐波那契只依赖最近两项，所以这里不必拿空间换时间。</p>

<div class="callout warn" data-label="易错">
<p><strong>溢出</strong>：int（32 位，最大 2,147,483,647）在 F(47) = 2,971,215,073 就溢出；long long（64 位有符号）最多存到 F(92) = 7,540,113,804,746,346,429，F(93) 溢出。C 的有符号整数溢出是未定义行为（undefined behaviour），不报错，只给出错误的数。</p>
</div>

<h2>三种算法对比</h2>
<table>
<thead><tr><th>算法</th><th>时间</th><th>额外空间</th><th>算 fib(n) 的工作量（n ≥ 1）</th></tr></thead>
<tbody>
<tr><td>直接递归</td><td>指数级，O(2ⁿ)；紧确界 Θ(1.618ⁿ)</td><td>O(n)，调用栈</td><td>2F(n+1) − 1 次调用</td></tr>
<tr><td>记忆化</td><td>O(n)</td><td>O(n)，数组 + 调用栈</td><td>2n − 1 次调用，n − 1 次加法</td></tr>
<tr><td>两个变量的循环</td><td>O(n)</td><td>O(1)</td><td>n − 1 次加法</td></tr>
</tbody>
</table>

<h3>公式法也不是 O(1)</h3>
<p>F(n) 还有一个闭式公式（Binet 公式，<strong>不考</strong>），看上去一步就能算出 F(n)。但 F(n) 约有 0.21n 位十进制数字：F(100) 有 21 位，F(1000) 有 209 位，远超 long long，只能用大数运算（big-number arithmetic）。这时一次加法或乘方的代价随位数增长，不再是 1 个单位操作，公式法也就不是常数时间。课上由此强调：数操作次数时要盯住<strong>最贵的操作</strong>；“加法是 O(1)”只在数字能放进一个机器字时成立。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>数调用次数</strong>：fib_naive(n) 一共调用几次、某个 fib(k) 被调用几次。n ≤ 6 时画树最稳，也可以用 C(n) = C(n−1) + C(n−2) + 1 填表。fib(k)（k ≥ 1）在 fib(n) 里被调用 F(n−k+1) 次，例如 fib(1) 在 fib(5) 里被调用 F(5) = 5 次。</li>
<li><strong>按给定模型算 T(n)</strong>：题目给出 T(0)、T(1) 和每层的常数，从小往大逐行填，不要跳步。</li>
<li><strong>判断复杂度</strong>：每个版本的时间和空间（上面的对比表），常以单选或多选出现。</li>
<li><strong>短代码</strong>：写循环版或记忆化版，处理好 n = 0、n = 1 和 long long。</li>
<li>公式表（equation sheet）上没有这些内容，对比表和计数方法都要自己记住；Binet 公式不考。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li>拼写是 <strong>memoization</strong>。</li>
<li>直接递归 ∈ O(2ⁿ) 正确，∈ Θ(2ⁿ) 错误。</li>
<li>直接递归没开数组，但调用栈深 n，空间是 O(n)。</li>
<li>T(n) 数的是操作次数，不是 F(n) 的值；每层都要加常数。</li>
<li>记忆化的 O(n) 来自“每个 F(k) 只计算一次”，查表本身 O(1)。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. 对 fib_naive(6)：(a) 一共调用几次？(b) fib(2) 被调用几次？(c) 按 T(0) = 1，T(1) = 2，T(n) = T(n−1) + T(n−2) + 3，求 T(6)。</summary>
<div class="qa__body">
<p>(a) 用 C(n) = C(n−1) + C(n−2) + 1 从小往大填：C = 1, 1, 3, 5, 9, 15, 25，所以 <strong>25 次</strong>，与 2F(7) − 1 = 2 × 13 − 1 一致。</p>
<p>(b) 设 D(k) 为 fib(k) 被调用的次数。每个 fib(k+1) 调用 fib(k) 一次，每个 fib(k+2) 也调用 fib(k) 一次，所以 D(k) = D(k+1) + D(k+2)。D(6) = 1，D(5) = 1，D(4) = 1 + 1 = 2，D(3) = 2 + 1 = 3，D(2) = 3 + 2 = <strong>5</strong>，即 F(5)。</p>
<p>(c) T(2) = 6，T(3) = 11，T(4) = 20，T(5) = T(4) + T(3) + 3 = 20 + 11 + 3 = 34，T(6) = 34 + 20 + 3 = <strong>57</strong>。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 用上文的 fib_memo 计算 fib(6)（memo[0]、memo[1] 预先填好）。写出 memo_rec 的调用顺序，并数出总调用次数、加法次数和查表返回的次数。</summary>
<div class="qa__body">
<p>先沿左孩子一路向下：6, 5, 4, 3, 2。fib(2) 的两个子调用 1、0 都查表，memo[2] = 1。然后逐层返回，每层的第二个子调用都已在表里：fib(3) 调用 1（查表），memo[3] = 2；fib(4) 调用 2（查表），memo[4] = 3；fib(5) 调用 3（查表），memo[5] = 5；fib(6) 调用 4（查表），memo[6] = 8。</p>
<p>调用顺序：<strong>6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4</strong>。共 <strong>11 次</strong>调用（= 2 × 6 − 1）；<strong>5 次</strong>加法（k = 6, 5, 4, 3, 2）；<strong>6 次</strong>查表（参数 1, 0, 1, 2, 3, 4）。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 写函数 long long fib_table(int n)：用数组自底向上（从 f[0]、f[1] 开始循环填表）求 F(n)，n ≥ 0。给出时间和额外空间复杂度。</summary>
<div class="qa__body">
<pre><code>long long fib_table(int n) {
    if (n == 0)
        return 0;                    /* 数组只有 1 格时不能写 f[1] */
    long long *f = malloc((n + 1) * sizeof(*f));
    assert(f != NULL);
    f[0] = 0;
    f[1] = 1;
    for (int i = 2; i &lt;= n; i++)
        f[i] = f[i - 1] + f[i - 2];
    long long result = f[n];
    free(f);
    return result;
}</code></pre>
<p>循环 n − 1 次，每次一次加法：时间 <strong>O(n)</strong>。数组 n + 1 格：额外空间 <strong>O(n)</strong>。没有递归，所以没有调用栈开销；若只留最近两格，就是 fib_iter 的 O(1) 空间。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 多选：下列哪些说法正确？A. fib_naive(n) 的运行时间 ∈ O(2ⁿ)　B. fib_naive(n) 的运行时间 ∈ Θ(2ⁿ)　C. fib_naive 不用数组，所以额外空间是 O(1)　D. fib_memo 的时间是 O(n)，额外空间是 O(n)　E. fib_iter 的时间是 O(n)，额外空间是 O(1)　F. 用闭式公式可以在 O(1) 时间内对任意 n 精确算出 F(n)</summary>
<div class="qa__body">
<p>选 <strong>A、D、E</strong>。</p>
<ul>
<li>B 错：真实增长率约 1.618ⁿ，2ⁿ / 1.618ⁿ 无界，2ⁿ 只是上界，不是紧确界。</li>
<li>C 错：递归深度 n，调用栈占 O(n)。</li>
<li>F 错：F(n) 约有 0.21n 位，大数的加法和乘方代价随位数增长，不是常数时间。</li>
</ul>
</div>
</details>
`;

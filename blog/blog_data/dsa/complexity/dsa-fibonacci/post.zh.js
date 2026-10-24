/* Post body — dsa-fibonacci / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-fibonacci:zh'] = `
<p class="lead">同一个斐波那契数，三种算法：直接递归要指数级时间；记忆化（memoization）降到 O(n) 时间，多用 O(n) 空间；只记前两个数的循环是 O(n) 时间、O(1) 空间。</p>

<h2>从一个场景说起</h2>
<p>设想一间办公室有条规矩：谁被问到“第 k 个斐波那契数是多少”，都不自己算，而是转身去问两个同事“第 k−1 个是多少”“第 k−2 个是多少”，把两个答案加起来报回去。只有被问到第 0 个、第 1 个的人可以直接回答 0 和 1。</p>
<p>答案一定是对的。麻烦在于<strong>没人记笔记</strong>：小王刚问过第 3 个，过一会儿小李又来问第 3 个，下面一串人又从头忙一遍。数越大，重复跑腿越多。</p>
<p>改法有两种：在白板上写下每个算好的答案，再有人问就先看白板；或者干脆不分派，一个人从 0、1 往上加，手里只攥着最近两个数。原来的规矩加上这两种改法，正好是三种算法。</p>

<h2>它是什么</h2>
<p>斐波那契数（Fibonacci numbers）的定义：<strong>F(0) = 0，F(1) = 1，F(n) = F(n−1) + F(n−2)（n ≥ 2）</strong>。简单说，每一项是前两项之和：0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, …</p>
<p>把定义原样翻译成 C，就是第一种算法，直接递归：</p>
<pre><code>long long fib_naive(int n) {
    if (n == 0) return 0;          /* 基本情况 */
    if (n == 1) return 1;          /* 基本情况 */
    return fib_naive(n - 1) + fib_naive(n - 2);
}</code></pre>
<p>前两个 if 是基本情况（base case），对应办公室里能直接回答的那两个人；最后一行是递归情况（recursive case），对应“转身问两个同事再相加”。它和定义一一对应，所以是<strong>正确</strong>的。但课上正是用它说明：<strong>代码短不等于效率高</strong>。</p>
<p>另外两种算法对应场景里的两个改法：<strong>记忆化（memoization）</strong>配一张表当白板，每个 F(k) 只算一次（这个词来自 memo，备忘录，<strong>不是 memorization</strong>）；<strong>循环</strong>从小往大算，只保留前两个数。</p>

<h2>看个例子：fib(5) 调用了几次</h2>
<p>fib(5) 调用 fib(4) 和 fib(3)，fib(4) 又调用 fib(3) 和 fib(2)……把每次调用画成一个结点，就得到一棵<strong>递归树（recursion tree）</strong>。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-fibonacci/anims/fib-tree.html" loading="lazy" style="height: 520px;" title="斐波那契递归树：直接递归与记忆化"></iframe>
<p class="anim-caption">先选 n = 5、“直接递归”逐步播放：黄色结点是重复调用，树上方一行是每个参数被调用的次数。再切到“记忆化”对比，实心绿色结点是查表直接返回。</p>

<p>数一数树里的结点：fib(5)、fib(4) 各 1 次，fib(3) 2 次，fib(2) 3 次，fib(1) 5 次，fib(0) 3 次，一共 <strong>15 次调用</strong>。不同的参数只有 0…5 这 6 个，另外 9 次全是重复：fib(n−2) 既被 fib(n) 调用，又被 fib(n−1) 调用，越往下重复越多。</p>

<h3>用式子数调用次数</h3>
<p>树一大就容易数错，这时列递推式。设 C(n) 是 fib_naive(n) 的总调用次数：n ≤ 1 时只有自己 1 次；否则是自己 1 次加上两个子调用各自的次数。</p>
<pre><code class="lang-text">C(0) = C(1) = 1
C(n) = C(n−1) + C(n−2) + 1
C:  1, 1, 3, 5, 9, 15, 25, 41, ...      （= 2F(n+1) − 1）</code></pre>

<h3>课上数的操作次数 T(n)</h3>
<p>n ≥ 2 的一次调用自己做 3 个操作：比较 n == 0、比较 n == 1、一次加法。n = 0 只比较 1 次，n = 1 比较 2 次，所以 T(0) = 1、T(1) = 2：</p>
<pre><code class="lang-text">T(n) = T(n−1) + T(n−2) + 3          (n ≥ 2)
T(2) = T(1) + T(0) + 3 = 2 + 1 + 3  = 6
T(3) = T(2) + T(1) + 3 = 6 + 2 + 3  = 11
T(4) = T(3) + T(2) + 3 = 11 + 6 + 3 = 20</code></pre>
<p>T(4) = 20 就是课上的结果。从小往大一行一行填，<strong>每一行都要加那个 3</strong>。n 一变大，数字就爆炸了：</p>
<table>
<thead><tr><th>n</th><th>F(n)</th><th>调用次数 C(n)</th><th>操作次数 T(n)</th></tr></thead>
<tbody>
<tr><td>10</td><td>55</td><td>177</td><td>408</td></tr>
<tr><td>20</td><td>6,765</td><td>21,891</td><td>50,546</td></tr>
<tr><td>30</td><td>832,040</td><td>2,692,537</td><td>6,217,113</td></tr>
<tr><td>50</td><td>≈ 1.26 × 10¹⁰</td><td>≈ 4.07 × 10¹⁰</td><td>≈ 9.40 × 10¹⁰</td></tr>
<tr><td>100</td><td>≈ 3.54 × 10²⁰</td><td>≈ 1.15 × 10²¹</td><td>≈ 2.65 × 10²¹</td></tr>
</tbody>
</table>
<p>按每秒 10⁹ 次操作算，n = 50 约要 94 秒，n = 100 约要 8.4 万年。</p>

<h2>记忆化：每个 F(k) 只算一次</h2>
<p>直接递归慢，根源是<strong>反复计算同一个子问题</strong>。修法就是那块白板：开一个数组 memo[0..n]，−1 表示“还没算”。调用 fib(k) 时先查表，有值就直接返回；没有才递归去算，算完写进表里。</p>
<pre><code>long long memo_rec(int n, long long memo[]) {
    if (memo[n] == -1)                       /* 还没算过 */
        memo[n] = memo_rec(n - 1, memo) + memo_rec(n - 2, memo);
    return memo[n];                          /* 查表，O(1) */
}

long long fib_memo(int n) {
    long long *memo = malloc((n + 1) * sizeof(*memo));
    assert(memo != NULL);
    for (int i = 0; i &lt;= n; i++) memo[i] = -1;
    memo[0] = 0;                             /* 基本情况先放进表 */
    if (n &gt;= 1) memo[1] = 1;
    long long result = memo_rec(n, memo);
    free(memo);
    return result;
}</code></pre>
<ul>
<li>memo_rec 的 if：memo[n] 还是 −1，说明没算过，这时才递归算两个子问题，结果写进 memo[n]。</li>
<li>memo_rec 的 return：不管是刚算的还是早就算好的，都返回表里的值。</li>
<li>fib_memo：malloc 一个 n + 1 格的数组，全填 −1，再把基本情况 memo[0]、memo[1] 预先放进去。n = 0 时数组只有 1 格，所以写 memo[1] 前要先判断。最后 free 掉。</li>
</ul>
<p>用它算 fib(5)，调用顺序是 <strong>5, 4, 3, 2, 1, 0, 1, 2, 3</strong>。先沿左边一路下到 fib(2)，它的子调用 fib(1)、fib(0) 查表，相加得 1，写进 memo[2]。然后逐层返回，每层的第二个子调用都已在表里：fib(3) 查 fib(1)，fib(4) 查 fib(2)，fib(5) 查 fib(3)。</p>
<p>共 9 次调用：4 次做加法（k = 5, 4, 3, 2），5 次查表。一般地，n ≥ 1 时是 <strong>n − 1 次加法、2n − 1 次调用</strong>，时间 <strong>O(n)</strong>。</p>
<p>代价是空间：表有 n + 1 格，递归最深 n 层，额外空间 <strong>O(n)</strong>。多存一张表来省时间，叫<strong>时间–空间权衡（time–space trade-off）</strong>。不用递归、从 f[0]、f[1] 用循环往上填数组（自底向上，bottom-up）也是 O(n) 时间、O(n) 空间。</p>

<h2>循环：只记前两个数</h2>
<p>自底向上填表时会发现，算 F(i) 只用到 F(i−1) 和 F(i−2)，更早的格子再也不会被读。所以整张表可以换成两个变量：</p>
<pre><code>long long fib_iter(int n) {
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
<p>prev 和 curr 始终是“前一项”和“当前项”，开始时是 F(0) 和 F(1)。每轮先算 next = prev + curr，也就是 F(i)；然后两个变量一起往前挪一格：prev 拿 curr 的值，curr 拿 next 的值。n = 0 要单独返回，不然循环一次都不跑，会返回 curr 的初值 1。</p>
<p>fib_iter(7) 每轮结束后的变量：</p>
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
<p>返回 curr = 13 = F(7)。循环 n − 1 次，每次一次加法：时间 <strong>O(n)</strong>，额外空间 <strong>O(1)</strong>。</p>

<h2>补充：复杂度与溢出</h2>
<h3>直接递归为什么是指数级</h3>
<ul>
<li><strong>上界</strong>：T(n−2) ≤ T(n−1)，所以 T(n) ≤ 2T(n−1) + 3，每多一项最多翻一倍，T(n) ∈ O(2ⁿ)。</li>
<li><strong>真实增长率</strong>：令 S(n) = T(n) + 3，代入得 S(n) = S(n−1) + S(n−2)，和斐波那契数是同一个递推。所以 T(n) 只是 F(n) 的常数倍（比值趋近约 7.47）。F(n) 每一项约是前一项的 1.618 倍（黄金比 φ），所以 T(n) ∈ Θ(1.618ⁿ)。</li>
</ul>
<div class="callout key" data-label="考点">
<p>直接递归是<strong>指数级</strong>，写 <strong>O(2ⁿ)</strong> 对；写 <strong>Θ(2ⁿ) 错</strong>：2ⁿ / 1.618ⁿ ≈ 1.236ⁿ 无界，指数的底数不同就是不同的复杂度类（见 1.6）。</p>
<p>它没开数组，但递归最深 n 层（fib(n) → fib(n−1) → … → fib(1)），<strong>调用栈占 O(n) 空间</strong>，额外空间不是 O(1)。</p>
</div>

<h3>三种算法对比</h3>
<table>
<thead><tr><th>算法</th><th>时间</th><th>额外空间</th><th>工作量（n ≥ 1）</th></tr></thead>
<tbody>
<tr><td>直接递归</td><td>O(2ⁿ)；紧确界 Θ(1.618ⁿ)</td><td>O(n)，调用栈</td><td>2F(n+1) − 1 次调用</td></tr>
<tr><td>记忆化</td><td>O(n)</td><td>O(n)，数组 + 调用栈</td><td>2n − 1 次调用，n − 1 次加法</td></tr>
<tr><td>两个变量的循环</td><td>O(n)</td><td>O(1)</td><td>n − 1 次加法</td></tr>
</tbody>
</table>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/vYquumk4nWw" title="What Is Dynamic Programming and How To Use It" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：CS Dojo《What Is Dynamic Programming and How To Use It》（英文，约 14 分钟，Python），用斐波那契演示直接递归、记忆化和自底向上填表。视频从 fib(1) = fib(2) = 1 开始数，本课是 F(0) = 0、F(1) = 1。</p>

<h3>溢出，以及公式法</h3>
<div class="callout warn" data-label="易错">
<p>int（32 位）到 F(47) = 2,971,215,073 就溢出；long long（64 位有符号）最多存到 F(92) = 7,540,113,804,746,346,429，F(93) 溢出。有符号整数溢出是未定义行为（undefined behaviour），不报错，只给出错的数。</p>
</div>
<p>F(n) 还有一个闭式公式（Binet 公式，<strong>不考</strong>）。但 F(n) 约有 0.21n 位数字，F(1000) 就有 209 位，只能用大数运算，加法、乘方的代价随位数增长，所以公式法也不是 O(1)：<strong>“加法是 O(1)”只在数字放得进一个机器字时成立</strong>。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>数调用次数</strong>：一共调用几次，某个 fib(k) 被调用几次。n ≤ 6 时画树最稳，也可以用 C(n) 填表。fib(k)（k ≥ 1）在 fib(n) 里被调用 F(n−k+1) 次。</li>
<li><strong>按给定模型算 T(n)</strong>：题目给出 T(0)、T(1) 和每层的常数，从小往大逐行填。</li>
<li><strong>判断复杂度</strong>：三种算法的时间和空间，常考单选、多选。</li>
<li><strong>写短代码</strong>：循环版或记忆化版，处理好 n = 0、n = 1，用 long long。</li>
</ul>
<p>公式表（equation sheet）上没有这些，要自己记。</p>

<h3>例题 1：数调用和操作</h3>
<p>对 fib_naive(6)：(a) 一共调用几次？(b) fib(2) 被调用几次？(c) 按 T(0) = 1，T(1) = 2，T(n) = T(n−1) + T(n−2) + 3，求 T(6)。</p>
<p>(a) 用 C(n) = C(n−1) + C(n−2) + 1 从小往大填：C = 1, 1, 3, 5, 9, 15, 25，所以是 <strong>25 次</strong>，和 2F(7) − 1 = 2 × 13 − 1 一致。</p>
<p>(b) 设 D(k) 是 fib(k) 被调用的次数。每个 fib(k+1) 会调用 fib(k) 一次，每个 fib(k+2) 也会调用 fib(k) 一次，所以 D(k) = D(k+1) + D(k+2)。从上往下填：D(6) = 1，D(5) = 1，D(4) = 2，D(3) = 3，D(2) = <strong>5</strong>，正好是 F(6−2+1) = F(5)。</p>
<p>(c) 接着上面的 T(4) = 20 往下填：T(5) = 20 + 11 + 3 = 34，T(6) = 34 + 20 + 3 = <strong>57</strong>。</p>

<h3>例题 2：多选判断</h3>
<p>下列哪些正确？A. fib_naive(n) 的时间 ∈ O(2ⁿ)；B. fib_naive(n) 的时间 ∈ Θ(2ⁿ)；C. fib_naive 不用数组，所以额外空间是 O(1)；D. fib_memo 的时间是 O(n)，额外空间是 O(n)；E. fib_iter 的时间是 O(n)，额外空间是 O(1)；F. 用闭式公式能在 O(1) 时间内对任意 n 精确算出 F(n)。</p>
<p>答案是 <strong>A、D、E</strong>。B 错：真实增长率约 1.618ⁿ，2ⁿ 只是上界，不是紧确界。C 错：递归深度 n，调用栈占 O(n)。F 错：F(n) 约有 0.21n 位，大数运算的代价随位数增长。</p>

<div class="callout warn" data-label="易错">
<p>拼写是 <strong>memoization</strong>；T(n) 数的是操作次数，不是 F(n) 的值，每一层都要加常数。</p>
</div>

<h2>小结</h2>
<ul>
<li>定义：F(0) = 0，F(1) = 1，F(n) = F(n−1) + F(n−2)。</li>
<li>直接递归正确但慢：同一个子问题反复算，fib(5) 调用 15 次；时间 O(2ⁿ)（不是 Θ(2ⁿ)），调用栈 O(n)。</li>
<li>课上的操作次数模型：T(0) = 1，T(1) = 2，T(n) = T(n−1) + T(n−2) + 3，T(4) = 20。</li>
<li>记忆化（memoization）：每个 F(k) 只算一次，O(n) 时间、O(n) 空间，是时间–空间权衡。</li>
<li>只记前两个数的循环：O(n) 时间、O(1) 空间；long long 最多到 F(92)。</li>
</ul>
`;

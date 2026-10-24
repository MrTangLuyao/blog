/* Post body — dsa-counting-sort / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-counting-sort:zh'] = `
<p class="lead">计数排序（distribution counting，也叫 counting sort、distribution sort）从不比较两个元素：先数出每个值出现几次，再按值从小到大写回。它要求键是已知小范围内的整数，时间 O(n + K)，额外空间 O(K)，K 是值域的大小。</p>

<h2>例子：读数只有 1 到 9</h2>
<p>课上的场景：温度传感器每分钟给出一个<strong>整数</strong>读数，几年下来有几百万个值，但每个值都在 1 到 9 之间。选择排序、插入排序当然能排，可既然只有 9 种可能的值，数一数有几个 1、几个 2……再照着个数写回去就够了。取 10 个读数：</p>
<pre><code class="lang-text">A = 3 1 4 1 5 9 2 6 5 3        n = 10，值域 1..9，K = 9</code></pre>
<p><strong>第 1 步</strong>，开一个长度 K = 9 的计数数组 count，全部置 0。C 的下标从 0 开始，所以值 v 的个数记在 count[v − 1]。</p>
<p><strong>第 2 步</strong>，从左到右扫描 A 一次，读到值 v 就执行 count[v − 1]++。扫描结束后：</p>
<table>
<thead><tr><th>值 v</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th></tr></thead>
<tbody><tr><td>count[v − 1]</td><td>2</td><td>1</td><td>2</td><td>1</td><td>2</td><td>1</td><td>0</td><td>0</td><td>1</td></tr></tbody>
</table>
<p>计数之和 2 + 1 + 2 + 1 + 2 + 1 + 0 + 0 + 1 = 10 = n，每个元素恰好数了一次。</p>
<p><strong>第 3 步</strong>，按 v = 1, 2, …, 9 的顺序，把值 v 连续写 count[v − 1] 次，直接覆盖 A：两个 1、一个 2、两个 3、一个 4、两个 5、一个 6，7 和 8 的计数是 0，跳过，最后一个 9。</p>
<pre><code class="lang-text">A = 1 1 2 3 3 4 5 5 6 9</code></pre>
<p>全程没有出现“A[i] 和 A[j] 谁大”的比较，结果的顺序来自计数数组下标本身的顺序。</p>

<div class="callout key" data-label="考点">
<p>计数排序是本课程<strong>唯一的非比较排序（non-comparison sort）</strong>。选择、插入、快速、归并、堆排序都靠两两比较决定先后，课上的结论是<strong>任何比较排序的平均情况都不可能好于 n log n</strong>。计数排序不做比较，不受这条下界限制，K 小时是线性时间。</p>
</div>

<iframe class="anim-frame" src="blog/blog_data/dsa-counting-sort/anims/counting.html" loading="lazy" style="height: 520px;" title="计数排序：计数、写回与记录的稳定放置"></iframe>
<p class="anim-caption">「整数」：读数逐个落进对应的桶，计数器加 1，再按桶的顺序覆盖 A，对应下面的 C 代码。「记录」：先算出每个键的起始位置，再把记录逐条放进 out，留意同键记录的字母顺序。</p>

<h2>C 实现</h2>
<p>键是整数，范围 [lo, hi] 事先已知。<code>count[A[i] - lo]</code> 把值平移到下标 0 … K−1，所以值域不从 0 开始、含负数也照样能用。</p>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

/* Sort A[0..n-1]. Every key is an integer in [lo, hi]; K = hi - lo + 1. */
void counting_sort(int A[], int n, int lo, int hi) {
    int K = hi - lo + 1;
    int i, v, c, pos = 0;
    int *count = calloc(K, sizeof(int));    /* K counters, all 0: O(K) */
    if (count == NULL) {
        exit(EXIT_FAILURE);
    }
    for (i = 0; i &lt; n; i++) {               /* 1. count: O(n) */
        count[A[i] - lo]++;                 /* key v is counted in count[v - lo] */
    }
    for (v = 0; v &lt; K; v++) {               /* 2. rebuild: O(n + K) */
        for (c = 0; c &lt; count[v]; c++) {
            A[pos++] = v + lo;              /* write key v+lo, count[v] times */
        }
    }
    free(count);
}

int main(void) {
    int A[] = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3};
    int n = 10, i;
    counting_sort(A, n, 1, 9);              /* readings are 1..9: K = 9 */
    for (i = 0; i &lt; n; i++) {
        printf("%d ", A[i]);
    }
    printf("\\n");
    return 0;
}</code></pre>
<pre><code class="lang-text">1 1 2 3 3 4 5 5 6 9</code></pre>
<p>写回是两层循环，但<strong>不是 O(nK)</strong>：外层走 K 次，内层在所有 v 上合计只执行 count[0] + count[1] + … + count[K−1] = n 次，加起来是 O(n + K)。</p>

<h2>复杂度与性质</h2>
<ul>
<li><strong>时间 O(n + K)</strong>：calloc 置零 O(K)，计数扫描 O(n)，写回 O(n + K)。不管输入怎样排列，这三步完全一样，所以 best = average = worst = Θ(n + K)，<strong>不是自适应（adaptive）的</strong>：已经有序的输入也要全部数一遍。</li>
<li><strong>额外空间 O(K)</strong>：只有计数数组，大小取决于值域而不是 n。本课程对原地（in-place）的定义是额外空间严格为 O(1)，O(K) 不满足，所以计数排序<strong>不是原地排序</strong>。</li>
<li><strong>K 是值域大小 hi − lo + 1</strong>，不是实际出现的不同值的个数：例子里 7、8 一次都没出现，它们的计数器照样要开、要检查。</li>
<li><strong>什么时候比比较排序快</strong>：n = 10⁶ 个读数、K = 9 时，n + K ≈ 10⁶，而 n log₂ n ≈ 2 × 10⁷，n² = 10¹²。只要 K = O(n)，总时间就是 O(n)。</li>
</ul>

<h2>什么时候不能用</h2>
<ul>
<li><strong>实数键</strong>：读数若是 1 到 9 之间的实数，可能的取值有无穷多个，没法给每个值开一个计数器，计数排序根本用不上。</li>
<li><strong>值域巨大</strong>：1000 个整数，取值在 1 到 999 999 999 999 之间，K ≈ 10¹²。每个计数器只占 1 字节也要约 1 TB 内存（RAM，不是硬盘）；即使开得出来，n + K ≈ 10¹² 也远慢于 n log₂ n ≈ 10⁴。</li>
</ul>
<p>能用的条件归结为三条：键是整数（或能一一对应到小整数），范围事先知道，K 不比 n 大太多。</p>

<h2>排序记录：起始位置与稳定性</h2>
<p>上面的写回只适用于裸整数，因为写回时只需要值本身。实际要排的常是记录（例如读数连同时间戳），键相同的两条记录内容不同，必须把记录本身搬到位。课上的正式描述是：对记录（键加指向记录的指针）按键计数，再把它们重新分配到排好序的位置，没有展开怎么分配。常用做法是把计数换成每个键在输出里的<strong>起始位置</strong>：</p>
<ol>
<li>按键计数，与整数版本相同。</li>
<li>从小到大累加：start[v] = 所有比 v 小的键的计数之和，即键 v 的第一条记录在输出中的下标。</li>
<li>从左到右扫描输入，把 A[i] 放进 out[start[键]]，再把这个 start 加 1。</li>
</ol>
<p>例子：6 条记录，数字是键，字母代表记录的其余部分，同时标出原始顺序。</p>
<pre><code class="lang-text">记录 A   3a  1b  3c  2d  1e  2f
count    键 1: 2    键 2: 2    键 3: 2
start    键 1: 0    键 2: 2    键 3: 4        (0, 0+2, 0+2+2)
放置     3a→4  1b→0  3c→5  2d→2  1e→1  2f→3   (每放一条，该键的 start 加 1)
out      1b  1e  2d  2f  3a  3c</code></pre>
<p>同一个键的记录占据输出中连续的一段，扫描时先遇到的先放，所以它们的相对顺序与输入一致：这个版本是<strong>稳定（stable）</strong>的。代价是多一个长度 n 的输出数组，额外空间变成 O(n + K)。下面的代码让计数和起始位置共用一个数组：</p>
<pre><code>typedef struct {
    int key;            /* integer in [lo, hi] */
    char tag;           /* stands for the rest of the record */
} record_t;

/* Stable: copies A[0..n-1] into out[0..n-1] in key order. */
void counting_sort_records(const record_t A[], record_t out[], int n,
                           int lo, int hi) {
    int K = hi - lo + 1, i, v, c, sum = 0;
    int *start = calloc(K, sizeof(int));
    if (start == NULL) {
        exit(EXIT_FAILURE);
    }
    for (i = 0; i &lt; n; i++) {               /* 1. count each key */
        start[A[i].key - lo]++;
    }
    for (v = 0; v &lt; K; v++) {               /* 2. count -&gt; first free index */
        c = start[v];
        start[v] = sum;                     /* = number of keys smaller than v+lo */
        sum += c;
    }
    for (i = 0; i &lt; n; i++) {               /* 3. scan left to right */
        out[start[A[i].key - lo]++] = A[i];
    }
    free(start);
}</code></pre>

<div class="callout note" data-label="注意">
<p>课上没有讨论计数排序是否稳定。被问到时答“稳定”，并给出理由：同键记录按输入顺序放进连续的格子。只排裸整数时相等的值无法区分，谈不上稳定与否。</p>
</div>

<h2>考试怎么考</h2>
<ul>
<li><strong>追踪（trace）</strong>：给数组和值域，写出扫描后的 count 数组和排序结果。注意下标偏移，值域从 lo 开始时值 v 记在 count[v − lo]。问“比较了几次”时答 0。</li>
<li><strong>用 n 和 K 写复杂度</strong>：时间 O(n + K)，额外空间 O(K)（记录版本 O(n + K)）。只写 O(n) 要先说明 K = O(n)；写 O(nK) 是被嵌套循环骗了。</li>
<li><strong>场景选择</strong>（各种排序的对比见 5.9 怎么选排序算法）：大量小范围整数，如 0 到 100 的考试分数、1 到 9 的读数 → 计数排序；实数键或值域巨大 → 不能用，改用比较排序。答题要写出理由：整数、范围已知、K 小。</li>
<li><strong>性质判断</strong>：非原地（O(K) 取决于值域）、非比较、非自适应；稳定性按起始位置版本答稳定。</li>
<li><strong>要自己记住</strong>：本篇内容公式表上都没有，比较排序的 n log n 下界也没有。</li>
<li><strong>陷阱</strong>：2016 年期末有一道题问自底向上归并排序的额外空间，题干顺带给出元素的值域 r。r 与比较排序无关，答 O(n)；只有计数排序的复杂度里会出现值域。</li>
</ul>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. 读数为 5 3 6 3 2 5 5 4，已知都是 2 到 6 之间的整数，调用 counting_sort(A, 8, 2, 6)。(a) K 是多少？(b) 逐个写出扫描时 count 的变化和最终的 count[0..4]。(c) 写回后的 A 是什么？(d) 元素之间比较了几次？</summary>
<div class="qa__body">
<p>(a) K = 6 − 2 + 1 = 5，值 v 记在 count[v − 2]。</p>
<p>(b) 每读一个值，只改它对应的那个计数器：</p>
<pre><code class="lang-text">读 5 → count[3] = 1     count = 0 0 0 1 0
读 3 → count[1] = 1     count = 0 1 0 1 0
读 6 → count[4] = 1     count = 0 1 0 1 1
读 3 → count[1] = 2     count = 0 2 0 1 1
读 2 → count[0] = 1     count = 1 2 0 1 1
读 5 → count[3] = 2     count = 1 2 0 2 1
读 5 → count[3] = 3     count = 1 2 0 3 1
读 4 → count[2] = 1     count = 1 2 1 3 1</code></pre>
<p>最终 count = [1, 2, 1, 3, 1]，和为 8 = n。常见错误是忘了减 lo，把值 5 记进 count[5]，越界。</p>
<p>(c) 按 v = 2 … 6 写回：一个 2、两个 3、一个 4、三个 5、一个 6，A = 2 3 3 4 5 5 5 6。</p>
<p>(d) 0 次。只有计数器加 1 和写回，没有任何两个元素之间的比较。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 下面三种情况能否直接用计数排序？能用的给出 K 和大致的操作数，不能用的说明原因。(a) 2 000 000 个考试分数，都是 0 到 100 的整数。(b) 1000 个 9 位学号，范围 0 到 999 999 999。(c) 100 000 个 double 类型的温度，范围 −10.0 到 45.0。</summary>
<div class="qa__body">
<p>(a) 能用，K = 101。时间约 n + K ≈ 2 × 10⁶ 步，额外空间只有 101 个计数器；比较排序平均也要 n log n 量级，n log₂ n ≈ 4.2 × 10⁷。</p>
<p>(b) 不该用。K = 10⁹，计数器用 int 就要约 4 GB 内存；时间 n + K ≈ 10⁹，而 n log₂ n ≈ 10⁴。应该用快速排序或归并排序。</p>
<p>(c) 不能直接用：double 的取值不是有限的小整数集合，无法给每个可能的值开计数器。若题目说明读数只保留一位小数，可以先换算成 −100 到 450 的整数（乘 10），K = 551，这时就又能用了。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 多选：关于课上的整数版计数排序，哪些说法正确？(A) 它是原地排序。(B) 输入已经有序时比随机输入快。(C) 额外空间只取决于值域 K，与 n 无关。(D) 它的时间可以低于 n log n，因为它从不比较两个元素。(E) 写回阶段是两层嵌套循环，所以时间是 O(nK)。</summary>
<div class="qa__body">
<p>正确的是 <strong>C、D</strong>。</p>
<ul>
<li>(A) 错：计数数组占 O(K)，超过常数。</li>
<li>(B) 错：不是自适应，任何输入都是计数 n 次、检查 K 个计数器、写回 n 次。</li>
<li>(C) 对：额外空间就是长度 K 的计数数组（排记录时另需 O(n) 的输出数组）。</li>
<li>(D) 对：n log n 是比较排序的下界，计数排序不受它约束；K = O(n) 时是 O(n)。</li>
<li>(E) 错：内层循环在所有 v 上合计执行 n 次，总共 O(n + K)。</li>
</ul>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 把记录版本的第 3 步改成从右往左扫描（仍然是 out[start[键]++]），对 3a 1b 3c 2d 1e 2f 排序。结果是什么？还稳定吗？如果一定要从右往左扫，怎么改才稳定？</summary>
<div class="qa__body">
<p>start 仍是 键 1: 0、键 2: 2、键 3: 4。从右往左依次放：2f → out[2]，1e → out[0]，2d → out[3]，3c → out[4]，1b → out[1]，3a → out[5]。结果 1e 1b 2f 2d 3c 3a：按键排好了，但每一对同键记录都颠倒了，<strong>不稳定</strong>。</p>
<p>修正：改用结束位置 end[v] = 键不超过 v 的记录个数（键 1: 2、键 2: 4、键 3: 6），从右往左扫描，执行 <code>out[--end[键]] = A[i]</code>，同键中最后出现的记录占这一段的最后一格。依次：2f → out[3]，1e → out[1]，2d → out[2]，3c → out[5]，1b → out[0]，3a → out[4]，结果 1b 1e 2d 2f 3a 3c，稳定。不少教材写的就是这种形式，与正文的做法等价。</p>
</div>
</details>
`;

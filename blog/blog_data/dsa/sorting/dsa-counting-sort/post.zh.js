/* Post body — dsa-counting-sort / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-counting-sort:zh'] = `
<p class="lead">计数排序（distribution counting）从不比较两个元素：先数出每个值出现了几次，再按值从小到大照着次数写回去。它只能排范围小、事先已知的整数，时间 O(n + K)，K 是值域的大小。</p>

<h2>从一个场景说起</h2>
<p>班里选班长，三个候选人，40 张票。唱票的同学不会拿两张选票比“谁大谁小”，而是在黑板上写好三个名字，每念一张就在对应名字下画一笔“正”字。念完，每人几票一目了然。</p>
<p>要是再把选票按名字排好呢？已知张三 15 票、李四 9 票、王五 16 票，直接摆出 15 张张三、9 张李四、16 张王五就行，一次比较都不用。</p>
<p>课上的场景也一样：温度传感器每分钟给一个<strong>整数</strong>读数，几年下来几百万个，但都在 1 到 9 之间。只有 9 种可能的值，与其两两比较，不如给每个值画“正”字。</p>

<h2>它是什么</h2>
<p>简单说，<strong>计数排序就是先数每个值有几个，再按值从小到大、照着个数写回去。</strong>课上叫它 distribution counting，很多教材叫 counting sort。</p>
<p>它由三部分组成，正好对上唱票：</p>
<ul>
<li><strong>计数数组（count array）</strong>：每个可能的值配一个计数器，共 K 个；K = hi − lo + 1 是值域大小，lo、hi 是最小、最大的可能值。这就是黑板上写好的名字。</li>
<li><strong>计数（counting）</strong>：从左到右扫一遍输入，读到值 v，就把 v 的计数器加 1。这就是画“正”字。</li>
<li><strong>写回（rebuild）</strong>：按值从小到大，把每个值连续写“计数”那么多次，覆盖原数组。这就是照票数摆选票。</li>
</ul>
<p>所以它能用的前提有三条：键是<strong>整数</strong>（或能一一对应到小整数），<strong>范围事先知道</strong>（才知道开几个计数器），并且 <strong>K 不比 n 大太多</strong>。</p>
<div class="callout key" data-label="考点">
<p>计数排序是本课程<strong>唯一的非比较排序（non-comparison sort）</strong>。选择、插入、快速、归并、堆排序都靠两两比较决定先后，课上的结论是<strong>任何比较排序的平均情况都不可能好于 n log n</strong>。计数排序不做比较，不受这条下界限制，K 小时是线性时间。</p>
</div>

<h2>看个例子</h2>
<p>取 10 个读数，都在 1 到 9 之间：</p>
<pre><code class="lang-text">A = 3 1 4 1 5 9 2 6 5 3        n = 10，lo = 1，hi = 9，K = 9</code></pre>
<p><strong>第 1 步：开计数数组。</strong>开一个长度 9 的数组 count，全部置 0。C 的下标从 0 开始，而最小值是 1，所以值 v 的个数记在 count[v − 1]：值 1 记在 count[0]，值 9 记在 count[8]。</p>
<p><strong>第 2 步：计数。</strong>从左到右读 A。读到 3，count[2] 从 0 变成 1；读到 1，count[0] 变成 1；读到 4，count[3] 变成 1；又读到 1，count[0] 变成 2……每读一个数，只动它自己的那个计数器。10 个读完：</p>
<table>
<thead><tr><th>值 v</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th></tr></thead>
<tbody><tr><td>count[v − 1]</td><td>2</td><td>1</td><td>2</td><td>1</td><td>2</td><td>1</td><td>0</td><td>0</td><td>1</td></tr></tbody>
</table>
<p>核对一下：2 + 1 + 2 + 1 + 2 + 1 + 0 + 0 + 1 = 10 = n，每个元素恰好数了一次。</p>
<p><strong>第 3 步：写回。</strong>按 v = 1, 2, …, 9 的顺序，把 v 连续写 count[v − 1] 次，直接覆盖 A：两个 1、一个 2、两个 3、一个 4、两个 5、一个 6；7 和 8 的计数是 0，什么也不写；最后一个 9。</p>
<pre><code class="lang-text">A = 1 1 2 3 3 4 5 5 6 9</code></pre>
<p>整个过程没有一次“A[i] 和 A[j] 谁大”的比较。那顺序是哪来的？来自计数数组的下标本身：count[0] 排在 count[1] 前面，所以 1 自然写在 2 前面。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-counting-sort/anims/counting.html" loading="lazy" style="height: 520px;" title="计数排序：计数、写回与记录的稳定放置"></iframe>
<p class="anim-caption">选「整数」：读数一个个落进对应的桶，计数器加 1，再按桶的顺序覆盖 A，和上面三步一一对应。「记录」模式对应后面的“排序记录”一节。</p>

<h3>C 代码</h3>
<p>考试可能让你读或写这段。键是 [lo, hi] 里的整数：</p>
<pre><code>/* Sort A[0..n-1]; every key is an integer in [lo, hi]. */
void counting_sort(int A[], int n, int lo, int hi) {
    int K = hi - lo + 1;
    int i, v, c, pos = 0;
    int *count = calloc(K, sizeof(int));   /* K counters, all 0 */
    if (count == NULL) {
        exit(EXIT_FAILURE);
    }
    for (i = 0; i &lt; n; i++) {              /* 1. count */
        count[A[i] - lo]++;
    }
    for (v = 0; v &lt; K; v++) {              /* 2. rebuild */
        for (c = 0; c &lt; count[v]; c++) {
            A[pos++] = v + lo;
        }
    }
    free(count);
}</code></pre>
<p>逐行看：</p>
<ul>
<li><code>K = hi - lo + 1</code>：值域里有几个可能的值，就开几个计数器。例子里 K = 9 − 1 + 1 = 9。</li>
<li><code>calloc(K, sizeof(int))</code>：开 K 个 int 并<strong>全部置 0</strong>（malloc 不清零）。返回 NULL 说明内存不够，直接退出。</li>
<li>第一个循环 <code>count[A[i] - lo]++</code>：减 lo 把值平移到下标 0 … K−1，例子里值 3 记在 count[2]。值域不从 0 开始、甚至含负数都照样能用：lo = −5 时，值 −5 记在 count[0]。</li>
<li>第二个循环：v 从 0 走到 K−1，下标 v 代表的值是 v + lo，把它写 count[v] 次。<code>pos</code> 是下一个要写的位置，每写一个加 1。</li>
<li>最后 <code>free</code> 掉计数数组。</li>
</ul>
<p>例子的调用是 <code>counting_sort(A, 10, 1, 9)</code>。</p>

<h2>复杂度：为什么是 O(n + K)</h2>
<p>写回是两层循环，但不是 O(nK)：外层把 K 个计数器各看一次，内层合计执行 count[0] + count[1] + … + count[K−1] = n 次。就像检查 K 个桶，空桶看一眼就走，非空的桶把东西倒出来，一共倒出 n 个。</p>
<p>三步加起来：calloc 置零 O(K)，计数 O(n)，写回 O(n + K)，<strong>总时间 O(n + K)</strong>。</p>
<ul>
<li><strong>最好 = 平均 = 最坏 = Θ(n + K)</strong>：不管输入怎么排，三步做的事完全一样。所以它<strong>不是自适应（adaptive）</strong>的，已经排好的输入也要从头数一遍。</li>
<li><strong>额外空间 O(K)</strong>：就是那个计数数组，大小看值域，不看 n。课上原地（in-place）的定义是额外空间 O(1)，O(K) 不满足，所以<strong>不是原地排序</strong>。</li>
<li><strong>K 是值域大小 hi − lo + 1，不是实际出现了几种值</strong>：例子里 7、8 一次都没出现，它们的计数器照样要开、要检查。</li>
<li><strong>K 小时比比较排序快得多</strong>：n = 10⁶ 个读数、K = 9 时，n + K ≈ 10⁶，而 n log₂ n ≈ 2 × 10⁷。只要 K = O(n)，总时间就是 O(n)。</li>
</ul>

<h2>什么时候不能用</h2>
<ul>
<li><strong>实数键</strong>：读数如果是 1 到 9 之间的实数，可能的值有无穷多个，没法给每个值开计数器。</li>
<li><strong>值域巨大</strong>：1000 个整数，取值在 1 到 999 999 999 999 之间，K ≈ 10¹²。每个计数器只占 1 字节也要约 1 TB 内存（RAM，不是硬盘）；就算开得出来，n + K ≈ 10¹² 也远慢于 n log₂ n ≈ 10⁴。</li>
</ul>
<p>这两种情况都改用快速排序、归并排序这类比较排序。</p>

<h2>补充：排序记录与稳定性</h2>
<p>上面的写回只适合排“裸”整数，因为 3 就是 3。实际要排的常是记录（record），比如读数连同时间戳：两条键都是 3 的记录内容不同，没法凭计数“造”出来，得把记录本身搬到位。</p>
<p>课上只说按键计数、再把记录分配到排好的位置，没展开怎么分配。常用做法是算出每个键在输出里的<strong>起始位置</strong>：就像按年级排队，已知一年级 2 人、二年级 2 人，三年级就从第 5 个位置（下标 4）开始站。</p>
<ol>
<li>按键计数，和整数版一样。</li>
<li>从小到大累加：start[v] = 所有比 v 小的键的个数，也就是键 v 的第一条记录在输出里的下标。</li>
<li>从左到右扫描输入，把 A[i] 放进 out[start[键]]，再把这个 start 加 1。</li>
</ol>
<p>例子：6 条记录，数字是键，字母代表记录的其余部分，同时标出原来的先后。</p>
<pre><code class="lang-text">记录 A   3a  1b  3c  2d  1e  2f
count    键 1: 2    键 2: 2    键 3: 2
start    键 1: 0    键 2: 2    键 3: 4        (0, 0+2, 0+2+2)
放置     3a→4  1b→0  3c→5  2d→2  1e→1  2f→3   (每放一条，该键的 start 加 1)
out      1b  1e  2d  2f  3a  3c</code></pre>
<p>同一个键的记录占输出里连续的一段，扫描时先遇到的先放，所以它们的相对顺序和输入一样：这个版本是<strong>稳定（stable）</strong>的。代价是多一个长度 n 的输出数组 out，额外空间变成 O(n + K)。</p>
<div class="callout note" data-label="注意">
<p>课上没有讨论计数排序稳不稳定。被问到就答“稳定”，并给出上面的理由；只排裸整数时，相等的值分不出谁是谁，谈不上稳定与否。</p>
</div>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/OKd534EWcdk" title="Learn Counting Sort Algorithm in LESS THAN 6 MINUTES!" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：CS Dojo《Learn Counting Sort Algorithm in LESS THAN 6 MINUTES!》（英文，约 6 分钟），一步步演示计数排序。场景是按年龄给一万个人排序，排的是记录，对应上面的记录版本；下标写法可能不同，结果一样。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>手算追踪（trace）</strong>：给数组和值域，写出 count 数组和结果。问比较次数答 0。</li>
<li><strong>选择 / 填空写复杂度</strong>：时间 O(n + K)，额外空间 O(K)（记录版本 O(n + K)）。只写 O(n) 要先说明 K = O(n)。</li>
<li><strong>场景选择</strong>（对比见 5.9 怎么选排序算法）：大量小范围整数，如 0 到 100 的分数 → 计数排序；实数键或值域巨大 → 不能用。要写理由：整数、范围已知、K 小。</li>
<li><strong>性质判断（多选）</strong>：非比较、非原地、非自适应；稳定性答稳定。</li>
</ul>
<p>这些公式表上都没有，n log n 下界也没有，要自己记。</p>

<h3>例题 1：手算</h3>
<p>读数为 5 3 6 3 2 5 5 4，都是 2 到 6 之间的整数，调用 <code>counting_sort(A, 8, 2, 6)</code>。写出 K、计数过程、最终的 count[0..4] 和排序结果。</p>
<p>K = 6 − 2 + 1 = 5，值 v 记在 count[v − 2]。每读一个值，只改它对应的那个计数器：</p>
<pre><code class="lang-text">读 5 → count[3] = 1     count = 0 0 0 1 0
读 3 → count[1] = 1     count = 0 1 0 1 0
读 6 → count[4] = 1     count = 0 1 0 1 1
读 3 → count[1] = 2     count = 0 2 0 1 1
读 2 → count[0] = 1     count = 1 2 0 1 1
读 5 → count[3] = 2     count = 1 2 0 2 1
读 5 → count[3] = 3     count = 1 2 0 3 1
读 4 → count[2] = 1     count = 1 2 1 3 1</code></pre>
<p>最终 count = [1, 2, 1, 3, 1]，和为 8 = n。按 v = 2 … 6 写回：一个 2、两个 3、一个 4、三个 5、一个 6，A = 2 3 3 4 5 5 5 6。元素之间比较了 0 次。</p>

<h3>例题 2：多选</h3>
<p>关于课上的整数版计数排序，哪些说法正确？(A) 它是原地排序。(B) 输入已经有序时比随机输入快。(C) 额外空间只取决于值域 K，与 n 无关。(D) 它的时间可以低于 n log n，因为它从不比较两个元素。(E) 写回阶段是两层嵌套循环，所以时间是 O(nK)。</p>
<p>答案是 <strong>C、D</strong>。</p>
<ul>
<li>(A) 错：计数数组占 O(K)，超过常数。</li>
<li>(B) 错：不是自适应，任何输入都是计数 n 次、检查 K 个计数器、写回 n 次。</li>
<li>(C) 对：额外空间就是长度 K 的计数数组。</li>
<li>(D) 对：n log n 只是比较排序的下界；K = O(n) 时它是 O(n)。</li>
<li>(E) 错：内层循环合计只执行 n 次，总共 O(n + K)。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>① 忘了减 lo：例题 1 里把 5 记进 count[5]，越界。② 被两层循环骗成 O(nK)。③ 把 K 当成“出现了几种值”。④ 2016 年期末问自底向上归并排序的额外空间，题干顺带给了值域 r。r 与比较排序无关，答 O(n)；只有计数排序的复杂度里才有值域。</p>
</div>

<h2>小结</h2>
<ul>
<li>开 K 个计数器，扫一遍计数，再按值从小到大照数写回；值 v 记在 count[v − lo]。</li>
<li>只用于范围小、事先已知的整数；实数键、值域巨大时不能用。</li>
<li>时间 O(n + K)（不是 O(nK)），最好、平均、最坏都一样，不是自适应的。</li>
<li>额外空间 O(K)，不是原地；排记录多一个输出数组，变成 O(n + K)，并且稳定。</li>
<li>本课程唯一的非比较排序，不受 n log n 下界限制。</li>
</ul>
`;

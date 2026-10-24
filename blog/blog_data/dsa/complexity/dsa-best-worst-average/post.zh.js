/* Post body — dsa-best-worst-average / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-best-worst-average:zh'] = `
<p class="lead">同样是 n 个元素，目标在第一个还是最后一个，顺序查找的比较次数能差 n 倍。<strong>最好、最坏、平均情况</strong>回答“在规模为 n 的输入里挑哪一类”，O、Ω、Θ 回答“给一个函数什么界”。两件事互相独立：每种情况各是一个 n 的函数，各有自己的 Θ。</p>

<h2>同样的 n，不同的输入</h2>
<p>在 n 个元素里做<strong>顺序查找（sequential / linear search）</strong>：从 A[0] 开始逐个比较，相等就停。只数比较次数：</p>
<ul>
<li>目标是 A[0]：1 次。这是<strong>最好情况（best case）</strong>。</li>
<li>目标是最后一个，或者根本不在数组里：n 次。这是<strong>最坏情况（worst case）</strong>。</li>
<li>目标是 A[k−1]：k 次。</li>
</ul>
<p><strong>平均情况（average case）</strong>按课上的做法算：列出所有可能的情况，次数加起来，再除以情况数。假设目标一定在数组里、落在每个位置的可能性相同，n 种情况的次数是 1, 2, …, n，用公式表上的等差数列求和：</p>
<pre><code class="lang-text">T_avg(n) = (1 + 2 + … + n) / n = [n(n+1)/2] / n = (n+1)/2</code></pre>
<p>n = 15 时是 8。平均值依赖对输入分布的假设，没有特别说明就按“目标存在、各位置等可能”算。</p>
<p>于是同一个算法有三个函数：<strong>T_best(n)</strong> 是所有规模为 n 的输入里最少的操作次数，<strong>T_worst(n)</strong> 是最多的，<strong>T_avg(n)</strong> 是按假定分布求的平均，始终有 T_best(n) ≤ T_avg(n) ≤ T_worst(n)。注意 <strong>n 是固定的</strong>：最好情况比较的是同样大小的输入里哪种排列最省，“n = 1 时最快”不是最好情况。</p>

<h2>把三种情况数出来</h2>
<p>下面的程序给顺序查找和<strong>二分查找（binary search）</strong>加上比较计数器，让目标依次落在 15 个位置上，求最少、最多和平均，再查一个不存在的键。二分查找按课上的约定：每看一个 A[mid] 记 1 次比较，剩偶数个元素时取靠右的中间（n = 15 时每段都是奇数个，取整方向不影响结果）。</p>
<pre><code>#include &lt;stdio.h&gt;

/* 顺序查找：返回 key 的下标，没有就返回 -1；*cmp 累加比较次数 */
int linear_search(const int A[], int n, int key, int *cmp) {
    for (int i = 0; i &lt; n; i++) {
        (*cmp)++;                         /* 看一个元素 = 1 次比较 */
        if (A[i] == key) return i;
    }
    return -1;
}

/* 二分查找（A 升序）：每看一个 A[mid] 记 1 次比较 */
int binary_search(const int A[], int n, int key, int *cmp) {
    int lo = 0, hi = n - 1;
    while (lo &lt;= hi) {
        int mid = (lo + hi + 1) / 2;      /* 偶数个时取靠右的中间 */
        (*cmp)++;
        if (key == A[mid]) return mid;
        if (key &lt; A[mid]) hi = mid - 1;
        else              lo = mid + 1;
    }
    return -1;
}

#define N 15

int main(void) {
    int A[N];
    for (int i = 0; i &lt; N; i++) A[i] = 2 * (i + 1);    /* 2, 4, ..., 30 */

    for (int alg = 0; alg &lt; 2; alg++) {
        int best = N + 1, worst = 0, total = 0;
        for (int i = 0; i &lt; N; i++) {          /* 目标依次放在每个位置 */
            int c = 0;
            if (alg == 0) linear_search(A, N, A[i], &amp;c);
            else          binary_search(A, N, A[i], &amp;c);
            if (c &lt; best)  best = c;
            if (c &gt; worst) worst = c;
            total += c;
        }
        printf("%s: best %d, worst %d, average %d/%d = %.2f\\n",
               alg == 0 ? "linear" : "binary", best, worst, total, N,
               (double)total / N);
    }

    int cl = 0, cb = 0;                       /* 17 不在数组里 */
    linear_search(A, N, 17, &amp;cl);
    binary_search(A, N, 17, &amp;cb);
    printf("absent 17: linear %d, binary %d\\n", cl, cb);
    return 0;
}</code></pre>
<pre><code class="lang-text">linear: best 1, worst 15, average 120/15 = 8.00
binary: best 1, worst 4, average 49/15 = 3.27
absent 17: linear 15, binary 4</code></pre>
<p>二分查找的最好情况也是 1 次：第一次看的中间元素 A[7] 正好是目标。每次没找到都丢掉一半，所以最坏情况是 <strong>⌊log₂ n⌋ + 1</strong> 次（n = 15 时为 4）。15 个位置里 1 个要 1 次、2 个要 2 次、4 个要 3 次、8 个要 4 次，合计 49。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-best-worst-average/anims/search-race.html" loading="lazy" style="height: 460px;" title="顺序查找 vs 二分查找"></iframe>
<p class="anim-caption">拖动滑块选目标，或切到“不在数组里”，再按播放：两边每帧各比较一次。试试 A[0]、A[7]、A[14]。</p>

<h2>情况和界是两回事</h2>
<p>选定一种情况，得到的就是一个普通函数，照常给它 O、Ω、Θ：</p>
<table>
<thead><tr><th></th><th>最好情况</th><th>平均情况（目标存在）</th><th>最坏情况</th></tr></thead>
<tbody>
<tr><td>顺序查找</td><td>1 → Θ(1)</td><td>(n+1)/2 → Θ(n)</td><td>n → Θ(n)</td></tr>
<tr><td>二分查找</td><td>1 → Θ(1)</td><td>约 log₂ n − 1 → Θ(log n)</td><td>⌊log₂ n⌋ + 1 → Θ(log n)</td></tr>
</tbody>
</table>
<p>每一格都是“某一种情况”的紧确界。所以 <strong>Big-O 不等于最坏情况，Ω 不等于最好情况，Θ 也不等于平均情况</strong>。“顺序查找的最坏情况是 Ω(n)”完全成立，意思是最坏的输入至少要比较约 n 次；“顺序查找的最好情况是 O(n)”也成立，只是这个上界太松。</p>

<h3>不指明情况的说法</h3>
<p>题目只说“算法的运行时间是 …”而不说哪种情况时，这句话必须对<strong>每一个</strong>输入成立：</p>
<ul>
<li>“运行时间是 O(g)”：每个输入都不超过 c·g(n)，等价于<strong>最坏情况</strong> ∈ O(g)。</li>
<li>“运行时间是 Ω(g)”：每个输入都至少 c·g(n)，等价于<strong>最好情况</strong> ∈ Ω(g)。</li>
<li>“运行时间是 Θ(g)”：两条都要成立，即<strong>最好和最坏情况都属于 Θ(g)</strong>。</li>
</ul>
<p>二分查找最好 Θ(1)、最坏 Θ(log n)，所以 O(log n) 对，O(n) 也对（松），Ω(1) 对，<strong>Θ(log n) 错</strong>：下界到不了 log n，运气好 1 次就结束。顺序查找同理，是 O(n) 和 Ω(1)，但不是 Θ(n)。要写 Θ(log n) 就得带上情况：“二分查找的<strong>最坏情况</strong>是 Θ(log n)”。</p>
<div class="callout key" data-label="考点">
<p>课上小测出过、期末复习时又重放的题：在 n 个元素的有序数组上做二分查找，关于运行时间哪一项<strong>不正确</strong>？答案是 <strong>Θ(log n)</strong>。O(n)、Ω(1) 看着别扭，但都对。</p>
</div>
<p>平均情况和最坏情况同属一类时（如上表）一般不单独提；不同类时才要单独给出，例如快速排序平均 Θ(n log n)、最坏 Θ(n²)（见 5.6 快速排序：复杂度、pivot 选择与性质）。</p>

<h2>两步操作的最好情况：在 X 后面插入</h2>
<p>有序数组和有序链表各存 n 个不同的元素，要在一个已存在的元素 X <strong>紧后面</strong>插入新元素，数组末尾有空位、不用扩容。数组：二分查找 X，再把 X 后面的元素都右移一格。链表：从头往后找 X，再改两根指针。</p>
<p>数组两步各自的最好情况是：查找 1 次（X 在正中间），移动 0 个（X 是最后一个）。加起来是 Θ(1)？<strong>错，两个最好情况要求的 X 不是同一个。</strong>最好情况是对同一个输入把两步代价相加，再在所有输入里取最小。用 15 个元素 2, 4, …, 30 实算：</p>
<table>
<thead><tr><th>X</th><th>下标</th><th>二分比较</th><th>右移元素</th><th>合计</th></tr></thead>
<tbody>
<tr><td>16</td><td>7</td><td>1</td><td>7</td><td>8</td></tr>
<tr><td>2</td><td>0</td><td>4</td><td>14</td><td>18</td></tr>
<tr><td>28</td><td>13</td><td>3</td><td>1</td><td>4</td></tr>
<tr><td>30</td><td>14</td><td>4</td><td>0</td><td>4</td></tr>
</tbody>
</table>
<p>15 个 X 全部算过，合计最小是 4（X = 28 或 30），最大是 18（X = 2）。X 在中间时查找最省，却要挪一半元素；想少挪，X 就得靠近末尾，而二分查找要折半约 log₂ n 次才走得到末尾。于是让代价大的一步（移动，可达 Θ(n)）取最好情况，代价小的一步（查找，至多 Θ(log n)）付全价：<strong>有序数组的最好情况是 Θ(log n)</strong>，此时 X 是最后一个元素。</p>
<p>有序链表只能从头往后找。X 是头结点时 1 次比较，接上新结点 O(1)，<strong>最好情况 Θ(1)</strong>。</p>
<table>
<thead><tr><th></th><th>最好情况</th><th>最坏情况</th></tr></thead>
<tbody>
<tr><td>有序数组</td><td>X 是最后一个：Θ(log n)</td><td>X 是第一个：Θ(n)（右移 n−1 个）</td></tr>
<tr><td>有序链表</td><td>X 是头结点：Θ(1)</td><td>X 是尾结点：Θ(n)（走 n 个结点）</td></tr>
</tbody>
</table>
<p>两者最坏情况都是 O(n)。一般规律：两步的最好情况直接相加只会<strong>低估</strong>，必须找同一个输入；两步的最坏情况直接相加只会高估，用来写 O 上界不会错。</p>

<h2>二分查找一定比顺序查找少吗</h2>
<p>常见的判断题：有序数组用二分查找，未排序数组（同样 n 个元素，n 很大）用顺序查找，“二分查找的比较次数<strong>总是</strong>更少”对不对？</p>
<ul>
<li><strong>目标在数组里：错。</strong>目标恰好是未排序数组的第一个元素时，顺序查找只要 1 次；二分查找除非目标正是有序数组的中间元素，否则至少 2 次。上面 n = 15 的数据里，目标是前 3 个元素时顺序查找都更少（1 比 4、2 比 3、3 比 4）。</li>
<li><strong>目标不在数组里：对。</strong>未排序数组没法提前停，顺序查找必须比完 n 个；二分查找至多 ⌊log₂ n⌋ + 1 次就能断定不在（n = 15 时恒为 4 次），n ≥ 3 时这比 n 小。</li>
</ul>

<h2>考试怎么考</h2>
<ul>
<li><strong>“哪一项不正确”</strong>：列出二分查找（或顺序查找）的几个 O/Ω/Θ 说法。不带情况的 Θ(log n)、Θ(n) 不成立，O(n)、Ω(1) 这类松的界成立。先看清写的是 O 还是 Ω。</li>
<li><strong>两步操作的最好 / 最坏情况</strong>：在 X 后插入、删除 X、按序插入新键……对同一个输入把各步代价相加，再取最小或最大。结论要记住：在 X 后插入，有序数组最好 Θ(log n)、有序链表最好 Θ(1)，最坏都是 O(n)。</li>
<li><strong>判断题</strong>：二分 vs 顺序，目标存在时“总是更少”为假，目标不存在时为真。</li>
<li>往年卷的短答题常问“某操作的时间复杂度，用 big-O 给最紧上界”（有的写明 worst case）：先找最坏输入，再写它所在的类，例如往 n 个元素的有序链表插入一个元素答 O(n)。</li>
<li>要背：顺序查找 1 / (n+1)/2 / n；二分查找最好 1、最坏 ⌊log₂ n⌋ + 1。等差数列求和在公式表上，平均情况的推导要会写。</li>
<li>陷阱：把“n 很小”当成最好情况；把 O 当最坏、Ω 当最好；题目说“任意一棵 BST”而没说平衡，查找最坏要答 O(n)（见 3.3 二叉搜索树：查找、插入与退化）。</li>
</ul>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. 在 n 个元素的未排序数组上顺序查找（目标可能不在）。哪些说法正确？(A) 运行时间是 O(n)；(B) 运行时间是 Θ(n)；(C) 最坏情况是 Θ(n)；(D) 最好情况是 O(n)；(E) 运行时间是 Ω(n)。</summary>
<div class="qa__body">
<p><strong>A、C、D 正确。</strong></p>
<p>A：每个输入至多比较 n 次，最坏情况 ∈ O(n)，所以运行时间 O(n)。C：最坏情况恰好 n 次，Θ(n)。D：最好情况 1 次，1 ≤ n，成立但很松，紧确的写法是 Θ(1)。</p>
<p>B 和 E 错：不带情况的 Θ(n) 或 Ω(n) 要求每个输入都至少约 n 次，而最好情况 1 次就结束，只有 Θ(1)。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">2. 有序数组 A[0..6] = 2, 4, 6, 8, 10, 12, 14 用二分查找，目标存在且各位置等可能。(1) 目标在每个下标时各比较几次？(2) 最好、最坏、平均各是多少？(3) 同一数组上顺序查找的平均次数是多少，哪些位置顺序查找更少？</summary>
<div class="qa__body">
<p>(1) 第 1 次看 A[3] = 8。目标更小就在 [0, 2] 里看 A[1]，更大就在 [4, 6] 里看 A[5]；第 3 次看剩下的单个元素。每段都是奇数个，取整方向不影响。</p>
<pre><code class="lang-text">下标     0  1  2  3  4  5  6
比较次数 3  2  3  1  3  2  3</code></pre>
<p>(2) 最好 1 次（目标是 8），最坏 3 次 = ⌊log₂ 7⌋ + 1，平均 (1 + 2×2 + 3×4) / 7 = 17/7 ≈ 2.43。</p>
<p>(3) 顺序查找平均 (7+1)/2 = 4。下标 0 处顺序查找更少（1 比 3）；下标 1、2 一样多（2 比 2、3 比 3）；其余位置二分查找更少。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">3. 往 n 个不同元素的有序数组里插入一个新键 k（k 原本不在数组里，末尾有空位）：先用二分查找找插入位置，再把该位置及之后的元素右移一格。最好和最坏情况各是什么？为什么最好情况不是 Θ(1)？</summary>
<div class="qa__body">
<p>k 不在数组里，二分查找每次都要把范围缩到空才停，不会出现“第一次就命中”。比较次数对每个 k 都在 ⌊log₂ n⌋ 到 ⌊log₂ n⌋ + 1 之间，查找这一步永远是 Θ(log n)。</p>
<p><strong>最好情况</strong>：k 比所有元素都大，放在末尾，不用移动，Θ(log n) + 0 = <strong>Θ(log n)</strong>。</p>
<p><strong>最坏情况</strong>：k 比所有元素都小，n 个元素全部右移，Θ(log n) + Θ(n) = <strong>Θ(n)</strong>。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">4. 某算法在规模为 n 的输入上最好情况 Θ(n)、最坏情况 Θ(n²)。判断对错：(A) 运行时间是 O(n²)；(B) 运行时间是 Ω(n)；(C) 运行时间是 Θ(n²)；(D) 最坏情况是 Ω(n²)；(E) 最好情况出现在 n = 1 时；(F) 平均情况一定在 Ω(n) 和 O(n²) 之间。</summary>
<div class="qa__body">
<p>A 对：最坏情况 ∈ O(n²)，每个输入都不超过它。B 对：最好情况 ∈ Ω(n)，每个输入都不低于它。</p>
<p>C 错：最好情况只有约 n，运行时间的下界到不了 n²。</p>
<p>D 对：最坏情况本身是 Θ(n²)，当然也是 Ω(n²)。Ω 也可以用来描述最坏情况。</p>
<p>E 错：最好情况是固定 n 之后最省的那类输入，与 n 的大小无关。</p>
<p>F 对：T_best(n) ≤ T_avg(n) ≤ T_worst(n)。插入排序就是这样的算法（见 5.3 插入排序）。</p>
</div>
</details>
`;

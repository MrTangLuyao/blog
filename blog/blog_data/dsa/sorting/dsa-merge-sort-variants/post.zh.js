/* Post body — dsa-merge-sort-variants / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-merge-sort-variants:zh'] = `
<p class="lead">自底向上归并排序（bottom-up merge sort）不做拆分，把每个元素看作长度为 1 的有序段，按宽度 1、2、4、8… 两两合并，用循环实现，仍是 Θ(n log n)。自适应归并排序（adaptive merge sort）从输入里本来就有序的段出发，已排序的输入扫描一遍就结束，最好情况 Θ(n)。</p>

<h2>自底向上：宽度 1、2、4、… 两两合并</h2>
<p>自顶向下的归并排序（见 5.7）一路递归拆到长度为 1 的子数组，真正的排序工作全在回程的合并里。自底向上直接从最底层开始：每个元素单独算一个有序段，称为 <strong>run</strong>；每一<strong>轮（pass）</strong>把相邻两个 run 合并成一个，run 的宽度从 1 翻倍到 2、4、8…，直到只剩一个 run。用循环实现，不需要递归。</p>
<p>以 7 个元素 [6, 3, 8, 1, 5, 2, 7] 为例，<code>|</code> 是 run 的边界：</p>
<pre><code class="lang-text">下标        0   1   2   3   4   5   6
输入        6 | 3 | 8 | 1 | 5 | 2 | 7      7 个 run
宽度 1 后   3   6 | 1   8 | 2   5 | 7      合并 3 次，[7] 轮空
宽度 2 后   1   3   6   8 | 2   5   7      合并 2 次
宽度 4 后   1   2   3   5   6   7   8      合并 1 次</code></pre>
<ul>
<li>第 1 轮合并 (6, 3)、(8, 1)、(5, 2)。第 7 个元素没有搭档，<strong>不合并，原样留到下一轮</strong>（轮空）。</li>
<li>第 2 轮把 [3 6] 和 [1 8] 合成 [1 3 6 8]；[2 5] 和 [7] 也要合并：<strong>右边的 run 可以比左边短，只要存在就合并</strong>。</li>
</ul>
<p>一般规则：宽度为 w 的一轮，lo 从 0 开始每次加 2w。若 <strong>lo + w &lt; n</strong>，右边的 run 存在，合并 A[lo..lo+w−1] 和 A[lo+w..min(lo+2w, n)−1]；否则从 lo 到末尾这一段轮空。</p>

<h3>复杂度与性质</h3>
<ul>
<li>每一轮里每个元素恰好参与一次合并（或轮空），一轮 <strong>Θ(n)</strong>。</li>
<li>宽度每轮翻倍，w &lt; n 才继续，共 <strong>⌈log₂ n⌉ 轮</strong>：7 个、8 个元素都是 3 轮，9 个要 4 轮。</li>
<li>合计 <strong>Θ(n log n)，最好 = 平均 = 最坏</strong>，和自顶向下相同。已排序的输入也一轮不少、一次合并不少，<strong>不自适应</strong>。</li>
<li>额外空间：合并要一个长度 n 的缓冲数组，<strong>O(n)</strong>。没有递归只是省掉了 O(log n) 的栈，不会变成 O(1)。</li>
<li>稳定：合并时相等的键取左边 run 的元素，和 5.7 相同。</li>
</ul>

<h3>数合并次数</h3>
<p>每次合并把两个 run 变成一个，run 的个数恰好减 1。从 n 个 run 到 1 个 run，<strong>总共 n − 1 次合并</strong>，与按什么顺序合并无关。7 个元素：3 + 2 + 1 = 6 次。自顶向下也是 6 次（7 拆成 3 + 4，再拆成 1 + 2 和 2 + 2），只是分组不同：自顶向下最后合并 3 个和 4 个，自底向上最后合并 4 个和 3 个。</p>
<p>每一轮的合并次数 = ⌊本轮开始时的 run 数 / 2⌋，run 数为奇数时最后一个轮空。2016 年期末问过 7 个整数做自底向上归并排序会触发几次调用，参考答案给“7 次（或 6 次）合并”，差别在轮空的 run 是否也调用一次 <code>merge</code>。答题时写明假设：轮空不调用，共 6 次；排序函数本身是循环，只调用 1 次。</p>

<h2>C 实现</h2>
<p>两种版本共用一个 <code>merge</code>：借缓冲数组 B 合并 A 中相邻的两段，再复制回 A。</p>
<pre><code>#include &lt;stdlib.h&gt;
#include &lt;assert.h&gt;

/* merge sorted A[lo..mid-1] and A[mid..hi-1] through buffer B, result back in A */
static void merge(int A[], int B[], int lo, int mid, int hi) {
    int i = lo, j = mid, k;
    for (k = lo; k &lt; hi; k++) {
        if (j &gt;= hi || (i &lt; mid &amp;&amp; A[i] &lt;= A[j])) {
            B[k] = A[i++];                 /* tie: take the LEFT run, stable */
        } else {
            B[k] = A[j++];
        }
    }
    for (k = lo; k &lt; hi; k++) A[k] = B[k];      /* copy back */
}

/* bottom-up: merge runs of width 1, 2, 4, 8, ... */
void merge_sort_bu(int A[], int n) {
    int w, lo, hi, *B;
    if (n &lt; 2) return;
    B = malloc(n * sizeof(int));
    assert(B != NULL);
    for (w = 1; w &lt; n; w *= 2) {
        for (lo = 0; lo + w &lt; n; lo += 2 * w) {    /* a right run exists */
            hi = (lo + 2 * w &lt; n) ? lo + 2 * w : n;
            merge(A, B, lo, lo + w, hi);
        }                    /* run starting at lo with lo + w &gt;= n: carried over */
    }
    free(B);
}

/* end (exclusive) of the non-decreasing run that starts at i */
static int run_end(const int A[], int n, int i) {
    while (i + 1 &lt; n &amp;&amp; A[i] &lt;= A[i + 1]) i++;
    return i + 1;
}

/* adaptive (natural): merge neighbouring natural runs until one is left */
void merge_sort_natural(int A[], int n) {
    int lo, mid, hi, runs, *B;
    if (n &lt; 2) return;
    B = malloc(n * sizeof(int));
    assert(B != NULL);
    do {
        runs = 0;
        for (lo = 0; lo &lt; n; lo = hi) {
            mid = run_end(A, n, lo);
            runs++;
            if (mid == n) break;           /* last run, no partner: carried over */
            hi = run_end(A, n, mid);
            merge(A, B, lo, mid, hi);
        }
    } while (runs &gt; 1);                    /* one run = sorted */
    free(B);
}</code></pre>
<ul>
<li><code>lo + w &lt; n</code> 即“右 run 存在”，否则那一段原地不动（轮空）；<code>hi</code> 截到 n，右 run 可以不满 w 个。</li>
<li><code>merge</code> 里的 <code>A[i] &lt;= A[j]</code> 让相等元素先取左边，保证稳定；<code>run_end</code> 里的 <code>&lt;=</code> 让相等的邻居留在同一个 run 里。</li>
<li>自适应版把“宽度为 w 的段”换成“扫描出来的 run”，<code>runs</code> 是本轮结束后剩下的 run 数，剩 1 个就停。</li>
</ul>

<h2>自适应归并排序：从现成的有序段开始</h2>
<p>随机输入里常有一段段本来就有序的元素，自底向上却仍从单个元素起步。课上的 14 个元素：</p>
<pre><code class="lang-text">输入     7 | 0 3 6 8 | 7 | 4 4 | 1 7 7 | 6 6 | 4      7 个 run
第 1 轮  0 3 6 7 8 | 4 4 7 | 1 6 6 7 7 | 4            合并 3 次，[4] 轮空
第 2 轮  0 3 4 4 6 7 7 8 | 1 4 6 6 7 7                合并 2 次
第 3 轮  0 1 3 4 4 4 6 6 6 7 7 7 7 8                  合并 1 次</code></pre>
<ul>
<li><strong>找 run</strong>：从头扫描，下一个元素 ≥ 当前元素就继续，出现下降（A[i] &gt; A[i+1]）就断开。7 后面是 0，第一个 run 只有 [7]；0 3 6 8 之后的 7 比 8 小，第二个 run 是 [0 3 6 8]。这种极大的非递减段叫 <strong>natural run</strong>；<strong>相等的邻居不算下降</strong>，4 4、6 6 各自属于同一个 run。所以 <strong>run 数 = 下降处的个数 + 1</strong>，这里 6 处下降、7 个 run。</li>
<li><strong>每一轮</strong>：扫描找出前两个 run 并合并，再找下两个……一直到末尾，落单的 run 轮空。下一轮重新扫描。</li>
<li>14 个元素 3 轮完成、合并 6 次；自底向上要 ⌈log₂ 14⌉ = 4 轮、13 次合并（它 3 轮最多排 8 个元素）。</li>
</ul>
<p>一般地，r 个 run 需要 <strong>⌈log₂ r⌉ 轮、r − 1 次合并</strong>（合并后的 run 末尾仍大于下一个 run 的开头，run 不会自己连起来）。教科书常把这个算法叫 natural merge sort，课上叫 adaptive merge sort。</p>

<h3>最好、最坏、平均</h3>
<p>每一轮是一次扫描（n − 1 次相邻比较）加总长不超过 n 的若干次合并，<strong>一轮 Θ(n)</strong>，总时间取决于轮数。</p>
<ul>
<li><strong>最好：输入已排序</strong>。第一次扫描发现整个数组只有 1 个 run，不用合并，<strong>Θ(n)</strong>，和插入排序的最好情况一样。任何排序算法至少要看每个元素一次，Θ(n) 已是下限。run 很少的“几乎有序”输入也接近线性。</li>
<li><strong>最坏：严格逆序</strong>。没有长度超过 1 的 run，r = n，每一轮的合并和自底向上完全相同，<strong>Θ(n log n)</strong>。</li>
<li><strong>平均：仍是 Θ(n log n)</strong>。随机输入里每对相邻元素约有一半机会是下降，n − 1 个相邻对约一半是断点，run 数约 n/2；轮数约 log₂(n/2) = log₂ n − 1，<strong>只比自底向上少一轮</strong>，增长率不变。</li>
</ul>
<p>run 都是连续的段，合并只发生在相邻 run 之间且相等取左，所以仍然<strong>稳定</strong>；缓冲数组仍是 <strong>O(n)</strong> 额外空间。和普通归并排序不同，它<strong>自适应</strong>。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-merge-sort-variants/anims/passes.html" loading="lazy" style="height: 500px;" title="自底向上与自适应归并的轮次"></iframe>
<p class="anim-caption">先选算法和输入，再按播放或下一步：每一行是一轮结束后的数组，下划线标出 run，橙色和蓝色是正在合并的两个 run，黄色虚线是轮空的 run。同一输入切换两种算法，比较轮数和合并次数。</p>

<h2>什么时候用归并排序</h2>
<ul>
<li><strong>链表</strong>：合并只从两个序列的头部往后读，是顺序访问（sequential access），从不按下标跳转；链表上合并只改 <code>next</code> 指针，不需要缓冲数组。课上的快速排序分区要让 j 从末尾往回扫，单向链表做不到。</li>
<li><strong>数据比内存大</strong>（外部排序，external sorting）：先把装得进内存的一块块排好、写回磁盘，各成一个 run，再合并这些 run。合并时每个 run 只需当前队首在内存里。</li>
<li><strong>数据流（stream）</strong>：陆续到达的有序序列，同样只看队首就能合并。</li>
</ul>
<p>内存里的普通数组通常用快速排序：两者都是 n log n 量级，但归并排序大量时间花在数组间复制元素，常数更大，而 Big-O 不反映常数。</p>
<table>
<thead><tr><th></th><th>快速排序</th><th>归并（自顶向下 / 自底向上）</th><th>自适应归并</th></tr></thead>
<tbody>
<tr><td>拆分</td><td>分区，Θ(n)</td><td>取中点或不拆，O(1)</td><td>扫描找 run</td></tr>
<tr><td>合并</td><td>无</td><td>合并，每层 Θ(n)</td><td>合并，每轮 Θ(n)</td></tr>
<tr><td>最好 / 平均 / 最坏</td><td>n log n / n log n / n²</td><td>n log n / n log n / n log n</td><td>n / n log n / n log n</td></tr>
<tr><td>额外空间</td><td>O(log n) 栈，最坏 O(n)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>稳定</td><td>否</td><td>是</td><td>是</td></tr>
<tr><td>已排序输入</td><td>首元素作 pivot 时最坏</td><td>仍 Θ(n log n)</td><td>最好 Θ(n)</td></tr>
<tr><td>访问方式</td><td>两端相向扫描</td><td>顺序读</td><td>顺序读</td></tr>
<tr><td>实际速度</td><td>通常最快</td><td>复制多，常数大</td><td>有序度高时快</td></tr>
</tbody>
</table>

<h2>考试怎么考</h2>
<ul>
<li><strong>数次数</strong>：n 个元素自底向上（或自顶向下）合并 <strong>n − 1</strong> 次、<strong>⌈log₂ n⌉</strong> 轮，每轮合并 ⌊run 数/2⌋ 次；自适应版 r 个 run 合并 r − 1 次、⌈log₂ r⌉ 轮。公式表上只有对数恒等式，这几个数要自己推。</li>
<li><strong>写出每轮之后的数组</strong>：自底向上按位置两两分组；自适应版先标出下降处、划出 run 再合并。用 <code>|</code> 标 run 边界，轮空的 run 照抄。</li>
<li><strong>最好/最坏输入</strong>：自适应版已排序 Θ(n)、严格逆序 Θ(n log n)、平均 Θ(n log n)（约少一轮）；另两种版本三种情况都是 Θ(n log n)。</li>
<li><strong>填空</strong>：自底向上时间 Θ(n log n)、额外空间 O(n)，2015、2016 年都考过。</li>
<li><strong>简答</strong>：归并排序为什么适合链表和外部数据；快速排序为什么实践中通常更快。</li>
<li>陷阱：把轮空算成一次合并却不写假设；以为没有递归额外空间就是 O(1)；以为自底向上对已排序输入更快；找 run 时把相等的邻居断开；把插入排序的“几乎有序”直接套到自适应归并排序上（练习 3）。</li>
</ul>

<h2>练习</h2>

<details class="qa">
<summary class="ripple-surface">1. 10 个元素做自底向上归并排序（轮空不调用 merge）。用位置 1–10 写出每一轮合并哪些段，并求合并总次数和轮数。</summary>
<div class="qa__body">
<ul>
<li>宽度 1：(1, 2)、(3, 4)、(5, 6)、(7, 8)、(9, 10)，5 次，无轮空。</li>
<li>宽度 2：(1–2, 3–4)、(5–6, 7–8)，2 次；run 数 5 是奇数，9–10 轮空。</li>
<li>宽度 4：(1–4, 5–8)，1 次；9–10 再次轮空。</li>
<li>宽度 8：(1–8, 9–10)，1 次。</li>
</ul>
<p>共 5 + 2 + 1 + 1 = <strong>9 = n − 1 次</strong>，<strong>4 = ⌈log₂ 10⌉ 轮</strong>。9–10 连续两轮轮空，最后一次合并 8 个和 2 个，很不均衡，但不影响次数。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 对 [3, 9, 2, 5, 8, 1, 4, 6, 7, 0] 做自适应归并排序：写出初始的 run、每轮结束后的数组和合并次数。自底向上对同一输入要几轮、几次合并？</summary>
<div class="qa__body">
<p>下降处是 9 &gt; 2、8 &gt; 1、7 &gt; 0，共 3 处，所以 4 个 run：3 9 | 2 5 8 | 1 4 6 7 | 0。</p>
<ul>
<li>第 1 轮：[3 9] + [2 5 8] → [2 3 5 8 9]；[1 4 6 7] + [0] → [0 1 4 6 7]。run 数是偶数，没有轮空。数组：2 3 5 8 9 | 0 1 4 6 7。</li>
<li>第 2 轮：两个 run 合并 → 0 1 2 3 4 5 6 7 8 9。</li>
</ul>
<p>共 <strong>2 轮、3 次合并</strong>（⌈log₂ 4⌉ = 2，4 − 1 = 3）。自底向上从 10 个单元素 run 出发，要 <strong>⌈log₂ 10⌉ = 4 轮、9 次合并</strong>。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. n 为 2 的幂（n ≥ 4）。分别对 (a) 后一半在前：n/2+1, …, n, 1, …, n/2（如 5 6 7 8 1 2 3 4）和 (b) 相邻两两颠倒：2, 1, 4, 3, …, n, n−1 做插入排序和自适应归并排序，各是什么时间复杂度？</summary>
<div class="qa__body">
<p>(a) 只有 n 到 1 一处下降，2 个 run，自适应归并排序 1 轮：一次扫描加一次长度 n 的合并，<strong>Θ(n)</strong>。插入排序：后一半的每个元素都要越过前一半的 n/2 个元素，移位 (n/2)² = n²/4 次，<strong>Θ(n²)</strong>（n = 8 时移位 16 次）。</p>
<p>(b) 每对 (2, 1)、(4, 3)… 内部都是一处下降，共 n/2 处，run 数 n/2 + 1（n = 8：2 | 1 4 | 3 6 | 5 8 | 7，5 个 run）。轮数 ⌈log₂(n/2 + 1)⌉ = log₂ n，和自底向上一样多，<strong>Θ(n log n)</strong>。插入排序：每个元素最多右移一格，共 n/2 次移位，<strong>Θ(n)</strong>（n = 8 时比较 10 次、移位 4 次）。</p>
<p>两种“几乎有序”含义不同：插入排序看每个元素离最终位置有多远（逆序对的个数），自适应归并排序看 run 有多少。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 多选：(A) 自底向上归并排序对已排序输入只需 Θ(n)　(B) 对严格逆序的输入，自适应归并排序的每一次合并都和自底向上相同　(C) 自底向上归并排序不用递归，所以额外空间是 O(1)　(D) 归并排序最坏情况比快速排序好，所以实际运行通常更快　(E) 对单向链表排序，归并排序比课上的快速排序更合适，因为合并只需顺序访问</summary>
<div class="qa__body">
<p><strong>B、E。</strong></p>
<p>A 错：自底向上不检查有序性，照样 ⌈log₂ n⌉ 轮、n − 1 次合并，Θ(n log n)。B 对：起点都是 n 个单元素 run；每轮合并后前一个 run 的元素都大于后一个 run 的，边界正好落在宽度 2、4、8… 的位置，两者逐次相同。C 错：缓冲数组 O(n)。D 错：Big-O 不比较常数，归并排序复制多，实践中通常更慢。E 对：合并只从头往后读，分区却要从末尾往回扫。</p>
</div>
</details>
`;

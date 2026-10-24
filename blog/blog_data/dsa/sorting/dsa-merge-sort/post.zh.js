/* Post body — dsa-merge-sort / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-merge-sort:zh'] = `
<p class="lead">归并排序（merge sort）把数组从中间分成两半，递归排好每一半，再把两个有序的一半合并（merge）成一个。合并是线性时间的双指针扫描；整个排序在最好、平均、最坏情况下都是 Θ(n log n)，稳定，需要 O(n) 额外空间，不自适应。</p>

<h2>拆分轻，合并重</h2>
<p>分治（divide and conquer）在课上分三步：拆分（split）、求解（solve，递归处理子问题）、合并（join）。快速排序的工作全在拆分：partition 拿 pivot 和每个元素比较，O(n)；两个分区排好后整个数组自然有序，合并什么也不做。归并排序反过来：拆分只是把前一半和后一半当成两个数组，课上的对比表记为 O(1)；排序的工作全在合并，O(n)。<strong>快排难分易合，归并易分难合。</strong>所以先要解决：两个有序数组怎样合成一个有序数组。</p>

<h2>合并：每次比较两个队首</h2>
<p>课上的举牌演示：L = [1, 3, 6, 6, 7, 8]，R = [2, 4]，各自从小到大站好。L[0] 是 L 中最小的，R[0] 是 R 中最小的，所以全体最小的元素<strong>一定是两个队首之一</strong>。1 &lt; 2，把 1 抄进新数组；剩下的仍是两个有序数组，道理不变。依次取出 1（L）、2（R）、3（L）、4（R）后 R 用完，L 剩下的 6, 6, 7, 8 本身有序，又不小于已输出的元素，所以<strong>不再比较，整段照抄</strong>。</p>
<p>一般地，指针 i、j 指向 L、R 的队首，每轮比较 L[i] 和 R[j]，较小的抄进输出的下一格，那一边的指针加一；一边用完，另一边剩下的全部照抄。<strong>两个队首相等时取左边 L 的</strong>，即条件写成 <code>L[i] &lt;= R[j]</code>，稳定性靠的就是这一点。</p>
<p>每轮一次比较、一次复制、一次指针移动，是常数时间；每轮输出一个元素，n 个元素 n 轮，所以<strong>合并是 Θ(n)</strong>。长度为 m 和 k 的两个数组，<strong>最多比较 m + k − 1 次</strong>（比到只剩最后一个元素），<strong>最少 min(m, k) 次</strong>（较短的一边整体更小，取完就停）。上例比较 4 次。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-merge-sort/anims/merge.html" loading="lazy" style="height: 480px;" title="合并两个有序数组"></iframe>
<p class="anim-caption">按“下一步”逐轮执行：橙色是正在比较的两个队首，取走的变暗。切到“有相等键”，看 5₁ 和 5₂ 相遇时取左边的 5₁。</p>

<h2>自顶向下：拆到单个元素再合并</h2>
<p>有了合并，排序就是递归：长度不超过 1 的数组本身有序，直接返回（递归出口，base case）；否则从中间分成两半，各自递归排序，再合并。课上的实现把两半复制到两个新数组，排好后合并写回原数组。下面的输入和课上 8 位同学演示的中间结果一致（两个 6 记作 6₁、6₂），圈号是合并的执行顺序：</p>
<pre><code class="lang-text">拆分  [6₁ 3 8 6₂ 7 1 4 2]
      [6₁ 3 8 6₂]          [7 1 4 2]
      [6₁ 3]   [8 6₂]      [7 1]   [4 2]
      [6₁] [3] [8] [6₂]    [7] [1] [4] [2]      单个元素，有序
合并  ①[3 6₁]  ②[6₂ 8]     ④[1 7]  ⑤[2 4]
      ③[3 6₁ 6₂ 8]         ⑥[1 2 4 7]
      ⑦[1 2 3 4 6₁ 6₂ 7 8]</code></pre>
<p>执行是<strong>深度优先</strong>的：左半全部排好（①②③）之后，右半才开始拆分（④⑤⑥），最后 ⑦ 合并两半。第 ③ 次合并 [3, 6₁] 与 [6₂, 8]：3 先出；6₁ 和 6₂ 相等，取左边的 6₁；L 用完，照抄 6₂、8。第 ⑦ 次比较了 7 次 = 4 + 4 − 1，是最多的情况。</p>
<p>每次合并把两段并成一段，从 n 段到 1 段，<strong>共 n − 1 次合并</strong>。递归树有 n 个叶子、n − 1 个内部结点，所以 merge_sort <strong>共调用 2n − 1 次</strong>（含直接返回的）。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-merge-sort/anims/mergesort.html" loading="lazy" style="height: 480px;" title="自顶向下归并排序的拆分与合并"></iframe>
<p class="anim-caption">蓝色在等两半排好，橙色是刚合并的结果，绿色已有序。“奇数个”看 7 怎样分成 4 + 3，“已排好”对比比较次数。</p>

<h2>C 代码</h2>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;assert.h&gt;

/* merge sorted L[0..nL-1] and R[0..nR-1] into A[0..nL+nR-1] */
void merge(int L[], int nL, int R[], int nR, int A[]) {
    int i = 0, j = 0;                     /* fronts of L and R */
    for (int k = 0; k &lt; nL + nR; k++) {
        if (j &gt;= nR || (i &lt; nL &amp;&amp; L[i] &lt;= R[j])) {
            A[k] = L[i++];      /* R used up, or L[i] &lt;= R[j]: tie takes LEFT */
        } else {
            A[k] = R[j++];      /* L used up, or R[j] &lt; L[i] */
        }
    }
}

void merge_sort(int A[], int n) {
    if (n &lt; 2) return;                    /* 0 or 1 element: sorted */
    int mid = (n + 1) / 2;                /* left half gets the extra one */
    int *L = malloc(mid * sizeof(int));
    int *R = malloc((n - mid) * sizeof(int));
    assert(L != NULL &amp;&amp; R != NULL);
    for (int k = 0; k &lt; mid; k++) L[k] = A[k];         /* split: copy */
    for (int k = mid; k &lt; n; k++) R[k - mid] = A[k];   /* both halves */
    merge_sort(L, mid);                   /* solve */
    merge_sort(R, n - mid);
    merge(L, mid, R, n - mid, A);         /* join */
    free(L);
    free(R);
}

int main(void) {
    int A[] = {6, 3, 8, 6, 7, 1, 4, 2};
    int n = sizeof(A) / sizeof(A[0]);
    merge_sort(A, n);
    for (int k = 0; k &lt; n; k++) printf("%d ", A[k]);
    printf("\\n");                         /* 1 2 3 4 6 6 7 8 */
    return 0;
}</code></pre>
<ul>
<li>照课上的写法，拆分时 <code>malloc</code> 两个新数组复制两半，合并写回 <code>A</code> 后 <code>free</code>。</li>
<li><code>mid = (n + 1) / 2</code> 让奇数长度时左半多一个（7 → 4 + 3，与课上的图一致）。写成 <code>n / 2</code> 也对，只是切分位置不同，追踪题按题目约定。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li><code>&lt;=</code> 写成 <code>&lt;</code>：结果仍然有序，但相等时取了右边，<strong>不再稳定</strong>（见练习 3）。</li>
<li>漏掉 <code>j &gt;= nR</code>，或把它挪到 <code>L[i] &lt;= R[j]</code> 后面：R 用完时会读越界的 <code>R[nR]</code>。</li>
</ul>
</div>

<h2>复杂度：每层 n，共 log₂ n 层</h2>
<p>看上面的拆分图：第 k 层是 2<sup>k</sup> 个长 n/2<sup>k</sup> 的数组，<strong>每一层加起来正好 n 个元素</strong>。拆分时每层复制 n 个，合并时每层写回 n 个，所以每层 Θ(n)。长度每层减半，8 → 4 → 2 → 1，<strong>log₂ n 层</strong>后到单个元素，总计 <strong>Θ(n log n)</strong>。递推式和快速排序的最好情况相同（T(1) = 1，cn 是复制与合并）：</p>
<pre><code class="lang-text">T(n) = 2T(n/2) + cn = 4T(n/4) + 2cn = 8T(n/8) + 3cn = … = 2^i · T(n/2^i) + i·cn
令 2^i = n，即 i = log₂ n：T(n) = n·T(1) + cn·log₂ n = n + cn log₂ n ∈ Θ(n log n)</code></pre>
<p>逐行推导见 1.8。用主定理（Master Theorem，公式表上有）更快：a = 2，b = 2，f(n) = cn 即 d = 1，a = b<sup>d</sup>，得 Θ(n<sup>d</sup> log n) = Θ(n log n)，见 1.9。</p>
<p><strong>最好 = 平均 = 最坏 = Θ(n log n)</strong>：切分位置只由长度决定，任何输入的递归树都一样；每次合并都要把全部元素写进输出，每层仍是 Θ(n)。已排好的 8 个元素也要比较 12 次（上例 16 次），复制一次不少。</p>

<h2>性质：稳定、不原地、不自适应</h2>
<p><strong>稳定（stable）</strong>。拆分只按原顺序复制，不改变先后次序。合并时，两个相等的键有两种位置关系：</p>
<ul>
<li><strong>在不同的子数组</strong>：左子数组的元素本来就在前；比较相等时取左边的，它仍在前（上例的 6₁、6₂）。</li>
<li><strong>在同一个子数组</strong>：递归已把这个子数组稳定地排好，两者按原次序排在一起；指针逐个扫过，按原次序抄出。</li>
</ul>
<p><strong>不原地（not in-place），额外空间 O(n)</strong>。第一次拆分就复制了全部 n 个元素。每次调用合并完立刻 free，同时存在的只有当前递归路径上的数组，约 n + n/2 + n/4 + … ≈ 2n，再加 O(log n) 的递归栈，仍是 O(n)。对比：选择、插入排序 O(1)，快速排序平均 O(log n)。原地归并排序存在但很复杂，<strong>不在本课程范围内</strong>。</p>
<p><strong>不自适应（not adaptive）</strong>：理由同上一节的“最好 = 最坏”。利用输入中已有有序段的自适应版本见 5.8。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>追踪</strong>：合并的输出顺序和比较次数；整个排序每层的子数组，或第几次合并的结果。相等取左，一边用完不再比较；执行深度优先，奇数长度看清哪一半多一个。</li>
<li><strong>复杂度</strong>：2015 年真题问过自顶向下归并排序的时间和空间，答 O(n log n) 和 O(n)。</li>
<li><strong>解释</strong>：为什么稳定（分两种情况说）；为什么已排好的输入也要 n log n。</li>
<li><strong>写代码</strong>：merge 或整个 merge_sort（第 8 周 workshop 写过）：<code>&lt;=</code>、一边用完的处理、malloc 之后 free。</li>
</ul>
<p>公式表只有主定理和求和公式，下表要背：</p>
<table>
<thead><tr><th>要背的</th><th>归并排序（自顶向下）</th></tr></thead>
<tbody>
<tr><td>时间（最好 / 平均 / 最坏）</td><td>Θ(n log n) / Θ(n log n) / Θ(n log n)</td></tr>
<tr><td>递推式</td><td>T(n) = 2T(n/2) + cn；主定理 a = 2, b = 2, d = 1</td></tr>
<tr><td>合并长度 m 与 k 的数组</td><td>Θ(m + k)；比较 min(m, k) 到 m + k − 1 次</td></tr>
<tr><td>额外空间 / 原地</td><td>O(n) / 否（O(log n) 是快排）</td></tr>
<tr><td>稳定 / 自适应</td><td>是（相等取左） / 否</td></tr>
<tr><td>合并次数 / 调用次数</td><td>n − 1 / 2n − 1</td></tr>
</tbody>
</table>
<p>常见失分：说已排好的输入只要 Θ(n)（那是 5.8 的自适应版本）；把空间写成 O(log n)。</p>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">1. 合并 L = [2, 4₁, 6] 与 R = [1, 4₂, 8, 9, 11]，写出输出顺序和比较次数。长度 3 和 5 的两个有序数组，比较次数最少、最多各是多少？各举一例。</summary>
  <div class="qa__body">
<p>2 vs 1 取 1；2 vs 4₂ 取 2；4₁ vs 4₂ 相等，取左边的 4₁；6 vs 4₂ 取 4₂；6 vs 8 取 6；L 用完，照抄 8 9 11。输出 <strong>1 2 4₁ 4₂ 6 8 9 11，比较 5 次</strong>。</p>
<p>比较次数 = 总长 − 某一边用完时另一边剩下的个数。<strong>最少 3 次</strong>：较短的一边整体更小，如 L = [1, 2, 3]，R = [4, 5, 6, 7, 8]。<strong>最多 3 + 5 − 1 = 7 次</strong>：最大的两个元素分在两边，比到只剩一个，如 L = [6, 7, 8]，R = [1, 2, 3, 4, 9]。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">2. 用文中的 merge_sort（左半取 ⌈n/2⌉）排序 [5₁, 2, 9, 1, 5₂, 6, 3]。按执行顺序写出每次合并的输入和结果。共几次合并？merge_sort 被调用几次？两个 5 谁在前？</summary>
  <div class="qa__body">
<p>先拆成 [5₁ 2 9 1] 和 [5₂ 6 3]，左半再拆成 [5₁ 2]、[9 1]，右半拆成 [5₂ 6]、[3]。</p>
<pre><code class="lang-text">① [5₁] + [2]               → [2 5₁]
② [9] + [1]                → [1 9]
③ [2 5₁] + [1 9]           → [1 2 5₁ 9]
④ [5₂] + [6]               → [5₂ 6]
⑤ [5₂ 6] + [3]             → [3 5₂ 6]
⑥ [1 2 5₁ 9] + [3 5₂ 6]    → [1 2 3 5₁ 5₂ 6 9]</code></pre>
<p><strong>6 次合并</strong>（n − 1），<strong>13 次调用</strong>（2n − 1：6 次拆分，7 次单元素直接返回）。第 ⑥ 次合并时 5₁ 与 5₂ 相等，取左边的 5₁，所以 <strong>5₁ 在前</strong>，与输入次序相同。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">3. 把 merge 中的 <code>L[i] &lt;= R[j]</code> 改成 <code>L[i] &lt; R[j]</code>。(a) 输出还有序吗？(b) 对 [2₁, 1, 2₂] 运行，结果是什么？(c) 时间复杂度变吗？</summary>
  <div class="qa__body">
<p>(a) <strong>仍然有序</strong>。两个队首相等时，取哪个都是剩余元素中最小的。</p>
<p>(b) mid = 2，L = [2₁, 1]，R = [2₂]。L 排成 [1, 2₁]。合并 [1, 2₁] 与 [2₂]：1 &lt; 2₂，取 1；2₁ &lt; 2₂ 不成立，取 <strong>2₂</strong>；R 用完，抄 2₁。结果 <strong>[1, 2₂, 2₁]</strong>，2₂ 跑到了 2₁ 前面，<strong>不稳定</strong>。原来的 <code>&lt;=</code> 得到 [1, 2₁, 2₂]。</p>
<p>(c) <strong>不变</strong>，仍是 Θ(n log n)：只改变相等时取哪边，轮数和每轮工作量都不变。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">4. 多选，哪些正确？(A) 输入已排好时，归并排序是 Θ(n)；(B) 课上的实现需要 O(n) 额外空间；(C) 运行时间满足 T(n) = 2T(n/2) + cn，由主定理得 Θ(n log n)；(D) 合并长度为 m 和 k 的两个有序数组，总是恰好比较 m + k − 1 次；(E) 归并排序的主要工作在拆分阶段；(F) 合并时相等的键取左边子数组的，是归并排序稳定的关键。</summary>
  <div class="qa__body">
<p><strong>B、C、F 正确。</strong>B：第一次拆分就复制 n 个元素。C：a = 2，b = 2，d = 1，a = b<sup>d</sup>。F：拆分不改变次序，相等取左保证分在两边的相等键不换位。</p>
<p>A 错：不自适应，拆分与合并一样不少。D 错：在 min(m, k) 和 m + k − 1 之间。E 错：那是快速排序。</p>
  </div>
</details>
`;

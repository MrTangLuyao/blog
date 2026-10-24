/* Post body — dsa-quicksort-analysis / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-quicksort-analysis:zh'] = `
<p class="lead">快速排序的总代价 = 每层分区 O(n) × 递归层数。pivot 每次都落在中间时约 log₂ n 层，Θ(n log n)；每次都落在一端时 n − 1 层，Θ(n²)；随机输入平均 Θ(n log n)。pivot 的选法决定哪些输入会落进最坏情况；快速排序不稳定，额外空间来自递归栈。</p>

<h2>递归树：每层 O(n)</h2>
<p>沿用 5.5 的例子 [5, 8, 7, 1, 3, 4, 0, 6, 9, 2]，pivot 取首元素，按课上的分区方法。第 1 次分区处理全部 10 个元素，得到 [4, 2, 0, 1, 3 | 5 | 7, 6, 9, 8]；下一层两边各分区一次，合起来 9 个元素。同一递归深度的分区放在一行（子数组按分区前的样子列出）：</p>
<table>
<thead><tr><th>层</th><th>这一层分区的子数组</th><th>元素数</th></tr></thead>
<tbody>
<tr><td>1</td><td>[5, 8, 7, 1, 3, 4, 0, 6, 9, 2]</td><td>10</td></tr>
<tr><td>2</td><td>[4, 2, 0, 1, 3]　[7, 6, 9, 8]</td><td>9</td></tr>
<tr><td>3</td><td>[3, 2, 0, 1]　[9, 8]</td><td>6</td></tr>
<tr><td>4</td><td>[1, 2, 0]</td><td>3</td></tr>
</tbody>
</table>
<p>只剩 0 或 1 个元素的子数组（如 [7, 6, 9, 8] 分完后左边的 [6]）不再分区。同一层的子数组是数组里互不重叠的几段，分区的代价和段长成正比（见 5.5），所以<strong>每一层合计不超过 cn，即 O(n)</strong>：</p>
<pre><code class="lang-text">总代价 ≈ O(n) × 层数</code></pre>
<p>层数取决于 pivot 分得是否均匀。把每个 pivot 看作结点、左右子数组看作左右子树，就得到递归树。它和 BST 一样（见 3.3）：平衡时高度约 log₂ n，退化成链时高度接近 n。</p>

<h2>最好情况：pivot 每次都是中位数</h2>
<p>n = 15，若每个 pivot 都是所在子数组的中位数：第 1 层处理 15 个，分成 7 + 7；第 2 层处理 14 个，分成四段各 3 个；第 3 层处理 12 个，之后只剩单个元素。每过一层段长减半，<strong>约 log₂ n 层</strong>，每层 O(n)，合计 Θ(n log n)。</p>
<p>递推式 <strong>T(n) = 2T(n/2) + cn</strong>。准确地说两边各 (n−1)/2 个，课上取 n/2 是因为 T(n/2) ≥ T((n−1)/2)，上界不变。用展开法（见 1.8）或主定理（见 1.9：a = 2，b = 2，d = 1，a = b<sup>d</sup>）都得 <strong>Θ(n log n)</strong>。</p>

<h2>最坏情况：pivot 每次都在一端</h2>
<p>已排序的 [1, 2, 3, 4, 5, 6, 7]，pivot 取首元素 1。i 在下标 1 遇到 2 ≥ 1 就停；j 从末尾往回找比 1 小的，一个也没有，一直退到 pivot 的位置；最后 pivot 和自己交换。左边 0 个，右边 6 个，而且右边 [2, …, 7] 仍然有序，下一层的 pivot 2 又是最小值：</p>
<pre><code class="lang-text">第 1 层  [1 2 3 4 5 6 7]   7 个
第 2 层    [2 3 4 5 6 7]   6 个
第 3 层      [3 4 5 6 7]   5 个
  …
第 6 层            [6 7]   2 个      共 n − 1 = 6 层</code></pre>
<p>递推式 <strong>T(n) = T(n−1) + cn</strong>，和选择排序、插入排序相同（见 1.8），展开得 c(n + (n−1) + … + 2) = c(n+2)(n−1)/2，<strong>Θ(n²)</strong>。触发条件是“每个 pivot 都是所在子数组的最小值或最大值”，不只是已排序：</p>
<ul>
<li><strong>逆序</strong>：pivot 最大、最小交替出现，同样 n − 1 层（练习 1）。</li>
<li><strong>全部相等</strong>：本课程约定等于 pivot 的放右边，j 一路退回 pivot，每次只放好一个。</li>
</ul>

<h2>平均情况：Θ(n log n)</h2>
<p>课上不证明平均情况，直观原因是分区不必每次正好对半。假设每次都分成 1 : 9，较大的一边每层缩到 9/10，层数是 log<sub>10/9</sub> n ≈ 6.6 log₂ n。n = 100 万时约 131 层，仍是 O(log n)，而最坏情况是 999 999 层。随机排列中，pivot 落在最小或最大 10% 里的概率只有 20%，多数分区比 1 : 9 均匀；要退化成 n 层，几乎每次都得选中端点，概率微乎其微。所以<strong>平均 Θ(n log n)</strong>。</p>
<p>实测 n = 10000（比较 = 键比较次数，三数取中的 3 次也计入；随机一行是 20 个随机排列的平均）：</p>
<table>
<thead><tr><th>输入</th><th>首元素：比较</th><th>层数</th><th>三数取中：比较</th><th>层数</th></tr></thead>
<tbody>
<tr><td>随机排列</td><td>≈ 159 000</td><td>≈ 30</td><td>≈ 154 000</td><td>≈ 23</td></tr>
<tr><td>已排序</td><td>50 004 999</td><td>9999</td><td>137 247</td><td>13</td></tr>
<tr><td>逆序</td><td>49 999 999</td><td>9999</td><td>137 246</td><td>13</td></tr>
<tr><td>全部相等</td><td>50 004 999</td><td>9999</td><td>50 034 996</td><td>9999</td></tr>
</tbody>
</table>
<p>参照值：n log₂ n ≈ 133 000，n²/2 = 5000 万，log₂ n ≈ 13.3。随机输入约 2 log₂ n 层，属于 O(log n)。</p>
<p>快速排序是本课程第一个平均情况好于 n² 的比较排序。<strong>任何基于比较的排序，平均情况都不可能好于 n log n</strong>，所以它的平均量级已经是最优（计数排序不比较键，不受此限）。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-quicksort-analysis/anims/recursion-tree.html" loading="lazy" style="height: 600px;" title="快速排序的递归树"></iframe>
<p class="anim-caption">每一行是递归树的一层，右侧是这一层分区的元素总数。先看“随机输入”（可点“换一组随机数”），再看“已排序”的阶梯，最后看三数取中把同一个有序输入分成 3 层。</p>

<h2>pivot 的选法</h2>
<p>分区代码只认 A[lo] 作 pivot，所以每种策略都是先选一个下标，把它换到 A[lo]，再照常分区。</p>
<table>
<thead><tr><th>策略</th><th>已排序 / 逆序输入</th><th>说明</th></tr></thead>
<tbody>
<tr><td>首元素</td><td>最坏，n − 1 层</td><td>课上默认</td></tr>
<tr><td>末元素</td><td>最坏</td><td>同首元素</td></tr>
<tr><td>中间元素</td><td>接近对半</td><td>其他输入仍可能退化</td></tr>
<tr><td>随机元素</td><td>期望 O(log n) 层</td><td>键互不相同时，不论输入顺序，期望 Θ(n log n)</td></tr>
<tr><td>三数取中（median-of-3）</td><td>对半分</td><td>首、中、末三个元素的中位数；课上推荐</td></tr>
</tbody>
</table>
<p>三数取中在 [1, 2, …, 7] 上看首 1、中 4、末 7，中位数 4 正好是整个数组的中位数，第 1 层分成 [1, 2, 3] 和 [5, 6, 7]；两边再取到 2 和 6，2 层就结束。逆序输入同样是 2 层。</p>
<pre><code>#include &lt;stdio.h&gt;

void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

/* partition from 5.5: pivot = A[lo]; returns the pivot's final index */
int partition(int A[], int lo, int hi) {
    int pivot = A[lo];
    int i = lo + 1, j = hi;
    while (i &lt;= j) {
        while (i &lt;= j &amp;&amp; A[i] &lt; pivot)  i++;   /* stop at an element &gt;= pivot */
        while (i &lt;= j &amp;&amp; A[j] &gt;= pivot) j--;   /* stop at an element &lt;  pivot */
        if (i &lt; j) {
            swap(&amp;A[i], &amp;A[j]);
            i++; j--;
        }
    }
    swap(&amp;A[lo], &amp;A[j]);                       /* pivot to its final place */
    return j;
}

/* median-of-3: sort A[lo], A[mid], A[hi] among themselves,
   then move the median (now at mid) to A[lo] as the pivot */
void median_of_3(int A[], int lo, int hi) {
    int mid = lo + (hi - lo) / 2;
    if (A[mid] &lt; A[lo])  swap(&amp;A[mid], &amp;A[lo]);
    if (A[hi]  &lt; A[lo])  swap(&amp;A[hi],  &amp;A[lo]);
    if (A[hi]  &lt; A[mid]) swap(&amp;A[hi],  &amp;A[mid]);
    swap(&amp;A[lo], &amp;A[mid]);
}

void quicksort(int A[], int lo, int hi) {
    if (lo &lt; hi) {                     /* 0 or 1 element: already sorted */
        median_of_3(A, lo, hi);        /* delete this line: first-element pivot */
        int p = partition(A, lo, hi);
        quicksort(A, lo, p - 1);
        quicksort(A, p + 1, hi);
    }
}

int main(void) {
    int A[] = {1, 2, 3, 4, 5, 6, 7};   /* worst case without median_of_3 */
    int n = sizeof(A) / sizeof(A[0]);
    quicksort(A, 0, n - 1);
    for (int k = 0; k &lt; n; k++) {
        printf("%d ", A[k]);
    }
    printf("\\n");                      /* prints: 1 2 3 4 5 6 7 */
    return 0;
}</code></pre>
<p>改成随机 pivot，把 <code>median_of_3(A, lo, hi);</code> 换成下面一行（需要 <code>#include &lt;stdlib.h&gt;</code>）：</p>
<pre><code>swap(&amp;A[lo], &amp;A[lo + rand() % (hi - lo + 1)]);</code></pre>
<div class="callout warn" data-label="易错">
<p>换 pivot 策略只是换了“哪些输入最坏”，<strong>最坏情况仍是 Θ(n²)</strong>。见实测表最后一行：键全部相等时选哪个都一样，按本课程的分区每次只放好一个。三数取中也有专门构造的输入能让它退化。</p>
</div>

<h2>性质</h2>
<h3>不稳定</h3>
<p>分区会把前面的元素和后面的元素远距离交换，可能越过与它相等的元素。反例 [3, 2₁, 2₂]：i 越过 2₁、2₂（都小于 3），j 停在 2₂，两指针交叉；最后 pivot 3 与 A[j] = 2₂ 交换，得到 [2₂, 2₁, 3]。下一层 [2₂, 2₁] 的 pivot 2₂ 原地不动。结果 2₂ 排在 2₁ 前面：<strong>快速排序不稳定（unstable）</strong>。</p>

<h3>额外空间：递归栈</h3>
<p>快速排序不开新数组，额外空间来自递归：每个调用在栈上占 O(1)（lo、hi、p、返回地址），同时存在的调用数就是递归深度，约等于上面数的层数。</p>
<ul>
<li>最好 / 平均：深度 O(log n)，<strong>额外空间 O(log n)</strong>。这是课上投票题的答案，2016 年期末也考过。</li>
<li>最坏：已排序输入、首元素 pivot，调用嵌套 n − 1 层，O(n)。</li>
</ul>
<p><strong>是否原地（in-place）</strong>：按“额外空间严格 O(1)”的定义（见 5.1）不是；如果只算额外的数组和变量、不算栈，可以说是。课上两种答案都接受，要写明按哪个定义。</p>
<div class="callout note" data-label="提示">
<p>课外：每次先递归较短的一边、较长的一边改用循环，栈深度最坏也只有 O(log n)；时间的最坏情况仍是 Θ(n²)。</p>
</div>

<h3>对输入敏感</h3>
<p>最好 Θ(n log n)、最坏 Θ(n²)，运行时间取决于输入的排列，所以快速排序<strong>对输入敏感（adaptive / input-sensitive）</strong>。方向和插入排序相反：已排序是插入排序最快的输入，却是取首元素作 pivot 的快速排序最慢的输入。</p>

<h3>实践中通常最快</h3>
<p>归并排序最坏也是 Θ(n log n)，实际却通常比快速排序慢。Big-O 忽略常数：归并要把元素复制进新数组再合并回来；分区只在原数组里比较和交换，两个指针顺序扫描，对缓存友好，常数小。C 标准库的 <code>qsort</code> 名字来自 quicksort，但 C 标准只规定接口，不规定用哪种算法，也不保证稳定。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>最好 / 最坏输入</strong>：取首元素作 pivot 时，已排序、逆序、全部相等都是最坏，n − 1 层，Θ(n²)；每个 pivot 都是中位数时最好，Θ(n log n)。要能写出具体输入（练习 2）。</li>
<li><strong>递推式</strong>：最好 2T(n/2) + cn，最坏 T(n−1) + cn，都要自己写。公式表上的主定理只能解最好情况，最坏情况要展开。</li>
<li><strong>“最接近的上界”</strong>：不指明情况就按最坏答，时间 O(n²)；问平均才答 O(n log n)。额外空间按课上答 O(log n)（递归栈）；有的旧参考答案不算栈，写 O(1)，作答时附一句理由。</li>
<li><strong>性质</strong>：不稳定（会举反例）；原地两种答案都可，要说明定义；对输入敏感；平均 Θ(n log n) 已是比较排序的下限。</li>
<li><strong>三数取中</strong>：会算选中哪个元素；它让有序、逆序输入对半分，但最坏仍是 Θ(n²)。</li>
<li>陷阱：“最坏 Θ(n²)，所以比归并排序慢”，错：平均情况和实践中快速排序更快。</li>
</ul>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">1. 输入 [7, 6, 5, 4, 3, 2, 1]，pivot 取首元素，按课上的分区。依次写出每次分区的 pivot 和结果，共几层？n 个元素逆序时是什么量级？</summary>
  <div class="qa__body">
    <table>
    <thead><tr><th>层</th><th>子数组</th><th>pivot</th><th>分区后</th></tr></thead>
    <tbody>
    <tr><td>1</td><td>[7, 6, 5, 4, 3, 2, 1]</td><td>7（最大）</td><td>[1, 6, 5, 4, 3, 2] | 7</td></tr>
    <tr><td>2</td><td>[1, 6, 5, 4, 3, 2]</td><td>1（最小）</td><td>1 | [6, 5, 4, 3, 2]</td></tr>
    <tr><td>3</td><td>[6, 5, 4, 3, 2]</td><td>6（最大）</td><td>[2, 5, 4, 3] | 6</td></tr>
    <tr><td>4</td><td>[2, 5, 4, 3]</td><td>2（最小）</td><td>2 | [5, 4, 3]</td></tr>
    <tr><td>5</td><td>[5, 4, 3]</td><td>5（最大）</td><td>[3, 4] | 5</td></tr>
    <tr><td>6</td><td>[3, 4]</td><td>3（最小）</td><td>3 | [4]</td></tr>
    </tbody>
    </table>
    <p>pivot 是最大值时，i 越过其余元素与 j 交叉，pivot 和末尾元素交换，被换到最前的正好是当前最小值，所以下一层的 pivot 是最小值，原地不动。最后剩下的 4 只有一个元素，不再分区。</p>
    <p>共 6 = n − 1 层，各层处理 7, 6, 5, 4, 3, 2 个元素。一般地，逆序输入每层只少一个元素，T(n) = T(n−1) + cn，<strong>Θ(n²)</strong>。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">2. 用 1 到 7 构造一个输入，使取首元素作 pivot（课上的分区）时，每个 pivot 都是所在子数组的中位数。共几层？</summary>
  <div class="qa__body">
    <p>第一个元素必须是 4。若 {1, 2, 3} 放在下标 1..3、{5, 6, 7} 放在下标 4..6，则 i 停在下标 4，j 停在下标 3，中间不发生交换；最后 pivot 与 A[3] 交换。所以左边变成 [A[3], A[1], A[2]]，右边 [A[4], A[5], A[6]] 原样保留。只要 <strong>A[3] = 2、A[4] = 6</strong>，下一层的两个 pivot 就都是中位数。</p>
    <p>例如 <strong>[4, 1, 3, 2, 6, 5, 7]</strong>：第 1 层得 [2, 1, 3 | 4 | 6, 5, 7]；第 2 层 pivot 2 和 6 都是中位数，得 [1, 2, 3] 和 [5, 6, 7]，之后只剩单个元素。<strong>共 2 层</strong>，处理 7 + 6 = 13 个元素。</p>
    <p>常见错误是照 BST 前序写成 [4, 2, 1, 3, 6, 5, 7]：分区后被换到最前的是 A[3] = 3，左边变成 [3, 2, 1]，pivot 3 是最大值，不是中位数。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">3. 假设每次分区都把子数组分成 1/4 和 3/4 两部分。写出递推式；能直接用主定理吗？时间复杂度是多少？</summary>
  <div class="qa__body">
    <p>T(n) = T(n/4) + T(3n/4) + cn。两个子问题大小不同，不是 aT(n/b) + f(n) 的形式，<strong>不能直接用主定理</strong>。</p>
    <p>用递归树：同一层的子数组互不重叠，每层合计不超过 cn。最短的一支每层乘 1/4，前 log₄ n 层都是满的，每层约 cn，所以 T(n) ≥ 约 cn·log₄ n；最长的一支每层乘 3/4，共 log<sub>4/3</sub> n = log₂ n / log₂(4/3) ≈ 2.41 log₂ n 层，所以 T(n) ≤ 约 2.41 cn·log₂ n。上下界都是 n log n 量级，<strong>T(n) = Θ(n log n)</strong>。</p>
    <p>结论：只要每次按固定比例分（哪怕 1 : 99），都是 Θ(n log n)；只有每次一边只剩常数个元素时才是 Θ(n²)。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">4. 多选：(A) 快速排序的最坏情况只在输入已排好时出现。(B) 用三数取中后，快速排序的最坏情况是 Θ(n log n)。(C) 快速排序平均需要 O(log n) 的额外空间。(D) 问“快速排序的时间复杂度，给出最接近的上界”，应答 O(n²)。(E) 快速排序是稳定的。(F) 快速排序最好和最坏情况的复杂度不同，所以它对输入敏感。</summary>
  <div class="qa__body">
    <p><strong>C、D、F。</strong></p>
    <ul>
      <li>A 错：逆序、全部相等的输入同样是 n − 1 层。</li>
      <li>B 错：三数取中只救了有序和逆序输入；键全部相等时（课上的分区）仍是 Θ(n²)，也能专门构造让它退化的输入。</li>
      <li>C 对：递归栈深度平均 O(log n)；最坏 O(n)。</li>
      <li>D 对：没有指明情况时按最坏情况答。</li>
      <li>E 错：反例 [3, 2₁, 2₂] 排完是 [2₂, 2₁, 3]。</li>
      <li>F 对：运行时间取决于输入的排列。</li>
    </ul>
  </div>
</details>
`;

/* Post body — dsa-recurrences / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-recurrences:zh'] = `
<p class="lead">递归算法和减治算法的运行时间，先写成<strong>递推式（recurrence relation）</strong>：T(n) 等于更小规模的 T 加上这一层自己的工作。再用<strong>展开法（telescoping）</strong>一行行代入、消去中间项，得到闭式（closed form），复杂度就能直接读出。</p>

<h2>从代码写出递推式</h2>
<p>T(n) 是输入规模为 n 时执行的基本操作数，比较、赋值、一次算术都算一次。递归函数的一次调用只做两件事：调用自己去解更小的问题，以及除此之外的本层工作。把这两部分写成等式，再补上<strong>基本情况（base case）</strong>，就是递推式。</p>
<pre><code>/* 递归选择排序：把最小值换到 A[0]，再排剩下的 A[1..n-1] */
void sel_sort_rec(int A[], int n) {
    if (n &lt;= 1) return;                     /* 基本情况：T(1) = 常数 */
    int min = 0;
    for (int j = 1; j &lt; n; j++) {           /* n-1 次比较：cn */
        if (A[j] &lt; A[min]) min = j;
    }
    int tmp = A[0]; A[0] = A[min]; A[min] = tmp;   /* 交换：常数 */
    sel_sort_rec(A + 1, n - 1);             /* 递归 1 次，规模 n-1 */
}

/* 递归二分查找：在有序的 A[lo..hi] 里找 key，找不到返回 -1 */
int bin_search_rec(const int A[], int lo, int hi, int key) {
    if (lo &gt; hi) return -1;                 /* 空区间：常数 */
    int mid = (lo + hi) / 2;
    if (key == A[mid]) return mid;          /* 常数次比较：c */
    if (key &lt; A[mid]) {
        return bin_search_rec(A, lo, mid - 1, key);   /* 只进左半 */
    }
    return bin_search_rec(A, mid + 1, hi, key);       /* 或只进右半 */
}</code></pre>
<p>读代码分三步：</p>
<ol>
<li><strong>数递归调用</strong>：调用几次、每次规模多大。选择排序调用 1 次，规模 n−1，记 T(n−1)。二分查找的两个 <code>return</code> 只会执行一个，规模约为一半，记 T(n/2)。</li>
<li><strong>算本层工作</strong>：去掉递归调用后剩下的代价。找最小值的循环是 O(n)，<strong>写成 cn</strong>（c 是某个正常数，O 符号本身不能拿来做代数运算）；常数次操作写成 c。</li>
<li><strong>写基本情况</strong>：一个元素已经有序，T(1) 是常数。课上 T(1) = 0 和 T(1) = 1 都接受，公式表写作 T(1) = c。</li>
</ol>
<p>于是选择排序是 <strong>T(n) = T(n−1) + cn</strong>，二分查找是 <strong>T(n) = T(n/2) + c</strong>。二分查找剩下的其实不超过 ⌊n/2⌋ 个元素，课上直接写 n/2，在 Big-O 里没有区别；展开时默认 n 是 2 的幂，保证每次都能整除。</p>
<table>
<thead><tr><th>算法</th><th>递推式</th><th>描述哪种情况</th><th>解</th></tr></thead>
<tbody>
<tr><td>选择排序</td><td>T(n−1) + cn</td><td>所有输入</td><td>Θ(n²)</td></tr>
<tr><td>插入排序</td><td>T(n−1) + cn</td><td>最坏、平均（每次插入要移动 O(n) 个元素）</td><td>Θ(n²)</td></tr>
<tr><td>二分查找</td><td>T(n/2) + c</td><td>最坏（找不到，或最后一步才找到）</td><td>Θ(log n)</td></tr>
<tr><td>归并排序</td><td>2T(n/2) + cn</td><td>所有输入</td><td>Θ(n log n)</td></tr>
<tr><td>快速排序</td><td>2T(n/2) + cn</td><td>最好（pivot 每次都是中位数）</td><td>Θ(n log n)</td></tr>
<tr><td>快速排序</td><td>T(n−1) + cn</td><td>最坏（如已排序输入、取首元素作 pivot）</td><td>Θ(n²)</td></tr>
</tbody>
</table>
<p>快速排序（quicksort）先取一个元素作 pivot，用一次线性扫描的分区（partition）把比它小的放到左边、不小于它的放到右边，pivot 就到了最终位置，再递归排左右两段；插入排序（insertion sort）把第 i 个元素往前插进已排好的 A[0..i−1]，最坏要把前面的元素全部后移一格（两者详见第 5 部分）。所以快速排序一般是 T(n) = T(k) + T(n−1−k) + cn，k 是 pivot 左边的元素个数，由输入决定，所以一个式子只能描述一种情况：k ≈ n/2 是最好情况，k = 0 是最坏情况（T(0) 是常数，并进 cn）。归并排序的两半永远等长，三种情况是同一个式子。</p>

<h2>减一：T(n) = T(n−1) + cn</h2>
<p>先代数字。c = 1、T(1) = 0：T(2) = 0 + 2 = 2，T(3) = 2 + 3 = 5，T(4) = 5 + 4 = 9，也就是 T(4) = 4 + 3 + 2。一般情况把递推式对 n, n−1, …, 2 各写一行，每行都是把原式里的 n 换掉：</p>
<pre><code class="lang-text">T(n)   = T(n-1) + c·n
T(n-1) = T(n-2) + c·(n-1)
T(n-2) = T(n-3) + c·(n-2)
  ...
T(3)   = T(2)   + c·3
T(2)   = T(1)   + c·2
T(1)   = 0</code></pre>
<p>所有行左右两边分别相加。T(n−1)、T(n−2)、…、T(1) 在两边各出现一次，全部消掉，像望远镜一节节收拢，这就是 telescoping 的意思。剩下：</p>
<pre><code class="lang-text">T(n) = c·(n + (n-1) + ... + 3 + 2)
     = c·(n(n+1)/2 - 1)        ← 公式表上的等差求和，减去缺少的 1
     = c·(n+2)(n-1)/2
     ∈ Θ(n²)</code></pre>
<p>代回 n = 4、c = 1：6 × 3 / 2 = 9，和直接算的一致。闭式是精确等式，最高次项是 (c/2)·n²，所以是 Θ(n²)，自然也是 O(n²)。取 T(1) = 1 只会多出常数 1：<strong>基本情况的取值不改变复杂度</strong>。</p>
<p>快速排序的最坏情况是同一个式子：输入已经有序、总取第一个元素作 pivot，每次分区（partition）扫过全部 n 个元素，却只放好 pivot 自己，剩下 n−1 个接着排，所以也是 Θ(n²)。</p>
<div class="callout warn" data-label="易错">
<p>本层工作是常数时，<strong>T(n) = T(n−1) + c 只有 Θ(n)</strong>：n−1 个 c 相加。插入排序的最好情况（输入有序，每个新元素只比较 1 次）就是它。决定 n² 的不是“减一”，而是“每层约 cn，共 n 层”。</p>
</div>

<h2>减半：T(n) = T(n/2) + c</h2>
<p>n = 16 时搜索范围依次是 16、8、4、2、1，减半 4 次，每次花 c，所以 T(16) = T(1) + 4c，而 4 = log₂ 16。一般情况用<strong>反复代入（substitution）</strong>：把原式的 n 换成 n/2，得 T(n/2) = T(n/4) + c，代回第一行；再换成 n/4，依此类推：</p>
<pre><code class="lang-text">T(n) = T(n/2) + c
     = [T(n/4) + c] + c    = T(n/4) + 2c
     = [T(n/8) + c] + 2c   = T(n/8) + 3c
     ...
     = T(n/2^i) + i·c                     （第 i 步的通式）
令 2^i = n，即 i = log₂ n：
T(n) = T(1) + c·log₂ n  ∈ Θ(log n)</code></pre>
<p>“令 2<sup>i</sup> = n”就是一直代到子问题只剩 1 个元素、碰到基本情况为止，所有减半类题目都这样收尾。</p>

<h2>一分为二：T(n) = 2T(n/2) + cn</h2>
<p>归并排序（merge sort）把数组分成两半，两半各递归排序一次（2T(n/2)），再用线性时间合并（cn）。快速排序的最好情况也是这个式子，只是 cn 花在分区上。展开时每一步都要<strong>把括号外的系数乘进去</strong>：</p>
<pre><code class="lang-text">T(n) = 2T(n/2) + cn
     = 2[2T(n/4) + c·n/2] + cn    = 4T(n/4) + 2cn
     = 4[2T(n/8) + c·n/4] + 2cn   = 8T(n/8) + 3cn
     = 16T(n/16) + 4cn
     ...
     = 2^i·T(n/2^i) + i·cn
令 2^i = n，即 i = log₂ n：
T(n) = n·T(1) + cn·log₂ n = n + cn·log₂ n    （T(1) = 1）
     ∈ Θ(n log n)</code></pre>
<p>检验 n = 8、c = 1、T(1) = 1：T(2) = 2 × 1 + 2 = 4，T(4) = 2 × 4 + 4 = 12，T(8) = 2 × 12 + 8 = 32；闭式 8 + 8 × 3 = 32。这同时证明了快速排序的最好情况是 Θ(n log n)。</p>

<h2>递归树：每层代价 × 层数</h2>
<p>把每次调用画成一个结点、标上它的本层工作，得到<strong>递归树（recursion tree）</strong>。总代价是所有结点之和，按层加最方便。展开式的第 i 行，正好是第 0 到 i−1 层之和，加上第 i 层还没展开的子问题。</p>
<table>
<thead><tr><th>递推式</th><th>第 k 层（根是第 0 层）</th><th>层数</th><th>总和</th></tr></thead>
<tbody>
<tr><td>T(n−1) + cn</td><td>1 个结点，c(n−k)</td><td>n−1 层，加 1 个叶子</td><td>c(n + … + 2) + T(1)</td></tr>
<tr><td>T(n/2) + c</td><td>1 个结点，c</td><td>log₂ n 层，加 1 个叶子</td><td>c·log₂ n + T(1)</td></tr>
<tr><td>2T(n/2) + cn</td><td>2<sup>k</sup> 个结点 × c·n/2<sup>k</sup> = cn</td><td>log₂ n 层，加 n 个叶子</td><td>cn·log₂ n + n·T(1)</td></tr>
</tbody>
</table>
<iframe class="anim-frame" src="blog/blog_data/dsa-recurrences/anims/recursion-tree.html" loading="lazy" style="height: 520px;" title="递归树逐层求和"></iframe>
<p class="anim-caption">上方按钮切换三个递推式，按“下一步”逐层点亮：橙色是当前层，绿色是已计入总和的层，蓝色是叶子（基本情况）。右侧是本层合计，代价条以 n·c 为满格；最后一帧用 c = 1 把逐层之和与递推式直接算出的值对照。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>读代码写递推式</strong>：给一个递归函数，写出 T(n) 和基本情况。按三步：递归几次、每次规模多大、本层多少工作。常见变化：两个分支只走一个（只算 1 次 T）、循环之后再递归、规模减 2。</li>
<li><strong>展开求解</strong>：长题要写过程，标准写法是：代入两三行 → 第 i 步的通式 → 令 2<sup>i</sup> = n（减一类则一直写到 T(1) 再相加）→ 闭式 → Θ。</li>
<li><strong>选择 / 匹配</strong>：算法、递推式、复杂度三者对应，就是第一张表；快速排序要分清最好、最坏各对应哪个式子。</li>
<li><strong>和主定理分工</strong>：aT(n/b) + f(n) 形式可以直接套主定理（Master Theorem，见 1.9 主定理），几秒得出 Θ，但得不到闭式；T(n−1) + cn 这类减常数的式子主定理不适用，只能展开。题目要求用展开法时，主定理只能拿来核对。</li>
<li><strong>公式表上有</strong>：等差求和 n(n+1)/2、等比求和、对数恒等式、主定理。<strong>要自己记</strong>：各算法的递推式、展开格式、2<sup>i</sup> = n ⇒ i = log₂ n。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li>2T(n/2) + cn 代入时漏乘 2，写成 4T(n/4) + cn/2 + cn。第 i 行的非递归部分必须是 i·cn。</li>
<li>二分查找写成 2T(n/2) + c：两个递归分支只执行一个。快速排序、归并排序两半都要排，才是 2T(n/2)。</li>
<li>把 T(n−1) + c 当成 Θ(n²)，或把 T(n/2) + cn 当成 Θ(n log n)（见练习 1）。</li>
<li>减一展开是从 2 加到 n，套公式表的 n(n+1)/2 要减 1。只差常数，但闭式要写对。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. 写出下面函数 f 的递推式，并用展开法求出它的 Θ（设 n 是 2 的幂）。</summary>
<div class="qa__body">
<pre><code>int f(const int A[], int n) {
    if (n &lt;= 1) return A[0];
    int s = 0;
    for (int i = 0; i &lt; n; i++) {
        s += A[i];
    }
    return s + f(A, n / 2);
}</code></pre>
<p>循环 n 次，记 cn；递归 1 次，规模 n/2；n = 1 时直接返回，T(1) 是常数。所以 <strong>T(n) = T(n/2) + cn</strong>。</p>
<pre><code class="lang-text">T(n) = T(n/2) + cn
     = T(n/4) + cn/2 + cn
     = T(n/8) + cn/4 + cn/2 + cn
     ...
     = T(n/2^i) + cn·(1 + 1/2 + 1/4 + ... + 1/2^(i-1))
括号是公比 1/2 的等比求和：(1 - (1/2)^i) / (1 - 1/2) = 2(1 - 1/2^i)
令 2^i = n：T(n) = T(1) + 2cn·(1 - 1/n) = T(1) + 2c(n - 1)  ∈ Θ(n)</code></pre>
<p>检验 n = 16：循环共执行 16 + 8 + 4 + 2 = 30 = 2 × (16 − 1) 次。只递归 1 次的减半加上线性工作，结果是 <strong>Θ(n)，不是 Θ(n log n)</strong>：各层工作 cn、cn/2、cn/4… 越来越小，总和不超过 2cn。归并排序是 n log n，因为它递归 2 次，每层都是满的 cn。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 用分治法求数组最大值：分成两半，各递归求出最大值，再比较一次。写出递推式（T(1) = c），并用展开法求 Θ（设 n 是 2 的幂）。</summary>
<div class="qa__body">
<p>递归 2 次、规模各 n/2，本层只比较一次：<strong>T(n) = 2T(n/2) + c</strong>。</p>
<pre><code class="lang-text">T(n) = 2T(n/2) + c
     = 2[2T(n/4) + c] + c    = 4T(n/4) + 2c + c
     = 4[2T(n/8) + c] + 3c   = 8T(n/8) + 4c + 2c + c
     ...
     = 2^i·T(n/2^i) + c·(1 + 2 + ... + 2^(i-1))
     = 2^i·T(n/2^i) + c·(2^i - 1)          （公比 2 的等比求和）
令 2^i = n：T(n) = n·c + c(n - 1) = c(2n - 1)  ∈ Θ(n)</code></pre>
<p>检验 c = 1：T(2) = 3，T(4) = 7，T(8) = 15 = 2 × 8 − 1。这棵递归树每层的工作是 c、2c、4c…，越往下越多，最下面 n 个叶子占了大头。一维最近点对的分治（见 1.11 最近点对）也是这个式子；用主定理核对：a = 2，b = 2，d = 0，a &gt; b<sup>d</sup>，得 Θ(n<sup>log₂ 2</sup>) = Θ(n)。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 写出下面函数 g 的递推式并求 Θ。规模 n = hi − lo + 1，设 n 为偶数。</summary>
<div class="qa__body">
<pre><code>void g(int A[], int lo, int hi) {
    if (lo &gt;= hi) return;
    for (int i = lo; i &lt;= hi; i++) {
        A[i]++;
    }
    g(A, lo + 1, hi - 1);
}</code></pre>
<p>循环 n 次，记 cn；递归 1 次，两端各缩进 1，规模 n − 2；n = 0 时直接返回。<strong>T(n) = T(n−2) + cn，T(0) = 0</strong>。逐行写出再相加：</p>
<pre><code class="lang-text">T(n)   = T(n-2) + c·n
T(n-2) = T(n-4) + c·(n-2)
  ...
T(4)   = T(2)   + c·4
T(2)   = T(0)   + c·2
T(0)   = 0
相加消项：T(n) = c·(n + (n-2) + ... + 4 + 2) = 2c·(1 + 2 + ... + n/2)
              = 2c · (n/2)(n/2 + 1)/2 = cn(n + 2)/4  ∈ Θ(n²)</code></pre>
<p>检验 n = 6：循环共 6 + 4 + 2 = 12 次，6 × 8 / 4 = 12。减 2 只是把层数变成 n/2，每层的平均工作仍约为 cn/2，乘起来还是 n² 级；减去任何常数都一样。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 多选：下列哪些的运行时间是 Θ(n²)？(A) T(n) = T(n−1) + c　(B) T(n) = T(n−1) + cn　(C) T(n) = 2T(n/2) + cn　(D) 已排序输入、总取首元素作 pivot 的快速排序　(E) 已排序输入上的插入排序</summary>
<div class="qa__body">
<p><strong>B 和 D。</strong></p>
<ul>
<li>A：n−1 个 c 相加，Θ(n)。</li>
<li>B：c(n+2)(n−1)/2，Θ(n²)。</li>
<li>C：n·T(1) + cn·log₂ n，Θ(n log n)。</li>
<li>D：每次 pivot 都是最小值，左边为空、右边 n−1 个，T(n) = T(n−1) + cn，Θ(n²)。</li>
<li>E：每个新元素只比较 1 次，T(n) = T(n−1) + c，Θ(n)。</li>
</ul>
</div>
</details>
`;

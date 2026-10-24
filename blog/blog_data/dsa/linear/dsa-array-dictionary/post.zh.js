/* Post body — dsa-array-dictionary / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-array-dictionary:zh'] = `
<p class="lead">字典（dictionary）存进数组有两种放法。按到达顺序放（无序数组，unsorted array），查找只能逐个比较，O(n)；按键排好序（有序数组，sorted array），可以用二分查找（binary search）在 O(log n) 内找到，代价是每次插入都要移位（shift），逐个插入建立要 O(n²)。哪种更划算，取决于建好之后要查多少次。</p>

<h2>无序数组：逐个比较</h2>
<p>仿照课上的例子：每个键是一个单词（代表背后的一整条记录），9 个键按到达顺序存进数组：</p>
<pre><code class="lang-text">下标  0     1     2    3    4    5    6    7    8
A     goat  boat  dog  fly  cat  hat  ant  pig  lamp</code></pre>
<p>查 dog：A[0] = goat 不等，A[1] = boat 不等，A[2] = dog 相等，比较 3 次。查 cow：9 个全部比完都不等，才能断定不在。这就是<strong>线性查找（linear search）</strong>：最好情况（best case）目标是第一个，1 次；<strong>最坏情况（worst case）是目标在最后或根本不存在，n 次</strong>；平均约 n/2 次（推导见 1.7）。所以 <strong>find 是 O(n)</strong>。</p>
<p>插入和删除的代价取决于位置（先假设容量足够，容量不够见 2.6 动态数组）：</p>
<ul>
<li><strong>插在末尾 O(1)</strong>：<code>A[n] = key; n++;</code>，新键直接放进下标 9。前提是不检查键是否重复。</li>
<li><strong>插在开头 O(n)</strong>：数组只记着 A[0] 的地址，A[0] 前面的内存不归它用，只能把 n 个元素全部后移一格，腾出 A[0]。</li>
<li><strong>删除 A[0] 是 O(n)</strong>：后面 n − 1 个元素都要前移一格补上空位。删最后一个只需 <code>n--</code>，O(1)。</li>
</ul>
<p>按键删除要先 find。键在下标 k 时比较 k + 1 次，再前移 n − 1 − k 个，合计恰好 n 步，删哪个都是 Θ(n)。无序数组不在乎顺序，也可以把末尾元素搬进空位，删除本身变成 O(1)，但前面的 find 最坏仍是 O(n)。</p>

<h2>有序数组：二分查找</h2>
<p>同样 9 个单词按字母序排好：</p>
<pre><code class="lang-text">下标  0    1     2    3    4    5     6    7     8
A     ant  boat  cat  dog  fly  goat  hat  lamp  pig</code></pre>
<p>查 dog，每次只看候选范围正中间的元素：</p>
<table>
<thead><tr><th>步</th><th>候选范围</th><th>个数</th><th>mid</th><th>A[mid]</th><th>比较</th><th>结果</th></tr></thead>
<tbody>
<tr><td>1</td><td>[0, 8]</td><td>9</td><td>4</td><td>fly</td><td>dog &lt; fly</td><td>丢掉 fly 及右边，剩 [0, 3]</td></tr>
<tr><td>2</td><td>[0, 3]</td><td>4</td><td>2</td><td>cat</td><td>dog &gt; cat</td><td>丢掉 cat 及左边，剩 [3, 3]</td></tr>
<tr><td>3</td><td>[3, 3]</td><td>1</td><td>3</td><td>dog</td><td>相等</td><td>找到，共 3 次</td></tr>
</tbody>
</table>
<p>第 2 步剩 4 个，没有正中间的元素。<strong>课上的规则是偶数个时向上取整</strong>，取靠右的 cat（下标 2），而不是 boat（下标 1）。第 3 步只剩一个元素也<strong>必须再比一次</strong>，因为目标可能根本不在数组里。查 cow 时前两步完全一样，第 3 步 cow &lt; dog，范围变空，比较 3 次后断定不在。</p>
<p>规则：中间元素等于目标就找到；目标更小只留左半，更大只留右半；范围为空就结束，目标不在。它依赖两个前提：</p>
<ul>
<li><strong>数组有序</strong>：比一次就知道目标在哪一半，另一半整个丢掉。无序数组做不到。</li>
<li><strong>O(1) 随机访问（random access）</strong>：知道下标就能直接取 A[mid]（地址 = 起始地址 + mid × 元素大小，见 2.2）。有序链表要从头走才能到中间，所以不能二分（见 2.5）。</li>
</ul>
<p><strong>为什么是 O(log n)</strong>：每次没找到，范围至少减半，9 个最多剩 4、2、1 个。比了 k 次说明元素约有 2<sup>k</sup> 个，令 2<sup>k</sup> = n，得 k = log₂ n。准确地说，第 k 次比较时范围最多剩 n/2<sup>k−1</sup> 个，至少还得有 1 个，所以<strong>最坏比较 ⌊log₂ n⌋ + 1 次</strong>：n = 9 时 4 次，n = 10⁶ 时 20 次，而线性查找最坏要 10⁶ 次。写成递推式 T(n) = T(n/2) + c 的解法见 1.8。</p>

<h3>C 实现与循环不变式</h3>
<pre><code>/* find key in sorted A[0..n-1]; return its index, or -1 if absent */
int binary_search(const int A[], int n, int key) {
    int lo = 0, hi = n - 1;
    /* invariant: if key is in A, it is in A[lo..hi] */
    while (lo &lt;= hi) {
        int mid = lo + (hi - lo + 1) / 2;   /* even count: right middle */
        if (key == A[mid]) {
            return mid;
        } else if (key &lt; A[mid]) {
            hi = mid - 1;                   /* A[mid..hi] &gt; key: drop */
        } else {
            lo = mid + 1;                   /* A[lo..mid] &lt; key: drop */
        }
    }
    return -1;                              /* lo &gt; hi: range is empty */
}

/* insert key into sorted A[0..*n-1]; assumes capacity &gt; *n */
void sorted_insert(int A[], int *n, int key) {
    int lo = 0, hi = *n - 1;
    while (lo &lt;= hi) {                      /* O(log n): find the slot */
        int mid = lo + (hi - lo + 1) / 2;
        if (key &lt; A[mid]) {
            hi = mid - 1;
        } else {
            lo = mid + 1;
        }
    }
    /* now A[0..lo-1] &lt;= key &lt; A[lo..*n-1] */
    for (int i = *n; i &gt; lo; i--) {         /* O(n): shift right, back first */
        A[i] = A[i - 1];
    }
    A[lo] = key;
    (*n)++;
}</code></pre>
<p><code>lo</code>、<code>hi</code> 是候选范围的两端。正确性靠一条<strong>循环不变式（loop invariant）</strong>：<strong>如果 key 在数组里，它一定在 A[lo..hi] 中</strong>。开始时范围是整个数组，成立。key &lt; A[mid] 时，数组升序，A[mid..hi] 都大于 key，令 hi = mid − 1 不会把它丢掉；另一边同理。循环只有两种结束方式：找到并返回下标；或 lo &gt; hi，范围为空，由不变式可知 key 不在。键是字符串时，把 <code>==</code> 和 <code>&lt;</code> 换成 <code>strcmp(key, A[mid])</code> 与 0 比较。</p>
<ul>
<li><strong>取整</strong>：<code>lo + (hi - lo + 1) / 2</code> 向上取整，和课上的例子一致；多数教材写 <code>lo + (hi - lo) / 2</code>，向下取整。两种都正确、复杂度相同，但比较序列不同：向下取整查 dog 依次比 fly、boat、cat、dog，要 4 次。题目给了规则就照做。不写 <code>(lo + hi) / 2</code>，是因为数组很大时 lo + hi 可能超出 int 范围。</li>
<li><strong>查不到时 lo 就是插入位置</strong>：循环结束于 lo = hi + 1。查 cow 结束时 lo = 3，正是 cat 和 dog 之间。<code>sorted_insert</code> 用的就是这一点。</li>
<li><strong>边界</strong>：条件必须是 <code>lo &lt;= hi</code>，写成 <code>lo &lt; hi</code> 会漏掉最后剩一个时的那次比较（练习 2）。<code>hi = mid</code> 代替 <code>hi = mid - 1</code> 会死循环：范围 [0, 1] 向上取整得 mid = 1，若 key &lt; A[1]，hi 还是 1。</li>
</ul>

<iframe class="anim-frame" src="blog/blog_data/dsa-array-dictionary/anims/binary-search.html" loading="lazy" style="height: 450px;" title="二分查找步进"></iframe>
<p class="anim-caption">下拉框选目标（下面一组不在数组里），可切换偶数个时的取整方向，再按播放或下一步：看 lo、hi 怎样收拢，比较次数怎样累加。</p>

<h2>往有序数组插入：移位才是大头</h2>
<p>把 cow 插进上面的有序数组：二分查找比 fly、cat、dog 共 3 次，结束时 lo = 3；再把 A[3..8] 共 6 个元素各后移一格，最后写入 A[3] = cow。查位置 O(log n)，<strong>移位最坏 O(n)</strong>，一次插入是 O(log n + n) = O(n)。删除同理：二分找到后把后面的元素前移，也是 O(n)。</p>
<div class="callout warn" data-label="易错">
<p>后移必须<strong>从后往前</strong>搬，所以 <code>sorted_insert</code> 里 i 从 *n 往下数。若从前往后写 <code>A[i + 1] = A[i]</code>，A[lo] 的值会被一路复制下去：在 {1, 2, 3} 的下标 0 处腾位，结果是 {1, 1, 1, 1}，原来的 2、3 全被覆盖。删除时前移，方向相反，要从前往后搬。</p>
</div>
<p><strong>逐个插入建立有序数组</strong>（build = n 次 insert）：第 i 次插入时已有 i − 1 个元素，最坏全部后移。键按从大到小到达时，每个都插在最前面，移位总数 0 + 1 + … + (n − 1) = n(n − 1)/2，所以 <strong>build 是 O(n²)，不是 O(n log n)</strong>。课上有同学答 O(n log n)，那只算了 n 次二分查找、漏了移位，而 n² 支配 n log n。键按从小到大到达时一次都不用移，只剩查找，Θ(n log n)；随机顺序平均移位约 n²/4 次，仍是 Θ(n²)。如果允许整体建立，先放入全部 n 个键再用第 5 部分 O(n log n) 的排序排一次更快。</p>
<table>
<thead><tr><th>操作</th><th>无序数组</th><th>有序数组</th></tr></thead>
<tbody>
<tr><td>按下标访问</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td>find</td><td>最好 Θ(1)，最坏 Θ(n)</td><td>最好 Θ(1)（第一次就比中），最坏 Θ(log n)</td></tr>
<tr><td>insert</td><td>Θ(1)（追加到末尾）</td><td>最好 Θ(log n)（比所有键都大），最坏 Θ(n)（比所有键都小）</td></tr>
<tr><td>delete（按键）</td><td>移位时恒为 Θ(n)；末尾补位时最好 Θ(1)，最坏 Θ(n)</td><td>最好 Θ(log n)（删最后一个），最坏 Θ(n)（删第一个）</td></tr>
<tr><td>build（n 次 insert）</td><td>Θ(n)</td><td>最好 Θ(n log n)（升序到达），最坏 Θ(n²)</td></tr>
</tbody>
</table>

<h2>要不要排序：n 次插入 + m 次查找</h2>
<p>课上的问题：先插入 n 个键建好字典，再做 m 次查找。</p>
<table>
<thead><tr><th></th><th>建立</th><th>m 次查找</th><th>合计</th></tr></thead>
<tbody>
<tr><td>无序数组</td><td>O(n)</td><td>m × O(n)</td><td>O(n + mn) = <strong>O(mn)</strong></td></tr>
<tr><td>有序数组</td><td>O(n²)</td><td>m × O(log n)</td><td><strong>O(n² + m log n)</strong></td></tr>
</tbody>
</table>
<p>n 和 m 都是输入，哪个都不能随便丢。取 n = 1000（log₂ n ≈ 10），按主项、常数取 1 粗算：m = 10 时，无序约 1.1 × 10⁴，有序约 10⁶，<strong>不排序</strong>；m = 10⁵ 时，无序约 10⁸，有序约 2 × 10⁶，<strong>排序划算</strong>。令 n² + m log n = mn，得 m = n²/(n − log n)，n = 1000 时约 1010，也就是 m ≈ n。所以 <strong>m 明显小于 n 时不排序，明显大于 n 时排序</strong>：排序不总是更好，要看用法。链表的两行见 2.5。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>手算二分查找</strong>：给有序数组和目标，写出每步的 lo、hi、mid 或被比较的元素，数比较次数。目标常故意不在数组里，或让范围出现偶数个；按题目给的取整规则做。</li>
<li><strong>写 C</strong>：迭代版二分查找、有序数组的插入或删除。自查 <code>lo &lt;= hi</code>、<code>mid ± 1</code>、移位方向和 <code>n</code> 的更新。</li>
<li><strong>填复杂度</strong>：上面两张表。开头插入 O(n)、末尾插入 O(1)；有序数组 find O(log n)，insert、delete O(n)，逐个插入建立 O(n²)。</li>
<li><strong>n 次插入 + m 次查找</strong>：写出 O(mn) 和 O(n² + m log n)，按 m、n 的大小关系选结构。</li>
<li>要记住：最坏比较 ⌊log₂ n⌋ + 1 次、2<sup>k</sup> = n 的推导、二分的两个前提（有序、随机访问）。公式表上用得到的只有对数恒等式和等差数列求和，n(n − 1)/2 要自己套。</li>
<li>陷阱：build 答成 O(n log n)；以为有序链表也能二分；二分查找最好情况 Θ(1)，所以不带情况说“二分查找是 Θ(log n)”是错的（见 1.7）。</li>
</ul>

<h2>练习</h2>

<details class="qa">
<summary class="ripple-surface">1. 有序数组 A[0..11] = 4, 9, 13, 18, 22, 27, 31, 36, 40, 45, 51, 58，按课上的规则（偶数个取靠右的中间）二分查找。(a) 查 40，依次比较哪些元素？(b) 查 20 呢？结束时 lo、hi 各是多少？(c) 改成向下取整，查 40 要比较几次？</summary>
<div class="qa__body">
<p>mid = lo + (hi − lo + 1)/2。</p>
<pre><code class="lang-text">(a) [0,11] 12 个  mid=6  A[6]=31  40 &gt; 31  lo=7
    [7,11]  5 个  mid=9  A[9]=45  40 &lt; 45  hi=8
    [7,8]   2 个  mid=8  A[8]=40  找到
(b) [0,11] 12 个  mid=6  A[6]=31  20 &lt; 31  hi=5
    [0,5]   6 个  mid=3  A[3]=18  20 &gt; 18  lo=4
    [4,5]   2 个  mid=5  A[5]=27  20 &lt; 27  hi=4
    [4,4]   1 个  mid=4  A[4]=22  20 &lt; 22  hi=3   lo=4 &gt; hi=3，不在</code></pre>
<p>(a) 比较 31、45、40，共 3 次。(b) 比较 31、18、27、22，共 4 次，正是 n = 12 时的最坏值 ⌊log₂ 12⌋ + 1 = 4。结束时 lo = 4、hi = 3，lo = 4 就是 20 的插入位置（18 与 22 之间）。</p>
<p>(c) 向下取整时 mid = lo + (hi − lo)/2：[0, 11] 的 mid = 5，A[5] = 27，40 &gt; 27，lo = 6；[6, 11] 的 mid = 8，A[8] = 40，找到。只要 <strong>2 次</strong>。取整方向一变，比较序列就变。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 把 binary_search 的循环条件改成 while (lo &lt; hi)，其余不变。在 A = {10, 20, 30, 40, 50, 60, 70} 里分别查这 7 个键，哪些会错误地返回 −1？为什么？</summary>
<div class="qa__body">
<p><strong>10、30、50、70 返回 −1</strong>，20、40、60 能找到。</p>
<p>以 30 为例：[0, 6] 的 mid = 3，30 &lt; 40，hi = 2；[0, 2] 的 mid = 1，30 &gt; 20，lo = 2。此时 lo = hi = 2，范围里正好剩下 A[2] = 30，但 lo &lt; hi 不成立，循环直接退出，返回 −1。</p>
<p>正确版本里这 4 个键都要比 3 次，第 3 次比较时范围恰好只剩一个元素，错误版本把这一次省掉了；20、40、60 在范围还有 3 个或 7 个时就比中了，不受影响。n = 1 的数组则什么都找不到。改回 <code>while (lo &lt;= hi)</code>。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 某系统先逐个插入 n = 10⁴ 条记录，之后 (a) 只查 100 次；(b) 查 10⁶ 次。各该用无序数组还是有序数组？另有人说“有序数组每次插入只需二分查找 O(log n)，所以建立是 O(n log n)”，错在哪里？</summary>
<div class="qa__body">
<p>log₂ 10⁴ ≈ 13.3，按主项粗算：</p>
<p>(a) 无序 mn = 100 × 10⁴ = 10⁶；有序 n² + m log n ≈ 10⁸ + 1330 ≈ 10⁸。<strong>用无序数组</strong>，建有序数组的 10⁸ 次移位远超查找省下的时间。</p>
<p>(b) 无序 mn = 10¹⁰；有序 ≈ 10⁸ + 1.33 × 10⁷ ≈ 1.1 × 10⁸。<strong>用有序数组</strong>，约快 90 倍。分界点 m = n²/(n − log n) ≈ 10⁴，与 n 相当。</p>
<p>那句话漏了移位：二分只找到位置，还要把位置后面的元素全部后移，最坏 O(n)。键按降序到达时总移位 n(n − 1)/2，所以建立是 O(n²)。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 写 int sorted_delete(int A[], int *n, int key)：从升序数组 A[0..*n−1]（键互不相同）删除 key，删掉返回 1，不在返回 0，可调用上面的 binary_search。再给出最好、最坏情况。</summary>
<div class="qa__body">
<pre><code>/* delete key from sorted A[0..*n-1]; return 1 if deleted, 0 if absent */
int sorted_delete(int A[], int *n, int key) {
    int k = binary_search(A, *n, key);      /* O(log n) */
    if (k == -1) {
        return 0;
    }
    for (int i = k; i &lt; *n - 1; i++) {      /* O(n): shift left, front first */
        A[i] = A[i + 1];
    }
    (*n)--;
    return 1;
}</code></pre>
<p>前移要从 k 开始往后搬，否则会把还没搬的元素覆盖掉。例：{10, 20, 30, 40, 50} 删 20，得 {10, 30, 40, 50}，*n 变成 4；再删 35 返回 0，数组不变。</p>
<p>代价 = 二分查找 + 前移 *n − 1 − k 个。<strong>最坏 Θ(n)</strong>：删 A[0]，约 log n 次比较再前移 n − 1 个。<strong>最好 Θ(log n)</strong>，不是 Θ(1)：第一次就比中的是正中间的元素，之后还要前移约 n/2 个；删最后一个元素不用移，但二分要比约 log n 次才走到末尾。key 不在时同样是 Θ(log n)。</p>
</div>
</details>
`;

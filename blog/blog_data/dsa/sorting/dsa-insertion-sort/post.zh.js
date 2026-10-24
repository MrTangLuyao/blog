/* Post body — dsa-insertion-sort / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-insertion-sort:zh'] = `
<p class="lead">插入排序（insertion sort）像整理手里的牌：数组前段始终有序，每轮取出下一个元素，把有序部分里比它大的元素逐个右移一格，再把它放进空出来的位置。已排序的输入只要 n − 1 次比较，逆序输入要 n(n − 1)/2 次；它稳定、原地，对几乎有序的输入很快。</p>

<h2>思路：往有序的牌里插一张</h2>
<p>手里已有排好的 2、5、9，又摸到一张 7：先看最右边的 9，比 7 大，往右挪一格；再看 5，不比 7 大，停下，7 放进空出来的位置，手里变成 2、5、7、9。每摸一张牌，就是往一个有序序列里插入一个元素。</p>
<p>数组里做法相同。把 A[0] 单独看作长度为 1 的<strong>有序前缀（sorted prefix）</strong>，然后对 i = 1, 2, …, n − 1 各做一轮：</p>
<ol>
<li>把 A[i] 存进临时变量 <code>val</code>，下标 i 空出来；</li>
<li>j 从 i − 1 往左看，只要 <strong>A[j] &gt; val</strong>，就把 A[j] 右移到 A[j + 1]，空位跟着左移一格；</li>
<li>遇到 A[j] ≤ val，或 j 走到 −1（已到最前面）就停，把 val 写进 A[j + 1]。</li>
</ol>
<p>课上先把第 2 步描述成“和前面的元素交换，直到前面的不比它大”。代码里不交换，而是用 <code>val</code> 加右移：比较次数一样，右移一格只要 1 次赋值，交换要 3 次。</p>

<h2>完整追踪：[2, 0, 9, 7, 1, 5, 2]</h2>
<p>课上的数组。两个 2 记作 2₁、2₂，用来观察稳定性。“比较对象”按顺序列出和 val 比过的元素，<code>|</code> 左边是有序前缀。</p>
<table>
<thead><tr><th>轮 i</th><th>val</th><th>比较对象</th><th>比较</th><th>移位</th><th>本轮结束后</th></tr></thead>
<tbody>
<tr><td>1</td><td>0</td><td>2₁（右移），到最前面</td><td>1</td><td>1</td><td>0 2₁ | 9 7 1 5 2₂</td></tr>
<tr><td>2</td><td>9</td><td>2₁（停）</td><td>1</td><td>0</td><td>0 2₁ 9 | 7 1 5 2₂</td></tr>
<tr><td>3</td><td>7</td><td>9（右移）、2₁（停）</td><td>2</td><td>1</td><td>0 2₁ 7 9 | 1 5 2₂</td></tr>
<tr><td>4</td><td>1</td><td>9、7、2₁（右移）、0（停）</td><td>4</td><td>3</td><td>0 1 2₁ 7 9 | 5 2₂</td></tr>
<tr><td>5</td><td>5</td><td>9、7（右移）、2₁（停）</td><td>3</td><td>2</td><td>0 1 2₁ 5 7 9 | 2₂</td></tr>
<tr><td>6</td><td>2₂</td><td>9、7、5（右移）、2₁（相等，停）</td><td>4</td><td>3</td><td>0 1 2₁ 2₂ 5 7 9</td></tr>
</tbody>
</table>
<p>合计比较 15 次、移位 10 次。两条规律可以拿来自查：</p>
<ul>
<li><strong>一轮的比较次数 = 移位次数 + 1</strong>，多出的那次是让循环停下的比较。只有 val 一路移到最前面的那轮（这里是第 1 轮）两者相等：循环因 j = −1 结束，没有那次比较。</li>
<li><strong>有序前缀只是彼此有序，不是已经就位。</strong>第 3 轮后前缀是 0 2₁ 7 9，之后 2₁、7、9 都还要右移。选择排序（见 5.2）每轮确定的元素才是最终位置，判断题常拿这一点出题。</li>
</ul>

<iframe class="anim-frame" src="blog/blog_data/dsa-insertion-sort/anims/insertion.html" loading="lazy" style="height: 440px;" title="插入排序步进"></iframe>
<p class="anim-caption">选一组输入后按播放或下一步：val 浮在空位上方，比它大的元素一格格右移，空位左移到停止处再落下；看比较、移位计数在已排序、逆序、几乎有序三种输入下差多少。</p>

<h2>C 实现</h2>
<pre><code>#include &lt;stdio.h&gt;

/* sort A[0..n-1] into non-decreasing order */
void insertion_sort(int A[], int n) {
    int i, j, val;
    for (i = 1; i &lt; n; i++) {              /* A[0..i-1] is sorted */
        val = A[i];                        /* lift out the next element */
        for (j = i - 1; j &gt;= 0 &amp;&amp; A[j] &gt; val; j--) {
            A[j + 1] = A[j];               /* shift a larger key right */
        }
        A[j + 1] = val;                    /* drop it into the gap */
    }
}

int main(void) {
    int A[] = {2, 0, 9, 7, 1, 5, 2};
    int n = sizeof(A) / sizeof(A[0]), i;
    insertion_sort(A, n);
    for (i = 0; i &lt; n; i++) {
        printf("%d ", A[i]);
    }
    printf("\\n");                          /* 0 1 2 2 5 7 9 */
    return 0;
}</code></pre>
<ul>
<li><strong><code>j &gt;= 0</code> 必须写在 <code>&amp;&amp;</code> 左边</strong>：短路求值保证 j = −1 时不会去读 A[−1]。</li>
<li>内层循环结束时，j 停在第一个不大于 val 的元素上（或 −1），<strong>空位是 j + 1</strong>，不是 j。</li>
<li>比较用严格的 <code>&gt;</code>，遇到相等的键就停。写成 <code>&gt;=</code> 仍能排好序，但第 6 轮 2₂ 会多比 1 次、越过 2₁，结果变成 0 1 2₂ 2₁ …，排序就不稳定了（练习 3）。</li>
</ul>
<p>课上口头描述的交换写法如下，结果和比较次数都相同，只是每一步是 3 次赋值的交换：</p>
<pre><code>for (i = 1; i &lt; n; i++)
    for (j = i; j &gt; 0 &amp;&amp; A[j - 1] &gt; A[j]; j--)
        swap(&amp;A[j - 1], &amp;A[j]);           /* 3 assignments per step */</code></pre>

<h2>复杂度</h2>
<h3>插入一个元素</h3>
<p>课上的例子：有序前缀 0 2 7 9，后面来了一个未知的 ?。前缀长度记为 i（这里 i = 4）：</p>
<ul>
<li><strong>最好</strong>：? 比 9 大（10、20、100 都行），比较 1 次、移位 0 次，原地不动。</li>
<li><strong>最坏</strong>：? 比所有元素都小，i 个元素全部右移，比较 i 次、移位 i 次。</li>
<li><strong>平均</strong>：? 落在 i + 1 个位置中任一个的可能性相同，平均约移动 i/2 个。</li>
</ul>
<h3>整个算法</h3>
<table>
<thead><tr><th>情况</th><th>输入</th><th>比较总数</th><th>移位总数</th><th>时间</th></tr></thead>
<tbody>
<tr><td>最好</td><td>已排序</td><td>n − 1</td><td>0</td><td><strong>Θ(n)</strong></td></tr>
<tr><td>最坏</td><td>严格逆序</td><td>1 + 2 + … + (n − 1) = n(n − 1)/2</td><td>n(n − 1)/2</td><td><strong>Θ(n²)</strong></td></tr>
<tr><td>平均</td><td>随机顺序</td><td>约 n²/4</td><td>约 n²/4</td><td><strong>Θ(n²)</strong></td></tr>
</tbody>
</table>
<p>n = 7 时，已排序的 [1, 2, …, 7] 比较 6 次、移位 0 次；逆序的 [7, 6, …, 1] 比较、移位各 21 次。平均情况大约是最坏的一半，n²/4 仍是 Θ(n²)。写成递推式：最坏 T(n) = T(n − 1) + cn，展开得 Θ(n²)；最好 T(n) = T(n − 1) + c，只有 Θ(n)（见 1.8）。因此“插入排序是 O(n²)”成立，但不分情况说“插入排序是 Θ(n²)”是错的（见 1.7）。额外空间只有 i、j、val，<strong>O(1)</strong>。</p>

<h2>二分查找救不了它</h2>
<p>前缀有序，插入位置可以用二分查找（binary search）来找。把 1 插进 0 2 7 9：二分查找两三次比较就知道 1 该放在下标 1，可 2、7、9 <strong>还是要各右移一格</strong>。val 比前缀里所有元素都小时，位置找得再快，也得移动 i 个元素。</p>
<ul>
<li>比较次数降到每轮 O(log i)，总共 O(n log n)；</li>
<li><strong>移位次数不变，最坏仍是 n(n − 1)/2，时间复杂度仍是 Θ(n²)</strong>；</li>
<li>已排序输入反而更慢：原版每轮比 1 次就停，二分版每轮都要比约 log₂ i 次，最好情况从 Θ(n) 变成 Θ(n log n)。n = 1000 的有序数组，原版比较 999 次，二分版约 8000 次。</li>
</ul>

<h2>性质与用途</h2>
<ul>
<li><strong>稳定（stable）</strong>：元素只越过严格比它大的键，碰到相等的键就停，相等键的先后顺序不变（上表第 6 轮 2₂ 停在 2₁ 后面）。</li>
<li><strong>原地（in-place）</strong>：额外空间 O(1)。</li>
<li><strong>自适应（adaptive）</strong>：同样是 n 个元素，越接近有序越快。课上对“几乎有序”只有直观说法（大部分元素已在正确位置附近），可以这样量化：前面的元素比后面的大，这样一对叫一个逆序（inversion），每次右移恰好消掉一个，所以<strong>移位总数 = 输入中的逆序数</strong>。课上数组有 10 个逆序，正好移位 10 次；[1, 2, 3, 5, 4, 6, 7, 8] 只有 (5, 4) 一个，比较 8 次、移位 1 次。</li>
</ul>
<p>所以插入排序适合<strong>规模小</strong>或<strong>几乎有序</strong>的输入：常数开销小、没有递归、只访问相邻内存。n 很小时它甚至比 O(n log n) 的排序还快，于是混合排序（hybrid sort）在快速排序或归并排序把子数组切到阈值以下（常取 10～30）时改用插入排序，细节见 5.9。随机顺序的大数组上 Θ(n²) 太慢。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>手算</strong>：给一个数组，写出外层循环每轮之后的数组，或数比较、移位次数。用“比较 = 移位 + 1（移到最前面的那轮除外）”自查。</li>
<li><strong>最好/最坏输入</strong>：已排序 → n − 1 次比较，Θ(n)；严格逆序 → n(n − 1)/2 次比较和移位，Θ(n²)；平均 Θ(n²)。等差数列求和在公式表上，但哪种输入对应哪种情况要自己记。</li>
<li><strong>简答</strong>：为什么二分查找不能把插入排序降到 O(n log n)：定位变快，移位仍是线性。</li>
<li><strong>写 C</strong>：val 加右移的版本，检查三处：<code>j &gt;= 0</code> 写在前面、比较用 <code>&gt;</code>、循环结束后写 <code>A[j + 1] = val</code>。</li>
<li><strong>性质判断</strong>：稳定、原地、自适应三个都是“是”；选择排序是原地，但不稳定、不自适应，对比着记。</li>
<li>陷阱：以为第 k 轮后前 k + 1 个元素已在最终位置（那是选择排序）；<code>&gt;</code> 写成 <code>&gt;=</code>；不分情况说 Θ(n²)；以为二分查找能改善时间复杂度。</li>
</ul>

<h2>练习</h2>

<details class="qa">
<summary class="ripple-surface">1. 用上面的 C 代码对 [6, 3₁, 8, 3₂, 1, 7] 排序。写出每轮结束后的数组和该轮的比较、移位次数。最后 3₁ 和 3₂ 谁在前？</summary>
<div class="qa__body">
<table>
<thead><tr><th>轮 i</th><th>val</th><th>比较对象</th><th>比较</th><th>移位</th><th>本轮结束后</th></tr></thead>
<tbody>
<tr><td>1</td><td>3₁</td><td>6（右移），到最前面</td><td>1</td><td>1</td><td>3₁ 6 | 8 3₂ 1 7</td></tr>
<tr><td>2</td><td>8</td><td>6（停）</td><td>1</td><td>0</td><td>3₁ 6 8 | 3₂ 1 7</td></tr>
<tr><td>3</td><td>3₂</td><td>8、6（右移）、3₁（相等，停）</td><td>3</td><td>2</td><td>3₁ 3₂ 6 8 | 1 7</td></tr>
<tr><td>4</td><td>1</td><td>8、6、3₂、3₁（右移），到最前面</td><td>4</td><td>4</td><td>1 3₁ 3₂ 6 8 | 7</td></tr>
<tr><td>5</td><td>7</td><td>8（右移）、6（停）</td><td>2</td><td>1</td><td>1 3₁ 3₂ 6 7 8</td></tr>
</tbody>
</table>
<p>合计比较 11 次、移位 8 次。自查：第 1、4 轮移到最前面，比较 = 移位；其余三轮比较 = 移位 + 1，所以 11 = 8 + 3。<strong>3₁ 在前</strong>：第 3 轮 3₂ 碰到相等的 3₁ 就停了，第 4 轮 1 越过它们时两者一起右移，相对顺序不变。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. n = 10，对下列输入做插入排序，各比较几次、移位几次？(a) 1, 2, …, 10　(b) 10, 9, …, 1　(c) 2, 1, 4, 3, 6, 5, 8, 7, 10, 9。(c) 这种“两两交换”的输入推广到 n 个元素（n 为偶数），时间复杂度是多少？</summary>
<div class="qa__body">
<p>(a) 每轮比 1 次就停：<strong>比较 9 次，移位 0 次</strong>。</p>
<p>(b) 第 i 轮移到最前面，比较、移位各 i 次：1 + 2 + … + 9 = <strong>45 次比较，45 次移位</strong>。</p>
<p>(c) 逐轮看：第 1 轮 val = 1，2 右移后到最前面，比较 1、移位 1。第 2、4、6、8 轮 val 是 4、6、8、10，比前一个大，各比较 1 次、不移位。第 3、5、7、9 轮 val 是 3、5、7、9，前一个元素大 1，右移一个后再比一次就停，各比较 2、移位 1。合计比较 1 + 4 + 8 = <strong>13 次</strong>，移位 1 + 4 = <strong>5 次</strong>。</p>
<p>推广：移位 n/2 次，比较 1 + (n − 2)/2 + 2 × (n − 2)/2 = (3n − 4)/2 次，都是线性，<strong>Θ(n)</strong>。每个元素离最终位置只差一格，正是“几乎有序”，插入排序的自适应性在这里体现出来。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 把内层循环条件改成 A[j] &gt;= val，其余不变。(a) 结果还是非递减吗？(b) 用 [2₁, 2₂, 2₃] 判断它是否稳定。(c) 输入是 n 个相等的元素时，原版和改版各比较、移位几次？</summary>
<div class="qa__body">
<p>(a) <strong>是</strong>。改版只在遇到严格更小的元素时停下，val 被放到所有不小于它的元素前面，前缀仍然有序。</p>
<p>(b) 第 1 轮 val = 2₂，2₁ ≥ 2₂，右移，到最前面：2₂ 2₁ 2₃。第 2 轮 val = 2₃，2₁、2₂ 都右移：2₃ 2₂ 2₁。相等元素的顺序完全倒过来，<strong>不稳定</strong>。</p>
<p>(c) 原版每轮比 1 次就停，<strong>n − 1 次比较、0 次移位</strong>，Θ(n)。改版每个新元素都移到最前面，第 i 轮比较、移位各 i 次，<strong>各 n(n − 1)/2 次</strong>，Θ(n²)。n = 10 时是 9 次对 45 次：一个等号把全相等输入从最好情况变成了最坏情况。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 多选：在有序前缀上用二分查找确定插入位置，然后照常右移、放入。下列哪些正确？(A) 最坏情况下比较总次数为 O(n log n)　(B) 最坏情况时间复杂度变为 Θ(n log n)　(C) 最坏情况时间复杂度仍为 Θ(n²)　(D) 已排序输入仍是 Θ(n)　(E) 仍是原地排序</summary>
<div class="qa__body">
<p><strong>A、C、E。</strong></p>
<p>A 对：第 i 轮二分查找约 log₂ i 次比较，每轮不超过 ⌈log₂ n⌉ 次，总共 O(n log n)。B 错、C 对：严格逆序输入每轮仍要把整个前缀右移，移位总数 n(n − 1)/2，Θ(n²)。D 错：即使不用移位，每轮也要做一次完整的二分查找，总共约 log₂ 1 + log₂ 2 + … + log₂(n − 1) = Θ(n log n) 次比较；原版每轮只比 1 次。E 对：只多了 lo、hi、mid 几个变量，O(1)。</p>
</div>
</details>
`;

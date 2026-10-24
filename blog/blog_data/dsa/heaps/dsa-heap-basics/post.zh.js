/* Post body — dsa-heap-basics / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-heap-basics:zh'] = `
<p class="lead">堆（heap）是一棵满足“父结点 ≥ 孩子”的完全二叉树，最大值永远在根上。本课程把堆按层存进数组、从下标 1 开始：下标 i 的孩子在 2i 和 2i+1，父结点在 ⌊i/2⌋，不需要任何指针。</p>

<h2>堆的两个条件</h2>
<p>课上贯穿堆这一章的例子（插入、删除、堆排序都用它）：</p>
<pre><code class="lang-text">            27
         /      \\
       24        26
      /  \\      /  \\
     7    12   6    19
    / \\   /
   2   7 7</code></pre>
<p>它同时满足两个条件，<strong>缺一不可</strong>：</p>
<ol>
<li><strong>形状：完全二叉树（complete binary tree）</strong>。除最后一层外每层都填满，最后一层从左往右连续排列，中间不留空位（定义和高度见 3.1 二叉树基础）。</li>
<li><strong>堆条件（heap condition）</strong>。<strong>最大堆（max-heap）</strong>：每个父结点 ≥ 它的每个孩子；<strong>最小堆（min-heap）</strong>：每个父结点 ≤ 它的每个孩子。<strong>本课程默认最大堆</strong>。</li>
</ol>
<p>检查例子：有孩子的结点只有 27、24、26、7、12 五个。27 ≥ 24、26；24 ≥ 7、12；26 ≥ 6、19；7 ≥ 2、7；12 ≥ 7，全部成立。由此可以读出几件事：</p>
<ul>
<li>条件是 ≥，<strong>允许重复</strong>：7 下面挂一个 7 没有问题。</li>
<li><strong>只比较父子，不比较兄弟</strong>。同一层的 7、12、6、19 之间没有任何顺序，左子树的 12 比右子树的 6 大也无所谓。所以堆不是 BST：中序遍历不有序，查找任意一个键只能逐个看，O(n)。</li>
<li>从任何结点往上走，值只增不减，所以<strong>根就是最大值</strong>，find max 只要读根，<strong>O(1)</strong>。</li>
<li>只有一个结点的树<strong>既是最大堆也是最小堆</strong>。</li>
</ul>
<div class="callout note" data-label="注意">
<p>这里的“堆”和 C 里 <code>malloc</code> 分配内存的“堆区”只是同名，没有关系。</p>
</div>

<h3>判断是不是堆</h3>
<figure class="fig">
<svg viewBox="0 0 640 215" width="640" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="三棵都不是最大堆的树：(a) 18 没有孩子而右边的 16 有孩子；(b) 17 只有左孩子而右边的 20 有孩子；(c) 形状完全但 4 小于孩子 11 和 6，11 小于孩子 15 和 20">
<g stroke="rgba(255,255,255,0.35)" stroke-width="2"><line x1="106" y1="30" x2="56" y2="85"/><line x1="106" y1="30" x2="156" y2="85"/><line x1="156" y1="85" x2="131" y2="140"/><line x1="156" y1="85" x2="181" y2="140"/><line x1="319" y1="30" x2="269" y2="85"/><line x1="319" y1="30" x2="369" y2="85"/><line x1="269" y1="85" x2="244" y2="140"/><line x1="369" y1="85" x2="344" y2="140"/><line x1="369" y1="85" x2="394" y2="140"/></g>
<g stroke="#f87171" stroke-width="2.5"><line x1="532" y1="30" x2="482" y2="85"/><line x1="532" y1="30" x2="582" y2="85"/><line x1="482" y1="85" x2="457" y2="140"/><line x1="482" y1="85" x2="507" y2="140"/></g>
<g fill="#343433" stroke="#5a5a59" stroke-width="2"><circle cx="106" cy="30" r="14"/><circle cx="56" cy="85" r="14"/><circle cx="156" cy="85" r="14"/><circle cx="131" cy="140" r="14"/><circle cx="181" cy="140" r="14"/><circle cx="319" cy="30" r="14"/><circle cx="269" cy="85" r="14"/><circle cx="369" cy="85" r="14"/><circle cx="244" cy="140" r="14"/><circle cx="344" cy="140" r="14"/><circle cx="394" cy="140" r="14"/><circle cx="582" cy="85" r="14"/><circle cx="457" cy="140" r="14"/><circle cx="507" cy="140" r="14"/></g>
<g fill="#343433" stroke="#f87171" stroke-width="2"><circle cx="532" cy="30" r="14"/><circle cx="482" cy="85" r="14"/></g>
<g fill="none" stroke="#f87171" stroke-width="2" stroke-dasharray="4 3"><circle cx="31" cy="140" r="14"/><circle cx="81" cy="140" r="14"/><circle cx="294" cy="140" r="14"/></g>
<g fill="#e8e8e8" font-size="13" font-weight="700" text-anchor="middle"><text x="106" y="35">30</text><text x="56" y="90">18</text><text x="156" y="90">16</text><text x="131" y="145">9</text><text x="181" y="145">12</text><text x="319" y="35">30</text><text x="269" y="90">17</text><text x="369" y="90">20</text><text x="244" y="145">10</text><text x="344" y="145">8</text><text x="394" y="145">5</text><text x="532" y="35">4</text><text x="482" y="90">11</text><text x="582" y="90">6</text><text x="457" y="145">15</text><text x="507" y="145">20</text></g>
<g text-anchor="middle"><text x="106" y="182" font-size="14" font-weight="700" fill="#f87171">(a) ✗ 不完全</text><text x="106" y="202" font-size="12" fill="#a1a1a0">18 没有孩子，16 却有</text><text x="319" y="182" font-size="14" font-weight="700" fill="#f87171">(b) ✗ 不完全</text><text x="319" y="202" font-size="12" fill="#a1a1a0">17 缺右孩子，后面还有结点</text><text x="532" y="182" font-size="14" font-weight="700" fill="#f87171">(c) ✗ 违反堆条件</text><text x="532" y="202" font-size="12" fill="#a1a1a0">4 &lt; 11、11 &lt; 15 …</text></g>
</svg>
<figcaption>图 1　三棵都不是最大堆。红色虚线圈是按层排列时空出来的位置；红线连着违反最大堆条件的父子。</figcaption>
</figure>
<p>按两个条件依次查，答题时要说出<strong>违反哪一条、在哪个结点</strong>：</p>
<ul>
<li>(a) 18 没有孩子，同层右边的 16 却有两个：最后一层在 9 的左边空了两格，<strong>不完全</strong>。值全都满足父 ≥ 子，照样不是堆。</li>
<li>(b) 17 只有左孩子，右边的 20 还挂着孩子：10 和 8 之间空了一格，<strong>不完全</strong>。</li>
<li>(c) 形状完全，但 4 &lt; 11、4 &lt; 6，11 &lt; 15、11 &lt; 20，<strong>违反最大堆条件</strong>。反过来看，每个父结点都 ≤ 孩子，它是一个<strong>合法的最小堆</strong>。</li>
</ul>
<p><strong>只有左孩子本身不违规</strong>：例子里的 12 也只有左孩子 7，但 12 是最后一个父结点，7 之后再没有结点，树仍然完全。违规的是“空位后面还有结点”，以及只有右孩子没有左孩子。</p>

<h2>数组表示：从下标 1 开始</h2>
<p>完全二叉树按层编号不会出现空号，正好可以连续存进数组。课程约定根编号为 1：27 是 1；24、26 是 2、3；7、12、6、19 是 4…7；最底层 2、7、7 是 8…10。<strong>下标 0 空着不用</strong>。</p>
<pre><code class="lang-text">i      0   1  2  3  4  5  6  7  8  9 10
H[i]   -  27 24 26  7 12  6 19  2  7  7</code></pre>
<p>看 24（下标 2）：它的孩子 7、12 在下标 4、5，正好是 2×2 和 2×2+1；根 27 的孩子在 2、3。原因：下标 i 前面有 i−1 个结点，按层编号时它们的孩子都排在 i 的孩子前面，共 2(i−1) 个，占下标 2 … 2i−1（下标 1 是根），所以 i 的左孩子是 2i。</p>
<div class="callout key" data-label="考点">
<p>下标从 1 开始时：<strong>左孩子 2i，右孩子 2i+1，父结点 ⌊i/2⌋</strong>（C 里就是整数除法 <code>i / 2</code>）。</p>
</div>
<p>反查父结点：下标 9 的 7，父结点在 ⌊9/2⌋ = 4（另一个 7）；下标 8 和 9 是兄弟，⌊8/2⌋ = ⌊9/2⌋ = 4。</p>

<h3>前一半是父结点，后一半是叶子</h3>
<p>最后一个结点在下标 n，它的父结点 ⌊n/2⌋ 就是<strong>最后一个父结点</strong>。所以<strong>下标 1 … ⌊n/2⌋ 都有孩子，⌊n/2⌋+1 … n 全是叶子</strong>，叶子共 ⌈n/2⌉ 个。例子中 n = 10：下标 1…5（27、24、26、7、12）是父结点，6…10 是叶子。12 在下标 5，左孩子 10 存在，右孩子 11 &gt; n 不存在：<strong>最后一个父结点可能只有左孩子</strong>，写代码时要判断 2i+1 ≤ n。</p>
<p>用数组存堆不需要 <code>left</code>/<code>right</code> 指针，n 个元素占 n+1 格，父子之间靠乘除 2 移动。高度是 ⌊log₂ n⌋ + 1（10 个元素 4 层），6.2 的上浮和下沉最多走这么多层，所以是 O(log n)。</p>
<iframe class="anim-frame" src="blog/blog_data/dsa-heap-basics/anims/heap-index.html" loading="lazy" style="height: 560px;" title="堆的数组下标：结点与数组格子对应"></iframe>
<p class="anim-caption">点树上的结点或下面的格子（或按“下一步”逐个看），父结点和孩子会在树和数组里同时亮起，下方给出下标的算式；上方可切换下标从 1 或 0、二叉到四叉。</p>

<h3>C：判断数组是不是最大堆</h3>
<p>数组里连续存放的 n 个元素，按层排出来<strong>一定是完全二叉树</strong>，所以判断数组是不是堆只需查堆条件，而且只需查前 ⌊n/2⌋ 个父结点：</p>
<pre><code>/* 课程约定：最大堆存在 H[1..n]，H[0] 不用 */
int parent(int i)      { return i / 2; }       /* 要求 i &gt;= 2，根没有父结点 */
int left_child(int i)  { return 2 * i; }
int right_child(int i) { return 2 * i + 1; }

/* H[1..n] 是不是最大堆？形状一定完全，只需查堆条件 */
int is_max_heap(const int H[], int n) {
    for (int i = 1; i &lt;= n / 2; i++) {          /* 只有 1..n/2 有孩子 */
        int l = left_child(i), r = right_child(i);
        if (H[l] &gt; H[i]) return 0;               /* 左孩子一定存在 */
        if (r &lt;= n &amp;&amp; H[r] &gt; H[i]) return 0;     /* 右孩子可能不存在 */
    }
    return 1;
}</code></pre>
<p>每个父结点最多比较两次，<strong>O(n)</strong>。也可以反过来让每个 i = 2 … n 和父结点 <code>H[i / 2]</code> 比较，结果一样（下面的 d 叉版本就这样写）。</p>

<h2>下标从 0 开始，以及 d 叉堆</h2>
<p>往年考题里的堆常从下标 0 开始存。同一个结点的 0 起下标比 1 起下标小 1，代入换算即得：<strong>孩子 2i+1、2i+2，父结点 ⌊(i−1)/2⌋，最后一个父结点 ⌊n/2⌋−1</strong>。</p>
<p><strong>d 叉堆（d-ary heap）</strong>：每个父结点最多 d 个孩子，形状同样要完全，即除了最后一个父结点，每个父结点都有满 d 个孩子。推导和上面一样：根在 0 时，下标 i 前面有 i 个结点，它们的孩子共 d·i 个，排在下标 1 … d·i，所以 i 的第一个孩子在 <strong>d·i+1</strong>。</p>
<table>
<thead><tr><th></th><th>根在下标 0</th><th>根在下标 1</th></tr></thead>
<tbody>
<tr><td>i 的孩子</td><td>d·i+1 … d·i+d</td><td>d·i−d+2 … d·i+1</td></tr>
<tr><td>i 的父结点</td><td>⌊(i−1)/d⌋</td><td>⌊(i+d−2)/d⌋</td></tr>
<tr><td>最后一个父结点</td><td>⌊(n−2)/d⌋</td><td>⌊(n−2)/d⌋ + 1</td></tr>
<tr><td>二叉 d = 2</td><td>2i+1、2i+2；⌊(i−1)/2⌋</td><td>2i、2i+1；⌊i/2⌋</td></tr>
<tr><td>三叉 d = 3</td><td>3i+1 … 3i+3；⌊(i−1)/3⌋</td><td>3i−1 … 3i+1；⌊(i+1)/3⌋</td></tr>
<tr><td>四叉 d = 4</td><td>4i+1 … 4i+4；⌊(i−1)/4⌋</td><td>4i−2 … 4i+1；⌊(i+2)/4⌋</td></tr>
</tbody>
</table>
<p>例子数组 27 24 26 7 12 6 19 2 7 7 按三叉排也是最大堆：根在 0 时，27 的孩子是下标 1…3（24、26、7），24 的孩子是 4…6（12、6、19），26 的孩子是 7…9（2、7、7）。按四叉排同样成立。</p>
<pre><code>/* d 叉堆，A[0..n-1]，下标从 0 开始 */
int d_parent(int i, int d)       { return (i - 1) / d; }   /* 要求 i &gt;= 1 */
int d_child(int i, int d, int k) { return d * i + k; }     /* 第 k 个孩子，k = 1..d */

int is_max_dheap(const int A[], int n, int d) {
    for (int i = 1; i &lt; n; i++)                  /* 每个非根结点和自己的父结点比 */
        if (A[d_parent(i, d)] &lt; A[i]) return 0;
    return 1;
}</code></pre>
<div class="callout warn" data-label="易错">
<p>答题先写明假设：“根在下标 0”还是“根在下标 1”。两种约定的答案差 1，往年题明确要求写出假设。另外 C 的整数除法向零截断，<code>(0 - 1) / d</code> 得 0 而不是 −1，根必须单独处理。</p>
</div>

<h2>考试怎么考</h2>
<ul>
<li><strong>判断是不是堆</strong>：给树或数组，先查完全、再查堆条件，写出违反的具体结点。给数组时形状必然完全，只查堆条件。也可能问的是<strong>最小堆</strong>（2015 年的建堆题就要求最小堆）。</li>
<li><strong>下标计算</strong>：给 i 求父结点和孩子；给 n 求最后一个父结点（1 起 ⌊n/2⌋）、叶子个数（⌈n/2⌉）、层数（⌊log₂ n⌋ + 1）。</li>
<li><strong>d 叉堆</strong>：2015 年问四叉堆、2016 年问三叉堆中下标 i 的孩子在哪，参考答案是根在 0 时的 4i+1 … 4i+4 和 3i+1 … 3i+3。记住推导（前面 i 个结点的孩子占掉 d·i 个位置），现场推比死记稳。</li>
<li><strong>位置推理</strong>（选择题）：最大值在根；第二大一定是根的孩子（下标 2 或 3）；键互不相同时，最小值一定在叶子（下标 ⌊n/2⌋+1 … n）；<strong>降序排好的数组一定是最大堆</strong>，反之不成立。</li>
<li><strong>要背的</strong>：公式表上没有任何堆的公式，2i、2i+1、⌊i/2⌋、⌊n/2⌋ 和 0 起版本都要自己记住。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>拿兄弟互相比较；以为“只有左孩子”就不完全；把 0 起和 1 起的公式混用；以为堆的数组是有序的（例子里下标 4 的 7 排在下标 5 的 12 前面）；忘了最后一个父结点可能没有右孩子。</p>
</div>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">数组 H[1..10] = 50 45 40 30 46 35 10 25 28 44（H[0] 不用）是最大堆吗？如果不是，交换哪两个元素能让它成为最大堆？</summary>
<div class="qa__body">
<p>数组形式的形状一定完全，只查堆条件。父结点是下标 1 … ⌊10/2⌋ = 5：</p>
<ul>
<li>i = 1：50 ≥ 45（下标 2）、40（下标 3）✓</li>
<li>i = 2：45 ≥ 30（下标 4），但 45 &lt; 46（下标 5）<strong>✗</strong></li>
<li>i = 3：40 ≥ 35、10 ✓</li>
<li>i = 4：30 ≥ 25、28 ✓</li>
<li>i = 5：只有左孩子 44（下标 10），46 ≥ 44 ✓</li>
</ul>
<p><strong>不是最大堆</strong>，唯一的违规是下标 2 的 45 小于它的右孩子 46。交换 H[2] 和 H[5]，得到 50 46 40 30 45 35 10 25 28 44：50 ≥ 46；46 ≥ 30、45；45 ≥ 44，全部成立。只交换一对就修好的方案只有这一个。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">一个 13 个元素的堆存在 H[1..13]。(a) 最后一个元素的父结点在哪？(b) 下标 6 和 7 的孩子在哪？(c) 哪些下标是叶子？(d) 如果改成存在 A[0..12]，(a)–(c) 的答案是什么？</summary>
<div class="qa__body">
<p>(a) ⌊13/2⌋ = <strong>6</strong>。</p>
<p>(b) 下标 6 的孩子是 12、13；下标 7 的孩子应在 14、15，都超过 13，所以 7 没有孩子。</p>
<p>(c) 最后一个父结点是 ⌊13/2⌋ = 6，叶子是 <strong>7 … 13，共 7 个</strong>（⌈13/2⌉ = 7）。</p>
<p>(d) 每个下标减 1：最后一个元素在 12，父结点 ⌊(12−1)/2⌋ = 5；下标 5 的孩子是 2×5+1 = 11 和 2×5+2 = 12，下标 6 的孩子应在 13、14，超出范围；最后一个父结点 ⌊13/2⌋−1 = 5，叶子是 6 … 12，仍是 7 个。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">四叉堆（每个父结点最多 4 个孩子）存在数组里，根在下标 0。(a) 下标 3 的孩子在哪？(b) 下标 17 的父结点在哪？(c) 共 20 个元素时，最后一个父结点是哪个，它有几个孩子？(d) 若改为根在下标 1，同一个结点的孩子在哪？</summary>
<div class="qa__body">
<p>(a) 4·3+1 … 4·3+4 = <strong>13、14、15、16</strong>（前面 0、1、2 三个结点的孩子占掉下标 1 … 12）。</p>
<p>(b) ⌊(17−1)/4⌋ = <strong>4</strong>。验证：下标 4 的孩子是 17 … 20，包含 17。</p>
<p>(c) 最后一个元素在下标 19，它的父结点 ⌊(19−1)/4⌋ = ⌊(20−2)/4⌋ = <strong>4</strong>。下标 4 的孩子应是 17、18、19、20，但 20 不存在，所以<strong>只有 3 个孩子</strong>：完全四叉树中只有最后一个父结点可以不满。</p>
<p>(d) 这个结点的下标变成 4，孩子 4·4−2 … 4·4+1 = <strong>14 … 17</strong>，正好是 (a) 的每个下标加 1。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">H[1..10] 是一个键互不相同的最大堆。(a) 最小的键可能在哪些下标？(b) 第二大的键呢？(c) 判断：任何降序排好的数组都是最大堆；任何最大堆的数组都是降序的。</summary>
<div class="qa__body">
<p>(a) 最小键如果有孩子，孩子会比它更小，矛盾，所以它一定是叶子：下标 <strong>6 … 10</strong>，这 5 个位置都可能。</p>
<p>(b) 第二大键的父结点必须比它大，只有最大值满足，所以它的父结点就是根：下标 <strong>2 或 3</strong>。</p>
<p>(c) 前一句<strong>对</strong>：对任意 i ≥ 2 有 ⌊i/2⌋ &lt; i，降序数组中排在前面的不小于排在后面的，所以 H[⌊i/2⌋] ≥ H[i] 处处成立（同理，升序数组一定是最小堆）。后一句<strong>错</strong>：课上的例子 27 24 26 7 12 … 是最大堆，但 24 &lt; 26、7 &lt; 12。</p>
</div>
</details>
`;

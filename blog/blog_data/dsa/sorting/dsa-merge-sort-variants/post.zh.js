/* Post body — dsa-merge-sort-variants / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-merge-sort-variants:zh'] = `
<p class="lead">归并排序的两个变体：自底向上归并排序（bottom-up merge sort）不递归，从长度为 1 的小段开始一轮轮两两合并，仍是 Θ(n log n)；自适应归并排序（adaptive merge sort）从输入里现成的有序段开始，已排好的输入扫一遍就结束，最好 Θ(n)。</p>

<h2>从一个场景说起</h2>
<p>助教收上来一摞作业，要按学号排好。5.7 的自顶向下做法是：一摞分两半，每半再分两半……分到每摞一本，再一路合并回来。</p>
<p>可是“分”这一步没干什么实事，分到最后无非是每本单独一摞。不如一开始就把作业一本本摊在桌上，每本算一摞；然后相邻两摞合成一摞（比较两摞最上面的学号，小的先拿），每摞变成 2 本、4 本、8 本……直到只剩一摞。这就是自底向上归并排序。</p>
<p>再想一步：同一组的同学常常一起交，作业里有好几段本来就按学号排好了。把它们拆散再合回去是白费功夫，直接把每段现成的有序作业当成一摞来合并，这就是自适应归并排序。</p>

<h2>它是什么</h2>
<p>先认识两个词：</p>
<ul>
<li><strong>run（有序段）</strong>：数组里一段连续的、已经排好序的元素，就是桌上的“一摞”。</li>
<li><strong>轮（pass）</strong>：从左到右，把相邻的 run 两个一组各合并一次，叫一轮。</li>
</ul>

<h3>自底向上归并排序</h3>
<p>简单说，就是不拆分，直接从最底层开始用循环合并：</p>
<ul>
<li><strong>起点</strong>：每个元素单独算一个 run，宽度为 1。</li>
<li><strong>每一轮</strong>：从左往右把相邻两个 run 合并成一个，做法和 5.7 一样，<strong>相等先取左边</strong>。run 的宽度每轮翻倍：1 → 2 → 4 ……</li>
<li><strong>轮空</strong>：run 的个数是奇数时，最后一个没有搭档，<strong>不合并，原样留到下一轮</strong>（carried over）。</li>
<li><strong>结束</strong>：只剩一个 run。</li>
</ul>

<h3>自适应归并排序</h3>
<p>它只换了起点，教科书一般叫 natural merge sort：</p>
<ul>
<li><strong>找 run</strong>：从头扫描，下一个元素 ≥ 当前元素就继续，出现<strong>下降</strong>（A[i] &gt; A[i+1]）就断开。这样切出来的最长非递减段叫 <strong>natural run</strong>。<strong>相等的邻居不算下降</strong>，留在同一个 run 里。</li>
<li><strong>每一轮</strong>：把相邻的 run 两两合并，落单的轮空；下一轮重新扫描找 run。</li>
<li><strong>结束</strong>：扫描发现整个数组只有 1 个 run。</li>
</ul>
<p>“自适应（adaptive）”指<strong>输入越接近有序，跑得越快</strong>。自顶向下和自底向上都不看输入长什么样，工作量一点不少。</p>

<h2>看个例子</h2>
<h3>自底向上：7 个元素</h3>
<p>排 [6, 3, 8, 1, 5, 2, 7]，竖线 <code>|</code> 是 run 的边界：</p>
<pre><code class="lang-text">下标        0   1   2   3   4   5   6
输入        6 | 3 | 8 | 1 | 5 | 2 | 7      7 个 run
宽度 1 后   3   6 | 1   8 | 2   5 | 7      合并 3 次，[7] 轮空
宽度 2 后   1   3   6   8 | 2   5   7      合并 2 次
宽度 4 后   1   2   3   5   6   7   8      合并 1 次</code></pre>
<ul>
<li><strong>宽度 1</strong>：两个一组，(6, 3) 合成 3 6，(8, 1) 合成 1 8，(5, 2) 合成 2 5。第 7 个元素 7 没有搭档，轮空。</li>
<li><strong>宽度 2</strong>：[3 6] 和 [1 8] 合成 [1 3 6 8]。剩下 [2 5] 和 [7]，右边只有 1 个元素，也照样合并成 [2 5 7]：<strong>右边的 run 可以比左边短，只要存在就合并</strong>。</li>
<li><strong>宽度 4</strong>：[1 3 6 8] 和 [2 5 7] 合并，排好。</li>
</ul>
<p>一共 3 轮、6 次合并。</p>

<h3>自适应：课上的 14 个元素</h3>
<p>先找 run。7 后面是 0，下降，断开，所以第一个 run 只有 [7]。接着 0 3 6 8 一路不降，8 后面的 7 比它小，再断开。依次扫下去，共 6 处下降，切出 7 个 run：</p>
<pre><code class="lang-text">输入     7 | 0 3 6 8 | 7 | 4 4 | 1 7 7 | 6 6 | 4      7 个 run
第 1 轮  0 3 6 7 8 | 4 4 7 | 1 6 6 7 7 | 4            合并 3 次，[4] 轮空
第 2 轮  0 3 4 4 6 7 7 8 | 1 4 6 6 7 7                合并 2 次
第 3 轮  0 1 3 4 4 4 6 6 6 7 7 7 7 8                  合并 1 次</code></pre>
<ul>
<li><strong>第 1 轮</strong>：[7] + [0 3 6 8]、[7] + [4 4]、[1 7 7] + [6 6] 各合并一次，最后的 [4] 轮空。</li>
<li><strong>第 2 轮</strong>：重新扫描，8 &gt; 4、7 &gt; 1、7 &gt; 4 三处下降，4 个 run，两两合并。</li>
<li><strong>第 3 轮</strong>：剩 2 个 run，合并一次，排好。</li>
</ul>
<p>3 轮、6 次合并。同样 14 个元素，自底向上要从 14 个单元素 run 起步，需要 <strong>4 轮、13 次合并</strong>。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-merge-sort-variants/anims/passes.html" loading="lazy" style="height: 500px;" title="自底向上与自适应归并的轮次"></iframe>
<p class="anim-caption">先选算法和输入，再按播放或下一步。每行是一轮后的数组，下划线标出 run：橙色和蓝色是正在合并的两个 run，黄色虚线是轮空。同一输入切换两种算法，对比轮数和合并次数。</p>

<h2>自底向上的 C 代码</h2>
<p><code>merge(A, B, lo, mid, hi)</code> 借缓冲数组 B 把 A[lo..mid−1] 和 A[mid..hi−1] 合并，结果写回 A，思路同 5.7。排序本身只是两层循环：</p>
<pre><code>void merge_sort_bu(int A[], int n) {
    int w, lo, hi, *B;
    if (n &lt; 2) return;
    B = malloc(n * sizeof(int));
    assert(B != NULL);
    for (w = 1; w &lt; n; w *= 2) {
        for (lo = 0; lo + w &lt; n; lo += 2 * w) {
            hi = (lo + 2 * w &lt; n) ? lo + 2 * w : n;
            merge(A, B, lo, lo + w, hi);
        }
    }
    free(B);
}</code></pre>
<ul>
<li><strong>第 4 行</strong>：只申请一次长度 n 的缓冲数组，全程共用，这就是 O(n) 额外空间。</li>
<li><strong>第 6 行</strong>：w 是本轮 run 的宽度，1、2、4……；w &lt; n 说明 run 不止一个。</li>
<li><strong>第 7 行</strong>：lo 是一对 run 的起点，每次跳 2w。<code>lo + w &lt; n</code> 就是“右边的 run 存在”；不成立时，lo 到末尾这段就是轮空的 run，不碰它。</li>
<li><strong>第 8 行</strong>：右 run 的终点截到 n，所以右 run 可以不满 w 个。</li>
<li><strong>第 9 行</strong>：合并 A[lo..lo+w−1] 和 A[lo+w..hi−1]。</li>
</ul>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/k3oezbZgfDs" title="Merge Sort: Top-Down and Bottom-Up" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Algorithms with Attitude《Merge Sort: Top-Down and Bottom-Up》（英文），看 11:26–18:30：把递归“展开”成自底向上的循环，并用 8 个和 13 个元素对比两种分组。轮空和计数以课上约定为准。</p>

<h2>合并几次、几轮</h2>
<p>数合并次数有个捷径：每合并一次，两个 run 变成一个，<strong>run 数恰好减 1</strong>。从 r 个 run 到 1 个 run，就是 <strong>r − 1 次合并</strong>，跟怎么配对无关。</p>
<ul>
<li><strong>自底向上</strong>：起点 r = n，所以合并 <strong>n − 1 次</strong>；宽度每轮翻倍，共 <strong>⌈log₂ n⌉ 轮</strong>。7 个、8 个元素都是 3 轮，9 个要 4 轮。每一轮合并 ⌊本轮开始时的 run 数 / 2⌋ 次，7 个元素就是 3 + 2 + 1 = 6。</li>
<li><strong>自适应</strong>：r = 下降处的个数 + 1，合并 <strong>r − 1 次</strong>，共 <strong>⌈log₂ r⌉ 轮</strong>。</li>
</ul>
<p>2016 年期末问过 7 个整数要调用几次，参考答案写“7 次（或 6 次）”，差别在轮空的 run 是否也调用一次 merge。答题时写明假设：<strong>轮空不调用 merge，共 6 次</strong>；排序函数本身是循环，只调用 1 次。自顶向下排 7 个元素也是 6 次合并，只是分组不同。</p>

<h2>复杂度和性质</h2>
<p>每一轮里每个元素最多被合并一次，<strong>一轮是 Θ(n)</strong>（自适应版多一次找 run 的扫描，也是 Θ(n)）。总时间 = 轮数 × Θ(n)。</p>
<ul>
<li><strong>自底向上</strong>：⌈log₂ n⌉ 轮，<strong>最好 = 平均 = 最坏 = Θ(n log n)</strong>。排好的输入也一轮不少，<strong>不自适应</strong>。</li>
<li><strong>自适应，最好</strong>：已排序，扫描一遍发现只有 1 个 run，<strong>Θ(n)</strong>。</li>
<li><strong>自适应，最坏</strong>：严格逆序，r = n，每一次合并都和自底向上相同，<strong>Θ(n log n)</strong>。</li>
<li><strong>自适应，平均</strong>：随机输入约一半相邻对是下降，r ≈ n/2，<strong>只比自底向上少一轮</strong>，仍是 Θ(n log n)。</li>
</ul>
<p>两者都<strong>稳定</strong>（合并相等取左，找 run 时相等不断开），额外空间都是缓冲数组的 <strong>O(n)</strong>。不用递归只省掉 O(log n) 的栈，<strong>不会变成 O(1)</strong>。</p>

<h2>什么时候用归并排序</h2>
<p>合并只从两个序列的头部往后读，是<strong>顺序访问（sequential access）</strong>。所以它适合：</p>
<ul>
<li><strong>链表</strong>：合并只改 next 指针，不用缓冲数组。课上的快速排序分区要从末尾往回扫，单向链表做不到。</li>
<li><strong>数据比内存大</strong>（外部排序，external sorting）：把装得进内存的一块块先排好写回磁盘，每块是一个 run，再合并，每个 run 只需队首在内存里。</li>
<li><strong>数据流（stream）</strong>：陆续到达的有序序列，只看队首就能合并。</li>
</ul>
<p>内存里的普通数组一般用快速排序：都是 n log n 量级，但归并排序要来回复制元素，常数更大，Big-O 不反映常数。</p>
<table>
<thead><tr><th></th><th>快速排序</th><th>自顶向下 / 自底向上</th><th>自适应归并</th></tr></thead>
<tbody>
<tr><td>最好 / 平均 / 最坏</td><td>n log n / n log n / n²</td><td>都是 n log n</td><td>n / n log n / n log n</td></tr>
<tr><td>额外空间</td><td>O(log n) 栈，最坏 O(n)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>稳定</td><td>否</td><td>是</td><td>是</td></tr>
<tr><td>已排序输入</td><td>首元素作 pivot 时最坏</td><td>仍 Θ(n log n)</td><td>Θ(n)</td></tr>
<tr><td>实际速度</td><td>通常最快</td><td>复制多，常数大</td><td>越有序越快</td></tr>
</tbody>
</table>

<h2>考试怎么考</h2>
<ul>
<li><strong>填空、计数</strong>：合并几次、几轮；自底向上的时间 Θ(n log n)、额外空间 O(n)，2015、2016 年都考过。公式表上没有，要自己推。</li>
<li><strong>手算</strong>：写出每轮之后的数组。自适应版先标下降处、划出 run，用 <code>|</code> 标边界，轮空的照抄。</li>
<li><strong>选择、简答</strong>：三种情况的复杂度、稳定性、空间；为什么适合链表和外部数据。</li>
</ul>

<h3>例题 1：数合并次数</h3>
<p>10 个元素做自底向上归并排序（轮空不调用 merge）。用位置 1–10 写出每轮合并哪些段，求合并总次数和轮数。</p>
<pre><code class="lang-text">宽度 1   (1,2) (3,4) (5,6) (7,8) (9,10)           5 次
宽度 2   (1-2, 3-4) (5-6, 7-8)     9-10 轮空      2 次
宽度 4   (1-4, 5-8)                9-10 轮空      1 次
宽度 8   (1-8, 9-10)                              1 次</code></pre>
<p>宽度 1 有 10 个 run，正好 5 对。宽度 2 剩 5 个 run，奇数，9–10 轮空；宽度 4 剩 3 个，9–10 又轮空，直到最后一轮才和前 8 个合并。</p>
<p>共 5 + 2 + 1 + 1 = <strong>9 = n − 1 次</strong>，<strong>4 = ⌈log₂ 10⌉ 轮</strong>。最后一次合并 8 个和 2 个，不均衡，但不影响次数。</p>

<h3>例题 2：自适应手算</h3>
<p>对 [3, 9, 2, 5, 8, 1, 4, 6, 7, 0] 做自适应归并排序，写出初始的 run 和每轮之后的数组。自底向上对同一输入要几轮、几次合并？</p>
<p>先找下降处：9 &gt; 2、8 &gt; 1、7 &gt; 0，共 3 处，所以有 4 个 run：</p>
<pre><code class="lang-text">输入     3 9 | 2 5 8 | 1 4 6 7 | 0
第 1 轮  2 3 5 8 9 | 0 1 4 6 7          合并 2 次，无轮空
第 2 轮  0 1 2 3 4 5 6 7 8 9            合并 1 次</code></pre>
<p>第 1 轮把 [3 9] 和 [2 5 8] 合成 [2 3 5 8 9]，把 [1 4 6 7] 和 [0] 合成 [0 1 4 6 7]；第 2 轮合并剩下的两个 run。共 <strong>2 轮、3 次合并</strong>（⌈log₂ 4⌉ = 2，4 − 1 = 3）。自底向上从 10 个单元素 run 出发，要 <strong>⌈log₂ 10⌉ = 4 轮、9 次合并</strong>。</p>

<div class="callout warn" data-label="易错">
<ul>
<li>把轮空也算一次合并，又不写假设。</li>
<li>以为不用递归，额外空间就是 O(1)。实际是 O(n)。</li>
<li>以为自底向上对已排序输入是 Θ(n)。那是自适应版的最好情况。</li>
<li>找 run 时把相等的邻居断开：4 4 是同一个 run。</li>
<li>把插入排序的“几乎有序”直接套过来。5 6 7 8 1 2 3 4 只有 2 个 run，自适应归并 Θ(n)，插入排序却要 Θ(n²)；2 1 4 3 6 5 … 每个元素只差一格，插入排序 Θ(n)，自适应归并却有 n/2 + 1 个 run，仍是 Θ(n log n)。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>自底向上：宽度 1 → 2 → 4 …… 相邻两两合并，落单的 run 轮空。自适应：先按下降处切出 natural run（相等不断开），再两两合并。</li>
<li>合并次数 = run 数 − 1：自底向上 n − 1 次、⌈log₂ n⌉ 轮；自适应 r − 1 次、⌈log₂ r⌉ 轮，r = 下降处个数 + 1。</li>
<li>自底向上三种情况都是 Θ(n log n)；自适应版最好（已排序）Θ(n)，最坏（逆序）和平均 Θ(n log n)。</li>
<li>两者都稳定，额外空间 O(n)。顺序访问，适合链表、外部排序和数据流。</li>
</ul>
`;

/* Post body — dsa-quicksort-partition / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-quicksort-partition:zh'] = `
<p class="lead">快速排序（quicksort）：选一个 pivot，比它小的挪到左边、其余挪到右边，pivot 就站到了最终位置；左右两段再各自重复。本课程的分区写法：pivot 取第一个元素，两个指针从两头往中间找、交换。</p>

<h2>从一个场景说起</h2>
<p>体育课上，一排同学站得乱七八糟，老师要按身高排好。</p>
<p>老师指着排头的同学说：“你当参照。比你矮的都站你左边，比你高的都站你右边。”</p>
<p>站完之后，这位同学左边全是比他矮的，右边全是比他高的。不管左右两群内部有多乱，<strong>他自己的位置已经对了</strong>，以后再也不用动。</p>
<p>接下来，左边那群、右边那群各自再请排头当参照，重复同样的事。群越分越小，小到只剩一个人，整排就排好了。这就是快速排序。</p>

<h2>它是什么</h2>
<p>简单说，快速排序就是“选一个参照，分成左小右大两堆，再对两堆分别做同样的事”。那个参照叫 pivot（基准）。它由三部分组成：</p>
<ol>
<li><strong>选 pivot</strong>：本课程总是取当前这段的<strong>第一个元素</strong> A[lo]，就是“排头的同学”（其他选法见 5.6）。</li>
<li><strong>分区（partition）</strong>：小于 pivot 的放左边，其余放右边，pivot 夹在中间。pivot 最后所在的下标 p 就是它的<strong>最终位置</strong>，A[p] 以后不再移动。</li>
<li><strong>递归</strong>：对左段 A[lo..p−1] 和右段 A[p+1..hi] 分别快速排序。一段只剩 0 或 1 个元素时已经有序，直接返回。</li>
</ol>
<p>这种“拆成小问题各自解决”的思路叫分治（divide and conquer）。快速排序的活全在“分”这一步干完了，两段各自排好，整个数组自然有序，<strong>没有合并步骤</strong>，和归并排序正好相反（见 5.7）。</p>
<p>等于 pivot 的元素放哪边都不影响正确性。课上的约定是<strong>等于的放右边</strong>：分区后左边 &lt; pivot ≤ 右边。</p>

<h3>分区怎么做：两头往中间找</h3>
<p>分区不另开数组，只在原数组里交换。想象两个同学从队伍两头往中间走：左边那个专找“站错的高个子”，右边那个专找“站错的矮个子”，两人各找到一个，就互换位置。</p>
<p>写成步骤（pivot = A[lo]）：</p>
<ol>
<li>i 从 lo + 1 出发<strong>往右</strong>走，跳过比 pivot 小的，停在第一个 <strong>≥ pivot</strong> 的元素上；</li>
<li>j 从 hi 出发<strong>往左</strong>走，跳过 ≥ pivot 的，停在第一个 <strong>&lt; pivot</strong> 的元素上；</li>
<li>如果 i &lt; j，<strong>交换 A[i] 和 A[j]</strong>，i、j 各走一步，回到第 1 步；</li>
<li>一旦 i &gt; j（两个指针<strong>交叉</strong>了），停下，<strong>交换 A[lo] 和 A[j]</strong>，返回 j。</li>
</ol>
<p>课上口头说的是“i 找比 pivot 大的，j 找比 pivot 小的”。没有重复元素时两种说法一样；有重复时按“等于的放右边”，i 碰到等于 pivot 的也要停。</p>

<h2>看个例子</h2>
<p>课上的数组 A = [5, 8, 7, 1, 3, 4, 0, 6, 9, 2]，pivot = 5。</p>
<p>先算出终点：其余 9 个数里比 5 小的有 1、3、4、0、2 共 5 个，所以分区后 5 应该落在下标 5。下面逐轮执行，加粗的是刚交换过的元素：</p>
<table>
<thead><tr><th>轮</th><th>i 的扫描</th><th>j 的扫描</th><th>动作</th><th>之后的数组</th></tr></thead>
<tbody>
<tr><td>1</td><td>A[1] = 8 ≥ 5，停在 1</td><td>A[9] = 2 &lt; 5，停在 9</td><td>交换 8 ↔ 2，i = 2，j = 8</td><td>5 <strong>2</strong> 7 1 3 4 0 6 9 <strong>8</strong></td></tr>
<tr><td>2</td><td>A[2] = 7 ≥ 5，停在 2</td><td>跳过 9、6；A[6] = 0 &lt; 5，停在 6</td><td>交换 7 ↔ 0，i = 3，j = 5</td><td>5 2 <strong>0</strong> 1 3 4 <strong>7</strong> 6 9 8</td></tr>
<tr><td>3</td><td>跳过 1、3、4，i = 6 &gt; j = 5</td><td>已交叉，不再动</td><td>停止扫描</td><td>5 2 0 1 3 4 7 6 9 8</td></tr>
<tr><td>收尾</td><td></td><td>j = 5</td><td>pivot 5 ↔ A[5] = 4，返回 5</td><td><strong>4</strong> 2 0 1 3 <strong>5</strong> 7 6 9 8</td></tr>
</tbody>
</table>
<p>5 到了下标 5。左边 [4 2 0 1 3] 全都 &lt; 5，右边 [7 6 9 8] 全都 &gt; 5，但两边自己还是乱的。分区只保证“左小右大”，不保证有序。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-quicksort-partition/anims/partition.html" loading="lazy" style="height: 460px;" title="快速排序分区与递归逐步演示"></iframe>
<p class="anim-caption">按“下一步”看 i、j 逐格移动：蓝色是已确认小于 pivot 的，浅橙是已确认 ≥ pivot 的，交叉后 pivot 换到 j 变绿，然后先左后右递归。上方可切换 2016 真题数组和有相等元素的例子。</p>

<h3>为什么最后和 A[j] 交换</h3>
<p>交叉的那一刻一定是 i = j + 1：j 指着“小的那一段”的最后一个，i 指着“大的那一段”的第一个。</p>
<p>pivot 在最左边。和 A[j] 换，换到最左边的是个小元素，它本来就该在 pivot 左边，没问题。要是和 A[i] 换，就把一个 ≥ pivot 的元素换到了最左边，分区就错了。</p>
<p>特殊情况：没有比 pivot 小的元素时，j 一路退回 lo，pivot 和自己交换，留在原地，左段为空。</p>

<h3>接着递归：pivot 是怎么一个个选出来的</h3>
<p>分区后先递归左段、再递归右段，每段都取<strong>当前这段的第一个元素</strong>作 pivot：</p>
<pre><code class="lang-text">[5 8 7 1 3 4 0 6 9 2]   pivot 5 → [4 2 0 1 3] 5 [7 6 9 8]
├─ [4 2 0 1 3]          pivot 4 → [3 2 0 1] 4 []
│  └─ [3 2 0 1]         pivot 3 → [1 2 0] 3 []
│     └─ [1 2 0]        pivot 1 → [0] 1 [2]
└─ [7 6 9 8]            pivot 7 → [6] 7 [9 8]
   └─ [9 8]             pivot 9 → [8] 9 []</code></pre>
<p>做过分区的 pivot 依次是 <strong>5, 4, 3, 1, 7, 9</strong>（单元素的段直接返回，图里省掉了）。注意左段用的是分区<strong>之后</strong>的顺序 [4 2 0 1 3]，不是原数组里小于 5 的数的原始次序 [1 3 4 0 2]，所以第二个 pivot 是 4，不是 1。</p>

<h3>分区为什么是 O(n)</h3>
<p>i 只往右走，j 只往左走，碰头就停，两人合起来只走过大约 n 个位置，每一步是 O(1) 的比较或交换。所以<strong>对 n 个元素分区是 O(n)</strong>。整个快速排序有多快，取决于 pivot 选得好不好，见 5.6。</p>

<h2>代码</h2>
<p>期末可能要你写 partition 或者填空。<code>swap(&amp;a, &amp;b)</code> 是交换两个 int 的三行小函数，这里略去。</p>
<pre><code>/* partition A[lo..hi] around pivot A[lo]; return its final index */
int partition(int A[], int lo, int hi) {
    int pivot = A[lo];
    int i = lo + 1, j = hi;
    while (i &lt;= j) {
        while (i &lt;= j &amp;&amp; A[i] &lt; pivot) i++;   /* stop at &gt;= pivot */
        while (i &lt;= j &amp;&amp; A[j] &gt;= pivot) j--;  /* stop at &lt;  pivot */
        if (i &lt; j) {                            /* not crossed yet */
            swap(&amp;A[i], &amp;A[j]);
            i++;
            j--;
        }
    }
    swap(&amp;A[lo], &amp;A[j]);                        /* pivot to final index */
    return j;
}</code></pre>
<ul>
<li>第 3–4 行：pivot 取第一个元素；i 从它右边一格出发，j 从最后一个出发。</li>
<li>第 5 行：两个指针交叉之前一直做。</li>
<li>第 6 行：i 跳过比 pivot 小的，停在 ≥ pivot 的上。第 7 行：j 跳过 ≥ pivot 的，停在 &lt; pivot 的上。等于 pivot 的元素两边都把它留在右边。</li>
<li>两个内循环都先检查 <code>i &lt;= j</code>。少了这个检查，像 [9, 3, 1] 这种其余元素都比 pivot 小的输入，i 会一直走出 hi，读到数组外面。</li>
<li>第 8–12 行：还没交叉，就交换这一对“站错的”，两人各走一步。</li>
<li>第 14–15 行：交叉后 pivot 和 A[j] 交换，返回 pivot 的最终下标。</li>
</ul>
<pre><code>void quicksort(int A[], int lo, int hi) {
    if (lo &lt; hi) {                       /* 0 or 1 key: done */
        int p = partition(A, lo, hi);    /* A[p] is final */
        quicksort(A, lo, p - 1);
        quicksort(A, p + 1, hi);
    }
}</code></pre>
<ul>
<li>第 2 行：<code>lo &lt; hi</code> 是递归出口，少于 2 个元素就什么都不做。</li>
<li>第 3 行：分区一次，拿到 pivot 的位置 p。</li>
<li>第 4–5 行：两边递归，<strong>跳过 p</strong>。写成 <code>quicksort(A, p, hi)</code> 的话，一旦 pivot 是这段的最小值（p = lo），右边的子问题和原问题一样大，无限递归。</li>
</ul>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/7h1s2SojIRw" title="2.8.1 QuickSort Algorithm" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Abdul Bari《2.8.1 QuickSort Algorithm》（英文），白板演示同样的思路：pivot 取第一个元素，交叉后和 A[j] 交换。两处和本课不同：等于 pivot 的归左边；末尾放一个 ∞ 当哨兵，代替 <code>i &lt;= j</code> 检查。手算考题按本课写法。</p>

<h2>考试怎么考</h2>
<p>这部分期末主要有三种问法：<strong>手算一次分区</strong>、<strong>列出 pivot 序列</strong>、<strong>写或填 partition 代码</strong>。选择题还会考几个概念：分区后 pivot 在最终位置、两段仍无序、分区 O(n)、没有合并步骤。这些公式表上都没有，要记住。</p>

<h3>例题 1：手算分区</h3>
<p>题：用本课程的分区方案对 [6, 9, 2, 8, 1, 7, 3, 5] 做一次分区，写出每次交换、分区后的数组和返回值。</p>
<pre><code class="lang-text">pivot = 6，i = 1，j = 7
第 1 轮  i 停在 1（9 ≥ 6），j 停在 7（5 &lt; 6）
         交换 9 ↔ 5  →  6 5 2 8 1 7 3 9，i = 2，j = 6
第 2 轮  i 跳过 2，停在 3（8 ≥ 6）；j 停在 6（3 &lt; 6）
         交换 8 ↔ 3  →  6 5 2 3 1 7 8 9，i = 4，j = 5
第 3 轮  i 跳过 1，停在 5（7 ≥ 6）；j 跳过 7，j = 4 &lt; i，交叉
收尾     pivot 6 ↔ A[4] = 1  →  1 5 2 3 6 7 8 9，返回 4</code></pre>
<p>讲解：每轮先让 i 走到停，再让 j 走到停，然后看 i &lt; j。第 3 轮 j 跳过 7 退到下标 4，已经在 i 左边，交叉，不再交换。6 最后落在下标 4，正好是“比 6 小的有 4 个”。接下来递归处理 [1 5 2 3] 和 [7 8 9]。</p>

<h3>例题 2：列出 pivot（2016 期末）</h3>
<p>题（大意）：对 {13, 4, 5, 43, 22, 2, 3, 1} 做快速排序，始终取最左元素作 pivot，依次选出哪些 pivot？题目注明分区时<strong>保持元素的相对顺序</strong>。</p>
<p>讲解：“保持相对顺序”的意思是不用真的跑 i、j 扫描。一次分区就是：比 pivot 小的按原来的先后顺序组成左段，比它大的按原来的顺序组成右段。</p>
<pre><code class="lang-text">[13 4 5 43 22 2 3 1]   pivot 13 → [4 5 2 3 1] 13 [43 22]
├─ [4 5 2 3 1]         pivot 4  → [2 3 1] 4 [5]
│  ├─ [2 3 1]          pivot 2  → [1] 2 [3]
│  │  ├─ [1]
│  │  └─ [3]
│  └─ [5]
└─ [43 22]             pivot 43 → [22] 43 []
   └─ [22]</code></pre>
<p>先左后右读这棵树。参考答案把单元素也算作 pivot：<strong>13, 4, 2, 1, 3, 5, 43, 22</strong>；只算真正做了分区的则是 13, 4, 2, 43。作答时写明单元素算不算。</p>
<p>顺带一提，这棵树和把这些数按原次序插入二叉搜索树得到的树一模一样（见 3.3），pivot 序列就是它的前序遍历（pre-order）。</p>
<p>如果题目<strong>没有</strong>这句说明，就得按课上的分区真的执行：第一次分区交换 43 ↔ 1、22 ↔ 3，pivot 13 再和 2 交换，得到 [2 4 5 1 3] 13 [22 43]。下一个 pivot 变成 2，做过分区的 pivot 依次是 13, 2, 5, 3, 22。</p>

<div class="callout warn" data-label="易错">
<ul>
<li>收尾和 A[i] 交换：课上的数组会变成 [7 2 0 1 3 4 5 6 9 8]，5 不在下标 5，左边还混进了 7。</li>
<li>交叉之后又交换了一次：上例第 3 轮若把 7 和 4 对调，7 就跑进了左段。</li>
<li>以为分区后两段已经有序：分区只保证左小右大。</li>
<li>列 pivot 时用了原数组的次序：下一个 pivot 是分区<strong>之后</strong>那段的第一个元素。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>快速排序 = 选 pivot → 分区 → 左右两段递归；<strong>没有合并步骤</strong>。</li>
<li>本课程的分区：pivot = A[lo]；i 往右找 ≥ pivot 的，j 往左找 &lt; pivot 的，i &lt; j 就交换；交叉后 <strong>pivot 和 A[j] 交换</strong>，返回 j。等于 pivot 的放右边。</li>
<li>分区后 pivot 在最终位置，两段内部仍然无序；分区是 <strong>O(n)</strong>。</li>
<li>列 pivot 序列时，下一个 pivot 是分区后子段的第一个元素；题目说“保持相对顺序”时按原次序拆分（等于 BST 的前序遍历）。</li>
<li>代码要点：内循环先查 <code>i &lt;= j</code>；出口 <code>lo &lt; hi</code>；递归跳过 p。</li>
</ul>
`;

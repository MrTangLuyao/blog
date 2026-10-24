/* Post body — dsa-quicksort-partition / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-quicksort-partition:zh'] = `
<p class="lead">快速排序（quicksort）先选一个 pivot，用分区（partition）把比它小的元素放到左边、其余放到右边，pivot 就落在排好序后它该在的位置；再对左右两段递归做同样的事。本课程只教一种分区方案：pivot 取第一个元素，i 从左往右找大的，j 从右往左找小的，两者交换，指针交叉后把 pivot 和 A[j] 交换。</p>

<h2>思路：让 pivot 站到最终位置</h2>
<p>课上的数组是 A = [5, 8, 7, 1, 3, 4, 0, 6, 9, 2]，取第一个元素 5 作 pivot。其余 9 个数里比 5 小的有 1、3、4、0、2 共 5 个，比 5 大的有 8、7、6、9 共 4 个。只要小的 5 个在左、大的 4 个在右、5 夹在中间，5 就在下标 5，这正是它在排好序的数组里的位置，而且不管两边内部是什么顺序都成立。</p>
<p>于是快速排序只有三步：</p>
<ol>
<li><strong>选 pivot</strong>：本课程取子数组的第一个元素 A[lo]（其他选法见 5.6）；</li>
<li><strong>分区</strong>：小于 pivot 的放左边，其余放右边，pivot 放中间，记它的下标为 p，<strong>A[p] 从此不再移动</strong>；</li>
<li><strong>递归</strong>：对 A[lo..p−1] 和 A[p+1..hi] 分别快速排序。</li>
</ol>
<p>子数组只剩 0 或 1 个元素时已经有序，直接返回。这是<strong>分治（divide and conquer）</strong>：工作都在“分”这一步，两段各自排好后整个数组自然有序，<strong>没有合并步骤</strong>，和归并排序正好相反（见 5.7）。</p>
<p>等于 pivot 的元素放哪边都不影响正确性。课上的约定是<strong>等于 pivot 的放右边</strong>，分区后左边 &lt; pivot ≤ 右边。</p>

<h2>分区：两个指针相向扫描</h2>
<p>分区不另开数组，只在原数组里交换元素。设 pivot = A[lo]：</p>
<ol>
<li>i 从 lo + 1 出发<strong>向右</strong>扫，跳过小于 pivot 的，停在第一个 ≥ pivot 的元素；</li>
<li>j 从 hi 出发<strong>向左</strong>扫，跳过 ≥ pivot 的，停在第一个 &lt; pivot 的元素；</li>
<li>若 i &lt; j，<strong>交换 A[i] 和 A[j]</strong>，i、j 各走一步，回到第 1 步；</li>
<li>一旦 i &gt; j（两指针<strong>交叉</strong>），停止扫描，<strong>交换 A[lo] 和 A[j]</strong>，pivot 的最终下标就是 j。</li>
</ol>
<p>课上口述的是“i 找大于 pivot 的，j 找小于 pivot 的”。键互不相同时两种说法完全一样；有相等元素时，按“等于的放右边”，i 遇到等于 pivot 的也要停。</p>
<p>对课上的数组逐步执行，加粗的是刚交换过的元素：</p>
<table>
<thead><tr><th>轮</th><th>i 的扫描</th><th>j 的扫描</th><th>动作</th><th>之后的数组</th></tr></thead>
<tbody>
<tr><td>1</td><td>A[1] = 8 ≥ 5，停在 1</td><td>A[9] = 2 &lt; 5，停在 9</td><td>交换 8 ↔ 2，i = 2，j = 8</td><td>5 <strong>2</strong> 7 1 3 4 0 6 9 <strong>8</strong></td></tr>
<tr><td>2</td><td>A[2] = 7 ≥ 5，停在 2</td><td>跳过 9、6；A[6] = 0 &lt; 5，停在 6</td><td>交换 7 ↔ 0，i = 3，j = 5</td><td>5 2 <strong>0</strong> 1 3 4 <strong>7</strong> 6 9 8</td></tr>
<tr><td>3</td><td>跳过 1、3、4，i = 6 &gt; j = 5</td><td>已交叉，不再移动</td><td>停止扫描</td><td>5 2 0 1 3 4 7 6 9 8</td></tr>
<tr><td>收尾</td><td></td><td>j = 5</td><td>pivot 5 ↔ A[5] = 4，返回 5</td><td><strong>4</strong> 2 0 1 3 <strong>5</strong> 7 6 9 8</td></tr>
</tbody>
</table>
<p>5 到了下标 5；左边 [4 2 0 1 3] 都 &lt; 5，右边 [7 6 9 8] 都 &gt; 5，两边本身仍然无序。</p>

<h3>为什么和 A[j] 交换</h3>
<p>扫描结束时一定有 i = j + 1：A[lo+1..j] 全部 &lt; pivot，A[i..hi] 全部 ≥ pivot。j 指着“小的一段”的最后一个，i 指着“大的一段”的第一个。pivot 在最左端，和 A[j] 交换后换到 A[lo] 的是一个小元素，仍在 pivot 左边，没问题；和 A[i] 交换则会把一个 ≥ pivot 的元素放到最左边，分区就错了。没有比 pivot 小的元素时，j 会一路退回 lo，pivot 和自己交换，留在原处。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-quicksort-partition/anims/partition.html" loading="lazy" style="height: 460px;" title="快速排序分区与递归逐步演示"></iframe>
<p class="anim-caption">按“下一步”或“播放”看 i、j 逐格移动：蓝色是已确认小于 pivot 的，浅橙是已确认 ≥ pivot 的，交叉后 pivot 换到 j 变绿，然后先左后右递归，下方累计 pivot 序列。可切换 2016 真题数组和有相等元素的例子。</p>

<p><strong>分区是 O(n)</strong>：i 只向右、j 只向左，交叉即停，两者合起来只扫过约 n 个位置，每个位置 O(1) 的工作；被 i、j 交换过的元素落到指针身后，不会被 i、j 再换第二次。</p>

<h2>C 代码</h2>
<pre><code>#include &lt;stdio.h&gt;

void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

/* partition A[lo..hi] around the pivot A[lo]; return its final index */
int partition(int A[], int lo, int hi) {
    int pivot = A[lo];
    int i = lo + 1, j = hi;
    while (i &lt;= j) {
        while (i &lt;= j &amp;&amp; A[i] &lt; pivot) {    /* i stops at a key &gt;= pivot */
            i++;
        }
        while (i &lt;= j &amp;&amp; A[j] &gt;= pivot) {   /* j stops at a key &lt;  pivot */
            j--;
        }
        if (i &lt; j) {                        /* not crossed: swap, step both */
            swap(&amp;A[i], &amp;A[j]);
            i++;
            j--;
        }
    }
    swap(&amp;A[lo], &amp;A[j]);                    /* pivot goes to its final index */
    return j;
}

/* sort A[lo..hi] */
void quicksort(int A[], int lo, int hi) {
    if (lo &lt; hi) {                          /* 0 or 1 key: already sorted */
        int p = partition(A, lo, hi);       /* A[p] is now final */
        quicksort(A, lo, p - 1);
        quicksort(A, p + 1, hi);
    }
}

int main(void) {
    int A[] = {5, 8, 7, 1, 3, 4, 0, 6, 9, 2};
    int p = partition(A, 0, 9);      /* p = 5, A = 4 2 0 1 3 5 7 6 9 8 */
    quicksort(A, 0, p - 1);
    quicksort(A, p + 1, 9);
    for (int k = 0; k &lt; 10; k++) {
        printf("%d ", A[k]);         /* 0 1 2 3 4 5 6 7 8 9 */
    }
    printf("\\n");
    return 0;
}</code></pre>
<ul>
<li>第一个内循环的条件 <code>A[i] &lt; pivot</code> 让 i 停在 ≥ pivot 的元素上，第二个的 <code>A[j] &gt;= pivot</code> 让 j 跳过 ≥ pivot 的元素：等于 pivot 的都留在右边。</li>
<li>两个内循环都先检查 <code>i &lt;= j</code>。去掉第一个里的检查，[9, 3, 1] 这种其余元素都比 pivot 小的输入会让 i 走出 hi，读到数组外面。</li>
<li>递归跳过下标 p。写成 <code>quicksort(A, p, hi)</code> 的话，一旦某次 pivot 是子数组的最小值（p = lo），右边的子问题和原问题一模一样，无限递归；课上的数组和任何已排好的数组都会触发。</li>
</ul>

<h2>递归：pivot 是怎样一个个选出来的</h2>
<p>继续课上的例子。每次分区后先递归左段、再递归右段；单元素的段直接返回，不做分区。</p>
<pre><code class="lang-text">[5 8 7 1 3 4 0 6 9 2]   pivot 5 → [4 2 0 1 3] 5 [7 6 9 8]
├─ [4 2 0 1 3]          pivot 4 → [3 2 0 1] 4 []
│  └─ [3 2 0 1]         pivot 3 → [1 2 0] 3 []
│     └─ [1 2 0]        pivot 1 → [0] 1 [2]
│        ├─ [0]
│        └─ [2]
└─ [7 6 9 8]            pivot 7 → [6] 7 [9 8]
   ├─ [6]
   └─ [9 8]             pivot 9 → [8] 9 []
      └─ [8]</code></pre>
<p>做过分区的 pivot 依次是 <strong>5, 4, 3, 1, 7, 9</strong>。子数组的顺序是上一次分区留下的顺序：5 左边是 [4 2 0 1 3]，不是原数组里小于 5 的元素的原始次序 [1 3 4 0 2]，所以下一个 pivot 是 4 而不是 1。</p>

<h3>真题问法：“保持相对顺序”</h3>
<p>2016 年期末考过：对 {13, 4, 5, 43, 22, 2, 3, 1} 始终取最左元素作 pivot，依次会选出哪些 pivot；题目注明分区时<strong>保持元素间的相对顺序</strong>，不必按下标执行算法。这时一次分区就是：比 pivot 小的按原次序组成左段，比它大的按原次序组成右段。</p>
<pre><code class="lang-text">[13 4 5 43 22 2 3 1]   pivot 13 → [4 5 2 3 1] 13 [43 22]
├─ [4 5 2 3 1]         pivot 4  → [2 3 1] 4 [5]
│  ├─ [2 3 1]          pivot 2  → [1] 2 [3]
│  │  ├─ [1]
│  │  └─ [3]
│  └─ [5]
└─ [43 22]             pivot 43 → [22] 43 []
   └─ [22]</code></pre>
<p>先左后右读这棵树。参考答案把单元素也算作 pivot：<strong>13, 4, 2, 1, 3, 5, 43, 22</strong>；只算真正做了分区的则是 13, 4, 2, 43。作答时画出这棵树并说明单元素算不算，两种理解都清楚。</p>
<div class="callout note" data-label="提示">
<p>在“保持相对顺序”的规则下，这棵 pivot 树和把元素按原次序依次插入二叉搜索树得到的树完全一样（见 3.3 二叉搜索树），pivot 序列就是它的前序遍历。</p>
</div>
<p>题目若没有这句说明，就按课上的分区真的执行：第一次分区交换 43 ↔ 1、22 ↔ 3，pivot 13 再和 2 交换，得到 [2 4 5 1 3] 13 [22 43]，下一个 pivot 变成 2，做过分区的 pivot 依次是 13, 2, 5, 3, 22。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>追踪一次分区</strong>：写出每次交换、分区后的数组和返回的下标，严格按本课程的方案，不要换成别的分区写法。</li>
<li><strong>列出 pivot 序列</strong>：先看题目是否要求保持相对顺序。要求的话按原次序拆分画树（等于 BST 的前序）；不要求就真的执行分区，下一个 pivot 是分区后子数组的第一个元素。单元素算不算 pivot 要写明。</li>
<li><strong>写代码 / 填空</strong>：partition 和 quicksort 两个函数。要点：pivot = A[lo]；内循环带 <code>i &lt;= j</code>；最后和 A[j] 交换并返回 j；递归跳过 p；出口 <code>lo &lt; hi</code>。</li>
<li><strong>概念判断</strong>：分区后 pivot 在最终位置，两段仍无序；分区 O(n)；快速排序没有合并步骤。</li>
</ul>
<p>这些都要背，公式表上没有。整体复杂度、pivot 的其他选法和稳定性见 5.6。</p>
<div class="callout warn" data-label="易错">
<ul>
<li>收尾时和 A[i] 交换：一个 ≥ pivot 的元素会被换到最左边。</li>
<li>交叉之后又交换了一次 A[i] 和 A[j]：上例第 3 轮若把 7 和 4 对调，7 就跑进了左段。</li>
<li>以为分区后两段已经有序：分区只保证“左小右大”。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">1. 用本课程的分区方案对 [6, 9, 2, 8, 1, 7, 3, 5] 做一次分区，写出每次交换、分区后的数组和返回值。接下来的两个递归调用各处理哪一段？左边那段分区时会发生什么？</summary>
  <div class="qa__body">
<pre><code class="lang-text">pivot = 6，i = 1，j = 7
第 1 轮  i 停在 1（9 ≥ 6），j 停在 7（5 &lt; 6）
         交换 9 ↔ 5  →  6 5 2 8 1 7 3 9，i = 2，j = 6
第 2 轮  i 跳过 2，停在 3（8 ≥ 6）；j 停在 6（3 &lt; 6）
         交换 8 ↔ 3  →  6 5 2 3 1 7 8 9，i = 4，j = 5
第 3 轮  i 跳过 1，停在 5（7 ≥ 6）；j 跳过 7，j = 4 &lt; i，交叉
收尾     pivot 6 ↔ A[4] = 1  →  1 5 2 3 6 7 8 9，返回 4</code></pre>
<p>这次是 i 先停下、j 越过 i 才交叉。接下来调用 quicksort(A, 0, 3) 处理 [1 5 2 3]，quicksort(A, 5, 7) 处理 [7 8 9]。[1 5 2 3] 的 pivot 1 是最小值：i 停在下标 1 的 5，j 跳过 3、2、5 一路退回下标 0，pivot 和自己交换，左段为空，右段是 [5 2 3]。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">2. 有人把 partition 的最后两行写成 <code>swap(&amp;A[lo], &amp;A[i]); return i;</code>。对课上的数组 [5, 8, 7, 1, 3, 4, 0, 6, 9, 2]，这次分区得到什么？错在哪里？</summary>
  <div class="qa__body">
<p>扫描部分不变，结束时数组是 5 2 0 1 3 4 7 6 9 8，i = 6，j = 5。错误的收尾把 5 和 A[6] = 7 交换，得到 <strong>[7, 2, 0, 1, 3, 4, 5, 6, 9, 8]</strong>，返回 6：5 不在最终位置（应在下标 5），左边还混进了比它大的 7。</p>
<p>继续递归更糟。quicksort(A, 0, 5) 处理 [7 2 0 1 3 4]：其余元素都比 7 小，i 走到 6，已经出了这一段，7 和段外的 5 对调，又返回 6；下一次 quicksort(A, 0, 5) 再把两者换回来，<strong>无限递归</strong>。原因：扫描结束时 A[i] 属于 ≥ pivot 的一段，甚至可能是当前段之外的 hi + 1；只有 A[j] 保证小于 pivot（或者就是 pivot 自己）。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">3. 对 {20, 7, 31, 4, 12, 25, 40, 9} 始终取最左元素作 pivot。(a) 题目要求分区时保持相对顺序，依次选出哪些 pivot？(b) 改用本课程的原地分区，第一次分区后数组是什么？第二个 pivot 是谁？</summary>
  <div class="qa__body">
<p>(a) 按原次序拆分：</p>
<pre><code class="lang-text">pivot 20 → [7 4 12 9] 20 [31 25 40]
pivot 7  → [4] 7 [12 9]        （20 的左段）
pivot 12 → [9] 12 []           （7 的右段）
pivot 31 → [25] 31 [40]        （20 的右段）</code></pre>
<p>先左后右，连单元素在内依次是 <strong>20, 7, 4, 12, 9, 31, 25, 40</strong>；只算做了分区的是 20, 7, 12, 31。按 20, 7, 31, 4, 12, 25, 40, 9 的次序建 BST，前序遍历正是这个序列。</p>
<p>(b) i 跳过 7，停在 31（下标 2）；j 在 9（下标 7）就停，交换 31 ↔ 9，得到 20 7 9 4 12 25 40 31，i = 3，j = 6。i 跳过 4、12，停在 25（下标 5）；j 跳过 40、25，退到下标 4，交叉。pivot 20 和 A[4] = 12 交换：<strong>[12 7 9 4] 20 [25 40 31]</strong>。第二个 pivot 是左段第一个元素 <strong>12</strong>，不是 (a) 里的 7。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">4. 多选，关于本课程的分区（pivot 取第一个元素），哪些正确？(A) 分区结束后 pivot 在最终位置；(B) 分区结束后 pivot 左边的元素已经有序；(C) 对 n 个元素分区是 O(n)；(D) 扫描结束后应把 pivot 和 A[i] 交换；(E) 等于 pivot 的元素放左边还是右边，不影响排序的正确性；(F) 对已排好序的数组分区，pivot 留在原位，左段为空；(G) 两次递归之后还需要一个 O(n) 的合并步骤。</summary>
  <div class="qa__body">
<p><strong>A、C、E、F 正确。</strong></p>
<p>A：左边恰好是所有更小的元素，pivot 的下标就是它排好序后的下标。C：i、j 相向而行，合起来只扫一遍。E：课上明确说放哪边都可以，本课程约定放右边。F：pivot 是最小值，j 一路退回 lo，pivot 和自己交换。</p>
<p>B 错：课上例子分区后左段是 [4 2 0 1 3]。D 错：应和 A[j] 交换。G 错：快速排序没有合并步骤，两段排好后整个数组就有序。</p>
  </div>
</details>
`;

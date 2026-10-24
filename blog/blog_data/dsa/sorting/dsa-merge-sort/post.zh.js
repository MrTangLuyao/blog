/* Post body — dsa-merge-sort / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-merge-sort:zh'] = `
<p class="lead">归并排序（merge sort）：把数组从中间切成两半，两半各自排好，再把两个有序的一半合并成一个。任何输入都是 Θ(n log n)，稳定，但要 O(n) 的额外空间。</p>

<h2>从一个场景说起</h2>
<p>期末改卷，两位助教各改了一半，各自把试卷按学号从小到大排好。现在要把两叠合成一叠。</p>
<p>每叠最上面那张就是这叠里学号最小的，所以全部试卷里最小的<strong>一定是两叠顶上的某一张</strong>。比一比两张顶上的，拿走小的放进新的一叠，再比新露出来的两张……一叠拿完，另一叠剩下的整叠放上去就行。</p>
<p>如果手里是一大叠乱序的试卷，就对半分给两个人，各自排好后再这样合起来。他们手里的也乱？继续对半分，直到每人只拿 1 张。1 张当然算排好了，然后一层层合并回来。这就是归并排序。</p>

<h2>它是什么</h2>
<p>简单说，归并排序就是<strong>先拆成两半分别排好，再合并</strong>。它是分治（divide and conquer）的典型例子，课上分三步：</p>
<ul>
<li><strong>拆分（split）</strong>：从中间切开。只是定个切点，不费事。</li>
<li><strong>求解（solve）</strong>：两半各自递归排序。长度 ≤ 1 的数组本来有序，直接返回，这是递归出口（base case），对应“每人只拿 1 张”。</li>
<li><strong>合并（join，即 merge）</strong>：两个有序数组合成一个。所有比较都在这一步。</li>
</ul>
<p>快速排序（5.5）正相反：力气花在拆分上（partition 要拿 pivot 和每个元素比），两边排好后不用合。一句话：<strong>快排难分易合，归并易分难合</strong>。</p>

<h2>看个例子</h2>
<h3>先看合并</h3>
<p>课上的举牌演示：L = [1, 3, 6, 6, 7, 8]，R = [2, 4]，两边都已排好。指针 i、j 指着两边的队首，每轮比较 L[i] 和 R[j]，小的抄进输出，那一边的指针后移一格：</p>
<pre><code class="lang-text">比较 1 vs 2  → 取 1（L）    输出 1
比较 3 vs 2  → 取 2（R）    输出 1 2
比较 3 vs 4  → 取 3（L）    输出 1 2 3
比较 6 vs 4  → 取 4（R）    输出 1 2 3 4
R 用完，L 剩下的 6 6 7 8 照抄   输出 1 2 3 4 6 6 7 8</code></pre>
<p>R 用完后不再比较：L 剩下的本身有序，又不小于已输出的元素，照抄就对。一共比较 4 次。</p>
<p>另一条规矩：<strong>两个队首相等时，取左边 L 的</strong>，稳定性就靠它。</p>
<p>每轮输出一个元素、只做常数次操作，所以<strong>合并是 Θ(m + k)</strong>（m、k 是两边长度）。比较<strong>最多 m + k − 1 次</strong>（比到只剩一个元素），<strong>最少 min(m, k) 次</strong>（短的一边整体更小，取完就停）。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-merge-sort/anims/merge.html" loading="lazy" style="height: 480px;" title="合并两个有序数组"></iframe>
<p class="anim-caption">按“下一步”逐轮看：橙色是正在比较的两个队首，取走的变暗。切到“有相等键”，看两个 5 相遇时取的是左边那个。</p>

<h3>再看整个排序</h3>
<p>课上 8 位同学的例子，两个 6 记作 6₁、6₂，圈号是合并的先后顺序：</p>
<pre><code class="lang-text">拆分  [6₁ 3 8 6₂ 7 1 4 2]
      [6₁ 3 8 6₂]          [7 1 4 2]
      [6₁ 3]   [8 6₂]      [7 1]   [4 2]
      [6₁] [3] [8] [6₂]    [7] [1] [4] [2]      单个元素，有序
合并  ①[3 6₁]  ②[6₂ 8]     ④[1 7]  ⑤[2 4]
      ③[3 6₁ 6₂ 8]         ⑥[1 2 4 7]
      ⑦[1 2 3 4 6₁ 6₂ 7 8]</code></pre>
<p>执行是<strong>深度优先</strong>的：左半先完全排好（①②③），右半才开始拆（④⑤⑥），最后 ⑦ 合并两半。因为对左半的递归调用没返回之前，对右半的调用还没开始。</p>
<p>第 ③ 次合并时 6₁ 和 6₂ 相等，取左边的 6₁。第 ⑦ 次比较了 7 次 = 4 + 4 − 1，是最多的情况。</p>
<p>每次合并把两段变一段，8 段到 1 段，共 <strong>n − 1 = 7 次合并</strong>；merge_sort 共调用 <strong>2n − 1 = 15 次</strong>（7 次拆分再合并，8 次遇到单个元素直接返回）。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-merge-sort/anims/mergesort.html" loading="lazy" style="height: 480px;" title="自顶向下归并排序的拆分与合并"></iframe>
<p class="anim-caption">蓝色在等两半排好，橙色是刚合并的结果，绿色已有序。“奇数个”看 7 个元素怎样分成 4 + 3，“已排好”对比比较次数。</p>

<h2>C 代码</h2>
<p>先是合并，把有序的 L、R 合进 A：</p>
<pre><code>void merge(int L[], int nL, int R[], int nR, int A[]) {
    int i = 0, j = 0;
    for (int k = 0; k &lt; nL + nR; k++) {
        if (j &gt;= nR || (i &lt; nL &amp;&amp; L[i] &lt;= R[j])) {
            A[k] = L[i++];
        } else {
            A[k] = R[j++];
        }
    }
}</code></pre>
<ul>
<li><strong>第 2–3 行</strong>：i、j 是 L、R 的队首；k 是输出位置，每轮填一格。</li>
<li><strong>第 4 行</strong>：R 已用完，或 L 还有剩且 <code>L[i] &lt;= R[j]</code>，就取左边。<code>&lt;=</code> 就是“相等取左”。</li>
<li><strong>第 5、7 行</strong>：<code>L[i++]</code> 先取 L[i]，再让 i 加一；<code>R[j++]</code> 同理。</li>
<li>“一边用完照抄另一边”不用另写循环：一边用完后，第 4 行的条件会一直偏向另一边。</li>
</ul>
<p>再是排序本身，照课上的写法把两半复制到两个新数组：</p>
<pre><code>void merge_sort(int A[], int n) {
    if (n &lt; 2) return;
    int mid = (n + 1) / 2;
    int *L = malloc(mid * sizeof(int));
    int *R = malloc((n - mid) * sizeof(int));
    assert(L != NULL &amp;&amp; R != NULL);
    for (int k = 0; k &lt; mid; k++) L[k] = A[k];
    for (int k = mid; k &lt; n; k++) R[k - mid] = A[k];
    merge_sort(L, mid);
    merge_sort(R, n - mid);
    merge(L, mid, R, n - mid, A);
    free(L);
    free(R);
}</code></pre>
<ul>
<li><strong>第 2 行</strong>：递归出口，0 或 1 个元素已经有序。</li>
<li><strong>第 3 行</strong>：奇数长度时左半多一个（7 → 4 + 3，和课上一致）。写成 <code>n / 2</code> 也对，只是切点不同，手算按题目约定。</li>
<li><strong>第 4–8 行</strong>：拆分，malloc 两个新数组，复制前一半和后一半。</li>
<li><strong>第 9–11 行</strong>：两半各自递归排好，再合并写回 A。</li>
<li><strong>第 12–13 行</strong>：临时数组用完就 free。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li><code>&lt;=</code> 写成 <code>&lt;</code>：仍然有序，但<strong>不再稳定</strong>（见例题 2）。</li>
<li>漏掉 <code>j &gt;= nR</code>，或把它挪到 <code>L[i] &lt;= R[j]</code> 后面：R 用完时会读越界的 <code>R[nR]</code>。</li>
</ul>
</div>

<h2>为什么是 Θ(n log n)</h2>
<p>把拆分图看成递归树（recursion tree）：第 i 层是 2<sup>i</sup> 个长 n/2<sup>i</sup> 的数组，<strong>每层加起来正好 n 个元素</strong>，复制加合并是 Θ(n)。长度每层减半，8 → 4 → 2 → 1，共 <strong>log₂ n 层</strong>。每层 n、共 log₂ n 层，合计 <strong>Θ(n log n)</strong>。</p>
<p>递推式（recurrence）是 <strong>T(n) = 2T(n/2) + cn</strong>。用主定理（Master Theorem，公式表上有）：a = 2，b = 2，d = 1，a = b<sup>d</sup>，得 Θ(n log n)（见 1.9）。</p>
<p>而且<strong>最好 = 平均 = 最坏 = Θ(n log n)</strong>：切点只看长度、不看数据，每个元素每层都要抄一遍。已排好的 8 个元素照样比较 12 次（乱序的课上例子是 16 次）。所以它<strong>不自适应（not adaptive）</strong>，能利用有序段的版本见 5.8。</p>

<h2>稳定，但不原地</h2>
<p><strong>稳定（stable）</strong>指相等的键保持原来的先后次序。拆分按原顺序复制，不打乱次序；合并时两个相等的键：</p>
<ul>
<li><strong>分在两边</strong>：左边的本来在前，相等取左，它仍先出（如 6₁、6₂）。</li>
<li><strong>在同一边</strong>：这一边已被递归稳定地排好，指针按原次序把它们抄出。</li>
</ul>
<p><strong>不原地（not in-place）</strong>：第一次拆分就复制了 n 个元素。每次合并完马上 free，同时存在的只有当前递归路径上的数组，约 n + n/2 + n/4 + … ≈ 2n，加上 O(log n) 的递归栈，<strong>额外空间 O(n)</strong>。对比：选择、插入排序 O(1)，快排平均 O(log n)。原地归并排序不在本课范围内。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>手算</strong>：合并的输出顺序和比较次数；整个排序每次合并的结果。</li>
<li><strong>选择、填空</strong>：时间、空间、稳定、原地、自适应。2015 年真题问过时间和空间，答 O(n log n) 和 O(n)。</li>
<li><strong>解释</strong>：为什么稳定；为什么已排好也要 n log n。</li>
<li><strong>写代码</strong>：merge 或 merge_sort（第 8 周 workshop 写过），注意 <code>&lt;=</code>、一边用完、free。</li>
</ul>
<p>公式表上有主定理，但归并排序的复杂度和性质要自己记。</p>

<h3>例题 1：手算整个排序</h3>
<p>用上面的代码排序 [5₁, 2, 9, 1, 5₂, 6, 3]，按顺序写出每次合并。共几次合并？两个 5 谁在前？</p>
<p>左半取 ⌈7/2⌉ = 4 个：[5₁ 2 9 1] 和 [5₂ 6 3]。左半再分成 [5₁ 2]、[9 1]；右半分成 [5₂ 6]、[3]。深度优先，先合完左半：</p>
<pre><code class="lang-text">① [5₁] + [2]               → [2 5₁]
② [9] + [1]                → [1 9]
③ [2 5₁] + [1 9]           → [1 2 5₁ 9]
④ [5₂] + [6]               → [5₂ 6]
⑤ [5₂ 6] + [3]             → [3 5₂ 6]
⑥ [1 2 5₁ 9] + [3 5₂ 6]    → [1 2 3 5₁ 5₂ 6 9]</code></pre>
<p>共 <strong>6 次合并</strong>（n − 1），调用 13 次（2n − 1）。第 ⑥ 次合并时 5₁、5₂ 相等，取左边的 5₁，所以 <strong>5₁ 在前</strong>，和输入次序一致。</p>
<p>常见错法：右半切成 [5₂] 和 [6 3]；或者先做完所有两两合并（那是 5.8 的自底向上，顺序不同）。</p>

<h3>例题 2：把 &lt;= 改成 &lt;</h3>
<p>把 merge 里的 <code>L[i] &lt;= R[j]</code> 改成 <code>L[i] &lt; R[j]</code>。结果还有序吗？对 [2₁, 1, 2₂] 运行得到什么？</p>
<p><strong>仍然有序</strong>：队首相等时，取哪个都是剩下最小的。但<strong>不稳定</strong>了：mid = 2，L = [2₁, 1] 先排成 [1, 2₁]，R = [2₂]。合并时 1 &lt; 2₂，取 1；2₁ &lt; 2₂ 不成立，取 2₂；R 用完，抄 2₁。结果 <strong>[1, 2₂, 2₁]</strong>，两个 2 换了位置。时间复杂度不变。</p>

<div class="callout warn" data-label="易错">
<ul>
<li>“输入已排好时是 Θ(n)”：错，那是 5.8 的自适应版本。</li>
<li>额外空间写成 O(log n)：那是快排。</li>
<li>“合并总是比较 m + k − 1 次”：错，最少只要 min(m, k) 次。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>对半拆，两半递归排好，再合并；长度 ≤ 1 直接返回。易分难合，和快排相反。</li>
<li>合并：比较两个队首，小的先出，<strong>相等取左</strong>；一边用完照抄另一边。Θ(m + k)，比较 min(m, k) 到 m + k − 1 次。</li>
<li>T(n) = 2T(n/2) + cn，每层 n、共 log₂ n 层：最好 = 平均 = 最坏 = Θ(n log n)，不自适应。</li>
<li>稳定（靠相等取左）；不原地，额外空间 O(n)。</li>
<li>n 个元素：n − 1 次合并，2n − 1 次调用，执行顺序深度优先。</li>
</ul>
`;

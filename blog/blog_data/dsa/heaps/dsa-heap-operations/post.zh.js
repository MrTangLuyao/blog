/* Post body — dsa-heap-operations / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-heap-operations:zh'] = `
<p class="lead">堆的修改操作都分两步：先保住完全二叉树的形状，再修复堆条件。插入把新键放到末尾再<strong>上浮（sift up）</strong>；删除最大值把根与末尾交换、缩小堆，再<strong>下沉（sift down）</strong>。两者都只走一条根到叶的路径，最坏 Θ(log n)。</p>

<h2>约定与例子</h2>
<p>本课程默认<strong>最大堆（max-heap）</strong>：完全二叉树，且每个父结点 ≥ 它的孩子。堆存在数组 H[1..n] 中，<strong>H[0] 不用</strong>；下标 i 的父结点是 ⌊i/2⌋，孩子是 2i 和 2i+1（见 6.1）。下面的轨迹都用课上这个 10 个元素的堆：</p>

<figure class="fig">
<svg viewBox="0 0 520 296" width="520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="课上的例子堆，树和数组两种表示，并标出下一次插入的位置 H[11]">
<g stroke="rgba(255,255,255,0.35)" stroke-width="2">
<line x1="250" y1="40" x2="130" y2="95"/><line x1="250" y1="40" x2="370" y2="95"/>
<line x1="130" y1="95" x2="70" y2="150"/><line x1="130" y1="95" x2="190" y2="150"/>
<line x1="370" y1="95" x2="310" y2="150"/><line x1="370" y1="95" x2="430" y2="150"/>
<line x1="70" y1="150" x2="40" y2="205"/><line x1="70" y1="150" x2="100" y2="205"/>
<line x1="190" y1="150" x2="160" y2="205"/>
</g>
<line x1="190" y1="150" x2="212" y2="191" stroke="#d97757" stroke-width="2" stroke-dasharray="4 4"/>
<g fill="#343433" stroke="#5a5a59" stroke-width="2">
<circle cx="250" cy="40" r="16"/><circle cx="130" cy="95" r="16"/><circle cx="370" cy="95" r="16"/>
<circle cx="70" cy="150" r="16"/><circle cx="190" cy="150" r="16"/><circle cx="310" cy="150" r="16"/><circle cx="430" cy="150" r="16"/>
<circle cx="40" cy="205" r="16"/><circle cx="100" cy="205" r="16"/><circle cx="160" cy="205" r="16"/>
</g>
<circle cx="220" cy="205" r="16" fill="none" stroke="#d97757" stroke-width="2" stroke-dasharray="4 4"/>
<g fill="#e8e8e8" font-size="14" font-weight="700" text-anchor="middle">
<text x="250" y="45">27</text><text x="130" y="100">24</text><text x="370" y="100">26</text>
<text x="70" y="155">7</text><text x="190" y="155">12</text><text x="310" y="155">6</text><text x="430" y="155">19</text>
<text x="40" y="210">2</text><text x="100" y="210">7</text><text x="160" y="210">7</text>
</g>
<g fill="#a1a1a0" font-size="12" text-anchor="middle">
<text x="250" y="19">1</text><text x="130" y="74">2</text><text x="370" y="74">3</text>
<text x="70" y="129">4</text><text x="190" y="129">5</text><text x="310" y="129">6</text><text x="430" y="129">7</text>
<text x="40" y="184">8</text><text x="100" y="184">9</text><text x="160" y="184">10</text>
<text x="220" y="184" fill="#d97757">11</text>
</g>
<rect x="22" y="240" width="36" height="30" rx="6" fill="none" stroke="#5a5a59" stroke-width="1.5" stroke-dasharray="3 3"/>
<g fill="#343433" stroke="#5a5a59" stroke-width="1.5">
<rect x="62" y="240" width="36" height="30" rx="6"/><rect x="102" y="240" width="36" height="30" rx="6"/>
<rect x="142" y="240" width="36" height="30" rx="6"/><rect x="182" y="240" width="36" height="30" rx="6"/>
<rect x="222" y="240" width="36" height="30" rx="6"/><rect x="262" y="240" width="36" height="30" rx="6"/>
<rect x="302" y="240" width="36" height="30" rx="6"/><rect x="342" y="240" width="36" height="30" rx="6"/>
<rect x="382" y="240" width="36" height="30" rx="6"/><rect x="422" y="240" width="36" height="30" rx="6"/>
</g>
<rect x="462" y="240" width="36" height="30" rx="6" fill="none" stroke="#d97757" stroke-width="1.5" stroke-dasharray="3 3"/>
<g fill="#e8e8e8" font-size="14" font-weight="700" text-anchor="middle">
<text x="80" y="260">27</text><text x="120" y="260">24</text><text x="160" y="260">26</text><text x="200" y="260">7</text>
<text x="240" y="260">12</text><text x="280" y="260">6</text><text x="320" y="260">19</text><text x="360" y="260">2</text>
<text x="400" y="260">7</text><text x="440" y="260">7</text>
</g>
<g fill="#a1a1a0" font-size="12" text-anchor="middle">
<text x="40" y="287">0</text><text x="80" y="287">1</text><text x="120" y="287">2</text><text x="160" y="287">3</text>
<text x="200" y="287">4</text><text x="240" y="287">5</text><text x="280" y="287">6</text><text x="320" y="287">7</text>
<text x="360" y="287">8</text><text x="400" y="287">9</text><text x="440" y="287">10</text>
<text x="480" y="287" fill="#d97757">11</text>
</g>
</svg>
<figcaption>课上的例子堆。结点上方和格子下方的灰色数字是下标；橙色虚线是下一次插入要占的位置 H[11]；H[0] 不存元素。</figcaption>
</figure>

<p>n 个元素的完全二叉树只有一种形状，正好占满 H[1..n]。所以插入只能占用新位置 H[n+1]，删除只能让 H[n] 空出来；之后再通过交换调整键的位置。</p>

<h2>插入：放到末尾，再上浮</h2>
<ol>
<li><strong>放到末尾</strong>：n 加 1，新键写进 H[n]，也就是最底层最左边的空位（这一层满了就开新的一层）。形状仍是完全二叉树。</li>
<li><strong>上浮（sift up，也叫 upheap、bubble up）</strong>：和父结点比较，父结点更小就交换，再在新位置继续；到达根，或父结点 ≥ 它时停止。</li>
</ol>
<p>交换不会在别处制造新的违规：新键 x 与父结点 p 交换后，p 成为 x 的孩子，p 原来的另一个孩子本来就 ≤ p &lt; x。违规只可能出现在 x 与它的新父结点之间，所以一路往上查即可。</p>
<p>例：插入 25（i 是 25 当前的下标）。</p>
<table>
<thead><tr><th>步骤</th><th>比较与动作</th><th>H[1..n]</th></tr></thead>
<tbody>
<tr><td>n = 11</td><td>25 放入 H[11]，是 12 的右孩子</td><td><code>27 24 26 7 12 6 19 2 7 7 25</code></td></tr>
<tr><td>i = 11</td><td>父 H[5] = 12 &lt; 25，交换</td><td><code>27 24 26 7 25 6 19 2 7 7 12</code></td></tr>
<tr><td>i = 5</td><td>父 H[2] = 24 &lt; 25，交换</td><td><code>27 25 26 7 24 6 19 2 7 7 12</code></td></tr>
<tr><td>i = 2</td><td>父 H[1] = 27 ≥ 25，停</td><td>不变；共 3 次比较、2 次交换</td></tr>
</tbody>
</table>
<p>接着插入 32：放到 H[12]（6 的左孩子），依次与 6、26、27 交换，成为新的根，结果是 <code>32 25 27 7 24 26 19 2 7 7 12 6</code>。</p>

<div class="callout warn" data-label="易错">
<p>若在原来的堆中插入 6：H[11] = 6，与父结点 12 比较一次，12 ≥ 6，<strong>不交换</strong>，插入结束。它的兄弟 7 比它大也没有关系：<strong>堆条件只约束父子，兄弟之间从不比较</strong>，12 ≥ 7 且 12 ≥ 6 就满足了。</p>
</div>

<p><strong>代价</strong>（不计数组扩容；数组满时按 2.6 的倍增法扩容，均摊 O(1)）：最好 <strong>Θ(1)</strong>，新键不大于父结点，比较 1 次就停（插入 6）；最坏 <strong>Θ(log n)</strong>，新键一路换到根（插入 32），交换次数等于 H[n+1] 的深度 ⌊log₂(n+1)⌋。</p>

<h2>删除最大值：与末尾交换，再下沉</h2>
<p>最大值永远在根，<strong>找最大值（find max）只需返回 H[1]，Θ(1)</strong>。删除它却不能直接挖空根：形状要求空出来的只能是最后一格 H[n]。所以分三步：</p>
<ol>
<li><strong>交换</strong>：H[1] 与 H[n] 交换。</li>
<li><strong>缩小</strong>：n 减 1。原来的最大值仍在 H[n+1]，只是不再算在堆里，下次插入会直接覆盖它（堆排序 6.4 正是利用这一点）。</li>
<li><strong>下沉（sift down，也叫 downheap）</strong>：从根开始，把它和<strong>较大的孩子</strong>比较，比孩子小就交换，再在新位置继续；它 ≥ 两个孩子，或已经是叶子（2i &gt; n）时停止。</li>
</ol>
<p>必须选较大的孩子。根上的 7 有孩子 24 和 26：若与 24 交换，24 就成了 26 的父结点，又违规；与 26 交换，三者中最大的到了上面，两边都满足。</p>
<p>例：删除 27，再删除 26（i 是下沉元素 7 当前的下标；<code>|</code> 右边是已移出堆、仍在数组里的元素）。</p>
<table>
<thead><tr><th>步骤</th><th>比较与动作</th><th>数组</th></tr></thead>
<tbody>
<tr><td>删除 27</td><td>H[1] ↔ H[10]，n = 10 → 9</td><td><code>7 24 26 7 12 6 19 2 7 | 27</code></td></tr>
<tr><td>i = 1</td><td>孩子 24、26，较大的 26 &gt; 7，交换</td><td><code>26 24 7 7 12 6 19 2 7 | 27</code></td></tr>
<tr><td>i = 3</td><td>孩子 6、19，较大的 19 &gt; 7，交换</td><td><code>26 24 19 7 12 6 7 2 7 | 27</code></td></tr>
<tr><td>i = 7</td><td>2i = 14 &gt; 9，是叶子，停</td><td>不变</td></tr>
<tr><td>删除 26</td><td>H[1] ↔ H[9]，n = 9 → 8</td><td><code>7 24 19 7 12 6 7 2 | 26 27</code></td></tr>
<tr><td>i = 1</td><td>孩子 24、19，较大的 24 &gt; 7，交换</td><td><code>24 7 19 7 12 6 7 2 | 26 27</code></td></tr>
<tr><td>i = 2</td><td>孩子 7、12，较大的 12 &gt; 7，交换</td><td><code>24 12 19 7 7 6 7 2 | 26 27</code></td></tr>
<tr><td>i = 5</td><td>2i = 10 &gt; 8，是叶子，停</td><td>不变</td></tr>
</tbody>
</table>
<p>第二次删除在 i = 2 处，左孩子 7 与它相等，不构成违规；决定交换的是较大的孩子 12。</p>

<div class="callout key" data-label="考点">
<p>上浮只和<strong>父结点</strong>比，每层 1 次比较；下沉先比较<strong>两个孩子</strong>，再与较大者比，每层最多 2 次比较，并与<strong>较大的孩子</strong>交换。两者的停止条件都含等号：相等不交换。</p>
</div>

<p><strong>代价</strong>：最坏 <strong>Θ(log n)</strong>，从末尾换上来的元素通常较小，会一路沉到底层。最好 <strong>Θ(1)</strong>：换上来的元素恰好不小于根的两个孩子，一次也不用交换。它原本在其中一个孩子的子树里、不大于这个孩子，所以这基本只在有相等键时发生，课上的例子是所有键都等于 7。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-heap-operations/anims/heap-ops.html" loading="lazy" style="height: 520px;" title="最大堆的插入与删除最大值"></iframe>
<p class="anim-caption">选一个课上的例子逐步播放，看每次比较的是哪两个结点、交换后数组怎样变化；也可以输入自己的键，在当前堆上继续插入或删除最大值。</p>

<h2>C 实现</h2>
<p>下标从 1 开始；堆的大小 n 用指针传入，插入和删除时要修改它。</p>
<pre><code>/* 最大堆存在 H[1..n]，H[0] 不用；n 是当前堆的大小 */
void swap(int H[], int a, int b) {
    int t = H[a];
    H[a] = H[b];
    H[b] = t;
}

/* 上浮（sift up / upheap）：父结点更小就交换 */
void siftup(int H[], int i) {
    while (i &gt; 1 &amp;&amp; H[i / 2] &lt; H[i]) {
        swap(H, i, i / 2);
        i = i / 2;
    }
}

/* 下沉（sift down / downheap）：和较大的孩子交换 */
void siftdown(int H[], int n, int i) {
    while (2 * i &lt;= n) {                     /* 至少有左孩子 */
        int c = 2 * i;
        if (c + 1 &lt;= n &amp;&amp; H[c + 1] &gt; H[c]) {
            c = c + 1;                       /* 右孩子存在且更大 */
        }
        if (H[i] &gt;= H[c]) {
            break;                           /* 不小于两个孩子：停 */
        }
        swap(H, i, c);
        i = c;
    }
}

/* 插入：调用前保证数组至少有 *n + 2 格 */
void heap_insert(int H[], int *n, int key) {
    (*n)++;
    H[*n] = key;                             /* 放到下一个空位 */
    siftup(H, *n);
}

/* 删除最大值：调用前保证 *n &gt;= 1 */
int heap_deletemax(int H[], int *n) {
    int max = H[1];
    swap(H, 1, *n);                          /* 根与最后一个交换 */
    (*n)--;                                  /* 先缩小，max 留在 H[*n + 1] */
    siftdown(H, *n, 1);
    return max;
}</code></pre>
<ul>
<li><code>2 * i &lt;= n</code> 表示 i 至少有左孩子；右孩子还要单独检查 <code>c + 1 &lt;= n</code>，因为最后一个父结点可能只有左孩子。</li>
<li>两个孩子相等时选哪个都对（课上没有规定）；这里右孩子严格更大才选它，所以相等时取左孩子。</li>
<li><code>heap_deletemax</code> 必须<strong>先把 n 减 1 再下沉</strong>。顺序反了，刚换到 H[n] 的最大值会被当成孩子换回堆中：对 <code>10 9 1 8</code> 删除最大值，会得到 <code>9 10 1 | 8</code>，10 还在堆里，丢掉的反而是 8。</li>
</ul>

<h2>删除任意位置的元素</h2>
<p>删除下标 k 处的元素也是同样的思路：H[k] 与 H[n] 交换，n 减 1，再修复下标 k。区别在于换来的元素 x 来自堆的另一处，与 k 的祖先之间没有大小保证：</p>
<ul>
<li>x 比新父结点 H[⌊k/2⌋] 大：<strong>上浮</strong>；</li>
<li>否则 x 可能比某个孩子小：<strong>下沉</strong>（也可能不动）。</li>
</ul>
<p>两者至多一个真正移动。删除根时只需下沉，因为根没有父结点；删除一般位置时两个方向都要检查，课上讲优先队列的 delete、changeWeight 时也是“上浮或下沉”（见 6.5）。</p>
<p>例：堆 <code>50 10 40 5 8 35 30</code> 删除下标 4 的 5。末尾的 30 换到下标 4，n = 6；父结点 H[2] = 10 &lt; 30，上浮，与 10 交换；H[1] = 50 ≥ 30，停。结果 <code>50 30 40 10 8 35</code>。只做下沉的话，30 会留在 10 下面，不是堆。沿用上面的三个函数：</p>
<pre><code>/* 删除下标 k 处的元素，1 &lt;= k &lt;= *n */
void heap_delete(int H[], int *n, int k) {
    swap(H, k, *n);
    (*n)--;
    if (k &gt; *n) {
        return;                              /* 删的就是最后一个 */
    }
    if (k &gt; 1 &amp;&amp; H[k] &gt; H[k / 2]) {
        siftup(H, k);                        /* 比新父结点大：上浮 */
    } else {
        siftdown(H, *n, k);                  /* 否则下沉（也可能不动） */
    }
}</code></pre>
<p>代价 Θ(log n)，前提是已知下标 k；只知道键时要先线性查找，O(n)。优先队列用一张额外的索引表解决这个问题（见 6.5）。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>画图题</strong>：给一个堆（数组或树），依次插入、删除最大值若干次，写出每步后的数组或画出树，有时还问交换次数。</li>
<li><strong>代码题</strong>：写 sift down、sift up、insert 或 deletemax；题目可能改成最小堆（min-heap）或从下标 0 开始，先写清下标约定。</li>
<li><strong>复杂度</strong>：find max Θ(1)；insert 最好 Θ(1)、最坏 Θ(log n)；delete max 最好 Θ(1)（相等键）、最坏 Θ(log n)；已知下标时删除任意元素 O(log n)。</li>
<li><strong>必须背</strong>：下标公式和两种操作的步骤，公式表上都没有。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li>插入时把新键和兄弟比较，或者把它直接放到“看起来合适”的位置，而不是先放进 H[n+1]。</li>
<li>下沉时与较小的孩子交换，或者只看左孩子。</li>
<li>删除最大值时直接挖掉根、把较大的孩子提上来，树中间会出现空洞，不再是完全二叉树。</li>
<li>删除任意位置只做下沉，忘了检查上浮。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. 最大堆 H[1..7] = 40 30 35 10 20 25 15。依次插入 38、删除最大值、再删除最大值，写出每步后的数组和交换次数。</summary>
<div class="qa__body">
<p><strong>插入 38</strong>：H[8] = 38。父 H[4] = 10 &lt; 38，交换；父 H[2] = 30 &lt; 38，交换；父 H[1] = 40 ≥ 38，停。结果 <code>40 38 35 30 20 25 15 10</code>，2 次交换。</p>
<p><strong>删除 40</strong>：H[1] ↔ H[8]，n = 7，得 <code>10 38 35 30 20 25 15 | 40</code>。i = 1：孩子 38、35，与 38 交换；i = 2：孩子 30、20，与 30 交换；i = 4：2i = 8 &gt; 7，停。结果 <code>38 30 35 10 20 25 15 | 40</code>，2 次交换。</p>
<p><strong>删除 38</strong>：H[1] ↔ H[7]，n = 6，得 <code>15 30 35 10 20 25 | 38 40</code>。i = 1：孩子 30、35，与 35 交换；i = 3：2i+1 = 7 &gt; 6，只有左孩子 25 &gt; 15，交换；i = 6 是叶子，停。结果 <code>35 30 25 10 20 15 | 38 40</code>，2 次交换。</p>
<pre><code class="lang-text">        35
      /    \\
    30      25
   /  \\    /
  10  20  15</code></pre>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 最大堆 H[1..10] = 50 45 20 30 40 18 15 25 28 35。先删除 45（下标 2），再删除 18（此时在下标 6）。每次说明是上浮还是下沉。</summary>
<div class="qa__body">
<p><strong>删除 45</strong>：H[2] ↔ H[10]，n = 9，得 <code>50 35 20 30 40 18 15 25 28 | 45</code>。35 的父结点 50 ≥ 35，不上浮；孩子 30、40，较大的 40 &gt; 35，<strong>下沉</strong>，交换；到下标 5 后 2×5 = 10 &gt; 9，没有孩子，停。结果 <code>50 40 20 30 35 18 15 25 28</code>。</p>
<p><strong>删除 18</strong>：H[6] ↔ H[9]，n = 8，得 <code>50 40 20 30 35 28 15 25 | 18 45</code>。28 的父结点 H[3] = 20 &lt; 28，<strong>上浮</strong>，交换；H[1] = 50 ≥ 28，停。结果 <code>50 40 28 30 35 20 15 25</code>。</p>
<p>28 原本在左子树，被换到右子树后比那里的父结点大，所以删除任意位置时必须检查上浮。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 一个有 100 个元素的最大堆。(a) 插入一个新元素最多交换几次？它可能经过哪些下标？(b) 删除最大值最多交换几次？(c) 两种操作最少各要比较几次？</summary>
<div class="qa__body">
<p>(a) 新元素放在 H[101]，只能沿父结点链上升：101 → 50 → 25 → 12 → 6 → 3 → 1。最多 <strong>6</strong> 次交换，即 ⌊log₂ 101⌋。</p>
<p>(b) 删除后 n = 99，根上的元素最多沉到最深一层。下标 64..99 的深度是 ⌊log₂ 99⌋ = 6，所以最多 <strong>6</strong> 次交换；每层 2 次比较，最多 12 次比较。</p>
<p>(c) 插入至少 <strong>1</strong> 次（和父结点比一次就停）。删除最大值至少 <strong>2</strong> 次：n = 99 时根有两个孩子，先比较两个孩子，再与较大者比较，相等或更大就停，0 次交换。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 把 <code>siftdown</code> 改写成最小堆（min-heap）、数组从下标 0 开始（H[0..n-1]）的版本。</summary>
<div class="qa__body">
<p>0 下标时孩子是 2i+1、2i+2，所以“有左孩子”变成 <code>2 * i + 1 &lt; n</code>；最小堆要选<strong>较小</strong>的孩子，停止条件改为 <code>H[i] &lt;= H[c]</code>。</p>
<pre><code>/* 最小堆存在 H[0..n-1]：孩子 2i+1、2i+2 */
void siftdown_min0(int H[], int n, int i) {
    while (2 * i + 1 &lt; n) {                  /* 至少有左孩子 */
        int c = 2 * i + 1;
        if (c + 1 &lt; n &amp;&amp; H[c + 1] &lt; H[c]) {
            c = c + 1;                       /* 选较小的孩子 */
        }
        if (H[i] &lt;= H[c]) {
            break;                           /* 不大于两个孩子：停 */
        }
        int t = H[i];
        H[i] = H[c];
        H[c] = t;
        i = c;
    }
}</code></pre>
<p>上浮相应改为：父结点是 <code>(i - 1) / 2</code>，循环条件 <code>i &gt; 0 &amp;&amp; H[(i - 1) / 2] &gt; H[i]</code>。</p>
</div>
</details>
`;

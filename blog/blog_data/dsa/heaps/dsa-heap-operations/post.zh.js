/* Post body — dsa-heap-operations / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-heap-operations:zh'] = `
<p class="lead">堆的改动只有两种：插入一个键，或删除最大值。插入是<strong>放到末尾再上浮（sift up）</strong>，删除最大值是<strong>把根和末尾交换，再下沉（sift down）</strong>。两者都只走一条从根到叶的路，最坏 Θ(log n)。</p>

<h2>从一个场景说起</h2>
<p>想象一家公司的座位表画成一棵树：老板坐最上面的 1 号位，每人最多直接管两个下属。规矩有两条：座位从 1 号起<strong>按顺序坐满</strong>，不能空着；每个上司的业绩都<strong>不低于</strong>直属下属。</p>
<p>新人入职，只能坐最后一个空位。他要是比上司强，两人换座位，再和新上司比，直到上司比他强，或者他坐到了 1 号位。</p>
<p>老板离职，1 号位空了。先把<strong>最后一个座位</strong>的人搬过去，空位就挪到了最后。这人业绩通常一般，就和两个直属下属比，<strong>请更强的那个上来</strong>换座位，再接着往下比，直到两个下属都不比他强。</p>
<p>堆的插入和删除最大值，做的就是这两件事。</p>

<h2>它是什么</h2>
<p>先回顾 6.1：本课默认<strong>最大堆（max-heap）</strong>，是一棵完全二叉树，并且每个父结点 ≥ 它的孩子，正对应公司的两条规矩。堆存在数组 H[1..n] 里，<strong>H[0] 不用</strong>；下标 i 的父结点是 ⌊i/2⌋，孩子是 2i 和 2i+1。</p>
<p>简单说，堆的每次修改都分两步：<strong>先保形状，再修大小关系</strong>。n 个元素的完全二叉树正好占满 H[1..n]，所以插入只能占新的一格 H[n+1]，删除只能让最后一格 H[n] 空出来。形状对了，再交换父子来修大小关系：往上修叫上浮，往下修叫下沉。</p>
<table>
<thead><tr><th>操作</th><th>第一步：保形状</th><th>第二步：修复</th></tr></thead>
<tbody>
<tr><td>插入（insert）</td><td>n 加 1，新键放进 H[n]</td><td><strong>上浮（sift up，也叫 upheap）</strong>：父结点比它小就交换，继续往上</td></tr>
<tr><td>删除最大值（delete max）</td><td>H[1] 与 H[n] 交换，n 减 1</td><td><strong>下沉（sift down，也叫 downheap）</strong>：和<strong>较大的孩子</strong>比，比它小就交换，继续往下</td></tr>
</tbody>
</table>
<p>只看最大值（find max）不用改动：返回根 H[1] 即可，<strong>Θ(1)</strong>。</p>

<h2>看个例子</h2>
<p>课上一直用这个 10 个元素的堆：</p>

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
<figcaption>课上的例子堆。灰色数字是下标；橙色虚线是下一次插入要占的位置 H[11]；H[0] 不存元素。</figcaption>
</figure>

<h3>插入 25：一路上浮</h3>
<p>25 先放进 H[11]，成为 12 的右孩子。之后每一步只和父结点比，i 是 25 当前的下标：</p>
<table>
<thead><tr><th>步骤</th><th>比较与动作</th><th>H[1..n]</th></tr></thead>
<tbody>
<tr><td>n = 11</td><td>25 放入 H[11]</td><td><code>27 24 26 7 12 6 19 2 7 7 25</code></td></tr>
<tr><td>i = 11</td><td>父 H[5] = 12 &lt; 25，交换</td><td><code>27 24 26 7 25 6 19 2 7 7 12</code></td></tr>
<tr><td>i = 5</td><td>父 H[2] = 24 &lt; 25，交换</td><td><code>27 25 26 7 24 6 19 2 7 7 12</code></td></tr>
<tr><td>i = 2</td><td>父 H[1] = 27 ≥ 25，停</td><td>不变；共 3 次比较、2 次交换</td></tr>
</tbody>
</table>
<p>为什么只往上查？交换后 12 和 7 都成了 25 的孩子，而 7 ≤ 12 &lt; 25，下面不会出问题；可能出问题的只有 25 和它的新父结点。</p>

<h3>再插入 32：浮到根</h3>
<p>32 放到 H[12]（6 的左孩子），依次和 6、26、27 交换，成为新的根，结果是 <code>32 25 27 7 24 26 19 2 7 7 12 6</code>。这是最坏情况：从最底层一路换到根。</p>

<div class="callout warn" data-label="易错">
<p>在原来的堆里插入 6：H[11] = 6，和父结点 12 比一次，12 ≥ 6，<strong>不交换</strong>，插入结束。它的兄弟 7 比它大也没关系：<strong>堆条件只管父子，兄弟之间从不比较</strong>。</p>
</div>

<h3>删除最大值 27：换到根，再下沉</h3>
<p>回到原来的堆。不能直接把根挖掉，那样树中间就有了洞。分三步：</p>
<ol>
<li><strong>交换</strong>：H[1] 与 H[10] 交换，最后一个 7 来到根。</li>
<li><strong>缩小</strong>：n 减到 9。27 还在 H[10]，只是不再算在堆里（堆排序 6.4 正是利用这一点）。</li>
<li><strong>下沉</strong>：7 和较大的孩子比，比它小就交换；直到它 ≥ 两个孩子，或成了叶子（2i &gt; n）。</li>
</ol>
<p>i 是 7 当前的下标，<code>|</code> 右边是已移出堆、仍在数组里的元素：</p>
<table>
<thead><tr><th>步骤</th><th>比较与动作</th><th>数组</th></tr></thead>
<tbody>
<tr><td>交换、缩小</td><td>H[1] ↔ H[10]，n = 9</td><td><code>7 24 26 7 12 6 19 2 7 | 27</code></td></tr>
<tr><td>i = 1</td><td>孩子 24、26，较大的 26 &gt; 7，交换</td><td><code>26 24 7 7 12 6 19 2 7 | 27</code></td></tr>
<tr><td>i = 3</td><td>孩子 6、19，较大的 19 &gt; 7，交换</td><td><code>26 24 19 7 12 6 7 2 7 | 27</code></td></tr>
<tr><td>i = 7</td><td>2i = 14 &gt; 9，是叶子，停</td><td>不变</td></tr>
</tbody>
</table>
<p>为什么选较大的孩子？i = 1 时若和 24 交换，24 就成了 26 的父结点，又违规；和 26 交换，三个数里最大的到了上面，两边都满足。</p>

<h3>再删除 26</h3>
<table>
<thead><tr><th>步骤</th><th>比较与动作</th><th>数组</th></tr></thead>
<tbody>
<tr><td>交换、缩小</td><td>H[1] ↔ H[9]，n = 8</td><td><code>7 24 19 7 12 6 7 2 | 26 27</code></td></tr>
<tr><td>i = 1</td><td>孩子 24、19，较大的 24 &gt; 7，交换</td><td><code>24 7 19 7 12 6 7 2 | 26 27</code></td></tr>
<tr><td>i = 2</td><td>孩子 7、12，较大的 12 &gt; 7，交换</td><td><code>24 12 19 7 7 6 7 2 | 26 27</code></td></tr>
<tr><td>i = 5</td><td>2i = 10 &gt; 8，是叶子，停</td><td>不变</td></tr>
</tbody>
</table>
<p>i = 2 时左孩子 7 和它相等，相等不算违规；决定要不要交换的是较大的孩子 12。</p>

<div class="callout key" data-label="考点">
<p>上浮只和<strong>父结点</strong>比，每层 1 次比较。下沉先比较<strong>两个孩子</strong>，再和较大者比，每层最多 2 次比较，并且和<strong>较大的孩子</strong>交换。两者都是<strong>相等就停</strong>，不交换。</p>
</div>

<iframe class="anim-frame" src="blog/blog_data/dsa-heap-operations/anims/heap-ops.html" loading="lazy" style="height: 520px;" title="最大堆的插入与删除最大值"></iframe>
<p class="anim-caption">点动画顶部四个课上例子的按钮逐步播放，看每一步比较的是哪两个结点、交换后数组怎么变；也可以输入自己的键，在当前的堆上继续插入或删除最大值。</p>

<h2>C 代码</h2>
<p>代码题最常考 sift down。下标从 1 开始；<code>swap(H, a, b)</code> 交换 H[a] 和 H[b]；n 用指针传入，因为插入、删除都要改它。</p>

<h3>上浮与插入</h3>
<pre><code>void siftup(int H[], int i) {
    while (i &gt; 1 &amp;&amp; H[i / 2] &lt; H[i]) {
        swap(H, i, i / 2);
        i = i / 2;
    }
}

void heap_insert(int H[], int *n, int key) {
    (*n)++;
    H[*n] = key;
    siftup(H, *n);
}</code></pre>
<ul>
<li><strong>第 2 行</strong>：还没到根（i &gt; 1），并且父结点 H[i/2] 比它小，才继续。父结点相等时条件不成立，所以相等不交换。</li>
<li><strong>第 3–4 行</strong>：和父结点交换，i 跟着这个键走到父结点的位置。</li>
<li><strong>第 9–11 行</strong>：n 加 1，新键放进最后一格，再上浮。数组满了要先按 2.6 的倍增法扩容。</li>
</ul>

<h3>下沉与删除最大值</h3>
<pre><code>void siftdown(int H[], int n, int i) {
    while (2 * i &lt;= n) {
        int c = 2 * i;
        if (c + 1 &lt;= n &amp;&amp; H[c + 1] &gt; H[c]) {
            c = c + 1;
        }
        if (H[i] &gt;= H[c]) {
            break;
        }
        swap(H, i, c);
        i = c;
    }
}

int heap_deletemax(int H[], int *n) {
    int max = H[1];
    swap(H, 1, *n);
    (*n)--;
    siftdown(H, *n, 1);
    return max;
}</code></pre>
<ul>
<li><strong>第 2 行</strong>：2i ≤ n 说明至少有左孩子；否则是叶子，停。</li>
<li><strong>第 3–6 行</strong>：c 先指左孩子；右孩子存在且更大，就改指右孩子。最后一个父结点可能只有左孩子，所以要检查 c + 1 ≤ n。两个孩子相等时取哪个都对。</li>
<li><strong>第 7–9 行</strong>：不小于较大的孩子，就停。</li>
<li><strong>第 10–11 行</strong>：和较大的孩子交换，往下走一层。</li>
<li><strong>第 16–19 行</strong>：记下最大值，根和最后一格交换，<strong>先把 n 减 1，再下沉</strong>。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>先下沉、后减 n 是错的：刚换到 H[n] 的最大值会被当成孩子，又换回堆里。对 <code>10 9 1 8</code> 删除最大值，会得到 <code>9 10 1 | 8</code>，10 还在堆里，丢掉的反而是 8。</p>
</div>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/HqPJF2L5h9U" title="2.6.3 Heap - Heap Sort - Heapify - Priority Queues" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Abdul Bari《2.6.3 Heap - Heap Sort - Heapify - Priority Queues》（英文），约定和本课相同（最大堆、下标从 1 开始）。看约 14:30–26:00 的插入和删除就够，后面的堆排序、建堆见 6.4、6.3。</p>

<h2>代价</h2>
<p>两种操作都只沿一条根到叶的路径走，每层最多交换一次，所以最坏就是树高，Θ(log n)。</p>
<table>
<thead><tr><th>操作</th><th>最好</th><th>最坏</th></tr></thead>
<tbody>
<tr><td>find max</td><td>Θ(1)</td><td>Θ(1)</td></tr>
<tr><td>insert</td><td>Θ(1)，比 1 次就停（插入 6）</td><td>Θ(log n)，换到根（插入 32）</td></tr>
<tr><td>delete max</td><td>Θ(1)，只在有相等键时（如全是 7）</td><td>Θ(log n)，沉到最底层</td></tr>
</tbody>
</table>

<h2>删除任意位置的元素</h2>
<p>删下标 k 处的元素（优先队列 6.5 会用到）也一样：H[k] 与 H[n] 交换，n 减 1，再修复下标 k。但换来的 x 和 k 的祖先之间没有大小保证，所以<strong>两个方向都要查</strong>：x 比父结点 H[⌊k/2⌋] 大就<strong>上浮</strong>，否则<strong>下沉</strong>（也可能不动）。</p>
<p>例：堆 <code>50 10 40 5 8 35 30</code> 删除下标 4 的 5。30 换到下标 4，n = 6；父结点 10 &lt; 30，上浮；50 ≥ 30，停。结果 <code>50 30 40 10 8 35</code>。只做下沉的话，30 会留在 10 下面，不是堆。</p>
<p>已知下标时 O(log n)；只知道键要先线性查找，O(n)。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>手算题</strong>：依次插入、删除最大值，写出每步的数组或树，有时问交换次数。</li>
<li><strong>选择、填空</strong>：复杂度；n 个元素时最多交换、最少比较几次。</li>
<li><strong>代码题</strong>：写 sift down、sift up、insert 或 delete max。可能改成<strong>最小堆（min-heap）</strong>：比较全反过来，选较小的孩子；或<strong>从下标 0 开始</strong>：孩子 2i+1、2i+2，父结点 ⌊(i−1)/2⌋。先写清下标约定。</li>
<li>下标公式和操作步骤都要背，公式表上没有。</li>
</ul>

<h3>例题 1：手算插入和删除</h3>
<p>最大堆 H[1..7] = <code>40 30 35 10 20 25 15</code>。依次插入 38、删除最大值、再删除最大值，写出每步后的数组和交换次数。</p>
<p><strong>插入 38</strong>：放进 H[8]。父 H[4] = 10 &lt; 38，交换；父 H[2] = 30 &lt; 38，交换；父 H[1] = 40 ≥ 38，停。结果 <code>40 38 35 30 20 25 15 10</code>，2 次交换。</p>
<p><strong>删除 40</strong>：H[1] ↔ H[8]，n = 7，得 <code>10 38 35 30 20 25 15 | 40</code>。i = 1：孩子 38、35，和较大的 38 交换；i = 2：孩子 30、20，和 30 交换；i = 4：2i = 8 &gt; 7，是叶子，停。结果 <code>38 30 35 10 20 25 15 | 40</code>，2 次交换。</p>
<p><strong>删除 38</strong>：H[1] ↔ H[7]，n = 6，得 <code>15 30 35 10 20 25 | 38 40</code>。i = 1：孩子 30、35，和 35 交换；i = 3：右孩子下标 7 &gt; 6 不存在，只有左孩子 25 &gt; 15，交换；i = 6 是叶子，停。结果 <code>35 30 25 10 20 15 | 38 40</code>，2 次交换。最后的堆：</p>
<pre><code class="lang-text">        35
      /    \\
    30      25
   /  \\    /
  10  20  15</code></pre>
<p>第三步别把数组里的 38 当成下标 3 的右孩子：它已经不在堆里了。</p>

<h3>例题 2：最多交换几次</h3>
<p>一个有 100 个元素的最大堆。(a) 插入最多交换几次？经过哪些下标？(b) 删除最大值最多交换几次？(c) 两种操作最少各比较几次？</p>
<p>(a) 新元素在 H[101]，只能沿父结点往上：101 → 50 → 25 → 12 → 6 → 3 → 1，最多 <strong>6</strong> 次，即 ⌊log₂ 101⌋。</p>
<p>(b) 删除后 n = 99，最深一层（下标 64..99）的深度是 ⌊log₂ 99⌋ = 6，最多 <strong>6</strong> 次交换；每层 2 次比较，共 12 次。</p>
<p>(c) 插入至少 <strong>1</strong> 次：和父结点比一次就停。删除最大值至少 <strong>2</strong> 次：先比两个孩子，再和较大者比，不小于它就停。</p>

<div class="callout warn" data-label="易错">
<ul>
<li>插入时和兄弟比，或者不先放进 H[n+1]。</li>
<li>下沉时和较小的孩子换，或者只看左孩子。</li>
<li>删除最大值时直接挖掉根，树中间出现空洞。</li>
<li>删除任意位置只做下沉，忘了检查上浮。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>每次修改都分两步：先保形状（只动 H[n+1] 或 H[n]），再交换父子来修大小关系。</li>
<li>插入：放进 H[n+1] 再上浮，只和父结点比，从不和兄弟比。</li>
<li>删除最大值：H[1] 与 H[n] 交换，n 减 1，再下沉，每次和<strong>较大的孩子</strong>交换。相等就停。</li>
<li>find max Θ(1)；insert 和 delete max 最好 Θ(1)、最坏 Θ(log n)。</li>
<li>删除任意位置：同样和末尾交换、缩小，然后上浮或下沉，两个方向都要查。</li>
</ul>
`;

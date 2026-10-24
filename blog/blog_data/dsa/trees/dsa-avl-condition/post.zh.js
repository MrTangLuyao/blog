/* Post body — dsa-avl-condition / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-avl-condition:zh'] = `
<p class="lead">BST 的查找代价取决于树高。<strong>AVL 树</strong>要求<strong>每一个结点</strong>的左右子树高度差不超过 1：这个条件足够宽松，插入后只需沿一条路径检查、最多做一次单旋转或双旋转；又足够严格，树高不超过约 1.44·log₂ n。</p>

<h2>平衡是什么意思</h2>
<p>在 BST 中找一个键，比较次数等于根到它的路径上的结点数，最坏等于树高。同样是 1…7 这 7 个键：按 4, 2, 6, 1, 3, 5, 7 插入，树高 3，任何查找最多比较 3 次；按 1, 2, …, 7 插入，得到一条链，树高 7（见 3.3）。BST 的查找、插入、删除都是 O(树高)，关键在于让树高保持 O(log n)。</p>
<p>本课程的两个定义：</p>
<ul>
<li><strong>平衡（balanced）</strong>：任意一项都能在 <strong>O(log n)</strong> 内找到，也就是树高为 O(log n)。</li>
<li><strong>完美平衡（perfectly balanced）</strong>：平衡，并且是<strong>完全二叉树（complete binary tree）</strong>（见 3.1）。</li>
</ul>
<p>还有一条设计原则：<strong>维持平衡的代价，每次插入不能超过 O(log n)</strong>，否则查找快了、插入却变慢，等于回到有序数组。完美平衡过不了这一关。完全二叉树 1…7 插入 8 后若仍要完全，8 个结点的形状是固定的，各位置上的键又必须按中序（in-order）递增：</p>
<pre><code class="lang-text">before: complete          after inserting 8: still complete
        4                          5
      /   \\                      /   \\
     2     6                    3     7
    / \\   / \\                  / \\   / \\
   1   3 5   7                2   4 6   8
                             /
                            1</code></pre>
<p>原来 7 个位置上的键全部换了，一次插入要改 O(n) 个结点。所以平衡树放宽要求：树高保持 O(log n) 即可，形状允许松动。</p>

<h2>只看根不够</h2>
<p>一个自然的想法：根的左右子树高度差不超过 1 就算平衡。课上的反例是在根的两边各挂一条链：</p>
<figure class="fig">
<svg viewBox="0 0 520 250" width="520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="根两边各挂一条链：根的平衡因子为 0，但 3 和 5 为正负 2">
<g stroke="rgba(255,255,255,0.35)" stroke-width="2">
<line x1="260" y1="40" x2="190" y2="100"/><line x1="260" y1="40" x2="330" y2="100"/>
<line x1="190" y1="100" x2="130" y2="160"/><line x1="330" y1="100" x2="390" y2="160"/>
<line x1="130" y1="160" x2="70" y2="220"/><line x1="390" y1="160" x2="450" y2="220"/>
</g>
<g fill="#343433" stroke="#5a5a59" stroke-width="2">
<circle cx="130" cy="160" r="17"/><circle cx="70" cy="220" r="17"/>
<circle cx="390" cy="160" r="17"/><circle cx="450" cy="220" r="17"/>
</g>
<circle cx="260" cy="40" r="17" fill="#343433" stroke="#4ade80" stroke-width="2.5"/>
<g fill="#343433" stroke="#f87171" stroke-width="2.5"><circle cx="190" cy="100" r="17"/><circle cx="330" cy="100" r="17"/></g>
<g fill="#e8e8e8" font-size="15" font-weight="700" text-anchor="middle">
<text x="260" y="45">4</text><text x="190" y="105">3</text><text x="330" y="105">5</text>
<text x="130" y="165">2</text><text x="390" y="165">6</text><text x="70" y="225">1</text><text x="450" y="225">7</text>
</g>
<g font-size="13" font-weight="700">
<text x="282" y="36" fill="#4ade80">0</text>
<text x="212" y="105" fill="#f87171">+2</text><text x="308" y="105" fill="#f87171" text-anchor="end">−2</text>
<text x="152" y="165" fill="#a1a1a0">+1</text><text x="368" y="165" fill="#a1a1a0" text-anchor="end">−1</text>
<text x="92" y="225" fill="#a1a1a0">0</text><text x="428" y="225" fill="#a1a1a0" text-anchor="end">0</text>
</g>
<g fill="#a1a1a0" font-size="12" text-anchor="middle"><text x="130" y="60">左子树高 3</text><text x="390" y="60">右子树高 3</text></g>
</svg>
<figcaption>结点旁的数字是平衡因子：左子树高度减右子树高度。根的左右子树一样高，差为 0；3 和 5 却是 +2 和 −2。</figcaption>
</figure>
<p>根满足条件，可是找 1 要比较 4 次。n 个结点分成两条链时，树高约 n/2，查找仍是 <strong>O(n)</strong>。问题藏在根下面：3 的左子树高 2、右子树为空，5 正好相反。所以条件必须落到<strong>每一个结点</strong>上。</p>

<h2>AVL 条件与平衡因子</h2>
<p><strong>AVL 树（AVL tree）</strong>以发明者 Adelson-Velsky 和 Landis 命名，是满足下面条件的 BST：</p>
<div class="callout key" data-label="考点">
<p><strong>AVL 条件：对每一个结点 x，|height(x 的左子树) − height(x 的右子树)| ≤ 1。</strong></p>
<p><strong>平衡因子（balance factor, BF）</strong>= height(左子树) − height(右子树)。AVL 树中每个 BF 只能是 −1、0、+1；<strong>出现 +2 或 −2 就是失衡</strong>，+2 左边重，−2 右边重。</p>
</div>
<p>本课程约定 height(NULL) = 0、叶子高度为 1，所以叶子的 BF 总是 0。一个结点的高度要等两个孩子都算完才能算，因此按<strong>后序（post-order）</strong>自下而上计算。以依次插入 50, 30, 70, 20, 40, 80, 35 得到的树 A 为例：</p>
<figure class="fig">
<svg viewBox="0 0 560 280" width="560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="树 A：每个结点左边标高度，右边标平衡因子">
<g stroke="rgba(255,255,255,0.35)" stroke-width="2">
<line x1="290" y1="40" x2="170" y2="110"/><line x1="290" y1="40" x2="410" y2="110"/>
<line x1="170" y1="110" x2="100" y2="180"/><line x1="170" y1="110" x2="240" y2="180"/>
<line x1="410" y1="110" x2="480" y2="180"/><line x1="240" y1="180" x2="190" y2="250"/>
</g>
<g fill="#343433" stroke="#5a5a59" stroke-width="2">
<circle cx="290" cy="40" r="17"/><circle cx="170" cy="110" r="17"/><circle cx="410" cy="110" r="17"/>
<circle cx="100" cy="180" r="17"/><circle cx="240" cy="180" r="17"/><circle cx="480" cy="180" r="17"/>
<circle cx="190" cy="250" r="17"/>
</g>
<g fill="#e8e8e8" font-size="14" font-weight="700" text-anchor="middle">
<text x="290" y="45">50</text><text x="170" y="115">30</text><text x="410" y="115">70</text>
<text x="100" y="185">20</text><text x="240" y="185">40</text><text x="480" y="185">80</text><text x="190" y="255">35</text>
</g>
<g fill="#a1a1a0" font-size="12" text-anchor="end">
<text x="264" y="45">h=4</text><text x="148" y="115">h=3</text><text x="388" y="115">h=2</text>
<text x="78" y="185">h=1</text><text x="218" y="185">h=2</text><text x="458" y="185">h=1</text><text x="168" y="255">h=1</text>
</g>
<g fill="#4ade80" font-size="13" font-weight="700">
<text x="316" y="45">+1</text><text x="192" y="115">−1</text><text x="432" y="115">−1</text>
<text x="122" y="185">0</text><text x="262" y="185">+1</text><text x="502" y="185">0</text><text x="212" y="255">0</text>
</g>
</svg>
<figcaption>树 A。结点左边是高度 h，右边是平衡因子 BF，七个 BF 都在 −1…+1 之内。</figcaption>
</figure>
<p>叶子 20、35、80 的高度为 1。40：左高 1、右高 0，高度 2，BF +1。30：左高 1、右高 2，高度 3，BF −1。70：BF = 0 − 1 = −1。根 50：左高 3、右高 2，BF +1。全部合格，<strong>树 A 是 AVL 树</strong>。</p>
<p>树 A 不是完全二叉树（70 缺左孩子），可见 <strong>AVL 不要求完全</strong>。反过来，完全二叉树中每个结点的左子树要么和右子树一样高、要么高 1，所以<strong>作为 BST 的完全二叉树一定是 AVL 树</strong>。另外，AVL 树首先得是 BST，中序遍历要严格递增（见 3.2）。</p>

<h2>用 C 检查 AVL 条件</h2>
<p>把“算高度”和“查 BF”放进同一次后序遍历：函数返回子树高度，一旦发现 |BF| ≥ 2 就返回 −1，这个 −1 一路传到根。</p>
<pre><code>#include &lt;stddef.h&gt;

typedef struct node node_t;
struct node {
    int key;
    node_t *left, *right;
};

/* 返回 t 的高度（空树 0，叶子 1）；
   只要 t 里有一个结点违反 AVL 条件，就返回 -1 */
int avl_height(node_t *t) {
    if (t == NULL) return 0;
    int hl = avl_height(t-&gt;left);       /* 后序：先算两个孩子 */
    if (hl &lt; 0) return -1;              /* 左子树里已有失衡结点 */
    int hr = avl_height(t-&gt;right);
    if (hr &lt; 0) return -1;
    int bf = hl - hr;                   /* 平衡因子 */
    if (bf &gt; 1 || bf &lt; -1) return -1;   /* 本结点 |BF| &gt;= 2 */
    return 1 + (hl &gt; hr ? hl : hr);
}

int satisfies_avl(node_t *t) {
    return avl_height(t) &gt;= 0;
}</code></pre>
<p>每个结点只访问一次，<strong>O(n)</strong>。若在每个结点上各调用一次求高度的函数，同一棵子树会被反复计算，总代价是所有子树大小之和，即 O(n·h)。真正的 AVL 实现更省：<strong>每个结点存着自己的高度</strong>，BF 随时 O(1) 可得。</p>

<h2>插入之后：哪个结点先失衡</h2>
<p>AVL 结点比 BST 结点多一个 height 字段。插入一个键分三步：</p>
<ol>
<li>像 BST 一样往下找到空位，挂上新叶子（高度 1）；</li>
<li>沿插入路径<strong>往回走向根</strong>，逐个更新 height = 1 + max(左高, 右高)，并算 BF；</li>
<li>在遇到的<strong>第一个 |BF| = 2 的结点</strong>处做旋转（rotation，LL、RR、LR、RL 四种情况见 3.6）。</li>
</ol>
<p>往回走时有三个事实：只有<strong>路径上</strong>的结点子树变了，别处的高度和 BF 都不变；一次插入让子树高度最多加 1，所以 BF 最多变到 ±2，不会出现 ±3；某个结点的高度<strong>没变</strong>，它上面的结点就都不会变，可以停。</p>
<p>例：往树 A 插入 37。37 &lt; 50 往左，37 &gt; 30 往右，37 &lt; 40 往左，37 &gt; 35 往右，挂为 35 的右孩子。往回：35 高度 2，BF −1；40 左高 2、右高 0，BF <strong>+2</strong>，这是第一个失衡结点。若不管它继续往上，30 的 BF 是 1 − 3 = −2，根 50 是 4 − 2 = +2，也都失衡；但要修的只有最低的 40。在 40 旋转后，这棵子树高度回到插入前的 2，30 和 50 自动恢复成 −1 和 +1。</p>
<div class="callout key" data-label="考点">
<p><strong>第一个失衡结点 = 从新结点往根走遇到的第一个 |BF| = 2 的结点</strong>，也就是最低的那个。此时根可能也是 ±2（插入 37），也可能是 0（插入 90 时只有 70 失衡）。</p>
</div>
<iframe class="anim-frame" src="blog/blog_data/dsa-avl-condition/anims/avl-check.html" loading="lazy" style="height: 520px;" title="检查 AVL 条件与插入后的第一个失衡结点"></iframe>
<p class="anim-caption">“两条链”“树 A”按后序逐个结点算高度和 BF；三个“插入”场景先往下找空位，再沿路径往回更新，红色是第一个失衡结点，黄色是更上面的 ±2。“BF / 高度”切换结点上方的数字。</p>

<h2>为什么树高是 O(log n)</h2>
<p>反过来问：高度为 h 的 AVL 树<strong>最少</strong>有几个结点？记为 N(h)。最稀疏的做法是让每个结点都偏到极限：根的一棵子树高 h − 1，另一棵只高 h − 2，两棵也都取最稀疏的。于是 N(1) = 1，N(2) = 2，<strong>N(h) = N(h − 1) + N(h − 2) + 1</strong>。</p>
<table>
<thead><tr><th>树高 h</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>10</th></tr></thead>
<tbody>
<tr><td>AVL 树最少结点 N(h)</td><td>1</td><td>2</td><td>4</td><td>7</td><td>12</td><td>20</td><td>143</td></tr>
<tr><td>二叉树最多结点 2<sup>h</sup> − 1</td><td>1</td><td>3</td><td>7</td><td>15</td><td>31</td><td>63</td><td>1023</td></tr>
</tbody>
</table>
<p>因为 N(h − 1) &gt; N(h − 2)，所以 N(h) &gt; 2·N(h − 2)：<strong>每多两层，最少结点数至少翻倍</strong>。由此 n ≥ N(h) ≥ 2<sup>(h−1)/2</sup>，即 h ≤ 2·log₂ n + 1，树高是 O(log n)。更细地看，N(h) 的增长方式和斐波那契数列（见 1.2）相同，相邻两项之比趋于 1.618，于是 h ≈ log₂ n / log₂ 1.618 ≈ <strong>1.44·log₂ n</strong>。AVL 原始论文证明的上界正是约 1.44·log₂ n（精确形式是 1.44·log₂(n + 2) − 0.33）。任何 n 个结点的二叉树高度至少是 log₂(n + 1)，所以 AVL 树最多比最矮的情形高约 44%。</p>

<h2>AVL 树的取舍</h2>
<table>
<thead><tr><th>最坏情况</th><th>普通 BST</th><th>AVL 树</th></tr></thead>
<tbody>
<tr><td>查找</td><td>O(n)</td><td>O(log n)</td></tr>
<tr><td>插入</td><td>O(n)</td><td>O(log n)：下降、回溯更新、至多一次单旋转或双旋转</td></tr>
<tr><td>删除</td><td>O(n)</td><td>O(log n)：可能沿路径多次旋转（见 3.4）</td></tr>
<tr><td>n 次插入建字典 + m 次查找</td><td>O(n² + nm)</td><td>O(n log n + m log n)</td></tr>
</tbody>
</table>
<p>好处是性能与输入顺序无关，升序插入也不会退化成链。代价是：每个结点多存一个高度（空间开销）；每次插入、删除都要沿路径更新高度、算 BF；旋转本身 O(1)，但代码容易写错。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>选择题</strong>：根的左子树高 4、右子树高 3，哪项必然正确？第 5 周课堂小测出过，第 12 周复习又出了一次。只能断定根满足 AVL 条件，见练习 2。</li>
<li><strong>判断是否 AVL 树</strong>：给一棵树，标出每个结点的高度和 BF，找出违反条件的结点。</li>
<li><strong>插入后定位</strong>：插入某键，问第一个失衡的是哪个结点，再判断 LL、RR、LR、RL 并旋转（见 3.6）。</li>
<li><strong>复杂度与定义</strong>：任意 BST 查找最坏 O(n)，AVL 树 O(log n)；平衡与完美平衡的课程定义；AVL 树高约 1.44·log₂ n。</li>
<li><strong>代码题</strong>：写函数求树高或检查 AVL 条件，空树返回 0。</li>
<li><strong>必须背</strong>：AVL 条件针对每个结点；BF = 左高 − 右高，±2 失衡；height(NULL) = 0、叶子 1；1.44·log₂ n。公式表上只有对数换底等恒等式，以上都没有。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li>只检查根：两条链那棵树的根 BF 为 0，照样不是 AVL 树。</li>
<li>把 AVL 和完全二叉树混为一谈：AVL 树不必完全；完全的 BST 一定满足 AVL 条件。</li>
<li>高度约定：本课程叶子高度为 1，“左子树高 4、右子树高 3”的树高是 5。有的教材叶子记 0，BF 不受影响，但树高和 N(h) 表都要错开一位。</li>
<li>插入后直接修根：要修的是最低的失衡结点。</li>
<li>忘了 AVL 树首先是 BST：键不按大小排列的树，BF 再好也不是 AVL 树。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. 下面这棵 BST 是不是 AVL 树？标出每个结点的高度和 BF。</summary>
<div class="qa__body">
<pre><code class="lang-text">              40
           /      \\
         20        60
        /  \\      /  \\
      10    30   50   70
     /     /            \\
    5     25             80
   /
  2</code></pre>
<p>按后序自下而上：2 高 1，BF 0；5 高 2，BF +1；<strong>10 高 3，BF = 2 − 0 = +2</strong>；25 高 1，BF 0；30 高 2，BF +1；20 高 4，BF = 3 − 2 = +1；50、80 高 1，BF 0；70 高 2，BF −1；60 高 3，BF = 1 − 2 = −1；40 高 5，BF = 4 − 3 = +1。</p>
<p>结点 10 违反 AVL 条件，所以<strong>不是 AVL 树</strong>。根和它的两个孩子都合格，问题在第三层。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 一棵 BST 的根，左子树高 4、右子树高 3（本课程约定）。哪项必然正确？A. 它是 AVL 树　B. 根满足 AVL 条件，但其他结点不一定满足　C. 它不是 AVL 树　D. 树高为 4</summary>
<div class="qa__body">
<p>选 <strong>B</strong>。根的 BF = 4 − 3 = +1，合格，但这只说明根。</p>
<p>A 不必然：练习 1 的树正是左高 4、右高 3，而 10 是 +2。C 也不必然：在练习 1 的树里给 10 加一个右孩子 15，10 变成 +1、20 仍是 +1，所有 BF 都合格，左右子树高度仍是 4 和 3，这就是一棵 AVL 树。D 错：树高 = 1 + max(4, 3) = 5。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 下面是一棵 AVL 树。分别插入 5 和 65（每次都从原树开始），第一个失衡的结点是哪个？此时根的 BF 是多少？</summary>
<div class="qa__body">
<pre><code class="lang-text">          50
        /    \\
      30      60
     /  \\       \\
   20    40      70
  /
 10</code></pre>
<p>原树的 BF：10、40、70 为 0；20 为 +1；30 为 2 − 1 = +1；60 为 0 − 1 = −1；50 为 3 − 2 = +1。它正是高度 4 的最稀疏 AVL 树（7 = N(4) 个结点）。</p>
<p><strong>插入 5</strong>：5 &lt; 50、5 &lt; 30、5 &lt; 20、5 &lt; 10，挂为 10 的左孩子。往回：10 高 2，BF +1；<strong>20 高 3，BF = 2 − 0 = +2，第一个失衡</strong>（LL）。不旋转的话 30 是 3 − 1 = +2，根 50 是 4 − 2 = <strong>+2</strong>，根也失衡，但要修的是 20。</p>
<p><strong>插入 65</strong>：65 &gt; 50、65 &gt; 60、65 &lt; 70，挂为 70 的左孩子。往回：70 高 2，BF +1；<strong>60 的 BF = 0 − 2 = −2，第一个失衡</strong>（RL）；根 50 左高 3、右高 3，BF = <strong>0</strong>。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. (a) 按本课程约定，高度为 5 的 AVL 树最少有几个结点？(b) 7 个结点的 AVL 树最高能有多高？和普通 BST、完全二叉树比较。</summary>
<div class="qa__body">
<p>(a) N(1) = 1，N(2) = 2，N(3) = 2 + 1 + 1 = 4，N(4) = 4 + 2 + 1 = 7，N(5) = 7 + 4 + 1 = <strong>12</strong>。</p>
<p>(b) N(4) = 7 ≤ 7 &lt; N(5) = 12，所以最高为 <strong>4</strong>，练习 3 的原树就是一例。普通 BST 可以是高 7 的链；完全二叉树高 3。用公式估算 1.44·log₂ 7 ≈ 4.04，与 4 吻合。</p>
</div>
</details>
`;

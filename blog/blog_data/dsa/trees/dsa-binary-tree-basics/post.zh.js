/* Post body — dsa-binary-tree-basics / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-binary-tree-basics:zh'] = `
<p class="lead">二叉树（binary tree）是每个结点最多有两个孩子的树。重点是术语、本课的深度和高度约定（根深度 0，叶子高度 1），以及完全二叉树：高度约 log₂ n，能不留空位地存进数组。</p>

<h2>从一个场景说起：链表也想二分</h2>
<p>有序数组能二分查找，靠的是<strong>按下标 O(1) 跳到中间</strong>。有序链表（linked list）像一列火车，想去中间那节车厢，只能从车头一节节走过去，所以查找还是 O(n)。</p>
<p>办法是在入口存一个指向中间结点的指针，左半、右半也各存一个指向自己中间的指针，一层层下去。拿 9, 14, 28, 32, 42, 53, 64 试试：入口指向 32，左半 9, 14, 28 的中间 14 挂在它左边，右半 42, 53, 64 的中间 53 挂在右边，再往下是 9、28 和 42、64：</p>
<pre><code class="lang-text">        32
      /    \\
    14      53
   /  \\    /  \\
  9   28  42   64</code></pre>
<p>画出来是一棵倒着长的树，这就是二叉树。</p>

<h2>二叉树是什么</h2>
<p>简单说，<strong>二叉树就是每个结点最多有两个孩子的树</strong>。拆开看：</p>
<ul>
<li><strong>结点（node）</strong>：一个键（key）加 <code>left</code>、<code>right</code> 两个指针，指向左、右孩子，没有就是 <code>NULL</code>。</li>
<li><strong>根（root）</strong>：最上面的入口结点。拿着根指针，就拿着整棵树。</li>
<li><strong>空树</strong>：根指针是 <code>NULL</code>。每个孩子又是一棵小树的根，所以树的算法大多写成递归。</li>
</ul>
<pre><code>typedef struct node node_t;
struct node {
    int key;
    node_t *left;
    node_t *right;
    node_t *parent;   /* 可选 */
};</code></pre>
<p><code>key</code> 是数据，也可以换成 <code>void *data</code>；<code>left</code>、<code>right</code> 指向两个孩子；<code>parent</code> 指回父结点，可有可无，课上提到维护 AVL 树时有它方便往上走。和链表结点比，就是把一个 <code>next</code> 换成了两个指针。</p>

<h3>术语：从家谱借来的</h3>
<p>课上在 42 下面又挂了一个 50，得到图 1。树的术语大多借自家谱：</p>
<figure class="fig">
<svg viewBox="0 0 640 280" width="640" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="课上的树 32(14(9,28),53(42(-,50),64))，每个结点标出深度 d 和高度 h">
<g fill="#a1a1a0" font-size="12">
<text x="10" y="54">第 0 层</text><text x="10" y="119">第 1 层</text><text x="10" y="184">第 2 层</text><text x="10" y="249">第 3 层</text>
</g>
<g font-size="12" font-weight="600" text-anchor="end">
<text x="630" y="20" fill="#38bdf8">d = 深度（数边，根 = 0）</text>
<text x="630" y="38" fill="#fbbf24">h = 高度（数结点，叶子 = 1）</text>
</g>
<g stroke="rgba(255,255,255,0.35)" stroke-width="2"><line x1="340" y1="50" x2="215" y2="115"/><line x1="340" y1="50" x2="465" y2="115"/><line x1="215" y1="115" x2="155" y2="180"/><line x1="215" y1="115" x2="275" y2="180"/><line x1="465" y1="115" x2="415" y2="180"/><line x1="465" y1="115" x2="530" y2="180"/><line x1="415" y1="180" x2="465" y2="245"/></g>
<g fill="#343433" stroke="#5a5a59" stroke-width="2"><circle cx="340" cy="50" r="17"/><circle cx="215" cy="115" r="17"/><circle cx="155" cy="180" r="17"/><circle cx="275" cy="180" r="17"/><circle cx="465" cy="115" r="17"/><circle cx="415" cy="180" r="17"/><circle cx="465" cy="245" r="17"/><circle cx="530" cy="180" r="17"/></g>
<g fill="#e8e8e8" font-size="14" font-weight="700" text-anchor="middle"><text x="340" y="55">32</text><text x="215" y="120">14</text><text x="155" y="185">9</text><text x="275" y="185">28</text><text x="465" y="120">53</text><text x="415" y="185">42</text><text x="465" y="250">50</text><text x="530" y="185">64</text></g>
<g font-size="12" font-weight="600">
<text x="364" y="38" fill="#38bdf8">d=0</text><text x="364" y="53" fill="#fbbf24">h=4</text>
<text x="191" y="112" fill="#38bdf8" text-anchor="end">d=1</text><text x="191" y="127" fill="#fbbf24" text-anchor="end">h=2</text>
<text x="131" y="177" fill="#38bdf8" text-anchor="end">d=2</text><text x="131" y="192" fill="#fbbf24" text-anchor="end">h=1</text>
<text x="299" y="177" fill="#38bdf8">d=2</text><text x="299" y="192" fill="#fbbf24">h=1</text>
<text x="489" y="112" fill="#38bdf8">d=1</text><text x="489" y="127" fill="#fbbf24">h=3</text>
<text x="391" y="177" fill="#38bdf8" text-anchor="end">d=2</text><text x="391" y="192" fill="#fbbf24" text-anchor="end">h=2</text>
<text x="489" y="242" fill="#38bdf8">d=3</text><text x="489" y="257" fill="#fbbf24">h=1</text>
<text x="554" y="177" fill="#38bdf8">d=2</text><text x="554" y="192" fill="#fbbf24">h=1</text>
</g>
</svg>
<figcaption>图 1　课上用的树。蓝色是深度，黄色是高度，下一节一步步算出来。</figcaption>
</figure>

<table>
<thead><tr><th>术语</th><th>意思</th><th>图 1 中的例子</th></tr></thead>
<tbody>
<tr><td>父结点（parent）／孩子（child）</td><td>指向它的结点／它指向的结点</td><td>32 是 14、53 的父结点</td></tr>
<tr><td>叶子（leaf）</td><td>没有孩子</td><td>9、28、50、64</td></tr>
<tr><td>内部结点（internal node）</td><td>至少有一个孩子</td><td>32、14、53、42</td></tr>
<tr><td>祖先（ancestor）</td><td>从父结点往上一直到根</td><td>50 的祖先：42、53、32</td></tr>
<tr><td>子树（subtree）</td><td>某个结点连同它下面的全部结点</td><td>53 的左子树：42、50</td></tr>
<tr><td>度（degree）</td><td>孩子的个数：0、1 或 2</td><td>42 的度是 1</td></tr>
</tbody>
</table>

<h2>看个例子：深度和高度</h2>
<p>这两个期末最常考，也最容易差 1。在图 1 上一步步算。</p>

<h3>深度：从上往下数边</h3>
<p><strong>深度（depth）</strong>：从根走到该结点经过几条边。<strong>根的深度是 0</strong>，往下一层加 1：14、53 是 1；9、28、42、64 是 2；50 是 3。深度相同的结点在同一层（level）。</p>

<h3>高度：从下往上数结点</h3>
<p><strong>高度（height）</strong>：从该结点往下，最长的一条路上有几个结点。本课的递归定义是：</p>
<pre><code class="lang-text">height(NULL) = 0
height(t)    = 1 + max(height(左子树), height(右子树))</code></pre>
<p>即空树为 0，否则取较高的一边，再加上自己这一层。从叶子往上算：</p>
<ol>
<li>叶子 9、28、50、64：两边都是 NULL，1 + max(0, 0) = 1。<strong>叶子的高度是 1</strong>。</li>
<li>42：左边 NULL 记 0，右边 50 记 1，1 + max(0, 1) = 2。</li>
<li>14：两个孩子都是叶子，1 + max(1, 1) = 2。</li>
<li>53：左边 42 是 2，右边 64 是 1，1 + max(2, 1) = 3。</li>
<li>根 32：左边 14 是 2，右边 53 是 3，1 + max(2, 3) = 4。</li>
</ol>
<p><strong>树高就是根的高度</strong>：4。最深的 50 深度是 3，树一共 4 层，所以<strong>树高 = 层数 = 最大深度 + 1</strong>。</p>
<div class="callout warn" data-label="易错">
<p>很多教材和视频的高度数边：叶子 0、空树 −1。<strong>本课数结点：空树 0，叶子 1</strong>，答题按本课。深度都一样：数边，根为 0。</p>
</div>
<pre><code>int height(node_t *t) {
    if (t == NULL) return 0;
    int hl = height(t-&gt;left);
    int hr = height(t-&gt;right);
    return 1 + (hl &gt; hr ? hl : hr);
}</code></pre>
<p>这就是上面的定义翻成 C：第 2 行是 height(NULL) = 0，也是递归的出口；第 3、4 行算出左、右子树的高度；第 5 行取大的那个再加 1。先算孩子再算自己，是后序（post-order）顺序（见 3.2 树的三种遍历）；每个结点只算一次，<strong>O(n)</strong>。</p>

<h2>完全二叉树</h2>
<h3>每层最多几个结点</h3>
<p>第 0 层只有根。每个结点最多两个孩子，每往下一层最多翻一倍，所以<strong>第 k 层最多 2<sup>k</sup> 个结点</strong>。</p>
<p>每层都填满的叫<strong>满二叉树（perfect binary tree）</strong>，h 层一共 1 + 2 + … + 2<sup>h−1</sup> = <strong>2<sup>h</sup> − 1</strong> 个结点（公式表上的等比数列求和）。图 1 去掉 50 就是一棵：7 = 2³ − 1。反过来，n 个结点的树<strong>最矮约 log₂ n 层，最高 n 层</strong>（排成一条链）。</p>

<h3>什么是完全二叉树</h3>
<p>想象电影院入座：前一排坐满了才坐下一排，每排都从最左边依次往右坐，不跳座位。</p>
<p><strong>完全二叉树（complete binary tree）</strong>就是这样排出来的：<strong>除了最后一层，每层都填满；最后一层从左往右连续排，空缺只能在右端</strong>。</p>
<p>判断方法：按层、每层从左到右给位置编号（根是 0，第 1 层是 1、2，第 2 层是 3…6）。结点正好占满 <strong>0 … n−1、没有空号</strong>，就是完全二叉树。</p>
<figure class="fig">
<svg viewBox="0 0 640 215" width="640" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="三棵树：编号 0 到 5 连续的完全二叉树；最后一层缺 5 号的不完全树；第 1 层缺 2 号的不完全树">
<g stroke="rgba(255,255,255,0.35)" stroke-width="2"><line x1="106" y1="28" x2="56" y2="83"/><line x1="106" y1="28" x2="156" y2="83"/><line x1="56" y1="83" x2="31" y2="138"/><line x1="56" y1="83" x2="81" y2="138"/><line x1="156" y1="83" x2="131" y2="138"/><line x1="319" y1="28" x2="269" y2="83"/><line x1="319" y1="28" x2="369" y2="83"/><line x1="269" y1="83" x2="244" y2="138"/><line x1="269" y1="83" x2="294" y2="138"/><line x1="369" y1="83" x2="394" y2="138"/><line x1="532" y1="28" x2="482" y2="83"/><line x1="482" y1="83" x2="457" y2="138"/><line x1="482" y1="83" x2="507" y2="138"/></g>
<g fill="#343433" stroke="#5a5a59" stroke-width="2"><circle cx="106" cy="28" r="14"/><circle cx="56" cy="83" r="14"/><circle cx="156" cy="83" r="14"/><circle cx="31" cy="138" r="14"/><circle cx="81" cy="138" r="14"/><circle cx="131" cy="138" r="14"/><circle cx="319" cy="28" r="14"/><circle cx="269" cy="83" r="14"/><circle cx="369" cy="83" r="14"/><circle cx="244" cy="138" r="14"/><circle cx="294" cy="138" r="14"/><circle cx="394" cy="138" r="14"/><circle cx="532" cy="28" r="14"/><circle cx="482" cy="83" r="14"/><circle cx="457" cy="138" r="14"/><circle cx="507" cy="138" r="14"/></g>
<g fill="none" stroke-width="2" stroke-dasharray="4 3"><circle cx="181" cy="138" r="14" stroke="#5a5a59"/><circle cx="344" cy="138" r="14" stroke="#f87171"/><circle cx="582" cy="83" r="14" stroke="#f87171"/></g>
<g fill="#e8e8e8" font-size="13" font-weight="700" text-anchor="middle"><text x="106" y="33">0</text><text x="56" y="88">1</text><text x="156" y="88">2</text><text x="31" y="143">3</text><text x="81" y="143">4</text><text x="131" y="143">5</text><text x="319" y="33">0</text><text x="269" y="88">1</text><text x="369" y="88">2</text><text x="244" y="143">3</text><text x="294" y="143">4</text><text x="394" y="143">6</text><text x="532" y="33">0</text><text x="482" y="88">1</text><text x="457" y="143">3</text><text x="507" y="143">4</text></g>
<g text-anchor="middle"><text x="106" y="182" font-size="14" font-weight="700" fill="#4ade80">✓ 完全</text><text x="106" y="202" font-size="12" fill="#a1a1a0">编号 0…5 连续，缺的 6 在右端</text><text x="319" y="182" font-size="14" font-weight="700" fill="#f87171">✗ 不完全</text><text x="319" y="202" font-size="12" fill="#a1a1a0">最后一层中间缺 5</text><text x="532" y="182" font-size="14" font-weight="700" fill="#f87171">✗ 不完全</text><text x="532" y="202" font-size="12" fill="#a1a1a0">第 1 层没满，缺 2</text></g>
</svg>
<figcaption>图 2　结点里的数字是按层编号（从 0 起）。虚线圈是没有结点的位置，红色的落在编号中间，是空洞。</figcaption>
</figure>
<p>满二叉树是完全二叉树的特例。“完全”也不要求每个结点都有两个孩子：左图的 2 号只有左孩子，照样是完全二叉树。</p>

<h3>为什么高度只有约 log₂ n</h3>
<p>h 层的完全二叉树，前 h−1 层全满（2<sup>h−1</sup> − 1 个），最后一层有 1 到 2<sup>h−1</sup> 个，所以：</p>
<pre><code class="lang-text">2^(h−1) ≤ n ≤ 2^h − 1   ⟹   h = ⌊log₂ n⌋ + 1</code></pre>
<p>例如 n = 6 时 h = 3，n = 1000 时 h = 10，n = 10⁶ 时也才 20。<strong>这只对完全（或平衡）的树成立</strong>；普通二叉树可能是一条链，高度 n（见 3.3、3.5）。</p>

<h2>用数组存二叉树</h2>
<p>把刚才的编号直接当下标：根放在 0，<strong>下标 i 的左孩子在 2i+1，右孩子在 2i+2，父结点在 ⌊(i−1)/2⌋</strong>。父子之间靠算下标走，不用指针。把图 1 存进去：</p>
<ol>
<li>根 32 放 0；它的孩子 14、53 放 2·0+1 = 1 和 2·0+2 = 2。</li>
<li>14 的孩子 9、28 放 2·1+1 = 3 和 2·1+2 = 4。</li>
<li>53 的孩子 42、64 放 2·2+1 = 5 和 2·2+2 = 6。</li>
<li>50 是 42（下标 5）的右孩子，放 2·5+2 = 12。</li>
</ol>
<p>8 个结点要 13 格，下标 7…11 空着。编号有空号，所以图 1 <strong>不是</strong>完全二叉树。</p>
<p>课上的投票题：<strong>任意二叉树都能存进数组吗？能</strong>，缺的位置留空就行。但只有完全二叉树不留空洞。最坏是往右斜的链，下标依次是 0, 2, 6, 14…，<strong>n 个结点要 2<sup>n</sup> − 1 格</strong>。</p>
<iframe class="anim-frame" src="blog/blog_data/dsa-binary-tree-basics/anims/tree-array.html" loading="lazy" style="height: 540px;" title="二叉树按层存进数组"></iframe>
<p class="anim-caption">在上方切换三棵树，按“下一步”逐个放结点，看下标怎样由父结点算出、哪些格子空着。</p>
<p>后面的堆（heap）也是存在数组里的完全二叉树，但课上的堆<strong>从下标 1 开始</strong>：孩子在 2i、2i+1，父结点在 ⌊i/2⌋（见 6.1）。做题先看清从 0 还是从 1 开始。</p>
<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/H5JubkIy_p8" title="Data structures: Binary Tree" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：mycodeschool《Data structures: Binary Tree》（英文），讲满二叉树、完全二叉树、结点数和高度的关系，以及数组存储。它的高度数边（叶子为 0），公式都比本课差 1。</p>

<h2>补充：普通二叉树里找键要 O(n)</h2>
<p><strong>二叉树不等于二叉搜索树</strong>。普通二叉树里键放在哪都行：找 50 时看到根是 32，也不知道该往哪边走，只能把结点逐个看一遍（遍历，traversal，见 3.2），<strong>最坏 O(n)</strong>。规定了“左小右大”，才是 3.3 的二叉搜索树（BST）。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>填空</strong>：给一棵树，写某个结点的深度、高度，或树高。</li>
<li><strong>选择</strong>：挑出完全二叉树；“二叉树查找是 O(log n)”（错），“任何二叉树都能存进数组”（对）。</li>
<li><strong>手算</strong>：用下标求孩子、父结点；给结点数求完全二叉树的高度、最后一层有几个。</li>
<li><strong>写代码</strong>：递归求高度、结点数、叶子数，都是“NULL 返回 0，否则合并左右子树的结果”。</li>
</ul>
<p>公式表只有等比数列求和，上面这些结论要自己记。</p>

<h3>例题 1：加一个结点，谁的高度变了</h3>
<p>在图 1 里给 28 加一个左孩子 17。17 的深度是多少？哪些结点的高度变了？树高呢？</p>
<p><strong>深度</strong>：28 的深度是 2，17 = 2 + 1 = <strong>3</strong>。</p>
<p><strong>高度</strong>：新结点只影响它的祖先 28、14、32，从下往上重算：</p>
<ul>
<li>28：左边多了 17（高度 1），1 + max(1, 0) = <strong>2</strong>，原来是 1，变了。</li>
<li>14：左边 9 是 1，右边 28 是 2，1 + max(1, 2) = <strong>3</strong>，原来是 2，变了。</li>
<li>32：左边 14 是 3，右边 53 是 3，1 + max(3, 3) = <strong>4</strong>，没变。</li>
</ul>
<p>只有 28 和 14 变了；左边只是追平了右边，树高还是 <strong>4</strong>。</p>

<h3>例题 2：100 个结点的完全二叉树</h3>
<p>一棵完全二叉树有 100 个结点，存进下标从 0 开始的数组。(a) 高度？(b) 最后一层几个结点？(c) 下标 99 的父结点在哪？哪些下标是叶子？</p>
<p>(a) 2⁶ = 64 ≤ 100 &lt; 128 = 2⁷，⌊log₂ 100⌋ = 6，高度 = 6 + 1 = <strong>7</strong>。</p>
<p>(b) 前 6 层全满，共 2⁶ − 1 = 63 个；最后一层 100 − 63 = <strong>37</strong> 个。</p>
<p>(c) 父结点在 ⌊(99 − 1)/2⌋ = <strong>49</strong>。下标 49 的左孩子 2·49+1 = 99 还在数组里，下标 50 的左孩子 101 已经越界，所以 <strong>50…99 全是叶子</strong>，0…49 是内部结点。</p>

<div class="callout warn" data-label="易错">
<ul>
<li>叶子高度写成 0、根的深度写成 1；忘了树高 = 最大深度 + 1。</li>
<li>以为“完全”是每个结点都有两个孩子；最后一层中间有空也当成完全。</li>
<li>没看清下标从 0 还是从 1 开始，套错孩子公式。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>二叉树的结点 = 键 + <code>left</code> + <code>right</code>（可选 <code>parent</code>），空树是 <code>NULL</code>。</li>
<li>本课约定：深度数边，根为 0；高度数结点，空树 0、叶子 1；树高 = 最大深度 + 1。</li>
<li>第 k 层最多 2<sup>k</sup> 个结点，h 层的满二叉树有 2<sup>h</sup> − 1 个。</li>
<li>完全二叉树按层编号没有空号，高度 ⌊log₂ n⌋ + 1；普通二叉树可能是链，高度 n。</li>
<li>数组从 0 开始：孩子 2i+1、2i+2，父结点 ⌊(i−1)/2⌋；课上的堆从 1 开始。普通二叉树找键 O(n)。</li>
</ul>
`;

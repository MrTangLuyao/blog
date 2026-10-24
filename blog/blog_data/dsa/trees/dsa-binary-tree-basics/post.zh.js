/* Post body — dsa-binary-tree-basics / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-binary-tree-basics:zh'] = `
<p class="lead">二叉树（binary tree）的每个结点最多有两个孩子。本课程约定：深度数边，根的深度为 0；高度数结点，空树为 0、叶子为 1。完全二叉树的高度只有约 log₂ n，并且能不留空位地存进数组。</p>

<h2>从有序链表到二叉树</h2>
<p>有序数组能二分查找，靠的是<strong>按下标 O(1) 跳到中间</strong>。有序链表也知道目标在哪一半，却拿不到那一半的中间结点，只能从头走过去，所以查找仍是 O(n)。</p>
<p>补救办法：存一个指向中间结点的指针。这还不够，下一步要去左半或右半的中间，那就给每一半也存一个“中间”指针，一直递归下去。以 9, 14, 28, 32, 42, 53, 64 为例：32 是入口；左半 9, 14, 28 的中间 14 挂在 32 左边，右半 42, 53, 64 的中间 53 挂在右边；再往下是 9、28、42、64。把这些指针画出来就是一棵二叉树：入口叫<strong>根（root）</strong>，每个结点有 <code>left</code> 和 <code>right</code> 两个指针，每个孩子又是一棵更小的树的根。</p>
<pre><code>typedef struct node node_t;
struct node {
    int key;            /* 数据项（也可以是 void *data） */
    node_t *left;       /* 左孩子，没有则为 NULL */
    node_t *right;      /* 右孩子，没有则为 NULL */
    node_t *parent;     /* 可选：指回父结点，AVL 等算法里方便往上走 */
};</code></pre>
<p>和链表结点（数据 + <code>next</code>）相比只多一个指针，<strong>空树就是 <code>NULL</code></strong>。<code>parent</code> 不是必需的，课上提到维护 AVL 树时有它会方便很多。</p>

<h2>术语</h2>
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
<figcaption>图 1　课上讲术语用的树。蓝色是深度（从上往下数），黄色是高度（从下往上算）。</figcaption>
</figure>

<table>
<thead><tr><th>术语</th><th>含义</th><th>图 1 中的例子</th></tr></thead>
<tbody>
<tr><td>根（root）</td><td>唯一没有父结点的结点</td><td>32</td></tr>
<tr><td>父结点（parent）</td><td>指向当前结点的那个结点</td><td>14 的父结点是 32</td></tr>
<tr><td>孩子（child）</td><td>当前结点指向的结点</td><td>32 的孩子是 14、53</td></tr>
<tr><td>叶子（leaf）</td><td>没有孩子的结点</td><td>9、28、50、64</td></tr>
<tr><td>内部结点（internal node）</td><td>至少有一个孩子的结点</td><td>32、14、53、42</td></tr>
<tr><td>祖先（ancestor）</td><td>从父结点一路往上直到根</td><td>50 的祖先：42、53、32</td></tr>
<tr><td>子树（subtree）</td><td>某个结点连同它下面的全部结点</td><td>53 的左子树：42、50</td></tr>
<tr><td>度（degree）</td><td>结点的孩子个数，二叉树里只能是 0、1、2</td><td>42 的度是 1</td></tr>
<tr><td>层（level）</td><td>深度相同的全部结点</td><td>第 2 层：9、28、42、64</td></tr>
</tbody>
</table>

<h2>深度与高度：本课约定</h2>
<p><strong>深度（depth）</strong>：从根走到该结点经过的边数。<strong>根的深度是 0</strong>，14、53 是 1，50 是 3。深度从上往下算：孩子的深度 = 父结点的深度 + 1。</p>
<p><strong>高度（height）</strong>按递归定义，从下往上算：</p>
<pre><code class="lang-text">height(NULL) = 0
height(t)    = 1 + max(height(t 的左子树), height(t 的右子树))</code></pre>
<p>所以<strong>叶子的高度是 1 + max(0, 0) = 1</strong>。42 只有右孩子：左边 NULL 记 0，右边的叶子 50 记 1，height(42) = 1 + max(0, 1) = 2。再往上，height(53) = 1 + max(2, 1) = 3，height(14) = 1 + max(1, 1) = 2，根 height(32) = 1 + max(2, 3) = 4。<strong>树的高度就是根的高度</strong>，等于最长的根到叶子路径上的结点数，也就是层数，<strong>= 最大深度 + 1</strong>。</p>
<div class="callout warn" data-label="易错">
<p>很多教材数边：叶子高度 0、空树 −1。<strong>本课程数结点：空树 0，叶子 1</strong>，两种约定差 1，答题按本课。深度两边一致，都数边、根为 0。</p>
</div>
<pre><code>/* 本课约定：空树高度 0，叶子高度 1 */
int height(node_t *t) {
    if (t == NULL) return 0;
    int hl = height(t-&gt;left);
    int hr = height(t-&gt;right);
    return 1 + (hl &gt; hr ? hl : hr);
}</code></pre>
<p>先算完两个孩子再算自己，正是后序（post-order）的顺序（见 3.2 树的三种遍历）。每个结点只处理一次，<strong>O(n)</strong>。</p>

<h2>每层最多 2ᵏ 个结点</h2>
<p>第 0 层只有根，1 个；每个结点最多两个孩子，下一层最多是上一层的 2 倍，所以<strong>第 k 层最多 2<sup>k</sup> 个结点</strong>。每层都填满的树叫满二叉树（perfect binary tree），h 层一共</p>
<p>1 + 2 + 4 + … + 2<sup>h−1</sup> = <strong>2<sup>h</sup> − 1</strong> 个结点</p>
<p>（公式表上的等比数列求和，r = 2）。图 1 去掉 50 就是 3 层的满二叉树：7 = 2³ − 1。反过来，<strong>高度为 h 的二叉树最多 2<sup>h</sup> − 1 个结点</strong>，所以 n 个结点的二叉树，高度最小约 log₂ n（完全二叉树取到这个下限），最大是 n（每层只有一个结点的链）。</p>

<h2>完全二叉树</h2>
<p><strong>完全二叉树（complete binary tree）</strong>：除最后一层外每层都填满；最后一层的结点<strong>从左往右连续排列</strong>，缺只能缺在右端。</p>
<p>判定方法：按层从上到下、每层从左到右给位置编号（根为 0，第 1 层是 1、2，第 2 层是 3…6），结点占的编号恰好是 <strong>0 … n−1、中间没有空号</strong>，就是完全二叉树。</p>
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
<p><strong>为什么完全二叉树的高度约为 log₂ n</strong>：设高度为 h，前 h−1 层全满，共 2<sup>h−1</sup> − 1 个结点；最后一层有 1 到 2<sup>h−1</sup> 个。于是</p>
<pre><code class="lang-text">2^(h−1) ≤ n ≤ 2^h − 1   ⟹   h − 1 ≤ log₂ n &lt; h   ⟹   h = ⌊log₂ n⌋ + 1</code></pre>
<p>例如 n = 6 时 h = ⌊2.58⌋ + 1 = 3；n = 1000 时 h = 10；n = 10⁶ 时也只有 20。同样 n 个结点，排成链高度是 n，排成完全二叉树只有 ⌊log₂ n⌋ + 1。<strong>“高度约 log₂ n”只对完全（或平衡）的树成立</strong>，任意二叉树没有这个保证；BST 最坏 O(n)（3.3）和 AVL 树（3.5）都围绕这一点展开。</p>

<h2>用数组存二叉树</h2>
<p>把上面的编号直接当数组下标：根放在下标 0，<strong>下标 i 的左孩子在 2i+1，右孩子在 2i+2，父结点在 ⌊(i−1)/2⌋</strong>。图 1 中 14 在下标 1，它的孩子 9、28 分别在 2·1+1 = 3 和 2·1+2 = 4。数组里不需要指针，父子之间靠算下标移动。</p>
<pre><code>/* 下标从 0 开始的层序存储 */
int left_of(int i)   { return 2 * i + 1; }
int right_of(int i)  { return 2 * i + 2; }
int parent_of(int i) { return (i - 1) / 2; }   /* 要求 i ≥ 1 */</code></pre>
<p>课上的投票题：<strong>任意 n 个结点的二叉树都能用数组存吗？能</strong>，缺的结点留空位即可。但只有完全二叉树正好占满 0 … n−1；其他树会留下空洞。最坏是单边的链：右斜链每往下一层，下标从 i 变成 2i+2，<strong>n 个结点要 2<sup>n</sup> − 1 格</strong>。</p>
<iframe class="anim-frame" src="blog/blog_data/dsa-binary-tree-basics/anims/tree-array.html" loading="lazy" style="height: 540px;" title="二叉树按层存进数组"></iframe>
<p class="anim-caption">上方切换三棵树，按“下一步”逐个放结点：看每个下标怎样由父结点的下标算出，以及哪些格子空着。</p>
<p>后面的堆（heap）就是存在数组里的完全二叉树，但课上的堆<strong>从下标 1 开始</strong>：孩子在 2i、2i+1，父结点在 ⌊i/2⌋（见 6.1 堆：定义与数组表示）。做题先看清下标从 0 还是从 1 开始。</p>

<h2>在普通二叉树里找一个键：O(n)</h2>
<p><strong>二叉树不等于二叉搜索树</strong>。普通二叉树对键放在哪里没有任何规定：在图 1 里找 50，看到根是 32 也推不出该往哪边走，只能把结点一个个看过去。</p>
<pre><code>/* 普通二叉树：键和位置无关，只能一个个结点看 */
node_t *find(node_t *t, int key) {
    if (t == NULL) return NULL;
    if (t-&gt;key == key) return t;
    node_t *hit = find(t-&gt;left, key);      /* 先找左子树 */
    if (hit != NULL) return hit;
    return find(t-&gt;right, key);            /* 左边没有再找右边 */
}</code></pre>
<p>找一个不存在的键（如 51）要看完全部 8 个结点，<strong>最坏 O(n)</strong>。这种把每个结点都访问一遍的做法叫遍历（traversal），访问顺序见 3.2。普通二叉树的插入和删除取决于自己定的规则（挂在任意空位、挂在最底层……），课上没有固定做法；给键规定左小右大之后，就是 3.3 的二叉搜索树（BST）。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>给一棵树，写某个结点的深度、高度或整棵树的高度</strong>：按本课约定，根深度 0，叶子高度 1，height(NULL) = 0。</li>
<li><strong>判断是否完全二叉树</strong>，或从几棵树里选出完全的那棵：按层编号，看有没有空号。</li>
<li><strong>数组下标</strong>：给下标求孩子或父结点，给树求某结点的下标或数组长度。先确认下标从 0（孩子 2i+1、2i+2）还是从 1（孩子 2i、2i+1，堆）开始。</li>
<li><strong>计数</strong>：第 k 层最多 2<sup>k</sup> 个；h 层的满二叉树有 2<sup>h</sup> − 1 个；n 个结点的完全二叉树高度为 ⌊log₂ n⌋ + 1。公式表上与此相关的只有等比数列求和与对数恒等式，这几个结论要自己能推出来。</li>
<li><strong>选择题</strong>：“在二叉树中查找是 O(log n)”是错的，普通二叉树最坏 O(n)；“任何二叉树都能存进数组”是对的，但可能非常浪费。</li>
<li><strong>C 代码</strong>：递归求高度、结点数、叶子数，写法都是“NULL 返回 0，否则合并左右子树的结果”。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>把叶子高度写成 0；把根的深度写成 1；把“完全”理解成“每个结点都有两个孩子”；最后一层的结点靠右排或中间有空也当成完全；忘了树高 = 最大深度 + 1。</p>
</div>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">在图 1 的树中给 28 加一个左孩子 17。17 的深度是多少？哪些结点的高度变了？整棵树的高度呢？</summary>
<div class="qa__body">
<p>17 的深度 = 28 的深度 + 1 = <strong>3</strong>。</p>
<p>高度只可能在 17 的祖先上变化，即 28、14、32：</p>
<ul>
<li>height(28) = 1 + max(1, 0) = 2，原来是 1，<strong>变了</strong>；</li>
<li>height(14) = 1 + max(1, 2) = 3，原来是 2，<strong>变了</strong>；</li>
<li>height(32) = 1 + max(3, 3) = 4，没变，因为右子树 53 的高度本来就是 3。</li>
</ul>
<p>所以只有 28 和 14 的高度变了，树高仍是 <strong>4</strong>。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">把图 1 的树按层存进下标从 0 开始的数组。50 在哪个下标？数组至少多长、空几格？它是完全二叉树吗？如果把 50 改挂成 9 的左孩子呢？</summary>
<div class="qa__body">
<p>53 在下标 2；42 是 53 的左孩子：2·2+1 = 5；50 是 42 的右孩子：2·5+2 = <strong>12</strong>。</p>
<p>数组至少 <strong>13</strong> 格，只有 8 个结点，空 <strong>5</strong> 格（下标 7…11）。编号中间有空号，<strong>不是完全二叉树</strong>。</p>
<p>改挂之后：9 在下标 3，50 在 2·3+1 = 7。8 个结点正好占下标 0…7，没有空号，<strong>是完全二叉树</strong>，数组 8 格不浪费。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">一棵完全二叉树有 100 个结点。(a) 它的高度是多少？(b) 最后一层有几个结点？(c) 存进下标从 0 开始的数组，下标 99 的父结点在哪里？哪些下标是叶子？</summary>
<div class="qa__body">
<p>(a) 2⁶ = 64 ≤ 100 &lt; 128 = 2⁷，所以 ⌊log₂ 100⌋ = 6，高度 = 6 + 1 = <strong>7</strong>。</p>
<p>(b) 前 6 层（第 0…5 层）全满：2⁶ − 1 = 63 个；最后一层 100 − 63 = <strong>37</strong> 个。</p>
<p>(c) 父结点在 ⌊(99 − 1)/2⌋ = <strong>49</strong>。下标 49 的左孩子 2·49+1 = 99 还在数组内；下标 50 的左孩子 2·50+1 = 101 已超出 0…99。所以 <strong>50…99 都是叶子</strong>，共 50 个，0…49 是内部结点。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">用 C 写 <code>int count_leaves(node_t *t)</code>，返回树中叶子的个数。对图 1 的树它返回几？时间复杂度是多少？</summary>
<div class="qa__body">
<pre><code>int count_leaves(node_t *t) {
    if (t == NULL) return 0;
    if (t-&gt;left == NULL &amp;&amp; t-&gt;right == NULL) return 1;   /* 叶子 */
    return count_leaves(t-&gt;left) + count_leaves(t-&gt;right);
}</code></pre>
<p>空树没有叶子；两个孩子都为 NULL 的结点就是叶子，计 1；否则叶子数 = 左子树的叶子数 + 右子树的叶子数。叶子判断必须放在递归之前，否则叶子会返回 0 + 0。</p>
<p>图 1 的树返回 <strong>4</strong>（9、28、50、64）。每个结点只访问一次，<strong>O(n)</strong>。</p>
</div>
</details>
`;

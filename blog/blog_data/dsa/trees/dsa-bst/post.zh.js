/* Post body — dsa-bst / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-bst:zh'] = `
<p class="lead">二叉搜索树（Binary Search Tree, BST）把有序数组上的二分查找搬到链式结点上：查找和插入都只走一条从根往下的路径，代价是 O(树高)。树高由插入顺序决定，有序输入会让它退化成链表，所以<strong>任意 BST 的查找最坏是 O(n)</strong>。</p>

<h2>BST 性质</h2>
<p>课上的例子：从空树依次插入 32, 14, 53, 9, 28, 42, 64, 50，得到下图。看根 32：左子树里的 14、9、28 都比它小，右子树里的 53、42、50、64 都比它大。53 也一样：42、50 在左，64 在右。每个结点都如此。</p>

<figure class="fig">
<svg viewBox="0 0 520 330" width="520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="课上的 BST：查找 50 的路径、17 的插入位置和 51 查找失败的位置">
<g stroke="rgba(255,255,255,0.35)" stroke-width="2">
<line x1="260" y1="40" x2="140" y2="105"/><line x1="140" y1="105" x2="80" y2="170"/><line x1="140" y1="105" x2="200" y2="170"/>
<line x1="380" y1="105" x2="440" y2="170"/>
</g>
<g stroke="#d97757" stroke-width="3.5">
<line x1="260" y1="40" x2="380" y2="105"/><line x1="380" y1="105" x2="320" y2="170"/><line x1="320" y1="170" x2="355" y2="235"/>
</g>
<line x1="200" y1="170" x2="165" y2="235" stroke="#4ade80" stroke-width="2" stroke-dasharray="5 4"/>
<line x1="355" y1="235" x2="390" y2="300" stroke="#f87171" stroke-width="2" stroke-dasharray="5 4"/>
<g fill="#343433" stroke="#5a5a59" stroke-width="2">
<circle cx="140" cy="105" r="18"/><circle cx="80" cy="170" r="18"/><circle cx="200" cy="170" r="18"/><circle cx="440" cy="170" r="18"/>
</g>
<g fill="#343433" stroke="#d97757" stroke-width="2.5">
<circle cx="260" cy="40" r="18"/><circle cx="380" cy="105" r="18"/><circle cx="320" cy="170" r="18"/><circle cx="355" cy="235" r="18"/>
</g>
<circle cx="165" cy="235" r="18" fill="none" stroke="#4ade80" stroke-width="2" stroke-dasharray="5 4"/>
<circle cx="390" cy="300" r="18" fill="none" stroke="#f87171" stroke-width="2" stroke-dasharray="5 4"/>
<g fill="#e8e8e8" font-size="15" font-weight="700" text-anchor="middle">
<text x="260" y="45">32</text><text x="140" y="110">14</text><text x="380" y="110">53</text>
<text x="80" y="175">9</text><text x="200" y="175">28</text><text x="320" y="175">42</text><text x="440" y="175">64</text>
<text x="355" y="240">50</text>
</g>
<text x="165" y="240" fill="#4ade80" font-size="15" font-weight="700" text-anchor="middle">17</text>
<text x="390" y="305" fill="#f87171" font-size="15" font-weight="700" text-anchor="middle">51</text>
<g fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle">
<text x="284" y="26">1</text><text x="118" y="88">2</text><text x="402" y="88">2</text>
<text x="58" y="153">3</text><text x="222" y="153">3</text><text x="298" y="153">3</text><text x="462" y="153">3</text>
<text x="377" y="218">4</text>
</g>
<g fill="#a1a1a0" font-size="12">
<text x="140" y="270" text-anchor="middle">插入 17 的空位</text>
<text x="416" y="320">51 不在树中</text>
</g>
</svg>
<figcaption>课上的 BST。橙色是查找 50 的路径；结点旁的蓝色数字是找到它所需的比较次数；绿色虚线是插入 17 的位置，红色虚线是查找 51 失败的地方。</figcaption>
</figure>

<p><strong>BST 性质（BST property）：对每个结点 x，x 的左子树中所有键都小于 x 的键，右子树中所有键都大于 x 的键。</strong>要求针对整棵子树，不只是两个孩子：只检查“左孩子 &lt; 父 &lt; 右孩子”会漏掉错误（见练习 2）。这里默认键互不相同，下面的代码遇到重复键直接忽略。</p>
<p>普通二叉树（binary tree）没有顺序，找一个键只能遍历所有结点，O(n)。BST 有顺序，所以<strong>中序遍历（in-order）的输出就是升序序列</strong>（见 3.2 树的三种遍历）。</p>

<h2>查找：每层只比较一次</h2>
<p>找 50：</p>
<ol>
<li>与根 32 比较：50 &gt; 32，往右。</li>
<li>与 53 比较：50 &lt; 53，往左。</li>
<li>与 42 比较：50 &gt; 42，往右。</li>
<li>与 50 比较：相等，找到。共 <strong>4 次比较</strong>。</li>
</ol>
<p>找不存在的 51：前三步相同，到 50 时 51 &gt; 50 应往右，但 50 的右孩子是 NULL，于是断定 51 不在树中，同样 <strong>4 次</strong>。每一步都排除另一侧整棵子树，与二分查找（binary search）同理。</p>

<table>
<thead><tr><th>查找</th><th>经过的结点</th><th>比较次数</th></tr></thead>
<tbody>
<tr><td>32</td><td>32</td><td>1</td></tr>
<tr><td>53</td><td>32, 53</td><td>2</td></tr>
<tr><td>50</td><td>32, 53, 42, 50</td><td>4</td></tr>
<tr><td>51（不存在）</td><td>32, 53, 42, 50 → NULL</td><td>4</td></tr>
</tbody>
</table>

<div class="callout key" data-label="考点">
<p>课上的计数法：<strong>每访问一个结点算 1 次比较</strong>，走到 NULL 不算（代码里一个结点可能做 == 和 &lt; 两次判断，仍记 1 次）。所以找到键 k 的比较次数 = 根到 k 路径上的结点数 = <strong>depth(k) + 1</strong>（本课 depth 从根的 0 算起）；找不到时 = 最后经过的结点的 depth + 1。</p>
<p>一次查找最多比较 h 次，h 为<strong>树高</strong>（本课约定空树高 0、叶子高 1）：上图高 4，最深的 50 正好要 4 次。所以<strong>查找是 O(h)</strong>。</p>
</div>

<h2>插入：先查找，再挂一片叶子</h2>
<p>插入 17：17 &lt; 32 往左；17 &gt; 14 往右；17 &lt; 28 往左，28 的左孩子为空，就把 17 挂在那里（图中绿色虚线）。<strong>插入 = 查找空位（O(h)）+ 挂上新结点（O(1)）</strong>。新结点总是叶子，原有结点不动，只改一根指针。</p>

<pre><code>#include &lt;stdlib.h&gt;
#include &lt;assert.h&gt;

typedef struct node node_t;
struct node {
    int key;
    node_t *left, *right;
};

node_t *new_node(int key) {
    node_t *n = malloc(sizeof(*n));
    assert(n != NULL);
    n-&gt;key = key;
    n-&gt;left = n-&gt;right = NULL;
    return n;
}

/* 递归查找：找到返回该结点，找不到返回 NULL */
node_t *bst_find(node_t *t, int key) {
    if (t == NULL || key == t-&gt;key) return t;
    if (key &lt; t-&gt;key) return bst_find(t-&gt;left, key);
    return bst_find(t-&gt;right, key);
}

/* 迭代查找：同一条路径，用循环代替递归 */
node_t *bst_find_iter(node_t *t, int key) {
    while (t != NULL &amp;&amp; key != t-&gt;key)
        t = (key &lt; t-&gt;key) ? t-&gt;left : t-&gt;right;
    return t;
}

/* 递归插入：返回插入后这棵子树的根 */
node_t *bst_insert(node_t *t, int key) {
    if (t == NULL) return new_node(key);      /* 空位：新叶子 */
    if (key &lt; t-&gt;key)      t-&gt;left  = bst_insert(t-&gt;left, key);
    else if (key &gt; t-&gt;key) t-&gt;right = bst_insert(t-&gt;right, key);
    return t;                                 /* 键已存在：不变 */
}

/* 迭代插入：记住父结点，走到 NULL 后挂在父结点下面 */
node_t *bst_insert_iter(node_t *root, int key) {
    node_t *parent = NULL, *cur = root;
    while (cur != NULL) {
        if (key == cur-&gt;key) return root;     /* 键已存在 */
        parent = cur;
        cur = (key &lt; cur-&gt;key) ? cur-&gt;left : cur-&gt;right;
    }
    node_t *n = new_node(key);
    if (parent == NULL) return n;             /* 原来是空树 */
    if (key &lt; parent-&gt;key) parent-&gt;left = n;
    else                   parent-&gt;right = n;
    return root;
}

/* 后序释放：先释放两棵子树，再释放自己 */
void free_tree(node_t *t) {
    if (t == NULL) return;
    free_tree(t-&gt;left);
    free_tree(t-&gt;right);
    free(t);
}</code></pre>
<ul>
<li>递归插入<strong>返回子树的根</strong>，调用时必须写 <code>root = bst_insert(root, key);</code>。空树时新结点就是根，不接住返回值，第一个结点就丢了，内存也泄漏。路径上每层都会赋值 <code>t-&gt;left</code> 或 <code>t-&gt;right</code>，只有最底下那次真正改变指针，其余写回原值。</li>
<li>迭代插入要<strong>记住父结点</strong>：<code>cur</code> 走到 NULL 后已经回不去，只能通过 <code>parent</code> 挂上新结点。</li>
<li>查找和插入的两种写法时间都是 O(h)。递归版本调用栈深 h，额外空间 O(h)；迭代版本额外空间 O(1)。</li>
<li>释放用后序（post-order）：若先 free 父结点，就再也拿不到它的孩子指针。</li>
</ul>

<h2>插入顺序决定形状</h2>
<p>同样 7 个键 9, 14, 28, 32, 42, 53, 64：</p>
<ul>
<li>按 32, 14, 53, 9, 28, 42, 64 插入：32 是 7 个键的中间值，14、53 又是左右两半的中间值，得到满二叉树（perfect binary tree），高 3，任何查找最多比较 3 次。</li>
<li>按升序 9, 14, 28, …, 64 插入：每个新键都比已有的键大，一路往右，得到一条向右的链，高 7，就是一个链表，找 64 要比较 7 次。降序输入得到向左的链。</li>
</ul>
<p>n 个结点的 BST，高度最小为 ⌈log₂(n+1)⌉（h 层最多放 2<sup>h</sup> − 1 个结点），最大为 n（每个结点只有一个孩子）。按升序插入 n 个键时，第 i 个键要和已有的 i − 1 个结点逐一比较，总共 0 + 1 + … + (n − 1) = <strong>n(n − 1)/2 次，O(n²)</strong>。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-bst/anims/bst-insert.html" loading="lazy" style="height: 540px;" title="BST 插入与退化"></iframe>
<p class="anim-caption">按钮切换同一组 9 个键的插入顺序，“随机”每次重新打乱；蓝色是本次插入的查找路径，最后一帧绿色是最坏的查找路径。</p>

<div class="callout key" data-label="考点">
<p><strong>问“在 BST 中查找的时间复杂度”，答 O(n)。</strong>题目没有保证形状，就要考虑退化成链的最坏情况。第 4 周课堂小测多数人选了 O(log n)，是错的。只有树平衡（balanced，本课定义为查找能在 O(log n) 内完成）时才是 O(log n)。最好情况是要找的键就在根上，Θ(1)。</p>
</div>

<h3>只看根平衡不够</h3>
<p>依次插入 32, 28, 42, 17, 50, 14, 53, 9, 64：</p>
<pre><code class="lang-text">            32
           /  \\
         28    42
        /        \\
      17          50
     /              \\
   14                53
  /                    \\
 9                      64</code></pre>
<p>根的左、右子树高度都是 4，看根是“平衡”的。可每一边都是链：n 个结点时树高约 n/2，找 9 或 64 要比较 5 次，一般地仍是 O(n)。平衡条件必须对<strong>每个结点</strong>成立，这就是 AVL 条件（见 3.5 平衡与 AVL 条件）。</p>

<h2>用 BST 实现字典</h2>
<p>先插入 n 个键建字典，再做 m 次查找：</p>
<table>
<thead><tr><th>情况</th><th>建树（n 次插入）</th><th>m 次查找</th><th>合计</th></tr></thead>
<tbody>
<tr><td>平均（随机顺序，树较平衡）</td><td>n × O(log n) = O(n log n)</td><td>O(m log n)</td><td><strong>O(n log n + m log n)</strong></td></tr>
<tr><td>最坏（有序输入，退化成链）</td><td>0 + 1 + … + (n − 1) = O(n²)</td><td>O(nm)</td><td><strong>O(n² + nm)</strong></td></tr>
</tbody>
</table>
<p>BST 想兼得链表的 O(1) 挂结点和有序数组的 O(log n) 查找，最坏情况却和链表一样。出路有两条：指望输入是随机顺序（靠不住），或改用插入时自动保持平衡的树，如 AVL 树（见 3.6 AVL 旋转）和 2-3 树（见 3.7）。删除见 3.4 BST 删除。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>数比较次数</strong>（填空）：给一棵 BST，问找某个键（可能不存在）要比较几次。数经过的结点，找不到时数到最后一个非空结点。</li>
<li><strong>画树</strong>：给插入序列，从空树画出 BST，常接着问树高、中序遍历或某次查找的比较次数。树高用本课约定（叶子 = 1）。</li>
<li><strong>复杂度选择题</strong>：BST 查找、插入最坏 O(n)，平衡时 O(log n)；有序输入建树 O(n²)；字典“n 次插入 + m 次查找”的平均与最坏两行。</li>
<li><strong>写代码</strong>（Canvas 纯文本框）：BST 插入（递归或迭代）、查找，或在其上做的小函数（计数、求最小键等）。检查 NULL 和 malloc 的返回值，接住返回的根，最后释放。</li>
<li>公式表上的等差数列求和可以用来算 n(n − 1)/2；BST 性质、比较计数法、depth/height 约定和各项复杂度都要自己记。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li>把二叉树当成二叉搜索树：普通二叉树查找要遍历，O(n)。</li>
<li>只检查父子之间的大小关系，没检查整棵子树。</li>
<li>以为根的左右子树一样高就算平衡。</li>
<li>看到“BST 查找”就选 O(log n)。</li>
<li>查不到时少数一次：最后那个结点也要比较，才知道该往哪边走、那边是空的。</li>
<li>递归插入后没写 <code>root = …</code>；迭代插入没记父结点。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. 从空树依次插入 45, 20, 70, 10, 30, 60, 90, 25, 65, 62。(a) 画出 BST；(b) 树高是多少（叶子高 1）？(c) 查找 62、查找 27 各要比较几次？</summary>
<div class="qa__body">
<p>(a) 逐个插入（括号内是比较过的结点）：45 为根；20（45）挂在 45 左；70（45）挂在 45 右；10（45, 20）挂在 20 左；30（45, 20）挂在 20 右；60（45, 70）挂在 70 左；90（45, 70）挂在 70 右；25（45, 20, 30）挂在 30 左；65（45, 70, 60）挂在 60 右；62（45, 70, 60, 65）挂在 65 左。</p>
<pre><code class="lang-text">          45
        /    \\
      20      70
     /  \\    /  \\
   10   30  60   90
        /     \\
      25       65
              /
            62</code></pre>
<p>(b) 最长的根到叶路径 45 → 70 → 60 → 65 → 62 有 5 个结点，树高 <strong>5</strong>。</p>
<p>(c) 找 62：经过 45, 70, 60, 65, 62，<strong>5 次</strong>。找 27：27 &lt; 45 往左，27 &gt; 20 往右，27 &lt; 30 往左，27 &gt; 25 往右，25 的右孩子为空，27 不存在，<strong>4 次</strong>。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 下面这棵树是不是 BST？在它上面运行 bst_find 找 35，结果如何？</summary>
<div class="qa__body">
<pre><code class="lang-text">      30
     /  \\
   20    40
  /  \\     \\
10    35    50</code></pre>
<p><strong>不是。</strong>每对父子都满足“左小右大”（20 &lt; 30，35 &gt; 20，50 &gt; 40 等），但 35 在 30 的左子树里却比 30 大，违反 BST 性质。中序遍历得 10 20 35 30 40 50，不是升序，也能看出来。</p>
<p>找 35：35 &gt; 30 往右，35 &lt; 40 往左，40 的左孩子为空，比较 2 次后返回 NULL，报告“不存在”，可 35 明明在树里。查找能跳过一侧子树，前提是整棵子树都满足性质。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 多选：关于有 n 个结点的 BST（n 很大），哪些说法一定正确？A. 查找最坏 O(log n)　B. 查找最坏 O(n)　C. 只要根的左右子树高度差不超过 1，查找就是 O(log n)　D. 把 1, 2, …, n 依次插入空 BST，共做 n(n − 1)/2 次键比较　E. 中序遍历按升序输出所有键</summary>
<div class="qa__body">
<p>选 <strong>B、D、E</strong>。</p>
<ul>
<li>A 错：有序输入得到链，最坏 O(n)。</li>
<li>C 错：根下挂两条等长的链，根处高度差为 0，树高仍约 n/2。</li>
<li>D 对：插入第 i 个键时，树是 1 → 2 → … → i − 1 的右链，要比较 i − 1 次，求和 0 + 1 + … + (n − 1) = n(n − 1)/2。</li>
<li>E 对：由 BST 性质直接得到。</li>
</ul>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 用上文的 node_t 写 int cmp_count(node_t *t, int key)，按课上的计数法返回查找 key 的比较次数（找到或确定不存在都要返回）。在课上那棵树（图中未插入 17 的部分）上，cmp_count(root, 50) 和 cmp_count(root, 51) 各返回多少？</summary>
<div class="qa__body">
<pre><code>int cmp_count(node_t *t, int key) {
    int count = 0;
    while (t != NULL) {
        count++;                       /* 访问一个结点 = 一次比较 */
        if (key == t-&gt;key) break;      /* 找到 */
        t = (key &lt; t-&gt;key) ? t-&gt;left : t-&gt;right;
    }
    return count;
}</code></pre>
<p>每访问一个非空结点加 1，找到就停，走到 NULL 结束；空树返回 0。</p>
<p>cmp_count(root, 50) 经过 32, 53, 42, 50，返回 <strong>4</strong>；cmp_count(root, 51) 经过同样 4 个结点后走到 50 的右空指针，返回 <strong>4</strong>。</p>
</div>
</details>
`;

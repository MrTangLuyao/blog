/* Post body — dsa-bst-delete / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-bst-delete:zh'] = `
<p class="lead">从二叉搜索树（Binary Search Tree, BST）删除一个键：先像查找一样找到结点，再按它有几个孩子分三种情况处理；有两个孩子时，用它的<strong>中序前驱</strong>或<strong>中序后继</strong>顶替。代价 O(h)，h 为树高。AVL 树删除后还要沿路径一直检查到根。</p>

<h2>中序前驱与后继</h2>
<p>课上用 3.2 中的字母树（按字母序是一棵 BST）。把每个结点竖直投到底行，得到中序遍历（in-order）序列 F G J K M P Q S：</p>

<figure class="fig">
<svg viewBox="0 0 430 282" width="430" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="课上的 BST：M 的前驱 K、后继 P，结点投影到底行得到中序序列">
<g stroke="rgba(255,255,255,0.2)" stroke-width="1" stroke-dasharray="2 4">
<line x1="40" y1="158" x2="40" y2="230"/><line x1="90" y1="213" x2="90" y2="230"/><line x1="140" y1="103" x2="140" y2="230"/><line x1="190" y1="158" x2="190" y2="230"/>
<line x1="240" y1="48" x2="240" y2="230"/><line x1="290" y1="103" x2="290" y2="230"/><line x1="340" y1="213" x2="340" y2="230"/><line x1="390" y1="158" x2="390" y2="230"/>
</g>
<g stroke="rgba(255,255,255,0.35)" stroke-width="2">
<line x1="140" y1="85" x2="40" y2="140"/><line x1="40" y1="140" x2="90" y2="195"/><line x1="290" y1="85" x2="390" y2="140"/><line x1="390" y1="140" x2="340" y2="195"/>
</g>
<g stroke="#38bdf8" stroke-width="3"><line x1="240" y1="30" x2="140" y2="85"/><line x1="140" y1="85" x2="190" y2="140"/></g>
<line x1="240" y1="30" x2="290" y2="85" stroke="#4ade80" stroke-width="3"/>
<g fill="#343433" stroke="#5a5a59" stroke-width="2">
<circle cx="40" cy="140" r="16"/><circle cx="90" cy="195" r="16"/><circle cx="140" cy="85" r="16"/><circle cx="340" cy="195" r="16"/><circle cx="390" cy="140" r="16"/>
</g>
<circle cx="240" cy="30" r="16" fill="#343433" stroke="#d97757" stroke-width="2.5"/>
<circle cx="190" cy="140" r="16" fill="#343433" stroke="#38bdf8" stroke-width="2.5"/>
<circle cx="290" cy="85" r="16" fill="#343433" stroke="#4ade80" stroke-width="2.5"/>
<g fill="#e8e8e8" font-size="15" font-weight="700" text-anchor="middle">
<text x="40" y="145">F</text><text x="90" y="200">G</text><text x="140" y="90">J</text><text x="190" y="145">K</text>
<text x="240" y="35">M</text><text x="290" y="90">P</text><text x="340" y="200">Q</text><text x="390" y="145">S</text>
</g>
<g font-size="15" font-weight="700" text-anchor="middle" fill="#a1a1a0">
<text x="40" y="250">F</text><text x="90" y="250">G</text><text x="140" y="250">J</text><text x="190" y="250" fill="#38bdf8">K</text>
<text x="240" y="250" fill="#d97757">M</text><text x="290" y="250" fill="#4ade80">P</text><text x="340" y="250">Q</text><text x="390" y="250">S</text>
</g>
<g font-size="12" text-anchor="middle">
<text x="190" y="272" fill="#38bdf8">前驱</text><text x="290" y="272" fill="#4ade80">后继</text>
</g>
</svg>
<figcaption>底行是中序序列。M 的前驱 K（蓝色路径）和后继 P（绿色路径）正是它在序列里的左右邻居。</figcaption>
</figure>

<p>中序里紧挨在 M 前面的 K 是 M 的<strong>中序前驱（in-order predecessor）</strong>，即比 M 小的键中最大的；紧挨在后面的 P 是<strong>中序后继（in-order successor）</strong>，即比 M 大的键中最小的。在树上找它们不用遍历：</p>
<ul>
<li>前驱：先到左孩子 J，再一直往右，J → K，K 没有右孩子，停。</li>
<li>后继：先到右孩子 P，再一直往左，P 没有左孩子，后继就是 P 本身。</li>
</ul>

<div class="callout key" data-label="考点">
<p><strong>有左子树时，前驱 = 左子树中最右的结点；有右子树时，后继 = 右子树中最左的结点。</strong>所以<strong>前驱没有右孩子，后继没有左孩子，都至多一个孩子</strong>，第 3 种情况靠的就是这一点。</p>
</div>

<p>结点没有左子树时，前驱在祖先里：往上走，第一次从右孩子走到父结点，这个父结点就是前驱（P 的前驱是 M）。后继同理。删除时碰不到这种情形。</p>

<h2>三种情况</h2>
<p>先按查找的路线找到要删的结点 X，再看它有几个孩子：</p>
<table>
<thead><tr><th>情况</th><th>课上的例子</th><th>做法</th></tr></thead>
<tbody>
<tr><td>1. X 是叶子（leaf）</td><td>删 G</td><td>父结点 F 的右指针改为 NULL，释放 G</td></tr>
<tr><td>2. X 只有一个孩子</td><td>删 P（只有右孩子 S）</td><td>父结点 M 的右指针直接指向 S，释放 P</td></tr>
<tr><td>3. X 有两个孩子</td><td>删 J、删 M</td><td>把前驱或后继的键复制到 X，再删掉前驱或后继原来的结点（必属情况 1 或 2）</td></tr>
</tbody>
</table>
<p>情况 2 中 S 带着整棵子树上移一层，这些键原来就在 M 右边，顺序不变。情况 3 不能把一个孩子直接提上来：若让 J 顶替 M，J 的右孩子 K 和 M 的右子树都要挂在 J 右边，放不下。前驱、后继在中序里与 X 相邻，放到 X 的位置后左边仍全比它小、右边仍全比它大。</p>
<p><strong>删 J</strong>：右孩子 K 没有左孩子，后继就是 K（课上的做法）。K 复制到 J 的位置，原来的 K 是叶子，直接删去。若用前驱则是 G（F → G），G 顶替 J，F、K 成为它的孩子。</p>
<p><strong>删 M</strong>：两个孩子都不是叶子，最复杂。用前驱 K 时，原来的 K 是叶子（情况 1）；用后继 P 时，原来的 P 只有右孩子 S，根的右指针改指 S（情况 2）：</p>
<pre><code class="lang-text">predecessor K        successor P
      K                      P
     / \\                   /   \\
    J   P                J       S
  /       \\            /  \\     /
F           S        F     K   Q
 \\         /          \\
  G       Q            G</code></pre>
<p><strong>两种都对</strong>，题目通常会指定用哪一个；没指定时写明用的是哪种。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-bst-delete/anims/bst-delete.html" loading="lazy" style="height: 520px;" title="BST 删除的三种情况"></iframe>
<p class="anim-caption">选要删的键（删 J、M 时再选前驱或后继），逐步看查找路径、前驱或后继的位置，以及被断开和新接上的指针。</p>

<h2>C 实现</h2>
<p>沿用 3.3 插入的递归写法：函数返回删除后子树的新根，由父结点接住（<code>t-&gt;left = bst_delete(t-&gt;left, key)</code>）。情况 1、2 的"父结点改指孩子"就靠这个返回值完成，不需要 parent 指针。</p>
<pre><code>#include &lt;stdlib.h&gt;

typedef struct node node_t;
struct node {
    int key;
    node_t *left, *right;
};

/* 删除 key，返回这棵子树的新根；key 不在树里时原样返回 */
node_t *bst_delete(node_t *t, int key) {
    if (t == NULL) return NULL;                   /* 没找到 */
    if (key &lt; t-&gt;key) {
        t-&gt;left = bst_delete(t-&gt;left, key);       /* 父结点接住新子树 */
    } else if (key &gt; t-&gt;key) {
        t-&gt;right = bst_delete(t-&gt;right, key);
    } else if (t-&gt;left == NULL || t-&gt;right == NULL) {
        /* 情况 1、2：至多一个孩子，让它（或 NULL）顶替 t */
        node_t *child = (t-&gt;left != NULL) ? t-&gt;left : t-&gt;right;
        free(t);
        return child;
    } else {
        /* 情况 3：后继 = 右子树中最左的结点 */
        node_t *s = t-&gt;right;
        while (s-&gt;left != NULL) {
            s = s-&gt;left;
        }
        t-&gt;key = s-&gt;key;                          /* 后继的键搬到 t */
        t-&gt;right = bst_delete(t-&gt;right, s-&gt;key);  /* 再删掉原来的后继 */
    }
    return t;
}</code></pre>
<ul>
<li>调用时写 <code>root = bst_delete(root, key);</code>，因为根也可能被删（只剩一个结点时返回 NULL）。</li>
<li>情况 3 只搬键，真正释放的是后继原来的结点。s 没有左孩子，第二次递归必然落在情况 1 或 2。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>先取出孩子指针，再 <code>free(t)</code>。释放之后再读 <code>t-&gt;left</code> 是未定义行为。</p>
</div>

<h2>代价</h2>
<p>先从根找到 X，情况 3 再沿右子树往下找后继，第二次递归又走到同一处。每段都不超过树高 h，所以<strong>删除是 O(h)</strong>，与查找、插入同级：</p>
<ul>
<li>一般 BST：最好 O(1)（删的是根且根至多一个孩子）；平均 O(log n)（树大致平衡）；<strong>最坏 O(n)</strong>（退化成链，见 3.3）。</li>
<li>AVL 树：高度 &lt; 1.44 log₂ n，<strong>最坏 O(log n)</strong>。</li>
</ul>

<h2>AVL 树的删除</h2>
<p>AVL 树（见 3.5、3.6）的删除 = <strong>BST 删除 + 从被摘掉的结点往上，沿路径逐个检查到根</strong>（情况 3 中被摘掉的是前驱或后继原来的结点）：每个祖先更新高度、算平衡因子 BF = h(左) − h(右)，遇到 ±2 按 3.6 的规则旋转，然后<strong>继续往上</strong>。代码上把结点类型换成 3.6 的 <code>avl_t</code>，最后的 <code>return t;</code> 改为 <code>return rebalance(t);</code>，递归逐层返回正好是从删除点回到根。</p>
<p>插入时一次旋转（单或双）就让子树高度回到插入前，上面不再失衡。删除让子树变矮，修好一处后，这棵子树可能仍比原来矮 1，上面的祖先又会失衡，所以<strong>一次删除可能在多个祖先处旋转</strong>，最多 O(log n) 次，总代价仍是 O(log n)。删除后较高一侧孩子的 BF 还可能是 0，这时用单旋转（练习 4）。</p>
<p>例：下面的 AVL 树删除叶子 12。</p>
<pre><code class="lang-text">                     8
                 /        \\
            5                 11
         /    \\              /  \\
      3        6           10    12
     /  \\        \\        /
   2     4        7     9
  /
1</code></pre>
<ol>
<li>删去 12，回到 11：h(左) = 2，h(右) = 0，BF(11) = <strong>+2</strong>；左孩子 10 的 BF = +1，是 LL，在 11 处右旋。10 上来，9、11 成为它的孩子，这棵子树高 2，比删除前矮了 1。</li>
<li>继续回到 8：左子树 5 高 4，右子树 10 高 2，BF(8) = <strong>+2</strong>；左孩子 5 的 BF = 3 − 2 = +1，又是 LL，在 8 处右旋。5 成为根，5 原来的右子树 6 改挂为 8 的左子树。</li>
</ol>
<pre><code class="lang-text">            5
         /       \\
      3              8
     /  \\         /     \\
   2     4     6           10
  /              \\        /  \\
1                 7     9     11</code></pre>
<p>一次删除，两次旋转，树高从 5 降为 4。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>画图题</strong>：给一棵 BST 或插入序列，依次删除几个键并画出每一步，常规定用中序后继或前驱。</li>
<li><strong>识别题</strong>：某结点的前驱、后继是谁；删除它属于哪种情况、改哪根指针。</li>
<li><strong>代码题</strong>：写 BST 删除（返回新根、释放结点），或改成用前驱。</li>
<li><strong>复杂度</strong>：BST 删除最坏 O(n)，AVL 删除 O(log n)，且要一路查到根、可能多次旋转。</li>
<li><strong>必须背</strong>：前驱、后继的定义和找法，三种情况的做法。公式表上没有。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li>把左孩子当成前驱、右孩子当成后继（M 的左孩子是 J，前驱却是 K）。</li>
<li>前驱或后继复制上去后，忘记删掉原来的结点，出现重复键。</li>
<li>后继有右子树时（删 M 用后继 P），把这棵子树一起丢掉；应让后继的父结点改指它。</li>
<li>AVL 删除在第一处旋转后就停下，没有继续往上检查。</li>
<li>题目若规定用完整的中序遍历找前驱、后继（2016 年期末有这种设定），每次是 O(n)，按题目给的方法算。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. 对下面的 BST 依次删除 30（用中序后继）、50（用中序前驱）、60，画出每次删除后的树。</summary>
<div class="qa__body">
<pre><code class="lang-text">               50
         /          \\
   30                   70
  /   \\              /    \\
20       40       60       80
        /  \\        \\
      35    45       65</code></pre>
<p><strong>删 30</strong>：两个孩子，后继是右子树最左的 35（40 → 35），是叶子。35 复制到 30 的位置，删掉原来的 35。</p>
<pre><code class="lang-text">            50
        /        \\
   35                70
  /  \\            /    \\
20    40       60       80
        \\        \\
         45       65</code></pre>
<p><strong>删 50</strong>：前驱是左子树最右的 45（35 → 40 → 45），是叶子。45 复制到根，删掉原来的 45，40 变成叶子。</p>
<p><strong>删 60</strong>：只有右孩子 65（情况 2），70 的左指针改指 65，释放 60。最终：</p>
<pre><code class="lang-text">         45
      /     \\
   35          70
  /  \\        /  \\
20    40    65    80</code></pre>
<p>检查：中序为 20 35 40 45 65 70 80，有序。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 在课上的字母树（上图）中，写出 J、P、G 的中序前驱和后继。删除 J、删除 P 各属于哪种情况？</summary>
<div class="qa__body">
<ul>
<li><strong>J</strong>：前驱 G（F → G，G 没有右孩子）；后继 K（右孩子 K 没有左孩子）。</li>
<li><strong>P</strong>：没有左子树，P 是 M 的右孩子，前驱是 <strong>M</strong>；后继 Q（S → Q）。</li>
<li><strong>G</strong>：没有左子树，G 是 F 的右孩子，前驱是 F；没有右子树，往上：G 是 F 的右孩子，继续，F 是 J 的左孩子，后继是 <strong>J</strong>。</li>
</ul>
<p>对照中序 F G J K M P Q S，答案都是左右邻居。删 J 属情况 3，删 P 属情况 2。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 把上面 <code>bst_delete</code> 的情况 3 改成用中序前驱顶替。</summary>
<div class="qa__body">
<p>只改最后一个 <code>else</code> 分支，其余不变：</p>
<pre><code>    } else {
        /* 情况 3：前驱 = 左子树中最右的结点 */
        node_t *p = t-&gt;left;
        while (p-&gt;right != NULL) {
            p = p-&gt;right;
        }
        t-&gt;key = p-&gt;key;
        t-&gt;left = bst_delete(t-&gt;left, p-&gt;key);
    }</code></pre>
<p>前驱没有右孩子，第二次递归同样落在情况 1 或 2。注意要在<strong>左</strong>子树里删，并由 <code>t-&gt;left</code> 接住。对课上的树删 M，得到上文左边以 K 为根的树。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 下面是一棵 AVL 树。删除 5 后需要什么旋转？画出结果。如果当成 RL 做双旋转会怎样？</summary>
<div class="qa__body">
<pre><code class="lang-text">      20
     /     \\
   10          40
  /           /  \\
5           30    50
           /        \\
         25          55</code></pre>
<p>删去叶子 5，往上检查。10 的 BF = 0。20：h(左) = 1，h(右) = 3，BF(20) = <strong>−2</strong>，失衡。较高一侧的右孩子 40：h(30) = h(50) = 2，BF(40) = <strong>0</strong>，用单旋转，按 RR 在 20 处左旋：40 上来，它原来的左子树 30（带 25）改挂为 20 的右子树。</p>
<pre><code class="lang-text">            40
        /     \\
   20          50
  /   \\          \\
10       30       55
        /
      25</code></pre>
<p>检查：BF(30) = +1，BF(20) = 1 − 2 = −1，BF(50) = −1，BF(40) = 3 − 2 = +1，平衡。</p>
<p>若当成 RL（先在 40 右旋，再在 20 左旋），30 成为根，左边是 20（孩子 10、25），右边 40 只剩右链 40 → 50 → 55，BF(40) = −2，<strong>仍然失衡</strong>。</p>
</div>
</details>
`;

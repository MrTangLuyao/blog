/* Post body — dsa-bst-delete / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-bst-delete:zh'] = `
<p class="lead">从二叉搜索树（Binary Search Tree, BST）里删掉一个键：先像查找一样找到它，再按它有 0、1、2 个孩子分三种情况处理；有两个孩子时，请它的<strong>中序前驱</strong>或<strong>中序后继</strong>来顶替。</p>

<h2>从一个场景说起</h2>
<p>想象一张组织架构图，每个经理最多管两个直接下属。有人离职，图怎么改？</p>
<ul>
<li>手下没人：直接划掉。</li>
<li>只管一个人：让这个下属升上来，向原来的上级汇报。</li>
<li>管着两个人：上级那里只有一个位置，两个下属没法都顶上去，只能从下面调一个合适的人来坐这个位子。</li>
</ul>
<p>BST 删除就是这三种情况。只是 BST 多一条规矩：左边都比你小，右边都比你大。顶替的人坐上去后也得守这条规矩。把键从小到大排成一排，能做到的只有两个：被删者的左邻居和右邻居。</p>

<h2>它是什么</h2>
<p>简单说，<strong>BST 删除（deletion）= 先按查找的路线找到要删的结点 X，再按 X 有几个孩子分三种情况处理。</strong>第 3 种情况要用到前驱和后继，先讲它们。</p>

<h3>中序前驱与中序后继</h3>
<p>把所有键按中序遍历（in-order）排成一排，也就是从小到大：</p>
<ul>
<li>紧挨在 X 前面的叫<strong>中序前驱（in-order predecessor）</strong>：比 X 小的键里最大的。</li>
<li>紧挨在 X 后面的叫<strong>中序后继（in-order successor）</strong>：比 X 大的键里最小的。</li>
</ul>
<p>在树上找它们不用排序，记两句话：</p>
<ul>
<li><strong>前驱：先往左走一步，再一直往右走到头。</strong></li>
<li><strong>后继：先往右走一步，再一直往左走到头。</strong></li>
</ul>
<p>因为左子树全比 X 小，最大的在最右边；右子树全比 X 大，最小的在最左边。</p>
<div class="callout key" data-label="考点">
<p><strong>前驱 = 左子树中最右的结点，后继 = 右子树中最左的结点。</strong>既然是走到头才停，<strong>前驱没有右孩子，后继没有左孩子，都至多一个孩子</strong>。第 3 种情况就靠这一点。</p>
</div>

<h3>三种情况</h3>
<table>
<thead><tr><th>情况</th><th>做法</th></tr></thead>
<tbody>
<tr><td>1. X 是叶子（leaf）</td><td>父结点指向 X 的指针改成 NULL，释放 X</td></tr>
<tr><td>2. X 只有一个孩子</td><td>父结点改指这个孩子（孩子带着整棵子树上移一层），释放 X</td></tr>
<tr><td>3. X 有两个孩子</td><td>把前驱或后继的键复制到 X，再删掉前驱或后继原来的结点（属于情况 1 或 2）</td></tr>
</tbody>
</table>
<p>情况 3 为什么对？前驱、后继在中序里和 X 相邻，放到 X 的位置后，左边仍全比它小，右边仍全比它大。</p>

<h2>看个例子</h2>
<p>课上用一棵字母树，按字母序它就是 BST。把每个结点竖直投到底行，得到中序序列 F G J K M P Q S：</p>

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

<p>M 的前驱：往左到 J，再往右到 K，K 没有右孩子，停。后继：往右到 P，P 没有左孩子，后继就是 P 本身。</p>
<p>下面四次删除都从原树出发。</p>
<p><strong>删 G（情况 1）</strong>：查找 M → J → F → G。G 是叶子，F 的右指针改成 NULL，释放 G。</p>
<p><strong>删 P（情况 2）</strong>：P 只有右孩子 S。M 的右指针直接指向 S，释放 P。S 带着 Q 上移一层，仍在 M 右边，顺序不变。</p>
<p><strong>删 J（情况 3）</strong>：能不能把左孩子 F 直接提上来？不行，F 右边已经挂着 G，K 没地方放。课上用后继：往右到 K，K 没有左孩子，后继就是 K。把 K 复制到 J 的位置，再删掉原来的 K（叶子）。若改用前驱，就是 G 顶替 J。</p>
<p><strong>删 M（情况 3）</strong>：最复杂，两个孩子都不是叶子。用前驱 K：K 复制到根，原来的 K 是叶子，直接删。用后继 P：P 复制到根，原来的 P 只有右孩子 S，根的右指针改指 S（情况 2）。</p>
<pre><code class="lang-text">predecessor K        successor P
      K                      P
     / \\                   /   \\
    J   P                J       S
  /       \\            /  \\     /
F           S        F     K   Q
 \\         /          \\
  G       Q            G</code></pre>
<p><strong>两种都对。</strong>题目一般会指定；没指定时写明用的是哪种。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-bst-delete/anims/bst-delete.html" loading="lazy" style="height: 520px;" title="BST 删除的三种情况"></iframe>
<p class="anim-caption">选要删的键（删 J、M 时再选前驱或后继）逐步播放，看绿色的前驱或后继，和红色虚线断开、绿色新接上的指针。</p>

<h2>C 代码</h2>
<p>结点沿用 3.3 的 <code>node_t</code>（<code>key</code>、<code>left</code>、<code>right</code>），写法也沿用 3.3 插入的递归：返回删完后这棵子树的新根。</p>
<pre><code>node_t *bst_delete(node_t *t, int key) {
    if (t == NULL) return NULL;
    if (key &lt; t-&gt;key) {
        t-&gt;left = bst_delete(t-&gt;left, key);
    } else if (key &gt; t-&gt;key) {
        t-&gt;right = bst_delete(t-&gt;right, key);
    } else if (t-&gt;left == NULL || t-&gt;right == NULL) {
        node_t *child = (t-&gt;left != NULL) ? t-&gt;left : t-&gt;right;
        free(t);
        return child;
    } else {
        node_t *s = t-&gt;right;
        while (s-&gt;left != NULL) s = s-&gt;left;
        t-&gt;key = s-&gt;key;
        t-&gt;right = bst_delete(t-&gt;right, s-&gt;key);
    }
    return t;
}</code></pre>
<ul>
<li><strong>第 2 行</strong>：走到空指针还没找到，key 不在树里，返回 NULL。</li>
<li><strong>第 3–6 行</strong>：像查找一样往左或往右走。<code>t-&gt;left = ...</code> 让父结点接住子树的新根，“父结点改指孩子”就是这样完成的，不需要 parent 指针。</li>
<li><strong>第 7–10 行</strong>：情况 1、2 一起处理。child 是唯一的孩子，叶子时就是 NULL。释放 t，把 child 交给父结点。</li>
<li><strong>第 12–15 行</strong>：情况 3。s 从右孩子一直往左，找到后继；把它的键复制到 t；再去右子树删掉后继原来的结点。后继没有左孩子，这次递归一定落在情况 1 或 2。</li>
<li><strong>第 17 行</strong>：t 没被删，原样返回。</li>
</ul>
<p>调用写 <code>root = bst_delete(root, key);</code>，因为根也可能被删。改用前驱：第 12–15 行换成从左孩子一直往右，在左子树里删、由 <code>t-&gt;left</code> 接住。</p>
<div class="callout warn" data-label="易错">
<p>先取出孩子指针，再 <code>free(t)</code>。释放后再读 <code>t-&gt;left</code> 是未定义行为。</p>
</div>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/gcULXE7ViZw" title="Delete a node from Binary Search Tree" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：mycodeschool《Delete a node from Binary Search Tree》（英文）。先用图讲三种情况，再写和上面结构相同的递归代码。视频用 C++ 的 delete 释放结点，C 里换成 free。</p>

<h2>代价与 AVL 树的删除</h2>
<p>从根找到 X，情况 3 再往下找后继，每段都不超过树高 h，所以<strong>删除是 O(h)</strong>，和查找、插入一样：一般 BST <strong>最坏 O(n)</strong>（退化成链，见 3.3）；AVL 树高度 &lt; 1.44 log₂ n，<strong>最坏 O(log n)</strong>。</p>
<p>AVL 树（见 3.5、3.6）的删除 = <strong>BST 删除 + 从被摘掉的结点往上一直检查到根</strong>：每个祖先更新高度、算 BF = h(左) − h(右)，遇到 ±2 就旋转，然后<strong>继续往上</strong>。</p>
<p>和插入不同：删除让子树变矮，旋转修好一处后它可能仍矮 1，上面又会失衡，所以<strong>一次删除可能旋转好几次</strong>，总代价仍是 O(log n)。例：删除叶子 12。</p>
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
<li>回到 11：左高 2，右高 0，BF(11) = <strong>+2</strong>；左孩子 10 的 BF = +1，是 LL，在 11 处右旋。这棵子树高 2，比原来矮 1。</li>
<li>回到 8：左高 4，右高 2，BF(8) = <strong>+2</strong>；左孩子 5 的 BF = +1，又是 LL，在 8 处右旋，5 成为根，树高从 5 降为 4。</li>
</ol>
<pre><code class="lang-text">            5
         /       \\
      3              8
     /  \\         /     \\
   2     4     6           10
  /              \\        /  \\
1                 7     9     11</code></pre>

<h2>考试怎么考</h2>
<ul>
<li><strong>画图题</strong>：依次删除几个键，画出每一步，通常规定用前驱还是后继。</li>
<li><strong>识别题</strong>：某结点的前驱、后继是谁，删它属于哪种情况。</li>
<li><strong>代码题</strong>：写 BST 删除，或改成用前驱。</li>
<li><strong>复杂度</strong>：BST 删除最坏 O(n)，AVL 删除 O(log n)。</li>
</ul>
<p>前驱、后继的找法和三种情况都要背，公式表上没有。</p>

<h3>例题 1：依次删除</h3>
<p>对下面的 BST 依次删除 30（用后继）、50（用前驱）、60，画出结果。</p>
<pre><code class="lang-text">               50
         /          \\
   30                   70
  /   \\              /    \\
20       40       60       80
        /  \\        \\
      35    45       65</code></pre>
<p><strong>删 30</strong>：两个孩子。后继：往右到 40，再往左到 35，是叶子。35 复制到 30 的位置，删掉原来的 35。</p>
<p><strong>删 50</strong>：两个孩子。前驱：往左到 35（刚换上去的），再一直往右 35 → 40 → 45，是叶子。45 复制到根，删掉原来的 45。</p>
<p><strong>删 60</strong>：只有右孩子 65，属于情况 2。70 的左指针改指 65。最终：</p>
<pre><code class="lang-text">         45
      /     \\
   35          70
  /  \\        /  \\
20    40    65    80</code></pre>
<p>检查：中序 20 35 40 45 65 70 80，有序。</p>

<h3>例题 2：找前驱和后继</h3>
<p>在课上的字母树中，写出 J、P、G 的前驱和后继。</p>
<p>J 两边都有子树，直接套用：前驱 G（F → G），后继 K。</p>
<p>P、G 没有左子树，前驱就在祖先里：<strong>往上走，第一次从右孩子走上去到达的父结点就是前驱</strong>。没有右子树时找后继反过来：第一次从左孩子走上去到达的父结点。</p>
<ul>
<li><strong>P</strong>：P 是 M 的右孩子，前驱是 <strong>M</strong>；后继照常找，S → Q，是 <strong>Q</strong>。</li>
<li><strong>G</strong>：G 是 F 的右孩子，前驱是 <strong>F</strong>。后继：G 是右孩子，继续往上；F 是 J 的左孩子，后继是 <strong>J</strong>。</li>
</ul>
<p>对照中序 F G J K M P Q S，都是左右邻居。删除时用不到往上找：情况 3 的结点两边都有子树。</p>

<div class="callout warn" data-label="易错">
<ul>
<li>把左孩子当前驱、右孩子当后继。M 的左孩子是 J，前驱却是 K。</li>
<li>复制了键却忘了删原来的前驱或后继，出现重复键。</li>
<li>删 M 用后继 P 时，把 P 的右子树 S、Q 一起丢了。</li>
<li>AVL 删除旋转一次就停，没有继续往上检查。</li>
<li>题目若规定用完整中序遍历找前驱、后继（2016 年期末），每次是 O(n)。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>删除 = 先查找，再分三种情况：叶子直接删；一个孩子让孩子顶上；两个孩子复制前驱或后继的键，再删原来那个结点。</li>
<li>前驱 = 左子树最右，后继 = 右子树最左，都至多一个孩子。用哪个都对，按题目要求。</li>
<li>C 写法：递归返回新根，由父结点接住；先取孩子再 free。</li>
<li>代价 O(h)：一般 BST 最坏 O(n)，AVL 树 O(log n)；AVL 删除要一路查到根，可能旋转好几次。</li>
</ul>
`;

/* Post body — dsa-bst / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-bst:zh'] = `
<p class="lead">二叉搜索树（Binary Search Tree, BST）是一棵“左边小、右边大”的二叉树：查找和插入都只沿一条路往下走，快慢全看树有多高，而插入顺序不好时它会退化成链表。</p>

<h2>从猜数字说起</h2>
<p>朋友心里想一个 1 到 100 之间的数，你每猜一次，他只说“大了”或“小了”。聪明的猜法是先猜 50，他说“大了”就只剩 1–49，再猜 25……每次排除一半，最多 7 次必中。</p>
<p>这就是二分查找（binary search），但它要求有序数组（sorted array），而往有序数组中间插一个数，后面的元素都得挪一格，O(n)。链表（linked list）插入快，查找却只能从头数，O(n)。</p>
<p>二叉搜索树两样都要：把“先看中间，再去左半边或右半边”提前用指针搭好。查找像猜数字；插入时找到空位挂上去，谁都不用挪。</p>

<h2>二叉搜索树是什么</h2>
<p>简单说，二叉搜索树就是<strong>每个结点都满足“左边都比我小，右边都比我大”</strong>的二叉树（binary tree）。它由三部分组成：</p>
<ul>
<li><strong>结点（node）</strong>：一个键（key）加 <code>left</code>、<code>right</code> 两根指针，和 3.1 的二叉树结点一样。</li>
<li><strong>BST 性质（BST property）</strong>：对每个结点 x，<strong>左子树（left subtree）里所有键都比 x 小，右子树（right subtree）里所有键都比 x 大</strong>。本课默认键不重复。</li>
<li><strong>两个操作</strong>：查找（find / search）和插入（insert），都是“小往左、大往右”。</li>
</ul>
<p>性质管的是<strong>整棵子树</strong>，不只是两个孩子。下面这棵树每对父子都“左小右大”，但 35 在 30 的左子树里却比 30 大，所以<strong>不是 BST</strong>：</p>
<pre><code class="lang-text">      30
     /  \\
   20    40
  /  \\     \\
10    35    50</code></pre>
<p>在它上面找 35：35 &gt; 30 往右，35 &lt; 40 往左，空了，报告“不存在”，可 35 明明在树里。它的中序是 10 20 35 30 40 50，不升序；而 <strong>BST 的中序遍历（in-order）一定是升序</strong>（见 3.2）。没有顺序的普通二叉树，查找只能全看一遍，O(n)。</p>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/pYT9F8_LFTM" title="Data structures: Binary Search Tree" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：mycodeschool《Data structures: Binary Search Tree》（英文，约 19 分钟），比较数组、链表和 BST 的代价，再画图讲查找和插入。视频里的 O(log n) 指树平衡时；本课问“BST 查找”答 O(n)。</p>

<h2>看个例子：课上那棵树</h2>
<p>课上从空树依次插入 32, 14, 53, 9, 28, 42, 64, 50，得到下面这棵树。</p>

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
<figcaption>橙色是查找 50 走的路；蓝色数字是找到该结点要比较几次；绿色虚线是插入 17 的位置，红色虚线是查找 51 失败的地方。</figcaption>
</figure>

<h3>查找 50 和 51</h3>
<ol>
<li>和根 32 比：50 &gt; 32，往右。左边 14 那整棵子树都不用看了。</li>
<li>和 53 比：50 &lt; 53，往左。</li>
<li>和 42 比：50 &gt; 42，往右。</li>
<li>和 50 比：相等，找到。一共 <strong>4 次</strong>。</li>
</ol>
<p>找不存在的 51：前三步一样，到了 50，51 &gt; 50 该往右，可 50 的右边是空指针（NULL），说明 51 不在树里。经过的还是这 4 个结点，也是 <strong>4 次</strong>。</p>

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
<p>课上的数法：<strong>每访问一个结点算 1 次比较，走到 NULL 不算</strong>（代码里判断了 == 和 &lt; 也只记 1 次）。找到 k 的次数 = 根到 k 路上的结点数 = <strong>深度（depth）+ 1</strong>，本课根的 depth 为 0；找不到时数到最后一个非空结点。</p>
<p>一次查找最多比较 h 次，h 是<strong>树高（height）</strong>，本课约定空树高 0、叶子高 1。上图树高 4，最深的 50 正好要 4 次。所以<strong>查找是 O(h)</strong>。</p>
</div>

<h3>插入 17</h3>
<p>插入 = 先查找，再挂上去。17 &lt; 32 往左；17 &gt; 14 往右；17 &lt; 28 往左，28 的左边是空的，就把 17 挂在这里（图中绿色虚线）。</p>
<p>新结点<strong>永远是一片叶子（leaf）</strong>，旧结点一个不动，只改了 28 的 <code>left</code> 一根指针。所以<strong>插入 = O(h) 找空位 + O(1) 挂结点 = O(h)</strong>。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-bst/anims/bst-insert.html" loading="lazy" style="height: 540px;" title="BST 插入与退化"></iframe>
<p class="anim-caption">先看“课上顺序”：蓝色是每次插入走的路，橙色是新结点，最后一帧绿色是最慢的查找。再点“升序”对比。</p>

<h2>插入顺序决定形状：退化成链表</h2>
<p>同样是 9, 14, 28, 32, 42, 53, 64 这 7 个键：</p>
<ul>
<li>按 <strong>32, 14, 53, 9, 28, 42, 64</strong> 插入：先来的总是“中间那个”，得到满二叉树（perfect binary tree），高 3，查找最多 3 次。</li>
<li>按<strong>升序</strong>插入：新键总比树里所有键大，只能一路往右挂，变成一条高 7 的链，其实就是链表，找 64 要比较 7 次。降序则得到向左的链。</li>
</ul>
<p>所以 n 个结点的 BST，最矮 ⌈log₂(n+1)⌉ 层，最高 n 层。升序插入 n 个键时，第 i 个键要和前面 i − 1 个结点逐个比较，总共 0 + 1 + … + (n − 1) = <strong>n(n − 1)/2 次，O(n²)</strong>。</p>

<div class="callout key" data-label="考点">
<p><strong>问“在 BST 中查找的时间复杂度”，答 O(n)。</strong>题目没保证形状，就按退化成链的最坏情况算；第 4 周课上小测多数人选了 O(log n)，错了。只有树<strong>平衡（balanced）</strong>，即本课定义的“查找能在 O(log n) 内完成”时，才是 O(log n)。最好情况是找的就是根，Θ(1)。</p>
</div>

<h3>只看根平衡不够</h3>
<p>依次插入 32, 28, 42, 17, 50, 14, 53, 9, 64（动画里的“两条长链”）：根左边是链 28 → 17 → 14 → 9，右边是链 42 → 50 → 53 → 64。根两边都高 4，看根很平衡，可树高约 n/2，查找仍是 O(n)。平衡要对<strong>每个结点</strong>成立，这就是 3.5 的 AVL 条件。</p>

<h3>拿 BST 当字典用</h3>
<p>先插入 n 个键建字典，再做 m 次查找：</p>
<table>
<thead><tr><th>情况</th><th>建树（n 次插入）</th><th>m 次查找</th><th>合计</th></tr></thead>
<tbody>
<tr><td>平均（随机顺序，树较平衡）</td><td>O(n log n)</td><td>O(m log n)</td><td><strong>O(n log n + m log n)</strong></td></tr>
<tr><td>最坏（有序输入，退化成链）</td><td>O(n²)</td><td>O(nm)</td><td><strong>O(n² + nm)</strong></td></tr>
</tbody>
</table>
<p>要稳定拿到第一行，就得用自动保持平衡的树：AVL 树（3.6）和 2-3 树（3.7）。删除见 3.4。</p>

<h2>C 代码：查找和插入</h2>
<pre><code>typedef struct node { int key; struct node *left, *right; } node_t;

node_t *bst_find(node_t *t, int key) {
    while (t != NULL &amp;&amp; key != t-&gt;key)
        t = (key &lt; t-&gt;key) ? t-&gt;left : t-&gt;right;
    return t;                        /* 找不到时是 NULL */
}

node_t *bst_insert(node_t *t, int key) {
    if (t == NULL) {                 /* 走到空位：造一片新叶子 */
        t = malloc(sizeof(*t));
        assert(t != NULL);
        t-&gt;key = key;
        t-&gt;left = t-&gt;right = NULL;
    } else if (key &lt; t-&gt;key) {
        t-&gt;left = bst_insert(t-&gt;left, key);
    } else if (key &gt; t-&gt;key) {
        t-&gt;right = bst_insert(t-&gt;right, key);
    }                                /* 相等：已经有了，不插 */
    return t;                        /* 返回这棵子树的根 */
}</code></pre>
<ul>
<li><code>bst_find</code>：没走到空、也没找到，就继续；比当前小往左，否则往右。结束时 <code>t</code> 是找到的结点或 NULL。</li>
<li><code>bst_insert</code> 第一个分支：走到空位，<code>malloc</code> 一个结点，孩子设成 NULL，它就是新叶子。</li>
<li>中间两个分支：插进左（右）子树，再把子树的根写回 <code>t-&gt;left</code>（<code>t-&gt;right</code>）。只有最底下那次真的改了指针，其余层写回原值。键相等时什么也不做。</li>
<li><code>return t</code> 返回子树的根，所以调用时<strong>必须接住</strong>：<code>root = bst_insert(root, key);</code>，否则空树插入的第一个结点就丢了。</li>
</ul>
<div class="callout note" data-label="提示">
<p>用循环写插入，要多一个 <code>parent</code> 指针记住上一个结点，走到 NULL 后才挂得上去。释放整棵树用后序（post-order）：先释放两棵子树，再释放自己。</p>
</div>

<h2>考试怎么考</h2>
<ul>
<li><strong>填空</strong>：给一棵 BST，数找某个键（可能不存在）要比较几次。</li>
<li><strong>手算</strong>：给插入序列，从空树画出 BST，再问树高、中序遍历或比较次数。</li>
<li><strong>选择题</strong>：BST 查找、插入最坏 O(n)，平衡时 O(log n)；有序输入建树 O(n²)。</li>
<li><strong>写代码</strong>：BST 插入、查找，或在它上面的小函数（数结点、找最小键等）。</li>
</ul>
<p>公式表只给等差数列求和（算 n(n − 1)/2 用）；数比较次数的规则、depth / height 约定和复杂度都要自己记。</p>

<h3>例题 1：画树、求高、数比较</h3>
<p>从空树依次插入 45, 20, 70, 10, 30, 60, 90, 25, 65, 62。画出 BST，求树高（叶子高 1），以及查找 62、查找 27 各比较几次。</p>
<p><strong>画树</strong>：前 7 个键刚好填满三层（45 当根，20、70 是它的孩子，10、30、60、90 是孙子）。25 比较 45、20、30 后挂 30 左边；65 比较 45、70、60 后挂 60 右边；62 比较 45、70、60、65 后挂 65 左边。</p>
<pre><code class="lang-text">          45
        /    \\
      20      70
     /  \\    /  \\
   10   30  60   90
        /     \\
      25       65
              /
            62</code></pre>
<p><strong>树高</strong>：最长的根到叶路径 45 → 70 → 60 → 65 → 62 有 5 个结点，树高 <strong>5</strong>。</p>
<p><strong>找 62</strong>：经过 45, 70, 60, 65, 62，<strong>5 次</strong>。</p>
<p><strong>找 27</strong>：27 &lt; 45 往左，27 &gt; 20 往右，27 &lt; 30 往左，27 &gt; 25 该往右，但 25 右边是空的，所以不存在。比较了 45、20、30、25，<strong>4 次</strong>。最后的 25 也要算：不和它比，就不知道该往哪边走。</p>

<h3>例题 2：多选</h3>
<p>n 个结点的 BST（n 很大），哪些一定正确？A. 查找最坏 O(log n)；B. 查找最坏 O(n)；C. 根的左右子树高度差 ≤ 1 时，查找是 O(log n)；D. 把 1, 2, …, n 依次插入空 BST，共比较 n(n − 1)/2 次；E. 中序遍历按升序输出。</p>
<p><strong>答案：B、D、E。</strong></p>
<ul>
<li>A 错、B 对：有序输入得到一条链，最坏要走 n 个结点。</li>
<li>C 错：根下挂两条等长的链，根处高度差为 0，树高仍约 n/2。</li>
<li>D 对：插第 i 个键时树是 1 → … → i − 1 的右链，比较 i − 1 次，求和得 n(n − 1)/2。</li>
<li>E 对：BST 性质直接保证。</li>
</ul>

<div class="callout warn" data-label="易错">
<ul>
<li>看到“BST 查找”就选 O(log n)。没说平衡，就是 O(n)。</li>
<li>只检查父子大小，没检查整棵子树；以为根两边一样高就算平衡。</li>
<li>找不到时少数最后那个非空结点；递归插入后忘了写 <code>root = …</code>。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>BST 性质管整棵子树：左边全小，右边全大。中序遍历 = 升序。</li>
<li>比较次数 = 经过的结点数，找不到时数到最后一个非空结点。</li>
<li>插入 = 查找空位 + 挂一片新叶子，只改一根指针。</li>
<li>查找、插入都是 O(h)；有序输入让树退化成链，h = n。</li>
<li>“BST 查找的复杂度”答 O(n)；平衡时才是 O(log n)，而平衡要看每个结点。</li>
</ul>
`;

/* Post body — dsa-avl-condition / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-avl-condition:zh'] = `
<p class="lead">AVL 树是每个结点的左右子树高度最多差 1 的 BST：用平衡因子逐个结点检查，插入后修最低的那个失衡结点，树高就始终是 O(log n)。</p>

<h2>从一个场景说起</h2>
<p>假设选课系统用 BST 按学号存学生。学号按报到顺序发，一个比一个大，每个新学号只能挂在最右边，几千个学生插完，树成了一条链（见 3.3），查一个学号要从头比到尾，O(n)。</p>
<p>毛病在树太高。查找、插入、删除都是从根往下走一条路，代价都是 <strong>O(树高)</strong>。同样是 1…7，按 4, 2, 6, 1, 3, 5, 7 插入树高 3，按 1, 2, …, 7 插入树高 7。</p>
<p>所以要让树一直“矮”。课上给了两个说法：</p>
<ul>
<li><strong>平衡（balanced）</strong>：任何一项都能在 <strong>O(log n)</strong> 内找到，也就是树高是 O(log n)。</li>
<li><strong>完美平衡（perfectly balanced）</strong>：平衡，而且是<strong>完全二叉树（complete binary tree）</strong>（见 3.1）。</li>
</ul>
<p>完美平衡最矮，可是维护太贵。完全二叉树 1…7 插入 8 后若还要完全，8 个结点的形状是定死的，键又必须按中序（in-order）从小到大排：</p>
<pre><code class="lang-text">before: complete          after inserting 8: still complete
        4                          5
      /   \\                      /   \\
     2     6                    3     7
    / \\   / \\                  / \\   / \\
   1   3 5   7                2   4 6   8
                             /
                            1</code></pre>
<p>7 个旧位置上的键全换了，一次插入要动 O(n) 个结点，违反了课上的原则：<strong>为维持平衡，每次插入最多付 O(log n)</strong>。所以退一步：形状可以有点歪，只要树高还是 O(log n)。AVL 条件就是这样一个“松一点”的要求。</p>

<h2>AVL 条件是什么</h2>
<p>简单说，<strong>AVL 树（AVL tree）</strong>就是一棵 BST，而且它的<strong>每一个结点</strong>，左子树和右子树的高度最多差 1。名字取自两位发明者 Adelson-Velsky 和 Landis。</p>
<p>这句话拆开是三样东西：</p>
<ul>
<li><strong>高度（height）</strong>：本课约定空树 height(NULL) = 0，叶子高 1，其他结点高 = 1 + max(左子树高, 右子树高)。</li>
<li><strong>平衡因子（balance factor, BF）</strong>：BF = 左子树高 − 右子树高。</li>
<li><strong>AVL 条件</strong>：每个结点的 BF 只能是 −1、0、+1。出现 +2 或 −2，这个结点就<strong>失衡（unbalanced）</strong>了。</li>
</ul>
<p>可以把每个结点想成一块跷跷板：BF 为正是左边沉，为负是右边沉。AVL 允许每块跷跷板歪一格，不允许歪两格。叶子两边都是空树，BF 永远是 0。</p>

<h3>为什么要“每一个”结点</h3>
<p>只要求根的左右子树差不超过 1 行不行？课上的反例是在根两边各挂一条链：</p>
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
<figcaption>结点旁的数字是 BF。根的左右子树一样高，BF 为 0；3 和 5 却是 +2 和 −2。</figcaption>
</figure>
<p>根的左右子树都高 3，BF 为 0，看上去很平。往下一层就露馅了：3 的左边挂着 2 → 1，右边是空的，BF = +2；5 正好相反，−2。n 个结点这样分成两条链，树高约 n/2，查找还是 <strong>O(n)</strong>。</p>
<div class="callout key" data-label="考点">
<p><strong>AVL 条件：对每一个结点 x，|height(x 的左子树) − height(x 的右子树)| ≤ 1。</strong>BF 为 +2 是左边太重，−2 是右边太重。只看根不够。</p>
</div>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/DB1HFCEdLxA" title="AVL trees in 5 minutes — Intro &amp; Search" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Michael Sambol《AVL trees in 5 minutes — Intro &amp; Search》（英文，约 5 分钟），讲定义和查找；配套代码同样是叶子高 1、BF = 左高 − 右高。</p>

<h2>看个例子</h2>
<h3>给树 A 的每个结点算 BF</h3>
<p>课上的例子：从空树依次插入 50, 30, 70, 20, 40, 80, 35，得到树 A。一个结点的高度要等两个孩子都算完才知道，所以从下往上算，顺序就是<strong>后序（post-order）</strong>。</p>
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
<figcaption>树 A。结点左边是高度 h，右边是 BF。</figcaption>
</figure>
<ol>
<li>叶子 20、35、80：两边都是空树，高 1，BF 0。</li>
<li>40：左孩子 35 高 1，右边空（高 0）。40 高 2，BF = 1 − 0 = +1。</li>
<li>30：左边 20 高 1，右边 40 高 2。30 高 3，BF = 1 − 2 = −1。</li>
<li>70：左边空，右边 80 高 1。70 高 2，BF = 0 − 1 = −1。</li>
<li>根 50：左边 30 高 3，右边 70 高 2。50 高 4，BF = 3 − 2 = +1。</li>
</ol>
<p>七个 BF 都在 −1…+1 之间，<strong>树 A 是 AVL 树</strong>。</p>
<p>树 A 不是完全二叉树（70 缺左孩子），可见 <strong>AVL 不要求完全</strong>。反过来，完全二叉树里每个结点的左子树要么和右子树一样高、要么高 1，所以<strong>完全的 BST 一定是 AVL 树</strong>。</p>

<h3>插入 37：谁先失衡</h3>
<p>AVL 树的每个结点都多存一个 <code>height</code> 字段，BF 随时 O(1) 可得。插入一个键分三步：</p>
<ol>
<li>像普通 BST 一样往下找空位，挂上新叶子（高 1）。</li>
<li>沿刚才走过的路<strong>往回走向根</strong>，逐个更新高度、算 BF。</li>
<li>遇到的<strong>第一个 |BF| = 2 的结点</strong>，就在那里做旋转（rotation）修好，怎么转见 3.6。</li>
</ol>
<p>往树 A 插入 37。往下：37 &lt; 50 往左，37 &gt; 30 往右，37 &lt; 40 往左，37 &gt; 35 往右，挂成 35 的右孩子。往回：</p>
<ul>
<li>35：高度 1 → 2，BF = 0 − 1 = −1，合格。</li>
<li>40：左边 35 现在高 2，右边空，高度 2 → 3，BF = 2 − 0 = <strong>+2</strong>。这就是<strong>第一个失衡结点</strong>。</li>
<li>先不修、继续往上看：30 的 BF = 1 − 3 = −2，根 50 的 BF = 4 − 2 = +2，也都失衡了。</li>
</ul>
<p>但要修的只有最低的 40。在 40 旋转之后，这棵子树的高度回到插入前的 2，30 和 50 自动变回 −1 和 +1。</p>
<p>只看这一条路就够：新结点只会让它的祖先变高，别处不变；高度一次最多加 1，所以 BF 最多到 ±2。往回走时某个结点高度没变，上面的就都不会变，可以提前停。</p>
<div class="callout key" data-label="考点">
<p><strong>第一个失衡结点 = 从新结点往根走，遇到的第一个 |BF| = 2 的结点</strong>，也就是最低的那个。这时根可能也是 ±2（插入 37），也可能是 0（插入 90 时只有 70 失衡）。</p>
</div>
<iframe class="anim-frame" src="blog/blog_data/dsa-avl-condition/anims/avl-check.html" loading="lazy" style="height: 520px;" title="检查 AVL 条件与插入后的第一个失衡结点"></iframe>
<p class="anim-caption">先点“树 A”看逐个算 BF，再点“插入 37”：红色是第一个失衡结点，黄色是更上面的 ±2。“插入 10”是高度不变提前停，“插入 90”时根的 BF 为 0。</p>

<h2>补充：用 C 检查 AVL 条件</h2>
<p>把“算高度”和“查 BF”放进同一次后序遍历：函数返回子树高度，一旦发现失衡就返回 −1，让 −1 一路传到根。</p>
<pre><code>typedef struct node { int key; struct node *left, *right; } node_t;

/* 返回 t 的高度；子树里只要有一个结点失衡，就返回 -1 */
int avl_height(node_t *t) {
    if (t == NULL) return 0;
    int hl = avl_height(t-&gt;left);
    int hr = avl_height(t-&gt;right);
    if (hl &lt; 0 || hr &lt; 0) return -1;
    if (hl - hr &gt; 1 || hr - hl &gt; 1) return -1;
    return 1 + (hl &gt; hr ? hl : hr);
}

int is_avl(node_t *t) { return avl_height(t) &gt;= 0; }</code></pre>
<ul>
<li><code>t == NULL</code> 返回 0：空树高 0，本课约定。</li>
<li>先递归拿到左右子树的高度 <code>hl</code>、<code>hr</code>，再处理自己，这就是后序。</li>
<li>任何一边是 −1，说明下面已有失衡结点，把 −1 往上传；本结点两边差超过 1，也返回 −1。</li>
<li>都合格就返回自己的高度 1 + max(hl, hr)。<code>is_avl</code> 只看结果是不是 −1。</li>
</ul>
<p>每个结点只访问一次，<strong>O(n)</strong>；若在每个结点上各调一次求高度函数，子树会被反复算，要 O(n·h)。BST 性质（中序升序，见 3.2）要另外查。</p>

<h2>补充：为什么树高是 O(log n)</h2>
<p>反过来问：高为 h 的 AVL 树<strong>最少</strong>有几个结点？记为 N(h)。最省的做法是每个结点都偏到极限：一棵子树高 h − 1，另一棵只高 h − 2。于是 N(1) = 1，N(2) = 2，<strong>N(h) = N(h − 1) + N(h − 2) + 1</strong>。</p>
<table>
<thead><tr><th>树高 h</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>10</th></tr></thead>
<tbody>
<tr><td>AVL 树最少结点 N(h)</td><td>1</td><td>2</td><td>4</td><td>7</td><td>12</td><td>20</td><td>143</td></tr>
<tr><td>二叉树最多结点 2<sup>h</sup> − 1</td><td>1</td><td>3</td><td>7</td><td>15</td><td>31</td><td>63</td><td>1023</td></tr>
</tbody>
</table>
<p>N(h) 比 2·N(h − 2) 还大，所以<strong>每多两层，最少结点数至少翻一倍</strong>，h 最多约 2·log₂ n。算得更细，N(h) 像斐波那契数（见 1.2）一样增长，结论是 <strong>AVL 树高不超过约 1.44·log₂ n</strong>，比最矮的二叉树最多高 44% 左右。</p>
<table>
<thead><tr><th>最坏情况</th><th>普通 BST</th><th>AVL 树</th></tr></thead>
<tbody>
<tr><td>查找</td><td>O(n)</td><td>O(log n)</td></tr>
<tr><td>插入</td><td>O(n)</td><td>O(log n)，至多一次单旋转或双旋转</td></tr>
<tr><td>删除</td><td>O(n)</td><td>O(log n)，可能沿路径多次旋转（见 3.4）</td></tr>
</tbody>
</table>
<p>好处是不怕有序输入；代价是每个结点多存一个高度，插入、删除都要沿路径更新高度、算 BF，旋转代码也容易写错。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>选择题</strong>：AVL 条件、BF 的定义、平衡与完美平衡、复杂度、1.44·log₂ n。</li>
<li><strong>手算</strong>：标出每个结点的高度和 BF，判断是不是 AVL 树；或插入一个键，问第一个失衡结点（同插入 37），再判断 LL、RR、LR、RL 并旋转（见 3.6）。</li>
<li><strong>写代码</strong>：求树高或检查 AVL 条件，空树返回 0。</li>
</ul>
<p>公式表上没有这些，要自己记：BF = 左高 − 右高，±2 失衡；height(NULL) = 0、叶子 1；AVL 树高约 1.44·log₂ n。</p>

<h3>例题 1：是不是 AVL 树</h3>
<p>下面这棵 BST 是 AVL 树吗？</p>
<pre><code class="lang-text">              40
           /      \\
         20        60
        /  \\      /  \\
      10    30   50   70
     /     /            \\
    5     25             80
   /
  2</code></pre>
<p>从下往上（后序）逐个算：</p>
<ol>
<li>2：叶子，高 1，BF 0。</li>
<li>5：左边 2 高 1，右边空。5 高 2，BF +1。</li>
<li>10：左边 5 高 2，右边空。10 高 3，BF = 2 − 0 = <strong>+2，失衡</strong>。</li>
<li>25 高 1；30 高 2，BF +1；20：左 3、右 2，高 4，BF +1。</li>
<li>50、80 高 1；70 高 2，BF −1；60：左 1、右 2，高 3，BF −1。</li>
<li>根 40：左 4、右 3，高 5，BF +1。</li>
</ol>
<p>结点 10 违反 AVL 条件，所以<strong>不是 AVL 树</strong>。根和它的两个孩子都合格，问题藏在第三层。</p>

<h3>例题 2：只看根的选择题</h3>
<p>课上小测出过两次：一棵 BST 的根，左子树高 4、右子树高 3（本课约定）。哪项必然正确？A. 它是 AVL 树；B. 根满足 AVL 条件，但其他结点不一定满足；C. 它不是 AVL 树；D. 树高为 4。</p>
<p><strong>答案：B。</strong>根的 BF = 4 − 3 = +1，合格，但这只说明根。</p>
<ul>
<li>A 不一定：例题 1 的树正好是左高 4、右高 3，可 10 是 +2。</li>
<li>C 也不一定：在例题 1 的树里给 10 加一个右孩子 15，10 变成 +1，20 仍是 +1，所有 BF 都合格，左右子树还是高 4 和 3，这就是一棵 AVL 树。</li>
<li>D 错：树高 = 1 + max(4, 3) = 5。</li>
</ul>

<div class="callout warn" data-label="易错">
<ul>
<li>只检查根：两条链那棵树的根 BF 为 0，照样不是 AVL 树。</li>
<li>AVL 树不必是完全二叉树；完全的 BST 一定满足 AVL 条件。</li>
<li>本课叶子高 1。有的教材叶子记 0，BF 不变，但树高和 N(h) 表要错开一位。</li>
<li>插入后要修的是最低的失衡结点，不是根。</li>
<li>AVL 树首先是 BST：键不按大小排，BF 再好也不算。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>平衡 = 树高 O(log n)；完美平衡 = 完全二叉树，维护太贵。</li>
<li>BF = 左子树高 − 右子树高，空树高 0、叶子高 1。</li>
<li>AVL 条件管<strong>每一个结点</strong>：BF 只能是 −1、0、+1，±2 就是失衡。</li>
<li>判断按后序从下往上算；插入后沿路径往回，修第一个（最低的）|BF| = 2 的结点。</li>
<li>AVL 树高不超过约 1.44·log₂ n，查找、插入、删除最坏都是 O(log n)。</li>
</ul>
`;

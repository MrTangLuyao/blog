/* Post body — dsa-tree-traversals / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-tree-traversals:zh'] = `
<p class="lead">遍历（traversal）就是按固定规则把二叉树的每个结点访问恰好一次。前序、中序、后序三种走法，差别只在“什么时候处理当前结点”。</p>

<h2>从一个场景说起</h2>
<p>数组要看每个元素，一个 for 循环从头走到尾；链表就顺着 <code>next</code> 一个个走。树就麻烦了：每个结点分出两条路，往左走了，右边谁来管？</p>
<p>想想电脑里的文件夹。删一个文件夹，得先把里面的东西删光，最后才删它自己；打印目录则反过来，先写文件夹名，再列里面的内容。走的是同一棵树，区别只是“自己”排在前面还是后面。</p>
<p>普通二叉树（binary tree）的键没有顺序，找一个键只能每个结点都看一遍（<strong>O(n)</strong>），所以需要一种每个结点都走到、又不重复的走法。</p>

<h2>遍历是什么</h2>
<p>简单说，遍历就是<strong>把树里每个结点都访问（visit）恰好一次</strong>。“访问”就是对结点做的那件事，比如打印它的键。</p>
<p>办法是递归。任何一个结点都能拆成三部分：</p>
<ul>
<li><strong>左子树（left subtree）</strong>：交给递归去走完；</li>
<li><strong>结点本身</strong>：visit 一次；</li>
<li><strong>右子树（right subtree）</strong>：也交给递归。</li>
</ul>
<p>永远<strong>先左后右</strong>，唯一能选的是“结点本身”排第几，于是有三种遍历：</p>
<table>
<thead><tr><th>名称</th><th>顺序</th><th>当前结点什么时候访问</th></tr></thead>
<tbody>
<tr><td>前序（pre-order）</td><td>根、左、右</td><td>一进来就访问，先于两棵子树</td></tr>
<tr><td>中序（in-order）</td><td>左、根、右</td><td>左子树做完、右子树开始前</td></tr>
<tr><td>后序（post-order）</td><td>左、右、根</td><td>两棵子树都做完之后</td></tr>
</tbody>
</table>
<p>这里的“根”指<strong>当前子树的根</strong>：递归到哪个结点，哪个就是根。对回文件夹：打印目录是前序，删文件夹是后序；中序是把自己夹在左右两半中间。</p>

<h3>代码只差一行</h3>
<pre><code>typedef struct node { char key; struct node *left, *right; } node_t;

void visit(node_t *t) { printf("%c ", t-&gt;key); }

void preorder(node_t *t) {
    if (t == NULL) return;
    visit(t);                 /* 根 */
    preorder(t-&gt;left);        /* 左 */
    preorder(t-&gt;right);       /* 右 */
}

void inorder(node_t *t) {
    if (t == NULL) return;
    inorder(t-&gt;left);         /* 左 */
    visit(t);                 /* 根 */
    inorder(t-&gt;right);        /* 右 */
}

void postorder(node_t *t) {
    if (t == NULL) return;
    postorder(t-&gt;left);       /* 左 */
    postorder(t-&gt;right);      /* 右 */
    visit(t);                 /* 根 */
}</code></pre>
<ul>
<li><code>if (t == NULL) return;</code>：基本情况（base case），空树什么也不做。课上的写法是<strong>进了函数再判断 NULL</strong>，所以空孩子上也会有一次调用。</li>
<li>两行递归调用：把左、右子树交给同一个函数，它返回时那整棵子树已经走完。</li>
<li>三个函数只差 <code>visit(t)</code> 放在哪一行。</li>
</ul>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/gm8DUJJhmY4" title="Binary tree traversal: Preorder, Inorder, Postorder" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：mycodeschool《Binary tree traversal: Preorder, Inorder, Postorder》（英文，约 14 分钟），先在图上演示三种顺序，再写出递归实现，定义和本课一样。</p>

<h2>看个例子：课上那棵树</h2>
<figure class="fig">
<svg viewBox="0 0 400 266" width="400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="课上的例子树：M 的孩子是 J 和 P；J 的孩子是 F 和 K；F 只有右孩子 G；P 只有右孩子 S；S 只有左孩子 Q；9 个空指针画成 ∅">
<g stroke="rgba(255,255,255,0.35)" stroke-width="2">
<line x1="200" y1="30" x2="110" y2="90"/><line x1="200" y1="30" x2="290" y2="90"/>
<line x1="110" y1="90" x2="60" y2="150"/><line x1="110" y1="90" x2="160" y2="150"/>
<line x1="60" y1="150" x2="100" y2="210"/><line x1="290" y1="90" x2="340" y2="150"/>
<line x1="340" y1="150" x2="300" y2="210"/>
</g>
<g stroke="rgba(255,255,255,0.22)" stroke-width="1.5" stroke-dasharray="3 3">
<line x1="60" y1="150" x2="38" y2="188"/><line x1="100" y1="210" x2="78" y2="248"/><line x1="100" y1="210" x2="122" y2="248"/>
<line x1="160" y1="150" x2="138" y2="188"/><line x1="160" y1="150" x2="182" y2="188"/><line x1="290" y1="90" x2="268" y2="128"/>
<line x1="300" y1="210" x2="278" y2="248"/><line x1="300" y1="210" x2="322" y2="248"/><line x1="340" y1="150" x2="362" y2="188"/>
</g>
<g fill="#2a2a29" stroke="#5a5a59" stroke-width="1.5">
<circle cx="38" cy="188" r="9"/><circle cx="78" cy="248" r="9"/><circle cx="122" cy="248" r="9"/>
<circle cx="138" cy="188" r="9"/><circle cx="182" cy="188" r="9"/><circle cx="268" cy="128" r="9"/>
<circle cx="278" cy="248" r="9"/><circle cx="322" cy="248" r="9"/><circle cx="362" cy="188" r="9"/>
</g>
<g fill="#a1a1a0" font-size="12" text-anchor="middle">
<text x="38" y="192">∅</text><text x="78" y="252">∅</text><text x="122" y="252">∅</text>
<text x="138" y="192">∅</text><text x="182" y="192">∅</text><text x="268" y="132">∅</text>
<text x="278" y="252">∅</text><text x="322" y="252">∅</text><text x="362" y="192">∅</text>
</g>
<g fill="#343433" stroke="#5a5a59" stroke-width="2">
<circle cx="200" cy="30" r="17"/><circle cx="110" cy="90" r="17"/><circle cx="290" cy="90" r="17"/>
<circle cx="60" cy="150" r="17"/><circle cx="160" cy="150" r="17"/><circle cx="340" cy="150" r="17"/>
<circle cx="100" cy="210" r="17"/><circle cx="300" cy="210" r="17"/>
</g>
<g fill="#e8e8e8" font-size="15" font-weight="700" text-anchor="middle">
<text x="200" y="35">M</text><text x="110" y="95">J</text><text x="290" y="95">P</text>
<text x="60" y="155">F</text><text x="160" y="155">K</text><text x="340" y="155">S</text>
<text x="100" y="215">G</text><text x="300" y="215">Q</text>
</g>
</svg>
<figcaption>课上的例子树（按字母顺序是一棵 BST）。灰色 ∅ 是空指针：8 个结点共有 9 个。</figcaption>
</figure>

<h3>中序：一步一步走</h3>
<ol>
<li>从根 M 出发。中序要先走完左子树，所以 M 先不输出，往左到 J；J 也有左子树，再往左到 F。</li>
<li>F 的左边是空的，左子树等于“已经走完”，<strong>输出 F</strong>。再走 F 的右子树：G 左右都空，<strong>输出 G</strong>。</li>
<li>F 这棵子树做完，回到 J，<strong>输出 J</strong>；再走 J 的右子树，K 是叶子，<strong>输出 K</strong>。</li>
<li>M 的左子树整个做完，回到根，<strong>输出 M</strong>。</li>
<li>右边同理：P 的左边是空的，<strong>输出 P</strong>；再去 S，S 有左孩子 Q，所以<strong>先 Q 后 S</strong>。</li>
</ol>
<p>结果：<strong>F G J K M P Q S</strong>。</p>

<h3>三种一起算：从下往上拼</h3>
<p>手算更稳的办法是从叶子往上拼：每棵子树的结果，就是按规则把“左子树的结果、根、右子树的结果”接起来。表中用 · 隔开三部分，− 表示空子树。</p>
<table>
<thead><tr><th>子树（左, 右）</th><th>前序：根 左 右</th><th>中序：左 根 右</th><th>后序：左 右 根</th></tr></thead>
<tbody>
<tr><td>G、K、Q（叶子）</td><td>自己</td><td>自己</td><td>自己</td></tr>
<tr><td>F（−, G）</td><td>F · G</td><td>F · G</td><td>G · F</td></tr>
<tr><td>S（Q, −）</td><td>S · Q</td><td>Q · S</td><td>Q · S</td></tr>
<tr><td>J（F, K）</td><td>J · F G · K</td><td>F G · J · K</td><td>G F · K · J</td></tr>
<tr><td>P（−, S）</td><td>P · S Q</td><td>P · Q S</td><td>Q S · P</td></tr>
<tr><td>M（J, P）</td><td><strong>M J F G K P S Q</strong></td><td><strong>F G J K M P Q S</strong></td><td><strong>G F K J Q S P M</strong></td></tr>
</tbody>
</table>
<p>写完检查两点：<strong>前序第一个、后序最后一个都是根</strong>；任何一棵子树在结果里都占连续的一段。注意后序的第一个是 G 不是 F：F 有右孩子 G，要等 G 输出完才轮到 F。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-tree-traversals/anims/traversal.html" loading="lazy" style="height: 520px;" title="二叉树的三种遍历"></iframe>
<p class="anim-caption">先选前序、中序或后序，再逐步播放：橙色是当前调用，橙色边连出调用栈，绿色是已输出的结点。∅ 上的调用也计数，最后停在 17 次。</p>

<h2>中序遍历 BST = 从小到大</h2>
<p>例子树的中序 F G J K M P Q S 正好是字母顺序，这不是巧合。BST 里每个结点左子树的键都比它小、右子树的都比它大，中序输出的正是“比我小的、我、比我大的”。每棵子树内部也这样排，所以整个序列从小到大。</p>
<div class="callout key" data-label="考点">
<p><strong>BST 的中序遍历 = 所有键从小到大排列。</strong>选择题问一棵大 BST 的中序，直接选排好序的选项，不用一步步走（第 5 周和第 12 周的课堂小测都出过）。</p>
<p>反过来也对：键互不相同时，中序结果升序 ⇔ 它是 BST。前序、后序没有这个性质。</p>
</div>

<h2>调用了几次：visit n 次，递归 2n + 1 次</h2>
<p>在例子树（n = 8）上数 <code>inorder</code>：visit 了 8 次，函数却被调用了 <strong>17 次</strong>（包括 <code>t == NULL</code> 的那些）。8 次落在真实结点上，另外 9 次落在图里的 9 个 ∅ 上，进去就返回。</p>
<p>一般为什么是 2n + 1？两种数法：</p>
<ul>
<li><strong>数谁发起调用</strong>：每个真实结点恰好发起 2 次调用（左、右各一次，孩子空不空都调），NULL 上的调用不再往下调。再加最外面对根的 1 次，共 <strong>2n + 1</strong>。</li>
<li><strong>数调用落在哪</strong>：n 个结点共 2n 个孩子指针，除了根每个结点恰好被一个指针指着，所以非空指针 n − 1 个，<strong>空指针 n + 1 个</strong>。调用次数 = n + (n + 1) = 2n + 1。</li>
</ul>
<p>前序、后序的次数一样，和树的形状无关；空树调用 1 次，公式照样成立。</p>
<div class="callout warn" data-label="易错">
<p>2n + 1 依赖“进了函数再判 NULL”的写法。如果调用前先判孩子（<code>if (t-&gt;left != NULL) inorder(t-&gt;left);</code>），非空树只调用 <strong>n</strong> 次。题目说“用课上的代码”时按 2n + 1 算。</p>
</div>
<p>每次调用只做常数工作，所以遍历是 <strong>Θ(n)</strong>。额外空间是调用栈，最深 height + 1 层（例子树高 4：M、J、F、G 再加一次 NULL 调用，共 5 层），即 <strong>O(h)</strong>：平衡时 O(log n)，退化成链时 O(n)。</p>

<h2>三种遍历各用在哪</h2>
<ul>
<li><strong>中序</strong>：按顺序输出 BST；BST 删除要找中序后继（见 3.4 BST 删除）。</li>
<li><strong>前序</strong>：先处理自己再往深处走，就是深度优先搜索（DFS）的走法（见 7.3 DFS）。</li>
<li><strong>后序</strong>：要先拿到孩子的结果才能处理自己的，比如 3.1 的求高度、释放整棵树。</li>
<li>按层走不属于这三种，是广度优先（BFS），要用队列（见 7.4 BFS）。</li>
</ul>
<p>释放整棵树就是开头“删文件夹”的场景：</p>
<pre><code>void free_tree(node_t *t) {
    if (t == NULL) return;
    free_tree(t-&gt;left);
    free_tree(t-&gt;right);
    free(t);                  /* 孩子都释放了，最后释放自己 */
}</code></pre>
<p>顺序不能反：先 <code>free(t)</code> 再读 <code>t-&gt;left</code>，读的就是已经释放的内存。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>手算</strong>：给一棵树，写前序、中序或后序（期中考出过中序和后序）。</li>
<li><strong>选择题</strong>：BST 的中序选升序的选项；或从几个序列里认出前序、后序。</li>
<li><strong>数调用次数</strong>（第 5、12 周课堂小测）：visit n 次，函数 2n + 1 次，要能说出理由。</li>
<li><strong>写代码</strong>：递归遍历，或基于遍历的小函数（打印、计数、求和、释放），别漏 NULL 的基本情况。</li>
</ul>
<p>这些公式表上都没有，要自己记。</p>

<h3>例题 1：写出三种遍历</h3>
<p>二叉树：A 的左、右孩子是 B、C；B 的左、右孩子是 D、E；E 只有左孩子 G；C 只有右孩子 F；F 的左、右孩子是 H、I。写出前序、中序、后序。</p>
<pre><code class="lang-text">        A
      /   \\
     B     C
    / \\     \\
   D   E     F
      /     / \\
     G     H   I</code></pre>
<p>D、G、H、I 是叶子，结果就是自己。从下往上拼：</p>
<table>
<thead><tr><th>子树</th><th>前序</th><th>中序</th><th>后序</th></tr></thead>
<tbody>
<tr><td>E（G, −）</td><td>E · G</td><td>G · E</td><td>G · E</td></tr>
<tr><td>F（H, I）</td><td>F · H · I</td><td>H · F · I</td><td>H · I · F</td></tr>
<tr><td>B（D, E）</td><td>B · D · E G</td><td>D · B · G E</td><td>D · G E · B</td></tr>
<tr><td>C（−, F）</td><td>C · F H I</td><td>C · H F I</td><td>H I F · C</td></tr>
<tr><td>A（B, C）</td><td>A · B D E G · C F H I</td><td>D B G E · A · C H F I</td><td>D G E B · H I F C · A</td></tr>
</tbody>
</table>
<p>答案：前序 <strong>A B D E G C F H I</strong>，中序 <strong>D B G E A C H F I</strong>，后序 <strong>D G E B H I F C A</strong>。前序以根 A 开头、后序以 A 结尾，对得上。</p>
<p>中序里 C 在 H 前面，因为 C 没有左子树，到了就输出；后序里 G 在 E 前面，因为 G 是 E 的孩子。</p>

<h3>例题 2：从选项里认出遍历</h3>
<p>依次把 41, 20, 65, 11, 29, 50, 91, 32, 72, 99 插入空 BST。哪个是中序遍历？另外两个合法序列是哪种遍历？</p>
<p>A. 41 20 11 29 32 65 50 91 72 99<br>B. 11 20 29 32 41 50 65 72 91 99<br>C. 11 32 29 20 50 72 99 91 65 41<br>D. 11 20 29 32 41 50 65 91 72 99</p>
<p><strong>答案：B。</strong>BST 的中序必须升序，B 是唯一完全升序的；D 里 91 在 72 前面，不是。A 以第一个插入的键（根）41 开头，是<strong>前序</strong>；C 以 41 结尾，是<strong>后序</strong>。画出树核对：</p>
<pre><code class="lang-text">          41
        /    \\
      20      65
     /  \\    /  \\
    11  29  50   91
          \\     /  \\
          32   72   99</code></pre>
<p>前序 = 41 · (20 11 29 32) · (65 50 91 72 99)，后序 = (11 32 29 20) · (50 72 99 91 65) · 41，和 A、C 一致。</p>

<div class="callout warn" data-label="易错">
<ul>
<li>中序一到结点就输出：必须先走完它的整棵左子树，左子树为空也要先“看一眼”（课上特别提醒了 P、S 这两处）。</li>
<li>后序的第一个写成最左边的结点：它若有右孩子，右子树先输出（例子里是 G 不是 F）。</li>
<li>把“根”当成整棵树的根；数调用次数时漏掉 NULL 上的调用或最开始那一次。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>前序 = 根左右，中序 = 左根右，后序 = 左右根；都是先左后右，代码只差 <code>visit</code> 那一行。</li>
<li>手算就从下往上拼；前序第一个、后序最后一个是根。</li>
<li>BST 的中序遍历 = 升序，选择题直接选排好序的。</li>
<li>课上的代码：visit n 次，函数调用 2n + 1 次，其中 n + 1 次落在 NULL 上。</li>
<li>时间 Θ(n)，栈空间 O(h)；要先拿到孩子结果的（求高度、释放树）用后序。</li>
</ul>
`;

/* Post body — dsa-tree-traversals / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-tree-traversals:zh'] = `
<p class="lead">遍历（traversal）按固定规则把二叉树的每个结点访问恰好一次。前序、中序、后序的递归代码只差一行：访问当前结点放在递归左、右子树之前、中间还是之后。</p>

<h2>为什么需要遍历</h2>
<p>普通二叉树（binary tree）不是二叉搜索树（Binary Search Tree, BST），键没有顺序，找一个键只能把结点全看一遍，<strong>O(n)</strong>。用指针连起来的树也不能直接一层一层地走：一层的最后一个结点没有指针通向下一层的第一个结点。</p>
<p>可行的办法是利用递归结构：每个结点 = 左子树 + 结点本身 + 右子树。对每个结点都按同一个顺序处理这三部分，整棵树就被系统地走完。</p>

<h2>三种顺序</h2>
<table>
<thead><tr><th>名称</th><th>顺序</th><th>什么时候访问当前结点</th></tr></thead>
<tbody>
<tr><td>前序（pre-order）</td><td>根、左、右</td><td>一进入就访问，先于两棵子树</td></tr>
<tr><td>中序（in-order）</td><td>左、根、右</td><td>左子树做完、右子树开始前</td></tr>
<tr><td>后序（post-order）</td><td>左、右、根</td><td>两棵子树都做完之后</td></tr>
</tbody>
</table>
<p>三种都是先左后右，只有“根”的位置不同。这里的根指<strong>当前子树的根</strong>：递归到哪个结点，哪个结点就是根。</p>

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
<p>从 M 出发。中序要先做左子树，所以不能输出 M，往左到 J；J 也有左子树，再往左到 F。F 没有左孩子，左子树做完，<strong>输出 F</strong>；接着做 F 的右子树：G 没有左孩子，输出 G，G 也没有右孩子。F 这棵子树做完，回到 J，<strong>输出 J</strong>，再做 J 的右子树 K。J 的子树做完，回到根，<strong>输出 M</strong>。右边同理：P 没有左孩子，输出 P；S 有左孩子 Q，所以先 Q 后 S。</p>
<p>结果 <strong>F G J K M P Q S</strong>。</p>

<h3>自底向上填表：三种一起算</h3>
<p>手算时更稳的做法：从叶子往上，按规则把“左子树的结果、根、右子树的结果”拼起来，每一行只用到下面已经填好的行。表中用 · 隔开三部分，− 表示空子树。</p>
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
<p>写完用两条性质检查：<strong>前序第一个、后序最后一个都是根</strong>；任何一棵子树在三种结果里都占连续的一段。后序的第一个是 G 而不是最左边的 F：F 有右孩子，要等 G 输出后 F 才能输出。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-tree-traversals/anims/traversal.html" loading="lazy" style="height: 520px;" title="二叉树的三种遍历"></iframe>
<p class="anim-caption">选前序、中序或后序后逐步播放：橙色是当前调用，橙色边连出调用栈，绿色是已输出的结点；在 ∅ 上的调用也计数，最后停在 17 次。</p>

<h2>中序遍历 BST 得到升序</h2>
<p>例子树按字母是一棵 BST，中序结果 F G J K M P Q S 正好是字母序。原因：BST 中每个结点左子树的键都比它小、右子树的键都比它大，而中序先输出整棵左子树，再输出结点，最后输出整棵右子树。每棵子树内部也是这样，所以整个序列从小到大（对子树大小做归纳即可证明）。</p>
<div class="callout key" data-label="考点">
<p><strong>BST 的中序遍历 = 所有键从小到大排列。</strong>选择题给一棵很大的 BST 问中序结果，直接选排好序的那个选项，不必逐步走（第 5 周和第 12 周的课堂小测都出过）。</p>
<p>反过来也成立：键互不相同时，二叉树的中序结果升序 ⇔ 它是 BST。前序、后序没有这个性质。</p>
</div>

<h2>C 代码</h2>
<p>课上的写法：函数一进来先判断 NULL，空树直接返回；<code>visit</code> 代表对结点做的事，这里是打印。</p>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

typedef struct node node_t;
struct node {
    char key;
    node_t *left, *right;
};

void visit(node_t *t) { printf("%c ", t-&gt;key); }

void preorder(node_t *t) {           /* 根 左 右 */
    if (t == NULL) return;
    visit(t);
    preorder(t-&gt;left);
    preorder(t-&gt;right);
}

void inorder(node_t *t) {            /* 左 根 右 */
    if (t == NULL) return;
    inorder(t-&gt;left);
    visit(t);
    inorder(t-&gt;right);
}

void postorder(node_t *t) {          /* 左 右 根 */
    if (t == NULL) return;
    postorder(t-&gt;left);
    postorder(t-&gt;right);
    visit(t);
}

void free_tree(node_t *t) {          /* 后序：先释放孩子，再释放自己 */
    if (t == NULL) return;
    free_tree(t-&gt;left);
    free_tree(t-&gt;right);
    free(t);
}

node_t *new_node(char key, node_t *left, node_t *right) {
    node_t *t = malloc(sizeof(*t));
    if (t == NULL) exit(EXIT_FAILURE);
    t-&gt;key = key; t-&gt;left = left; t-&gt;right = right;
    return t;
}

int main(void) {
    node_t *root = new_node('M',
        new_node('J', new_node('F', NULL, new_node('G', NULL, NULL)),
                      new_node('K', NULL, NULL)),
        new_node('P', NULL, new_node('S', new_node('Q', NULL, NULL), NULL)));
    preorder(root);  printf("\\n");   /* M J F G K P S Q */
    inorder(root);   printf("\\n");   /* F G J K M P Q S */
    postorder(root); printf("\\n");   /* G F K J Q S P M */
    free_tree(root);
    return 0;
}</code></pre>
<p><code>free_tree</code> 必须是后序：如果先 <code>free(t)</code> 再读 <code>t-&gt;left</code>，读的是已经释放的内存。3.1 里求高度的 <code>height</code> 也是后序的思路：先拿到两个孩子的高度，才能算自己的。</p>

<h2>调用次数：visit n 次，递归 2n + 1 次</h2>
<p>在例子树（n = 8）上给 <code>inorder</code> 加两个计数器：</p>
<pre><code>static int calls = 0, visits = 0;

void inorder_count(node_t *t) {
    calls++;                         /* 每次进入都算，包括 t == NULL */
    if (t == NULL) return;
    inorder_count(t-&gt;left);
    visits++;                        /* 相当于 visit(t) */
    inorder_count(t-&gt;right);
}</code></pre>
<p>运行后 visits = 8，calls = <strong>17</strong>：8 次落在真实结点上，另外 9 次落在图中的 9 个 ∅ 上，进去就返回。一般情况有两种数法：</p>
<ul>
<li><strong>数谁发起调用</strong>：每个真实结点恰好发起 2 次调用（左、右各一次，不管孩子是否为空），NULL 上的调用不再往下调用；再加上最外面对根的 1 次，共 <strong>2n + 1</strong>。</li>
<li><strong>数调用落在哪</strong>：n 个结点共有 2n 个孩子指针。除根以外，每个结点恰好被一个指针指着，所以非空指针 n − 1 个，<strong>空指针 n + 1 个</strong>。调用次数 = n + (n + 1) = 2n + 1。</li>
</ul>
<p>前序、后序的递归结构完全相同，次数一样，与树的形状无关。空树（n = 0）调用 1 次、visit 0 次，公式照样成立。</p>
<div class="callout warn" data-label="易错">
<p>2n + 1 依赖“进入函数后才判断 NULL”的写法。如果改成调用前先判断孩子（<code>if (t-&gt;left != NULL) inorder(t-&gt;left);</code>），NULL 上就没有调用，非空树只调用 <strong>n</strong> 次。题目说“用课上的代码”时按 2n + 1 算。</p>
</div>
<p>每次调用除 visit 外只做常数工作，所以遍历是 <strong>Θ(n)</strong>。递归栈最深时有 height + 1 层（例子树高 4，最深是 M、J、F、G 再加一个 NULL 调用，共 5 层），额外空间 O(h)：平衡时 O(log n)，退化成链时 O(n)。</p>

<h2>后面还会用到的地方</h2>
<ul>
<li><strong>中序</strong>：按顺序输出 BST；中序前驱、后继用于 BST 删除（见 3.4 BST 删除）；订单簿按价格顺序走一遍平衡 BST（见 8.1）。</li>
<li><strong>后序</strong>：释放整棵树、求高度，凡是要先拿到孩子的结果才能处理自己的，都用后序。</li>
<li><strong>前序</strong>：先处理自己再往深处走，正是深度优先搜索（DFS）的走法。在树上从根做 DFS、先走左孩子，访问顺序就是前序（见 7.3 DFS）。</li>
<li><strong>按层</strong>：不属于这三种，是广度优先（BFS），用队列实现（见 7.4 BFS）。</li>
</ul>

<h2>考试怎么考</h2>
<ul>
<li><strong>写遍历序列</strong>：给一棵画好的树，写前序、中序或后序（期中考出过中序和后序）。用自底向上填表或者逐步走，写完用“前序首、后序尾是根”检查。</li>
<li><strong>BST 的中序</strong>：直接选排好序的选项，不用走。</li>
<li><strong>数调用次数</strong>（第 5、12 周课堂小测）：用课上的代码，visit n 次，遍历函数 2n + 1 次，要能说出理由（每个结点 2 次加最初 1 次，或 n + 1 个空指针）。</li>
<li><strong>代码题</strong>：写递归遍历或基于遍历的小函数（打印、计数、求和、释放），别漏 NULL 的基本情况。</li>
<li><strong>要背</strong>：三种顺序、BST 中序有序、2n + 1、时间 Θ(n) 与栈空间 O(h)。公式表上没有这些。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li>中序一到结点就输出：必须先做完它的整棵左子树，左子树为空也要先看一眼（课上特别提醒的 P、S 两处）。</li>
<li>后序的第一个写成最左边的结点：它若有右孩子，右子树要先输出（例子里是 G 不是 F）。</li>
<li>把“根”理解成整棵树的根，而不是当前子树的根；前序做完左子树后忘了回到上层做右子树。</li>
<li>数调用次数时漏掉 NULL 上的调用，或漏掉最初那一次。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. 二叉树：A 的左、右孩子是 B、C；B 的左、右孩子是 D、E；E 只有左孩子 G；C 只有右孩子 F；F 的左、右孩子是 H、I。写出前序、中序、后序遍历。</summary>
<div class="qa__body">
<pre><code class="lang-text">        A
      /   \\
     B     C
    / \\     \\
   D   E     F
      /     / \\
     G     H   I</code></pre>
<p>自底向上（D、G、H、I 是叶子）：</p>
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
<p>前序 <strong>A B D E G C F H I</strong>，中序 <strong>D B G E A C H F I</strong>，后序 <strong>D G E B H I F C A</strong>。检查：前序以根 A 开头，后序以 A 结尾。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 依次把 41, 20, 65, 11, 29, 50, 91, 32, 72, 99 插入空 BST。下面哪个是中序遍历？另外两个合法的序列分别是哪种遍历？A. 41 20 11 29 32 65 50 91 72 99　B. 11 20 29 32 41 50 65 72 91 99　C. 11 32 29 20 50 72 99 91 65 41　D. 11 20 29 32 41 50 65 91 72 99</summary>
<div class="qa__body">
<p>选 <strong>B</strong>：BST 的中序必须升序，B 是唯一完全升序的选项；D 里 91 在 72 前面，不是。</p>
<p>A 以第一个插入的键（根）41 开头，是<strong>前序</strong>；C 以 41 结尾，是<strong>后序</strong>。画出树验证：</p>
<pre><code class="lang-text">          41
        /    \\
      20      65
     /  \\    /  \\
    11  29  50   91
          \\     /  \\
          32   72   99</code></pre>
<p>前序 = 41 · (20 11 29 32) · (65 50 91 72 99)，后序 = (11 32 29 20) · (50 72 99 91 65) · 41，与 A、C 一致。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 用课上的 inorder 代码（进入函数先判 NULL）遍历一棵 n 个结点的二叉树（n ≥ 1）。哪项总是正确？A. visit n 次，inorder n 次　B. visit n 次，inorder 2n 次　C. visit n 次，inorder 2n + 1 次　D. 次数取决于树的形状。追问：n = 10 时有几次调用落在 NULL 上？</summary>
<div class="qa__body">
<p>选 <strong>C</strong>。每个结点访问一次，visit n 次；每个结点发起左、右 2 次调用，加上对根的 1 次，inorder 共 2n + 1 次。无论树长什么样，每个结点都调用两边，所以 D 错。B 漏了最初那次；A 是“调用前先判孩子”那种写法的次数。</p>
<p>n = 10：共 21 次调用，其中 10 次在真实结点上，<strong>11</strong> 次在 NULL 上（n + 1 个空指针）。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 结点含 int key 和 left、right 指针。写函数 print_desc，把 BST 的键从大到小打印，并给出时间复杂度。对第 2 题的树输出什么？</summary>
<div class="qa__body">
<p>把中序反过来：右、根、左。右子树的键都比根大，先打印它们，再打印根，最后打印更小的左子树。</p>
<pre><code>void print_desc(node_t *t) {
    if (t == NULL) return;
    print_desc(t-&gt;right);            /* 更大的键先打印 */
    printf("%d ", t-&gt;key);
    print_desc(t-&gt;left);
}</code></pre>
<p>每个结点打印一次，共 2n + 1 次调用，每次 O(1)，时间 <strong>Θ(n)</strong>。第 2 题的树输出 <strong>99 91 72 65 50 41 32 29 20 11</strong>。</p>
</div>
</details>
`;

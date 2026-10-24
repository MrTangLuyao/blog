/* Post body — dsa-2-3-tree / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-2-3-tree:zh'] = `
<p class="lead">2-3 树（2-3 tree）的每个结点放 1 个或 2 个键。新键总是放进叶子；结点一旦有 3 个键就分裂，中间键上提（promote）到父结点，必要时一直传到根。因此所有叶子始终在同一深度，查找和插入在最坏情况下也是 O(log n)。</p>

<h2>两种结点</h2>
<p>普通 BST 按有序序列插入会退化成链表，查找变成 O(n)。AVL 树靠旋转维持平衡；2-3 树换一种做法：一个结点可以放两个键、有三个孩子，靠分裂保持平衡，不做旋转。</p>

<figure class="fig">
<svg viewBox="0 0 520 236" width="520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="一棵三层的 2-3 树：根 40，第二层 20 和 60 80，叶子 10、30、50、70、90 95；查找 70 的路径用橙色标出">
<g stroke="rgba(255,255,255,0.35)" stroke-width="2">
<line x1="208" y1="50" x2="90" y2="95"/>
<line x1="78" y1="125" x2="50" y2="170"/><line x1="102" y1="125" x2="130" y2="170"/>
<line x1="318" y1="125" x2="250" y2="170"/><line x1="382" y1="125" x2="450" y2="170"/>
</g>
<g stroke="#d97757" stroke-width="2.5">
<line x1="232" y1="50" x2="350" y2="95"/><line x1="350" y1="125" x2="340" y2="170"/>
</g>
<g fill="#343433" stroke="#5a5a59" stroke-width="2">
<rect x="72" y="95" width="36" height="30" rx="6"/>
<rect x="32" y="170" width="36" height="30" rx="6"/><rect x="112" y="170" width="36" height="30" rx="6"/>
<rect x="232" y="170" width="36" height="30" rx="6"/><rect x="414" y="170" width="72" height="30" rx="6"/>
</g>
<g fill="#343433" stroke="#d97757" stroke-width="2.5">
<rect x="202" y="20" width="36" height="30" rx="6"/><rect x="314" y="95" width="72" height="30" rx="6"/><rect x="322" y="170" width="36" height="30" rx="6"/>
</g>
<g stroke="#5a5a59" stroke-width="1.5"><line x1="350" y1="99" x2="350" y2="121"/><line x1="450" y1="174" x2="450" y2="196"/></g>
<g fill="#e8e8e8" font-size="14" font-weight="700" text-anchor="middle">
<text x="220" y="40">40</text><text x="90" y="115">20</text><text x="332" y="115">60</text><text x="368" y="115">80</text>
<text x="50" y="190">10</text><text x="130" y="190">30</text><text x="250" y="190">50</text><text x="340" y="190">70</text><text x="432" y="190">90</text><text x="468" y="190">95</text>
</g>
<g fill="#a1a1a0" font-size="12"><text x="64" y="114" text-anchor="end">2-node</text><text x="394" y="114">3-node</text></g>
<g fill="#a1a1a0" font-size="12" text-anchor="middle">
<text x="50" y="222">&lt; 20</text><text x="130" y="222">20~40</text><text x="250" y="222">40~60</text><text x="340" y="222">60~80</text><text x="450" y="222">&gt; 80</text>
</g>
</svg>
<figcaption>一棵 3 层的 2-3 树。最下一行是每个叶子里键的取值范围；橙色是查找 70 的路径。</figcaption>
</figure>

<ul>
<li><strong>2-node</strong>：1 个键 X，2 个孩子，左子树 &lt; X &lt; 右子树，与 BST 结点相同。图中的 [40]、[20]。</li>
<li><strong>3-node</strong>：2 个键 X &lt; Y，3 个孩子，<strong>左子树 &lt; X &lt; 中子树 &lt; Y &lt; 右子树</strong>。图中 [60 80] 的三个孩子：50 &lt; 60，70 在 60 和 80 之间，90、95 &gt; 80。</li>
</ul>
<p><strong>名字里的 2、3 数的是孩子，不是键</strong>：内部结点的孩子数 = 键数 + 1，叶子没有孩子。2-3 树是<strong>阶（order）为 3 的 B 树（B-tree）</strong>，阶指一个结点最多的孩子数（一般的 B 树见 3.8 B 树与 B+ 树）。</p>
<p>图中 5 个叶子都在第 3 层。本课程把“所有叶子深度相同”叫做<strong>完全平衡（perfectly balanced）</strong>，2-3 树任何时候都满足它。</p>

<h3>查找</h3>
<p>查找 70：根 [40]，70 &gt; 40，往右；[60 80] 中 60 &lt; 70 &lt; 80，走中间；在 [70] 找到，共访问 3 个结点。查找 85：85 &gt; 40 往右，85 &gt; 80 往右，到 [90 95] 时 85 &lt; 90，应往左，但叶子没有孩子，所以 85 不在树中。</p>
<p>规则：在每个结点里与至多 2 个键比较，相等就找到；否则看落在哪个区间，选左、中、右孩子；走到空指针说明不存在。</p>

<h2>插入：放进叶子，满了就分裂</h2>
<p>课上的例子：依次插入 1, 2, 3, 4, 5, 6, 7。这串有序输入会把普通 BST 变成 7 层的链。</p>
<ol>
<li><strong>1</strong>：空树，[1] 就是根，也是叶子。</li>
<li><strong>2</strong>：放进 [1]，得到 [1 2]。一个结点最多 2 个键，装得下。</li>
<li><strong>3</strong>：放进 [1 2]，临时变成 [1 2 3]，<strong>溢出（overflow）</strong>，必须<strong>分裂（split）</strong>：中间键 2 上提；它没有父结点，于是 2 成为<strong>新根</strong>，1 和 3 各成一个结点，当 2 的左、右孩子。</li>
<li><strong>4</strong>：4 &gt; 2 往右，叶子 [3] 变成 [3 4]。</li>
<li><strong>5</strong>：5 &gt; 2 往右，叶子变成 [3 4 5]，溢出。中间键 4 上提，<strong>插进已有的父结点</strong> [2]，得到 [2 4]；3、5 分成两个结点挂在 4 的两侧，即 [2 4] 的中指针指 [3]，右指针指 [5]。</li>
<li><strong>6</strong>：6 &gt; 4 往右，[5] 变成 [5 6]。</li>
<li><strong>7</strong>：7 &gt; 4 往右，[5 6] 变成 [5 6 7]，溢出；6 上提，父结点变成 [2 4 6]，<strong>父结点也溢出</strong>。它有 4 个孩子 [1] [3] [5] [7]，照样分裂：4 上提成为新根，[2] 带走左边两个孩子 [1] [3]，[6] 带走右边两个 [5] [7]。这一次插入分裂了两次。</li>
</ol>
<pre><code class="lang-text">after 3          after 5              after 7
  [2]             [2 4]                     [4]
 /   \\           /  |  \\                  /     \\
[1]   [3]      [1] [3] [5]             [2]       [6]
                                      /   \\     /   \\
                                    [1]   [3] [5]   [7]</code></pre>
<p>最后树高 3，所有叶子都在第 3 层；同样的输入让 BST 高 7。</p>

<p>一般规则：</p>
<ol>
<li>像 BST 一样从根往下找，<strong>新键总是放进叶子结点</strong>，结点内的键保持有序。不会在叶子下面另开一层。</li>
<li>放进后只有 2 个键：结束。</li>
<li>有 3 个键 a &lt; b &lt; c：分裂成 [a] 和 [c]，<strong>中间键 b 插入父结点</strong>，[a]、[c] 挂在 b 的左右两侧。被分裂的若是内部结点，它的 4 个孩子左边两个归 [a]，右边两个归 [c]。</li>
<li>父结点因此有了 3 个键，就对父结点重复第 3 步：<strong>分裂会一层层向上传</strong>。</li>
<li><strong>根分裂时 b 成为新根，树高加 1。这是 2-3 树变高的唯一方式</strong>：树从根部长高，而不是从叶子往下长。</li>
</ol>

<figure class="fig">
<svg viewBox="0 0 640 210" width="640" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="分裂：溢出结点 a b c 的中间键 b 插入父结点，a 和 c 各成一个结点，四棵子树左两棵归 a、右两棵归 c">
<g stroke="rgba(255,255,255,0.35)" stroke-width="2">
<line x1="116" y1="45" x2="60" y2="80"/><line x1="144" y1="45" x2="190" y2="80"/>
<line x1="136" y1="110" x2="130" y2="135"/><line x1="172" y1="110" x2="170" y2="135"/><line x1="208" y1="110" x2="210" y2="135"/><line x1="244" y1="110" x2="250" y2="135"/>
<line x1="450" y1="45" x2="400" y2="80"/>
<line x1="456" y1="110" x2="450" y2="135"/><line x1="484" y1="110" x2="490" y2="135"/><line x1="566" y1="110" x2="560" y2="135"/><line x1="594" y1="110" x2="600" y2="135"/>
</g>
<g stroke="#4ade80" stroke-width="2.5"><line x1="482" y1="45" x2="470" y2="80"/><line x1="514" y1="45" x2="580" y2="80"/></g>
<g fill="#343433" stroke="#5a5a59" stroke-width="2">
<polygon points="60,80 38,128 82,128"/><polygon points="400,80 378,128 422,128"/>
<polygon points="130,135 112,175 148,175"/><polygon points="170,135 152,175 188,175"/><polygon points="210,135 192,175 228,175"/><polygon points="250,135 232,175 268,175"/>
<polygon points="450,135 432,175 468,175"/><polygon points="490,135 472,175 508,175"/><polygon points="560,135 542,175 578,175"/><polygon points="600,135 582,175 618,175"/>
<rect x="112" y="15" width="36" height="30" rx="6"/><rect x="446" y="15" width="72" height="30" rx="6"/>
</g>
<rect x="136" y="80" width="108" height="30" rx="6" fill="#343433" stroke="#f87171" stroke-width="2.5"/>
<g fill="#343433" stroke="#4ade80" stroke-width="2.5"><rect x="452" y="80" width="36" height="30" rx="6"/><rect x="562" y="80" width="36" height="30" rx="6"/></g>
<g stroke="#5a5a59" stroke-width="1.5"><line x1="172" y1="84" x2="172" y2="106"/><line x1="208" y1="84" x2="208" y2="106"/><line x1="482" y1="19" x2="482" y2="41"/></g>
<g fill="#e8e8e8" font-size="14" font-weight="700" text-anchor="middle">
<text x="130" y="35">x</text><text x="154" y="100">a</text><text x="226" y="100">c</text>
<text x="464" y="35">x</text><text x="470" y="100">a</text><text x="580" y="100">c</text>
</g>
<g fill="#d97757" font-size="14" font-weight="700" text-anchor="middle"><text x="190" y="100">b</text><text x="500" y="35">b</text></g>
<g fill="#a1a1a0" font-size="12" text-anchor="middle">
<text x="60" y="118">T0</text><text x="130" y="166">T1</text><text x="170" y="166">T2</text><text x="210" y="166">T3</text><text x="250" y="166">T4</text>
<text x="400" y="118">T0</text><text x="450" y="166">T1</text><text x="490" y="166">T2</text><text x="560" y="166">T3</text><text x="600" y="166">T4</text>
<text x="150" y="200">分裂前：[a b c] 溢出</text><text x="500" y="200">分裂后：b 进入父结点</text>
</g>
<line x1="280" y1="100" x2="326" y2="100" stroke="#a1a1a0" stroke-width="2"/>
<polygon points="336,100 325,94 325,106" fill="#a1a1a0"/>
</svg>
<figcaption>分裂一个溢出结点（这里它是父结点 [x] 的右孩子）。b 插入父结点；T1、T2 归 [a]，T3、T4 归 [c]。分裂的是叶子时 T1–T4 都为空。</figcaption>
</figure>

<div class="callout key" data-label="考点">
<p><strong>为什么永远完全平衡</strong>：分裂只是在同一层多出一个兄弟结点，叶子深度不变；唯一增加层数的根分裂让所有叶子同时深一层。</p>
<p><strong>什么时候变高</strong>：从根到新键所在叶子的路径上<strong>每个结点都是 3-node</strong>，分裂才会传到根。路径上只要有一个 2-node，分裂就停在那里。第一张图的根 [40] 是 2-node，所以插入任何一个键都不会让那棵树变高。</p>
</div>

<p>第一张图的树可以由依次插入 40, 10, 80, 30, 50, 60, 20, 90, 70, 95 得到，即动画里的“混合”序列。</p>
<iframe class="anim-frame" src="blog/blog_data/dsa-2-3-tree/anims/insert23.html" loading="lazy" style="height: 500px;" title="2-3 树插入与分裂"></iframe>
<p class="anim-caption">选“1…7（课上）”“混合”，或输入自己的序列后点“插入这串”，逐步播放：红色结点溢出，中间键上提，分出的两半变绿挂在它两侧。</p>

<h2>高度与复杂度</h2>
<p>按本课程约定叶子高度为 1，2-3 树的高度 h 就是层数。h 层的 2-3 树：</p>
<ul>
<li>键最少：全是 2-node，就是满二叉树，1 + 2 + … + 2<sup>h−1</sup> = <strong>2<sup>h</sup> − 1</strong> 个键。</li>
<li>键最多：全是 3-node，第 k 层（根为第 0 层）有 3<sup>k</sup> 个结点、每个 2 个键，共 2(1 + 3 + … + 3<sup>h−1</sup>) = <strong>3<sup>h</sup> − 1</strong> 个键。</li>
</ul>
<p>所以 2<sup>h</sup> − 1 ≤ n ≤ 3<sup>h</sup> − 1，即 <strong>log₃(n+1) ≤ h ≤ log₂(n+1)</strong>：高度介于 log₃ n 与 log₂ n 之间，是 Θ(log n)。例如 3 层的 2-3 树有 7 到 26 个键，1…7 的结果正是最少的情况。</p>
<table>
<thead><tr><th>操作</th><th>最坏代价</th><th>原因</th></tr></thead>
<tbody>
<tr><td>查找</td><td>O(log n)</td><td>至多 h 层，每层至多 2 次比较</td></tr>
<tr><td>插入</td><td>O(log n)</td><td>往下找叶子 O(h)；往回每层至多分裂一次，每次 O(1)</td></tr>
<tr><td>对比：BST 查找</td><td>O(n)</td><td>有序输入退化成链</td></tr>
</tbody>
</table>
<p>和 AVL 树一样，这是<strong>最坏情况</strong>的保证，与插入顺序无关。每个结点多放键不改变复杂度类：log₃ n 与 log₂ n 只差常数倍（见 3.8）。</p>

<h2>C 代码：结点与查找</h2>
<p>结点记下键数 n；2-node 只用 key[0] 和前两个孩子，叶子的孩子全是 NULL。</p>
<pre><code>typedef struct node23 node23_t;
struct node23 {
    int n;                  /* 键数：1 或 2 */
    int key[2];             /* key[0] &lt; key[1] */
    node23_t *child[3];     /* 左、中、右；叶子全为 NULL */
};

/* 返回含有 key 的结点；不存在时返回 NULL */
node23_t *search23(node23_t *t, int key) {
    while (t != NULL) {
        int i = 0;
        while (i &lt; t-&gt;n &amp;&amp; key &gt; t-&gt;key[i])   /* 数 key 比几个键大 */
            i++;
        if (i &lt; t-&gt;n &amp;&amp; key == t-&gt;key[i])
            return t;                             /* 找到 */
        t = t-&gt;child[i];      /* 0 左，1 中（2-node 时是右），2 右 */
    }
    return NULL;
}</code></pre>
<p>i 等于“key 比这个结点里几个键大”，正好是要走的孩子下标。实现插入时常把两个数组各多开一格（key[3]、child[4]），让溢出的结点先装下第 3 个键再拆成两半；递归插入返回“是否分裂、上提哪个键、新的右半结点”，父结点据此把键插进自己。</p>

<h2>2-3-4 树与红黑树</h2>
<p><strong>2-3-4 树</strong>是阶为 4 的 B 树：结点有 1 到 3 个键（2-node、3-node、4-node），最多 4 个孩子。插入同样是放进叶子、超出上限就分裂并上提中间键；课上的做法是上提原来 3 个键中居中的那个，例如 [2 3 4] 插入 5 时 3 上提，得到 [2] 和 [4 5]。<strong>2-3-4 树只要求概念，细节不考；红黑树（red-black tree）不考</strong>，它是用二叉结点表示 2-3-4 树的一种平衡 BST。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>画图题</strong>：给一串键，从空树依次插入，画出最终的树或每一步。复习课明确 2-3 树的细节要考。</li>
<li><strong>判断 / 选择题</strong>：叶子是否同深度、树怎样变高、名字中 2 和 3 的含义、2-3 树 = 阶为 3 的 B 树、查找和插入的最坏复杂度。</li>
<li><strong>计算题</strong>：给高度求最少、最多的键数，或给 n 求可能的高度。</li>
<li><strong>要背</strong>：分裂规则（中间键上提、插进已有的父结点）、只在根部变高、2<sup>h</sup> − 1 ≤ n ≤ 3<sup>h</sup> − 1。公式表有等比数列求和与对数换底，两个界可以现场推出。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li>按 BST 习惯给叶子挂一个新孩子。2-3 树的新键是放<strong>进</strong>叶子结点，只有根分裂会增加层数。</li>
<li>给上提的键新建一个父结点。父结点已存在时，键必须插进<strong>原来的父结点</strong>；只有根分裂才新建结点。</li>
<li>上提错键。上提的是<strong>包括新键在内</strong>的 3 个键的中间那个，它可能正是新键：[10 30] 插入 20 得 [10 20 30]，上提 20。</li>
<li>内部结点分裂时孩子分错：4 个孩子左两个、右两个。</li>
<li>以为有序输入会让 2-3 树退化。不会，1…7 的结果正是一棵完美的三层树。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. 从空 2-3 树开始，依次插入 60, 70, 30, 80, 10, 20, 40, 50。画出最后的树，并指出哪几次插入引起了分裂。</summary>
<div class="qa__body">
<ul>
<li>60、70：[60 70]。</li>
<li>30：[30 60 70] 溢出，60 上提成新根，孩子 [30]、[70]。</li>
<li>80：80 &gt; 60，[70 80]。10：10 &lt; 60，[10 30]。</li>
<li>20：[10 20 30] 溢出，20 上提进根，根变成 [20 60]，孩子 [10] [30] [70 80]。</li>
<li>40：20 &lt; 40 &lt; 60，走中间，[30 40]。</li>
<li>50：走中间，[30 40 50] 溢出，40 上提进根，根变成 [20 40 60]，4 个孩子如下，根也溢出：</li>
</ul>
<pre><code class="lang-text">          [20 40 60]
         /   |   |   \\
     [10]  [30] [50]  [70 80]</code></pre>
<p>根分裂：40 成为新根，[20] 带走 [10] [30]，[60] 带走 [50] [70 80]。</p>
<pre><code class="lang-text">            [40]
          /      \\
      [20]        [60]
     /    \\      /    \\
  [10]    [30] [50]   [70 80]</code></pre>
<p>插入 30、20、50 时分裂，共 4 次（插入 50 时分裂两次）。树高 3，所有叶子在第 3 层。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 在第一张图的树中插入 97，画出结果，说明分裂了几次、树高是否改变。另问：在原图的树中插入哪个键能使树变高？</summary>
<div class="qa__body">
<p>97 &gt; 40、97 &gt; 80，到叶子 [90 95]，变成 [90 95 97]，溢出：95 上提，[60 80] 变成 [60 80 95]，也溢出，它的 4 个孩子是 [50] [70] [90] [97]。再分裂：80 上提进根，根变成 [40 80]；[60] 带走 [50] [70]，[95] 带走 [90] [97]。</p>
<pre><code class="lang-text">                [40 80]
             /     |     \\
         [20]     [60]     [95]
        /    \\   /    \\   /    \\
     [10]  [30] [50] [70] [90] [97]</code></pre>
<p>分裂 2 次。根原来是 2-node，接住上提的 80 后变成 3-node，没有分裂，树高仍是 3。</p>
<p>另问：<strong>没有</strong>。任何插入的路径都从根 [40] 开始，它是 2-node，分裂最多传到根为止，所以这棵树插入一个键不可能变高。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 一棵 2-3 树存了 1000 个键，它的高度（层数）可能是多少？同样 1000 个键的 BST 最坏有多高？</summary>
<div class="qa__body">
<p>需要 2<sup>h</sup> − 1 ≤ 1000 ≤ 3<sup>h</sup> − 1。</p>
<ul>
<li>2<sup>9</sup> − 1 = 511 ≤ 1000，2<sup>10</sup> − 1 = 1023 &gt; 1000，所以 h ≤ 9。</li>
<li>3<sup>6</sup> − 1 = 728 &lt; 1000，3<sup>7</sup> − 1 = 2186 ≥ 1000，所以 h ≥ 7。</li>
</ul>
<p>高度是 <strong>7、8 或 9</strong>。BST 最坏是一条链，高 1000。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 多选：关于 2-3 树，哪些说法正确？A. 每个结点都有 2 个或 3 个孩子　B. 树只有在根结点分裂时才会变高　C. 依次插入 1, 2, …, n 会使它退化成链，查找变成 O(n)　D. 一次插入可能分裂多个结点，但不超过树的层数　E. 2-3 树是阶为 3 的 B 树，“3”指一个结点最多存 3 个键</summary>
<div class="qa__body">
<p>选 <strong>B、D</strong>。</p>
<ul>
<li>A 错：叶子没有孩子，只有内部结点有 2 或 3 个孩子。</li>
<li>B 对：其他分裂只在同一层增加结点。</li>
<li>C 错：插入 1…7 得到完美的三层树；任何插入顺序下 h ≤ log₂(n+1)。</li>
<li>D 对：从叶子到根每层至多分裂一次，共 h 层。</li>
<li>E 错：阶数的是孩子。2-3 树的结点最多 2 个键、3 个孩子，3 个键只是分裂前的临时状态。</li>
</ul>
</div>
</details>
`;

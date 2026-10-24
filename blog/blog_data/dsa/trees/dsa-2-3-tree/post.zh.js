/* Post body — dsa-2-3-tree / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-2-3-tree:zh'] = `
<p class="lead">2-3 树（2-3 tree）让一个结点放 1 到 2 个键，装不下就分裂、把中间键往上送，所以所有叶子永远在同一层，查找和插入最坏都是 O(log n)。</p>

<h2>从一个场景说起</h2>
<p>普通 BST 怕有序输入：依次插入 1, 2, …, 7，每个新键都比前面的大，只能一路往右挂，得到一条 7 层的链，查找变成 O(n)。毛病在于 BST <strong>只会往下长</strong>，长在哪一边全看插入顺序。</p>
<p>换个做法。想象按学号给同学分组：每组最多 2 人；上面一层站着“分界人”，学号比他小的去左边的组，大的去右边。</p>
<p>新同学来了，顺着分界人找到自己的组。组里挤成 3 个人，就拆成两组，学号居中的那位走到上一层，当这两组之间的新分界人。上一层也挤成 3 个人？照样拆开，把中间那位再往上送。连最顶层都挤爆了，就在最上面新开一层，只站那一位。</p>
<p>新的一层永远开在<strong>最顶上</strong>，所以最底下的小组始终在同一层，哪边都不会被拉长。2-3 树就是这样做的。</p>

<h2>2-3 树是什么</h2>
<p>简单说，2-3 树就是<strong>每个结点放 1 个或 2 个键、所有叶子都在同一层</strong>的搜索树。结点只有两种：</p>
<ul>
<li><strong>2-node</strong>：1 个键 X，2 个孩子，左子树 &lt; X &lt; 右子树，和 BST 结点一样。下图的 [40]、[20]。</li>
<li><strong>3-node</strong>：2 个键 X &lt; Y，3 个孩子，<strong>左子树 &lt; X &lt; 中子树 &lt; Y &lt; 右子树</strong>。两个键把数轴切成三段，一段对应一个孩子。下图 [60 80] 的三个孩子：50 &lt; 60，70 在 60 和 80 之间，90、95 &gt; 80。</li>
</ul>

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

<p>对回场景：叶子是最底下的小组，内部结点里的键就是分界人。另外两点要记住：</p>
<ul>
<li><strong>名字里的 2 和 3 数的是孩子，不是键</strong>：内部结点的孩子数 = 键数 + 1，叶子没有孩子。2-3 树就是<strong>阶（order）为 3 的 B 树（B-tree）</strong>，阶指一个结点最多几个孩子（见 3.8 B 树与 B+ 树）。</li>
<li>上图 5 个叶子都在第 3 层。所有叶子深度相同，本课叫<strong>完全平衡（perfectly balanced）</strong>，2-3 树任何时候都满足。</li>
</ul>

<h3>查找</h3>
<p>和 BST 一样从根往下走，只是每个结点最多比 2 次，再按落在哪一段选孩子。查找 70：根 [40]，70 &gt; 40 往右；[60 80] 里 60 &lt; 70 &lt; 80，走中间；在 [70] 找到，访问了 3 个结点。</p>
<p>查找 85：85 &gt; 40 往右，85 &gt; 80 往右，到叶子 [90 95] 时 85 &lt; 90 该往左，可叶子没有孩子，所以 85 不在树里。</p>

<h2>看个例子：依次插入 1 到 7</h2>
<p>课上的例子正是让 BST 变成链的那串。插入的规则只有一条：<strong>像 BST 一样往下找，把新键放进叶子结点里</strong>（不是挂在叶子下面）；放进去后结点有 3 个键，就分裂。</p>
<ol>
<li><strong>插入 1</strong>：空树，[1] 既是根也是叶子。</li>
<li><strong>插入 2</strong>：放进 [1]，得到 [1 2]。一个结点最多 2 个键，装得下。</li>
<li><strong>插入 3</strong>：放进 [1 2]，临时变成 [1 2 3]，这叫<strong>溢出（overflow）</strong>。于是<strong>分裂（split）</strong>：中间键 2 往上送，叫<strong>上提（promote）</strong>；它没有父结点，2 就自己成为<strong>新根</strong>，1 和 3 各成一个结点，当 2 的左、右孩子。</li>
<li><strong>插入 4</strong>：4 &gt; 2，往右到叶子 [3]，变成 [3 4]。</li>
<li><strong>插入 5</strong>：5 &gt; 2，往右，[3 4] 变成 [3 4 5]，溢出。中间键 4 上提，这次<strong>插进已有的父结点</strong> [2]，变成 [2 4]；3 和 5 各成一个结点挂在 4 两边，即 [2 4] 的中孩子是 [3]，右孩子是 [5]。</li>
<li><strong>插入 6</strong>：6 &gt; 4，往右，[5] 变成 [5 6]。</li>
<li><strong>插入 7</strong>：7 &gt; 4，往右，[5 6] 变成 [5 6 7]，溢出，6 上提，父结点变成 [2 4 6]，<strong>父结点也溢出了</strong>。它有 4 个孩子 [1] [3] [5] [7]，照样分裂：4 上提成为新根，[2] 带走左边两个孩子 [1] [3]，[6] 带走右边两个 [5] [7]。这一次插入分裂了两次。</li>
</ol>
<pre><code class="lang-text">after 3          after 5              after 7
  [2]             [2 4]                     [4]
 /   \\           /  |  \\                  /     \\
[1]   [3]      [1] [3] [5]             [2]       [6]
                                      /   \\     /   \\
                                    [1]   [3] [5]   [7]</code></pre>
<p>最后树高 3，四个叶子都在第 3 层。同样的输入，BST 高 7。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-2-3-tree/anims/insert23.html" loading="lazy" style="height: 500px;" title="2-3 树插入与分裂"></iframe>
<p class="anim-caption">先选“1…7（课上）”逐步播放：红色是溢出的结点，中间键上提，分出的两半变绿挂在它两侧。“混合”依次插入 40, 10, 80, 30, 50, 60, 20, 90, 70, 95，建出第一张图的树；也可以输入自己的序列后点“插入这串”。</p>

<h3>分裂的一般规则</h3>
<p>把上面的步骤归纳一下。结点溢出时有 3 个键 a &lt; b &lt; c：</p>
<ol>
<li>拆成 [a] 和 [c] 两个结点。</li>
<li><strong>中间键 b 插进父结点</strong>，[a]、[c] 挂在 b 的左右两边。</li>
<li>被拆的若是内部结点，它有 4 个孩子：<strong>左边两个归 [a]，右边两个归 [c]</strong>。</li>
<li>父结点因此有了 3 个键，就对父结点重复这几步：分裂会<strong>一层层往上传</strong>。</li>
<li>传到根，根也溢出：b 成为新根，树高加 1。<strong>这是 2-3 树变高的唯一方式</strong>。</li>
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

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/bhKixY-cZHE" title="2-3 Tree Insertion" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：distanceedjohn《2-3 Tree Insertion》（英文，约 8 分钟），演示依次插入键、结点溢出时分裂并上提中间键。</p>

<h2>为什么永远平衡</h2>
<p>普通的分裂只是在同一层多出一个兄弟结点，叶子的深度不变。只有根分裂会加一层，而这一层加在最顶上，所有叶子同时深一层。所以 2-3 树<strong>从根部长高，而不是从叶子往下长</strong>，就像场景里新的一层总开在最上面。</p>
<div class="callout key" data-label="考点">
<p><strong>什么时候会变高</strong>：分裂要一路传到根，从根到新键所在叶子的路径上<strong>每个结点都得是 3-node</strong>。路径上只要有一个 2-node，它接住上提的键变成 3-node，分裂就停在那里。第一张图的根 [40] 是 2-node，所以往那棵树里插入任何一个键，树都不会变高。</p>
</div>

<h2>高度与复杂度</h2>
<p>按本课约定叶子高度为 1，树高 h 就是层数。h 层的 2-3 树：</p>
<ul>
<li>键最少：全是 2-node，就是满二叉树，共 <strong>2<sup>h</sup> − 1</strong> 个键。</li>
<li>键最多：全是 3-node，每层结点数是上一层的 3 倍，每个结点 2 个键，共 2(1 + 3 + … + 3<sup>h−1</sup>) = <strong>3<sup>h</sup> − 1</strong> 个键。</li>
</ul>
<p>所以 2<sup>h</sup> − 1 ≤ n ≤ 3<sup>h</sup> − 1，即 <strong>log₃(n+1) ≤ h ≤ log₂(n+1)</strong>，高度是 Θ(log n)。比如 3 层能放 7 到 26 个键，1…7 正是最少的那种。</p>
<table>
<thead><tr><th>操作</th><th>最坏代价</th><th>原因</th></tr></thead>
<tbody>
<tr><td>查找</td><td>O(log n)</td><td>至多 h 层，每层至多比较 2 次</td></tr>
<tr><td>插入</td><td>O(log n)</td><td>往下找叶子 O(h)；往回每层至多分裂一次，每次 O(1)</td></tr>
<tr><td>对比：BST 查找</td><td>O(n)</td><td>有序输入退化成链</td></tr>
</tbody>
</table>
<p>和 AVL 树一样，这是<strong>最坏情况</strong>的保证，不管按什么顺序插入都成立。</p>

<h3>补充：2-3-4 树与红黑树</h3>
<p><strong>2-3-4 树</strong>是阶为 4 的 B 树：结点有 1 到 3 个键，最多 4 个孩子。插入思路相同：放进叶子，超了就分裂并上提中间键。<strong>2-3-4 树只要求知道概念，细节不考；红黑树（red-black tree）不考</strong>，它是用二叉结点表示 2-3-4 树的一种平衡 BST。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>画图题</strong>（最常见）：给一串键，从空树依次插入，画出最后的树或每一步。复习课明确 2-3 树的细节要考。</li>
<li><strong>选择 / 判断</strong>：叶子是否同深度、树怎样变高、名字里的 2 和 3 指什么、和 B 树的关系、查找与插入的最坏复杂度。</li>
<li><strong>计算</strong>：给层数求最少、最多键数，或给 n 求可能的高度。公式表有等比数列求和与对数换底，两个界可以现场推出来；分裂规则要自己记。</li>
</ul>

<h3>例题 1：画出插入后的树</h3>
<p>从空 2-3 树开始，依次插入 60, 70, 30, 80, 10, 20, 40, 50。画出最后的树，并指出哪几次插入引起了分裂。</p>
<ol>
<li>60、70：放进同一个叶子，[60 70]。</li>
<li>30：[30 60 70] 溢出，60 上提成新根，孩子 [30] 和 [70]。</li>
<li>80：80 &gt; 60，[70 80]。10：10 &lt; 60，[10 30]。</li>
<li>20：[10 20 30] 溢出，20 上提进根，根变成 [20 60]，孩子 [10] [30] [70 80]。</li>
<li>40：20 &lt; 40 &lt; 60，走中间，[30 40]。</li>
<li>50：走中间，[30 40 50] 溢出，40 上提进根，根变成 [20 40 60]，有 4 个孩子，根也溢出：</li>
</ol>
<pre><code class="lang-text">          [20 40 60]
         /   |   |   \\
     [10]  [30] [50]  [70 80]</code></pre>
<p>根分裂：40 成为新根，[20] 带走左边两个孩子 [10] [30]，[60] 带走右边两个 [50] [70 80]。</p>
<pre><code class="lang-text">            [40]
          /      \\
      [20]        [60]
     /    \\      /    \\
  [10]    [30] [50]   [70 80]</code></pre>
<p>插入 30、20、50 时发生分裂，共 4 次（插入 50 那次分裂两次）。树高 3，叶子全在第 3 层。</p>

<h3>例题 2：多选</h3>
<p>关于 2-3 树，哪些说法正确？A. 每个结点都有 2 个或 3 个孩子；B. 树只有在根结点分裂时才会变高；C. 依次插入 1, 2, …, n 会使它退化成链；D. 一次插入可能分裂多个结点，但不超过树的层数；E. 2-3 树是阶为 3 的 B 树，“3”指一个结点最多存 3 个键。</p>
<p><strong>答案：B、D。</strong></p>
<ul>
<li>A 错：叶子没有孩子，只有内部结点才有 2 或 3 个孩子。</li>
<li>B 对：其他分裂只在同一层加结点。</li>
<li>C 错：插入 1…7 得到的是完美的三层树；任何顺序下都有 h ≤ log₂(n+1)。</li>
<li>D 对：从叶子到根，每层至多分裂一次。</li>
<li>E 错：阶数的是孩子。结点最多 2 个键、3 个孩子，3 个键只是分裂前的临时状态。</li>
</ul>

<div class="callout warn" data-label="易错">
<ul>
<li>按 BST 习惯在叶子下面挂新结点。新键是放<strong>进</strong>叶子结点，只有根分裂才加层。</li>
<li>给上提的键新建父结点。父结点存在时，键要插进<strong>原来的父结点</strong>；只有根分裂才新建结点。</li>
<li>上提错键。上提的是<strong>算上新键</strong>的 3 个键里中间那个，它可能就是新键：[10 30] 插入 20，上提的是 20。</li>
<li>内部结点分裂时分错孩子：4 个孩子，左两个、右两个。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>2-node：1 个键、2 个孩子；3-node：2 个键、3 个孩子，左 &lt; X &lt; 中 &lt; Y &lt; 右。名字数的是孩子，2-3 树 = 阶为 3 的 B 树。</li>
<li>插入：往下找到叶子，把键放进去；满 3 个键就分裂，中间键插进父结点，可能一路传到根。</li>
<li>只有根分裂让树变高，所以所有叶子永远在同一层（完全平衡）。</li>
<li>2<sup>h</sup> − 1 ≤ n ≤ 3<sup>h</sup> − 1，高度 Θ(log n)；查找、插入最坏 O(log n)，有序输入也不会退化。</li>
<li>2-3-4 树只考概念，红黑树不考。</li>
</ul>
`;

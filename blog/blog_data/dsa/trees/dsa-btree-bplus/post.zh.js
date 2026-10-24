/* Post body — dsa-btree-bplus / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-btree-bplus:zh'] = `
<p class="lead">B 树（B-tree）让一个结点装很多个键，结点是一段连续数组，正好占一块磁盘块，从根到叶只需跟很少几次指针；查找仍是 O(log n)。B+ 树（B+ tree）再把数据全放进叶子、把叶子连成链表，找“下一个键”和范围查询因此很快。</p>

<h2>B 树：m 阶多路搜索树</h2>
<p>2-3 树（见 3.7 2-3 树）的结点有 1 或 2 个键、2 或 3 个孩子。把上限放宽到 m 个孩子，就是 <strong>m 阶 B 树（B-tree of order m）</strong>：</p>
<ul>
<li>每个结点<strong>最多 m 个孩子、最多 m − 1 个键</strong>，键在结点内从小到大排成数组；</li>
<li>有 k 个键的内部结点恰有 k + 1 个孩子，每个孩子里的键夹在它左右两个键之间；</li>
<li><strong>所有叶子在同一深度</strong>（完美平衡）。</li>
</ul>
<p>5 阶 B 树的一个满结点（4 个键、5 个孩子）：</p>
<pre><code class="lang-text">           [ 20 | 40 | 60 | 80 ]
          /     |    |    |     \\
       &lt;20   20~40 40~60 60~80  &gt;80</code></pre>
<p>插入和 2-3 树一样：像 BST 那样往下找到叶子，按顺序放进去；结点里的键达到 m 个就<strong>分裂</strong>，中间的键提到父结点，左右两半成为两个结点，父结点满了再往上分裂，根分裂时长出新根。例如 5 阶 B 树的叶子 [10 20 30 40] 插入 25，变成 5 个键 [10 20 25 30 40]，中间的 25 上移，留下 [10 20] 和 [30 40]。</p>

<table>
<thead><tr><th>阶 m</th><th>每个结点的键</th><th>孩子</th><th>名字</th></tr></thead>
<tbody>
<tr><td>2</td><td>1</td><td>2</td><td>不存在（就是普通 BST）</td></tr>
<tr><td>3</td><td>1 ~ 2</td><td>2 ~ 3</td><td>2-3 树（插入、分裂要会画）</td></tr>
<tr><td>4</td><td>1 ~ 3</td><td>2 ~ 4</td><td>2-3-4 树（只考概念）</td></tr>
<tr><td>128、256 …</td><td>最多 127、255 …</td><td>最多 128、256 …</td><td>存在磁盘上的大 B 树</td></tr>
</tbody>
</table>

<div class="callout key" data-label="考点">
<p><strong>阶数数的是孩子，不是键</strong>：m 阶 = 最多 m 个孩子 = 最多 m − 1 个键。<strong>2-3 树 = 3 阶 B 树，2-3-4 树 = 4 阶 B 树。</strong></p>
<p><strong>没有 2 阶 B 树</strong>：每个结点 1 个键就是 BST，拆不出“中间键 + 左右两半”，没有东西可分裂，平衡只能靠旋转（AVL，见 3.6 AVL 旋转）。</p>
</div>

<h2>为什么把结点做大</h2>
<p>BST 的每个结点单独 malloc，孩子可能在内存的任意位置，往下走一层就要按指针去别处取数据。树大到放在磁盘上时，每跟一次指针都可能要读一块新的磁盘块，比读内存慢几个数量级。在内存里也类似：连续数组能整块进 CPU 缓存（cache），零散的结点容易缓存未命中。</p>
<p>B 树的一个结点是一段连续数组，正好一块。读进来一次就能比较很多次，树也矮得多。以 n = 10⁶ 个键为例：</p>
<ul>
<li>平衡 BST：h 层最多放 2<sup>h</sup> − 1 个键，2<sup>19</sup> − 1 = 524287 &lt; 10⁶ ≤ 2<sup>20</sup> − 1，<strong>至少 20 层</strong>，查找最坏要读 20 个散在各处的结点。</li>
<li>256 阶 B 树：h 层最多放 256<sup>h</sup> − 1 个键，256² − 1 = 65535 &lt; 10⁶ ≤ 256³ − 1 ≈ 1.7 × 10⁷，<strong>3 层就够</strong>，查找只读 3 块。</li>
</ul>

<h2>B 树改变复杂度类吗？</h2>
<p>课上的投票题：结点里的键变多、树变矮，查找的复杂度类会变好吗？<strong>不会，仍是 O(log n)</strong>。查找代价 = 层数 × 每层在结点里的工作：</p>
<ul>
<li><strong>层数</strong>约 log<sub>m</sub> n = log n / log m（换底公式，公式表上有）。m 是设计时定下的常数，所以层数仍是 Θ(log n)；分裂保证除根外每个结点至少约半满，最坏也只有约 log<sub>m/2</sub> n 层。</li>
<li>结点内<strong>线性查找</strong>：每层 O(m)，共 O(m · log n / log m)。</li>
<li>结点内<strong>二分查找</strong>（键是有序数组）：每层 O(log m)，共 O(log m · log n / log m) = <strong>O(log n)</strong>。</li>
</ul>
<p>代回上面的例子：256 阶 B 树每个结点最多 255 个键，二分查找最多比较 8 次，3 层共约 24 次，并不比 BST 的 20 次少。<strong>减少的是读块、跟指针的次数（20 → 3），比较次数没有减少</strong>：层数省下的时间都花在了结点内部的查找上。</p>

<div class="callout key" data-label="考点">
<p>“B 树能否改进查找的复杂度类？”<strong>不能：层数 log₂ n → log<sub>m</sub> n 只少了常数倍，结点内又多花 O(log m) 或 O(m)，总体仍是 O(log n)。</strong>真正的好处是访存：跟指针、读磁盘块的次数少得多。</p>
</div>

<h2>BST 里找后继要走整个树高</h2>
<p><strong>后继（successor）</strong>是比给定键大的键中最小的那个。课上的 BST（再插入 17、71）：</p>
<pre><code class="lang-text">            32
          /    \\
        14      53
       /  \\    /  \\
      9   28  42   64
         /      \\    \\
       17        50   71</code></pre>
<ul>
<li>28 的后继：28 没有右孩子，只能往上。28 是 14 的右孩子，14 更小，继续往上；14 是 32 的左孩子，<strong>后继是 32</strong>。需要 parent 指针（或查找时记下的路径），往上走了 2 层。</li>
<li>32 的后继：32 有右子树，后继是其中最小的键：先到 53，再往左到 42，<strong>后继是 42</strong>，往下走了 2 层。</li>
</ul>
<p>最坏情况两种都要走一整个树高，<strong>BST 找一次后继是 O(height)</strong>。范围查询（找出 [a, b] 内的所有键，数据库里叫过滤）要一个接一个地找后继，每一步都可能这样上下来回。普通 B 树也一样：内部结点里一个键的后继，在它右边那棵子树最左的叶子里。</p>

<h2>B+ 树：数据全在叶子，叶子连成链表</h2>
<p>B+ 树在 B 树上改了三点：</p>
<ol>
<li><strong>内部结点只存键</strong>，作为路标指示往哪个孩子走，不存数据；</li>
<li><strong>所有数据（记录）都在叶子里</strong>；</li>
<li><strong>叶子之间用 next 指针按从小到大连成链表</strong>。</li>
</ol>
<p>下图是存 10 个键的 3 阶 B+ 树（内部结点最多 3 个孩子，叶子最多 2 个键）。这里约定路标等于它右边子树里最小的键，<strong>查找键 &lt; 路标往左，≥ 路标往右</strong>。</p>

<figure class="fig">
<svg viewBox="0 0 592 226" width="592" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="3 阶 B+ 树：内部结点只存路标，叶子用 next 指针相连；范围查询 [17, 50] 先下到叶子再沿叶子扫描">
<line x1="91" y1="122" x2="54" y2="166" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="127" y1="122" x2="164" y2="166" stroke="#d97757" stroke-width="3"/>
<line x1="348" y1="122" x2="274" y2="166" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="384" y1="122" x2="384" y2="166" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="420" y1="122" x2="494" y2="166" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="228.5" y1="48" x2="109" y2="92" stroke="#d97757" stroke-width="3"/>
<line x1="264.5" y1="48" x2="384" y2="92" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="93" y1="181" x2="118" y2="181" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><polygon points="124,181 116,176 116,186" fill="rgba(255,255,255,0.45)"/>
<line x1="203" y1="181" x2="228" y2="181" stroke="#4ade80" stroke-width="2.5"/><polygon points="234,181 226,176 226,186" fill="#4ade80"/>
<line x1="313" y1="181" x2="338" y2="181" stroke="#4ade80" stroke-width="2.5"/><polygon points="344,181 336,176 336,186" fill="#4ade80"/>
<line x1="423" y1="181" x2="448" y2="181" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><polygon points="454,181 446,176 446,186" fill="rgba(255,255,255,0.45)"/>
<line x1="533" y1="181" x2="545" y2="181" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><polygon points="551,181 543,176 543,186" fill="rgba(255,255,255,0.45)"/>
<g font-size="12" fill="#a1a1a0"><text x="555" y="185">NULL</text><text x="18" y="38">内部结点：只存路标（黄）</text><text x="296" y="218" text-anchor="middle">叶子：全部数据，按 next 指针从小到大相连</text></g>
<text x="574" y="38" font-size="12" fill="#d97757" text-anchor="end">查询 [17, 50]</text>
<rect x="18" y="166" width="72" height="30" rx="6" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<line x1="54" y1="170" x2="54" y2="192" stroke="#5a5a59" stroke-width="1.5"/>
<rect x="128" y="166" width="72" height="30" rx="6" fill="#343433" stroke="#d97757" stroke-width="2.5"/>
<rect x="131" y="169" width="30" height="24" rx="4" fill="rgba(74,222,128,0.25)" stroke="#4ade80" stroke-width="1.5"/>
<rect x="167" y="169" width="30" height="24" rx="4" fill="rgba(74,222,128,0.25)" stroke="#4ade80" stroke-width="1.5"/>
<line x1="164" y1="170" x2="164" y2="192" stroke="#5a5a59" stroke-width="1.5"/>
<rect x="91" y="92" width="36" height="30" rx="6" fill="#343433" stroke="#d97757" stroke-width="2.5"/>
<rect x="238" y="166" width="72" height="30" rx="6" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<rect x="241" y="169" width="30" height="24" rx="4" fill="rgba(74,222,128,0.25)" stroke="#4ade80" stroke-width="1.5"/>
<rect x="277" y="169" width="30" height="24" rx="4" fill="rgba(74,222,128,0.25)" stroke="#4ade80" stroke-width="1.5"/>
<line x1="274" y1="170" x2="274" y2="192" stroke="#5a5a59" stroke-width="1.5"/>
<rect x="348" y="166" width="72" height="30" rx="6" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<rect x="351" y="169" width="30" height="24" rx="4" fill="rgba(74,222,128,0.25)" stroke="#4ade80" stroke-width="1.5"/>
<rect x="387" y="169" width="30" height="24" rx="4" fill="rgba(248,113,113,0.22)" stroke="#f87171" stroke-width="1.5"/>
<line x1="384" y1="170" x2="384" y2="192" stroke="#5a5a59" stroke-width="1.5"/>
<rect x="458" y="166" width="72" height="30" rx="6" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<line x1="494" y1="170" x2="494" y2="192" stroke="#5a5a59" stroke-width="1.5"/>
<rect x="348" y="92" width="72" height="30" rx="6" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<line x1="384" y1="96" x2="384" y2="118" stroke="#5a5a59" stroke-width="1.5"/>
<rect x="228.5" y="18" width="36" height="30" rx="6" fill="#343433" stroke="#d97757" stroke-width="2.5"/>
<g font-size="14" font-weight="700" text-anchor="middle">
<text fill="#e8e8e8" x="36" y="186">9</text>
<text fill="#e8e8e8" x="72" y="186">14</text>
<text fill="#e8e8e8" x="146" y="186">17</text>
<text fill="#e8e8e8" x="182" y="186">28</text>
<text fill="#fbbf24" x="109" y="112">17</text>
<text fill="#e8e8e8" x="256" y="186">32</text>
<text fill="#e8e8e8" x="292" y="186">42</text>
<text fill="#e8e8e8" x="366" y="186">50</text>
<text fill="#e8e8e8" x="402" y="186">53</text>
<text fill="#e8e8e8" x="476" y="186">64</text>
<text fill="#e8e8e8" x="512" y="186">71</text>
<text fill="#fbbf24" x="366" y="112">50</text>
<text fill="#fbbf24" x="402" y="112">64</text>
<text fill="#fbbf24" x="246.5" y="38">32</text>
</g>
</svg>
<figcaption>橙色是查找 17 的路径，绿色是范围 [17, 50] 扫到的键和用到的 next 指针，红色的 53 超过上界，扫描到此为止。路标 17、32、50、64 在叶子里又各存了一次。</figcaption>
</figure>

<ul>
<li><strong>查找 28</strong>（课上的例子）：28 &lt; 32 往左；28 ≥ 17 往右，到叶子 [17 28]。找 32 也要走到叶子：根里的 32 只是路标，32 ≥ 32 往右，32 &lt; 50 往左，到 [32 42]。</li>
<li><strong>28 的后继</strong>：28 是叶子 [17 28] 的最后一个键，沿 next 一步到 [32 42]，后继是 32，<strong>O(1)</strong>，不用回到上层。</li>
<li><strong>范围查询 [17, 50]</strong>：先像查找 17 一样走到叶子 [17 28]，O(log n)；然后沿叶子往右扫：17、28，next，32、42，next，50，遇到 53 &gt; 50 停。总代价 <strong>O(log n + k)</strong>，k 是结果个数。同一查询在上面的 BST 里逐个找后继共走 11 条边，B+ 树只跟 4 次指针（往下 2 次，next 2 次）。</li>
</ul>

<iframe class="anim-frame" src="blog/blog_data/dsa-btree-bplus/anims/bplus-range.html" loading="lazy" style="height: 500px;" title="B+ 树范围查询与 BST 逐个找后继"></iframe>
<p class="anim-caption">选范围（或自己输入上下界）后逐步播放；切到 BST 看同一查询要在树里上下走多少条边。</p>

<table>
<thead><tr><th></th><th>B 树</th><th>B+ 树</th></tr></thead>
<tbody>
<tr><td>内部结点存</td><td>键 + 数据</td><td>只有路标键，数据全在叶子</td></tr>
<tr><td>查找</td><td>可能在内部结点就结束</td><td>总要走到叶子</td></tr>
<tr><td>找后继</td><td>最坏 O(height)</td><td>O(1)，沿 next</td></tr>
<tr><td>范围查询</td><td>在树里上下来回</td><td>下到起点叶子，再沿叶子扫，O(log n + k)</td></tr>
<tr><td>空间</td><td>每个键存一次</td><td>路标键多存一次，叶子多一个 next 指针</td></tr>
</tbody>
</table>
<p>多花一点空间，换来快速的“下一个”和范围扫描，所以<strong>数据库的索引常用 B+ 树</strong>：既要按键查一条记录，也要做“年龄在 20 到 30 之间”这类过滤。</p>

<h2>C 代码：B+ 树的范围查询</h2>
<p>同一个结构体表示内部结点和叶子。真实系统的叶子存（键, 记录）对，这里只存键。</p>
<pre><code>#include &lt;stdio.h&gt;
#define ORDER 3                     /* 每个结点最多 ORDER 个孩子 */

typedef struct bpnode bpnode_t;
struct bpnode {
    int is_leaf;                    /* 1 = 叶子，0 = 内部结点 */
    int nkeys;                      /* 现有键数，最多 ORDER - 1 */
    int keys[ORDER - 1];            /* 从小到大；内部结点里只是路标 */
    bpnode_t *child[ORDER];         /* 内部结点用：nkeys + 1 个孩子 */
    bpnode_t *next;                 /* 叶子用：右边那片叶子，最后一片为 NULL */
};

/* 从根走到 key 所在（或应在）的叶子：key &gt;= 路标就往右 */
bpnode_t *find_leaf(bpnode_t *t, int key) {
    while (!t-&gt;is_leaf) {
        int i = 0;
        while (i &lt; t-&gt;nkeys &amp;&amp; key &gt;= t-&gt;keys[i]) {
            i++;
        }
        t = t-&gt;child[i];            /* 每层一次指针跳转 */
    }
    return t;
}

/* 从小到大打印 [lo, hi] 内的键，返回个数 */
int range_query(bpnode_t *root, int lo, int hi) {
    int count = 0;
    bpnode_t *leaf;
    for (leaf = find_leaf(root, lo); leaf != NULL; leaf = leaf-&gt;next) {
        for (int i = 0; i &lt; leaf-&gt;nkeys; i++) {
            if (leaf-&gt;keys[i] &gt; hi) {
                return count;       /* 后面的键只会更大，停 */
            }
            if (leaf-&gt;keys[i] &gt;= lo) {
                printf("%d\\n", leaf-&gt;keys[i]);
                count++;
            }
        }
    }
    return count;                   /* 走完最后一片叶子 */
}</code></pre>
<p><code>find_leaf</code> 每层跳一次指针，O(height)；之后每片叶子只用一次 <code>next</code>。起点叶子里可能一个符合的键都没有（练习 3），所以 <code>keys[i] &lt; lo</code> 时是跳过而不是停。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>选择 / 多选</strong>：阶数的含义；2-3 树、2-3-4 树是几阶；有没有 2 阶 B 树；叶子是否同深度；B 树和 B+ 树的区别（上表各行）。</li>
<li><strong>“B 树能否改进查找的复杂度类？”</strong>：第 12 周复习时专门提到。答“不能”，写出层数 log n / log m 和结点内 O(m) 或 O(log m) 两部分，再说明好处在访存。</li>
<li><strong>小计算</strong>：给 n 和阶数求最少层数，和 BST 比读块次数（练习 2）；在给定的 B+ 树上走一遍范围查询（练习 3）。</li>
<li><strong>要背</strong>：定义和两个考点框里的结论。公式表只给换底公式 log<sub>a</sub> x = log<sub>b</sub> x / log<sub>b</sub> a。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li>把 O(log<sub>m</sub> n) 当成更好的复杂度类，或只算层数、忘了结点内查找的代价。</li>
<li>以为普通 B 树的叶子也连成链表，或 B+ 树的查找能停在内部结点。</li>
<li>范围查询的起点叶子里可能没有结果，要接着沿 next 走，不能直接判“空”。</li>
<li>2-3-4 树只考概念、红黑树不考；2-3 树的插入分裂要会画（见 3.7）。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. 多选：下列哪些正确？A. m 阶 B 树的每个结点最多有 m 个键　B. 2-3 树是 3 阶 B 树，2-3-4 树是 4 阶 B 树　C. 2 阶 B 树每个结点 1 个键，靠分裂保持平衡　D. B 树的所有叶子在同一深度　E. 用 256 阶 B 树代替平衡 BST，查找从 O(log n) 变成更好的复杂度类 O(log₂₅₆ n)　F. B+ 树的内部结点只存键，查找总要走到叶子　G. 同样的数据，B+ 树比 B 树省空间</summary>
<div class="qa__body">
<p>选 <strong>B、D、F</strong>。</p>
<ul>
<li>A 错：m 阶是最多 m 个<strong>孩子</strong>，键最多 m − 1 个。</li>
<li>C 错：没有 2 阶 B 树。每个结点 1 个键就是 BST，没有可分裂的结点，平衡要靠旋转。</li>
<li>E 错：log₂₅₆ n = log₂ n / 8，只差常数倍，仍是 O(log n)；何况每层结点内还要查找。</li>
<li>G 错：B+ 树的路标键在叶子里又存一次，叶子还多 next 指针，更占空间。</li>
</ul>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 一个磁盘块正好放下 1000 阶 B 树的一个结点（最多 999 个键），要存 n = 10⁸ 个键。(a) B 树至少几层？平衡 BST 至少几层？(b) 查找最坏各读几块？(c) 结点内用二分查找，B 树查找最多约比较几次？(d) 复杂度类变了吗？</summary>
<div class="qa__body">
<p>(a) h 层的 1000 阶 B 树最多放 1000<sup>h</sup> − 1 个键：1000² − 1 = 999999 &lt; 10⁸ ≤ 1000³ − 1 = 999999999，所以<strong>至少 3 层</strong>。平衡 BST：2<sup>26</sup> − 1 = 67108863 &lt; 10⁸ ≤ 2<sup>27</sup> − 1 = 134217727，<strong>至少 27 层</strong>。</p>
<p>(b) 每层读一块：B 树 3 块，BST 最坏 27 个结点（每个都可能在不同的块）。</p>
<p>(c) 999 个键的有序数组，二分查找最多比较 10 次（2¹⁰ = 1024 &gt; 999），3 层共约 30 次，和 BST 的 27 次差不多。</p>
<p>(d) 没变，都是 O(log n)：log₁₀₀₀ n = log₂ n / log₂ 1000，只差常数倍，结点内二分又乘回 log₂ 1000。省下的是读块次数（27 → 3），不是比较次数。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 在正文图中的 B+ 树上做范围查询 [30, 60]：依次访问哪些结点？输出什么？一共跟了几次指针？</summary>
<div class="qa__body">
<ul>
<li>根 [32]：30 &lt; 32，往左到 [17]。</li>
<li>[17]：30 ≥ 17，往右到叶子 [17 28]。</li>
<li>[17 28]：17、28 都 &lt; 30，跳过。<strong>起点叶子里一个结果都没有</strong>：30 落在 28 和 32 之间，路标 32 把它导向了左边。</li>
<li>next 到 [32 42]：输出 32、42。</li>
<li>next 到 [50 53]：输出 50、53。</li>
<li>next 到 [64 71]：64 &gt; 60，停。</li>
</ul>
<p>访问 6 个结点：[32]、[17]、[17 28]、[32 42]、[50 53]、[64 71]；输出 <strong>32 42 50 53</strong>；跟指针 <strong>5 次</strong>（往下 2 次，next 3 次）。结果全在根的右子树里，但不需要回到根，沿叶子链表走过去就行。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 用正文的结构体写 int bp_successor(bpnode_t *root, int x, int *succ)：找比 x 大的最小键，存入 *succ 并返回 1；没有则返回 0。x 不一定在树里。代价是多少？</summary>
<div class="qa__body">
<pre><code>int bp_successor(bpnode_t *root, int x, int *succ) {
    bpnode_t *leaf;
    for (leaf = find_leaf(root, x); leaf != NULL; leaf = leaf-&gt;next) {
        for (int i = 0; i &lt; leaf-&gt;nkeys; i++) {
            if (leaf-&gt;keys[i] &gt; x) {
                *succ = leaf-&gt;keys[i];
                return 1;
            }
        }
    }
    return 0;                       /* x 不小于最大的键：没有后继 */
}</code></pre>
<p>在图中的树上：x = 28 得 32（沿 next 到下一片叶子），x = 30 也得 32，x = 14 得 17，x = 71 返回 0。</p>
<p>代价：<code>find_leaf</code> 是 O(log n)。之后最多看两片叶子：<code>find_leaf</code> 停下的叶子里没有更大的键时，下一片叶子的第一个键不小于把 x 引向左边的那个路标，而路标 &gt; x，所以它就是答案。总共 O(log n)；已经站在叶子上时只要 O(1)。</p>
</div>
</details>
`;

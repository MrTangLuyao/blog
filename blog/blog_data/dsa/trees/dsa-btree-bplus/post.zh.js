/* Post body — dsa-btree-bplus / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-btree-bplus:zh'] = `
<p class="lead">B 树（B-tree）让一个结点装很多个键，树因此很矮，跟指针、读磁盘的次数少得多，但查找仍是 O(log n)；B+ 树（B+ tree）再把数据全放进叶子、把叶子串成链表，让找“下一个”和范围查询变快。</p>

<h2>从一个场景说起：查一本厚字典</h2>
<p>查一本很厚的纸质字典，最费劲的是翻页；可一旦翻开，这一页上几百个词一眼就扫完了。</p>
<p>如果字典每页只印一个词，再写着“比它小去第几页，比它大去第几页”，那就是一棵 BST，100 万个词要翻大约 20 次。真实的字典是一页索引列出很多个范围，挑对了再翻，几次就到。</p>
<p>电脑里也一样：树存在磁盘上时，每跟一次指针都可能要读一块新的磁盘块（disk block），比读内存慢好几个数量级；在内存里，连续的数组也比零散的结点更容易整块进缓存（cache）。所以<strong>翻一页很贵，就让每一页多装点东西</strong>，这就是 B 树。</p>

<h2>B 树是什么</h2>
<p>简单说，B 树就是<strong>一个结点能放很多个键、所有叶子一样深</strong>的搜索树，是 2-3 树（见 3.7 2-3 树）的推广。它的大小用阶（order）来描述，<strong>m 阶 B 树（B-tree of order m）</strong>有三条规则：</p>
<ul>
<li><strong>结点是一个有序数组</strong>：最多 m 个孩子、最多 m − 1 个键，从小到大排好。一个结点占一块磁盘块，相当于字典的一页。</li>
<li><strong>键是路标</strong>：有 k 个键的内部结点恰有 k + 1 个孩子，每个孩子里的键都夹在它左右两个键之间。</li>
<li><strong>所有叶子在同一深度</strong>：插入和 2-3 树一样，先放进叶子，键达到 m 个就<strong>分裂（split）</strong>，中间的键提到父结点，必要时一路往上分裂，根分裂时长出新根。</li>
</ul>
<p>5 阶 B 树的一个满结点（4 个键、5 个孩子）：</p>
<pre><code class="lang-text">           [ 20 | 40 | 60 | 80 ]
          /     |    |    |     \\
       &lt;20   20~40 40~60 60~80  &gt;80</code></pre>
<p>找 50：50 夹在 40 和 60 之间，走第 3 个孩子。再看分裂：叶子 [10 20 30 40] 插入 25，变成 5 个键 [10 20 25 30 40]，超了；中间的 25 上移，剩下 [10 20] 和 [30 40]。</p>

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
<p><strong>没有 2 阶 B 树</strong>：每个结点 1 个键就是 BST，拆不出“中间键 + 左右两半”，平衡只能靠旋转（AVL，见 3.6 AVL 旋转）。</p>
</div>

<h2>B 树让查找变快了吗</h2>
<p>先看树有多矮。以 n = 10⁶ 个键为例：</p>
<ul>
<li>平衡 BST：h 层最多放 2<sup>h</sup> − 1 个键，2<sup>19</sup> − 1 = 524287 不够，<strong>至少 20 层</strong>，最坏读 20 个散在各处的结点。</li>
<li>256 阶 B 树：h 层最多放 256<sup>h</sup> − 1 个键，256² − 1 = 65535 不够，256³ − 1 ≈ 1.7 × 10⁷ 够了，<strong>3 层</strong>，只读 3 块。</li>
</ul>
<p>那复杂度类变好了吗？这是课上的投票题，答案是<strong>没有，仍是 O(log n)</strong>。查找代价 = 层数 × 每层在结点里的工夫：</p>
<ul>
<li><strong>层数</strong>约 log<sub>m</sub> n = log n / log m（换底公式）。m 是定好的常数，除以常数还是 Θ(log n)。</li>
<li><strong>每层</strong>：结点里最多 m − 1 个键，线性查找 O(m)；它是有序数组，也可以二分查找（binary search），O(log m)。</li>
<li>用二分时总共 O(log m × log n / log m) = <strong>O(log n)</strong>，log m 正好约掉。</li>
</ul>
<p>代回数字：255 个键二分最多比较 8 次，3 层共约 24 次，并不比 BST 的 20 次少。<strong>省下的是读块、跟指针的次数（20 → 3），比较次数没有省。</strong></p>

<div class="callout key" data-label="考点">
<p>“B 树能否改进查找的复杂度类？”<strong>不能：层数 log₂ n → log<sub>m</sub> n 只少了常数倍，结点内又多花 O(log m) 或 O(m)，总体仍是 O(log n)。</strong>真正的好处在访存：跟指针、读磁盘块的次数少得多。</p>
</div>

<h2>B+ 树：数据放进叶子，叶子串成链</h2>
<p>再回到字典。查“所有以 app 开头的词”，你不会每个词都回索引重查，而是翻到第一个，再往后一页页读下去。</p>
<p>BST 做不到这一点。找<strong>后继（successor）</strong>，也就是比它大的键里最小的那个，要在树里上下走。看课上的 BST（再插入 17、71）：</p>
<pre><code class="lang-text">            32
          /    \\
        14      53
       /  \\    /  \\
      9   28  42   64
         /      \\    \\
       17        50   71</code></pre>
<ul>
<li>28 的后继：28 没有右孩子，只能往上。先回到 14，比 28 小，不是；再上到 32，<strong>后继是 32</strong>。往上走了 2 层，要有 parent 指针。</li>
<li>32 的后继：在右子树里找最小的，从 53 往左走到 42，<strong>后继是 42</strong>，往下走了 2 层。</li>
</ul>
<p>最坏要走一整个树高，<strong>BST 找一次后继是 O(height)</strong>。范围查询（range query，找出 [a, b] 里的所有键，数据库里叫过滤）要一个接一个找后继，就得在树里来回跑。普通 B 树也有同样的问题。</p>
<p>简单说，<strong>B+ 树就是把数据全放到最底层、再把最底层串成链表的 B 树</strong>。它在 B 树上改了三点：</p>
<ol>
<li><strong>内部结点只存键</strong>，只当路标，像字典的索引页；</li>
<li><strong>所有数据（记录）都在叶子里</strong>，像正文页；</li>
<li><strong>叶子之间用 next 指针按从小到大串起来</strong>，像正文页一页接一页。</li>
</ol>

<h2>看个例子：在 B+ 树上做范围查询</h2>
<p>把同样 10 个键存进 3 阶 B+ 树（内部结点最多 3 个孩子，叶子最多 2 个键），得到下图。这里约定路标等于它右边子树里最小的键，<strong>查找键 &lt; 路标往左，≥ 路标往右</strong>。</p>

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

<h3>查找 28 和 32</h3>
<p>找 28（课上的例子）：在根 [32]，28 &lt; 32，往左；在 [17]，28 ≥ 17，往右，到叶子 [17 28]，找到。</p>
<p>找 32 也要一路走到叶子。根里的 32 只是路标，不带数据：32 ≥ 32 往右，32 &lt; 50 往左，到叶子 [32 42] 才拿到记录。<strong>B+ 树的查找总要走到叶子。</strong></p>

<h3>后继和范围查询 [17, 50]</h3>
<p>28 的后继：28 是叶子 [17 28] 的最后一个键，沿 next 一步到 [32 42]，后继是 32，<strong>O(1)</strong>，不用回到上层。</p>
<p>范围查询 [17, 50] 分两步：</p>
<ol>
<li><strong>往下走</strong>：像查找 17 一样走到叶子 [17 28]，O(log n)。</li>
<li><strong>往右扫</strong>：输出 17、28；next 到 [32 42]，输出 32、42；next 到 [50 53]，输出 50；遇到 53 &gt; 50，停。</li>
</ol>
<p>总代价 <strong>O(log n + k)</strong>，k 是结果个数。这里只跟了 4 次指针（往下 2 次，next 2 次）；在上面的 BST 里逐个找后继要走 11 条边。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-btree-bplus/anims/bplus-range.html" loading="lazy" style="height: 500px;" title="B+ 树范围查询与 BST 逐个找后继"></iframe>
<p class="anim-caption">默认就是 [17, 50]：逐步播放，看查询先往下到叶子，再沿 next 往右扫。再点“BST”，看同一查询要上下走多少条边。</p>

<h2>B 树和 B+ 树的区别</h2>
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
<p>多花一点空间，换来快速的“下一个”和范围扫描。数据库既要按键查一条记录，也常做“年龄在 20 到 30 之间”这类过滤，所以<strong>数据库索引常用 B+ 树</strong>。</p>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/aZjYr87r1b8" title="10.2  B Trees and B+ Trees. How they are useful in Databases" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Abdul Bari《B Trees and B+ Trees. How they are useful in Databases》（英文，约 40 分钟），从磁盘块和数据库索引讲到 B 树、B+ 树。多级索引等细节本课不考，看懂结构和用途就够。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>选择 / 多选</strong>：阶数的含义、2-3 树和 2-3-4 树是几阶、有没有 2 阶、B 树和 B+ 树的区别。</li>
<li><strong>概念题</strong>：“B 树能否改进查找的复杂度类？”第 12 周复习专门提到。答“不能”，写出层数和结点内查找两部分，再说好处在访存。</li>
<li><strong>小计算</strong>：给 n 和阶数求最少层数；在给定的 B+ 树上走一遍范围查询。</li>
</ul>
<p>公式表只给换底公式 log<sub>a</sub> x = log<sub>b</sub> x / log<sub>b</sub> a，其余要自己记。</p>

<h3>例题 1：多选</h3>
<p>下列哪些正确？A. m 阶 B 树的每个结点最多有 m 个键；B. 2-3 树是 3 阶 B 树，2-3-4 树是 4 阶 B 树；C. 2 阶 B 树每个结点 1 个键，靠分裂保持平衡；D. B 树的所有叶子在同一深度；E. 用 256 阶 B 树代替平衡 BST，查找从 O(log n) 变成更好的 O(log₂₅₆ n)；F. B+ 树的内部结点只存键，查找总要走到叶子；G. 同样的数据，B+ 树比 B 树省空间。</p>
<p><strong>答案：B、D、F。</strong></p>
<ul>
<li>A 错：m 阶是最多 m 个<strong>孩子</strong>，键最多 m − 1 个。</li>
<li>C 错：没有 2 阶 B 树，1 个键的结点就是 BST，平衡要靠旋转。</li>
<li>E 错：log₂₅₆ n = log₂ n / 8，只差常数倍，仍是 O(log n)；何况结点内还要查找。</li>
<li>G 错：路标键在叶子里又存一次，叶子还多 next 指针，B+ 树更占空间。</li>
</ul>

<h3>例题 2：算层数</h3>
<p>一个磁盘块正好放下 1000 阶 B 树的一个结点（最多 999 个键），要存 n = 10⁸ 个键。B 树和平衡 BST 各至少几层、最坏各读几块？结点内用二分，B 树约比较几次？复杂度类变了吗？</p>
<ul>
<li><strong>B 树</strong>：h 层最多 1000<sup>h</sup> − 1 个键，1000² − 1 = 999999 不够，1000³ − 1 = 999999999 够，<strong>至少 3 层，读 3 块</strong>。</li>
<li><strong>BST</strong>：2<sup>26</sup> − 1 = 67108863 不够，2<sup>27</sup> − 1 = 134217727 够，<strong>至少 27 层</strong>，最坏 27 个结点，可能各在不同的块。</li>
<li><strong>比较次数</strong>：999 个键二分最多 10 次（2¹⁰ = 1024 &gt; 999），3 层约 30 次，和 BST 的 27 次差不多。</li>
<li><strong>复杂度类</strong>：没变，都是 O(log n)。log₁₀₀₀ n = log₂ n / log₂ 1000，结点内二分又乘回 log₂ 1000。省下的是读块（27 → 3），不是比较。</li>
</ul>

<div class="callout warn" data-label="易错">
<ul>
<li>把 O(log<sub>m</sub> n) 当成更好的复杂度类，或只算层数、忘了结点内查找的代价。</li>
<li>以为普通 B 树的叶子也串成链表，或 B+ 树的查找能停在内部结点。</li>
<li>范围查询的起点叶子里可能没有结果：在上图查 [30, 60]，先到的叶子 [17 28] 两个键都 &lt; 30，要接着沿 next 走，得到 32 42 50 53，不能直接判“空”。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>m 阶 B 树：最多 m 个孩子、m − 1 个键，叶子同深度，满了就分裂。2-3 树 = 3 阶，2-3-4 树 = 4 阶，没有 2 阶。</li>
<li>把结点做大是为了少跟指针、少读磁盘块，层数约 log n / log m。</li>
<li>B 树<strong>不改变</strong>查找的复杂度类：层数少了常数倍，结点内又要 O(log m) 或 O(m)，仍是 O(log n)。</li>
<li>BST 找后继 O(height)；B+ 树数据全在叶子、叶子串成链，后继 O(1)，范围查询 O(log n + k)。</li>
<li>B+ 树多花空间换快速的范围扫描，数据库索引常用它。</li>
</ul>
`;

/* Post body — dsa-array-vs-list / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-array-vs-list:zh'] = `
<p class="lead">数组把元素挨着放，链表靠指针一个连一个。取第 k 个、查找、插入删除各要多少时间，以及期末几道常考的陷阱题，都从这一个区别推出来。</p>

<h2>从一个场景说起</h2>
<p>8 个朋友在电影院买了同一排的连号座位，从 10 号开始。第 8 个人坐哪？不用挨个问，10 + 7 = 17 号，直接走过去。</p>
<p>换成寻宝游戏：每张纸条上写着下一张藏在哪。想拿到第 8 张，只能先找到第 1 张，读出第 2 张的位置，再去找第 2 张……一张张跟下去。</p>
<p>再有个人要插到第 3 个位置。电影院里，原来第 3 个人起，后面每人都得往右挪一个座位。寻宝游戏只要把第 2 张纸条改成指向新纸条，新纸条写上原来第 3 张的位置，其余纸条不动。</p>
<p>电影院就是数组，寻宝游戏就是链表：<strong>“找第几个”数组快，“往中间插”链表快</strong>。链表的快有个前提，后面会讲。</p>

<h2>它是什么</h2>
<p>简单说，<strong>数组（array）</strong>把元素一个挨一个放在一整块连续内存里；<strong>链表（linked list）</strong>的结点（node）可以散在内存任何地方，每个结点存着下一个结点的地址（next 指针），入口只有一个 head 指针。</p>
<p>这一个区别推出三件事：</p>
<ul>
<li><strong>取第 k 个</strong>：数组按下标直接算出地址，一步到位，叫随机访问（random access），意思是取哪个都一样快。链表只能从 head 顺着 next 走 k 步。</li>
<li><strong>插入、删除</strong>：数组要把后面的元素整体挪一格；链表只改一两个指针。</li>
<li><strong>空间</strong>：链表结点多存一个指针，课上按 4 + 8 = 12 字节算（对齐后 <code>sizeof(node_t)</code> 通常是 16）。每个元素只多一个常数，仍是 O(n)。</li>
</ul>
<p>“取第 k 个”写成代码是这样：</p>
<pre><code>int x = A[k];                  /* array: one step */

node_t *p = head;              /* list: follow k next pointers */
for (int i = 0; i &lt; k; i++) {
    p = p-&gt;next;
}
int y = p-&gt;data;</code></pre>
<ul>
<li><strong>第 1 行</strong>：<code>A[k]</code> 的地址是 A + k × sizeof(int)，一次乘法加一次加法，和 n 无关，O(1)。</li>
<li><strong>第 3 行</strong>：p 先指向第 0 个结点（从 0 数起）。</li>
<li><strong>第 4–6 行</strong>：每转一圈，p 跳到下一个结点；转 k 圈后指向第 k 个。</li>
<li><strong>第 7 行</strong>：取出数据。循环 k 圈，所以是 O(k)，最坏 O(n)。</li>
</ul>
<p>把各项操作放进一张表（都是最坏情况；数组假设容量够用，不够时见 2.6）：</p>
<table>
<thead><tr><th>操作</th><th>数组</th><th>链表</th><th>原因</th></tr></thead>
<tbody>
<tr><td>空间</td><td>O(n)</td><td>O(n)</td><td>指针只多常数倍</td></tr>
<tr><td>访问第 k 个</td><td>O(1)</td><td>O(k)，最坏 O(n)</td><td>算地址 vs 从 head 数</td></tr>
<tr><td>查找（无序）</td><td>O(n)</td><td>O(n)</td><td>逐个比</td></tr>
<tr><td>查找（有序）</td><td><strong>O(log n)</strong>，二分</td><td><strong>O(n)</strong></td><td>链表跳不到中间</td></tr>
<tr><td>插入 / 删除（已找到位置）</td><td>O(n)</td><td><strong>O(1)</strong></td><td>移位 vs 改指针</td></tr>
<tr><td>建立（无序，n 次插入）</td><td>O(n)</td><td>O(n)</td><td>追加到末尾 / 插在表头</td></tr>
<tr><td>建立（有序，逐个插入）</td><td>O(n²)</td><td>O(n²)</td><td>见下文“瓶颈互换”</td></tr>
<tr><td>缓存局部性</td><td>好</td><td>差</td><td>连续 vs 分散</td></tr>
</tbody>
</table>
<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/lC-yYCOnN8Q" title="Data Structures: Arrays vs Linked Lists" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：mycodeschool《Data Structures: Arrays vs Linked Lists》（英文，约 12 分钟），从访问、内存、插入删除几方面对比两者，可对照上表看。</p>

<h2>看个例子</h2>
<p>int 数组 A 从地址 1000 开始，每个 int 占 4 字节。A[7] 在哪？1000 + 7 × 4 = <strong>1028</strong>，算一次就到。</p>
<p>链表的第 7 个结点，地址写在第 6 个结点的 next 里，第 6 个的地址又写在第 5 个里……所以只能从 head 出发走 7 步。</p>
<iframe class="anim-frame" src="blog/blog_data/dsa-array-vs-list/anims/jump-vs-walk.html" loading="lazy" style="height: 540px;" title="数组按下标取址与链表顺着 next 走的步数对比"></iframe>
<p class="anim-caption">默认是“取第 k 个”、k = 7：数组 1 步取到 34，链表的 p 要移动 7 次。拖动滑块换 k，k 越大差得越多。</p>

<h3>有序链表能二分吗</h3>
<p>第 3 周课上的投票题：数组排好序后，用二分查找（binary search），查找从 O(n) 降到 O(log n)。那链表排好序呢？</p>
<p><strong>没有用。</strong>二分每一步都要“跳到中间”，链表光走到第一个中点就要约 n/2 步。动画切到“链表上二分”：比较次数和数组一样只有约 log₂ n 次，可 p 移动的次数从不比顺序查找（linear search）少。</p>
<p>有序给链表的唯一好处是<strong>能提前停</strong>：遇到比 key 大的结点，就能断定 key 不在。在动画那 15 个数（3, 8, 12, 17, 21, …, 66）里找 20，看到 21 就停，共看 5 个结点；但找 66 或更大的数仍要看完 15 个，<strong>最坏仍是 O(n)</strong>。</p>

<h2>补充：插入 O(1) 的前提</h2>
<p>“链表插入是 O(1)”只算改指针这一步（2.4 讲过这两行为什么不能对调）：</p>
<pre><code>new-&gt;next = prev-&gt;next;   /* new points to the node after prev */
prev-&gt;next = new;         /* prev now points to new */</code></pre>
<p>第 1 行让新结点接上 prev 原来的后继，第 2 行让 prev 指向新结点。两行都要用到 <strong>prev，即插入位置前面那个结点（前驱，predecessor）的指针</strong>。</p>
<p>题目只说“插到第 k 个位置”或“插到 X 后面”时，得先从 head 走过去找 prev，这一步是 O(k) 或 O(n)。只有插在表头不用找，总是 O(1)。数组正好反过来：找位置快（下标 O(1)，有序时二分 O(log n)），慢在移位 O(n)。</p>
<p>所以逐个插入建有序结构时<strong>瓶颈互换</strong>：有序数组定位 O(log n)、移位 O(n)；有序链表找位置 O(n)、接上 O(1)。第 i 次插入最多约 i 步，合计 1 + 2 + … + n = n(n+1)/2，<strong>两边都是 O(n²)</strong>。</p>

<h2>补充：字典该用哪种</h2>
<p>课上的字典（dictionary）例子：先逐个插入 n 项，再查找 m 次。把上面的代价代进去：</p>
<table>
<thead><tr><th>实现</th><th>建立（n 次插入）</th><th>m 次查找</th><th>合计</th></tr></thead>
<tbody>
<tr><td>无序数组</td><td>n × O(1) = O(n)</td><td>m × O(n)</td><td><strong>O(nm)</strong></td></tr>
<tr><td>有序数组</td><td>n × (O(log n) + O(n)) = O(n²)</td><td>m × O(log n)</td><td><strong>O(n² + m log n)</strong></td></tr>
<tr><td>无序链表</td><td>n × O(1)（插在表头）= O(n)</td><td>m × O(n)</td><td><strong>O(nm)</strong></td></tr>
<tr><td>有序链表</td><td>n × (O(n) + O(1)) = O(n²)</td><td>m × O(n)</td><td><strong>O(n² + nm)</strong></td></tr>
</tbody>
</table>
<p>无序结构的插入记作 O(1)，沿用课上的假设：不检查键是否重复。</p>
<p>有序数组划不划算要看 m。取 n = 10⁴（log₂ n ≈ 13.3）：m = 10⁶ 时，有序数组约 10⁸ + 10⁶ × 13.3 ≈ 1.1 × 10⁸，无序约 10¹⁰，有序数组胜；m = 100 时，无序约 10⁶，有序数组光建立就要 10⁸，无序胜。</p>
<p><strong>有序链表永远不划算</strong>：多付了 O(n²) 的建立，查找一点没快。查找、插入都快的结构要等第 3 部分的二叉搜索树（BST）。</p>

<h2>补充：同是 O(n)，数组更快</h2>
<p>Big-O 只数操作次数，不管每次读内存多快。CPU 读内存时一次把一整块（缓存行，cache line，常见 64 字节，即 16 个 int）搬进缓存（cache）。顺序读数组，搬来的块里就有接下来要用的元素；链表结点各自 malloc、散在各处，每走一次 next 都可能要搬新的一块。这叫<strong>缓存局部性（cache locality）</strong>。</p>
<figure class="fig">
<svg viewBox="0 0 400 244" width="400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="数组的 8 个元素落在 2 个相邻的内存块里；链表的 8 个结点散在 8 个不同的块里，next 指针在块之间跳">
<defs><marker id="dsa25-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#d97757"/></marker></defs>
<text x="12" y="18" fill="#e8e8e8" font-size="13">数组 int A[8]：8 个元素连续存放</text>
<g fill="#343433" stroke="#5a5a59" stroke-width="1.5">
<rect x="12" y="28" width="20" height="26"/><rect x="32" y="28" width="20" height="26"/><rect x="52" y="28" width="20" height="26"/><rect x="72" y="28" width="20" height="26"/>
<rect x="92" y="28" width="20" height="26"/><rect x="112" y="28" width="20" height="26"/><rect x="132" y="28" width="20" height="26"/><rect x="152" y="28" width="20" height="26"/>
</g>
<g fill="#e8e8e8" font-size="11" text-anchor="middle">
<text x="22" y="45">A0</text><text x="42" y="45">A1</text><text x="62" y="45">A2</text><text x="82" y="45">A3</text>
<text x="102" y="45">A4</text><text x="122" y="45">A5</text><text x="142" y="45">A6</text><text x="162" y="45">A7</text>
</g>
<g fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 3">
<rect x="12" y="28" width="80" height="26" rx="3"/><rect x="92" y="28" width="80" height="26" rx="3"/>
</g>
<text x="186" y="46" fill="#d97757" font-size="13" font-weight="700">顺序读完：取 2 块</text>
<text x="12" y="86" fill="#e8e8e8" font-size="13">链表 8 个结点：各自 malloc，散在各处</text>
<g fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1">
<rect x="12" y="112" width="20" height="26"/><rect x="32" y="112" width="20" height="26"/><rect x="52" y="112" width="20" height="26"/><rect x="72" y="112" width="20" height="26"/>
<rect x="110" y="112" width="20" height="26"/><rect x="130" y="112" width="20" height="26"/><rect x="150" y="112" width="20" height="26"/><rect x="170" y="112" width="20" height="26"/>
<rect x="208" y="112" width="20" height="26"/><rect x="228" y="112" width="20" height="26"/><rect x="248" y="112" width="20" height="26"/><rect x="268" y="112" width="20" height="26"/>
<rect x="306" y="112" width="20" height="26"/><rect x="326" y="112" width="20" height="26"/><rect x="346" y="112" width="20" height="26"/><rect x="366" y="112" width="20" height="26"/>
<rect x="12" y="168" width="20" height="26"/><rect x="32" y="168" width="20" height="26"/><rect x="52" y="168" width="20" height="26"/><rect x="72" y="168" width="20" height="26"/>
<rect x="110" y="168" width="20" height="26"/><rect x="130" y="168" width="20" height="26"/><rect x="150" y="168" width="20" height="26"/><rect x="170" y="168" width="20" height="26"/>
<rect x="208" y="168" width="20" height="26"/><rect x="228" y="168" width="20" height="26"/><rect x="248" y="168" width="20" height="26"/><rect x="268" y="168" width="20" height="26"/>
<rect x="306" y="168" width="20" height="26"/><rect x="326" y="168" width="20" height="26"/><rect x="346" y="168" width="20" height="26"/><rect x="366" y="168" width="20" height="26"/>
</g>
<g fill="rgba(217,119,87,0.22)" stroke="#d97757" stroke-width="1.5">
<rect x="32" y="112" width="20" height="26"/><rect x="170" y="112" width="20" height="26"/><rect x="208" y="112" width="20" height="26"/><rect x="346" y="112" width="20" height="26"/>
<rect x="52" y="168" width="20" height="26"/><rect x="110" y="168" width="20" height="26"/><rect x="268" y="168" width="20" height="26"/><rect x="326" y="168" width="20" height="26"/>
</g>
<g fill="#e8e8e8" font-size="11" text-anchor="middle">
<text x="42" y="129">n0</text><text x="180" y="129">n1</text><text x="218" y="129">n2</text><text x="356" y="129">n3</text>
<text x="62" y="185">n4</text><text x="120" y="185">n5</text><text x="278" y="185">n6</text><text x="336" y="185">n7</text>
</g>
<g fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 3">
<rect x="12" y="112" width="80" height="26" rx="3"/><rect x="110" y="112" width="80" height="26" rx="3"/><rect x="208" y="112" width="80" height="26" rx="3"/><rect x="306" y="112" width="80" height="26" rx="3"/>
<rect x="12" y="168" width="80" height="26" rx="3"/><rect x="110" y="168" width="80" height="26" rx="3"/><rect x="208" y="168" width="80" height="26" rx="3"/><rect x="306" y="168" width="80" height="26" rx="3"/>
</g>
<g fill="none" stroke="#d97757" stroke-width="1.5" marker-end="url(#dsa25-ah)">
<path d="M42,112 Q111,88 180,112"/><path d="M180,112 Q199,94 218,112"/><path d="M218,112 Q287,88 356,112"/>
<path d="M356,138 C356,156 62,150 62,168"/>
<path d="M62,194 Q91,218 120,194"/><path d="M120,194 Q199,222 278,194"/><path d="M278,194 Q307,218 336,194"/>
</g>
<text x="12" y="238" fill="#d97757" font-size="13" font-weight="700">顺着 next 读完：最多取 8 块</text>
</svg>
<figcaption>虚线框是一次搬进缓存的一块（为画得下，按每块 4 个 int 画）。</figcaption>
</figure>
<p>所以遍历、线性查找这类两边都是 Θ(n) 的操作，数组实际通常快得多。第 12 周订单簿客座讲座的实测也是这样：价格档位存进有序数组做线性扫描，比 AVL 树、有序链表、B 树和二分查找都快（见 8.1）。<strong>Big-O 相同不等于一样快。</strong></p>

<h2>补充：链表的三种变体</h2>
<ul>
<li><strong>尾指针（tail）</strong>：多存一个指向最后结点的指针，末尾追加变成 O(1)，但<strong>删尾仍是 O(n)</strong>。</li>
<li><strong>双向链表（doubly linked list）</strong>：结点再存一个 prev 指针，前驱就是 <code>p-&gt;prev</code>。空间仍是 O(n)。</li>
<li><strong>捷径指针</strong>：给有序链表加上指向中点、四分点……的指针，就能像二分一样跳（跳表 skip list 的思路）。每段中点都存成指针，就得到一棵二叉树（见 3.1）。</li>
</ul>
<p>各操作的最坏情况（“删结点 p”指手里已有指向中间某结点的指针 p）：</p>
<table>
<thead><tr><th></th><th>表头插入</th><th>表尾插入</th><th>删表头</th><th>删表尾</th><th>删结点 p</th></tr></thead>
<tbody>
<tr><td>单向，只有 head</td><td>O(1)</td><td>O(n)</td><td>O(1)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>单向，head + tail</td><td>O(1)</td><td>O(1)</td><td>O(1)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>双向，head + tail</td><td>O(1)</td><td>O(1)</td><td>O(1)</td><td>O(1)</td><td>O(1)</td></tr>
</tbody>
</table>
<p>单向链表删表尾、删结点 p 都要改前驱的 next，前驱只能从 head 走过去找，tail 帮不上忙。按第二行，单向链表做队列应在表尾入队、表头出队，两头都是 O(1)（见 2.7）。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>选择、短答</strong>：对比表逐行出题（例题 2）。往年卷问过 n 项无序链表插入一项的最紧上界：O(1)，插在表头。</li>
<li><strong>填表</strong>：字典四种实现的合计；逐个插入建有序结构是 O(n²)，不是 O(n log n)。</li>
<li><strong>最好 / 最坏</strong>：例题 1。</li>
<li><strong>读代码</strong>：取第 k 个、找中间结点、删尾。先看要不要从 head 走、要不要前驱指针。</li>
</ul>
<p>公式表上只用得到 n(n+1)/2，两张表要自己记。</p>

<h3>例题 1：在 X 后面插入</h3>
<p>第 4 周的课堂测验题，期末复习又出了一次：有序数组和链表各存 n 个不同元素，要先找到已有元素 X，再在它<strong>紧后面</strong>插入新元素（数组末尾有空位）。最坏、最好各是多少？</p>
<p>代价 = 找 X + 插入，是<strong>同一个 X 的两步相加</strong>。</p>
<ul>
<li><strong>有序数组</strong>（二分找 X，再把后面的元素右移一格）：最坏 <strong>O(n)</strong>，X 是第一个，二分后要右移 n − 1 个；最好 <strong>Θ(log n)</strong>，X 是最后一个，不用移位，但二分要约 log₂ n 次才走到末尾。</li>
<li><strong>链表</strong>（从 head 比较找 X，再改两个指针）：最坏 <strong>O(n)</strong>，X 是最后一个，比较 n 次；最好 <strong>Θ(1)</strong>，X 是头结点，比较 1 次。</li>
</ul>
<p>最常见的错答是“数组最好 O(1)”：二分 1 次就命中要求 X 在正中间，不用移位要求 X 在末尾，这是两个不同的 X，不能各取最好再相加（逐个 X 的实算见 1.7）。链表这题有序、无序答案一样，因为找 X 都得从头走。</p>

<h3>例题 2：多选</h3>
<p>哪些正确？(A) 链表多存指针，空间复杂度比数组高；(B) 有序链表可以二分，查找 O(log n)；(C) 已有结点 q 的指针，在 q 后插入是 O(1)；(D) 只给位置 k，插到链表第 k 个位置是 O(1)；(E) 遍历两者都是 Θ(n)，但数组实际通常更快。</p>
<p><strong>C、E。</strong>A 错：每个元素只多一个常数，仍是 O(n)。B 错：走到中点就要约 n/2 步，仍是 O(n)。C 对：只改两个指针。D 错：要先从 head 走 k − 1 步找前驱，O(k)，最坏 O(n)。E 对：缓存局部性。</p>

<h2>小结</h2>
<ul>
<li>取第 k 个：数组 O(1)；链表从 head 走，O(k)，最坏 O(n)。</li>
<li>有序链表不能二分，查找仍是 O(n)。</li>
<li>链表插入 O(1) 的前提是已有前驱指针；数组慢在移位。逐个插入建有序结构两边都是 O(n²)。</li>
<li>空间都是 O(n)；Big-O 相同时，数组因缓存局部性通常更快。</li>
<li>tail 让追加变 O(1)，但单向链表删尾仍是 O(n)。</li>
</ul>
`;

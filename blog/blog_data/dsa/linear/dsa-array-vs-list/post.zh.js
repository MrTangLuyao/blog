/* Post body — dsa-array-vs-list / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-array-vs-list:zh'] = `
<p class="lead">数组和链表都存一串元素，差别在于：数组的元素在内存里连续排列，按下标就能算出地址；链表的结点散在各处，只能从 head 顺着 next 一个个走。两者各项操作的复杂度，以及几道常考的陷阱题，都由这一条推出。</p>

<h2>取第 k 个元素：算地址 vs 数结点</h2>
<p>设 int 数组 A 从地址 1000 开始，A[7] 的地址就是 1000 + 7 × 4 = 1028。一次乘法加一次加法，与 n 无关，这就是随机访问（random access）。链表只保存 head：第 7 个结点（从 0 数起）的地址写在第 6 个结点的 next 里，第 6 个的地址又写在第 5 个里……只能从 head 出发走 7 步。</p>
<pre><code>int x = A[k];                  /* array: address A + k*sizeof(int), one step */

node_t *p = head;              /* list: follow k next pointers */
for (int i = 0; i &lt; k; i++) {
    p = p-&gt;next;
}
int y = p-&gt;data;</code></pre>
<p>所以<strong>取第 k 个：数组 O(1)，链表 O(k)，最坏 O(n)</strong>。取中间元素时 k ≈ n/2，链表仍是 O(n)。二分查找每一步都要取当前范围的中点，链表在这一步就输了。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-array-vs-list/anims/jump-vs-walk.html" loading="lazy" style="height: 540px;" title="数组按下标取址与链表顺着 next 走的步数对比"></iframe>
<p class="anim-caption">“取第 k 个”模式拖动下标，看两边各要几步；切到“链表上二分”，比较次数和数组一样少，但 p 的移动次数从不少于顺序查找。</p>

<h2>对比表</h2>
<table>
<thead><tr><th>操作</th><th>数组</th><th>链表</th><th>原因</th></tr></thead>
<tbody>
<tr><td>空间</td><td>O(n)</td><td>O(n)</td><td>每个结点多一个指针，只差常数倍</td></tr>
<tr><td>访问第 k 个</td><td>O(1)</td><td>O(k)，最坏 O(n)</td><td>数组按下标算地址；链表从 head 数</td></tr>
<tr><td>查找（无序）</td><td>O(n)</td><td>O(n)</td><td>都只能逐个比较</td></tr>
<tr><td>查找（有序）</td><td><strong>O(log n)</strong>，二分</td><td><strong>O(n)</strong></td><td>链表跳不到中点</td></tr>
<tr><td>已知位置的插入 / 删除</td><td>O(n)</td><td><strong>O(1)</strong></td><td>数组要移位；链表只改一两个指针</td></tr>
<tr><td>建立（无序，n 次插入）</td><td>O(n)</td><td>O(n)</td><td>数组追加到末尾；链表插在表头</td></tr>
<tr><td>建立（有序，逐个插入）</td><td>O(n²)</td><td>O(n²)</td><td>见下文“瓶颈互换”</td></tr>
<tr><td>缓存局部性</td><td>好</td><td>差</td><td>连续存放 vs 分散存放</td></tr>
</tbody>
</table>
<p>表中都是最坏情况；数组假设容量够用（不够时见 2.6）。</p>

<h3>空间：多一个指针，仍是 O(n)</h3>
<p>int 数组每个元素 4 字节；链表结点还要存 8 字节的 next（64 位机器），课上按 4 + 8 = 12 字节算，编译器对齐后 <code>sizeof(node_t)</code> 通常是 16。这是<strong>每个元素多出的常数</strong>，合计仍是 O(n)：“链表更占内存”对，“链表的空间复杂度更高”错。</p>

<h3>有序链表不能二分</h3>
<p>第 3 周的投票题：数组排好序后，查找从 O(n) 降到 O(log n)；链表排好序呢？<strong>没有好处：建有序链表要 O(n²)，查找仍是 O(n)。</strong>动画里硬做二分，比较只有约 log₂ n 次，但光走到第一个中点就要约 n/2 步。有序给链表带来的只是<strong>提前停</strong>：遇到比 key 大的结点，就能断定 key 不在。</p>
<pre><code>node_t *sorted_find(node_t *head, int key) {
    node_t *p = head;
    while (p != NULL &amp;&amp; p-&gt;data &lt; key) {    /* stop at first data &gt;= key */
        p = p-&gt;next;
    }
    return (p != NULL &amp;&amp; p-&gt;data == key) ? p : NULL;
}</code></pre>
<p>在动画的 15 个数（3, 8, 12, …, 66）里找 20，看过 3、8、12、17、21 共 5 个结点就停（21 &gt; 20）；找 66 或更大的 key 仍要看完 15 个，<strong>最坏仍是 O(n)</strong>。</p>

<h3>“链表插入 O(1)”的前提</h3>
<p>O(1) 只算改指针这一步，前提是<strong>手里已经有前驱结点的指针</strong>（2.4：<code>new-&gt;next = prev-&gt;next; prev-&gt;next = new;</code>）。题目只说“插到第 k 个位置”或“插到 X 后面”时，要先从 head 走过去，是 O(k) 或 O(n)；插在表头不用找，总是 O(1)。数组正好相反：定位可以是 O(1)（下标）或 O(log n)（二分），慢在移位。</p>
<p>所以逐个插入建有序结构时<strong>瓶颈互换</strong>：数组定位 O(log n)、移位 O(n)；链表接上 O(1)、找位置 O(n)。第 i 次插入最多约 i 步，合计 1 + 2 + … + n = n(n+1)/2，两者都是 <strong>O(n²)</strong>。</p>

<h2>字典：n 次插入 + m 次查找</h2>
<p>课上的字典例子：先逐个插入 n 项，再查找 m 次。</p>
<table>
<thead><tr><th>实现</th><th>建立（n 次插入）</th><th>m 次查找</th><th>合计</th></tr></thead>
<tbody>
<tr><td>无序数组</td><td>n × O(1) = O(n)</td><td>m × O(n)</td><td><strong>O(nm)</strong></td></tr>
<tr><td>有序数组</td><td>n × (O(log n) + O(n)) = O(n²)</td><td>m × O(log n)</td><td><strong>O(n² + m log n)</strong></td></tr>
<tr><td>无序链表</td><td>n × O(1)（插在表头）= O(n)</td><td>m × O(n)</td><td><strong>O(nm)</strong></td></tr>
<tr><td>有序链表</td><td>n × (O(n) + O(1)) = O(n²)</td><td>m × O(n)</td><td><strong>O(n² + nm)</strong></td></tr>
</tbody>
</table>
<p>无序结构的 O(n) 建立并进了 O(nm)（m ≥ 1）。有序数组划不划算取决于 m 和 n（见 2.3）。<strong>有序链表永远不划算</strong>：多付了 O(n²) 的建立，查找一点没快。要查找快、插入也快，就得靠第 3 部分的二叉搜索树（BST）。</p>
<div class="callout note" data-label="注意">
<p>无序结构的插入记作 O(1)，沿用课上的假设：不检查键是否重复。若每次插入前都先查一遍，建立就变成 O(n²)。</p>
</div>

<h2>在 X 后面插入：最好与最坏</h2>
<p>第 4 周的课堂测验题，期末复习又出了一次：有序数组和链表各存 n 个不同元素，要在已有元素 X 的<strong>紧后面</strong>插入新元素，数组末尾有空位。要先找到 X，再插入。</p>
<table>
<thead><tr><th></th><th>最坏</th><th>最好</th></tr></thead>
<tbody>
<tr><td>有序数组</td><td><strong>O(n)</strong>：X 是第一个，二分 O(log n) 后右移 n − 1 个</td><td><strong>Θ(log n)</strong>：X 是最后一个，不用移位，但二分要约 log₂ n 次才走到末尾</td></tr>
<tr><td>链表</td><td><strong>O(n)</strong>：X 是最后一个，从头比较 n 个结点，再 O(1) 接上</td><td><strong>Θ(1)</strong>：X 是头结点，比较 1 次就找到</td></tr>
</tbody>
</table>
<p>常见错答是数组最好 O(1)：“二分 1 次就命中”要求 X 在正中，“不用移位”要求 X 在末尾，不是同一个 X，不能各取最好再相加（逐个 X 的实算见 1.7）。链表这题有序、无序答案相同，因为找 X 都得从头走。</p>

<h2>缓存局部性：同是 O(n)，数组更快</h2>
<p>Big-O 只数操作次数，不管每次访问内存多快。CPU 读内存时会把整块（缓存行，cache line，常见为 64 字节，即 16 个 int）取进缓存。顺序读数组，取来的块里就有接下来要用的元素；链表结点各自 malloc，每走一次 next 都可能要取新的一块。</p>
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
<figcaption>虚线框是一次从内存取进缓存的一块（为了画得下，按每块 4 个 int 画）。读数组时一块带回 4 个相邻元素；链表每走一次 next，都可能落进另一块。</figcaption>
</figure>
<p>遍历、线性查找这类两边都是 Θ(n) 的操作，数组实际通常快得多。第 12 周订单簿客座讲座的实测也如此：价格档位存进有序数组做线性扫描，比 AVL 树、有序链表、B 树和二分查找都快，通常的解释就是缓存局部性（见 8.1）。<strong>Big-O 相同不等于一样快。</strong></p>

<h2>链表的变体</h2>
<p><strong>尾指针（tail）</strong>：末尾追加变成 O(1)，但<strong>删尾仍是 O(n)</strong>：要改的是倒数第二个结点的 next，单向链表只能从 head 走过去找它。</p>
<pre><code>typedef struct {
    node_t *head;   /* first node, NULL if empty */
    node_t *tail;   /* last node,  NULL if empty */
} list_t;

/* O(1): the tail pointer says where the end is */
void list_append(list_t *L, int x) {
    node_t *new = malloc(sizeof(*new));
    assert(new != NULL);
    new-&gt;data = x;
    new-&gt;next = NULL;
    if (L-&gt;tail == NULL) {           /* empty list */
        L-&gt;head = new;
    } else {
        L-&gt;tail-&gt;next = new;         /* old last node -&gt; new */
    }
    L-&gt;tail = new;
}

/* O(n): tail finds the last node, but the node BEFORE it must change */
void list_delete_last(list_t *L) {
    if (L-&gt;head == NULL) {
        return;
    }
    if (L-&gt;head == L-&gt;tail) {        /* only one node */
        free(L-&gt;head);
        L-&gt;head = L-&gt;tail = NULL;
        return;
    }
    node_t *q = L-&gt;head;
    while (q-&gt;next != L-&gt;tail) {     /* walk to the second last node */
        q = q-&gt;next;
    }
    node_t *p = L-&gt;tail;             /* keep hold of the node to delete */
    q-&gt;next = NULL;
    L-&gt;tail = q;
    free(p);
}</code></pre>
<p><code>node_t</code> 与 2.4 相同（<code>int data</code> 加 <code>next</code>）。依次追加 1 到 5，删尾两次剩 1 2 3（tail 指向 3），再追加 9 得 1 2 3 9。空表和只剩一个结点时 head、tail 要一起改，这两种情况最常漏。</p>
<p><strong>双向链表（doubly linked list）</strong>：结点再存一个 prev 指针，可以从后往前遍历。手里有指向结点的指针 p 时，前驱就是 <code>p-&gt;prev</code>，删除 p 是 O(1)；有 tail 时删尾也是 O(1)。空间仍是 O(n)。</p>
<p><strong>捷径指针</strong>：给有序链表加上指向中点、四分点……的指针，就能像二分那样跳，查找降到 O(log n)（跳表 skip list 的思路）。课上称之为折中：指针越加越多，论访问的灵活性还是数组占优。把每一段的中点都存成指针，就得到一棵二叉树（见 3.1）。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>选择、判断</strong>：对比表逐行出题。高频的三句：有序链表能否二分（不能）；链表空间复杂度是否更高（不是，都是 O(n)）；链表插入是否总是 O(1)（要先有前驱指针）。</li>
<li><strong>一分短答</strong>：往年卷问过往 n 项的无序链表插入一项的最紧上界（O(1)，插在表头），也问过有序链表的情形（O(n)，先走到位置）。</li>
<li><strong>填表</strong>：字典四行的合计；逐个插入建有序结构是 O(n²)，不是 O(n log n)。</li>
<li><strong>最好 / 最坏</strong>：在 X 后插入，有序数组最好 Θ(log n)、链表最好 Θ(1)，最坏都是 O(n)；“删除 X”同理，对同一个 X 把两步代价相加。</li>
<li><strong>读写代码</strong>：取第 k 个、找中间结点、删尾。先看要不要从 head 走、要不要前驱指针，再写复杂度；空表和单结点单独处理。</li>
<li>两张表要记住；公式表上能用到的只有等差数列求和 n(n+1)/2，用来推 O(n²)。</li>
</ul>

<h2>练习</h2>

<details class="qa">
<summary class="ripple-surface">1. 多选：哪些说法正确？(A) 链表每个结点多存一个指针，所以空间复杂度比数组高；(B) 链表排好序后可以二分查找，查找变成 O(log n)；(C) 已有指向结点 q 的指针时，在 q 后面插入新结点是 O(1)；(D) 只给出位置 k，把新元素插到链表的第 k 个位置是 O(1)；(E) 逐个插入建有序数组和建有序链表都是 O(n²)，前者慢在移位，后者慢在找位置；(F) 遍历全部 n 个元素两者都是 Θ(n)，但数组实际上通常更快。</summary>
<div class="qa__body">
<p><strong>C、E、F。</strong></p>
<p>A 错：多出的指针是每个元素一个常数，空间仍是 O(n)。B 错：链表没有随机访问，走到中点就要约 n/2 步，查找仍是 O(n)。D 错：要先从 head 走 k − 1 步找到前驱，是 O(k)，最坏 O(n)。C 只改两个指针：<code>new-&gt;next = q-&gt;next; q-&gt;next = new;</code>。E 是“瓶颈互换”。F 是缓存局部性。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 字典要先逐个插入 n = 10⁴ 项，再查找 m 次。按 Big-O 合计式估算操作数量级（忽略常数，log₂ 10⁴ ≈ 13.3），比较无序数组、有序数组、无序链表、有序链表：(a) m = 10⁶；(b) m = 100。各选哪种？</summary>
<div class="qa__body">
<p>(a) m = 10⁶：</p>
<ul>
<li>无序数组、无序链表：n + nm ≈ 10⁴ × 10⁶ = 10¹⁰。</li>
<li>有序数组：n² + m log₂ n ≈ 10⁸ + 10⁶ × 13.3 ≈ 1.13 × 10⁸。</li>
<li>有序链表：n² + nm = 10⁸ + 10¹⁰ ≈ 1.01 × 10¹⁰。</li>
</ul>
<p>选<strong>有序数组</strong>，约为无序结构的 1/88。</p>
<p>(b) m = 100：无序数组、无序链表 n + nm = 10⁴ + 10⁶ ≈ 1.01 × 10⁶；有序数组 10⁸ + 100 × 13.3 ≈ 10⁸；有序链表 10⁸ + 10⁶ ≈ 1.01 × 10⁸。选<strong>无序</strong>结构：建有序数组的 n² 远超省下的查找。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 填出每种链表上各操作的最坏时间复杂度：(1) 表头插入；(2) 表尾插入；(3) 删除表头；(4) 删除表尾；(5) 已有指针 p 指向某个中间结点，删除它。三种链表：(a) 单向，只有 head；(b) 单向，有 head 和 tail；(c) 双向，有 head 和 tail。</summary>
<div class="qa__body">
<table>
<thead><tr><th></th><th>(1)</th><th>(2)</th><th>(3)</th><th>(4)</th><th>(5)</th></tr></thead>
<tbody>
<tr><td>(a) 单向，head</td><td>O(1)</td><td>O(n)</td><td>O(1)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>(b) 单向，head + tail</td><td>O(1)</td><td>O(1)</td><td>O(1)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>(c) 双向，head + tail</td><td>O(1)</td><td>O(1)</td><td>O(1)</td><td>O(1)</td><td>O(1)</td></tr>
</tbody>
</table>
<p>(a) 表尾插入要先走到最后一个结点。(4) 和 (5) 在单向链表里都要改前驱的 next，而前驱只能从 head 走过去找，所以 tail 救不了删尾。(c) 里前驱就是 <code>p-&gt;prev</code>：<code>p-&gt;prev-&gt;next = p-&gt;next; p-&gt;next-&gt;prev = p-&gt;prev; free(p);</code>，全是 O(1)。</p>
<p>按 (b) 这一行，单向链表做队列时应在表尾入队、表头出队，两头都是 O(1)（见 2.7）。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 用 C 写 <code>node_t *list_middle(node_t *head)</code>：返回 n 个结点的单向链表中下标为 ⌊(n − 1)/2⌋ 的结点（从 0 数起，n = 4 时返回第 1 个），空表返回 NULL。时间复杂度是多少？数组上同样的操作呢？</summary>
<div class="qa__body">
<p>链表不知道长度，也跳不到中间：先走一遍数出 n，再从 head 走 (n − 1)/2 步。</p>
<pre><code>node_t *list_middle(node_t *head) {
    int n = 0;
    for (node_t *p = head; p != NULL; p = p-&gt;next) {   /* pass 1: count */
        n++;
    }
    node_t *p = head;
    for (int i = 0; i &lt; (n - 1) / 2; i++) {            /* pass 2: walk */
        p = p-&gt;next;
    }
    return p;                                          /* NULL if empty */
}</code></pre>
<p>空表时 n = 0，C 的整数除法向 0 取整，(0 − 1)/2 = 0，第二个循环不执行，返回 NULL。两遍共走约 1.5n 步，<strong>O(n)</strong>；用快慢指针（一个每次走 1 步，一个每次走 2 步）可以一遍完成，仍是 O(n)。数组知道 n，直接返回 <code>&amp;A[(n - 1) / 2]</code>，<strong>O(1)</strong>。</p>
</div>
</details>
`;

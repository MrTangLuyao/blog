/* Post body — dsa-cheatsheet-structures / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-cheatsheet-structures:zh'] = `
<p class="lead">字典（dictionary）各种实现的 find、insert、delete、build 在最好、平均、最坏情况下的代价和空间，栈（stack）与队列（queue）的数组、链表实现，优先队列（priority queue）的各种实现，以及堆的下标公式：这是期末复习课要求能自己填出的几张表，每一格都能由“先定位、再修改”推出来。</p>

<h2>一格怎么填：先定位，再修改</h2>
<p>字典的 insert、delete 都分两步：先<strong>定位</strong>（找到键或插入位置），再<strong>修改</strong>（移位、改指针、旋转）。分析某一种情况（最好、平均、最坏）时，要先固定<strong>同一个输入</strong>，再把两步在这个输入上的代价相加。期末复习课拿有序数组的插入举例。设数组存 10, 20, …, 150 共 n = 15 个键，要在已有元素 X 的紧后面插入新键：先二分查找 X（课上的规则：偶数个时取靠右的中间），再把 X 后面的元素各右移一格：</p>
<table>
<thead><tr><th>X</th><th>二分比较</th><th>右移</th><th>合计</th></tr></thead>
<tbody>
<tr><td>80（正中）</td><td>1</td><td>7</td><td>8</td></tr>
<tr><td>150（末尾）</td><td>4</td><td>0</td><td><strong>4</strong></td></tr>
<tr><td>10（开头）</td><td>4</td><td>14</td><td>18</td></tr>
</tbody>
</table>
<p>“比较 1 次”要求 X 在正中，“不用移位”要求 X 在末尾，两个最好情况不会同时出现，所以最好情况不是 Θ(1) + Θ(1)。宁可让便宜的一步（log n）付满，也要让贵的一步（n）变成 0：X 在末尾附近时合计最小（本例 140、150 都是 4），<strong>最好情况 Θ(log n)</strong>。最坏是 X 在开头，Θ(log n) + Θ(n) = Θ(n)。</p>
<p>每种情况各有一个 Θ，合起来才写 O 和 Ω。有序数组的 find 最好 Θ(1)（第一次就比中），平均、最坏 Θ(log n)，所以 find 是 O(log n)、Ω(1)，<strong>不说情况就写“二分查找是 Θ(log n)”是错的</strong>。表中的代价都按这个办法求出，默认以下假设：</p>
<div class="callout note" data-label="注意">
<ul>
<li>无序结构的 insert 不检查重复键：数组追加在末尾，链表插在表头，拉链法插在链头，所以是 O(1)。要求先查重时，insert 的代价等于一次 find 再加 O(1)。</li>
<li>delete 按键删除，代价包括先找到它。</li>
<li>build 指从空字典开始逐个 insert n 次。若允许拿全部数据直接建，有序数组可以先排序，O(n log n)。</li>
<li>数组容量够用。动态数组满了就翻倍，单次追加最坏 O(n)，均摊（amortised）O(1)（见 2.6）。</li>
<li>哈希表有 n 个键、m 个槽，装载因子（load factor）α = n/m。“平均”假设哈希函数把键均匀打散，而且 m 随 n 增大，α 保持在一个常数以下。</li>
</ul>
</div>

<h2>字典：最坏情况</h2>
<table>
<thead><tr><th>实现</th><th>find</th><th>insert</th><th>delete</th><th>build（n 次 insert）</th><th>空间</th></tr></thead>
<tbody>
<tr><td>无序数组</td><td>O(n)</td><td>O(1)</td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>有序数组</td><td><strong>O(log n)</strong></td><td>O(n)</td><td>O(n)</td><td><strong>O(n²)</strong></td><td>O(n)</td></tr>
<tr><td>无序链表</td><td>O(n)</td><td>O(1)</td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>有序链表</td><td>O(n)</td><td>O(n)</td><td>O(n)</td><td>O(n²)</td><td>O(n)</td></tr>
<tr><td>BST</td><td><strong>O(n)</strong></td><td>O(n)</td><td>O(n)</td><td>O(n²)</td><td>O(n)</td></tr>
<tr><td>AVL 树</td><td>O(log n)</td><td>O(log n)</td><td>O(log n)</td><td>O(n log n)</td><td>O(n)</td></tr>
<tr><td>2-3 树 / B 树</td><td>O(log n)</td><td>O(log n)</td><td>O(log n)</td><td>O(n log n)</td><td>O(n)</td></tr>
<tr><td>哈希表：拉链法</td><td><strong>O(n)</strong></td><td>O(1)</td><td>O(n)</td><td>O(n)</td><td>O(m + n)</td></tr>
<tr><td>哈希表：开放寻址</td><td>O(n)</td><td>O(n)</td><td>O(n)</td><td>O(n²)</td><td>O(m)，m &gt; n</td></tr>
</tbody>
</table>
<ul>
<li><strong>二叉搜索树（Binary Search Tree, BST）最坏 O(n)</strong>：键按升序插入就退化成一条链。题目只说“BST”就答 O(n)，写明平衡（balanced）才答 O(log n)。</li>
<li><strong>B 树不改变复杂度类</strong>：m 阶 B 树（B-tree）约 log<sub>m</sub> n 层，与 log₂ n 只差常数倍，结点内还要比较，仍是 O(log n)；省下的是读磁盘块、跟指针的次数（见 3.8）。2-3 树就是 3 阶 B 树。两者的删除课上没有展开，代价同样受树高限制。</li>
<li><strong>哈希表的 O(1) 只是平均</strong>：所有键落进同一个槽时，拉链法（separate chaining）的链长为 n，开放寻址（open addressing）要探过整段被占的格子，查找都是 O(n)。往已有 m − 1 个键的表再插一个：拉链法头插 O(1)；线性探测（linear probing）最坏要探过 m − 1 个格子，O(m)。拉链法的桶改用平衡 BST，查找最坏降到 O(log n)。</li>
<li><strong>哈希表的局限是空间和顺序</strong>：槽数要多于键数（开放寻址）或与键数同阶（拉链法），空槽也占内存；键在表里是打乱的，按顺序输出、找最小、范围查询都只能扫完 m 个槽再排序。需要按顺序走时用 AVL 树或 B 树，8.1 订单簿存价位就是这个原因。</li>
<li>伸展树（splay tree，见 3.9）单次操作最坏 O(n)，但任意 m 次操作合计 O(m log n)，均摊 O(log n)。</li>
</ul>

<h2>字典：最好与平均情况</h2>
<table>
<thead><tr><th>实现</th><th>find（最好 / 平均）</th><th>insert</th><th>delete</th><th>build</th></tr></thead>
<tbody>
<tr><td>无序数组</td><td>Θ(1) / Θ(n)</td><td>Θ(1) / Θ(1)</td><td>Θ(1) / Θ(n)</td><td>Θ(n) / Θ(n)</td></tr>
<tr><td>有序数组</td><td>Θ(1) / Θ(log n)</td><td><strong>Θ(log n)</strong> / Θ(n)</td><td>Θ(log n) / Θ(n)</td><td>Θ(n log n) / Θ(n²)</td></tr>
<tr><td>无序链表</td><td>Θ(1) / Θ(n)</td><td>Θ(1) / Θ(1)</td><td>Θ(1) / Θ(n)</td><td>Θ(n) / Θ(n)</td></tr>
<tr><td>有序链表</td><td>Θ(1) / Θ(n)</td><td><strong>Θ(1)</strong> / Θ(n)</td><td>Θ(1) / Θ(n)</td><td>Θ(n) / Θ(n²)</td></tr>
<tr><td>BST</td><td>Θ(1) / Θ(log n)</td><td>Θ(1) / Θ(log n)</td><td>Θ(1) / Θ(log n)</td><td>Θ(n log n) / Θ(n log n)</td></tr>
<tr><td>AVL 树</td><td>Θ(1) / Θ(log n)</td><td>Θ(log n) / Θ(log n)</td><td>Θ(log n) / Θ(log n)</td><td>Θ(n log n) / Θ(n log n)</td></tr>
<tr><td>2-3 树 / B 树</td><td>Θ(1) / Θ(log n)</td><td>Θ(log n) / Θ(log n)</td><td>Θ(log n) / Θ(log n)</td><td>Θ(n log n) / Θ(n log n)</td></tr>
<tr><td>哈希表：拉链法</td><td>Θ(1) / Θ(1 + α)</td><td>Θ(1) / Θ(1)</td><td>Θ(1) / Θ(1 + α)</td><td>Θ(n) / Θ(n)</td></tr>
<tr><td>哈希表：开放寻址</td><td>Θ(1) / Θ(1)</td><td>Θ(1) / Θ(1)</td><td>Θ(1) / Θ(1)</td><td>Θ(n) / Θ(n)</td></tr>
</tbody>
</table>
<ul>
<li><strong>有序数组 insert、delete 最好 Θ(log n)</strong>，理由同前面在 X 后插入的例子：最好情况在末尾。链表正好相反，最好情况在表头，定位 1 步、改指针 Θ(1)。所以“在 X 后面插入”这道题，有序数组最好 Θ(log n)，链表最好 Θ(1)。</li>
<li>无序数组按键删除：找到后把末尾元素搬进空位，最好 Θ(1)。若要保持原顺序而移位，比较 k + 1 次再移 n − 1 − k 个，合计恒为 n，Θ(n)。</li>
<li>BST 的最好情况：要找的键就在根上；树是一条链时，在根旁边插入或删掉根也只要常数步。平均 Θ(log n) 指键按随机顺序插入。</li>
<li>AVL 树、2-3 树的 insert、delete 最好也是 Θ(log n)：插入要一直走到空位或叶子（2-3 树的叶子全在同一层，AVL 树最浅的空位也至少在约一半树高处），删除要走到叶子或后继，之后还要沿路径往回更新高度、旋转或分裂。</li>
<li>build 的最好情况看到达顺序：有序数组在键升序到达时从不移位，只剩 n 次二分，Θ(n log n)；升序的有序链表在键降序到达时每次插在表头，Θ(n)；BST 无论什么顺序都是 Ω(n log n)，因为 n 个结点的深度之和至少是这个量级。</li>
<li>开放寻址的平均探测次数就是公式表上的插入估计：双重哈希（double hashing）1/(1 − α)，线性探测 1/(1 − α)²。α = 0.5 时为 2 和 4，α = 0.9 时为 10 和 100，α 固定时都是常数。拉链法平均比较约 1 + α 次，α 可以大于 1。</li>
</ul>

<h2>栈与队列</h2>
<p>期末复习按队头放在哪一端区分：数组 <strong>forward</strong> 指队头在数组开头，<strong>backward</strong> 指队头在数组末尾；链表的 forward / backward 指队头在表头还是表尾。判断只看一条：“进”和“出”各发生在哪一端，那一端在数组里要不要移位，在单向链表里要不要找前驱。</p>
<table>
<thead><tr><th>队列的实现</th><th>enqueue</th><th>dequeue</th><th>原因</th></tr></thead>
<tbody>
<tr><td>数组 forward（队头在下标 0）</td><td>O(1)</td><td>O(n)</td><td>出队后其余元素左移</td></tr>
<tr><td>数组 backward（队头在末尾）</td><td>O(n)</td><td>O(1)</td><td>入队插到下标 0，整体右移</td></tr>
<tr><td><strong>循环数组</strong></td><td><strong>O(1)</strong></td><td><strong>O(1)</strong></td><td>head、tail 取模前进</td></tr>
<tr><td><strong>链表 forward，有 tail</strong></td><td><strong>O(1)</strong></td><td><strong>O(1)</strong></td><td>表尾进、表头出</td></tr>
<tr><td>链表 forward，没有 tail</td><td>O(n)</td><td>O(1)</td><td>入队先走到表尾</td></tr>
<tr><td>单向链表 backward</td><td>O(1)</td><td>O(n)</td><td>表头进、表尾出，删尾要找前驱</td></tr>
<tr><td>双向链表 backward</td><td>O(1)</td><td>O(1)</td><td>前驱就是 prev</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>栈的实现</th><th>push</th><th>pop</th><th>原因</th></tr></thead>
<tbody>
<tr><td><strong>数组，栈顶在末尾</strong></td><td><strong>O(1)</strong></td><td><strong>O(1)</strong></td><td>只动 a[n−1]</td></tr>
<tr><td>数组，栈顶在下标 0</td><td>O(n)</td><td>O(n)</td><td>每次整体移位</td></tr>
<tr><td><strong>链表，栈顶在表头</strong></td><td><strong>O(1)</strong></td><td><strong>O(1)</strong></td><td>头插、删表头</td></tr>
<tr><td>单向链表，栈顶在表尾（有 tail）</td><td>O(1)</td><td>O(n)</td><td>删尾要找前驱</td></tr>
</tbody>
</table>
<ul>
<li>数组 forward 若用下标 head 记队头、出队只把 head 加 1，两个操作都是 O(1)，但前面的空位从此作废；循环数组（circular array）把它们重新用上。循环数组只看 head == tail 分不清满和空，要另存 count 或永远留一个空位（见 2.7）。</li>
<li><strong>单向链表有 tail 指针也不能 O(1) 删尾</strong>，缺的是尾结点的前驱。</li>
<li>peek / top 只读“出”的那一端，表中进出都是 O(1) 的实现，peek 也是 O(1)。空间都是 O(n)，定长数组按容量算。</li>
</ul>

<h2>优先队列</h2>
<table>
<thead><tr><th>实现</th><th>insert</th><th>extractMax</th><th>peek</th></tr></thead>
<tbody>
<tr><td>无序数组 / 无序链表</td><td>O(1)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>有序数组，升序（最大在末尾）</td><td>O(n)</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td>有序数组，降序（最大在下标 0）</td><td>O(n)</td><td>O(n)</td><td>O(1)</td></tr>
<tr><td>有序链表，降序（最大在表头）</td><td>O(n)</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td><strong>二叉堆（max-heap）</strong></td><td><strong>O(log n)</strong></td><td><strong>O(log n)</strong></td><td><strong>O(1)</strong></td></tr>
<tr><td>平衡 BST（AVL）</td><td>O(log n)</td><td>O(log n)</td><td>O(log n)</td></tr>
</tbody>
</table>
<ul>
<li>二叉堆（binary heap）：insert 最好 Θ(1)（新键不大于父结点），extractMax 最坏 O(log n)；<strong>O(1) 的是 peek，不是 extractMax</strong>。</li>
<li>建堆：自底向上 Θ(n)；逐个插入最坏 Θ(n log n)（升序输入），最好 Θ(n)（降序输入）。</li>
<li>堆里找任意元素是 O(n)，兄弟之间没有顺序；changeWeight、删除任意元素要配一张“元素 → 下标”表，才是 O(log n)（见 6.5）。</li>
<li>堆只能直接看到最大值，不能按大小顺序遍历；要逐个看次大、再次大时用平衡 BST。</li>
<li>先 n 次 insert 再 n 次 extractMax：无序数组、有序数组、堆分别相当于选择排序、插入排序、堆排序，最坏 Θ(n²)、Θ(n²)、O(n log n)。Dijkstra、Prim 换 PQ 后的总复杂度见 8.3。</li>
</ul>

<h2>堆的下标公式</h2>
<table>
<thead><tr><th></th><th>根在下标 1（本课）</th><th>根在下标 0</th></tr></thead>
<tbody>
<tr><td>左孩子</td><td><strong>2i</strong></td><td>2i + 1</td></tr>
<tr><td>右孩子</td><td><strong>2i + 1</strong></td><td>2i + 2</td></tr>
<tr><td>父结点</td><td><strong>⌊i/2⌋</strong></td><td>⌊(i − 1)/2⌋</td></tr>
<tr><td>最后一个父结点</td><td>⌊n/2⌋</td><td>⌊n/2⌋ − 1</td></tr>
<tr><td>叶子</td><td>⌊n/2⌋ + 1 … n</td><td>⌊n/2⌋ … n − 1</td></tr>
<tr><td>d 叉堆：i 的孩子</td><td>d·i − d + 2 … d·i + 1</td><td>d·i + 1 … d·i + d</td></tr>
<tr><td>d 叉堆：i 的父结点</td><td>⌊(i + d − 2)/d⌋</td><td>⌊(i − 1)/d⌋</td></tr>
</tbody>
</table>
<pre><code>/* max-heap in H[1..n]; H[0] unused (course convention) */
#define PARENT(i) ((i) / 2)
#define LEFT(i)   (2 * (i))
#define RIGHT(i)  (2 * (i) + 1)
/* i is a leaf  &lt;=&gt;  LEFT(i) &gt; n  &lt;=&gt;  i &gt; n / 2 */</code></pre>
<p>n 个结点的堆有 ⌊log₂ n⌋ + 1 层（n = 10 时 4 层），sift up、sift down 最多交换 ⌊log₂ n⌋ 次，O(log n) 就从这里来。宏的参数必须加括号：写成 <code>2 * i</code> 时，<code>LEFT(k + 1)</code> 展开成 <code>2 * k + 1</code>，算错。d 叉堆的公式靠“前面 i 个结点的孩子已占掉 d·i 个位置”现场推，答题时写明根在 0 还是 1。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>一分题，“给出最紧的 Big-O 上界”</strong>：2015、2016 年卷的复杂度题就是逐格问这些表，例如往无序链表或有序链表插一项、在完美平衡的三叉树里查找、往已有 m − 1 项的拉链法哈希表再插一项、桶是平衡 BST 时查找。只看答案，Canvas 自动判分。</li>
<li><strong>“哪个说法错误 / 必然正确”</strong>：考 Θ 与情况的关系（二分查找不是 Θ(log n)），以及缺前提的说法（“BST 查找 O(log n)”）。</li>
<li><strong>最好情况</strong>：在 X 后插入、有序数组插入、逐个插入建有序结构。对同一个输入把两步相加。</li>
<li><strong>匹配</strong>：实现 ↔ 代价，ADT ↔ 实现（优先队列是 ADT，堆是实现它的具体结构）。</li>
<li><strong>设计题</strong>：从场景需要的操作反推结构。只有查找、插入、删除，用哈希表；还要按顺序遍历、找最值或范围查询，用平衡树；只反复取最大，用堆。</li>
</ul>
<p>公式表上只有对数恒等式、等差与等比数列求和、主定理和两个哈希估计 1/(1 − α)、1/(1 − α)²，这几张表都要记住。记不清时按“定位 + 修改”现场推一遍。最常见的错：把 peek 的 O(1) 当成 extractMax 的；把哈希表的平均 O(1) 当成最坏；在还没找到位置时就说“链表插入 O(1)”。</p>

<h2>练习</h2>

<details class="qa">
<summary class="ripple-surface">1. 每空给出最紧的 Big-O 上界：(a) 往有 n 项的有序链表插入一项；(b) 在有 n 项、完美平衡的三叉树（每个结点至多 3 个孩子）中查找；(c) 大小为 m、已有 m − 1 项的哈希表再插入一项，冲突用拉链法解决；改用线性探测呢？(d) n 项、m 个槽的哈希表，每个槽挂一棵平衡 BST 而不是链表，查找的最坏情况；(e) 在有 n 个元素的二叉最大堆里找最小值。</summary>
<div class="qa__body">
<p>(a) <strong>O(n)</strong>：先从表头走到插入位置，最坏走完整个表，接上结点 O(1)。</p>
<p>(b) <strong>O(log n)</strong>：完美平衡时约 log₃ n = log₂ n / log₂ 3 层，与 log₂ n 只差常数倍；每个结点内比较次数是常数。</p>
<p>(c) 拉链法 <strong>O(1)</strong>：算出槽号后插在链头，不查重，与链长无关。线性探测 <strong>O(m)</strong>：最坏时起始槽往后的 m − 1 个格子全被占，要一路探到唯一的空格。</p>
<p>(d) <strong>O(log n)</strong>：最坏是 n 个键全落进同一个槽，那棵平衡 BST 有 n 个结点，查找 O(log n)。</p>
<p>(e) <strong>O(n)</strong>：最大堆只保证父 ≥ 子，最小值可能在任何一个叶子上，叶子有 ⌈n/2⌉ 个（下标 ⌊n/2⌋ + 1 … n），都要看一遍，Θ(n)。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 多选：哪些说法正确？(A) 有序数组上的 find 是 Θ(log n)；(B) 在 BST 中查找的时间复杂度是 O(log n)；(C) 有序数组 insert 的最好情况是 Θ(log n)；(D) 把 AVL 树换成 B 树，查找的最坏情况降到更低的复杂度类；(E) 用带 head、tail 指针的单向链表实现队列，表尾入队、表头出队，两个操作都是 O(1)；(F) 二叉堆的 extractMax 是 O(1)；(G) 哈希表查找最坏 O(1)；(H) 逐个插入建立升序链表，最好情况是 Θ(n)。</summary>
<div class="qa__body">
<p><strong>C、E、H。</strong></p>
<ul>
<li>A 错：第一次就比中时是 Θ(1)，应说 O(log n)，或说最坏 Θ(log n)。</li>
<li>B 错：没说平衡，退化成链时是 O(n)。</li>
<li>C 对：新键比所有键都大时不用移位，但二分要约 log₂ n 次才走到末尾。</li>
<li>D 错：B 树的层数 log<sub>m</sub> n 与 log₂ n 只差常数倍，仍是 O(log n)。</li>
<li>E 对：tail 指针让表尾接结点 O(1)，删表头只改 head。</li>
<li>F 错：extractMax 要 sift down，O(log n)；O(1) 的是 peek。</li>
<li>G 错：平均 O(1)，所有键进同一个槽时 O(n)。</li>
<li>H 对：键降序到达时，每个新键都是当前最小，插在表头，比较 1 次。</li>
</ul>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 键 1, 2, …, n 按升序逐个插入空字典，然后每个键各 find 一次。分别用无序数组、有序数组、普通 BST、AVL 树、拉链法哈希表（m 与 n 同阶），总代价各是多少？n = 1000 时，BST 和 AVL 树各比较多少次（每经过一个结点算 1 次）？</summary>
<div class="qa__body">
<ul>
<li><strong>无序数组 Θ(n²)</strong>：n 次追加 Θ(n)；键 i 在下标 i − 1，find 比较 i 次，合计 1 + 2 + … + n = n(n + 1)/2。</li>
<li><strong>有序数组 Θ(n log n)</strong>：升序到达，每次都插在末尾，二分 Θ(log n)、不移位；每次 find O(log n)。n = 1000 时插入比较 7987 次、移位 0 次，find 比较 8987 次。</li>
<li><strong>BST Θ(n²)</strong>：退化成向右的链。插入第 i 个键比较 i − 1 次，合计 n(n − 1)/2；find 键 i 比较 i 次，合计 n(n + 1)/2；总共正好 n² 次。n = 1000 时 10⁶ 次。</li>
<li><strong>AVL 树 Θ(n log n)</strong>：旋转使树高保持 O(log n)，n = 1000 时树高 10。插入比较 8977 次、find 8987 次，合计 17964 次，约为 BST 的 1/56。</li>
<li><strong>哈希表平均 Θ(n)</strong>：每次插入、查找平均 O(1)。最坏全进一个槽：插入仍是 n × O(1)，但链头是 n、链尾是 1，find 键 i 比较 n − i + 1 次，合计 Θ(n²)。</li>
</ul>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 用数组实现队列，容量足够。从空队列开始先 enqueue n 次，再 dequeue n 次。分别用 (a) forward（队头固定在下标 0）；(b) backward（队头在末尾，新元素插到下标 0）；(c) 循环数组。各要移动元素多少次？总代价是多少？</summary>
<div class="qa__body">
<p>(a) enqueue 写到末尾，不移位。第 i 次 dequeue 时队里还有 n − i + 1 个元素，取走 a[0] 后其余 n − i 个左移一格，合计 (n − 1) + (n − 2) + … + 0 = <strong>n(n − 1)/2</strong>，总代价 <strong>Θ(n²)</strong>。</p>
<p>(b) 第 i 次 enqueue 时已有 i − 1 个元素，全部右移一格再写入 a[0]，合计 0 + 1 + … + (n − 1) = <strong>n(n − 1)/2</strong>；dequeue 取最后一格，O(1)。总代价 <strong>Θ(n²)</strong>。</p>
<p>(c) 只移动 head、tail 两个下标，<strong>0 次</strong>移位，2n 次操作各 O(1)，总代价 <strong>Θ(n)</strong>。</p>
<p>n = 4 时 (a)、(b) 各移动 6 次。forward 和 backward 只是把 O(n) 从一个操作挪到了另一个操作。</p>
</div>
</details>
`;
